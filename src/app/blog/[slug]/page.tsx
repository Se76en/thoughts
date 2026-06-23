import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost } from "@/lib/posts";
import { TextReveal } from "@/components/animations/TextReveal";
import { CommentSection } from "@/components/ui/comment-section";
import { tagStyle } from "@/lib/tag-colors";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="pt-24 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href="/blog"
          className="mb-8 inline-flex text-sm text-foreground/60 transition-colors hover:text-foreground"
        >
          ← Back to blog
        </Link>

        {post.image && (
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={post.image}
              alt=""
              className="w-full aspect-[16/9] object-cover"
              loading="eager"
            />
          </div>
        )}

        <TextReveal as="h1" className="mb-4 text-4xl font-semibold tracking-tight sm:text-5xl text-balance">
          {post.title}
        </TextReveal>

        {post.tags && post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => {
              const c = tagStyle(tag);
              return (
                <span
                  key={tag}
                  className="rounded-full border px-3 py-1 text-xs font-medium select-none"
                  style={{ background: c.bg, color: c.text, borderColor: c.border }}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        )}
        <time className="mb-12 block text-sm text-muted-foreground/60">{post.date}</time>

        <div className="prose prose-invert prose-accent max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        <CommentSection postSlug={slug} />
      </div>
    </article>
  );
}

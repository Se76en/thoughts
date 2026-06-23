import Link from "next/link";
import type { Post } from "@/lib/posts";
import { TiltCard } from "@/components/ui/TiltCard";
import { tagStyle } from "@/lib/tag-colors";

interface BlogCardProps {
  post: Post;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <TiltCard className="rounded-xl border border-border bg-surface transition-colors duration-200 hover:border-accent/30 hover:bg-surface-elevated">
      <Link
        href={`/blog/${post.slug}`}
        className="group block rounded-xl overflow-hidden"
      >
        {post.image ? (
          <div className="relative aspect-[16/9] overflow-hidden bg-surface-elevated">
            <img
              src={post.image}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface to-transparent" />
          </div>
        ) : (
          <div className="px-6 pt-6">
            <div className="mb-3 h-1 w-12 rounded-full bg-accent transition-all duration-300 group-hover:w-20" />
          </div>
        )}

        <div className={post.image ? "p-6" : "px-6 pb-6"}>
          {post.image ? (
            <div className="mb-3 h-1 w-12 rounded-full bg-accent transition-all duration-300 group-hover:w-20" />
          ) : null}

          <h3 className="mb-2 text-lg font-semibold text-foreground transition-colors group-hover:text-accent text-balance">
            {post.title}
          </h3>

          <p className="mb-3 line-clamp-2 text-sm text-foreground/80 text-pretty">
            {post.excerpt}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => {
                const c = tagStyle(tag);
                return (
                  <span
                    key={tag}
                    className="rounded-full border px-2 py-0.5 text-[10px] font-medium select-none"
                    style={{ background: c.bg, color: c.text, borderColor: c.border }}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          )}

          <time className="text-xs text-muted-foreground/60">{post.date}</time>
        </div>
      </Link>
    </TiltCard>
  );
}

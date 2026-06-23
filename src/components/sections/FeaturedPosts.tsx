import { getPosts } from "@/lib/posts";
import { BlogCard } from "@/components/ui/blog-card";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { FloatingParticles } from "@/components/ui/FloatingParticles";

export async function FeaturedPosts() {
  const posts = await getPosts();
  const featured = posts.slice(0, 3);

  if (featured.length === 0) {
    return (
      <section className="border-t border-border py-24 relative overflow-hidden bg-dot-accent">
        <FloatingParticles count={14} />
        <div className="mx-auto max-w-5xl px-6 text-center">
          <TextReveal as="h2" className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
            Latest Posts
          </TextReveal>
          <p className="text-foreground/80">No posts yet. Check back soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-border py-24 relative overflow-hidden bg-dot-accent">
      <FloatingParticles count={14} />
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <TextReveal as="h2" className="mb-2 text-3xl font-semibold tracking-tight sm:text-4xl text-balance">
            Latest Posts
          </TextReveal>
          <p className="mb-12 text-foreground/80">
            Recent writings and updates.
          </p>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((post, i) => (
            <ScrollReveal key={post.slug} index={i}>
              <BlogCard post={post} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

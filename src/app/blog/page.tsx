"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { BlogCard } from "@/components/ui/blog-card";
import { tagStyle } from "@/lib/tag-colors";
import type { Post } from "@/lib/posts";

const ALL_TAGS = ["physics", "mathematics", "life", "tech", "silly thoughts", "gaming"];

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      activeTag
        ? posts.filter((p) => p.tags?.includes(activeTag))
        : posts,
    [posts, activeTag]
  );

  if (loading) {
    return (
      <div className="pt-24 pb-24">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-center text-foreground/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <TextReveal as="h1" className="mb-2 text-4xl font-semibold tracking-tight sm:text-5xl text-balance">
            Blog
          </TextReveal>
          <p className="mb-8 text-foreground/80">
            Thoughts, ideas, and things I&apos;ve learned.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mb-10 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                !activeTag
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border text-foreground/60 hover:border-accent/30 hover:text-accent"
              }`}
            >
              All
            </button>
            {ALL_TAGS.map((tag) => {
              const c = tagStyle(tag);
              return (
                <button
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                    activeTag === tag
                      ? ""
                      : "border-border text-foreground/60 hover:border-accent/30 hover:text-accent"
                  }`}
                  style={
                    activeTag === tag
                      ? { background: c.bg, color: c.text, borderColor: c.border }
                      : undefined
                  }
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-foreground/80">No posts{activeTag ? ` tagged "${activeTag}"` : ""} yet.</p>
            <Link
              href="/admin"
              className="mt-4 inline-block text-sm text-accent hover:text-accent-hover"
            >
              Write the first one →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {filtered.map((post, i) => (
              <ScrollReveal key={post.slug} index={i}>
                <BlogCard post={post} />
              </ScrollReveal>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

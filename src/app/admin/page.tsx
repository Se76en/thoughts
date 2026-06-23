"use client";

import { useState, useCallback, useEffect, startTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { tagStyle } from "@/lib/tag-colors";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ALL_TAGS = ["physics", "mathematics", "life", "tech", "silly thoughts", "gaming"];

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
  tags: string[];
  published: boolean;
  image?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data);
    } catch {
      setPosts([]);
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((data) => { if (!data.authenticated) router.replace("/admin/login"); })
      .catch(() => router.replace("/admin/login"));
    startTransition(() => {
      fetchPosts();
    });
  }, [fetchPosts, router]);

  const refresh = useCallback(async () => {
    await fetchPosts();
  }, [fetchPosts]);

  const handleNew = () => {
    setTitle("");
    setSlug("");
    setExcerpt("");
    setImage("");
    setContent("");
    setTags([]);
    setEditing(true);
    setMessage("");
  };

  const handleEdit = (post: Post) => {
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt || "");
    setImage(post.image || "");
    setContent(post.content);
    setTags(post.tags || []);
    setEditing(true);
    setMessage("");
  };

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSave = async () => {
    if (!title || !content) {
      setMessage("Title and content are required.");
      return;
    }

    setLoading(true);
    const finalSlug = slug || generateSlug(title);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: finalSlug, title, excerpt, content, tags, image: image || undefined }),
    });

    if (res.ok) {
      setMessage("Post saved!");
      setEditing(false);
      refresh();
    } else {
      const err = await res.json();
      setMessage(`Error: ${err.error}`);
    }

    setLoading(false);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/posts?slug=${slug}`, { method: "DELETE" });
    refresh();
  };

  return (
    <div className="pt-24 pb-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Write</h1>
            <p className="text-sm text-muted-foreground">
              Create and manage your posts.
            </p>
          </div>
          <Button onClick={handleNew} variant="primary">
            New post
          </Button>
        </div>

        {message && (
          <div className="mb-6 rounded-lg border border-accent/20 bg-accent-muted px-4 py-3 text-sm text-accent">
            {message}
          </div>
        )}

        {editing ? (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              <Input
                label="Title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slug) setSlug(generateSlug(e.target.value));
                }}
                placeholder="Post title"
              />
              <Input
                label="Slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="post-url-slug"
              />
              <Input
                label="Excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short description for the card"
              />
              <Input
                label="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg (optional)"
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-foreground/80">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_TAGS.map((tag) => {
                    const selected = tags.includes(tag);
                    const c = tagStyle(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          setTags(
                            selected
                              ? tags.filter((t) => t !== tag)
                              : [...tags, tag]
                          )
                        }
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                          selected
                            ? ""
                            : "border-border text-foreground/60 hover:border-accent/30 hover:text-accent"
                        }`}
                        style={
                          selected
                            ? { background: c.bg, color: c.text, borderColor: c.border }
                            : undefined
                        }
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
              <MarkdownEditor
                label="Content"
                value={content}
                onChange={setContent}
                placeholder="Write your post in markdown..."
                minHeight="400px"
              />
              <div className="flex gap-3">
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </Button>
                <Button onClick={() => setEditing(false)} variant="secondary">
                  Cancel
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-6">
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                {title || "Preview"}
              </h2>
              <div className="prose prose-invert prose-accent max-w-none text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content || "*Start writing to see the preview...*"}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.length === 0 ? (
              <p className="py-12 text-center text-muted-foreground">
                No posts yet. Click &quot;New post&quot; to write your first one.
              </p>
            ) : (
              posts.map((post) => (
                <div
                  key={post.slug}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface px-5 py-4 transition-colors hover:border-border/80"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-medium text-foreground transition-colors hover:text-accent"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground/60">
                      {post.date} · {post.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <Button
                      onClick={() => handleEdit(post)}
                      variant="secondary"
                      className="px-3 py-1.5 text-xs"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(post.slug)}
                      variant="secondary"
                      className="px-3 py-1.5 text-xs text-red-400 hover:border-red-400/30 hover:text-red-400"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

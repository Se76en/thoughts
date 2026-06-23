import { getDb, ensureSchema } from "./db";
import type { InValue } from "@libsql/client";

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
  tags: string[];
  published: boolean;
  image?: string;
}

export const ALL_TAGS = ["physics", "mathematics", "life", "tech", "silly thoughts", "gaming"] as const;

const DEFAULT_POSTS: Post[] = [
  {
    slug: "hello-world",
    title: "Hello World",
    excerpt: "Welcome to my blog. This is where I'll share my thoughts.",
    date: new Date().toISOString().split("T")[0],
    content: "# Hello World\n\nWelcome to my personal blog. This is my first post.\n\nStay tuned for more content coming soon.",
    tags: ["tech"],
    published: true,
  },
];

function rowToPost(row: Record<string, unknown>): Post {
  return {
    slug: row.slug as string,
    title: row.title as string,
    excerpt: row.excerpt as string,
    date: row.date as string,
    content: row.content as string,
    tags: JSON.parse((row.tags as string) || "[]"),
    published: (row.published as number) === 1,
    image: (row.image as string) || undefined,
  };
}

function postToRow(post: Post): Record<string, InValue> {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    content: post.content,
    tags: JSON.stringify(post.tags),
    published: post.published ? 1 : 0,
    image: post.image || null,
  };
}

export async function getPosts(): Promise<Post[]> {
  await ensureSchema();
  const db = getDb();
  const result = await db.execute("SELECT * FROM posts WHERE published = 1 ORDER BY date DESC");
  if (result.rows.length === 0) {
    const all = await db.execute("SELECT COUNT(*) as cnt FROM posts");
    if (Number(all.rows[0].cnt) === 0) {
      await savePosts(DEFAULT_POSTS);
      return DEFAULT_POSTS.filter((p) => p.published);
    }
  }
  return result.rows.map(rowToPost);
}

export async function getPost(slug: string): Promise<Post | null> {
  await ensureSchema();
  const db = getDb();
  const result = await db.execute({ sql: "SELECT * FROM posts WHERE slug = ?", args: [slug] });
  if (result.rows.length === 0) return null;
  return rowToPost(result.rows[0]);
}

export async function getAllPosts(): Promise<Post[]> {
  await ensureSchema();
  const db = getDb();
  const result = await db.execute("SELECT * FROM posts ORDER BY date DESC");
  if (result.rows.length === 0) {
    await savePosts(DEFAULT_POSTS);
    return DEFAULT_POSTS;
  }
  return result.rows.map(rowToPost);
}

export async function savePosts(posts: Post[]): Promise<void> {
  await ensureSchema();
  const db = getDb();
  const tx = await db.transaction("write");
  try {
    await tx.execute("DELETE FROM posts");
    for (const post of posts) {
      const row = postToRow(post);
      await tx.execute({
        sql: `INSERT INTO posts (slug, title, excerpt, date, content, tags, published, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [row.slug, row.title, row.excerpt, row.date, row.content, row.tags, row.published, row.image] as InValue[],
      });
    }
    await tx.commit();
  } catch (e) {
    await tx.rollback();
    throw e;
  }
}

import { promises as fs } from "fs";
import path from "path";

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

const DATA_FILE = path.join(process.cwd(), "src/content/posts.json");

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

export async function getPosts(): Promise<Post[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const posts: Post[] = JSON.parse(data);
    return posts.filter((p) => p.published).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    await savePosts(DEFAULT_POSTS);
    return DEFAULT_POSTS.filter((p) => p.published);
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data).sort((a: Post, b: Post) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    await savePosts(DEFAULT_POSTS);
    return DEFAULT_POSTS;
  }
}

export async function savePosts(posts: Post[]): Promise<void> {
  const dir = path.dirname(DATA_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

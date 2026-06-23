import { promises as fs } from "fs";
import path from "path";

export interface Comment {
  id: string;
  postSlug: string;
  parentId: string | null;
  author: string;
  content: string;
  date: string;
  isAdmin?: boolean;
}

const DATA_FILE = path.join(process.cwd(), "src/content/comments.json");

export async function getComments(postSlug: string): Promise<Comment[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const all: Comment[] = JSON.parse(data);
    return all.filter((c) => c.postSlug === postSlug);
  } catch {
    return [];
  }
}

export async function addComment(comment: Comment): Promise<void> {
  let all: Comment[] = [];
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    all = JSON.parse(data);
  } catch {
    all = [];
  }
  all.push(comment);
  const dir = path.dirname(DATA_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(all, null, 2), "utf-8");
}

export async function deleteComment(id: string): Promise<void> {
  const data = await fs.readFile(DATA_FILE, "utf-8");
  const all: Comment[] = JSON.parse(data);
  const filtered = all.filter((c) => c.id !== id);
  await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), "utf-8");
}

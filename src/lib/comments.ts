import { getDb, ensureSchema } from "./db";

export interface Comment {
  id: string;
  postSlug: string;
  parentId: string | null;
  author: string;
  content: string;
  date: string;
  isAdmin?: boolean;
}

function rowToComment(row: Record<string, unknown>): Comment {
  return {
    id: row.id as string,
    postSlug: row.postSlug as string,
    parentId: (row.parentId as string) || null,
    author: row.author as string,
    content: row.content as string,
    date: row.date as string,
    isAdmin: (row.isAdmin as number) === 1,
  };
}

export async function getComments(postSlug: string): Promise<Comment[]> {
  await ensureSchema();
  const db = getDb();
  const result = await db.execute({ sql: "SELECT * FROM comments WHERE postSlug = ? ORDER BY date", args: [postSlug] });
  return result.rows.map(rowToComment);
}

export async function addComment(comment: Comment): Promise<void> {
  await ensureSchema();
  const db = getDb();
  await db.execute({
    sql: `INSERT INTO comments (id, postSlug, parentId, author, content, date, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      comment.id,
      comment.postSlug,
      comment.parentId || null,
      comment.author,
      comment.content,
      comment.date,
      comment.isAdmin ? 1 : 0,
    ],
  });
}

export async function deleteComment(id: string): Promise<void> {
  await ensureSchema();
  const db = getDb();
  await db.execute({ sql: "DELETE FROM comments WHERE id = ?", args: [id] });
}

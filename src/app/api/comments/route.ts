import { NextRequest } from "next/server";
import { getComments, addComment, deleteComment, Comment } from "@/lib/comments";
import { verifySession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postSlug = searchParams.get("postSlug");

  if (!postSlug) {
    return Response.json({ error: "Missing postSlug" }, { status: 400 });
  }

  const comments = await getComments(postSlug);
  return Response.json(comments);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { postSlug, author, content, parentId } = body;

  if (!postSlug || !author || !content) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const trimmedAuthor = author.trim().replace(/<[^>]*>/g, "");
  const trimmedContent = content.trim().replace(/<[^>]*>/g, "");

  if (trimmedAuthor.length > 60 || trimmedContent.length > 2000) {
    return Response.json({ error: "Field too long" }, { status: 400 });
  }

  const session = request.cookies.get("admin_session");
  const isAdmin = !!(session && verifySession(session.value));

  const comment: Comment = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    postSlug,
    parentId: parentId || null,
    author: trimmedAuthor,
    content: trimmedContent,
    date: new Date().toISOString().split("T")[0],
    isAdmin,
  };

  await addComment(comment);
  return Response.json(comment);
}

export async function DELETE(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  if (!session || !verifySession(session.value)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return Response.json({ error: "Missing id" }, { status: 400 });
  }

  await deleteComment(id);
  return Response.json({ success: true });
}

import { NextRequest } from "next/server";
import { getPosts, getPost, savePosts, getAllPosts, Post } from "@/lib/posts";
import { verifySession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const post = await getPost(slug);
    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }
    return Response.json(post);
  }

  const posts = await getPosts();
  return Response.json(posts);
}

export async function POST(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  if (!session || !verifySession(session.value)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { slug, title, excerpt, content, tags, image } = body;

  if (!slug || !title || !content) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (title.length > 200 || (excerpt && excerpt.length > 300) || content.length > 50000) {
    return Response.json({ error: "Field too long" }, { status: 400 });
  }

  if (image && !/^https?:\/\/.+/.test(image)) {
    return Response.json({ error: "Invalid image URL" }, { status: 400 });
  }

  const sanitizedTitle = title.replace(/<[^>]*>/g, "");
  const sanitizedExcerpt = excerpt ? excerpt.replace(/<[^>]*>/g, "") : "";

  const existing = await getPost(slug);
  const date = existing?.date ?? new Date().toISOString().split("T")[0];

  const post: Post = {
    slug,
    title: sanitizedTitle,
    excerpt: sanitizedExcerpt || content.slice(0, 160).replace(/[#*`]/g, ""),
    date,
    content,
    tags: tags || [],
    published: true,
    image: image || undefined,
  };

  const all = await getAllPosts();
  const idx = all.findIndex((p) => p.slug === slug);

  if (idx >= 0) {
    all[idx] = post;
  } else {
    all.push(post);
  }

  await savePosts(all);
  return Response.json(post);
}

export async function DELETE(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  if (!session || !verifySession(session.value)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return Response.json({ error: "Missing slug" }, { status: 400 });
  }

  const all = await getAllPosts();
  const filtered = all.filter((p) => p.slug !== slug);
  await savePosts(filtered);

  return Response.json({ success: true });
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Comment } from "@/lib/comments";

interface CommentSectionProps {
  postSlug: string;
}

function CommentCard({
  comment,
  onReply,
  onDelete,
  isAdminUser,
}: {
  comment: Comment;
  onReply: (parentId: string, parentAuthor: string) => void;
  onDelete: (id: string) => void;
  isAdminUser: boolean;
}) {
  return (
    <div className="group rounded-lg border border-border bg-surface/50 px-5 py-4">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">{comment.author}</span>
        {comment.isAdmin && (
          <span className="rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider select-none"
            style={{ background: "hsla(160, 50%, 55%, 0.15)", color: "hsla(160, 55%, 65%, 0.9)" }}
          >
            Author
          </span>
        )}
        <span className="text-xs text-foreground/40 ml-auto">{comment.date}</span>
        {isAdminUser && (
          <button
            onClick={() => onDelete(comment.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-foreground/30 hover:text-red-400 text-xs"
            title="Delete comment"
          >
            ✕
          </button>
        )}
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed">{comment.content}</p>
      <button
        onClick={() => onReply(comment.id, comment.author)}
        className="mt-2 text-xs text-foreground/40 transition-colors hover:text-accent"
      >
        Reply
      </button>
    </div>
  );
}

function Thread({
  comment,
  allReplies,
  depth = 0,
  onReply,
  onDelete,
  isAdminUser,
}: {
  comment: Comment;
  allReplies: Comment[];
  depth?: number;
  onReply: (parentId: string, parentAuthor: string) => void;
  onDelete: (id: string) => void;
  isAdminUser: boolean;
}) {
  const directReplies = allReplies.filter((r) => r.parentId === comment.id);
  const [open, setOpen] = useState(depth < 1);

  if (directReplies.length === 0) {
    return (
      <div className={depth > 0 ? "border-l border-border pl-4 ml-4" : ""}>
        <CommentCard comment={comment} onReply={onReply} onDelete={onDelete} isAdminUser={isAdminUser} />
      </div>
    );
  }

  return (
    <div>
      <div className={depth > 0 ? "border-l border-border pl-4 ml-4" : ""}>
        <CommentCard comment={comment} onReply={onReply} onDelete={onDelete} isAdminUser={isAdminUser} />
      </div>
      <div className={depth > 0 ? "ml-4" : ""}>
        <button
          onClick={() => setOpen(!open)}
          className="mt-1 mb-2 ml-5 flex items-center gap-1.5 text-xs text-foreground/40 transition-colors hover:text-accent"
        >
          <motion.span
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.15 }}
            className="inline-block"
          >
            ▸
          </motion.span>
          {open ? "Hide replies" : `${directReplies.length} ${directReplies.length === 1 ? "reply" : "replies"}`}
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pb-1">
                {directReplies.map((r) => (
                  <Thread
                    key={r.id}
                    comment={r}
                    allReplies={allReplies}
                    depth={depth + 1}
                    onReply={onReply}
                    onDelete={onDelete}
                    isAdminUser={isAdminUser}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function CommentSection({ postSlug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<{ id: string; author: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleDelete = (id: string) => {
    if (!confirm("Delete this comment?")) return;
    fetch(`/api/comments?id=${id}`, { method: "DELETE" }).then(reload);
  };

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/comments?postSlug=${postSlug}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setComments(data); })
      .catch(() => { if (!cancelled) setComments([]); });
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setIsAdmin(data.authenticated); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [postSlug]);

  const reload = () => {
    fetch(`/api/comments?postSlug=${postSlug}`)
      .then((r) => r.json())
      .then((data) => setComments(data))
      .catch(() => setComments([]));
  };

  const topLevel = comments.filter((c) => !c.parentId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postSlug,
          author,
          content,
          parentId: replyingTo?.id || null,
        }),
      });
      setAuthor("");
      setContent("");
      setReplyingTo(null);
      reload();
    } catch {
      /* ignore */
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-16 border-t border-border pt-10">
      <h3 className="mb-8 text-xl font-semibold text-foreground">Comments</h3>

      {replyingTo && (
        <div className="mb-4 flex items-center gap-2 text-sm text-foreground/60">
          <span>Replying to <strong className="text-accent">{replyingTo.author}</strong></span>
          <button
            onClick={() => setReplyingTo(null)}
            className="ml-auto text-xs text-foreground/40 hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-10 space-y-4">
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 transition-colors focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts..."
          rows={3}
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 transition-colors focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
        />
        <button
          type="submit"
          disabled={submitting || !author.trim() || !content.trim()}
          className="rounded-lg bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-40"
        >
          {submitting ? "Posting..." : "Post comment"}
        </button>
      </form>

      {topLevel.length === 0 ? (
        <p className="text-sm text-foreground/50">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-5">
          {topLevel.map((c) => (
            <Thread
              key={c.id}
              comment={c}
              allReplies={comments}
              depth={0}
              onReply={(id, author) => setReplyingTo({ id, author })}
              onDelete={handleDelete}
              isAdminUser={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
}

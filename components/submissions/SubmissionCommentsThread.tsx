

"use client";

import { useEffect, useState } from "react";
import { getPusherClient } from "@/lib/pusher-client";

type Comment = {
  id: string;
  message: string;
  createdAt: string | Date;
  user: {
    name: string | null;
  };
};

export default function SubmissionCommentsThread({
  submissionId,
  initialComments = [],
}: {
  submissionId: string;
  initialComments?: Comment[];
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!submissionId) return;

    const pusher = getPusherClient();
    const channelName = `private-submission-${submissionId}`;
    const channel = pusher.subscribe(channelName);

    const handleNewComment = (comment: Comment) => {
      setComments((prev) => {
        if (prev.some((item) => item.id === comment.id)) return prev;
        return [...prev, comment];
      });
    };

    channel.bind("comment:new", handleNewComment);

    return () => {
      channel.unbind("comment:new", handleNewComment);
      pusher.unsubscribe(channelName);
    };
  }, [submissionId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      setSending(true);

      const res = await fetch("/api/submissions/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submissionId,
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        alert("Failed to send comment.");
        return;
      }

      setMessage("");
    } catch (error) {
      console.error("Comment submit error:", error);
      alert("Something went wrong while sending comment.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        Comments
      </p>

      <div className="mt-3 space-y-2">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-500">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
            >
              <p className="text-sm text-slate-700">
                <span className="font-semibold text-slate-900">
                  {comment.user.name || "User"}:
                </span>{" "}
                {comment.message}
              </p>

              <p className="mt-1 text-[11px] text-slate-400">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* <form onSubmit={handleSubmit} className="mt-3 flex gap-2"> */}
      <form onSubmit={handleSubmit} className="mt-3 flex w-full min-w-0 gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a comment..."
          className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={sending || !message.trim()}
          className="h-10 shrink-0 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
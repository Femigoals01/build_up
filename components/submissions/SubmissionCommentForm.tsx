

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SubmissionCommentForm({
  submissionId,
}: {
  submissionId: string;
}) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!comment.trim()) return;

    try {
      setLoading(true);

      await fetch("/api/submissions/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submissionId,
          message: comment.trim(),
        }),
      });

      setComment("");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
      />

      <button
        type="submit"
        disabled={loading || !comment.trim()}
        className="mt-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Comment"}
      </button>
    </form>
  );
}
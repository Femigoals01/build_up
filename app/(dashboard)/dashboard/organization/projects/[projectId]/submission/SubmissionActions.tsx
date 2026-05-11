


"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SubmissionActions({
  submissionId,
  projectId,
  volunteerId,
}: {
  submissionId: string;
  projectId: string;
  volunteerId: string;
}) {
  const router = useRouter();

  const [feedback, setFeedback] = useState("");
  const [loadingAction, setLoadingAction] = useState<
    "approve" | "reject" | null
  >(null);
  const [error, setError] = useState("");

  async function handleAction(action: "approve" | "reject") {
    setError("");

    if (action === "reject" && !feedback.trim()) {
      setError("Please add revision feedback before requesting changes.");
      return;
    }

    try {
      setLoadingAction(action);

      const res = await fetch("/api/submissions/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submissionId,
          projectId,
          volunteerId,
          action,
          feedback: feedback.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error || "Action failed.");
        return;
      }

      if (action === "approve") {
        router.push(
          data?.redirectTo ||
            `/dashboard/organization/projects/${projectId}/review?volunteerId=${volunteerId}`
        );
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Submission action error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="space-y-4 pt-2">
      <div>
        <label
          htmlFor={`feedback-${submissionId}`}
          className="mb-2 block text-sm font-semibold text-slate-800"
        >
          Revision feedback
        </label>

        <textarea
          id={`feedback-${submissionId}`}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Optional for approval. Required when requesting revision. Tell the volunteer exactly what to improve..."
          className="min-h-[110px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />

        <p className="mt-2 text-xs text-slate-500">
          If you approve, the project will be completed and the held stipend will
          be released to the volunteer wallet.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
        <strong>Payment release:</strong> Approving this work releases 82% of
        the held stipend to the volunteer wallet and keeps 18% as BuildUp’s
        platform fee.
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => handleAction("approve")}
          disabled={Boolean(loadingAction)}
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingAction === "approve"
            ? "Approving & releasing..."
            : "Approve Work & Release Payment"}
        </button>

        <button
          type="button"
          onClick={() => handleAction("reject")}
          disabled={Boolean(loadingAction)}
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingAction === "reject"
            ? "Requesting revision..."
            : "Request Revision"}
        </button>
      </div>
    </div>
  );
}
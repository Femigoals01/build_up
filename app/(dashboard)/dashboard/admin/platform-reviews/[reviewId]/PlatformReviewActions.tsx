
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PlatformReviewActions({
  reviewId,
}: {
  reviewId: string;
}) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState("");

  async function updateReview(action: "APPROVE" | "REJECT") {
    try {
      setLoadingAction(action);

      const res = await fetch("/api/admin/platform-reviews", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId,
          action,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update review.");
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoadingAction("");
    }
  }

  async function deleteReview() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review permanently?"
    );

    if (!confirmed) return;

    try {
      setLoadingAction("DELETE");

      const res = await fetch("/api/admin/platform-reviews", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete review.");
      }

      router.push("/dashboard/admin/platform-review");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoadingAction("");
    }
  }

  return (
    <div className="flex flex-wrap gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <button
        type="button"
        onClick={() => updateReview("APPROVE")}
        disabled={Boolean(loadingAction)}
        className="h-11 rounded-2xl bg-emerald-600 px-5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:opacity-60"
      >
        {loadingAction === "APPROVE" ? "Approving..." : "Approve"}
      </button>

      <button
        type="button"
        onClick={() => updateReview("REJECT")}
        disabled={Boolean(loadingAction)}
        className="h-11 rounded-2xl bg-red-600 px-5 text-sm font-black text-white transition hover:bg-red-700 disabled:opacity-60"
      >
        {loadingAction === "REJECT" ? "Rejecting..." : "Reject"}
      </button>

      <button
        type="button"
        onClick={deleteReview}
        disabled={Boolean(loadingAction)}
        className="h-11 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-slate-800 disabled:opacity-60"
      >
        {loadingAction === "DELETE" ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
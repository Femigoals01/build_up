"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CompleteProjectConfirmButton({
  projectId,
}: {
  projectId: string;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");

  async function completeProject() {
    setError("");

    if (!confirmed) {
      setError("Please confirm the checklist before completing this project.");
      return;
    }

    const sure = window.confirm(
      "Are you sure you want to mark this project as completed?"
    );

    if (!sure) return;

    try {
      setLoading(true);

      const res = await fetch(`/api/projects/${projectId}/complete`, {
        method: "POST",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error || "Failed to complete project.");
        return;
      }

      router.push(`/dashboard/organization/projects/${projectId}/review`);
      router.refresh();
    } catch (err) {
      console.error("Complete project error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-slate-50 p-5">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />

        <span className="text-sm leading-6 text-slate-600">
          I confirm that this project has been delivered, reviewed, and is ready
          to be added to the volunteer’s verified portfolio history.
        </span>
      </label>

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <button
        type="button"
        onClick={completeProject}
        disabled={loading}
        className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Completing Project..." : "Complete Project & Continue"}
      </button>
    </div>
  );
}
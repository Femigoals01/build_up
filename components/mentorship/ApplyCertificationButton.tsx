


"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ApplyCertificationButton({
  eligible,
}: {
  eligible: boolean;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function applyForCertification() {
    try {
      setLoading(true);
      setMessage("");
      setError("");

      const res = await fetch("/api/mentor-certifications", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application.");
      }

      setMessage("Certification application submitted successfully.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 space-y-3">
      <button
        type="button"
        disabled={!eligible || loading}
        onClick={applyForCertification}
        className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading
          ? "Submitting..."
          : eligible
            ? "Apply for Certification"
            : "Not Eligible Yet"}
      </button>

      {message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
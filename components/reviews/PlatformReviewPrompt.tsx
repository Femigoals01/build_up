

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PlatformReviewPrompt() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPrompt();
  }, []);

  async function checkPrompt() {
    try {
      const res = await fetch("/api/platform-reviews/prompt");

      const data = await res.json();

      if (data.showPrompt) {
        setOpen(true);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }

  async function remindLater() {
    try {
      await fetch("/api/platform-reviews/prompt", {
        method: "POST",
      });

      setOpen(false);
    } catch {
      setOpen(false);
    }
  }

  function reviewNow() {
    setOpen(false);
    router.push("/dashboard/platform-review");
  }

  if (loading || !open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-[32px] bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 px-6 py-8 text-center text-white">
          <div className="text-4xl">⭐⭐⭐⭐⭐</div>

          <h2 className="mt-4 text-2xl font-black">
            How has BuildUp been?
          </h2>

          <p className="mt-3 text-sm leading-6 text-blue-100">
            Your feedback helps us improve opportunities,
            mentorship and community experience.
          </p>
        </div>

        <div className="space-y-3 p-6">
          <button
            onClick={reviewNow}
            className="h-12 w-full rounded-2xl bg-blue-600 text-sm font-black text-white transition hover:bg-blue-700"
          >
            Rate BuildUp
          </button>

          <button
            onClick={remindLater}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            Remind Me Later
          </button>
        </div>
      </div>
    </div>
  );
}
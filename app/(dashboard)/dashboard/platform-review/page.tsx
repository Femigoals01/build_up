

"use client";

import { useState } from "react";

const RATINGS = [1, 2, 3, 4, 5];

function RatingInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-black text-slate-900">{label}</p>

      <div className="mt-3 flex gap-2">
        {RATINGS.map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`text-3xl transition ${
              rating <= value
                ? "text-amber-400"
                : "text-slate-300 hover:text-amber-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PlatformReviewPage() {
  const [easeOfUse, setEaseOfUse] = useState(0);
  const [opportunities, setOpportunities] = useState(0);
  const [communityExperience, setCommunityExperience] = useState(0);
  const [overallRating, setOverallRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submitReview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setSubmitting(true);
      setMessage("");
      setError("");

      const res = await fetch("/api/platform-reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          easeOfUse,
          opportunities,
          communityExperience,
          overallRating,
          review,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review.");
      }

      setMessage(
        data.message ||
          "Thank you. Your review has been submitted for admin approval."
      );

      setEaseOfUse(0);
      setOpportunities(0);
      setCommunityExperience(0);
      setOverallRating(0);
      setReview("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <section className="overflow-hidden rounded-[34px] border border-blue-100 bg-white shadow-xl shadow-blue-100/60">
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 px-6 py-10 text-white sm:px-8">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-100">
              BuildUp Feedback
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Rate your BuildUp experience
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
              Your feedback helps us improve the platform, opportunities,
              community experience, and overall user journey.
            </p>
          </div>

          <form onSubmit={submitReview} className="space-y-5 p-5 sm:p-8">
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

            <div className="grid gap-4 sm:grid-cols-2">
              <RatingInput
                label="Ease of Use"
                value={easeOfUse}
                onChange={setEaseOfUse}
              />

              <RatingInput
                label="Opportunities Available"
                value={opportunities}
                onChange={setOpportunities}
              />

              <RatingInput
                label="Community Experience"
                value={communityExperience}
                onChange={setCommunityExperience}
              />

              <RatingInput
                label="Overall Rating"
                value={overallRating}
                onChange={setOverallRating}
              />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <label className="text-sm font-black text-slate-900">
                Your feedback
              </label>

              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={5}
                maxLength={800}
                placeholder="Tell us what you love about BuildUp or what we can improve..."
                className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold leading-6 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs font-semibold text-slate-400">
                {review.length}/800 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={
                submitting ||
                !easeOfUse ||
                !opportunities ||
                !communityExperience ||
                !overallRating
              }
              className="h-12 w-full rounded-2xl bg-blue-600 px-6 text-sm font-black text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>

            <p className="text-center text-xs font-semibold text-slate-400">
              Reviews are checked by admin before appearing publicly.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
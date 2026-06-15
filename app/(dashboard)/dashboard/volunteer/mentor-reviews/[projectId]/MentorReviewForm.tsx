


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function RatingButtons({
  label,
  value,
  setValue,
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="font-bold text-slate-800">{label}</p>

      <div className="mt-3 flex gap-2">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => setValue(score)}
            className={`h-10 w-10 rounded-xl text-sm font-black ${
              value >= score
                ? "bg-blue-600 text-white"
                : "bg-white text-slate-500"
            }`}
          >
            {score}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function MentorReviewForm({
  projectId,
  mentorId,
  mentorName,
}: {
  projectId: string;
  mentorId: string;
  mentorName: string;
}) {
  const router = useRouter();

  const [rating, setRating] = useState(5);
  const [guidance, setGuidance] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [availability, setAvailability] = useState(5);
  const [professionalism, setProfessionalism] = useState(5);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (comment.trim().length < 20) {
      setError("Please write at least 20 characters about your mentor.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/mentor-reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mentorId,
          projectId,
          rating,
          guidance,
          communication,
          availability,
          professionalism,
          comment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit mentor review.");
        return;
      }

      router.push("/dashboard/volunteer/mentors");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      ) : null}

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
          Reviewing
        </p>

        <h2 className="mt-2 text-2xl font-black text-slate-900">
          {mentorName}
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <RatingButtons label="Overall Rating" value={rating} setValue={setRating} />
          <RatingButtons label="Guidance" value={guidance} setValue={setGuidance} />
          <RatingButtons label="Communication" value={communication} setValue={setCommunication} />
          <RatingButtons label="Availability" value={availability} setValue={setAvailability} />
          <RatingButtons label="Professionalism" value={professionalism} setValue={setProfessionalism} />
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <label className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
          Written Feedback
        </label>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={7}
          placeholder="Describe how the mentor guided you, communicated, supported your project, and helped you improve..."
          className="mt-4 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />

        <p className="mt-2 text-xs text-slate-500">
          Minimum 20 characters.
        </p>
      </section>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-6 text-sm font-black text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Mentor Review"}
      </button>
    </form>
  );
}
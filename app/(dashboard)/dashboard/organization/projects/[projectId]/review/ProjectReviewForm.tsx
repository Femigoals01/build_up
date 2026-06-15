




"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const ratingLabels: Record<number, string> = {
  1: "Needs Improvement",
  2: "Fair Effort",
  3: "Good Delivery",
  4: "Excellent Work",
  5: "Outstanding",
};

export default function ProjectReviewForm({
  projectId,
}: {
  projectId: string;
}) {
  const router = useRouter();

  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [technicalSkill, setTechnicalSkill] = useState(5);
const [communication, setCommunication] = useState(5);
const [professionalism, setProfessionalism] = useState(5);
const [timeliness, setTimeliness] = useState(5);

const [strengths, setStrengths] = useState("");
const [improvementAreas, setImprovementAreas] = useState("");




  const activeRating = hoveredRating ?? rating;

  const characterCount = comment.trim().length;

  const feedbackQuality = useMemo(() => {
    if (characterCount >= 180) return "Strong feedback";
    if (characterCount >= 80) return "Good detail";
    if (characterCount >= 1) return "Add a little more detail";
    return "No feedback yet";
  }, [characterCount]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!comment.trim()) {
      setError("Please enter a short review before submitting.");
      return;
    }

    if (comment.trim().length < 20) {
      setError("Please add a little more detail to make the review useful.");
      return;
    }

    try {
      setLoading(true);

      const finalComment = `${comment.trim()}

Recommendation: ${
        wouldRecommend
          ? "Yes, we would recommend this volunteer."
          : "Not yet, more improvement is needed."
      }`;

      const res = await fetch(`/api/projects/${projectId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({
        //   rating,
        //   comment: finalComment,
        // }),

        body: JSON.stringify({
  rating,

  technicalSkill,
  communication,
  professionalism,
  timeliness,

  strengths,
  improvementAreas,

  comment: finalComment,
}),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit review.");
        return;
      }

      router.push("/dashboard/organization");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Performance Rating
            </p>

            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              How did the volunteer perform?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your rating helps strengthen trust, visibility, and the
              volunteer’s proof-of-work profile.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-center">
            <p className="text-3xl font-black text-blue-700">{rating}.0</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-500">
              {ratingLabels[rating]}
            </p>
          </div>
        </div>

        <div
          className="mt-6 flex flex-wrap items-center gap-3"
          onMouseLeave={() => setHoveredRating(null)}
        >
          {[1, 2, 3, 4, 5].map((value) => {
            const active = value <= activeRating;

            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoveredRating(value)}
                className={`group flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl transition-all duration-200 ${
                  active
                    ? "border-amber-300 bg-amber-50 text-amber-500 shadow-sm"
                    : "border-slate-200 bg-slate-50 text-slate-300 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-400"
                }`}
                aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
              >
                <span className="transition group-hover:scale-110">★</span>
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-sm font-semibold text-slate-700">
          {ratingLabels[activeRating]}
        </p>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Written Feedback
            </p>

            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              Leave a helpful review
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Mention delivery quality, communication, creativity, reliability,
              and whether the work met expectations.
            </p>
          </div>

          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-500">
            {feedbackQuality}
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            "What impressed you most?",
            "How was communication?",
            "Would you work with them again?",
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() =>
                setComment((prev) =>
                  prev
                    ? `${prev}\n${prompt} `
                    : `${prompt} `
                )
              }
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold leading-5 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="mt-5">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[170px] w-full resize-none rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="Example: The volunteer communicated clearly, followed the project requirements, delivered on time, and showed strong attention to detail..."
          />

          <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
            <span>{characterCount} characters</span>
            <span>Minimum recommended: 20 characters</span>
          </div>
        </div>
      </section>


      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
    Professional Feedback
  </p>

  <div className="mt-5 grid gap-5 md:grid-cols-2">
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        Strengths
      </label>

      <textarea
        value={strengths}
        onChange={(e) => setStrengths(e.target.value)}
        className="min-h-[120px] w-full rounded-2xl border border-slate-200 p-4"
        placeholder="What did the volunteer do exceptionally well?"
      />
    </div>

    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        Areas for Improvement
      </label>

      <textarea
        value={improvementAreas}
        onChange={(e) => setImprovementAreas(e.target.value)}
        className="min-h-[120px] w-full rounded-2xl border border-slate-200 p-4"
        placeholder="Any areas where growth is recommended?"
      />
    </div>
  </div>
</section>



      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
    Detailed Evaluation
  </p>

  <h3 className="mt-2 text-2xl font-bold text-slate-900">
    Rate key performance areas
  </h3>

  <div className="mt-6 grid gap-4 md:grid-cols-2">
    {[
      {
        label: "Technical Skill",
        value: technicalSkill,
        setter: setTechnicalSkill,
      },
      {
        label: "Communication",
        value: communication,
        setter: setCommunication,
      },
      {
        label: "Professionalism",
        value: professionalism,
        setter: setProfessionalism,
      },
      {
        label: "Timeliness",
        value: timeliness,
        setter: setTimeliness,
      },
    ].map((item) => (
      <div
        key={item.label}
        className="rounded-2xl border border-slate-200 p-4"
      >
        <p className="font-semibold text-slate-800">
          {item.label}
        </p>

        <div className="mt-3 flex gap-2">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => item.setter(score)}
              className={`h-10 w-10 rounded-xl text-sm font-bold ${
                item.value >= score
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {score}
            </button>
          ))}
        </div>
      </div>
    ))}
  </div>
</section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
          Recommendation
        </p>

        <h3 className="mt-2 text-2xl font-bold text-slate-900">
          Would you recommend this volunteer?
        </h3>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setWouldRecommend(true)}
            className={`rounded-2xl border px-5 py-4 text-left transition ${
              wouldRecommend
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
            }`}
          >
            <p className="font-bold">Yes, recommended</p>
            <p className="mt-1 text-sm leading-6">
              This volunteer delivered value and should be trusted for future
              opportunities.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setWouldRecommend(false)}
            className={`rounded-2xl border px-5 py-4 text-left transition ${
              !wouldRecommend
                ? "border-amber-300 bg-amber-50 text-amber-800"
                : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"
            }`}
          >
            <p className="font-bold">Needs more growth</p>
            <p className="mt-1 text-sm leading-6">
              The volunteer made an effort, but more improvement is needed
              before strong recommendation.
            </p>
          </button>
        </div>
      </section>

      <div className="rounded-[28px] border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Proof-of-work impact
            </p>

            <h3 className="mt-2 text-xl font-bold text-slate-900">
              Your review becomes part of this volunteer’s credibility.
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Strong reviews help volunteers build verified proof, increase
              trust, and grow into stronger contributors.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-13 min-h-13 items-center justify-center rounded-2xl bg-blue-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Submitting Review..." : "Submit Review"}
          </button>
        </div>
      </div>
    </form>
  );
}
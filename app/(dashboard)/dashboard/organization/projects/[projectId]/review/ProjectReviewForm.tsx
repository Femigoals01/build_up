


// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function ProjectReviewForm({ projectId }: { projectId: string }) {
//   const router = useRouter();

//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setError("");

//     if (!rating || rating < 1 || rating > 5) {
//       setError("Please select a rating between 1 and 5.");
//       return;
//     }

//     if (!comment.trim()) {
//       setError("Please write a short review comment.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await fetch(`/api/projects/${projectId}/review`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           rating,
//           comment: comment.trim(),
//         }),
//       });

//       const data = await res.json().catch(() => null);

//       if (!res.ok) {
//         setError(data?.error || "Failed to submit review.");
//         return;
//       }

//       router.push("/dashboard/organization");
//       router.refresh();
//     } catch (error) {
//       console.error("Submit review error:", error);
//       setError("Something went wrong while submitting the review.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div>
//         <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
//           Leave Review
//         </p>
//         <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//           Rate the volunteer
//         </h2>
//         <p className="mt-2 text-sm leading-6 text-slate-500">
//           Your review helps the volunteer build credible proof of work on
//           BuildUp.
//         </p>
//       </div>

//       {error ? (
//         <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           {error}
//         </div>
//       ) : null}

//       <div>
//         <label className="mb-3 block text-sm font-semibold text-slate-800">
//           Rating
//         </label>

//         <div className="flex flex-wrap gap-2">
//           {[1, 2, 3, 4, 5].map((value) => (
//             <button
//               key={value}
//               type="button"
//               onClick={() => setRating(value)}
//               className={`inline-flex h-12 min-w-12 items-center justify-center rounded-2xl border px-4 text-lg font-bold transition ${
//                 rating === value
//                   ? "border-amber-300 bg-amber-50 text-amber-600 shadow-sm"
//                   : "border-slate-200 bg-white text-slate-400 hover:bg-slate-50"
//               }`}
//             >
//               ★
//             </button>
//           ))}
//         </div>

//         <p className="mt-2 text-sm font-medium text-slate-500">
//           {rating} out of 5 selected
//         </p>
//       </div>

//       <div>
//         <label
//           htmlFor="comment"
//           className="mb-2 block text-sm font-semibold text-slate-800"
//         >
//           Review Comment
//         </label>

//         <textarea
//           id="comment"
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           placeholder="Write honest feedback about the volunteer’s contribution, communication, quality of work, and reliability..."
//           className="min-h-[160px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//         />
//       </div>

//       <div className="flex flex-col gap-3 sm:flex-row">
//         <button
//           type="submit"
//           disabled={loading}
//           className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//         >
//           {loading ? "Submitting Review..." : "Submit Review"}
//         </button>

//         <button
//           type="button"
//           onClick={() => router.push("/dashboard/organization")}
//           className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// }




"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProjectReviewForm({
  projectId,
}: {
  projectId: string;
}) {
  const router = useRouter();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!comment.trim()) {
      setError("Please enter a comment");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/projects/${projectId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit review");
        return;
      }

      router.push("/dashboard/organization");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      {/* RATING */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Rating
        </label>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRating(r)}
              className={`px-3 py-2 rounded-lg border ${
                rating === r
                  ? "bg-yellow-100 border-yellow-400"
                  : "bg-white border-gray-200"
              }`}
            >
              ⭐
            </button>
          ))}
        </div>
      </div>

      {/* COMMENT */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Comment
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded-xl p-3"
          rows={5}
          placeholder="Write feedback..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
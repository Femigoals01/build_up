// "use client";

// import { useState } from "react";
// import { useRouter, useParams } from "next/navigation";

// export default function ReviewPage() {
//   const router = useRouter();
//   const params = useParams();
//   const projectId = params.id as string;

//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(false);

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const res = await fetch(`/api/projects/${projectId}/review`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ rating, comment }),
//     });

//     setLoading(false);

//     if (!res.ok) {
//       alert("Failed to submit review");
//       return;
//     }

//     router.push("/dashboard/organization");
//   };

//   return (
//     <main className="max-w-xl mx-auto py-10">
//       <h1 className="text-3xl font-bold mb-6">Leave a Review</h1>

//       <form onSubmit={submit} className="space-y-4">
//         <select
//           value={rating}
//           onChange={(e) => setRating(Number(e.target.value))}
//           className="w-full border p-3 rounded"
//         >
//           {[5, 4, 3, 2, 1].map((r) => (
//             <option key={r} value={r}>
//               {r} Stars
//             </option>
//           ))}
//         </select>

//         <textarea
//           placeholder="Write your feedback..."
//           className="w-full border p-3 rounded"
//           rows={5}
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//         />

//         <button
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-3 rounded font-semibold"
//         >
//           {loading ? "Submitting..." : "Submit Review"}
//         </button>
//       </form>
//     </main>
//   );
// }


"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ReviewPage() {
  const { id: projectId } = useParams();
  const router = useRouter();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/projects/${projectId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Failed to submit review");
      return;
    }

    alert("Review submitted successfully");
    router.push("/dashboard/organization");
  };

  return (
    <main className="max-w-xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Leave a Review</h1>

      <form onSubmit={submit} className="space-y-4">
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full border p-3 rounded"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Stars
            </option>
          ))}
        </select>

        <textarea
          placeholder="Write your feedback..."
          className="w-full border p-3 rounded"
          rows={5}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </main>
  );
}

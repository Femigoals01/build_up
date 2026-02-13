

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function CreateProjectPage() {
//   const router = useRouter();

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [difficulty, setDifficulty] = useState("BEGINNER");
//   const [skills, setSkills] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch("/api/projects", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           title,
//           description,
//           difficulty,
//           skills: skills.split(",").map((s) => s.trim()),
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Failed to create project");
//       }

//       router.push("/dashboard/organization");
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="max-w-2xl mx-auto py-10">
//       <h1 className="text-3xl font-bold mb-6">Post a Project</h1>

//       <form onSubmit={submit} className="space-y-4">
//         <input
//           placeholder="Project title"
//           className="w-full border p-3 rounded"
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />

//         <textarea
//           placeholder="Project description"
//           className="w-full border p-3 rounded"
//           rows={5}
//           onChange={(e) => setDescription(e.target.value)}
//           required
//         />

//         <select
//           className="w-full border p-3 rounded"
//           value={difficulty}
//           onChange={(e) => setDifficulty(e.target.value)}
//         >
//           <option value="BEGINNER">Beginner</option>
//           <option value="INTERMEDIATE">Intermediate</option>
//           <option value="ADVANCED">Advanced</option>
//         </select>

//         <input
//           placeholder="Skills (comma separated)"
//           className="w-full border p-3 rounded"
//           onChange={(e) => setSkills(e.target.value)}
//         />

//         {error && (
//           <p className="text-red-600 text-sm">{error}</p>
//         )}

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
//         >
//           {loading ? "Publishing..." : "Publish Project"}
//         </button>
//       </form>
//     </main>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export default function CreateProjectPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("BEGINNER");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= ROLE GUARD ================= */
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (session.user.role !== "ORGANIZATION") {
      router.push("/dashboard/volunteer");
    }
  }, [session, status, router]);

  /* ================= SUBMIT ================= */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          difficulty,
          skills: skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });

      // ✅ Prevent JSON crash
      let data: any = null;
      const contentType = res.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to create project");
      }

      router.push("/dashboard/organization");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  if (status === "loading") {
    return (
      <p className="text-center py-20 text-gray-600">
        Checking permissions...
      </p>
    );
  }

  return (
    <main className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Post a Project</h1>

      <form onSubmit={submit} className="space-y-4">
        <input
          placeholder="Project title"
          className="w-full border p-3 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Project description"
          className="w-full border p-3 rounded"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <select
          className="w-full border p-3 rounded"
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value as Difficulty)
          }
        >
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>

        <input
          placeholder="Skills (comma separated)"
          className="w-full border p-3 rounded"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Publish Project"}
        </button>
      </form>
    </main>
  );
}

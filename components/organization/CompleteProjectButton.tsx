


// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function CompleteProjectButton({
//   projectId,
// }: {
//   projectId: string;
// }) {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   const completeProject = async () => {
//     setLoading(true);

//     const res = await fetch(`/api/projects/${projectId}/complete`, {
//       method: "POST",
//     });

//     if (res.ok) {
//       // ✅ Refresh dashboard data
//       router.refresh();
//       alert("Project marked as completed. You can now leave a review.");
//     } else {
//       alert("Failed to complete project");
//     }

//     setLoading(false);
//   };

//   return (
//     <button
//       onClick={completeProject}
//       disabled={loading}
//       className="mt-4 px-5 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
//     >
//       {loading ? "Completing..." : "Mark Project Completed"}
//     </button>
//   );
// }




// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function CompleteProjectButton({
//   projectId,
// }: {
//   projectId: string;
// }) {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   async function goToCompletionFlow() {
//     try {
//       setLoading(true);

//       router.push(
//         `/dashboard/organization/projects/${projectId}/complete`
//       );
//     } catch (error) {
//       console.error("Navigation error:", error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <button
//       type="button"
//       onClick={goToCompletionFlow}
//       disabled={loading}
//       className="mt-4 inline-flex h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:scale-[1.02] hover:from-purple-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
//     >
//       {loading ? "Opening..." : "Complete Project"}
//     </button>
//   );
// }





"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CompleteProjectButton({
  projectId,
}: {
  projectId: string;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleCompleteProject() {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to complete this project?\n\nThis should only be done after reviewing and approving the volunteer's final submission."
      );

      if (!confirmed) return;

      setLoading(true);

      const res = await fetch(`/api/projects/${projectId}/complete`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.error || "Failed to complete project."
        );
      }

      alert(
        data?.message ||
          "Project marked as completed successfully."
      );

      router.refresh();

      router.push(
        `/dashboard/organization/projects/${projectId}/review`
      );
    } catch (error: any) {
      console.error("COMPLETE PROJECT ERROR:", error);

      alert(
        error?.message ||
          "Unable to complete project."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCompleteProject}
      disabled={loading}
      className="mt-4 inline-flex h-11 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:scale-[1.02] hover:from-purple-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Completing..." : "Complete Project"}
    </button>
  );
}
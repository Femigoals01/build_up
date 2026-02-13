
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

  const completeProject = async () => {
    setLoading(true);

    const res = await fetch(`/api/projects/${projectId}/complete`, {
      method: "POST",
    });

    if (res.ok) {
      // ✅ Refresh dashboard data
      router.refresh();
      alert("Project marked as completed. You can now leave a review.");
    } else {
      alert("Failed to complete project");
    }

    setLoading(false);
  };

  return (
    <button
      onClick={completeProject}
      disabled={loading}
      className="mt-4 px-5 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
    >
      {loading ? "Completing..." : "Mark Project Completed"}
    </button>
  );
}

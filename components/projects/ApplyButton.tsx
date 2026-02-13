
"use client";

import { useState } from "react";

export default function ApplyButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const apply = async () => {
    setLoading(true);

    const res = await fetch(`/api/projects/${projectId}/apply`, {
      method: "POST",
    });

    if (res.ok) {
      setApplied(true);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={apply}
      disabled={loading || applied}
      className={`w-full py-3 rounded-lg font-semibold transition ${
        applied
          ? "bg-green-600 text-white"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {applied
        ? "Application Submitted"
        : loading
        ? "Applying..."
        : "Apply to this Project"}
    </button>
  );
}

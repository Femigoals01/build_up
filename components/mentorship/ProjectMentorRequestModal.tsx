"use client";

import { useState } from "react";

type Project = {
  id: string;
  title: string;
};

export default function ProjectMentorRequestModal({
  mentorId,
  projects,
  onClose,
}: {
  mentorId: string;
  projects: Project[];
  onClose: () => void;
}) {
  const [projectId, setProjectId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendRequest() {
    if (!projectId) {
      alert("Please select a project");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/mentorship/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mentorId,
        projectId,
        message,
      }),
    });

    setLoading(false);

    if (res.ok) {
      alert("Mentorship request sent");
      onClose();
    } else {
      alert("Failed to send request");
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">
          Request Mentorship
        </h2>

        {/* PROJECT */}
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">Select a project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>

        {/* MESSAGE */}
        <textarea
          placeholder="What help do you need on this project?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 h-24"
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="border px-4 py-2 rounded-lg">
            Cancel
          </button>
          <button
            onClick={sendRequest}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            {loading ? "Sending..." : "Send Request"}
          </button>
        </div>
      </div>
    </div>
  );
}

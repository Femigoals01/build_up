

"use client";

type MentorRequestCardProps = {
  req: any;
};

export default function MentorRequestCard({ req }: MentorRequestCardProps) {
  async function handleAccept() {
    const res = await fetch("/api/mentorship/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId: req.id }),
    });

    if (!res.ok) {
      alert("Failed to accept request");
      return;
    }

    location.reload();
  }

  async function handleReject() {
    const res = await fetch("/api/mentorship/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId: req.id }),
    });

    if (!res.ok) {
      alert("Failed to reject request");
      return;
    }

    location.reload();
  }

  return (
    <div className="bg-white border rounded-xl p-6 flex justify-between items-center">
      {/* INFO */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{req.project.title}</h3>

        {req.volunteer && (
          <p className="text-sm text-gray-500">
            Volunteer: {req.volunteer.name}
          </p>
        )}

        <span
          className={`inline-block mt-2 text-xs px-3 py-1 rounded-full ${
            req.status === "ACCEPTED"
              ? "bg-green-100 text-green-700"
              : req.status === "REJECTED"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {req.status}
        </span>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 items-center">
        {req.project.chat && (
          <a
            href={`/dashboard/projects/${req.project.id}/chat`}
            className="border px-4 py-2 rounded-lg text-sm"
          >
            Open Chat
          </a>
        )}

        {req.status === "PENDING" && (
          <>
            <button
              onClick={handleAccept}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Accept
            </button>

            <button
              onClick={handleReject}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
}

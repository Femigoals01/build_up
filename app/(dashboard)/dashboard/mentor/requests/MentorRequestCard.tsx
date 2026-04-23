



// "use client";

// type MentorRequestCardProps = {
//   req: any;
// };

// export default function MentorRequestCard({ req }: MentorRequestCardProps) {
//   async function handleAccept() {
//     const res = await fetch("/api/mentorship/accept", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ requestId: req.id }),
//     });

//     if (!res.ok) {
//       alert("Failed to accept request");
//       return;
//     }

//     location.reload();
//   }

//   async function handleReject() {
//     const res = await fetch("/api/mentorship/reject", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ requestId: req.id }),
//     });

//     if (!res.ok) {
//       alert("Failed to reject request");
//       return;
//     }

//     location.reload();
//   }

//   return (
//     <div className="bg-white border rounded-xl p-6 flex justify-between items-center">
//       {/* INFO */}
//       <div className="space-y-1">
//         <h3 className="text-lg font-semibold">{req.project.title}</h3>

//         {req.volunteer && (
//           <p className="text-sm text-gray-500">
//             Volunteer: {req.volunteer.name}
//           </p>
//         )}

//         <span
//           className={`inline-block mt-2 text-xs px-3 py-1 rounded-full ${
//             req.status === "ACCEPTED"
//               ? "bg-green-100 text-green-700"
//               : req.status === "REJECTED"
//               ? "bg-red-100 text-red-700"
//               : "bg-yellow-100 text-yellow-700"
//           }`}
//         >
//           {req.status}
//         </span>
//       </div>

//       {/* ACTIONS */}
//       <div className="flex gap-3 items-center">
//         {req.project.chat && (
//           <a
//             href={`/dashboard/projects/${req.project.id}/chat`}
//             className="border px-4 py-2 rounded-lg text-sm"
//           >
//             Open Chat
//           </a>
//         )}

//         {req.status === "PENDING" && (
//           <>
//             <button
//               onClick={handleAccept}
//               className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
//             >
//               Accept
//             </button>

//             <button
//               onClick={handleReject}
//               className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
//             >
//               Reject
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }



"use client";

import { useState } from "react";

type RequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";

type MentorRequest = {
  id: string;
  status: RequestStatus;
  createdAt?: string | Date;
  volunteer?: {
    id: string;
    name: string;
    email: string;
  } | null;
  project: {
    id: string;
    title: string;
    description?: string | null;
    difficulty?: string | null;
    skills?: string[];
    chat?: { id: string } | null;
  };
};

type MentorRequestCardProps = {
  req: MentorRequest;
};

function getStatusClasses(status: RequestStatus) {
  switch (status) {
    case "ACCEPTED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "REJECTED":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

export default function MentorRequestCard({ req }: MentorRequestCardProps) {
  const [loadingAction, setLoadingAction] = useState<"accept" | "reject" | null>(null);

  async function handleAccept() {
    try {
      setLoadingAction("accept");

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
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleReject() {
    try {
      setLoadingAction("reject");

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
    } finally {
      setLoadingAction(null);
    }
  }

  const createdLabel = req.createdAt
    ? new Date(req.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
      <div className="border-b border-slate-100 bg-[linear-gradient(180deg,#ffffff,rgba(248,250,252,0.9))] px-6 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                  req.status
                )}`}
              >
                {req.status}
              </span>

              {req.project.difficulty && (
                <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {req.project.difficulty}
                </span>
              )}

              {createdLabel && (
                <span className="text-xs font-medium text-slate-400">
                  Requested {createdLabel}
                </span>
              )}
            </div>

            <h3 className="mt-3 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              {req.project.title}
            </h3>

            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
              {req.project.description?.trim()
                ? req.project.description
                : "A volunteer is requesting your mentorship support on this project."}
            </p>
          </div>

          <div className="shrink-0">
            {req.project.chat && (
              <a
                href={`/dashboard/projects/${req.project.id}/chat`}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Open Chat
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-5 px-6 py-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Volunteer
            </p>

            {req.volunteer ? (
              <div className="mt-3">
                <p className="text-base font-semibold text-slate-900">
                  {req.volunteer.name}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {req.volunteer.email}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                No volunteer details available.
              </p>
            )}
          </div>

          {req.project.skills && req.project.skills.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Relevant Skills
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {req.project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Actions
          </p>

          {req.status === "PENDING" ? (
            <div className="mt-4 flex flex-col gap-3">
              <button
                onClick={handleAccept}
                disabled={loadingAction !== null}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingAction === "accept" ? "Accepting..." : "Accept Request"}
              </button>

              <button
                onClick={handleReject}
                disabled={loadingAction !== null}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingAction === "reject" ? "Rejecting..." : "Reject Request"}
              </button>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">
                This mentorship request has already been{" "}
                <span className="font-semibold lowercase">{req.status.toLowerCase()}</span>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
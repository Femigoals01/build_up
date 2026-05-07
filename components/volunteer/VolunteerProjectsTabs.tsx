



// "use client";

// import { useState } from "react";
// import Link from "next/link";

// type Props = {
//   activeProjects: any[];
//   pendingProjects: any[];
//   completedProjects: any[];
// };

// export default function VolunteerProjectsTabs({
//   activeProjects,
//   pendingProjects,
//   completedProjects,
// }: Props) {
//   const [tab, setTab] = useState<"active" | "pending" | "completed">("active");

//   const currentProjects =
//     tab === "active"
//       ? activeProjects
//       : tab === "pending"
//       ? pendingProjects
//       : completedProjects;

//   return (
//     <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      
//       {/* 🔥 TABS */}
//       <div className="flex flex-wrap gap-2 mb-6">
//         {[
//           { key: "active", label: "Active" },
//           { key: "pending", label: "Pending" },
//           { key: "completed", label: "Completed" },
//         ].map((t) => (
//           <button
//             key={t.key}
//             onClick={() => setTab(t.key as any)}
//             className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
//               tab === t.key
//                 ? "bg-blue-600 text-white shadow"
//                 : "bg-slate-100 text-slate-600 hover:bg-slate-200"
//             }`}
//           >
//             {t.label}
//           </button>
//         ))}
//       </div>

//       {/* 🔥 EMPTY STATE */}
//       {currentProjects.length === 0 ? (
//         <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500">
//           No {tab} projects yet.
//         </div>
//       ) : (
//         <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//           {currentProjects.map((app) => {
//             const latestSubmission = app.project.submissions?.[0];

//             return (
//               <div
//                 key={app.id}
//                 className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
//               >
//                 <h3 className="text-lg font-bold text-slate-900">
//                   {app.project.title}
//                 </h3>

//                 <p className="mt-1 text-sm text-slate-500">
//                   {app.project.organization.name}
//                 </p>

//                 <div className="mt-3 flex flex-wrap gap-2">
//                   <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
//                     {app.status}
//                   </span>

//                   <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
//                     {app.project.status}
//                   </span>

//                   {latestSubmission && (
//                     <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
//                       Submission: {latestSubmission.status}
//                     </span>
//                   )}
//                 </div>

//                 <div className="mt-5 flex flex-wrap gap-2">
//                   <Link
//                     href={`/dashboard/projects/${app.project.id}/chat`}
//                     className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//                   >
//                     Open Chat
//                   </Link>

//                   <Link
//                     href={`/dashboard/projects/${app.project.id}/submit`}
//                     className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
//                   >
//                     View / Submit
//                   </Link>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </section>
//   );
// }




"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  activeProjects: any[];
  pendingProjects: any[];
  completedProjects: any[];
};

function formatNairaFromKobo(amount?: number | null) {
  if (!amount) return "₦0";

  return `₦${(amount / 100).toLocaleString("en-NG", {
    maximumFractionDigits: 0,
  })}`;
}

function getStatusLabel(status: string) {
  if (status === "AWAITING_PAYMENT") return "Selected — Payment Pending";
  return status.replaceAll("_", " ");
}

function getStatusStyle(status: string) {
  if (status === "AWAITING_PAYMENT") {
    return "bg-amber-50 text-amber-700";
  }

  if (status === "ACCEPTED") {
    return "bg-blue-50 text-blue-700";
  }

  if (status === "COMPLETED") {
    return "bg-emerald-50 text-emerald-700";
  }

  return "bg-slate-100 text-slate-600";
}

export default function VolunteerProjectsTabs({
  activeProjects,
  pendingProjects,
  completedProjects,
}: Props) {
  const [tab, setTab] = useState<"active" | "pending" | "completed">("active");

  const currentProjects =
    tab === "active"
      ? activeProjects
      : tab === "pending"
      ? pendingProjects
      : completedProjects;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { key: "active", label: "Active" },
          { key: "pending", label: "Pending" },
          { key: "completed", label: "Completed" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              tab === t.key
                ? "bg-blue-600 text-white shadow"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {currentProjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500">
          No {tab} projects yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {currentProjects.map((app) => {
            const latestSubmission = app.project.submissions?.[0];

            return (
              <div
                key={app.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="text-lg font-bold text-slate-900">
                  {app.project.title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {app.project.organization.name}
                </p>

                <p className="mt-2 text-sm font-semibold text-emerald-700">
                  Project Amount:{" "}
                  {formatNairaFromKobo(app.project.stipendAmount)}
                </p>

                {app.status === "AWAITING_PAYMENT" ? (
                  <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold leading-5 text-amber-700">
                    You have been selected. The project will move to active once
                    the organization funds it.
                  </p>
                ) : null}

                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      app.status
                    )}`}
                  >
                    {getStatusLabel(app.status)}
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {app.project.status.replaceAll("_", " ")}
                  </span>

                  {latestSubmission && (
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      Submission: {latestSubmission.status}
                    </span>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {app.status === "ACCEPTED" ? (
                    <>
                      <Link
                        href={`/dashboard/projects/${app.project.id}/chat`}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Open Chat
                      </Link>

                      <Link
                        href={`/dashboard/projects/${app.project.id}/submit`}
                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        View / Submit
                      </Link>
                    </>
                  ) : (
                    <Link
                      href={`/dashboard/volunteer/projects/${app.project.id}`}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
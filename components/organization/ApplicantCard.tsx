



// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// type Props = {
//   applicationId: string;
//   name: string;
//   email: string;
//   status: string;
//   username?: string | null;
//   bio?: string | null;
//   skills?: string | null;
//   country?: string | null;
//   profileImageUrl?: string | null;
//   experience?: string | null;
// };

// function getInitial(name?: string | null) {
//   return name?.trim()?.charAt(0)?.toUpperCase() || "U";
// }

// function splitSkills(skills?: string | null) {
//   if (!skills?.trim()) return [];
//   return skills
//     .split(",")
//     .map((skill) => skill.trim())
//     .filter(Boolean);
// }

// export default function ApplicantCard({
//   applicationId,
//   name,
//   email,
//   status,
//   username,
//   bio,
//   skills,
//   country,
//   profileImageUrl,
//   experience,
// }: Props) {
//   const [loading, setLoading] = useState(false);

//   const updateStatus = async (newStatus: "ACCEPTED" | "REJECTED") => {
//     setLoading(true);

//     const res = await fetch(`/api/applications/${applicationId}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ status: newStatus }),
//     });

//     if (res.ok) {
//       window.location.reload();
//     } else {
//       alert("Failed to update status");
//     }

//     setLoading(false);
//   };

//   const volunteerSkills = splitSkills(skills);

//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//       <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
//         <div className="flex items-start gap-4">
//           <div className="relative h-14 w-14 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
//             {profileImageUrl ? (
//               <Image
//                 src={profileImageUrl}
//                 alt={name || "Volunteer"}
//                 fill
//                 className="object-cover"
//                 sizes="56px"
//               />
//             ) : (
//               <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
//                 {getInitial(name)}
//               </div>
//             )}
//           </div>

//           <div className="min-w-0">
//             <div className="flex flex-wrap items-center gap-2">
//               <p className="text-base font-bold text-slate-900">{name}</p>

//               <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
//                 {status}
//               </span>
//             </div>

//             <p className="mt-1 text-sm text-slate-500">
//               {username ? `@${username}` : "Username not added yet"}
//               {country ? ` • ${country}` : ""}
//             </p>

//             <p className="mt-1 text-sm text-slate-500">{email}</p>

//             <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
//               {bio?.trim()
//                 ? bio
//                 : "This volunteer has not added a bio yet."}
//             </p>

//             <div className="mt-3 flex flex-wrap gap-2">
//               {volunteerSkills.length > 0 ? (
//                 volunteerSkills.slice(0, 4).map((skill) => (
//                   <span
//                     key={skill}
//                     className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
//                   >
//                     {skill}
//                   </span>
//                 ))
//               ) : (
//                 <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
//                   No skills added yet
//                 </span>
//               )}
//             </div>

//             <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
//               Experience:{" "}
//               <span className="text-slate-600 normal-case tracking-normal">
//                 {experience?.trim() ? experience : "Not added yet"}
//               </span>
//             </p>
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-3">
//           {username ? (
//             <Link
//               href={`/portfolio/${username}`}
//               className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
//             >
//               View Portfolio
//             </Link>
//           ) : (
//             <span className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-500">
//               No Portfolio Yet
//             </span>
//           )}

//           {status === "PENDING" && (
//             <>
//               <button
//                 onClick={() => updateStatus("ACCEPTED")}
//                 disabled={loading}
//                 className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 Accept
//               </button>

//               <button
//                 onClick={() => updateStatus("REJECTED")}
//                 disabled={loading}
//                 className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 Reject
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }







"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  applicationId: string;
  name: string;
  email: string;
  status: string;
  username?: string | null;
  bio?: string | null;
  skills?: string | null;
  country?: string | null;
  profileImageUrl?: string | null;
  experience?: string | null;
};

function getInitial(name?: string | null) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "U";
}

function splitSkills(skills?: string | null) {
  if (!skills?.trim()) return [];
  return skills.split(",").map((skill) => skill.trim()).filter(Boolean);
}

function formatStatus(status: string) {
  if (status === "PENDING") return "Pending review";
  if (status === "AWAITING_PAYMENT") return "Awaiting payment";
  return status.replaceAll("_", " ");
}

function statusStyles(status: string) {
  switch (status) {
    case "PENDING":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "AWAITING_PAYMENT":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "ACCEPTED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "REJECTED":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

export default function ApplicantCard({
  applicationId,
  name,
  email,
  status,
  username,
  bio,
  skills,
  country,
  profileImageUrl,
  experience,
}: Props) {
  const [loading, setLoading] = useState(false);
  const volunteerSkills = splitSkills(skills);

  const updateStatus = async (newStatus: "ACCEPTED" | "REJECTED") => {
    setLoading(true);

    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        window.location.reload();
        return;
      }

      alert("Failed to update status");
    } catch (error) {
      console.error("Applicant status update error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
      <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />

      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-3xl border border-white bg-slate-100 shadow-md ring-4 ring-blue-50">
              {profileImageUrl ? (
                <Image
                  src={profileImageUrl}
                  alt={name || "Volunteer"}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-black text-white">
                  {getInitial(name)}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-lg font-extrabold tracking-tight text-slate-900">
                  {name}
                </h3>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${statusStyles(
                    status
                  )}`}
                >
                  {formatStatus(status)}
                </span>
              </div>

              <p className="mt-1 text-sm font-medium text-slate-500">{email}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {username ? (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                    @{username}
                  </span>
                ) : null}

                {country ? (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                    🌍 {country}
                  </span>
                ) : null}

                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                  Experience: {experience?.trim() ? experience : "Not added"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            {username ? (
              <Link
                href={`/portfolio/${username}`}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 px-5 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
              >
                View Portfolio
              </Link>
            ) : (
              <span className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-500">
                No Portfolio Yet
              </span>
            )}

            {status === "PENDING" ? (
              <>
                <button
                  type="button"
                  onClick={() => updateStatus("ACCEPTED")}
                  disabled={loading}
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Working..." : "Accept"}
                </button>

                <button
                  type="button"
                  onClick={() => updateStatus("REJECTED")}
                  disabled={loading}
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Reject
                </button>
              </>
            ) : null}
          </div>
        </div>

        <div className="mt-5 rounded-[22px] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
          <p className="text-sm leading-7 text-slate-600">
            {bio?.trim() ? bio : "This volunteer has not added a bio yet."}
          </p>
        </div>

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Skills matched to this talent
            </p>

            {volunteerSkills.length > 0 ? (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                {volunteerSkills.length} skill
                {volunteerSkills.length === 1 ? "" : "s"}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {volunteerSkills.length > 0 ? (
              volunteerSkills.slice(0, 8).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                No skills added yet
              </span>
            )}

            {volunteerSkills.length > 8 ? (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">
                +{volunteerSkills.length - 8} more
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
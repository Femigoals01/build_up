



// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// /* ================= CONFIG ================= */

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// /* ================= TYPES ================= */

// type PendingMentor = {
//   id: string;
//   name: string;
//   email: string;
//   experience: string | null;
//   bio: string | null;
// };

// /* ================= PAGE ============= */

// export default async function AdminMentorsPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   // 🔎 Fetch pending mentor applications
//   const pendingMentors: PendingMentor[] =
//     await prisma.user.findMany({
//       where: {
//         role: { not: "MENTOR" },
//         experience: { not: null },
//         bio: { not: null },
//       },
//       orderBy: { createdAt: "desc" },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         experience: true,
//         bio: true,
//       },
//     });

//   /* ================= SERVER ACTION ================= */

//   async function approveMentor(mentorId: string) {
//     "use server";

//     await prisma.user.update({
//       where: { id: mentorId },
//       data: { role: "MENTOR" },
//     });

//     await prisma.notification.create({
//       data: {
//         userId: mentorId,
//         title: "Mentor Approved 🎉",
//         message:
//           "Your mentor account has been approved! You can now access your mentor dashboard.",
//         type: "SYSTEM",
//       },
//     });
//   }

//   /* ================= UI ================= */

//   return (
//     <main className="p-10 space-y-8">
//       <header>
//         <h1 className="text-3xl font-bold">
//           Mentor Applications
//         </h1>
//         <p className="text-gray-600 mt-1">
//           Review and approve mentor applications
//         </p>
//       </header>

//       {pendingMentors.length === 0 ? (
//         <div className="bg-white border rounded-xl p-10 text-center text-gray-600">
//           No pending mentor applications.
//         </div>
//       ) : (
//         <div className="grid gap-6">
//           {pendingMentors.map((mentor: PendingMentor) => (
//             <div
//               key={mentor.id}
//               className="bg-white border rounded-2xl p-6 shadow-sm flex justify-between items-start gap-6"
//             >
//               <div className="space-y-2">
//                 <h3 className="text-xl font-semibold">
//                   {mentor.name}
//                 </h3>

//                 <p className="text-sm text-gray-500">
//                   {mentor.email}
//                 </p>

//                 {mentor.experience && (
//                   <p className="text-sm">
//                     <strong>Experience:</strong>{" "}
//                     {mentor.experience} years
//                   </p>
//                 )}

//                 {mentor.bio && (
//                   <p className="text-sm text-gray-700">
//                     {mentor.bio}
//                   </p>
//                 )}
//               </div>

//               <form
//                 action={approveMentor.bind(null, mentor.id)}
//               >
//                 <button
//                   type="submit"
//                   className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
//                 >
//                   Approve Mentor
//                 </button>
//               </form>
//             </div>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }


// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// /* ================= CONFIG ================= */

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// /* ================= TYPES ================= */

// type PendingMentor = {
//   id: string;
//   name: string;
//   email: string;
//   experience: string | null;
//   bio: string | null;
// };

// /* ================= PAGE ================= */

// export default async function AdminMentorsPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   /* ================= DATA ================= */

//   const pendingMentors: PendingMentor[] =
//     await prisma.user.findMany({
//       where: {
//         role: { not: "MENTOR" },
//         experience: { not: null },
//         bio: { not: null },
//       },
//       orderBy: { createdAt: "desc" },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         experience: true,
//         bio: true,
//       },
//     });

//   const totalApplications = pendingMentors.length;

//   /* ================= SERVER ACTION ================= */

//   async function approveMentor(mentorId: string) {
//     "use server";

//     await prisma.user.update({
//       where: { id: mentorId },
//       data: { role: "MENTOR" },
//     });

//     await prisma.notification.create({
//       data: {
//         userId: mentorId,
//         title: "Mentor Approved 🎉",
//         message:
//           "Your mentor account has been approved! You can now access your mentor dashboard.",
//         type: "SYSTEM",
//       },
//     });
//   }

//   /* ================= UI ================= */

//   return (
//     <main className="space-y-8">
//       {/* 🔥 HERO */}
//       <section className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
//         <div className="relative overflow-hidden bg-[linear-gradient(135deg,#0f172a_0%,#14532d_35%,#059669_100%)] px-6 py-8 text-white sm:px-8 lg:px-10">
//           <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-3xl" />

//           <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100/90">
//             Mentor Approval System
//           </p>

//           <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
//             Mentor Applications
//           </h1>

//           <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-50/90 sm:text-base">
//             Review, evaluate, and approve mentor applications with full visibility
//             into experience, profile quality, and readiness.
//           </p>
//         </div>

//         {/* METRICS */}
//         <div className="grid gap-4 px-6 py-6 sm:px-8 md:grid-cols-3">
//           <MetricCard
//             title="Pending Applications"
//             value={totalApplications}
//             subtitle="Awaiting approval"
//           />
//           <MetricCard
//             title="Qualified Profiles"
//             value={pendingMentors.length}
//             subtitle="Have bio & experience"
//           />
//           <MetricCard
//             title="Approval Rate (Manual)"
//             value={0}
//             subtitle="Future metric"
//           />
//         </div>
//       </section>

//       {/* APPLICATION LIST */}
//       <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
//         <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
//               Application Queue
//             </p>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//               Pending Mentors
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Carefully review each mentor before approval.
//             </p>
//           </div>

//           <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
//             {pendingMentors.length} application
//             {pendingMentors.length === 1 ? "" : "s"}
//           </div>
//         </div>

//         {pendingMentors.length === 0 ? (
//           <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//             <p className="text-slate-600">
//               No pending mentor applications.
//             </p>
//           </div>
//         ) : (
//           <div className="grid gap-6">
//             {pendingMentors.map((mentor) => (
//               <div
//                 key={mentor.id}
//                 className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
//               >
//                 <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
//                   {/* LEFT */}
//                   <div className="space-y-4 max-w-2xl">
//                     <div>
//                       <h3 className="text-xl font-semibold text-slate-900">
//                         {mentor.name}
//                       </h3>
//                       <p className="mt-1 text-sm text-slate-500">
//                         {mentor.email}
//                       </p>
//                     </div>

//                     <div className="grid gap-4 sm:grid-cols-2">
//                       <InfoBlock
//                         label="Experience"
//                         value={
//                           mentor.experience
//                             ? `${mentor.experience} years`
//                             : "Not provided"
//                         }
//                       />

//                       <InfoBlock
//                         label="Profile Status"
//                         value="Complete"
//                       />
//                     </div>

//                     {mentor.bio && (
//                       <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//                         <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
//                           Bio
//                         </p>
//                         <p className="mt-2 text-sm text-slate-700 leading-6">
//                           {mentor.bio}
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   {/* RIGHT ACTION */}
//                   <div className="flex flex-col gap-3">
//                     <form
//                       action={approveMentor.bind(null, mentor.id)}
//                     >
//                       <button
//                         type="submit"
//                         className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white transition hover:bg-emerald-700"
//                       >
//                         Approve Mentor
//                       </button>
//                     </form>

//                     <button
//                       className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
//                     >
//                       Reject
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }

// /* ================= COMPONENTS ================= */

// function MetricCard({
//   title,
//   value,
//   subtitle,
// }: {
//   title: string;
//   value: number;
//   subtitle: string;
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//       <p className="text-sm font-medium text-slate-500">{title}</p>
//       <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//         {value}
//       </p>
//       <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
//         {subtitle}
//       </p>
//     </div>
//   );
// }

// function InfoBlock({
//   label,
//   value,
// }: {
//   label: string;
//   value: string;
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-4">
//       <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
//         {label}
//       </p>
//       <p className="mt-2 text-sm font-medium text-slate-800">
//         {value}
//       </p>
//     </div>
//   );
// }





// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// type PendingMentor = {
//   id: string;
//   name: string;
//   email: string;
//   experience: string | null;
//   bio: string | null;
// };

// type ApprovedMentor = {
//   id: string;
//   name: string;
//   email: string;
//   country: string | null;
//   countryCode: string | null;
//   mobileNumber: string | null;
// };

// function formatPhone(countryCode?: string | null, mobileNumber?: string | null) {
//   if (!countryCode && !mobileNumber) return "Not added";
//   if (countryCode && mobileNumber) return `${countryCode} ${mobileNumber}`;
//   return mobileNumber || countryCode || "Not added";
// }

// export default async function AdminMentorsPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   const pendingMentors: PendingMentor[] = await prisma.user.findMany({
//     where: {
//       role: { not: "MENTOR" },
//       experience: { not: null },
//       bio: { not: null },
//     },
//     orderBy: { createdAt: "desc" },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       experience: true,
//       bio: true,
//     },
//   });

//   const approvedMentors: ApprovedMentor[] = await prisma.user.findMany({
//     where: { role: "MENTOR" },
//     orderBy: { createdAt: "desc" },
//     take: 6,
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       country: true,
//       countryCode: true,
//       mobileNumber: true,
//     },
//   });

//   async function approveMentor(mentorId: string) {
//     "use server";

//     await prisma.user.update({
//       where: { id: mentorId },
//       data: { role: "MENTOR" },
//     });

//     await prisma.notification.create({
//       data: {
//         userId: mentorId,
//         title: "Mentor Approved 🎉",
//         message:
//           "Your mentor account has been approved! You can now access your mentor dashboard.",
//         type: "SYSTEM",
//       },
//     });
//   }

//   return (
//     <main className="space-y-8">
//       <section className="grid gap-4 md:grid-cols-3">
//         <MetricCard
//           title="Pending Applications"
//           value={pendingMentors.length}
//           subtitle="Awaiting approval"
//         />
//         <MetricCard
//           title="Approved Mentors"
//           value={approvedMentors.length}
//           subtitle="Visible snapshot"
//         />
//         <MetricCard
//           title="Qualified Profiles"
//           value={pendingMentors.length}
//           subtitle="Have bio & experience"
//         />
//       </section>

//       <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
//         <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
//               Application Queue
//             </p>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//               Pending Mentor Applications
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Carefully review each mentor before approval.
//             </p>
//           </div>

//           <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
//             {pendingMentors.length} application
//             {pendingMentors.length === 1 ? "" : "s"}
//           </div>
//         </div>

//         {pendingMentors.length === 0 ? (
//           <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//             <p className="text-slate-600">No pending mentor applications.</p>
//           </div>
//         ) : (
//           <div className="grid gap-6">
//             {pendingMentors.map((mentor) => (
//               <div
//                 key={mentor.id}
//                 className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
//               >
//                 <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
//                   <div className="max-w-2xl space-y-4">
//                     <div>
//                       <h3 className="text-xl font-semibold text-slate-900">
//                         {mentor.name}
//                       </h3>
//                       <p className="mt-1 text-sm text-slate-500">
//                         {mentor.email}
//                       </p>
//                     </div>

//                     <div className="grid gap-4 sm:grid-cols-2">
//                       <InfoBlock
//                         label="Experience"
//                         value={
//                           mentor.experience
//                             ? `${mentor.experience} years`
//                             : "Not provided"
//                         }
//                       />
//                       <InfoBlock label="Profile Status" value="Complete" />
//                     </div>

//                     {mentor.bio && (
//                       <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//                         <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
//                           Bio
//                         </p>
//                         <p className="mt-2 text-sm leading-6 text-slate-700">
//                           {mentor.bio}
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex flex-col gap-3">
//                     <form action={approveMentor.bind(null, mentor.id)}>
//                       <button
//                         type="submit"
//                         className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white transition hover:bg-emerald-700"
//                       >
//                         Approve Mentor
//                       </button>
//                     </form>

//                     <button
//                       className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
//                       type="button"
//                     >
//                       Reject
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
//         <div className="mb-6">
//           <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
//             Mentor Snapshot
//           </p>
//           <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//             Approved Mentors
//           </h2>
//           <p className="mt-1 text-sm text-slate-500">
//             Mentors currently approved and active on the platform.
//           </p>
//         </div>

//         {approvedMentors.length === 0 ? (
//           <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//             <p className="text-slate-600">No mentors yet.</p>
//           </div>
//         ) : (
//           <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//             {approvedMentors.map((mentor) => (
//               <div
//                 key={mentor.id}
//                 className="rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5 shadow-sm"
//               >
//                 <div className="flex items-start justify-between gap-3">
//                   <div>
//                     <p className="text-lg font-semibold text-slate-900">
//                       {mentor.name}
//                     </p>
//                     <p className="mt-1 text-sm text-slate-500">{mentor.email}</p>
//                   </div>

//                   <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
//                     Approved
//                   </span>
//                 </div>

//                 <div className="mt-4 space-y-2 text-sm text-slate-600">
//                   <p>
//                     <span className="font-medium text-slate-800">Country:</span>{" "}
//                     {mentor.country || "Not added"}
//                   </p>
//                   <p>
//                     <span className="font-medium text-slate-800">Phone:</span>{" "}
//                     {formatPhone(mentor.countryCode, mentor.mobileNumber)}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }

// function MetricCard({
//   title,
//   value,
//   subtitle,
// }: {
//   title: string;
//   value: number;
//   subtitle: string;
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//       <p className="text-sm font-medium text-slate-500">{title}</p>
//       <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//         {value}
//       </p>
//       <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
//         {subtitle}
//       </p>
//     </div>
//   );
// }

// function InfoBlock({
//   label,
//   value,
// }: {
//   label: string;
//   value: string;
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-4">
//       <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
//         {label}
//       </p>
//       <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
//     </div>
//   );
// }



// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// type PendingMentor = {
//   id: string;
//   name: string;
//   email: string;
//   experience: string | null;
//   bio: string | null;
// };

// type ApprovedMentor = {
//   id: string;
//   name: string;
//   email: string;
//   country: string | null;
//   countryCode: string | null;
//   mobileNumber: string | null;
// };

// function formatPhone(countryCode?: string | null, mobileNumber?: string | null) {
//   if (!countryCode && !mobileNumber) return "Not added";
//   if (countryCode && mobileNumber) return `${countryCode} ${mobileNumber}`;
//   return mobileNumber || countryCode || "Not added";
// }

// export default async function AdminMentorsPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   // Pending mentor candidates:
//   // Restrict to volunteers only so organizations or other non-mentor users do not appear.
//   const pendingMentors: PendingMentor[] = await prisma.user.findMany({
//     where: {
//       role: "VOLUNTEER",
//       experience: { not: null },
//       bio: { not: null },
//     },
//     orderBy: { createdAt: "desc" },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       experience: true,
//       bio: true,
//     },
//   });

//   // Real mentor count
//   const approvedMentorsCount = await prisma.user.count({
//     where: { role: "MENTOR" },
//   });

//   // Display snapshot only
//   const approvedMentors: ApprovedMentor[] = await prisma.user.findMany({
//     where: { role: "MENTOR" },
//     orderBy: { createdAt: "desc" },
//     take: 6,
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       country: true,
//       countryCode: true,
//       mobileNumber: true,
//     },
//   });

//   async function approveMentor(mentorId: string) {
//     "use server";

//     await prisma.user.update({
//       where: { id: mentorId },
//       data: { role: "MENTOR" },
//     });

//     await prisma.notification.create({
//       data: {
//         userId: mentorId,
//         title: "Mentor Approved 🎉",
//         message:
//           "Your mentor account has been approved! You can now access your mentor dashboard.",
//         type: "SYSTEM",
//       },
//     });
//   }

//   return (
//     <main className="space-y-8">
//       <section className="grid gap-4 md:grid-cols-3">
//         <MetricCard
//           title="Pending Applications"
//           value={pendingMentors.length}
//           subtitle="Volunteer candidates awaiting approval"
//         />
//         <MetricCard
//           title="Approved Mentors"
//           value={approvedMentorsCount}
//           subtitle="Total active mentors"
//         />
//         <MetricCard
//           title="Visible Snapshot"
//           value={approvedMentors.length}
//           subtitle="Mentors shown below"
//         />
//       </section>

//       <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
//         <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
//               Application Queue
//             </p>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//               Pending Mentor Applications
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Carefully review volunteer candidates before mentor approval.
//             </p>
//           </div>

//           <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
//             {pendingMentors.length} application
//             {pendingMentors.length === 1 ? "" : "s"}
//           </div>
//         </div>

//         {pendingMentors.length === 0 ? (
//           <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//             <p className="text-slate-600">No pending mentor applications.</p>
//           </div>
//         ) : (
//           <div className="grid gap-6">
//             {pendingMentors.map((mentor) => (
//               <div
//                 key={mentor.id}
//                 className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
//               >
//                 <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
//                   <div className="max-w-2xl space-y-4">
//                     <div>
//                       <h3 className="text-xl font-semibold text-slate-900">
//                         {mentor.name}
//                       </h3>
//                       <p className="mt-1 text-sm text-slate-500">
//                         {mentor.email}
//                       </p>
//                     </div>

//                     <div className="grid gap-4 sm:grid-cols-2">
//                       <InfoBlock
//                         label="Experience"
//                         value={
//                           mentor.experience
//                             ? `${mentor.experience} years`
//                             : "Not provided"
//                         }
//                       />
//                       <InfoBlock label="Profile Status" value="Complete" />
//                     </div>

//                     {mentor.bio && (
//                       <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//                         <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
//                           Bio
//                         </p>
//                         <p className="mt-2 text-sm leading-6 text-slate-700">
//                           {mentor.bio}
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex flex-col gap-3">
//                     <form action={approveMentor.bind(null, mentor.id)}>
//                       <button
//                         type="submit"
//                         className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white transition hover:bg-emerald-700"
//                       >
//                         Approve Mentor
//                       </button>
//                     </form>

//                     <button
//                       className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
//                       type="button"
//                     >
//                       Reject
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
//         <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
//               Mentor Snapshot
//             </p>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//               Approved Mentors
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Latest approved mentors currently active on the platform.
//             </p>
//           </div>

//           <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
//             Showing {approvedMentors.length} of {approvedMentorsCount}
//           </div>
//         </div>

//         {approvedMentors.length === 0 ? (
//           <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//             <p className="text-slate-600">No mentors yet.</p>
//           </div>
//         ) : (
//           <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//             {approvedMentors.map((mentor) => (
//               <div
//                 key={mentor.id}
//                 className="rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5 shadow-sm"
//               >
//                 <div className="flex items-start justify-between gap-3">
//                   <div>
//                     <p className="text-lg font-semibold text-slate-900">
//                       {mentor.name}
//                     </p>
//                     <p className="mt-1 text-sm text-slate-500">{mentor.email}</p>
//                   </div>

//                   <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
//                     Approved
//                   </span>
//                 </div>

//                 <div className="mt-4 space-y-2 text-sm text-slate-600">
//                   <p>
//                     <span className="font-medium text-slate-800">Country:</span>{" "}
//                     {mentor.country || "Not added"}
//                   </p>
//                   <p>
//                     <span className="font-medium text-slate-800">Phone:</span>{" "}
//                     {formatPhone(mentor.countryCode, mentor.mobileNumber)}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }

// function MetricCard({
//   title,
//   value,
//   subtitle,
// }: {
//   title: string;
//   value: number;
//   subtitle: string;
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//       <p className="text-sm font-medium text-slate-500">{title}</p>
//       <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//         {value}
//       </p>
//       <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
//         {subtitle}
//       </p>
//     </div>
//   );
// }

// function InfoBlock({
//   label,
//   value,
// }: {
//   label: string;
//   value: string;
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-4">
//       <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
//         {label}
//       </p>
//       <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
//     </div>
//   );
// }






// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// type PendingMentor = {
//   id: string;
//   name: string;
//   email: string;
//   experience: string | null;
//   bio: string | null;
//   country: string | null;
//   countryCode: string | null;
//   mobileNumber: string | null;
//   emailVerified: boolean;
//   createdAt: Date;
// };

// type ApprovedMentor = {
//   id: string;
//   name: string;
//   email: string;
//   country: string | null;
//   countryCode: string | null;
//   mobileNumber: string | null;
//   createdAt: Date;
// };

// function formatPhone(countryCode?: string | null, mobileNumber?: string | null) {
//   if (!countryCode && !mobileNumber) return "Not added";
//   if (countryCode && mobileNumber) return `${countryCode} ${mobileNumber}`;
//   return mobileNumber || countryCode || "Not added";
// }

// export default async function AdminMentorsPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   const pendingMentors: PendingMentor[] = await prisma.user.findMany({
//     where: {
//       role: "MENTOR",
//       mentorStatus: "PENDING",
//     },
//     orderBy: { createdAt: "desc" },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       experience: true,
//       bio: true,
//       country: true,
//       countryCode: true,
//       mobileNumber: true,
//       emailVerified: true,
//       createdAt: true,
//     },
//   });

//   const approvedMentorsCount = await prisma.user.count({
//     where: {
//       role: "MENTOR",
//       mentorStatus: "APPROVED",
//     },
//   });

//   const approvedMentors: ApprovedMentor[] = await prisma.user.findMany({
//     where: {
//       role: "MENTOR",
//       mentorStatus: "APPROVED",
//     },
//     orderBy: { createdAt: "desc" },
//     take: 6,
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       country: true,
//       countryCode: true,
//       mobileNumber: true,
//       createdAt: true,
//     },
//   });

//   async function approveMentor(mentorId: string) {
//     "use server";

//     await prisma.user.update({
//       where: { id: mentorId },
//       data: {
//         role: "MENTOR",
//         mentorStatus: "APPROVED",
//       },
//     });

//     await prisma.notification.create({
//       data: {
//         userId: mentorId,
//         title: "Mentor Approved 🎉",
//         message:
//           "Your mentor account has been approved! You can now access your mentor dashboard.",
//         type: "SYSTEM",
//       },
//     });
//   }

//   return (
//     <main className="space-y-8">
//       <section className="grid gap-4 md:grid-cols-3">
//         <MetricCard
//           title="Pending Applications"
//           value={pendingMentors.length}
//           subtitle="Mentor applicants awaiting approval"
//         />
//         <MetricCard
//           title="Approved Mentors"
//           value={approvedMentorsCount}
//           subtitle="Total approved mentors"
//         />
//         <MetricCard
//           title="Visible Snapshot"
//           value={approvedMentors.length}
//           subtitle="Approved mentors shown below"
//         />
//       </section>

//       <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
//         <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
//               Application Queue
//             </p>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//               Pending Mentor Applications
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Review actual mentor applicants only.
//             </p>
//           </div>

//           <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
//             {pendingMentors.length} application
//             {pendingMentors.length === 1 ? "" : "s"}
//           </div>
//         </div>

//         {pendingMentors.length === 0 ? (
//           <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//             <p className="text-slate-600">No pending mentor applications.</p>
//           </div>
//         ) : (
//           <div className="grid gap-6">
//             {pendingMentors.map((mentor) => (
//               <div
//                 key={mentor.id}
//                 className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
//               >
//                 <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
//                   <div className="max-w-2xl space-y-4">
//                     <div>
//                       <div className="flex flex-wrap items-center gap-3">
//                         <h3 className="text-xl font-semibold text-slate-900">
//                           {mentor.name}
//                         </h3>

//                         <span
//                           className={`rounded-full px-3 py-1 text-xs font-semibold ${
//                             mentor.emailVerified
//                               ? "bg-emerald-50 text-emerald-700"
//                               : "bg-amber-50 text-amber-700"
//                           }`}
//                         >
//                           {mentor.emailVerified ? "Email Verified" : "Email Not Verified"}
//                         </span>
//                       </div>

//                       <p className="mt-1 text-sm text-slate-500">
//                         {mentor.email}
//                       </p>
//                     </div>

//                     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                       <InfoBlock
//                         label="Experience"
//                         value={
//                           mentor.experience
//                             ? `${mentor.experience} years`
//                             : "Not provided"
//                         }
//                       />
//                       <InfoBlock
//                         label="Country"
//                         value={mentor.country || "Not added"}
//                       />
//                       <InfoBlock
//                         label="Phone"
//                         value={formatPhone(mentor.countryCode, mentor.mobileNumber)}
//                       />
//                     </div>

//                     {mentor.bio && (
//                       <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//                         <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
//                           Bio
//                         </p>
//                         <p className="mt-2 text-sm leading-6 text-slate-700">
//                           {mentor.bio}
//                         </p>
//                       </div>
//                     )}

//                     <p className="text-xs text-slate-500">
//                       Applied on{" "}
//                       {new Date(mentor.createdAt).toLocaleDateString("en-GB", {
//                         day: "numeric",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                     </p>
//                   </div>

//                   <div className="flex flex-col gap-3">
//                     <form action={approveMentor.bind(null, mentor.id)}>
//                       <button
//                         type="submit"
//                         className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white transition hover:bg-emerald-700"
//                       >
//                         Approve Mentor
//                       </button>
//                     </form>

//                     <button
//                       className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
//                       type="button"
//                     >
//                       Reject
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
//         <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
//               Mentor Snapshot
//             </p>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//               Approved Mentors
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Latest mentors already approved and active on the platform.
//             </p>
//           </div>

//           <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
//             Showing {approvedMentors.length} of {approvedMentorsCount}
//           </div>
//         </div>

//         {approvedMentors.length === 0 ? (
//           <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//             <p className="text-slate-600">No approved mentors yet.</p>
//           </div>
//         ) : (
//           <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//             {approvedMentors.map((mentor) => (
//               <div
//                 key={mentor.id}
//                 className="rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5 shadow-sm"
//               >
//                 <div className="flex items-start justify-between gap-3">
//                   <div>
//                     <p className="text-lg font-semibold text-slate-900">
//                       {mentor.name}
//                     </p>
//                     <p className="mt-1 text-sm text-slate-500">{mentor.email}</p>
//                   </div>

//                   <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
//                     Approved
//                   </span>
//                 </div>

//                 <div className="mt-4 space-y-2 text-sm text-slate-600">
//                   <p>
//                     <span className="font-medium text-slate-800">Country:</span>{" "}
//                     {mentor.country || "Not added"}
//                   </p>
//                   <p>
//                     <span className="font-medium text-slate-800">Phone:</span>{" "}
//                     {formatPhone(mentor.countryCode, mentor.mobileNumber)}
//                   </p>
//                   <p>
//                     <span className="font-medium text-slate-800">Joined:</span>{" "}
//                     {new Date(mentor.createdAt).toLocaleDateString("en-GB", {
//                       day: "numeric",
//                       month: "short",
//                       year: "numeric",
//                     })}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }

// function MetricCard({
//   title,
//   value,
//   subtitle,
// }: {
//   title: string;
//   value: number;
//   subtitle: string;
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//       <p className="text-sm font-medium text-slate-500">{title}</p>
//       <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//         {value}
//       </p>
//       <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
//         {subtitle}
//       </p>
//     </div>
//   );
// }

// function InfoBlock({
//   label,
//   value,
// }: {
//   label: string;
//   value: string;
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-4">
//       <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
//         {label}
//       </p>
//       <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
//     </div>
//   );
// }



// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// type PendingMentor = {
//   id: string;
//   name: string;
//   email: string;
//   experience: string | null;
//   bio: string | null;
//   country: string | null;
//   countryCode: string | null;
//   mobileNumber: string | null;
//   emailVerified: boolean;
//   createdAt: Date;
// };

// type ApprovedMentor = {
//   id: string;
//   name: string;
//   email: string;
//   country: string | null;
//   countryCode: string | null;
//   mobileNumber: string | null;
//   createdAt: Date;
// };

// function formatPhone(countryCode?: string | null, mobileNumber?: string | null) {
//   if (!countryCode && !mobileNumber) return "Not added";
//   if (countryCode && mobileNumber) return `${countryCode} ${mobileNumber}`;
//   return mobileNumber || countryCode || "Not added";
// }

// export default async function AdminMentorsPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   const pendingMentors: PendingMentor[] = await prisma.user.findMany({
//     where: {
//       role: "MENTOR",
//       mentorStatus: "PENDING",
//     },
//     orderBy: { createdAt: "desc" },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       experience: true,
//       bio: true,
//       country: true,
//       countryCode: true,
//       mobileNumber: true,
//       emailVerified: true,
//       createdAt: true,
//     },
//   });

//   const approvedMentorsCount = await prisma.user.count({
//     where: {
//       role: "MENTOR",
//       mentorStatus: "APPROVED",
//     },
//   });

//   const approvedMentors: ApprovedMentor[] = await prisma.user.findMany({
//     where: {
//       role: "MENTOR",
//       mentorStatus: "APPROVED",
//     },
//     orderBy: { createdAt: "desc" },
//     take: 6,
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       country: true,
//       countryCode: true,
//       mobileNumber: true,
//       createdAt: true,
//     },
//   });

//   async function approveMentor(mentorId: string) {
//     "use server";

//     await prisma.user.update({
//       where: { id: mentorId },
//       data: {
//         role: "MENTOR",
//         mentorStatus: "APPROVED",
//       },
//     });

//     await prisma.notification.create({
//       data: {
//         userId: mentorId,
//         title: "Mentor Approved 🎉",
//         message:
//           "Your mentor account has been approved! You can now access your mentor dashboard.",
//         type: "SYSTEM",
//       },
//     });
//   }

//   return (
//     <main className="space-y-6 pb-8">
//       <section className="sticky top-0 z-10 -mx-1 bg-[linear-gradient(180deg,rgba(248,250,252,0.98)_0%,rgba(248,250,252,0.92)_70%,rgba(248,250,252,0)_100%)] px-1 pb-4">
//         <div className="grid gap-4 md:grid-cols-3">
//           <MetricCard
//             title="Pending Applications"
//             value={pendingMentors.length}
//             subtitle="Mentor applicants awaiting approval"
//           />
//           <MetricCard
//             title="Approved Mentors"
//             value={approvedMentorsCount}
//             subtitle="Total approved mentors"
//           />
//           <MetricCard
//             title="Visible Snapshot"
//             value={approvedMentors.length}
//             subtitle="Approved mentors shown below"
//           />
//         </div>
//       </section>

//       <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
//         <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
//               Application Queue
//             </p>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//               Pending Mentor Applications
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Review actual mentor applicants only.
//             </p>
//           </div>

//           <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
//             {pendingMentors.length} application
//             {pendingMentors.length === 1 ? "" : "s"}
//           </div>
//         </div>

//         {pendingMentors.length === 0 ? (
//           <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//             <p className="text-slate-600">No pending mentor applications.</p>
//           </div>
//         ) : (
//           <div className="grid gap-6">
//             {pendingMentors.map((mentor) => (
//               <div
//                 key={mentor.id}
//                 className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
//               >
//                 <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
//                   <div className="max-w-2xl space-y-4">
//                     <div>
//                       <div className="flex flex-wrap items-center gap-3">
//                         <h3 className="text-xl font-semibold text-slate-900">
//                           {mentor.name}
//                         </h3>

//                         <span
//                           className={`rounded-full px-3 py-1 text-xs font-semibold ${
//                             mentor.emailVerified
//                               ? "bg-emerald-50 text-emerald-700"
//                               : "bg-amber-50 text-amber-700"
//                           }`}
//                         >
//                           {mentor.emailVerified ? "Email Verified" : "Email Not Verified"}
//                         </span>
//                       </div>

//                       <p className="mt-1 text-sm text-slate-500">
//                         {mentor.email}
//                       </p>
//                     </div>

//                     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                       <InfoBlock
//                         label="Experience"
//                         value={
//                           mentor.experience
//                             ? `${mentor.experience} years`
//                             : "Not provided"
//                         }
//                       />
//                       <InfoBlock
//                         label="Country"
//                         value={mentor.country || "Not added"}
//                       />
//                       <InfoBlock
//                         label="Phone"
//                         value={formatPhone(mentor.countryCode, mentor.mobileNumber)}
//                       />
//                     </div>

//                     {mentor.bio && (
//                       <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//                         <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
//                           Bio
//                         </p>
//                         <p className="mt-2 text-sm leading-6 text-slate-700">
//                           {mentor.bio}
//                         </p>
//                       </div>
//                     )}

//                     <p className="text-xs text-slate-500">
//                       Applied on{" "}
//                       {new Date(mentor.createdAt).toLocaleDateString("en-GB", {
//                         day: "numeric",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                     </p>
//                   </div>

//                   <div className="flex flex-col gap-3">
//                     <form action={approveMentor.bind(null, mentor.id)}>
//                       <button
//                         type="submit"
//                         className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white transition hover:bg-emerald-700"
//                       >
//                         Approve Mentor
//                       </button>
//                     </form>

//                     <button
//                       className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
//                       type="button"
//                     >
//                       Reject
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
//         <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
//               Mentor Snapshot
//             </p>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//               Approved Mentors
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Latest mentors already approved and active on the platform.
//             </p>
//           </div>

//           <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
//             Showing {approvedMentors.length} of {approvedMentorsCount}
//           </div>
//         </div>

//         {approvedMentors.length === 0 ? (
//           <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//             <p className="text-slate-600">No approved mentors yet.</p>
//           </div>
//         ) : (
//           <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//             {approvedMentors.map((mentor) => (
//               <div
//                 key={mentor.id}
//                 className="rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5 shadow-sm"
//               >
//                 <div className="flex items-start justify-between gap-3">
//                   <div>
//                     <p className="text-lg font-semibold text-slate-900">
//                       {mentor.name}
//                     </p>
//                     <p className="mt-1 text-sm text-slate-500">{mentor.email}</p>
//                   </div>

//                   <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
//                     Approved
//                   </span>
//                 </div>

//                 <div className="mt-4 space-y-2 text-sm text-slate-600">
//                   <p>
//                     <span className="font-medium text-slate-800">Country:</span>{" "}
//                     {mentor.country || "Not added"}
//                   </p>
//                   <p>
//                     <span className="font-medium text-slate-800">Phone:</span>{" "}
//                     {formatPhone(mentor.countryCode, mentor.mobileNumber)}
//                   </p>
//                   <p>
//                     <span className="font-medium text-slate-800">Joined:</span>{" "}
//                     {new Date(mentor.createdAt).toLocaleDateString("en-GB", {
//                       day: "numeric",
//                       month: "short",
//                       year: "numeric",
//                     })}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }

// function MetricCard({
//   title,
//   value,
//   subtitle,
// }: {
//   title: string;
//   value: number;
//   subtitle: string;
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//       <p className="text-sm font-medium text-slate-500">{title}</p>
//       <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//         {value}
//       </p>
//       <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
//         {subtitle}
//       </p>
//     </div>
//   );
// }

// function InfoBlock({
//   label,
//   value,
// }: {
//   label: string;
//   value: string;
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-4">
//       <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
//         {label}
//       </p>
//       <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
//     </div>
//   );
// }



import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PendingMentor = {
  id: string;
  name: string;
  email: string;
  experience: string | null;
  bio: string | null;
  country: string | null;
  countryCode: string | null;
  mobileNumber: string | null;
  emailVerified: boolean;
  createdAt: Date;
};

type ApprovedMentor = {
  id: string;
  name: string;
  email: string;
  country: string | null;
  countryCode: string | null;
  mobileNumber: string | null;
  createdAt: Date;
};

function formatPhone(countryCode?: string | null, mobileNumber?: string | null) {
  if (!countryCode && !mobileNumber) return "Not added";
  if (countryCode && mobileNumber) return `${countryCode} ${mobileNumber}`;
  return mobileNumber || countryCode || "Not added";
}

export default async function AdminMentorsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const pendingMentors: PendingMentor[] = await prisma.user.findMany({
    where: {
      role: "MENTOR",
      mentorStatus: "PENDING",
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      experience: true,
      bio: true,
      country: true,
      countryCode: true,
      mobileNumber: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  const approvedMentorsCount = await prisma.user.count({
    where: {
      role: "MENTOR",
      mentorStatus: "APPROVED",
    },
  });

  const approvedMentors: ApprovedMentor[] = await prisma.user.findMany({
    where: {
      role: "MENTOR",
      mentorStatus: "APPROVED",
    },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: {
      id: true,
      name: true,
      email: true,
      country: true,
      countryCode: true,
      mobileNumber: true,
      createdAt: true,
    },
  });

  async function approveMentor(mentorId: string) {
    "use server";

    await prisma.user.update({
      where: { id: mentorId },
      data: {
        role: "MENTOR",
        mentorStatus: "APPROVED",
      },
    });

    await prisma.notification.create({
      data: {
        userId: mentorId,
        title: "Mentor Approved 🎉",
        message:
          "Your mentor account has been approved! You can now access your mentor dashboard.",
        type: "SYSTEM",
      },
    });
  }

  return (
    <main className="space-y-8 pb-8">
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Pending Applications"
          value={pendingMentors.length}
          subtitle="Mentor applicants awaiting approval"
        />
        <MetricCard
          title="Approved Mentors"
          value={approvedMentorsCount}
          subtitle="Total approved mentors"
        />
        <MetricCard
          title="Visible Snapshot"
          value={approvedMentors.length}
          subtitle="Approved mentors shown below"
        />
      </section>

      <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Application Queue
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Pending Mentor Applications
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review actual mentor applicants only.
            </p>
          </div>

          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
            {pendingMentors.length} application
            {pendingMentors.length === 1 ? "" : "s"}
          </div>
        </div>

        {pendingMentors.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <p className="text-slate-600">No pending mentor applications.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-2xl space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold text-slate-900">
                          {mentor.name}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            mentor.emailVerified
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {mentor.emailVerified ? "Email Verified" : "Email Not Verified"}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {mentor.email}
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <InfoBlock
                        label="Experience"
                        value={
                          mentor.experience
                            ? `${mentor.experience} years`
                            : "Not provided"
                        }
                      />
                      <InfoBlock
                        label="Country"
                        value={mentor.country || "Not added"}
                      />
                      <InfoBlock
                        label="Phone"
                        value={formatPhone(mentor.countryCode, mentor.mobileNumber)}
                      />
                    </div>

                    {mentor.bio && (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Bio
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {mentor.bio}
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-slate-500">
                      Applied on{" "}
                      {new Date(mentor.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <form action={approveMentor.bind(null, mentor.id)}>
                      <button
                        type="submit"
                        className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white transition hover:bg-emerald-700"
                      >
                        Approve Mentor
                      </button>
                    </form>

                    <button
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                      type="button"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Mentor Snapshot
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Approved Mentors
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Latest mentors already approved and active on the platform.
            </p>
          </div>

          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
            Showing {approvedMentors.length} of {approvedMentorsCount}
          </div>
        </div>

        {approvedMentors.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <p className="text-slate-600">No approved mentors yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {approvedMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      {mentor.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{mentor.email}</p>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Approved
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>
                    <span className="font-medium text-slate-800">Country:</span>{" "}
                    {mentor.country || "Not added"}
                  </p>
                  <p>
                    <span className="font-medium text-slate-800">Phone:</span>{" "}
                    {formatPhone(mentor.countryCode, mentor.mobileNumber)}
                  </p>
                  <p>
                    <span className="font-medium text-slate-800">Joined:</span>{" "}
                    {new Date(mentor.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: number;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}

function InfoBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}
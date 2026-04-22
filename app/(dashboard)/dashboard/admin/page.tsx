


// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// type Mentor = {
//   id: string;
//   name: string;
//   email: string;
//   country: string | null;
//   countryCode: string | null;
//   mobileNumber: string | null;
// };

// type Volunteer = {
//   id: string;
//   name: string;
//   email: string;
//   country: string | null;
//   countryCode: string | null;
//   mobileNumber: string | null;
//   skills: string | null;
//   experience: string | null;
//   createdAt: Date;
// };

// function formatPhone(countryCode?: string | null, mobileNumber?: string | null) {
//   if (!countryCode && !mobileNumber) return "Not added";
//   if (countryCode && mobileNumber) return `${countryCode} ${mobileNumber}`;
//   return mobileNumber || countryCode || "Not added";
// }

// function parsePrimarySkill(skills: string | null) {
//   if (!skills) return "Not added";
//   const first = skills
//     .split(",")
//     .map((skill) => skill.trim())
//     .filter(Boolean)[0];

//   return first || "Not added";
// }

// export default async function AdminDashboard() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   const mentors: Mentor[] = await prisma.user.findMany({
//     where: { role: "MENTOR" },
//     orderBy: { createdAt: "desc" },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       country: true,
//       countryCode: true,
//       mobileNumber: true,
//     },
//   });

//   const recentVolunteers: Volunteer[] = await prisma.user.findMany({
//     where: { role: "VOLUNTEER" },
//     orderBy: { createdAt: "desc" },
//     take: 10,
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       country: true,
//       countryCode: true,
//       mobileNumber: true,
//       skills: true,
//       experience: true,
//       createdAt: true,
//     },
//   });

//   const volunteers = await prisma.user.count({
//     where: { role: "VOLUNTEER" },
//   });

//   const organizations = await prisma.user.count({
//     where: { role: "ORGANIZATION" },
//   });

//   const mentorsCount = await prisma.user.count({
//     where: { role: "MENTOR" },
//   });

//   const volunteersWithPhone = await prisma.user.count({
//     where: {
//       role: "VOLUNTEER",
//       mobileNumber: { not: null },
//     },
//   });

//   const volunteersWithCountry = await prisma.user.count({
//     where: {
//       role: "VOLUNTEER",
//       country: { not: null },
//     },
//   });

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-7xl space-y-8">
//         {/* HERO */}
//         <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
//           <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 px-6 py-8 text-white sm:px-8">
//             <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">
//               Platform Control Center
//             </p>
//             <h1 className="mt-2 text-3xl font-bold tracking-tight">
//               Admin Dashboard
//             </h1>
//             <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">
//               Manage mentors, monitor volunteer profile completion, and keep
//               visibility across key BuildUp users and platform activity.
//             </p>
//           </div>

//           <div className="grid gap-4 px-6 py-6 sm:px-8 md:grid-cols-2 xl:grid-cols-5">
//             <Stat title="Volunteers" value={volunteers} />
//             <Stat title="Organizations" value={organizations} />
//             <Stat title="Mentors" value={mentorsCount} />
//             <Stat title="Volunteers with Country" value={volunteersWithCountry} />
//             <Stat title="Volunteers with Phone" value={volunteersWithPhone} />
//           </div>
//         </section>

//         {/* RECENT VOLUNTEERS */}
//         <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
//           <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//             <div>
//               <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
//                 User Oversight
//               </p>
//               <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//                 Recent Volunteers
//               </h2>
//               <p className="mt-1 text-sm text-slate-500">
//                 Latest volunteer accounts with profile and contact visibility for admin review.
//               </p>
//             </div>

//             <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
//               Showing {recentVolunteers.length} recent volunteer
//               {recentVolunteers.length === 1 ? "" : "s"}
//             </div>
//           </div>

//           {recentVolunteers.length === 0 ? (
//             <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//               <p className="text-slate-600">No volunteers found yet.</p>
//             </div>
//           ) : (
//             <div className="overflow-hidden rounded-2xl border border-slate-200">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-slate-200">
//                   <thead className="bg-slate-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Volunteer
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Country
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Mobile Number
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Primary Skill
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Experience
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Joined
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-slate-200 bg-white">
//                     {recentVolunteers.map((volunteer) => (
//                       <tr key={volunteer.id} className="hover:bg-slate-50/70">
//                         <td className="px-4 py-4 align-top">
//                           <div>
//                             <p className="font-semibold text-slate-900">
//                               {volunteer.name}
//                             </p>
//                             <p className="mt-1 text-sm text-slate-500">
//                               {volunteer.email}
//                             </p>
//                           </div>
//                         </td>

//                         <td className="px-4 py-4 align-top text-sm text-slate-700">
//                           {volunteer.country || "Not added"}
//                         </td>

//                         <td className="px-4 py-4 align-top text-sm text-slate-700">
//                           {formatPhone(
//                             volunteer.countryCode,
//                             volunteer.mobileNumber
//                           )}
//                         </td>

//                         <td className="px-4 py-4 align-top text-sm text-slate-700">
//                           {parsePrimarySkill(volunteer.skills)}
//                         </td>

//                         <td className="px-4 py-4 align-top text-sm text-slate-700">
//                           {volunteer.experience || "Not added"}
//                         </td>

//                         <td className="px-4 py-4 align-top text-sm text-slate-500">
//                           {new Date(volunteer.createdAt).toLocaleDateString("en-GB", {
//                             day: "numeric",
//                             month: "short",
//                             year: "numeric",
//                           })}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </section>

//         {/* APPROVED MENTORS */}
//         <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
//           <div className="mb-6">
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
//               Mentor Management
//             </p>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//               Approved Mentors
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Mentors already approved and active on the platform.
//             </p>
//           </div>

//           {mentors.length === 0 ? (
//             <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//               <p className="text-slate-600">No mentors yet.</p>
//             </div>
//           ) : (
//             <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//               {mentors.map((mentor) => (
//                 <div
//                   key={mentor.id}
//                   className="rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5 shadow-sm"
//                 >
//                   <div className="flex items-start justify-between gap-3">
//                     <div>
//                       <p className="text-lg font-semibold text-slate-900">
//                         {mentor.name}
//                       </p>
//                       <p className="mt-1 text-sm text-slate-500">{mentor.email}</p>
//                     </div>

//                     <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
//                       Approved
//                     </span>
//                   </div>

//                   <div className="mt-4 space-y-2 text-sm text-slate-600">
//                     <p>
//                       <span className="font-medium text-slate-800">Country:</span>{" "}
//                       {mentor.country || "Not added"}
//                     </p>
//                     <p>
//                       <span className="font-medium text-slate-800">Phone:</span>{" "}
//                       {formatPhone(mentor.countryCode, mentor.mobileNumber)}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </div>
//     </main>
//   );
// }

// function Stat({ title, value }: { title: string; value: number }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//       <p className="text-sm font-medium text-slate-500">{title}</p>
//       <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//         {value}
//       </p>
//     </div>
//   );
// }





// import Link from "next/link";
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// type Mentor = {
//   id: string;
//   name: string;
//   email: string;
//   country: string | null;
//   countryCode: string | null;
//   mobileNumber: string | null;
// };

// type Volunteer = {
//   id: string;
//   name: string;
//   email: string;
//   country: string | null;
//   countryCode: string | null;
//   mobileNumber: string | null;
//   skills: string | null;
//   experience: string | null;
//   createdAt: Date;
// };

// function formatPhone(countryCode?: string | null, mobileNumber?: string | null) {
//   if (!countryCode && !mobileNumber) return "Not added";
//   if (countryCode && mobileNumber) return `${countryCode} ${mobileNumber}`;
//   return mobileNumber || countryCode || "Not added";
// }

// function parsePrimarySkill(skills: string | null) {
//   if (!skills) return "Not added";
//   const first = skills
//     .split(",")
//     .map((skill) => skill.trim())
//     .filter(Boolean)[0];

//   return first || "Not added";
// }

// export default async function AdminDashboard() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   const mentors: Mentor[] = await prisma.user.findMany({
//     where: { role: "MENTOR" },
//     orderBy: { createdAt: "desc" },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       country: true,
//       countryCode: true,
//       mobileNumber: true,
//     },
//   });

//   const recentVolunteers: Volunteer[] = await prisma.user.findMany({
//     where: { role: "VOLUNTEER" },
//     orderBy: { createdAt: "desc" },
//     take: 10,
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       country: true,
//       countryCode: true,
//       mobileNumber: true,
//       skills: true,
//       experience: true,
//       createdAt: true,
//     },
//   });

//   const volunteers = await prisma.user.count({
//     where: { role: "VOLUNTEER" },
//   });

//   const organizations = await prisma.user.count({
//     where: { role: "ORGANIZATION" },
//   });

//   const mentorsCount = await prisma.user.count({
//     where: { role: "MENTOR" },
//   });

//   const volunteersWithPhone = await prisma.user.count({
//     where: {
//       role: "VOLUNTEER",
//       mobileNumber: { not: null },
//     },
//   });

//   const volunteersWithCountry = await prisma.user.count({
//     where: {
//       role: "VOLUNTEER",
//       country: { not: null },
//     },
//   });

//   const supportOpen = await prisma.supportMessage.count({
//     where: { status: "OPEN" },
//   });

//   const supportInProgress = await prisma.supportMessage.count({
//     where: { status: "IN_PROGRESS" },
//   });

//   const supportResolved = await prisma.supportMessage.count({
//     where: { status: "RESOLVED" },
//   });

//   const recentSupport = await prisma.supportMessage.findMany({
//     orderBy: { createdAt: "desc" },
//     take: 5,
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       subject: true,
//       category: true,
//       status: true,
//       createdAt: true,
//     },
//   });

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-7xl space-y-8">
//         {/* HERO */}
//         <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
//           <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 px-6 py-8 text-white sm:px-8">
//             <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">
//               Platform Control Center
//             </p>
//             <h1 className="mt-2 text-3xl font-bold tracking-tight">
//               Admin Dashboard
//             </h1>
//             <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">
//               Manage mentors, monitor volunteer profile completion, review
//               support activity, and keep visibility across key BuildUp users and
//               platform operations.
//             </p>
//           </div>

//           <div className="grid gap-4 px-6 py-6 sm:px-8 md:grid-cols-2 xl:grid-cols-5">
//             <Stat title="Volunteers" value={volunteers} />
//             <Stat title="Organizations" value={organizations} />
//             <Stat title="Mentors" value={mentorsCount} />
//             <Stat title="Volunteers with Country" value={volunteersWithCountry} />
//             <Stat title="Volunteers with Phone" value={volunteersWithPhone} />
//           </div>
//         </section>

//         {/* SUPPORT OVERVIEW */}
//         <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
//           <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
//             <div>
//               <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
//                 Support Management
//               </p>
//               <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//                 Support Inbox Overview
//               </h2>
//               <p className="mt-1 text-sm text-slate-500">
//                 Track incoming support requests and jump straight into the
//                 support inbox.
//               </p>
//             </div>

//             <Link
//               href="/dashboard/admin/support"
//               className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
//             >
//               Open Support Inbox
//             </Link>
//           </div>

//           <div className="grid gap-4 md:grid-cols-3">
//             <StatusCard
//               title="Open Requests"
//               value={supportOpen}
//               tone="blue"
//             />
//             <StatusCard
//               title="In Progress"
//               value={supportInProgress}
//               tone="amber"
//             />
//             <StatusCard
//               title="Resolved"
//               value={supportResolved}
//               tone="emerald"
//             />
//           </div>

//           <div className="mt-6">
//             {recentSupport.length === 0 ? (
//               <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
//                 <p className="text-slate-600">No support messages yet.</p>
//               </div>
//             ) : (
//               <div className="overflow-hidden rounded-2xl border border-slate-200">
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-slate-200">
//                     <thead className="bg-slate-50">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                           Subject
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                           Sender
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                           Category
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                           Status
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                           Date
//                         </th>
//                       </tr>
//                     </thead>

//                     <tbody className="divide-y divide-slate-200 bg-white">
//                       {recentSupport.map((item) => (
//                         <tr key={item.id} className="hover:bg-slate-50/70">
//                           <td className="px-4 py-4 align-top">
//                             <p className="font-semibold text-slate-900">
//                               {item.subject}
//                             </p>
//                           </td>

//                           <td className="px-4 py-4 align-top">
//                             <p className="text-sm font-medium text-slate-800">
//                               {item.name}
//                             </p>
//                             <p className="mt-1 text-sm text-slate-500">
//                               {item.email}
//                             </p>
//                           </td>

//                           <td className="px-4 py-4 align-top text-sm text-slate-700">
//                             {item.category || "Not specified"}
//                           </td>

//                           <td className="px-4 py-4 align-top">
//                             <span
//                               className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
//                                 item.status === "OPEN"
//                                   ? "bg-blue-50 text-blue-700"
//                                   : item.status === "IN_PROGRESS"
//                                   ? "bg-amber-50 text-amber-700"
//                                   : "bg-emerald-50 text-emerald-700"
//                               }`}
//                             >
//                               {item.status.replace("_", " ")}
//                             </span>
//                           </td>

//                           <td className="px-4 py-4 align-top text-sm text-slate-500">
//                             {new Date(item.createdAt).toLocaleDateString("en-GB", {
//                               day: "numeric",
//                               month: "short",
//                               year: "numeric",
//                             })}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
//           </div>
//         </section>

//         {/* RECENT VOLUNTEERS */}
//         <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
//           <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//             <div>
//               <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
//                 User Oversight
//               </p>
//               <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//                 Recent Volunteers
//               </h2>
//               <p className="mt-1 text-sm text-slate-500">
//                 Latest volunteer accounts with profile and contact visibility for
//                 admin review.
//               </p>
//             </div>

//             <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
//               Showing {recentVolunteers.length} recent volunteer
//               {recentVolunteers.length === 1 ? "" : "s"}
//             </div>
//           </div>

//           {recentVolunteers.length === 0 ? (
//             <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//               <p className="text-slate-600">No volunteers found yet.</p>
//             </div>
//           ) : (
//             <div className="overflow-hidden rounded-2xl border border-slate-200">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-slate-200">
//                   <thead className="bg-slate-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Volunteer
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Country
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Mobile Number
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Primary Skill
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Experience
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Joined
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-slate-200 bg-white">
//                     {recentVolunteers.map((volunteer) => (
//                       <tr key={volunteer.id} className="hover:bg-slate-50/70">
//                         <td className="px-4 py-4 align-top">
//                           <div>
//                             <p className="font-semibold text-slate-900">
//                               {volunteer.name}
//                             </p>
//                             <p className="mt-1 text-sm text-slate-500">
//                               {volunteer.email}
//                             </p>
//                           </div>
//                         </td>

//                         <td className="px-4 py-4 align-top text-sm text-slate-700">
//                           {volunteer.country || "Not added"}
//                         </td>

//                         <td className="px-4 py-4 align-top text-sm text-slate-700">
//                           {formatPhone(
//                             volunteer.countryCode,
//                             volunteer.mobileNumber
//                           )}
//                         </td>

//                         <td className="px-4 py-4 align-top text-sm text-slate-700">
//                           {parsePrimarySkill(volunteer.skills)}
//                         </td>

//                         <td className="px-4 py-4 align-top text-sm text-slate-700">
//                           {volunteer.experience || "Not added"}
//                         </td>

//                         <td className="px-4 py-4 align-top text-sm text-slate-500">
//                           {new Date(volunteer.createdAt).toLocaleDateString("en-GB", {
//                             day: "numeric",
//                             month: "short",
//                             year: "numeric",
//                           })}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </section>

//         {/* APPROVED MENTORS */}
//         <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
//           <div className="mb-6">
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
//               Mentor Management
//             </p>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//               Approved Mentors
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Mentors already approved and active on the platform.
//             </p>
//           </div>

//           {mentors.length === 0 ? (
//             <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//               <p className="text-slate-600">No mentors yet.</p>
//             </div>
//           ) : (
//             <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//               {mentors.map((mentor) => (
//                 <div
//                   key={mentor.id}
//                   className="rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5 shadow-sm"
//                 >
//                   <div className="flex items-start justify-between gap-3">
//                     <div>
//                       <p className="text-lg font-semibold text-slate-900">
//                         {mentor.name}
//                       </p>
//                       <p className="mt-1 text-sm text-slate-500">{mentor.email}</p>
//                     </div>

//                     <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
//                       Approved
//                     </span>
//                   </div>

//                   <div className="mt-4 space-y-2 text-sm text-slate-600">
//                     <p>
//                       <span className="font-medium text-slate-800">Country:</span>{" "}
//                       {mentor.country || "Not added"}
//                     </p>
//                     <p>
//                       <span className="font-medium text-slate-800">Phone:</span>{" "}
//                       {formatPhone(mentor.countryCode, mentor.mobileNumber)}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </div>
//     </main>
//   );
// }

// function Stat({ title, value }: { title: string; value: number }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//       <p className="text-sm font-medium text-slate-500">{title}</p>
//       <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//         {value}
//       </p>
//     </div>
//   );
// }

// function StatusCard({
//   title,
//   value,
//   tone,
// }: {
//   title: string;
//   value: number;
//   tone: "blue" | "amber" | "emerald";
// }) {
//   const toneMap = {
//     blue: "from-blue-50 to-white text-blue-700 border-blue-100",
//     amber: "from-amber-50 to-white text-amber-700 border-amber-100",
//     emerald: "from-emerald-50 to-white text-emerald-700 border-emerald-100",
//   };

//   return (
//     <div
//       className={`rounded-2xl border bg-gradient-to-br p-5 shadow-sm ${toneMap[tone]}`}
//     >
//       <p className="text-sm font-medium text-slate-500">{title}</p>
//       <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//         {value}
//       </p>
//     </div>
//   );
// }





// import Link from "next/link";
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// type Mentor = {
//   id: string;
//   name: string;
//   email: string;
//   country: string | null;
//   countryCode: string | null;
//   mobileNumber: string | null;
// };

// type Volunteer = {
//   id: string;
//   name: string;
//   email: string;
//   country: string | null;
//   countryCode: string | null;
//   mobileNumber: string | null;
//   skills: string | null;
//   experience: string | null;
//   createdAt: Date;
// };

// function formatPhone(countryCode?: string | null, mobileNumber?: string | null) {
//   if (!countryCode && !mobileNumber) return "Not added";
//   if (countryCode && mobileNumber) return `${countryCode} ${mobileNumber}`;
//   return mobileNumber || countryCode || "Not added";
// }

// function parsePrimarySkill(skills: string | null) {
//   if (!skills) return "Not added";
//   const first = skills
//     .split(",")
//     .map((skill) => skill.trim())
//     .filter(Boolean)[0];

//   return first || "Not added";
// }

// export default async function AdminDashboard() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   const mentors: Mentor[] = await prisma.user.findMany({
//     where: { role: "MENTOR" },
//     orderBy: { createdAt: "desc" },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       country: true,
//       countryCode: true,
//       mobileNumber: true,
//     },
//   });

//   const recentVolunteers: Volunteer[] = await prisma.user.findMany({
//     where: { role: "VOLUNTEER" },
//     orderBy: { createdAt: "desc" },
//     take: 10,
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       country: true,
//       countryCode: true,
//       mobileNumber: true,
//       skills: true,
//       experience: true,
//       createdAt: true,
//     },
//   });

//   const volunteers = await prisma.user.count({
//     where: { role: "VOLUNTEER" },
//   });

//   const organizations = await prisma.user.count({
//     where: { role: "ORGANIZATION" },
//   });

//   const mentorsCount = await prisma.user.count({
//     where: { role: "MENTOR" },
//   });

//   const volunteersWithPhone = await prisma.user.count({
//     where: {
//       role: "VOLUNTEER",
//       mobileNumber: { not: null },
//     },
//   });

//   const volunteersWithCountry = await prisma.user.count({
//     where: {
//       role: "VOLUNTEER",
//       country: { not: null },
//     },
//   });

//   const supportOpen = await prisma.supportMessage.count({
//     where: { status: "OPEN" },
//   });

//   const supportInProgress = await prisma.supportMessage.count({
//     where: { status: "IN_PROGRESS" },
//   });

//   const supportResolved = await prisma.supportMessage.count({
//     where: { status: "RESOLVED" },
//   });

//   const recentSupport = await prisma.supportMessage.findMany({
//     orderBy: { createdAt: "desc" },
//     take: 5,
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       subject: true,
//       category: true,
//       status: true,
//       createdAt: true,
//     },
//   });

//   return (
//     <main className="space-y-8">
//       {/* Executive Hero */}
//       <section className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
//         <div className="relative overflow-hidden bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_45%,#1d4ed8_100%)] px-6 py-8 text-white sm:px-8 lg:px-10">
//           <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
//           <div className="absolute bottom-0 right-10 h-28 w-28 rounded-full bg-blue-300/10 blur-3xl" />

//           <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
//             <div className="max-w-3xl">
//               <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100/90">
//                 Platform Control Center
//               </p>
//               <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
//                 Admin Dashboard
//               </h1>
//               <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
//                 Premium operational visibility across users, mentors, support, and
//                 platform performance — organized for fast executive review.
//               </p>
//             </div>

//             <div className="grid gap-3 sm:grid-cols-2">
//               <QuickAction
//                 href="/dashboard/admin/support"
//                 label="Open Support Inbox"
//               />
//               <QuickAction href="/dashboard/admin" label="Refresh Overview" />
//             </div>
//           </div>
//         </div>

//         <div className="grid gap-4 px-6 py-6 sm:px-8 xl:grid-cols-5">
//           <MetricCard
//             title="Volunteers"
//             value={volunteers}
//             tone="blue"
//             subtitle="Registered learners"
//           />
//           <MetricCard
//             title="Organizations"
//             value={organizations}
//             tone="violet"
//             subtitle="Project owners"
//           />
//           <MetricCard
//             title="Mentors"
//             value={mentorsCount}
//             tone="emerald"
//             subtitle="Approved guides"
//           />
//           <MetricCard
//             title="With Country"
//             value={volunteersWithCountry}
//             tone="amber"
//             subtitle="Volunteer profiles"
//           />
//           <MetricCard
//             title="With Phone"
//             value={volunteersWithPhone}
//             tone="rose"
//             subtitle="Volunteer contacts"
//           />
//         </div>
//       </section>

//       {/* Support + Mentor side by side */}
//       <section className="grid gap-8 2xl:grid-cols-[1.2fr_0.8fr]">
//         {/* Support Overview */}
//         <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
//           <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
//             <div>
//               <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
//                 Support Management
//               </p>
//               <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//                 Support Inbox Overview
//               </h2>
//               <p className="mt-1 text-sm text-slate-500">
//                 Track incoming support activity and move into the inbox quickly.
//               </p>
//             </div>

//             <Link
//               href="/dashboard/admin/support"
//               className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
//             >
//               Open Support Inbox
//             </Link>
//           </div>

//           <div className="grid gap-4 md:grid-cols-3">
//             <StatusCard title="Open Requests" value={supportOpen} tone="blue" />
//             <StatusCard
//               title="In Progress"
//               value={supportInProgress}
//               tone="amber"
//             />
//             <StatusCard
//               title="Resolved"
//               value={supportResolved}
//               tone="emerald"
//             />
//           </div>

//           <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200">
//             {recentSupport.length === 0 ? (
//               <div className="bg-slate-50 px-6 py-12 text-center">
//                 <p className="text-slate-600">No support messages yet.</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-slate-200">
//                   <thead className="bg-slate-50/80">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Subject
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Sender
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Category
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Status
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                         Date
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-slate-200 bg-white">
//                     {recentSupport.map((item) => (
//                       <tr key={item.id} className="hover:bg-slate-50/70">
//                         <td className="px-4 py-4 align-top">
//                           <p className="font-semibold text-slate-900">
//                             {item.subject}
//                           </p>
//                         </td>

//                         <td className="px-4 py-4 align-top">
//                           <p className="text-sm font-medium text-slate-800">
//                             {item.name}
//                           </p>
//                           <p className="mt-1 text-sm text-slate-500">
//                             {item.email}
//                           </p>
//                         </td>

//                         <td className="px-4 py-4 align-top text-sm text-slate-700">
//                           {item.category || "Not specified"}
//                         </td>

//                         <td className="px-4 py-4 align-top">
//                           <span
//                             className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
//                               item.status === "OPEN"
//                                 ? "bg-blue-50 text-blue-700"
//                                 : item.status === "IN_PROGRESS"
//                                 ? "bg-amber-50 text-amber-700"
//                                 : "bg-emerald-50 text-emerald-700"
//                             }`}
//                           >
//                             {item.status.replace("_", " ")}
//                           </span>
//                         </td>

//                         <td className="px-4 py-4 align-top text-sm text-slate-500">
//                           {new Date(item.createdAt).toLocaleDateString("en-GB", {
//                             day: "numeric",
//                             month: "short",
//                             year: "numeric",
//                           })}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </section>

//         {/* Mentor Snapshot */}
//         <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
//           <div className="mb-6">
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
//               Mentor Management
//             </p>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//               Approved Mentors
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Mentors currently approved and active on the platform.
//             </p>
//           </div>

//           {mentors.length === 0 ? (
//             <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//               <p className="text-slate-600">No mentors yet.</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {mentors.slice(0, 6).map((mentor) => (
//                 <div
//                   key={mentor.id}
//                   className="rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5 shadow-sm"
//                 >
//                   <div className="flex items-start justify-between gap-3">
//                     <div>
//                       <p className="text-lg font-semibold text-slate-900">
//                         {mentor.name}
//                       </p>
//                       <p className="mt-1 text-sm text-slate-500">{mentor.email}</p>
//                     </div>

//                     <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
//                       Approved
//                     </span>
//                   </div>

//                   <div className="mt-4 space-y-2 text-sm text-slate-600">
//                     <p>
//                       <span className="font-medium text-slate-800">Country:</span>{" "}
//                       {mentor.country || "Not added"}
//                     </p>
//                     <p>
//                       <span className="font-medium text-slate-800">Phone:</span>{" "}
//                       {formatPhone(mentor.countryCode, mentor.mobileNumber)}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </section>

//       {/* Recent Volunteers */}
//       <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
//         <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
//               User Oversight
//             </p>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//               Recent Volunteers
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Latest volunteer accounts with profile and contact visibility for admin review.
//             </p>
//           </div>

//           <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
//             Showing {recentVolunteers.length} recent volunteer
//             {recentVolunteers.length === 1 ? "" : "s"}
//           </div>
//         </div>

//         {recentVolunteers.length === 0 ? (
//           <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//             <p className="text-slate-600">No volunteers found yet.</p>
//           </div>
//         ) : (
//           <div className="overflow-hidden rounded-[24px] border border-slate-200">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-slate-200">
//                 <thead className="bg-slate-50/80">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Volunteer
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Country
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Mobile Number
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Primary Skill
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Experience
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Joined
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-200 bg-white">
//                   {recentVolunteers.map((volunteer) => (
//                     <tr key={volunteer.id} className="hover:bg-slate-50/70">
//                       <td className="px-4 py-4 align-top">
//                         <div>
//                           <p className="font-semibold text-slate-900">
//                             {volunteer.name}
//                           </p>
//                           <p className="mt-1 text-sm text-slate-500">
//                             {volunteer.email}
//                           </p>
//                         </div>
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {volunteer.country || "Not added"}
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {formatPhone(volunteer.countryCode, volunteer.mobileNumber)}
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {parsePrimarySkill(volunteer.skills)}
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {volunteer.experience || "Not added"}
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-500">
//                         {new Date(volunteer.createdAt).toLocaleDateString("en-GB", {
//                           day: "numeric",
//                           month: "short",
//                           year: "numeric",
//                         })}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }

// function QuickAction({
//   href,
//   label,
// }: {
//   href: string;
//   label: string;
// }) {
//   return (
//     <Link
//       href={href}
//       className="inline-flex h-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
//     >
//       {label}
//     </Link>
//   );
// }

// function MetricCard({
//   title,
//   value,
//   subtitle,
//   tone,
// }: {
//   title: string;
//   value: number;
//   subtitle: string;
//   tone: "blue" | "violet" | "emerald" | "amber" | "rose";
// }) {
//   const toneMap = {
//     blue: "from-blue-50 to-white border-blue-100",
//     violet: "from-violet-50 to-white border-violet-100",
//     emerald: "from-emerald-50 to-white border-emerald-100",
//     amber: "from-amber-50 to-white border-amber-100",
//     rose: "from-rose-50 to-white border-rose-100",
//   };

//   return (
//     <div
//       className={`rounded-2xl border bg-gradient-to-br p-5 shadow-sm ${toneMap[tone]}`}
//     >
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

// function StatusCard({
//   title,
//   value,
//   tone,
// }: {
//   title: string;
//   value: number;
//   tone: "blue" | "amber" | "emerald";
// }) {
//   const toneMap = {
//     blue: "from-blue-50 to-white text-blue-700 border-blue-100",
//     amber: "from-amber-50 to-white text-amber-700 border-amber-100",
//     emerald: "from-emerald-50 to-white text-emerald-700 border-emerald-100",
//   };

//   return (
//     <div
//       className={`rounded-2xl border bg-gradient-to-br p-5 shadow-sm ${toneMap[tone]}`}
//     >
//       <p className="text-sm font-medium text-slate-500">{title}</p>
//       <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//         {value}
//       </p>
//     </div>
//   );
// }



import { redirect } from "next/navigation";

export default function AdminRootPage() {
  redirect("/dashboard/admin/volunteers");
}


// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import { SupportMessage } from "@prisma/client";

// /* ================= CONFIG ================= */

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// /* ================= TYPES ================= */

// // type SupportMessage = {
// //   id: string;
// //   name: string;
// //   email: string;
// //   subject: string;
// //   message: string;
// //   category: string | null;
// //   status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
// //   createdAt: Date;
// // };

// /* ================= PAGE ================= */

// export default async function AdminSupportPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   /* ================= DATA ================= */

//   const messages: SupportMessage[] =
//     await prisma.supportMessage.findMany({
//       orderBy: { createdAt: "desc" },
//     });

//   const openCount = messages.filter((m) => m.status === "OPEN").length;
//   const progressCount = messages.filter((m) => m.status === "IN_PROGRESS").length;
//   const resolvedCount = messages.filter((m) => m.status === "RESOLVED").length;

//   /* ================= SERVER ACTION ================= */

//   async function updateStatus(
//     id: string,
//     status: "OPEN" | "IN_PROGRESS" | "RESOLVED"
//   ) {
//     "use server";

//     await prisma.supportMessage.update({
//       where: { id },
//       data: { status },
//     });
//   }

//   /* ================= UI ================= */

//   return (
//     <main className="space-y-8">
//       {/* HERO */}
//       <section className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
//         <div className="relative overflow-hidden bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_45%,#2563eb_100%)] px-6 py-8 text-white sm:px-8 lg:px-10">
//           <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-3xl" />

//           <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100/90">
//             Support System
//           </p>

//           <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
//             Support Inbox
//           </h1>

//           <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
//             Manage user requests, track issues, and maintain high-quality
//             platform support with full visibility and control.
//           </p>
//         </div>

//         {/* METRICS */}
//         <div className="grid gap-4 px-6 py-6 sm:px-8 md:grid-cols-3">
//           <MetricCard
//             title="Open"
//             value={openCount}
//             tone="blue"
//           />
//           <MetricCard
//             title="In Progress"
//             value={progressCount}
//             tone="amber"
//           />
//           <MetricCard
//             title="Resolved"
//             value={resolvedCount}
//             tone="emerald"
//           />
//         </div>
//       </section>

//       {/* TABLE */}
//       <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
//         <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
//               Message Queue
//             </p>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//               All Support Requests
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               View, track, and update support requests across the platform.
//             </p>
//           </div>

//           <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
//             {messages.length} total
//           </div>
//         </div>

//         {messages.length === 0 ? (
//           <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//             <p className="text-slate-600">No support messages yet.</p>
//           </div>
//         ) : (
//           <div className="overflow-hidden rounded-[24px] border border-slate-200">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-slate-200">
//                 <thead className="bg-slate-50/80">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Subject
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       User
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Category
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Status
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Date
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-200 bg-white">
//                   {messages.map((msg) => (
//                     <tr key={msg.id} className="hover:bg-slate-50/70">
//                       {/* SUBJECT */}
//                       <td className="px-4 py-4 align-top">
//                         <p className="font-semibold text-slate-900">
//                           {msg.subject}
//                         </p>

//                         <p className="mt-2 text-sm text-slate-600 line-clamp-2">
//                           {msg.message}
//                         </p>
//                       </td>

//                       {/* USER */}
//                       <td className="px-4 py-4 align-top">
//                         <p className="text-sm font-medium text-slate-800">
//                           {msg.name}
//                         </p>
//                         <p className="mt-1 text-sm text-slate-500">
//                           {msg.email}
//                         </p>
//                       </td>

//                       {/* CATEGORY */}
//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {msg.category || "General"}
//                       </td>

//                       {/* STATUS */}
//                       <td className="px-4 py-4 align-top">
//                         <span
//                           className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
//                             msg.status === "OPEN"
//                               ? "bg-blue-50 text-blue-700"
//                               : msg.status === "IN_PROGRESS"
//                               ? "bg-amber-50 text-amber-700"
//                               : "bg-emerald-50 text-emerald-700"
//                           }`}
//                         >
//                           {msg.status.replace("_", " ")}
//                         </span>
//                       </td>

//                       {/* DATE */}
//                       <td className="px-4 py-4 align-top text-sm text-slate-500">
//                         {new Date(msg.createdAt).toLocaleDateString("en-GB", {
//                           day: "numeric",
//                           month: "short",
//                           year: "numeric",
//                         })}
//                       </td>

//                       {/* ACTION */}
//                       <td className="px-4 py-4 align-top">
//                         <div className="flex flex-col gap-2">
//                           <form
//                             action={updateStatus.bind(null, msg.id, "IN_PROGRESS")}
//                           >
//                             <button className="text-xs font-semibold text-amber-600 hover:underline">
//                               Mark In Progress
//                             </button>
//                           </form>

//                           <form
//                             action={updateStatus.bind(null, msg.id, "RESOLVED")}
//                           >
//                             <button className="text-xs font-semibold text-emerald-600 hover:underline">
//                               Mark Resolved
//                             </button>
//                           </form>
//                         </div>
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

// /* ================= COMPONENTS ================= */

// function MetricCard({
//   title,
//   value,
//   tone,
// }: {
//   title: string;
//   value: number;
//   tone: "blue" | "amber" | "emerald";
// }) {
//   const toneMap = {
//     blue: "from-blue-50 to-white border-blue-100",
//     amber: "from-amber-50 to-white border-amber-100",
//     emerald: "from-emerald-50 to-white border-emerald-100",
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





// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import { SupportMessage } from "@prisma/client";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// export default async function AdminSupportPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   const messages: SupportMessage[] = await prisma.supportMessage.findMany({
//     orderBy: { createdAt: "desc" },
//   });

//   const openCount = messages.filter((m) => m.status === "OPEN").length;
//   const progressCount = messages.filter((m) => m.status === "IN_PROGRESS").length;
//   const resolvedCount = messages.filter((m) => m.status === "RESOLVED").length;

//   async function updateStatus(
//     id: string,
//     status: "OPEN" | "IN_PROGRESS" | "RESOLVED"
//   ) {
//     "use server";

//     await prisma.supportMessage.update({
//       where: { id },
//       data: { status },
//     });
//   }

//   return (
//     <main className="space-y-8">
//       <section className="grid gap-4 md:grid-cols-3">
//         <MetricCard title="Open" value={openCount} tone="blue" />
//         <MetricCard title="In Progress" value={progressCount} tone="amber" />
//         <MetricCard title="Resolved" value={resolvedCount} tone="emerald" />
//       </section>

//       <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
//         <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
//               Message Queue
//             </p>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//               All Support Requests
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               View, track, and update support requests across the platform.
//             </p>
//           </div>

//           <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
//             {messages.length} total
//           </div>
//         </div>

//         {messages.length === 0 ? (
//           <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//             <p className="text-slate-600">No support messages yet.</p>
//           </div>
//         ) : (
//           <div className="overflow-hidden rounded-[24px] border border-slate-200">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-slate-200">
//                 <thead className="bg-slate-50/80">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Subject
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       User
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Category
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Status
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Date
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-200 bg-white">
//                   {messages.map((msg) => (
//                     <tr key={msg.id} className="hover:bg-slate-50/70">
//                       <td className="px-4 py-4 align-top">
//                         <p className="font-semibold text-slate-900">
//                           {msg.subject}
//                         </p>
//                         <p className="mt-2 line-clamp-2 text-sm text-slate-600">
//                           {msg.message}
//                         </p>
//                       </td>

//                       <td className="px-4 py-4 align-top">
//                         <p className="text-sm font-medium text-slate-800">
//                           {msg.name}
//                         </p>
//                         <p className="mt-1 text-sm text-slate-500">
//                           {msg.email}
//                         </p>
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {msg.category || "General"}
//                       </td>

//                       <td className="px-4 py-4 align-top">
//                         <span
//                           className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
//                             msg.status === "OPEN"
//                               ? "bg-blue-50 text-blue-700"
//                               : msg.status === "IN_PROGRESS"
//                               ? "bg-amber-50 text-amber-700"
//                               : "bg-emerald-50 text-emerald-700"
//                           }`}
//                         >
//                           {msg.status.replace("_", " ")}
//                         </span>
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-500">
//                         {new Date(msg.createdAt).toLocaleDateString("en-GB", {
//                           day: "numeric",
//                           month: "short",
//                           year: "numeric",
//                         })}
//                       </td>

//                       <td className="px-4 py-4 align-top">
//                         <div className="flex flex-col gap-2">
//                           <form
//                             action={updateStatus.bind(null, msg.id, "IN_PROGRESS")}
//                           >
//                             <button
//                               className="text-xs font-semibold text-amber-600 hover:underline"
//                               type="submit"
//                             >
//                               Mark In Progress
//                             </button>
//                           </form>

//                           <form
//                             action={updateStatus.bind(null, msg.id, "RESOLVED")}
//                           >
//                             <button
//                               className="text-xs font-semibold text-emerald-600 hover:underline"
//                               type="submit"
//                             >
//                               Mark Resolved
//                             </button>
//                           </form>
//                         </div>
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

// function MetricCard({
//   title,
//   value,
//   tone,
// }: {
//   title: string;
//   value: number;
//   tone: "blue" | "amber" | "emerald";
// }) {
//   const toneMap = {
//     blue: "from-blue-50 to-white border-blue-100",
//     amber: "from-amber-50 to-white border-amber-100",
//     emerald: "from-emerald-50 to-white border-emerald-100",
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



// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import { SupportMessage } from "@prisma/client";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// export default async function AdminSupportPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   const messages: SupportMessage[] = await prisma.supportMessage.findMany({
//     orderBy: { createdAt: "desc" },
//   });

//   const openCount = messages.filter((m) => m.status === "OPEN").length;
//   const progressCount = messages.filter((m) => m.status === "IN_PROGRESS").length;
//   const resolvedCount = messages.filter((m) => m.status === "RESOLVED").length;

//   async function updateStatus(
//     id: string,
//     status: "OPEN" | "IN_PROGRESS" | "RESOLVED"
//   ) {
//     "use server";

//     await prisma.supportMessage.update({
//       where: { id },
//       data: { status },
//     });
//   }

//   return (
//     <main className="space-y-6 pb-8">
//       <section className="sticky top-0 z-10 -mx-1 bg-[linear-gradient(180deg,rgba(248,250,252,0.98)_0%,rgba(248,250,252,0.92)_70%,rgba(248,250,252,0)_100%)] px-1 pb-4">
//         <div className="grid gap-4 md:grid-cols-3">
//           <MetricCard title="Open" value={openCount} tone="blue" />
//           <MetricCard title="In Progress" value={progressCount} tone="amber" />
//           <MetricCard title="Resolved" value={resolvedCount} tone="emerald" />
//         </div>
//       </section>

//       <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
//         <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
//               Message Queue
//             </p>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//               All Support Requests
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               View, track, and update support requests across the platform.
//             </p>
//           </div>

//           <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
//             {messages.length} total
//           </div>
//         </div>

//         {messages.length === 0 ? (
//           <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//             <p className="text-slate-600">No support messages yet.</p>
//           </div>
//         ) : (
//           <div className="overflow-hidden rounded-[24px] border border-slate-200">
//             <div className="max-h-[calc(100vh-360px)] overflow-auto">
//               <table className="min-w-full divide-y divide-slate-200">
//                 <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Subject
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       User
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Category
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Status
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Date
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-200 bg-white">
//                   {messages.map((msg) => (
//                     <tr key={msg.id} className="hover:bg-slate-50/70">
//                       <td className="px-4 py-4 align-top">
//                         <p className="font-semibold text-slate-900">
//                           {msg.subject}
//                         </p>
//                         <p className="mt-2 line-clamp-2 text-sm text-slate-600">
//                           {msg.message}
//                         </p>
//                       </td>

//                       <td className="px-4 py-4 align-top">
//                         <p className="text-sm font-medium text-slate-800">
//                           {msg.name}
//                         </p>
//                         <p className="mt-1 text-sm text-slate-500">
//                           {msg.email}
//                         </p>
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {msg.category || "General"}
//                       </td>

//                       <td className="px-4 py-4 align-top">
//                         <span
//                           className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
//                             msg.status === "OPEN"
//                               ? "bg-blue-50 text-blue-700"
//                               : msg.status === "IN_PROGRESS"
//                               ? "bg-amber-50 text-amber-700"
//                               : "bg-emerald-50 text-emerald-700"
//                           }`}
//                         >
//                           {msg.status.replace("_", " ")}
//                         </span>
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-500">
//                         {new Date(msg.createdAt).toLocaleDateString("en-GB", {
//                           day: "numeric",
//                           month: "short",
//                           year: "numeric",
//                         })}
//                       </td>

//                       <td className="px-4 py-4 align-top">
//                         <div className="flex flex-col gap-2">
//                           <form
//                             action={updateStatus.bind(null, msg.id, "IN_PROGRESS")}
//                           >
//                             <button
//                               className="text-xs font-semibold text-amber-600 hover:underline"
//                               type="submit"
//                             >
//                               Mark In Progress
//                             </button>
//                           </form>

//                           <form
//                             action={updateStatus.bind(null, msg.id, "RESOLVED")}
//                           >
//                             <button
//                               className="text-xs font-semibold text-emerald-600 hover:underline"
//                               type="submit"
//                             >
//                               Mark Resolved
//                             </button>
//                           </form>
//                         </div>
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

// function MetricCard({
//   title,
//   value,
//   tone,
// }: {
//   title: string;
//   value: number;
//   tone: "blue" | "amber" | "emerald";
// }) {
//   const toneMap = {
//     blue: "from-blue-50 to-white border-blue-100",
//     amber: "from-amber-50 to-white border-amber-100",
//     emerald: "from-emerald-50 to-white border-emerald-100",
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



import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { SupportMessage } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSupportPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const messages: SupportMessage[] = await prisma.supportMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const openCount = messages.filter((m) => m.status === "OPEN").length;
  const progressCount = messages.filter((m) => m.status === "IN_PROGRESS").length;
  const resolvedCount = messages.filter((m) => m.status === "RESOLVED").length;

  async function updateStatus(
    id: string,
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED"
  ) {
    "use server";

    await prisma.supportMessage.update({
      where: { id },
      data: { status },
    });
  }

  return (
    <main className="space-y-8 pb-8">
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Open" value={openCount} tone="blue" />
        <MetricCard title="In Progress" value={progressCount} tone="amber" />
        <MetricCard title="Resolved" value={resolvedCount} tone="emerald" />
      </section>

      <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Message Queue
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              All Support Requests
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              View, track, and update support requests across the platform.
            </p>
          </div>

          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
            {messages.length} total
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <p className="text-slate-600">No support messages yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[24px] border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Subject
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {messages.map((msg) => (
                    <tr key={msg.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-4 align-top">
                        <p className="font-semibold text-slate-900">
                          {msg.subject}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                          {msg.message}
                        </p>
                      </td>

                      <td className="px-4 py-4 align-top">
                        <p className="text-sm font-medium text-slate-800">
                          {msg.name}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {msg.email}
                        </p>
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-slate-700">
                        {msg.category || "General"}
                      </td>

                      <td className="px-4 py-4 align-top">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            msg.status === "OPEN"
                              ? "bg-blue-50 text-blue-700"
                              : msg.status === "IN_PROGRESS"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {msg.status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-slate-500">
                        {new Date(msg.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-4 py-4 align-top">
                        <div className="flex flex-col gap-2">
                          <form
                            action={updateStatus.bind(null, msg.id, "IN_PROGRESS")}
                          >
                            <button
                              className="text-xs font-semibold text-amber-600 hover:underline"
                              type="submit"
                            >
                              Mark In Progress
                            </button>
                          </form>

                          <form
                            action={updateStatus.bind(null, msg.id, "RESOLVED")}
                          >
                            <button
                              className="text-xs font-semibold text-emerald-600 hover:underline"
                              type="submit"
                            >
                              Mark Resolved
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function MetricCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: number;
  tone: "blue" | "amber" | "emerald";
}) {
  const toneMap = {
    blue: "from-blue-50 to-white border-blue-100",
    amber: "from-amber-50 to-white border-amber-100",
    emerald: "from-emerald-50 to-white border-emerald-100",
  };

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-5 shadow-sm ${toneMap[tone]}`}
    >
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}
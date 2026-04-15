


// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import Link from "next/link";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import ApplicantCard from "@/components/organization/ApplicantCard";
// import CompleteProjectButton from "@/components/organization/CompleteProjectButton";
// import UnreadBadge from "@/components/chat/UnreadBadge";
// import NotificationBell from "@/components/notifications/NotificationBell";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// function getStatusStyles(status: string) {
//   switch (status) {
//     case "OPEN":
//       return "bg-emerald-50 text-emerald-700 border-emerald-200";
//     case "IN_PROGRESS":
//       return "bg-blue-50 text-blue-700 border-blue-200";
//     case "COMPLETED":
//       return "bg-slate-100 text-slate-700 border-slate-200";
//     default:
//       return "bg-slate-50 text-slate-700 border-slate-200";
//   }
// }

// function formatStatus(status: string) {
//   return status.replaceAll("_", " ");
// }

// function getNotificationAccent(type: string) {
//   switch (type) {
//     case "APPLICATION":
//       return {
//         icon: "📩",
//         badge: "bg-purple-100 text-purple-700 border-purple-200",
//         card: "border-purple-200 bg-gradient-to-r from-purple-50 via-white to-blue-50",
//       };
//     case "PROJECT":
//       return {
//         icon: "📁",
//         badge: "bg-blue-100 text-blue-700 border-blue-200",
//         card: "border-blue-200 bg-gradient-to-r from-blue-50 via-white to-indigo-50",
//       };
//     case "REVIEW":
//       return {
//         icon: "⭐",
//         badge: "bg-amber-100 text-amber-700 border-amber-200",
//         card: "border-amber-200 bg-gradient-to-r from-amber-50 via-white to-yellow-50",
//       };
//     case "BADGE":
//       return {
//         icon: "🏆",
//         badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
//         card: "border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50",
//       };
//     default:
//       return {
//         icon: "🔔",
//         badge: "bg-slate-100 text-slate-700 border-slate-200",
//         card: "border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-100",
//       };
//   }
// }

// export default async function OrganizationDashboard() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
//     redirect("/login");
//   }

//   const [projects, notifications] = await Promise.all([
//     prisma.project.findMany({
//       where: { organizationId: session.user.id },
//       include: {
//         applications: {
//           include: { volunteer: true },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     }),
//     prisma.notification.findMany({
//       where: { userId: session.user.id },
//       orderBy: { createdAt: "desc" },
//       take: 10,
//     }),
//   ]);

//   const unreadCount = notifications.filter((n) => !n.isRead).length;
//   const latestNotification = notifications[0] ?? null;
//   const latestNotificationAccent = latestNotification
//     ? getNotificationAccent(latestNotification.type)
//     : null;

//   const activeProjects = projects.filter((p) => p.status !== "COMPLETED");
//   const completedProjects = projects.filter((p) => p.status === "COMPLETED");

//   const totalApplicants = projects.reduce(
//     (acc, p) => acc + p.applications.length,
//     0
//   );

//   const activeVolunteersCount = projects.flatMap((p) =>
//     p.applications.filter((a) => a.status === "ACCEPTED")
//   ).length;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
//       <div className="flex min-h-screen">
//         <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white/95 px-6 py-8 backdrop-blur lg:block">
//           <div className="flex h-full flex-col">
//             <div>
//               <div className="mb-10">
//                 <div className="inline-flex items-center gap-3">
//                   <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white shadow-sm">
//                     B
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold tracking-tight text-slate-900">
//                       BuildUp
//                     </h2>
//                     <p className="text-xs text-slate-500">
//                       Organization workspace
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <nav className="space-y-2">
//                 <Link
//                   href="/dashboard/organization"
//                   className="flex items-center gap-3 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700"
//                 >
//                   <span className="text-base">📊</span>
//                   Dashboard
//                 </Link>

//                 <div className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600">
//                   <span className="text-base">📁</span>
//                   My Projects
//                 </div>

//                 <Link
//                   href="/dashboard/organization/inbox"
//                   className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
//                 >
//                   <span className="flex items-center gap-3">
//                     <span className="text-base">💬</span>
//                     Messages
//                   </span>
//                   <UnreadBadge />
//                 </Link>

//                 <Link
//                   href="/dashboard/organization/invites"
//                   className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
//                 >
//                   <span className="text-base">📩</span>
//                   Invite History
//                 </Link>

//                 <Link
//                   href="/projects/new"
//                   className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
//                 >
//                   <span className="text-base">➕</span>
//                   Post a Project
//                 </Link>
//               </nav>
//             </div>

//             <div className="mt-auto rounded-[24px] border border-slate-200 bg-slate-50 p-4">
//               <p className="text-sm font-semibold text-slate-900">
//                 Need more traction?
//               </p>
//               <p className="mt-1 text-sm leading-6 text-slate-500">
//                 Post clear, outcome-driven projects to attract stronger
//                 volunteers and better applications.
//               </p>
//               <Link
//                 href="/projects/new"
//                 className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
//               >
//                 Create Project
//               </Link>
//             </div>
//           </div>
//         </aside>

//         <main className="min-w-0 flex-1 px-4 py-6 md:px-8 lg:px-10 lg:py-8">
//           <div className="mx-auto max-w-7xl space-y-8">
//             <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
//               <div className="flex flex-wrap items-center justify-between gap-3">
//                 <div>
//                   <h2 className="text-xl font-bold text-slate-900">BuildUp</h2>
//                   <p className="text-sm text-slate-500">
//                     Organization workspace
//                   </p>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <NotificationBell
//                     userId={session.user.id}
//                     notifications={notifications}
//                     unreadCount={unreadCount}
//                   />

//                   <Link
//                     href="/dashboard/organization/inbox"
//                     className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
//                   >
//                     Messages
//                     <UnreadBadge />
//                   </Link>

//                   <Link
//                     href="/projects/new"
//                     className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
//                   >
//                     Post Project
//                   </Link>
//                 </div>
//               </div>
//             </section>

//             <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
//               <div className="relative px-6 py-8 md:px-8 md:py-10">
//                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_24%)]" />
//                 <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
//                   <div className="max-w-3xl">
//                     <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
//                       <span className="h-2 w-2 rounded-full bg-blue-600" />
//                       Organization Dashboard
//                     </div>

//                     <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
//                       Manage projects and volunteers
//                     </h1>

//                     <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
//                       Track activity across your projects, review incoming
//                       applications, manage accepted volunteers, and keep work
//                       moving smoothly.
//                     </p>
//                   </div>

//                   <div className="flex flex-wrap items-center gap-3">
//                     <NotificationBell
//                       userId={session.user.id}
//                       notifications={notifications}
//                       unreadCount={unreadCount}
//                     />

//                     <Link
//                       href="/projects/new"
//                       className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
//                     >
//                       Post a New Project
//                     </Link>

//                     <Link
//                       href="/dashboard/organization/inbox"
//                       className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//                     >
//                       Open Messages
//                     </Link>

//                     <Link
//                       href="/dashboard/organization/invites"
//                       className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//                     >
//                       View Invite History
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {latestNotification && latestNotificationAccent && (
//               <section
//                 className={`rounded-[26px] border p-5 shadow-sm sm:p-6 ${latestNotificationAccent.card}`}
//               >
//                 <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//                   <div className="flex items-start gap-4">
//                     <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
//                       {latestNotificationAccent.icon}
//                     </div>

//                     <div>
//                       <div
//                         className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${latestNotificationAccent.badge}`}
//                       >
//                         Latest notification
//                       </div>

//                       <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900">
//                         {latestNotification.title}
//                       </h2>

//                       <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
//                         {latestNotification.message}
//                       </p>

//                       <p className="mt-2 text-xs text-slate-400">
//                         {new Date(latestNotification.createdAt).toLocaleString()}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap gap-3">
//                     {latestNotification.link ? (
//                       <Link
//                         href={latestNotification.link}
//                         className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
//                       >
//                         Open Notification
//                       </Link>
//                     ) : null}

//                     <Link
//                       href="/dashboard/organization/invites"
//                       className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//                     >
//                       View Invite History
//                     </Link>
//                   </div>
//                 </div>
//               </section>
//             )}

//             <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//               <Stat
//                 title="Projects Posted"
//                 value={projects.length}
//                 icon="📁"
//                 tone="blue"
//               />
//               <Stat
//                 title="Active Projects"
//                 value={activeProjects.length}
//                 icon="🚀"
//                 tone="emerald"
//               />
//               <Stat
//                 title="Completed Projects"
//                 value={completedProjects.length}
//                 icon="✅"
//                 tone="slate"
//               />
//               <Stat
//                 title="Active Volunteers"
//                 value={activeVolunteersCount}
//                 icon="👥"
//                 tone="amber"
//               />
//             </section>

//             <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
//               <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
//                 <p className="text-sm font-semibold text-slate-900">
//                   Total Applicants
//                 </p>
//                 <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//                   {totalApplicants}
//                 </p>
//                 <p className="mt-2 text-sm text-slate-500">
//                   Across all your posted projects.
//                 </p>
//               </div>

//               <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
//                 <p className="text-sm font-semibold text-slate-900">
//                   Pending Reviews
//                 </p>
//                 <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//                   {
//                     projects.flatMap((p) =>
//                       p.applications.filter((a) => a.status === "PENDING")
//                     ).length
//                   }
//                 </p>
//                 <p className="mt-2 text-sm text-slate-500">
//                   Applications waiting for your decision.
//                 </p>
//               </div>

//               <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
//                 <p className="text-sm font-semibold text-slate-900">
//                   Accepted Placements
//                 </p>
//                 <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//                   {activeVolunteersCount}
//                 </p>
//                 <p className="mt-2 text-sm text-slate-500">
//                   Volunteers currently engaged on your projects.
//                 </p>
//               </div>
//             </section>

//             <section className="space-y-5">
//               {projects.length === 0 ? (
//                 <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
//                   <div className="mx-auto max-w-md">
//                     <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
//                       📂
//                     </div>
//                     <h2 className="text-xl font-semibold text-slate-900">
//                       No projects posted yet
//                     </h2>
//                     <p className="mt-2 text-sm leading-6 text-slate-500">
//                       Start by posting your first project so volunteers can
//                       discover it and apply.
//                     </p>
//                     <Link
//                       href="/projects/new"
//                       className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
//                     >
//                       Post Your First Project
//                     </Link>
//                   </div>
//                 </div>
//               ) : (
//                 projects.map((project) => {
//                   const pendingApps = project.applications.filter(
//                     (a) => a.status === "PENDING"
//                   );
//                   const activeApps = project.applications.filter(
//                     (a) => a.status === "ACCEPTED"
//                   );

//                   return (
//                     <section
//                       key={project.id}
//                       className="overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm md:p-7"
//                     >
//                       <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 lg:flex-row lg:items-start lg:justify-between">
//                         <div className="min-w-0 flex-1">
//                           <div className="mb-3 flex flex-wrap items-center gap-3">
//                             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg text-white shadow-sm">
//                               📁
//                             </div>

//                             <div className="min-w-0">
//                               <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
//                                 {project.title}
//                               </h2>
//                               <p className="mt-1 text-sm text-slate-500">
//                                 Manage applicants, accepted volunteers, and
//                                 project completion from here.
//                               </p>
//                             </div>
//                           </div>

//                           <div className="flex flex-wrap gap-3">
//                             <span
//                               className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(
//                                 project.status
//                               )}`}
//                             >
//                               {formatStatus(project.status)}
//                             </span>

//                             <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
//                               {project.applications.length} applicant
//                               {project.applications.length === 1 ? "" : "s"}
//                             </span>

//                             <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
//                               {activeApps.length} active volunteer
//                               {activeApps.length === 1 ? "" : "s"}
//                             </span>
//                           </div>
//                         </div>

//                         <div className="w-full lg:w-auto lg:min-w-[240px]">
//                           <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
//                             <p className="text-sm font-semibold text-slate-900">
//                               Project actions
//                             </p>
//                             <p className="mt-1 text-sm leading-6 text-slate-500">
//                               Complete this project when the work is done, or
//                               leave a review after completion.
//                             </p>

//                             <div className="mt-4">
//                               {project.status !== "COMPLETED" ? (
//                                 <CompleteProjectButton projectId={project.id} />
//                               ) : (
//                                 <Link
//                                   href={`/project/${project.id}/review`}
//                                   className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
//                                 >
//                                   Leave Review
//                                 </Link>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3">
//                         <MiniStat
//                           label="Pending Applications"
//                           value={pendingApps.length}
//                         />
//                         <MiniStat
//                           label="Accepted Volunteers"
//                           value={activeApps.length}
//                         />
//                         <MiniStat
//                           label="Total Applicants"
//                           value={project.applications.length}
//                         />
//                       </div>

//                       <div className="border-t border-slate-100 pt-6">
//                         <div className="mb-4">
//                           <h3 className="text-lg font-semibold text-slate-900">
//                             Pending Applicants
//                           </h3>
//                           <p className="mt-1 text-sm text-slate-500">
//                             Review candidates who are waiting for your response.
//                           </p>
//                         </div>

//                         {pendingApps.length === 0 ? (
//                           <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
//                             <p className="text-sm font-medium text-slate-700">
//                               No pending applicants for this project right now.
//                             </p>
//                             <p className="mt-1 text-sm text-slate-500">
//                               New volunteer applications will appear here.
//                             </p>
//                           </div>
//                         ) : (
//                           <div className="space-y-4">
//                             {pendingApps.map((app) => (
//                               <ApplicantCard
//                                 key={app.id}
//                                 applicationId={app.id}
//                                 name={app.volunteer.name}
//                                 email={app.volunteer.email}
//                                 status={app.status}
//                               />
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </section>
//                   );
//                 })
//               )}
//             </section>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// function Stat({
//   title,
//   value,
//   icon,
//   tone,
// }: {
//   title: string;
//   value: number;
//   icon: string;
//   tone: "blue" | "emerald" | "slate" | "amber";
// }) {
//   const toneStyles = {
//     blue: "bg-blue-50 text-blue-700 border-blue-100",
//     emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
//     slate: "bg-slate-100 text-slate-700 border-slate-200",
//     amber: "bg-amber-50 text-amber-700 border-amber-100",
//   };

//   return (
//     <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <h3 className="text-sm font-medium text-slate-500">{title}</h3>
//           <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//             {value}
//           </p>
//         </div>

//         <div
//           className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-lg ${toneStyles[tone]}`}
//         >
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// function MiniStat({
//   label,
//   value,
// }: {
//   label: string;
//   value: number;
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
//       <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
//         {label}
//       </p>
//       <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
//     </div>
//   );
// }


import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import ApplicantCard from "@/components/organization/ApplicantCard";
import CompleteProjectButton from "@/components/organization/CompleteProjectButton";
import UnreadBadge from "@/components/chat/UnreadBadge";
import NotificationBell from "@/components/notifications/NotificationBell";
import OpenNotificationButton from "@/components/notifications/OpenNotificationButton";
import LatestNotificationActions from "@/components/notifications/LatestNotificationActions";
import LatestNotificationCard from "@/components/notifications/LatestNotificationCard";
import LiveOrganizationStats from "@/components/organization/LiveOrganizationStats";
import LiveOrganizationProjects from "@/components/organization/LiveOrganizationProjects";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getStatusStyles(status: string) {
  switch (status) {
    case "OPEN":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "COMPLETED":
      return "bg-slate-100 text-slate-700 border-slate-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}



export default async function OrganizationDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
    redirect("/login");
  }

  const [projects, notifications] = await Promise.all([
    prisma.project.findMany({
      where: { organizationId: session.user.id },
      include: {
        applications: {
          include: { volunteer: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  
  




  const activeProjects = projects.filter((p) => p.status !== "COMPLETED");
  const completedProjects = projects.filter((p) => p.status === "COMPLETED");

  const totalApplicants = projects.reduce(
    (acc, p) => acc + p.applications.length,
    0
  );

  const activeVolunteersCount = projects.flatMap((p) =>
    p.applications.filter((a) => a.status === "ACCEPTED")
  ).length;



  const initialSummary = {
  projectsPosted: projects.length,
  activeProjects: activeProjects.length,
  completedProjects: completedProjects.length,
  totalApplicants,
  pendingReviews: projects.flatMap((p) =>
    p.applications.filter((a) => a.status === "PENDING")
  ).length,
  activeVolunteers: activeVolunteersCount,
  acceptedPlacements: activeVolunteersCount,
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white/95 px-6 py-8 backdrop-blur lg:block">
          <div className="flex h-full flex-col">
            <div>
              <div className="mb-10">
                <div className="inline-flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white shadow-sm">
                    B
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                      BuildUp
                    </h2>
                    <p className="text-xs text-slate-500">
                      Organization workspace
                    </p>
                  </div>
                </div>
              </div>

              <nav className="space-y-2">
                <Link
                  href="/dashboard/organization"
                  className="flex items-center gap-3 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700"
                >
                  <span className="text-base">📊</span>
                  Dashboard
                </Link>

                <div className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600">
                  <span className="text-base">📁</span>
                  My Projects
                </div>

                <Link
                  href="/dashboard/organization/inbox"
                  className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-base">💬</span>
                    Messages
                  </span>
                  <UnreadBadge />
                </Link>

                <Link
                  href="/dashboard/organization/invites"
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
                >
                  <span className="text-base">📩</span>
                  Invite History
                </Link>

                <Link
                  href="/projects/new"
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
                >
                  <span className="text-base">➕</span>
                  Post a Project
                </Link>
              </nav>
            </div>

            <div className="mt-auto rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                Need more traction?
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Post clear, outcome-driven projects to attract stronger
                volunteers and better applications.
              </p>
              <Link
                href="/projects/new"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Create Project
              </Link>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 md:px-8 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">BuildUp</h2>
                  <p className="text-sm text-slate-500">
                    Organization workspace
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <NotificationBell
                    userId={session.user.id}
                    notifications={notifications}
                    unreadCount={unreadCount}
                  />

                  <Link
                    href="/dashboard/organization/inbox"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    Messages
                    <UnreadBadge />
                  </Link>

                  <Link
                    href="/projects/new"
                    className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Post Project
                  </Link>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div className="relative px-6 py-8 md:px-8 md:py-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_24%)]" />
                <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      <span className="h-2 w-2 rounded-full bg-blue-600" />
                      Organization Dashboard
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                      Manage projects and volunteers
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                      Track activity across your projects, review incoming
                      applications, manage accepted volunteers, and keep work
                      moving smoothly.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <NotificationBell
                      userId={session.user.id}
                      notifications={notifications}
                      unreadCount={unreadCount}
                    />

                    <Link
                      href="/projects/new"
                      className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                      Post a New Project
                    </Link>

                    <Link
                      href="/dashboard/organization/inbox"
                      className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Open Messages
                    </Link>

                    <Link
                      href="/dashboard/organization/invites"
                      className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      View Invite History
                    </Link>
                  </div>
                </div>
              </div>
            </section>



            <LatestNotificationCard
  userId={session.user.id}
  notifications={notifications}
  unreadCount={unreadCount}
/>

         


            <LiveOrganizationStats
  userId={session.user.id}
  initialSummary={initialSummary}
/>

            {/* <section className="space-y-5">
              {projects.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
                  <div className="mx-auto max-w-md">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
                      📂
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      No projects posted yet
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Start by posting your first project so volunteers can
                      discover it and apply.
                    </p>
                    <Link
                      href="/projects/new"
                      className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Post Your First Project
                    </Link>
                  </div>
                </div>
              ) : (
                projects.map((project) => {
                  const pendingApps = project.applications.filter(
                    (a) => a.status === "PENDING"
                  );
                  const activeApps = project.applications.filter(
                    (a) => a.status === "ACCEPTED"
                  );

                  return (
                    <section
                      key={project.id}
                      className="overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm md:p-7"
                    >
                      <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="mb-3 flex flex-wrap items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg text-white shadow-sm">
                              📁
                            </div>

                            <div className="min-w-0">
                              <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                                {project.title}
                              </h2>
                              <p className="mt-1 text-sm text-slate-500">
                                Manage applicants, accepted volunteers, and
                                project completion from here.
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(
                                project.status
                              )}`}
                            >
                              {formatStatus(project.status)}
                            </span>

                            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                              {project.applications.length} applicant
                              {project.applications.length === 1 ? "" : "s"}
                            </span>

                            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                              {activeApps.length} active volunteer
                              {activeApps.length === 1 ? "" : "s"}
                            </span>
                          </div>
                        </div>

                        <div className="w-full lg:w-auto lg:min-w-[240px]">
                          <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm font-semibold text-slate-900">
                              Project actions
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-500">
                              Complete this project when the work is done, or
                              leave a review after completion.
                            </p>

                            <div className="mt-4">
                              {project.status !== "COMPLETED" ? (
                                <CompleteProjectButton projectId={project.id} />
                              ) : (
                                <Link
                                  href={`/project/${project.id}/review`}
                                  className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                                >
                                  Leave Review
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3">
                        <MiniStat
                          label="Pending Applications"
                          value={pendingApps.length}
                        />
                        <MiniStat
                          label="Accepted Volunteers"
                          value={activeApps.length}
                        />
                        <MiniStat
                          label="Total Applicants"
                          value={project.applications.length}
                        />
                      </div>

                      <div className="border-t border-slate-100 pt-6">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-slate-900">
                            Pending Applicants
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            Review candidates who are waiting for your response.
                          </p>
                        </div>

                        {pendingApps.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                            <p className="text-sm font-medium text-slate-700">
                              No pending applicants for this project right now.
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              New volunteer applications will appear here.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {pendingApps.map((app) => (
                              <ApplicantCard
                                key={app.id}
                                applicationId={app.id}
                                name={app.volunteer.name}
                                email={app.volunteer.email}
                                status={app.status}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </section>
                  );
                })
              )}
            </section> */}


            <LiveOrganizationProjects
  userId={session.user.id}
  initialProjects={projects}
/>
          </div>
        </main>
      </div>
    </div>
  );
}

function Stat({
  title,
  value,
  icon,
  tone,
}: {
  title: string;
  value: number;
  icon: string;
  tone: "blue" | "emerald" | "slate" | "amber";
}) {
  const toneStyles = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-slate-500">{title}</h3>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-lg ${toneStyles[tone]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}






// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import Link from "next/link";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import NotificationBell from "@/components/notifications/NotificationBell";
// import LatestNotificationCard from "@/components/notifications/LatestNotificationCard";
// import OrganizationProjectsTabs from "@/components/organization/OrganizationProjectsTabs";
// import OrganizationRealtimeRefresh from "@/components/organization/OrganizationRealtimeRefresh";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// export default async function OrganizationDashboard() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
//     redirect("/login");
//   }

//   const [projects, notifications, fundings] = await Promise.all([
//     prisma.project.findMany({
//       where: { organizationId: session.user.id },
//       include: {
//         applications: {
//           include: {
//             volunteer: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 skills: true,
//                 bio: true,
//                 country: true,
//                 profileImageUrl: true,
//                 headline: true,
//                 username: true,
//                 experience: true,
//               },
//             },
//           },
//         },
//         submissions: {
//           orderBy: { createdAt: "desc" },
//           take: 3,
//           include: {
//             volunteer: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 profileImageUrl: true,
//               },
//             },
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     }),

//     prisma.notification.findMany({
//       where: { userId: session.user.id },
//       orderBy: { createdAt: "desc" },
//       take: 10,
//     }),

//     prisma.projectFunding.findMany({
//       where: { organizationId: session.user.id },
//     }),
//   ]);

//   const fundingMap = new Map(fundings.map((f) => [f.projectId, f]));

//   const projectsWithFunding = projects.map((project) => ({
//     ...project,
//     funding: fundingMap.get(project.id) ?? null,
//   }));

//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   const hasAcceptedVolunteer = (project: (typeof projectsWithFunding)[number]) =>
//     project.applications.some(
//       (application) =>
//         application.status === "ACCEPTED" ||
//         application.status === "COMPLETED"
//     );

//   const completedProjects = projectsWithFunding.filter(
//     (p) => p.status === "COMPLETED"
//   );

//   const activeProjects = projectsWithFunding.filter(
//     (p) =>
//       p.status !== "COMPLETED" &&
//       (p.status === "IN_PROGRESS" || hasAcceptedVolunteer(p))
//   );

//   const pendingProjects = projectsWithFunding.filter(
//     (p) => p.status === "OPEN" && !hasAcceptedVolunteer(p)
//   );

//   const realApplications = projectsWithFunding.flatMap((p) =>
//     p.applications.filter((a) => a.source !== "ORGANIZATION")
//   );

//   const totalApplicants = realApplications.length;

//   const pendingReviews = realApplications.filter(
//     (a) => a.status === "PENDING"
//   ).length;

//   const activeVolunteersCount = projectsWithFunding.flatMap((p) =>
//     p.applications.filter(
//       (a) => a.status === "ACCEPTED" || a.status === "COMPLETED"
//     )
//   ).length;

//   const projectsPosted = projectsWithFunding.length;
//   const openAndActiveProjects = activeProjects.length + pendingProjects.length;
//   const completedProjectsCount = completedProjects.length;
//   const acceptedPlacements = activeVolunteersCount;

//   return (
//     <div className="flex bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
//       <main className="min-w-0 flex-1 px-4 py-6 md:px-8 lg:px-10 lg:py-8">
//         <div className="mx-auto max-w-7xl space-y-8">
//           <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
//             <div className="relative px-6 py-8 md:px-8 md:py-10">
//               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_24%)]" />

//               <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
//                 <div className="max-w-3xl">
//                   <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
//                     <span className="h-2 w-2 rounded-full bg-blue-600" />
//                     Organization Dashboard
//                   </div>

//                   <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
//                     Manage projects and volunteers
//                   </h1>

//                   <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
//                     Track activity across your projects, review incoming
//                     applications, manage accepted volunteers, and keep work
//                     moving smoothly.
//                   </p>
//                 </div>

//                 <div className="flex flex-wrap items-center gap-3">
//                   <NotificationBell
//                     userId={session.user.id}
//                     notifications={notifications}
//                     unreadCount={unreadCount}
//                   />

//                   <Link
//                     href="/projects/new"
//                     className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
//                   >
//                     Post a New Project
//                   </Link>

//                   <Link
//                     href="/dashboard/organization/inbox"
//                     className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//                   >
//                     Open Messages
//                   </Link>

//                   <Link
//                     href="/dashboard/organization/invites"
//                     className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//                   >
//                     View Invite History
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </section>

//           <LatestNotificationCard
//             userId={session.user.id}
//             notifications={notifications}
//             unreadCount={unreadCount}
//           />

//           <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
//             <div className="border-b border-slate-200 px-6 py-5 md:px-8">
//               <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//                 <div>
//                   <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
//                     Performance Overview
//                   </p>
//                   <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//                     Organization performance at a glance
//                   </h2>
//                   <p className="mt-2 max-w-2xl text-sm text-slate-500">
//                     A concise summary of projects, applicant flow, and
//                     volunteer activity across your workspace.
//                   </p>
//                 </div>

//                 <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
//                   Live dashboard snapshot
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-6 px-6 py-6 md:px-8 md:py-8">
//               <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
//                 <PrimaryStatCard
//                   label="Projects Posted"
//                   value={projectsPosted}
//                   hint="Total projects created"
//                   icon="📁"
//                   accent="slate"
//                 />
//                 <PrimaryStatCard
//                   label="Active Projects"
//                   value={openAndActiveProjects}
//                   hint="Open and in progress"
//                   icon="⚡"
//                   accent="blue"
//                 />
//                 <PrimaryStatCard
//                   label="Total Applicants"
//                   value={totalApplicants}
//                   hint="Volunteer-submitted applications"
//                   icon="👥"
//                   accent="emerald"
//                 />
//               </div>

//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
//                 <SecondaryStatCard
//                   label="Pending Reviews"
//                   value={pendingReviews}
//                   tone="amber"
//                 />
//                 <SecondaryStatCard
//                   label="Active Volunteers"
//                   value={activeVolunteersCount}
//                   tone="blue"
//                 />
//                 <SecondaryStatCard
//                   label="Completed Projects"
//                   value={completedProjectsCount}
//                   tone="slate"
//                 />
//                 <SecondaryStatCard
//                   label="Accepted Placements"
//                   value={acceptedPlacements}
//                   tone="emerald"
//                 />
//               </div>

//               <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
//                 <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
//                   <p className="text-sm leading-6 text-slate-600">
//                     <span className="font-semibold text-slate-900">
//                       {pendingReviews}
//                     </span>{" "}
//                     volunteer applications need attention, while{" "}
//                     <span className="font-semibold text-slate-900">
//                       {activeVolunteersCount}
//                     </span>{" "}
//                     volunteers are currently active across{" "}
//                     <span className="font-semibold text-slate-900">
//                       {openAndActiveProjects}
//                     </span>{" "}
//                     open and in-progress projects.
//                   </p>

//                   <Link
//                     href="/dashboard/organization/inbox"
//                     className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
//                   >
//                     Review activity
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </section>

//           <OrganizationRealtimeRefresh userId={session.user.id} />

//           <OrganizationProjectsTabs
//             userId={session.user.id}
//             activeProjects={activeProjects}
//             pendingProjects={pendingProjects}
//             completedProjects={completedProjects}
//           />
//         </div>
//       </main>
//     </div>
//   );
// }

// function PrimaryStatCard({
//   label,
//   value,
//   hint,
//   icon,
//   accent,
// }: {
//   label: string;
//   value: number;
//   hint: string;
//   icon: string;
//   accent: "blue" | "emerald" | "slate";
// }) {
//   const accentStyles = {
//     blue: {
//       chip: "bg-blue-50 text-blue-700 border-blue-100",
//       ring: "from-blue-500/12 to-indigo-500/8",
//     },
//     emerald: {
//       chip: "bg-emerald-50 text-emerald-700 border-emerald-100",
//       ring: "from-emerald-500/12 to-teal-500/8",
//     },
//     slate: {
//       chip: "bg-slate-100 text-slate-700 border-slate-200",
//       ring: "from-slate-400/12 to-slate-500/8",
//     },
//   };

//   return (
//     <div className="relative overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
//       <div
//         className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-r ${accentStyles[accent].ring}`}
//       />
//       <div className="relative flex items-start justify-between gap-4">
//         <div>
//           <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
//             {label}
//           </p>
//           <p className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
//             {value}
//           </p>
//           <p className="mt-2 text-sm text-slate-500">{hint}</p>
//         </div>

//         <div
//           className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-lg ${accentStyles[accent].chip}`}
//         >
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// function SecondaryStatCard({
//   label,
//   value,
//   tone,
// }: {
//   label: string;
//   value: number;
//   tone: "blue" | "emerald" | "slate" | "amber";
// }) {
//   const toneStyles = {
//     blue: "bg-blue-50 text-blue-700 border-blue-100",
//     emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
//     slate: "bg-slate-100 text-slate-700 border-slate-200",
//     amber: "bg-amber-50 text-amber-700 border-amber-100",
//   };

//   return (
//     <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
//       <div className="flex items-start justify-between gap-3">
//         <div>
//           <p className="text-sm font-medium text-slate-500">{label}</p>
//           <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//             {value}
//           </p>
//         </div>

//         <div className={`h-3 w-3 rounded-full border ${toneStyles[tone]}`} />
//       </div>
//     </div>
//   );
// }







import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import NotificationBell from "@/components/notifications/NotificationBell";
import LatestNotificationCard from "@/components/notifications/LatestNotificationCard";
import OrganizationProjectsTabs from "@/components/organization/OrganizationProjectsTabs";
import OrganizationRealtimeRefresh from "@/components/organization/OrganizationRealtimeRefresh";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function OrganizationDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
    redirect("/login");
  }

  const [projects, notifications, fundings] = await Promise.all([
    prisma.project.findMany({
      where: { organizationId: session.user.id },
      include: {
        applications: {
          include: {
            volunteer: {
              select: {
                id: true,
                name: true,
                email: true,
                skills: true,
                bio: true,
                country: true,
                profileImageUrl: true,
                headline: true,
                username: true,
                experience: true,
              },
            },
          },
        },
        submissions: {
          orderBy: { createdAt: "desc" },
          take: 3,
          include: {
            volunteer: {
              select: {
                id: true,
                name: true,
                email: true,
                profileImageUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),

    prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),

    prisma.projectFunding.findMany({
      where: { organizationId: session.user.id },
    }),
  ]);

  const fundingMap = new Map(
    fundings.map((funding) => [funding.projectId, funding])
  );

  const projectsWithFunding = projects.map((project) => ({
    ...project,
    funding: fundingMap.get(project.id) ?? null,
  }));

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const hasAcceptedVolunteer = (project: (typeof projectsWithFunding)[number]) =>
    project.applications.some(
      (application) =>
        application.status === "ACCEPTED" || application.status === "COMPLETED"
    );

  const hasAwaitingPayment = (project: (typeof projectsWithFunding)[number]) =>
    project.applications.some(
      (application) => application.status === "AWAITING_PAYMENT"
    );

  const completedProjects = projectsWithFunding.filter(
    (project) => project.status === "COMPLETED"
  );

  const activeProjects = projectsWithFunding.filter(
    (project) =>
      project.status !== "COMPLETED" &&
      (project.status === "IN_PROGRESS" || hasAcceptedVolunteer(project))
  );

  const pendingProjects = projectsWithFunding.filter(
    (project) => project.status === "OPEN" && !hasAcceptedVolunteer(project)
  );

  const awaitingPaymentProjects = projectsWithFunding.filter(hasAwaitingPayment);

  const realApplications = projectsWithFunding.flatMap((project) =>
    project.applications.filter(
      (application) => application.source !== "ORGANIZATION"
    )
  );

  const totalApplicants = realApplications.length;

  const pendingReviews = realApplications.filter(
    (application) => application.status === "PENDING"
  ).length;

  const activeVolunteersCount = projectsWithFunding.flatMap((project) =>
    project.applications.filter(
      (application) =>
        application.status === "ACCEPTED" || application.status === "COMPLETED"
    )
  ).length;

  const projectsPosted = projectsWithFunding.length;
  const openAndActiveProjects = activeProjects.length + pendingProjects.length;
  const completedProjectsCount = completedProjects.length;
  const needsAttentionCount = pendingReviews + awaitingPaymentProjects.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
      <OrganizationRealtimeRefresh userId={session.user.id} />

      <main className="min-w-0 flex-1 px-4 py-6 md:px-8 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-7xl space-y-7">
          <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.06)]">
            <div className="relative p-6 md:p-8 lg:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.11),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_26%)]" />

              <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
                    <span className="h-2 w-2 rounded-full bg-blue-600" />
                    Organization Dashboard
                  </div>

                  <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
                    Manage projects and volunteers with clarity.
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                    Review applications, fund selected projects, track volunteer
                    work, and manage project delivery from one clean workspace.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href="/projects/new"
                      className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
                    >
                      + Post New Project
                    </Link>

                    <Link
                      href="/dashboard/organization/inbox"
                      className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      Open Messages
                    </Link>

                    <Link
                      href="/dashboard/organization/invites"
                      className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      Invite History
                    </Link>
                  </div>
                </div>

                <NotificationBell
                  userId={session.user.id}
                  notifications={notifications}
                  unreadCount={unreadCount}
                />
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Projects Posted" value={projectsPosted} hint="Total projects created" icon="📁" tone="slate" />
            <MetricCard label="Active Projects" value={openAndActiveProjects} hint="Open and in progress" icon="⚡" tone="blue" />
            <MetricCard label="Applicants" value={totalApplicants} hint="Volunteer applications" icon="👥" tone="emerald" />
            <MetricCard label="Needs Attention" value={needsAttentionCount} hint="Reviews or funding required" icon="⏳" tone="amber" />
          </section>

          <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
            <div className="rounded-[28px] border border-blue-100 bg-gradient-to-br from-white via-blue-50/50 to-indigo-50/60 p-6 shadow-sm md:p-7">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-500">
                    Workspace Summary
                  </p>

                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                    Your current project activity
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    A simple snapshot of your organization’s projects, applicants,
                    selected volunteers, and completed work.
                  </p>
                </div>

                <span className="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  Live snapshot
                </span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <SummaryRow label="Pending Reviews" value={pendingReviews} tone="amber" />
                <SummaryRow label="Awaiting Funding" value={awaitingPaymentProjects.length} tone="blue" />
                <SummaryRow label="Active Volunteers" value={activeVolunteersCount} tone="emerald" />
                <SummaryRow label="Completed Projects" value={completedProjectsCount} tone="slate" />
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-sm md:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
                Recommended Action
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-tight">
                {awaitingPaymentProjects.length > 0
                  ? "Fund selected project"
                  : pendingReviews > 0
                  ? "Review applicants"
                  : "Keep momentum going"}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                {awaitingPaymentProjects.length > 0
                  ? "A volunteer has been selected or accepted your invite. Fund the project to start work."
                  : pendingReviews > 0
                  ? "You have volunteer applications waiting for review. Accept the best fit or reject unsuitable applicants."
                  : "Your workspace is clear. Post a new project or invite volunteers to keep activity moving."}
              </p>

              <Link
                href={
                  awaitingPaymentProjects.length > 0 || pendingReviews > 0
                    ? "#project-workstream"
                    : "/projects/new"
                }
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                {awaitingPaymentProjects.length > 0 || pendingReviews > 0
                  ? "Go to workstream"
                  : "Post a new project"}
              </Link>
            </div>
          </section>

          <LatestNotificationCard
            userId={session.user.id}
            notifications={notifications}
            unreadCount={unreadCount}
          />

          <section
            id="project-workstream"
            className="scroll-mt-24 rounded-[32px] border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/70 p-4 shadow-sm md:p-5"
          >
            <OrganizationProjectsTabs
              userId={session.user.id}
              activeProjects={activeProjects}
              pendingProjects={pendingProjects}
              completedProjects={completedProjects}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
  icon,
  tone,
}: {
  label: string;
  value: number;
  hint: string;
  icon: string;
  tone: "blue" | "emerald" | "slate" | "amber";
}) {
  const styles = {
    blue: {
      wrapper: "border-blue-100 bg-gradient-to-br from-white via-blue-50 to-indigo-50",
      icon: "border-blue-100 bg-blue-100 text-blue-700",
      top: "bg-blue-500",
    },
    emerald: {
      wrapper: "border-emerald-100 bg-gradient-to-br from-white via-emerald-50 to-teal-50",
      icon: "border-emerald-100 bg-emerald-100 text-emerald-700",
      top: "bg-emerald-500",
    },
    slate: {
      wrapper: "border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100",
      icon: "border-slate-200 bg-slate-100 text-slate-700",
      top: "bg-slate-500",
    },
    amber: {
      wrapper: "border-amber-100 bg-gradient-to-br from-white via-amber-50 to-orange-50",
      icon: "border-amber-100 bg-amber-100 text-amber-700",
      top: "bg-amber-500",
    },
  };

  return (
    <div
      className={`overflow-hidden rounded-[24px] border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${styles[tone].wrapper}`}
    >
      <div className={`h-1.5 ${styles[tone].top}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
              {label}
            </p>

            <p className="mt-3 text-4xl font-black tracking-tight text-slate-900">
              {value}
            </p>

            <p className="mt-2 text-sm text-slate-500">{hint}</p>
          </div>

          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-lg ${styles[tone].icon}`}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "blue" | "emerald" | "slate" | "amber";
}) {
  const styles = {
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
    slate: "border-slate-200 bg-slate-50 text-slate-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
  };

  return (
    <div
      className={`flex items-center justify-between rounded-2xl border px-4 py-4 ${styles[tone]}`}
    >
      <p className="text-sm font-bold">{label}</p>
      <p className="text-xl font-black">{value}</p>
    </div>
  );
}
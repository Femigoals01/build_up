



import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import UnreadBadge from "@/components/chat/UnreadBadge";
import NotificationBell from "@/components/notifications/NotificationBell";
import LatestNotificationCard from "@/components/notifications/LatestNotificationCard";
import OrganizationProjectsTabs from "@/components/organization/OrganizationProjectsTabs";
import SidebarShell from "@/components/sidebar/SidebarShell";
import SidebarContent from "@/components/sidebar/SidebarContent";
import OrganizationRealtimeRefresh from "@/components/organization/OrganizationRealtimeRefresh";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
        },
      },
    },
  },

  submissions: {
    orderBy: {
      createdAt: "desc",
    },
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
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const hasAcceptedVolunteer = (project: (typeof projects)[number]) =>
    project.applications.some(
      (application) =>
        application.status === "ACCEPTED" ||
        application.status === "COMPLETED"
    );

  const completedProjects = projects.filter((p) => p.status === "COMPLETED");

  const activeProjects = projects.filter(
    (p) =>
      p.status !== "COMPLETED" &&
      (p.status === "IN_PROGRESS" || hasAcceptedVolunteer(p))
  );

  const pendingProjects = projects.filter(
    (p) =>
      p.status === "OPEN" &&
      !hasAcceptedVolunteer(p)
  );

  const realApplications = projects.flatMap((p) =>
    p.applications.filter((a) => a.source !== "ORGANIZATION")
  );

  const totalApplicants = realApplications.length;

  const pendingReviews = realApplications.filter(
    (a) => a.status === "PENDING"
  ).length;

  const activeVolunteersCount = projects.flatMap((p) =>
    p.applications.filter(
      (a) => a.status === "ACCEPTED" || a.status === "COMPLETED"
    )
  ).length;

  const projectsPosted = projects.length;
  const openAndActiveProjects = activeProjects.length + pendingProjects.length;
  const completedProjectsCount = completedProjects.length;
  const acceptedPlacements = activeVolunteersCount;

  return (
    <div className="flex bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
      {/* <SidebarShell>
        <SidebarContent
          user={{
            name: session.user.name || "User",
            role: session.user.role || "ORGANIZATION",
          }}
        />
      </SidebarShell> */}

      <main className="min-w-0 flex-1 px-4 py-6 md:px-8 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-7xl space-y-8">


          

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

          <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5 md:px-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Performance Overview
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                    Organization performance at a glance
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-500">
                    A concise summary of projects, applicant flow, and
                    volunteer activity across your workspace.
                  </p>
                </div>

                <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                  Live dashboard snapshot
                </div>
              </div>
            </div>

            <div className="space-y-6 px-6 py-6 md:px-8 md:py-8">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <PrimaryStatCard
                  label="Projects Posted"
                  value={projectsPosted}
                  hint="Total projects created"
                  icon="📁"
                  accent="slate"
                />
                <PrimaryStatCard
                  label="Active Projects"
                  value={openAndActiveProjects}
                  hint="Open and in progress"
                  icon="⚡"
                  accent="blue"
                />
                <PrimaryStatCard
                  label="Total Applicants"
                  value={totalApplicants}
                  hint="Volunteer-submitted applications"
                  icon="👥"
                  accent="emerald"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SecondaryStatCard
                  label="Pending Reviews"
                  value={pendingReviews}
                  tone="amber"
                />
                <SecondaryStatCard
                  label="Active Volunteers"
                  value={activeVolunteersCount}
                  tone="blue"
                />
                <SecondaryStatCard
                  label="Completed Projects"
                  value={completedProjectsCount}
                  tone="slate"
                />
                <SecondaryStatCard
                  label="Accepted Placements"
                  value={acceptedPlacements}
                  tone="emerald"
                />
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <p className="text-sm leading-6 text-slate-600">
                    <span className="font-semibold text-slate-900">
                      {pendingReviews}
                    </span>{" "}
                    volunteer applications need attention, while{" "}
                    <span className="font-semibold text-slate-900">
                      {activeVolunteersCount}
                    </span>{" "}
                    volunteers are currently active across{" "}
                    <span className="font-semibold text-slate-900">
                      {openAndActiveProjects}
                    </span>{" "}
                    open and in-progress projects.
                  </p>

                  <Link
                    href="/dashboard/organization/inbox"
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Review activity
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <OrganizationRealtimeRefresh userId={session.user.id} />

          <OrganizationProjectsTabs
            userId={session.user.id}
            activeProjects={activeProjects}
            pendingProjects={pendingProjects}
            completedProjects={completedProjects}
          />
        </div>
      </main>
    </div>
  );
}

function MobileNavCard({
  href,
  icon,
  label,
  trailing,
  active = false,
}: {
  href: string;
  icon: string;
  label: string;
  trailing?: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-2xl border p-4 shadow-sm transition ${
        active
          ? "border-blue-100 bg-blue-50"
          : "border-slate-200 bg-slate-50/70 hover:bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-2xl text-base ${
            active
              ? "bg-blue-600 text-white"
              : "bg-white text-slate-700 border border-slate-200"
          }`}
        >
          {icon}
        </span>

        {trailing ? <span className="shrink-0">{trailing}</span> : null}
      </div>

      <p
        className={`mt-3 text-sm font-semibold ${
          active ? "text-blue-700" : "text-slate-800"
        }`}
      >
        {label}
      </p>
    </Link>
  );
}

function PrimaryStatCard({
  label,
  value,
  hint,
  icon,
  accent,
}: {
  label: string;
  value: number;
  hint: string;
  icon: string;
  accent: "blue" | "emerald" | "slate";
}) {
  const accentStyles = {
    blue: {
      chip: "bg-blue-50 text-blue-700 border-blue-100",
      ring: "from-blue-500/12 to-indigo-500/8",
    },
    emerald: {
      chip: "bg-emerald-50 text-emerald-700 border-emerald-100",
      ring: "from-emerald-500/12 to-teal-500/8",
    },
    slate: {
      chip: "bg-slate-100 text-slate-700 border-slate-200",
      ring: "from-slate-400/12 to-slate-500/8",
    },
  };

  return (
    <div className="relative overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-r ${accentStyles[accent].ring}`}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {label}
          </p>
          <p className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          <p className="mt-2 text-sm text-slate-500">{hint}</p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-lg ${accentStyles[accent].chip}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function SecondaryStatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "blue" | "emerald" | "slate" | "amber";
}) {
  const toneStyles = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div className={`h-3 w-3 rounded-full border ${toneStyles[tone]}`} />
      </div>
    </div>
  );
}
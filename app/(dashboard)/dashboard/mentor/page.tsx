





import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import UnreadBadge from "@/components/chat/UnreadBadge";
import SidebarShell from "@/components/sidebar/SidebarShell";
import SidebarContent from "@/components/sidebar/SidebarContent";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getStatusStyles(status: string) {
  switch (status) {
    case "OPEN":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "IN_PROGRESS":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "COMPLETED":
      return "border-slate-200 bg-slate-100 text-slate-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function parseSkills(skills: string | null | undefined) {
  if (!skills) return [];
  return skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

type Volunteer = {
  id: string;
  name: string;
  email: string;
  username: string | null;
  skills: string | null;
  rating: number;
  ratingCount: number;
};

type Application = {
  volunteer: Volunteer;
};

type Project = {
  id: string;
  title: string;
  status: string;
  organization: {
    name: string;
  };
  chat: {
    id: string;
  } | null;
  applications: Application[];
};

export default async function MentorDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "MENTOR") {
    redirect("/login");
  }

  const [projects, pendingRequestsCount] = await Promise.all([
    prisma.project.findMany({
      where: {
        mentorId: session.user.id,
      },
      include: {
        organization: {
          select: { name: true },
        },
        chat: {
          select: { id: true },
        },
        applications: {
          where: { status: "ACCEPTED" },
          include: {
            volunteer: {
              select: {
                id: true,
                name: true,
                email: true,
                username: true,
                skills: true,
                rating: true,
                ratingCount: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),

    prisma.mentorshipRequest.count({
      where: {
        mentorId: session.user.id,
        status: "PENDING",
      },
    }),
  ]);

  const totalVolunteers = projects.flatMap(
    (project) => project.applications
  ).length;
  const activeProjects = projects.filter(
    (project) => project.status !== "COMPLETED"
  ).length;
  const completedProjects = projects.filter(
    (project) => project.status === "COMPLETED"
  ).length;

  return (
    <div className="flex bg-slate-50">
      {/* <SidebarShell>
        <SidebarContent
          user={{
            name: session.user.name || "User",
            role: session.user.role || "MENTOR",
          }}
        />
      </SidebarShell> */}

      <main className="min-w-0 flex-1 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_38%,#eef4ff_100%)] px-4 py-6 md:px-8 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/90 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.14),transparent_28%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

            <div className="relative z-10 flex flex-col gap-8 px-6 py-7 md:px-8 md:py-8 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-700">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  Mentor Workspace
                </div>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  Manage your mentorship work with more clarity
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                  View your assigned projects, monitor volunteer participation,
                  access conversations quickly, and keep up with mentorship
                  requests from one organized dashboard.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[360px]">
                <QuickInfoCard
                  label="Pending Requests"
                  value={pendingRequestsCount}
                  helper="Awaiting your review"
                  tone="blue"
                />
                <QuickInfoCard
                  label="Active Volunteers"
                  value={totalVolunteers}
                  helper="Across all projects"
                  tone="slate"
                />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_2fr]">
            <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
              <div className="flex h-full flex-col justify-between gap-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Quick Access
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">
                    Stay on top of new mentorship activity
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Review incoming mentorship requests and respond faster
                    without digging through multiple screens.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/dashboard/mentor/requests"
                    className="group relative inline-flex h-12 items-center gap-2 rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    <span>Open Mentorship Requests</span>
                    <UnreadBadge />
                    {pendingRequestsCount > 0 && (
                      <span className="inline-flex min-w-[24px] items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                        {pendingRequestsCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Stat
                title="Total Projects"
                value={projects.length}
                icon="📁"
                tone="blue"
              />
              <Stat
                title="Active Projects"
                value={activeProjects}
                icon="🚀"
                tone="emerald"
              />
              <Stat
                title="Completed"
                value={completedProjects}
                icon="✅"
                tone="slate"
              />
              <Stat
                title="Volunteers"
                value={totalVolunteers}
                icon="🧑‍💻"
                tone="amber"
              />
            </div>
          </section>

          {projects.length === 0 ? (
            <section className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto max-w-md">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
                  🧑‍🏫
                </div>
                <h2 className="text-xl font-semibold text-slate-900">
                  No assigned projects yet
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  When a project is assigned to you, it will appear here
                  together with the volunteers you are guiding.
                </p>
                <Link
                  href="/dashboard/mentor/requests"
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  View Mentorship Requests
                </Link>
              </div>
            </section>
          ) : (
            <section className="space-y-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project as Project} />
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const volunteerCount = project.applications.length;

  return (
    <section className="group overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="border-b border-slate-100 bg-[linear-gradient(180deg,rgba(248,250,252,0.85),rgba(255,255,255,1))] px-6 py-6 md:px-7">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-xl text-white shadow-[0_10px_25px_rgba(37,99,235,0.25)]">
                📘
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${getStatusStyles(
                      project.status
                    )}`}
                  >
                    {formatStatus(project.status)}
                  </span>

                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
                    {volunteerCount} volunteer
                    {volunteerCount === 1 ? "" : "s"}
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] ${
                      project.chat
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                    }`}
                  >
                    {project.chat ? "Chat Ready" : "No Chat Yet"}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                  {project.title}
                </h2>

                <p className="mt-2 text-sm text-slate-500 md:text-[15px]">
                  Mentoring for{" "}
                  <span className="font-semibold text-slate-700">
                    {project.organization.name}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:w-[320px] xl:grid-cols-1">
            {project.chat && (
              <Link
                href={`/dashboard/projects/${project.id}/chat`}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Open Project Chat
              </Link>
            )}

            <Link
              href={`/dashboard/projects/${project.id}`}
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Full Project
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <MiniMetric label="Project Status" value={formatStatus(project.status)} />
          <MiniMetric label="Assigned Volunteers" value={String(volunteerCount)} />
          <MiniMetric
            label="Conversation"
            value={project.chat ? "Available" : "Not started"}
          />
        </div>
      </div>

      <div className="px-6 py-6 md:px-7">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Team Members
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              Assigned Volunteers
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Accepted volunteers currently working under your mentorship.
            </p>
          </div>
        </div>

        {project.applications.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
              👥
            </div>
            <p className="text-sm font-semibold text-slate-700">
              No volunteers assigned yet
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Accepted volunteers will appear here once they join this project.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {project.applications.map((app) => (
              <VolunteerCard key={app.volunteer.id} volunteer={app.volunteer} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  const skills = parseSkills(volunteer.skills);
  const hasRating = volunteer.ratingCount > 0;

  return (
    <article className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5 shadow-sm transition duration-300 hover:border-blue-200 hover:shadow-[0_12px_30px_rgba(59,130,246,0.08)]">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-[0_8px_20px_rgba(59,130,246,0.25)]">
          {getInitials(volunteer.name)}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="truncate text-base font-semibold text-slate-900 md:text-lg">
            {volunteer.name}
          </h4>
          <p className="mt-1 break-all text-sm text-slate-500">
            {volunteer.email}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoPill
          label="Portfolio"
          value={volunteer.username ? "Available" : "Not available"}
          tone={volunteer.username ? "blue" : "slate"}
        />
        <InfoPill
          label="Reviews"
          value={String(volunteer.ratingCount)}
          tone="amber"
        />
      </div>

      {skills.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 6).map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {skill}
              </span>
            ))}
            {skills.length > 6 && (
              <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                +{skills.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="mt-5 rounded-[20px] border border-amber-100 bg-amber-50 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-amber-800">Volunteer Rating</p>
          <p className="text-sm font-bold text-amber-700">
            {hasRating ? `⭐ ${volunteer.rating.toFixed(1)}` : "No ratings yet"}
          </p>
        </div>
      </div>

      <div className="mt-5">
        {volunteer.username ? (
          <Link
            href={`/portfolio/${volunteer.username}`}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            View Portfolio
          </Link>
        ) : (
          <p className="text-sm text-slate-400">Portfolio not available yet</p>
        )}
      </div>
    </article>
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
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
    slate: "border-slate-200 bg-slate-100 text-slate-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
  };

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-slate-500">{title}</h3>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-lg ${toneStyles[tone]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function QuickInfoCard({
  label,
  value,
  helper,
  tone,
}: {
  label: string;
  value: number;
  helper: string;
  tone: "blue" | "slate";
}) {
  const styles = {
    blue: "border-blue-100 bg-blue-50/70",
    slate: "border-slate-200 bg-slate-50/80",
  };

  return (
    <div className={`rounded-[22px] border p-4 ${styles[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-1 text-sm text-slate-500">{helper}</p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function InfoPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "blue" | "amber" | "slate";
}) {
  const styles = {
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
    slate: "border-slate-200 bg-slate-50 text-slate-600",
  };

  return (
    <div className={`rounded-2xl border px-3 py-3 ${styles[tone]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
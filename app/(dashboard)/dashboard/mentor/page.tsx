


// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import UnreadBadge from "@/components/chat/UnreadBadge";


// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// export default async function MentorDashboard() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "MENTOR") {
//     redirect("/login");
//   }

//   /* ================= FETCH DATA ================= */

//   const [projects, pendingRequestsCount] = await Promise.all([
//     prisma.project.findMany({
//       where: {
//         mentorId: session.user.id,
//       },
//       include: {
//         organization: {
//           select: { name: true },
//         },
//         chat: {
//           select: { id: true },
//         },
//         applications: {
//           where: { status: "ACCEPTED" },
//           include: {
//             volunteer: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 username: true,
//                 skills: true,
//                 rating: true,
//                 ratingCount: true,
//               },
//             },
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     }),

//     prisma.mentorshipRequest.count({
//       where: {
//         mentorId: session.user.id,
//         status: "PENDING",
//       },
//     }),
//   ]);

//   return (
//     <main className="p-10 space-y-10 bg-gray-50 min-h-screen">
//       {/* HEADER */}
//       <header className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold">Mentor Dashboard</h1>
//           <p className="text-gray-600 mt-1">
//             Projects and volunteers you are mentoring
//           </p>
//         </div>

//         {/* REQUESTS CTA */}
//         {/* <a
//           href="/dashboard/mentor/requests"
//           className="relative bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700"
//         >
//           Mentorship Requests
//           {pendingRequestsCount > 0 && (
//             <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
//               {pendingRequestsCount}
//             </span>
//           )}
//         </a> */}

//         <a
//   href="/dashboard/mentor/requests"
//   className="relative bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2"
// >
//   <span>Mentorship Requests</span>

//   {/* 🔔 Unread chat messages */}
//   <UnreadBadge />

//   {/* 📩 Pending mentorship requests */}
//   {pendingRequestsCount > 0 && (
//     <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
//       {pendingRequestsCount}
//     </span>
//   )}
// </a>

//       </header>

//       {/* EMPTY STATE */}
//       {projects.length === 0 ? (
//         <div className="bg-white border rounded-xl p-10 text-center text-gray-600">
//           You are not mentoring any projects yet.
//         </div>
//       ) : (
//         <div className="space-y-8">
//           {projects.map((project) => (
//             <ProjectCard key={project.id} project={project} />
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }

// /* ================= PROJECT CARD ================= */

// function ProjectCard({ project }: any) {
//   return (
//     <section className="bg-white border rounded-2xl p-6 shadow-sm space-y-5">
//       {/* PROJECT HEADER */}
//       <div className="flex justify-between items-start">
//         <div>
//           <h2 className="text-xl font-semibold">{project.title}</h2>
//           <p className="text-sm text-gray-600">
//             Organization: {project.organization.name}
//           </p>

//           <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
//             {project.status}
//           </span>
//         </div>

//         {/* PROJECT ACTIONS */}
//         <div className="flex gap-3">
//           {project.chat && (
//             <a
//               href={`/dashboard/projects/${project.id}/chat`}
//               className="border px-4 py-2 rounded-lg text-sm"
//             >
//               Open Chat
//             </a>
//           )}

//           <a
//             href={`/dashboard/projects/${project.id}`}
//             className="border px-4 py-2 rounded-lg text-sm"
//           >
//             View Project
//           </a>
//         </div>
//       </div>

//       {/* VOLUNTEERS */}
//       {project.applications.length === 0 ? (
//         <p className="text-sm text-gray-500">
//           No volunteers assigned yet.
//         </p>
//       ) : (
//         <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
//           {project.applications.map((app: any) => (
//             <VolunteerCard
//               key={app.volunteer.id}
//               volunteer={app.volunteer}
//             />
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }

// /* ================= VOLUNTEER CARD ================= */

// function VolunteerCard({ volunteer }: { volunteer: any }) {
//   return (
//     <div className="border rounded-xl p-4 space-y-3 bg-gray-50">
//       <div>
//         <h3 className="font-semibold">{volunteer.name}</h3>
//         <p className="text-xs text-gray-500">{volunteer.email}</p>
//       </div>

//       {/* SKILLS */}
//       {volunteer.skills && (
//         <div className="flex flex-wrap gap-2">
//           {volunteer.skills.split(",").map((skill: string) => (
//             <span
//               key={skill}
//               className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full"
//             >
//               {skill.trim()}
//             </span>
//           ))}
//         </div>
//       )}

//       {/* RATING */}
//       <p className="text-sm text-yellow-600">
//         ⭐ {volunteer.rating.toFixed(1)} ({volunteer.ratingCount})
//       </p>

//       {/* ACTIONS */}
//       <div className="flex gap-3 pt-2">
//         <a
//           href={`/portfolio/${volunteer.username}`}
//           className="text-sm text-blue-600 hover:underline"
//         >
//           View Portfolio
//         </a>
//       </div>
//     </div>
//   );
// }





import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import UnreadBadge from "@/components/chat/UnreadBadge";

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

  const totalVolunteers = projects.flatMap((project) => project.applications).length;
  const activeProjects = projects.filter((project) => project.status !== "COMPLETED").length;
  const completedProjects = projects.filter((project) => project.status === "COMPLETED").length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 px-4 py-6 md:px-8 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* HERO / HEADER */}
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="relative px-6 py-8 md:px-8 md:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_24%)]" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  <span className="h-2 w-2 rounded-full bg-indigo-600" />
                  Mentor Dashboard
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  Projects and volunteers you are mentoring
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                  Track your assigned projects, support volunteers, review active
                  collaborations, and stay on top of mentorship requests from one
                  place.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard/mentor/requests"
                  className="relative inline-flex h-11 items-center gap-2 rounded-2xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  <span>Mentorship Requests</span>
                  <UnreadBadge />
                  {pendingRequestsCount > 0 && (
                    <span className="absolute -top-2 -right-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
                      {pendingRequestsCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Stat title="Total Projects" value={projects.length} icon="📁" tone="blue" />
          <Stat title="Active Projects" value={activeProjects} icon="🚀" tone="emerald" />
          <Stat title="Completed Projects" value={completedProjects} icon="✅" tone="slate" />
          <Stat title="Active Volunteers" value={totalVolunteers} icon="🧑‍💻" tone="amber" />
        </section>

        {/* EMPTY STATE */}
        {projects.length === 0 ? (
          <section className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
                🧑‍🏫
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                You are not mentoring any projects yet
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Once projects are assigned to you, they will appear here along
                with the volunteers you are guiding.
              </p>
              <Link
                href="/dashboard/mentor/requests"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700"
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
  );
}

/* ================= PROJECT CARD ================= */

function ProjectCard({ project }: { project: Project }) {
  const volunteerCount = project.applications.length;

  return (
    <section className="overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] md:p-7">
      {/* PROJECT HEADER */}
      <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-lg text-white shadow-sm">
              📘
            </div>

            <div className="min-w-0">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                {project.title}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Organization: {project.organization.name}
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
              {volunteerCount} volunteer{volunteerCount === 1 ? "" : "s"}
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              {project.chat ? "Chat available" : "No chat yet"}
            </span>
          </div>
        </div>

        {/* PROJECT ACTIONS */}
        <div className="w-full lg:w-auto lg:min-w-[240px]">
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Project actions</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Open the discussion thread or review the full project details.
            </p>

            <div className="mt-4 flex flex-col gap-3">
              {project.chat && (
                <Link
                  href={`/dashboard/projects/${project.id}/chat`}
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  Open Chat
                </Link>
              )}

              <Link
                href={`/dashboard/projects/${project.id}`}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                View Project
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* VOLUNTEERS */}
      <div className="pt-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Assigned Volunteers
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            These are the volunteers currently accepted on this project.
          </p>
        </div>

        {project.applications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
            <p className="text-sm font-medium text-slate-700">
              No volunteers assigned yet.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Accepted volunteers will appear here when they join the project.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {project.applications.map((app) => (
              <VolunteerCard key={app.volunteer.id} volunteer={app.volunteer} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ================= VOLUNTEER CARD ================= */

function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  const skills = parseSkills(volunteer.skills);

  return (
    <article className="rounded-[22px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-sm">
          {getInitials(volunteer.name)}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-base font-semibold text-slate-900">
            {volunteer.name}
          </h4>
          <p className="mt-1 break-all text-xs text-slate-500">
            {volunteer.email}
          </p>
        </div>
      </div>

      {skills.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
        <p className="text-sm font-medium text-amber-800">Volunteer Rating</p>
        <p className="text-sm font-bold text-amber-700">
          ⭐ {volunteer.rating.toFixed(1)} ({volunteer.ratingCount})
        </p>
      </div>

      <div className="mt-4 pt-1">
        {volunteer.username ? (
          <Link
            href={`/portfolio/${volunteer.username}`}
            className="inline-flex items-center text-sm font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
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
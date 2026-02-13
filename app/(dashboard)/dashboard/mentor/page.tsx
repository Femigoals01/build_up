


import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import UnreadBadge from "@/components/chat/UnreadBadge";


export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MentorDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "MENTOR") {
    redirect("/login");
  }

  /* ================= FETCH DATA ================= */

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

  return (
    <main className="p-10 space-y-10 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mentor Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Projects and volunteers you are mentoring
          </p>
        </div>

        {/* REQUESTS CTA */}
        {/* <a
          href="/dashboard/mentor/requests"
          className="relative bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700"
        >
          Mentorship Requests
          {pendingRequestsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              {pendingRequestsCount}
            </span>
          )}
        </a> */}

        <a
  href="/dashboard/mentor/requests"
  className="relative bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2"
>
  <span>Mentorship Requests</span>

  {/* 🔔 Unread chat messages */}
  <UnreadBadge />

  {/* 📩 Pending mentorship requests */}
  {pendingRequestsCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
      {pendingRequestsCount}
    </span>
  )}
</a>

      </header>

      {/* EMPTY STATE */}
      {projects.length === 0 ? (
        <div className="bg-white border rounded-xl p-10 text-center text-gray-600">
          You are not mentoring any projects yet.
        </div>
      ) : (
        <div className="space-y-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </main>
  );
}

/* ================= PROJECT CARD ================= */

function ProjectCard({ project }: any) {
  return (
    <section className="bg-white border rounded-2xl p-6 shadow-sm space-y-5">
      {/* PROJECT HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{project.title}</h2>
          <p className="text-sm text-gray-600">
            Organization: {project.organization.name}
          </p>

          <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
            {project.status}
          </span>
        </div>

        {/* PROJECT ACTIONS */}
        <div className="flex gap-3">
          {project.chat && (
            <a
              href={`/dashboard/projects/${project.id}/chat`}
              className="border px-4 py-2 rounded-lg text-sm"
            >
              Open Chat
            </a>
          )}

          <a
            href={`/dashboard/projects/${project.id}`}
            className="border px-4 py-2 rounded-lg text-sm"
          >
            View Project
          </a>
        </div>
      </div>

      {/* VOLUNTEERS */}
      {project.applications.length === 0 ? (
        <p className="text-sm text-gray-500">
          No volunteers assigned yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {project.applications.map((app: any) => (
            <VolunteerCard
              key={app.volunteer.id}
              volunteer={app.volunteer}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* ================= VOLUNTEER CARD ================= */

function VolunteerCard({ volunteer }: { volunteer: any }) {
  return (
    <div className="border rounded-xl p-4 space-y-3 bg-gray-50">
      <div>
        <h3 className="font-semibold">{volunteer.name}</h3>
        <p className="text-xs text-gray-500">{volunteer.email}</p>
      </div>

      {/* SKILLS */}
      {volunteer.skills && (
        <div className="flex flex-wrap gap-2">
          {volunteer.skills.split(",").map((skill: string) => (
            <span
              key={skill}
              className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full"
            >
              {skill.trim()}
            </span>
          ))}
        </div>
      )}

      {/* RATING */}
      <p className="text-sm text-yellow-600">
        ⭐ {volunteer.rating.toFixed(1)} ({volunteer.ratingCount})
      </p>

      {/* ACTIONS */}
      <div className="flex gap-3 pt-2">
        <a
          href={`/portfolio/${volunteer.username}`}
          className="text-sm text-blue-600 hover:underline"
        >
          View Portfolio
        </a>
      </div>
    </div>
  );
}

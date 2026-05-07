


import { getServerSession } from "next-auth";
import VolunteerProjectsTabs from "@/components/volunteer/VolunteerProjectsTabs";

import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function VolunteerProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "VOLUNTEER") {
    redirect("/login");
  }

  const applications = await prisma.application.findMany({
    where: { volunteerId: session.user.id },
    include: {
      project: {
        include: {
          organization: { select: { name: true } },
          mentor: { select: { name: true } },
          submissions: {
            where: { volunteerId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const activeProjects = applications.filter(
    (app) =>
      app.status === "ACCEPTED" &&
      (app.project.status === "OPEN" || app.project.status === "IN_PROGRESS")
  );

//   const pendingProjects = applications.filter(
//     (app) => app.status === "PENDING"
//   );

const pendingProjects = applications.filter(
  (app) => app.status === "PENDING" || app.status === "AWAITING_PAYMENT"
);

  const completedProjects = applications.filter(
    (app) =>
      app.status === "COMPLETED" || app.project.status === "COMPLETED"
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <Link
            href="/dashboard/volunteer"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            ← Back to dashboard
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            My Projects
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View your active, pending, and completed project engagements.
          </p>
        </div>

        {/* <ProjectSection title="Active Projects" projects={activeProjects} />
        <ProjectSection title="Pending Projects" projects={pendingProjects} />
        <ProjectSection title="Completed Projects" projects={completedProjects} /> */}

        <VolunteerProjectsTabs
  activeProjects={activeProjects}
  pendingProjects={pendingProjects}
  completedProjects={completedProjects}
/>
      </div>
    </main>
  );
}

function ProjectSection({
  title,
  projects,
}: {
  title: string;
  projects: any[];
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {projects.length}
        </span>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500">
          No {title.toLowerCase()} yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((app) => {
            const latestSubmission = app.project.submissions?.[0];

            return (
              <div
                key={app.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="text-lg font-bold text-slate-900">
                  {app.project.title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {app.project.organization.name}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {app.status}
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {app.project.status}
                  </span>

                  {latestSubmission && (
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      Submission: {latestSubmission.status}
                    </span>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    href={`/dashboard/projects/${app.project.id}/chat`}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Open Chat
                  </Link>

                  <Link
                    href={`/dashboard/projects/${app.project.id}/submit`}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    View / Submit
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
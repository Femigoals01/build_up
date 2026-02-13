


import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import ApplicantCard from "@/components/organization/ApplicantCard";
import CompleteProjectButton from "@/components/organization/CompleteProjectButton";
import UnreadBadge from "@/components/chat/UnreadBadge";


export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function OrganizationDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZATION") {
    redirect("/login");
  }

  const projects = await prisma.project.findMany({
    where: { organizationId: session.user.id },
    include: {
      applications: {
        include: { volunteer: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const activeProjects = projects.filter(p => p.status !== "COMPLETED");
  const completedProjects = projects.filter(p => p.status === "COMPLETED");

  const totalApplicants = projects.reduce(
    (acc, p) => acc + p.applications.length,
    0
  );

  const activeVolunteersCount = projects.flatMap(p =>
    p.applications.filter(a => a.status === "ACCEPTED")
  ).length;

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r px-6 py-8">
        <h2 className="text-2xl font-bold mb-10 text-blue-600">BuildUp</h2>
        {/* <nav className="space-y-4 text-gray-700">
          <a className="font-semibold text-blue-600 block">Dashboard</a>
          <a className="block hover:text-blue-600">My Projects</a>
          <a href="/projects/new" className="block hover:text-blue-600">
            Post a Project
          </a>
        </nav> */}

        <nav className="space-y-4 text-gray-700">
  <a
    href="/dashboard/organization"
    className="font-semibold text-blue-600 block"
  >
    Dashboard
  </a>

   <a className="block hover:text-blue-600">My Projects</a>

  {/* <a
    href="/dashboard/organization/inbox"
    className="block hover:text-blue-600 transition"
  >
    Messages
  </a> */}

  <a
  href="/dashboard/organization/inbox"
  className="flex items-center gap-2 hover:text-blue-600 transition"
>
  Messages
  <UnreadBadge />
</a>


  <a
    href="/projects/new"
    className="block hover:text-blue-600 transition"
  >
    Post a Project
  </a>
</nav>

      </aside>

      {/* MAIN */}
      <main className="flex-1 px-10 py-10 space-y-12">

        <section>
          <h1 className="text-3xl font-bold">Organization Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage projects and volunteers.
          </p>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Stat title="Projects Posted" value={projects.length} />
          <Stat title="Active Projects" value={activeProjects.length} />
          <Stat title="Completed Projects" value={completedProjects.length} />
          <Stat title="Active Volunteers" value={activeVolunteersCount} />
        </section>

        {/* PROJECT LIST */}
        {projects.map(project => {
          const pendingApps = project.applications.filter(a => a.status === "PENDING");
          const activeApps = project.applications.filter(a => a.status === "ACCEPTED");

          return (
            <section
              key={project.id}
              className="bg-white border rounded-xl p-8 shadow-sm space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{project.title}</h2>
                <span className="text-sm text-gray-500">
                  {project.status}
                </span>
              </div>

              {/* APPLICANTS */}
              {pendingApps.map(app => (
                <ApplicantCard
                  key={app.id}
                  applicationId={app.id}
                  name={app.volunteer.name}
                  email={app.volunteer.email}
                  status={app.status}
                />
              ))}

              {/* ACTIONS */}
              <div className="pt-4 border-t">
                {project.status !== "COMPLETED" ? (
                  <CompleteProjectButton projectId={project.id} />
                ) : (
                  <a
                    href={`/project/${project.id}/review`}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Leave Review
                  </a>
                )}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

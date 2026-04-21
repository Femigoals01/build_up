



import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import ApplyButton from "@/components/projects/ApplyButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getDifficultyStyles(level: string) {
  switch (level) {
    case "BEGINNER":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "INTERMEDIATE":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "ADVANCED":
      return "bg-purple-50 text-purple-700 border-purple-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

export default async function BrowseProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VOLUNTEER") {
    redirect("/login");
  }

  const projects = await prisma.project.findMany({
    where: {
      status: "OPEN",
    },
    include: {
      organization: {
        select: { name: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-10">

        {/* ===== HEADER ===== */}
        <section className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Explore Live Projects
          </h1>
          <p className="mt-3 text-slate-600 text-base leading-7">
            Work on real-world projects from organizations, gain experience, and build a strong portfolio.
          </p>
        </section>

        {/* ===== PROJECT GRID ===== */}
        {projects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
            No projects available right now.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {projects.map((project) => (
              <div
                key={project.id}
                className="group relative flex flex-col justify-between rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                {/* TOP BADGES */}
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getDifficultyStyles(
                      project.difficulty
                    )}`}
                  >
                    {project.difficulty}
                  </span>

                  <span className="text-xs text-slate-400">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* TITLE */}
                <h2 className="mt-4 text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition">
                  {project.title}
                </h2>

                {/* ORGANIZATION */}
                <p className="mt-1 text-sm text-slate-500">
                  {project.organization.name}
                </p>

                {/* DESCRIPTION */}
                <p className="mt-4 text-sm text-slate-600 line-clamp-3 leading-6">
                  {project.description}
                </p>

                {/* SKILLS */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.skills.slice(0, 4).map((skill: string, i: number) => (
                    <span
                      key={i}
                      className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* FOOTER */}
                <div className="mt-6 space-y-3">

                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="block w-full text-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    View Details
                  </Link>

                  <ApplyButton projectId={project.id} />
                </div>

                {/* HOVER GLOW */}
                <div className="pointer-events-none absolute inset-0 rounded-[26px] ring-1 ring-transparent group-hover:ring-blue-200 transition" />
              </div>
            ))}

          </div>
        )}
      </div>
    </main>
  );
}
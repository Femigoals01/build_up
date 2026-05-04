


import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

function formatDifficulty(level: string) {
  return level.charAt(0) + level.slice(1).toLowerCase();
}

function getDifficultyStyles(level: string) {
  switch (level) {
    case "BEGINNER":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "INTERMEDIATE":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "ADVANCED":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

export default async function BrowseProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VOLUNTEER") {
    redirect("/login");
  }

  // const projects = await prisma.project.findMany({
  //   where: {
  //     status: "OPEN",
  //   },
  //   include: {
  //     organization: {
  //       select: { name: true },
  //     },
  //   },
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  // });


  const projects = await prisma.project.findMany({
  where: {
    status: "OPEN",
    applications: {
      none: {
        status: {
          in: ["ACCEPTED", "COMPLETED"],
        },
      },
    },
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 md:px-8 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* ===== HERO / PAGE HEADER ===== */}
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="relative px-6 py-8 md:px-8 md:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_24%)]" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  BuildUp Opportunities
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  Browse Projects
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                  Explore real projects from organizations and start building
                  practical experience that strengthens your portfolio, skills,
                  and proof of work.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center sm:min-w-[130px]">
                  <p className="text-2xl font-bold text-slate-900">
                    {projects.length}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    Open Projects
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center sm:min-w-[130px]">
                  <p className="text-2xl font-bold text-slate-900">
                    {
                      new Set(
                        projects.flatMap((project) => project.skills || [])
                      ).size
                    }
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    Skill Areas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SEARCH + FILTERS (UI READY, LOGIC LATER) ===== */}
        <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="max-w-xl">
                <h2 className="text-lg font-semibold text-slate-900">
                  Discover your next project
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Use the filters below to narrow down opportunities that match
                  your interests and skill level.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                Live opportunities available now
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <input
                type="text"
                placeholder="Search projects..."
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />

              <select className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100">
                <option>All Skills</option>
              </select>

              <select className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100">
                <option>All Levels</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>

              <select className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100">
                <option>Open Projects</option>
              </select>
            </div>
          </div>
        </section>

        {/* ===== PROJECT LIST ===== */}
        <section className="space-y-5">
          {projects.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto max-w-md">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
                  💼
                </div>
                <h2 className="text-xl font-semibold text-slate-900">
                  No projects available right now
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Check back soon. Organizations are posting new opportunities
                  that you can apply to and use to grow your portfolio.
                </p>
              </div>
            </div>
          ) : (
            projects.map((project) => (
              <article
                key={project.id}
                className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] md:p-7"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  {/* LEFT */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-4 flex flex-wrap items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg text-white shadow-sm">
                        💼
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                            {project.title}
                          </h2>

                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            OPEN
                          </span>
                        </div>

                        <p className="mt-1 text-sm font-medium text-slate-500">
                          {project.organization.name}
                        </p>
                      </div>
                    </div>

                    <p className="max-w-4xl text-sm leading-7 text-slate-600 md:text-[15px]">
                      {project.description}
                    </p>

                    <div className="mt-6 flex flex-col gap-4">
                      <div>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Skills Needed
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {project.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getDifficultyStyles(
                            project.difficulty
                          )}`}
                        >
                          Level: {formatDifficulty(project.difficulty)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT CTA PANEL */}
                  <div className="w-full lg:w-auto lg:min-w-[220px]">
                    <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-900">
                        Ready to explore?
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        View the full details, expectations, and next steps for
                        this opportunity.
                      </p>

                      <div className="mt-4">
                        <Link
                          href={`/projects/${project.id}`}
                          className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                          View Project
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
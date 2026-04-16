


import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BuildUpLogo from "@/components/brand/BuildUpLogo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const projects = await prisma.project.findMany({
    where: { status: "OPEN" },
    take: 4,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      difficulty: true,
      organization: {
        select: { name: true },
      },
    },
  });

  const featuredStats = [
    { value: "1,000+", label: "Volunteers" },
    { value: "500+", label: "Projects" },
    { value: "200+", label: "Organizations" },
    { value: "150+", label: "Mentors" },
  ];

  const workflowSteps = [
    {
      step: "01",
      icon: "🏢",
      title: "Organizations post real work",
      text: "Businesses and nonprofits publish real projects that need real execution, not mock tasks.",
    },
    {
      step: "02",
      icon: "🙋",
      title: "Volunteers gain real experience",
      text: "Emerging talent contributes on live projects, builds confidence, and learns by doing.",
    },
    {
      step: "03",
      icon: "🧑‍🏫",
      title: "Mentors guide the process",
      text: "Experienced professionals provide direction, structure, and real-world quality standards.",
    },
    {
      step: "04",
      icon: "🏆",
      title: "Proof of work is unlocked",
      text: "Completed projects, reviews, badges, and portfolio evidence become visible outcomes.",
    },
  ];

  return (
    <main className="overflow-x-hidden bg-white text-slate-900">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_42%,#ffffff_100%)]" />
        <div className="absolute -left-20 top-20 -z-10 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute right-0 top-24 -z-10 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 -z-10 h-64 w-64 rounded-full bg-cyan-100/40 blur-3xl" />

        <div className="mx-auto grid max-w-7xl gap-16 px-6 pb-24 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pt-24">
          <div className="max-w-3xl">
            <div className="mb-7">
              <div className="group relative inline-flex">
                <div className="absolute -inset-3 rounded-[30px] bg-gradient-to-r from-blue-200/60 via-indigo-200/50 to-cyan-200/60 blur-2xl opacity-70 transition duration-700 group-hover:opacity-100 animate-pulse" />
                <div className="absolute -inset-[1px] rounded-[28px] bg-gradient-to-r from-blue-200 via-indigo-200 to-cyan-200 opacity-70" />
                <div className="relative rounded-[28px] border border-white/70 bg-white/90 px-5 py-4 shadow-xl shadow-blue-100 backdrop-blur">
                  <BuildUpLogo
                    href="/"
                    showTagline={true}
                    className="justify-start"
                    imageClassName="shadow-sm"
                    textSize="lg"
                  />
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
              Real projects • Real mentors • Real proof of work
            </div>

            <h1 className="mt-7 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl xl:text-7xl">
              Build real experience.
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Not just certificates.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              <span className="font-semibold text-slate-800">BuildUp</span>{" "}
              connects emerging talent with real organizations so they can work
              on live projects, receive mentor guidance, and grow a portfolio
              backed by actual outcomes.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/register/volunteer"
                className="inline-flex h-14 items-center justify-center rounded-2xl bg-blue-600 px-7 text-base font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
              >
                Get Started as a Volunteer
              </Link>

              <Link
                href="/register/organization"
                className="inline-flex h-14 items-center justify-center rounded-2xl border border-slate-300 bg-white px-7 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Post a Project
              </Link>

              <Link
                href="/register/mentor"
                className="inline-flex h-14 items-center justify-center rounded-2xl bg-indigo-600 px-7 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
              >
                Become a Mentor
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Live project exposure
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                Mentor-guided growth
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                Portfolio-ready outcomes
              </div>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  For Volunteers
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Build proof of work that employers and clients can actually
                  see.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  For Organizations
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Access motivated emerging talent with mentor-supported
                  delivery.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  For Mentors
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Guide real growth while shaping project quality and outcomes.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-blue-100 to-indigo-100 blur-2xl opacity-80" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-2xl shadow-blue-100 backdrop-blur-xl">
              <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4">
                <span className="h-3 w-3 rounded-full bg-red-300" />
                <span className="h-3 w-3 rounded-full bg-yellow-300" />
                <span className="h-3 w-3 rounded-full bg-green-300" />

                <div className="ml-3 flex items-center gap-3">
                  <BuildUpLogo
                    href="/"
                    showTagline={false}
                    className="justify-start"
                    textSize="sm"
                    imageClassName="h-9 w-9 rounded-xl"
                  />
                  <span className="text-sm font-semibold text-slate-500">
                    Experience Flow
                  </span>
                </div>
              </div>

              <div className="space-y-6 bg-gradient-to-b from-white to-blue-50/50 p-6 md:p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Active Projects
                    </p>
                    <p className="mt-3 text-3xl font-bold text-slate-900">
                      500+
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Real opportunities across sectors
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Mentors
                    </p>
                    <p className="mt-3 text-3xl font-bold text-slate-900">
                      150+
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Experienced professionals
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">
                      Featured workflow
                    </p>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      Structured path
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <span className="text-sm font-medium text-slate-700">
                        Organization posts project
                      </span>
                      <span className="text-xs font-semibold text-blue-600">
                        Step 1
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <span className="text-sm font-medium text-slate-700">
                        Volunteer applies and collaborates
                      </span>
                      <span className="text-xs font-semibold text-blue-600">
                        Step 2
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <span className="text-sm font-medium text-slate-700">
                        Mentor reviews progress
                      </span>
                      <span className="text-xs font-semibold text-blue-600">
                        Step 3
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-blue-600 px-4 py-3 text-white shadow-sm">
                      <span className="text-sm font-semibold">
                        Proof of experience unlocked
                      </span>
                      <span className="text-xs font-bold uppercase tracking-[0.14em]">
                        Result
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">
                    Outcome highlights
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      Project completion
                    </span>
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      Reviews
                    </span>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Badges
                    </span>
                    <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                      Portfolio proof
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-slate-50/70 py-10">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {featuredStats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
              >
                <h3 className="text-3xl font-bold tracking-tight text-slate-900">
                  {item.value}
                </h3>
                <p className="mt-2 text-sm font-medium text-slate-500">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>





<section id="about" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
  <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

    {/* LEFT: TEXT */}
    <div className="max-w-xl">
      <span className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
        About BuildUp
      </span>

      <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
        Bridging the gap between learning and real work
      </h2>

      <p className="mt-6 text-lg leading-8 text-slate-600">
        <span className="font-semibold text-slate-800">BuildUp</span> was created
        to solve a real problem — people learn skills, but struggle to prove them.
      </p>

      <p className="mt-4 text-base leading-7 text-slate-600">
        We connect <strong>volunteers</strong>, <strong>organizations</strong>, and
        <strong> mentors</strong> into a system where real projects become real
        experience — not just theory.
      </p>

      <p className="mt-4 text-base leading-7 text-slate-600">
        Instead of certificates, BuildUp gives you something more powerful:
        <span className="font-semibold text-slate-800"> proof of work.</span>
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">
            Real-world experience
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">
            Verified portfolios
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">
            Mentor-backed growth
          </p>
        </div>
      </div>
    </div>

    {/* RIGHT: VISUAL CARD */}
    <div className="relative">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-blue-100 to-indigo-100 blur-2xl opacity-70" />

      <div className="relative rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">

        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-blue-100 p-4 text-2xl">🚀</div>
          <div>
            <p className="text-lg font-bold text-slate-900">
              Our Mission
            </p>
            <p className="text-sm text-slate-500">
              Turn learning into real-world impact
            </p>
          </div>
        </div>

        <p className="mt-6 text-sm leading-7 text-slate-600">
          BuildUp exists to empower individuals to gain practical experience
          while helping organizations get real work done — creating a win-win
          ecosystem for growth, impact, and opportunity.
        </p>

        <div className="mt-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white text-sm font-semibold text-center">
          Real Skills → Real Projects → Real Growth
        </div>
      </div>
    </div>
  </div>
</section>




      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
              Live opportunities
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Explore live projects
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Discover real projects from organizations looking for emerging
              talent to contribute, learn, and grow through actual work.
            </p>
          </div>

          <Link
            href="/register/volunteer"
            className="text-sm font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
          >
            View all projects →
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
            No projects available right now.
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                href="/register/volunteer"
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {project.difficulty}
                  </span>
                  <span className="text-slate-300 transition group-hover:text-blue-500">
                    ↗
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-semibold leading-snug text-slate-900 transition group-hover:text-blue-600">
                  {project.title}
                </h3>

                <p className="mt-3 text-sm text-slate-500">
                  {project.organization.name}
                </p>

                <div className="mt-8 border-t border-slate-100 pt-4 text-sm font-medium text-slate-700">
                  Apply to gain real-world experience
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-6 py-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-r from-white via-blue-50 to-indigo-50 p-10 shadow-sm md:p-12">
          <p className="max-w-4xl text-xl italic leading-relaxed text-slate-700 md:text-2xl">
            “BuildUp helped me transition from learning to real work. I now
            apply for jobs with confidence — and proof.”
          </p>
          <p className="mt-6 text-base font-semibold text-slate-900">
            — Temi A., Frontend Volunteer
          </p>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-6 py-24 lg:px-8"
      >
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
            Process
          </span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            How BuildUp works
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            A practical system designed to create real outcomes for
            organizations, volunteers, and mentors.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {workflowSteps.map((item) => (
            <div
              key={item.title}
              className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="text-4xl">{item.icon}</div>
                <span className="text-sm font-bold text-blue-600">
                  {item.step}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold tracking-tight text-slate-900">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-blue-600 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%)]" />
        <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-indigo-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-8">
          <div className="mb-6 flex justify-center">
            <div className="rounded-[24px] border border-white/20 bg-white/10 px-5 py-4 backdrop-blur">
              <BuildUpLogo
                href="/"
                showTagline={true}
                dark={true}
                textSize="lg"
                className="justify-center"
                imageClassName="shadow-sm"
              />
            </div>
          </div>

          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Where learning meets real impact.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
            Join a platform designed to move people from theory to practical
            experience, guided growth, and measurable outcomes.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
            <Link
              href="/register/volunteer"
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-white px-6 text-base font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Join as Volunteer
            </Link>

            <Link
              href="/register/organization"
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/70 px-6 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Post a Project
            </Link>

            <Link
              href="/register/mentor"
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/70 px-6 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Become a Mentor
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
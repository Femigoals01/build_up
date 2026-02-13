

import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  /* ================= FETCH SAMPLE PROJECTS ================= */
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

  return (
    <main>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-5xl font-extrabold leading-tight">
            Build real experience. <br />
            <span className="text-blue-600">Not just certificates.</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            BuildUp connects emerging talent with real organizations to work on live projects —
            guided by experienced mentors.
          </p>

          <div className="mt-8 flex gap-4">
            <a
              href="/register/volunteer"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started as a Volunteer
            </a>

            <a
              href="/register/organization"
              className="border border-gray-300 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
            >
              Post a Project
            </a>

              <a
    href="/register/mentor"
    className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition"
  >
    Become a Mentor
  </a>
          </div>
        </div>

        <div className="h-80 bg-gradient-to-br from-blue-100 to-blue-300 rounded-2xl flex items-center justify-center text-blue-700 font-semibold">
          Platform Preview
        </div>
      </section>

      {/* TRUST */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-3xl font-bold">1,000+</h3>
            <p className="text-gray-600">Volunteers</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">500+</h3>
            <p className="text-gray-600">Projects</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">200+</h3>
            <p className="text-gray-600">Organizations</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">150+</h3>
            <p className="text-gray-600">Mentors</p>
          </div>
        </div>
      </section>

      {/* ================= FEATURED PROJECTS (NEW) ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">
            Explore Live Projects
          </h2>

          <a
            href="/register/volunteer"
            className="text-blue-600 font-medium hover:underline"
          >
            View all projects →
          </a>
        </div>

        {projects.length === 0 ? (
          <p className="text-gray-600">
            No projects available right now.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project) => (
              <a
                key={project.id}
                href="/register/volunteer"
                className="bg-white border rounded-xl p-6 hover:shadow-lg transition cursor-pointer"
              >
                <h3 className="font-semibold text-lg mb-2">
                  {project.title}
                </h3>

                <p className="text-sm text-gray-500 mb-4">
                  {project.organization.name}
                </p>

                <span className="inline-block text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                  {project.difficulty}
                </span>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* SOCIAL PROOF */}
      <section className="max-w-6xl mx-auto px-6 py-6">
        <div className="bg-white border rounded-3xl p-10 shadow-sm">
          <p className="text-lg text-gray-700 italic">
            “BuildUp helped me transition from learning to real work.
            I now apply for jobs with confidence — and proof.”
          </p>
          <p className="mt-4 font-semibold">
            — Temi A., Frontend Volunteer
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      {/* <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">
          How BuildUp Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "Organizations post real projects",
              text: "Nonprofits and startups share real problems they need solved.",
            },
            {
              title: "Volunteers gain real experience",
              text: "Learners work on live projects and build credible portfolios.",
            },
            {
              title: "Mentors guide the process",
              text: "Experienced professionals ensure quality and growth.",
            },
          ].map((item, i) => (
            <div key={i} className="p-8 border rounded-xl bg-white">
              <h3 className="text-xl font-semibold mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section> */}


      {/* HOW IT WORKS — DIAGRAM */}
<section className="max-w-7xl mx-auto px-6 py-24">
  <h2 className="text-4xl font-bold text-center mb-20">
    How BuildUp Works
  </h2>

  <div className="relative grid md:grid-cols-4 gap-12 items-start">

    {/* STEP 1 */}
    <div className="bg-white border rounded-2xl p-8 text-center relative z-10">
      <div className="text-4xl mb-4">🏢</div>
      <h3 className="text-xl font-semibold mb-2">
        Organizations
      </h3>
      <p className="text-gray-600 text-sm">
        Post real business and nonprofit projects that need solving.
      </p>
    </div>

    {/* ARROW */}
    <div className="hidden md:flex justify-center items-center text-3xl text-gray-300">
      →
    </div>

    {/* STEP 2 */}
    <div className="bg-white border rounded-2xl p-8 text-center relative z-10">
      <div className="text-4xl mb-4">🙋</div>
      <h3 className="text-xl font-semibold mb-2">
        Volunteers
      </h3>
      <p className="text-gray-600 text-sm">
        Apply, collaborate, and gain hands-on experience on live projects.
      </p>
    </div>

    {/* ARROW */}
    <div className="hidden md:flex justify-center items-center text-3xl text-gray-300">
      →
    </div>

    {/* STEP 3 */}
    <div className="bg-white border rounded-2xl p-8 text-center relative z-10">
      <div className="text-4xl mb-4">🎓</div>
      <h3 className="text-xl font-semibold mb-2">
        Mentors
      </h3>
      <p className="text-gray-600 text-sm">
        Guide, review work, and ensure real-world standards.
      </p>
    </div>

    {/* ARROW */}
    <div className="hidden md:flex justify-center items-center text-3xl text-gray-300">
      →
    </div>

    {/* STEP 4 */}
    <div className="bg-white border rounded-2xl p-8 text-center relative z-10">
      <div className="text-4xl mb-4">🏆</div>
      <h3 className="text-xl font-semibold mb-2">
        Proof of Experience
      </h3>
      <p className="text-gray-600 text-sm">
        Completed projects, reviews, badges, and a public portfolio.
      </p>
    </div>

  </div>
</section>


      {/* FINAL CTA */}
      <section className="bg-blue-600 text-white py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Where learning meets real impact.
          </h2>

          <div className="flex justify-center gap-4">
            <a
              href="/register/volunteer"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg text-lg font-semibold"
            >
              Join as Volunteer
            </a>
            <a
              href="/register/organization"
              className="border border-white px-6 py-3 rounded-lg text-lg font-semibold"
            >
              Post a Project
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}



// import { prisma } from "@/lib/prisma";

// export default async function HomePage() {
//   /* ================= FETCH SAMPLE PROJECTS ================= */
//   const projects = await prisma.project.findMany({
//     where: { status: "OPEN" },
//     take: 4,
//     orderBy: { createdAt: "desc" },
//     select: {
//       id: true,
//       title: true,
//       difficulty: true,
//       organization: {
//         select: { name: true },
//       },
//     },
//   });

//   return (
//     <main>

//       {/* HERO */}
//       <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
//         <div>
//           <h1 className="text-5xl font-extrabold leading-tight">
//             Build real experience. <br />
//             <span className="text-blue-600">Not just certificates.</span>
//           </h1>

//           <p className="mt-6 text-lg text-gray-600 max-w-xl">
//             BuildUp connects emerging talent with real organizations to work on live projects —
//             guided by experienced mentors.
//           </p>

//           <div className="mt-8 flex gap-4">
//             <a
//               href="/register/volunteer"
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
//             >
//               Get Started as a Volunteer
//             </a>

//             <a
//               href="/register/organization"
//               className="border border-gray-300 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
//             >
//               Post a Project
//             </a>

//               <a
//     href="/register/mentor"
//     className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition"
//   >
//     Become a Mentor
//   </a>
//           </div>
//         </div>

//         <div className="h-80 bg-gradient-to-br from-blue-100 to-blue-300 rounded-2xl flex items-center justify-center text-blue-700 font-semibold">
//           Platform Preview
//         </div>
//       </section>

//       {/* TRUST */}
//       <section className="bg-white py-16">
//         <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//           <div>
//             <h3 className="text-3xl font-bold">1,000+</h3>
//             <p className="text-gray-600">Volunteers</p>
//           </div>
//           <div>
//             <h3 className="text-3xl font-bold">500+</h3>
//             <p className="text-gray-600">Projects</p>
//           </div>
//           <div>
//             <h3 className="text-3xl font-bold">200+</h3>
//             <p className="text-gray-600">Organizations</p>
//           </div>
//           <div>
//             <h3 className="text-3xl font-bold">150+</h3>
//             <p className="text-gray-600">Mentors</p>
//           </div>
//         </div>
//       </section>

//       {/* ================= FEATURED PROJECTS (NEW) ================= */}
//       <section className="max-w-7xl mx-auto px-6 py-20">
//         <div className="flex justify-between items-center mb-10">
//           <h2 className="text-3xl font-bold">
//             Explore Live Projects
//           </h2>

//           <a
//             href="/register/volunteer"
//             className="text-blue-600 font-medium hover:underline"
//           >
//             View all projects →
//           </a>
//         </div>

//         {projects.length === 0 ? (
//           <p className="text-gray-600">
//             No projects available right now.
//           </p>
//         ) : (
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {projects.map((project) => (
//               <a
//                 key={project.id}
//                 href="/register/volunteer"
//                 className="bg-white border rounded-xl p-6 hover:shadow-lg transition cursor-pointer"
//               >
//                 <h3 className="font-semibold text-lg mb-2">
//                   {project.title}
//                 </h3>

//                 <p className="text-sm text-gray-500 mb-4">
//                   {project.organization.name}
//                 </p>

//                 <span className="inline-block text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
//                   {project.difficulty}
//                 </span>
//               </a>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* SOCIAL PROOF */}
//       <section className="max-w-6xl mx-auto px-6 py-6">
//         <div className="bg-white border rounded-3xl p-10 shadow-sm">
//           <p className="text-lg text-gray-700 italic">
//             “BuildUp helped me transition from learning to real work.
//             I now apply for jobs with confidence — and proof.”
//           </p>
//           <p className="mt-4 font-semibold">
//             — Temi A., Frontend Volunteer
//           </p>
//         </div>
//       </section>

//       {/* HOW IT WORKS */}
//       {/* <section className="max-w-7xl mx-auto px-6 py-24">
//         <h2 className="text-4xl font-bold text-center mb-16">
//           How BuildUp Works
//         </h2>

//         <div className="grid md:grid-cols-3 gap-10">
//           {[
//             {
//               title: "Organizations post real projects",
//               text: "Nonprofits and startups share real problems they need solved.",
//             },
//             {
//               title: "Volunteers gain real experience",
//               text: "Learners work on live projects and build credible portfolios.",
//             },
//             {
//               title: "Mentors guide the process",
//               text: "Experienced professionals ensure quality and growth.",
//             },
//           ].map((item, i) => (
//             <div key={i} className="p-8 border rounded-xl bg-white">
//               <h3 className="text-xl font-semibold mb-3">
//                 {item.title}
//               </h3>
//               <p className="text-gray-600">{item.text}</p>
//             </div>
//           ))}
//         </div>
//       </section> */}


//       {/* HOW IT WORKS — DIAGRAM */}
// <section className="max-w-7xl mx-auto px-6 py-24">
//   <h2 className="text-4xl font-bold text-center mb-20">
//     How BuildUp Works
//   </h2>

//   <div className="relative grid md:grid-cols-4 gap-12 items-start">

//     {/* STEP 1 */}
//     <div className="bg-white border rounded-2xl p-8 text-center relative z-10">
//       <div className="text-4xl mb-4">🏢</div>
//       <h3 className="text-xl font-semibold mb-2">
//         Organizations
//       </h3>
//       <p className="text-gray-600 text-sm">
//         Post real business and nonprofit projects that need solving.
//       </p>
//     </div>

//     {/* ARROW */}
//     <div className="hidden md:flex justify-center items-center text-3xl text-gray-300">
//       →
//     </div>

//     {/* STEP 2 */}
//     <div className="bg-white border rounded-2xl p-8 text-center relative z-10">
//       <div className="text-4xl mb-4">🙋</div>
//       <h3 className="text-xl font-semibold mb-2">
//         Volunteers
//       </h3>
//       <p className="text-gray-600 text-sm">
//         Apply, collaborate, and gain hands-on experience on live projects.
//       </p>
//     </div>

//     {/* ARROW */}
//     <div className="hidden md:flex justify-center items-center text-3xl text-gray-300">
//       →
//     </div>

//     {/* STEP 3 */}
//     <div className="bg-white border rounded-2xl p-8 text-center relative z-10">
//       <div className="text-4xl mb-4">🎓</div>
//       <h3 className="text-xl font-semibold mb-2">
//         Mentors
//       </h3>
//       <p className="text-gray-600 text-sm">
//         Guide, review work, and ensure real-world standards.
//       </p>
//     </div>

//     {/* ARROW */}
//     <div className="hidden md:flex justify-center items-center text-3xl text-gray-300">
//       →
//     </div>

//     {/* STEP 4 */}
//     <div className="bg-white border rounded-2xl p-8 text-center relative z-10">
//       <div className="text-4xl mb-4">🏆</div>
//       <h3 className="text-xl font-semibold mb-2">
//         Proof of Experience
//       </h3>
//       <p className="text-gray-600 text-sm">
//         Completed projects, reviews, badges, and a public portfolio.
//       </p>
//     </div>

//   </div>
// </section>


//       {/* FINAL CTA */}
//       <section className="bg-blue-600 text-white py-24">
//         <div className="max-w-5xl mx-auto px-6 text-center">
//           <h2 className="text-4xl font-bold mb-6">
//             Where learning meets real impact.
//           </h2>

//           <div className="flex justify-center gap-4">
//             <a
//               href="/register/volunteer"
//               className="bg-white text-blue-600 px-6 py-3 rounded-lg text-lg font-semibold"
//             >
//               Join as Volunteer
//             </a>
//             <a
//               href="/register/organization"
//               className="border border-white px-6 py-3 rounded-lg text-lg font-semibold"
//             >
//               Post a Project
//             </a>
//           </div>
//         </div>
//       </section>

//     </main>
//   );
// }





import { prisma } from "@/lib/prisma";

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

  return (
    <main className="bg-white text-gray-900 overflow-x-hidden">
      {/* HERO */}
      <section className="relative isolate">
        {/* background decoration */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 via-white to-white" />
        <div className="absolute top-16 left-0 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl -z-10" />
        <div className="absolute top-24 right-0 h-80 w-80 rounded-full bg-indigo-100/60 blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
              Real projects • Real mentors • Real proof of work
            </span>

            <h1 className="mt-6 text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Build real experience.
              <br />
              <span className="text-blue-600">Not just certificates.</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
              BuildUp connects emerging talent with real organizations to work
              on live projects, gain hands-on experience, receive mentor
              guidance, and grow a portfolio that speaks louder than theory.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-4">
              <a
                href="/register/volunteer"
                className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3.5 rounded-xl text-base font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
              >
                Get Started as a Volunteer
              </a>

              <a
                href="/register/organization"
                className="inline-flex items-center justify-center border border-gray-300 bg-white px-6 py-3.5 rounded-xl text-base font-semibold hover:bg-gray-50 transition"
              >
                Post a Project
              </a>

              <a
                href="/register/mentor"
                className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3.5 rounded-xl text-base font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
              >
                Become a Mentor
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
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
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-blue-100 to-indigo-100 blur-2xl opacity-70" />
            <div className="relative rounded-[2rem] border border-white/60 bg-white/80 backdrop-blur-xl shadow-2xl shadow-blue-100 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-300" />
                <span className="h-3 w-3 rounded-full bg-yellow-300" />
                <span className="h-3 w-3 rounded-full bg-green-300" />
                <span className="ml-3 text-sm text-gray-500">BuildUp Platform Preview</span>
              </div>

              <div className="p-6 md:p-8 space-y-5 bg-gradient-to-b from-white to-blue-50/50">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border bg-white p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Active Projects
                    </p>
                    <p className="mt-2 text-2xl font-bold">500+</p>
                  </div>

                  <div className="rounded-2xl border bg-white p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Mentors
                    </p>
                    <p className="mt-2 text-2xl font-bold">150+</p>
                  </div>
                </div>

                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold">Featured workflow</p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                      <span className="text-sm text-gray-700">Organization posts project</span>
                      <span className="text-xs font-medium text-blue-600">Step 1</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                      <span className="text-sm text-gray-700">Volunteer applies & collaborates</span>
                      <span className="text-xs font-medium text-blue-600">Step 2</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                      <span className="text-sm text-gray-700">Mentor reviews progress</span>
                      <span className="text-xs font-medium text-blue-600">Step 3</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-blue-600 px-4 py-3 text-white">
                      <span className="text-sm">Proof of experience unlocked</span>
                      <span className="text-xs font-semibold">Result</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold mb-3">Outcome highlights</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-medium">
                      Project completion
                    </span>
                    <span className="rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-xs font-medium">
                      Reviews
                    </span>
                    <span className="rounded-full bg-green-50 text-green-700 px-3 py-1 text-xs font-medium">
                      Badges
                    </span>
                    <span className="rounded-full bg-purple-50 text-purple-700 px-3 py-1 text-xs font-medium">
                      Portfolio proof
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { value: "1,000+", label: "Volunteers" },
              { value: "500+", label: "Projects" },
              { value: "200+", label: "Organizations" },
              { value: "150+", label: "Mentors" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm"
              >
                <h3 className="text-3xl font-bold">{item.value}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Live opportunities
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              Explore Live Projects
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl">
              Discover real projects from organizations looking for emerging
              talent to contribute, learn, and grow through actual work.
            </p>
          </div>

          <a
            href="/register/volunteer"
            className="text-blue-600 font-semibold hover:underline"
          >
            View all projects →
          </a>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
            No projects available right now.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <a
                key={project.id}
                href="/register/volunteer"
                className="group rounded-2xl border border-gray-200 bg-white p-6 hover:-translate-y-1 hover:shadow-xl transition duration-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {project.difficulty}
                  </span>
                  <span className="text-gray-300 group-hover:text-blue-500 transition">
                    ↗
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-semibold leading-snug text-gray-900 group-hover:text-blue-600 transition">
                  {project.title}
                </h3>

                <p className="mt-3 text-sm text-gray-500">
                  {project.organization.name}
                </p>

                <div className="mt-8 pt-4 border-t text-sm font-medium text-gray-700">
                  Apply to gain real-world experience
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* SOCIAL PROOF */}
      <section className="max-w-6xl mx-auto px-6 py-6">
        <div className="rounded-3xl border border-gray-200 bg-gradient-to-r from-white to-blue-50 p-10 md:p-12 shadow-sm">
          <p className="text-xl md:text-2xl text-gray-700 italic leading-relaxed">
            “BuildUp helped me transition from learning to real work. I now
            apply for jobs with confidence — and proof.”
          </p>
          <p className="mt-6 font-semibold text-gray-900">
            — Temi A., Frontend Volunteer
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Process
          </span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            How BuildUp Works
          </h2>
          <p className="mt-4 text-gray-600">
            A simple structure designed to create real outcomes for
            organizations, volunteers, and mentors.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            {
              icon: "🏢",
              title: "Organizations",
              text: "Post real business and nonprofit projects that need solving.",
            },
            {
              icon: "🙋",
              title: "Volunteers",
              text: "Apply, collaborate, and gain hands-on experience on live projects.",
            },
            {
              icon: "🎓",
              title: "Mentors",
              text: "Guide, review work, and ensure real-world standards.",
            },
            {
              icon: "🏆",
              title: "Proof of Experience",
              text: "Completed projects, reviews, badges, and a stronger public portfolio.",
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className="relative rounded-3xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between">
                <div className="text-4xl">{item.icon}</div>
                <span className="text-sm font-semibold text-blue-600">
                  0{i + 1}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-gray-600 leading-relaxed text-sm">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-blue-600 text-white py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%)]" />
        <div className="max-w-5xl mx-auto px-6 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Where learning meets real impact.
          </h2>

          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
            Join a platform built to move people from theory to practical
            experience, guided growth, and measurable outcomes.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/register/volunteer"
              className="bg-white text-blue-600 px-6 py-3.5 rounded-xl text-base font-semibold hover:bg-blue-50 transition"
            >
              Join as Volunteer
            </a>
            <a
              href="/register/organization"
              className="border border-white/70 px-6 py-3.5 rounded-xl text-base font-semibold hover:bg-white/10 transition"
            >
              Post a Project
            </a>
            <a
              href="/register/mentor"
              className="border border-white/70 px-6 py-3.5 rounded-xl text-base font-semibold hover:bg-white/10 transition"
            >
              Become a Mentor
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}


// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// /**
//  * Temporary mock data
//  * (will be replaced with Prisma query later)
//  */
// const projects = [
//   {
//     id: "1",
//     title: "Nonprofit Website Redesign",
//     organization: "Hope Foundation",
//     description:
//       "Redesign the website of a nonprofit to improve clarity, accessibility, and engagement.",
//     skills: ["UI/UX", "Frontend"],
//     difficulty: "Beginner",
//     status: "OPEN",
//   },
//   {
//     id: "2",
//     title: "Volunteer Management Dashboard",
//     organization: "Community Reach",
//     description:
//       "Build a simple dashboard to help manage volunteers and track engagement.",
//     skills: ["React", "Backend"],
//     difficulty: "Intermediate",
//     status: "OPEN",
//   },
// ];

// export default async function BrowseProjectsPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER") {
//     redirect("/login");
//   }

//   return (
//     <main className="px-10 py-10 space-y-10 bg-gray-50 min-h-screen">

//       {/* ===== PAGE HEADER ===== */}
//       <section>
//         <h1 className="text-3xl font-bold">Browse Projects</h1>
//         <p className="text-gray-600 mt-1 max-w-2xl">
//           Explore real projects from organizations and start building
//           hands-on experience that strengthens your portfolio.
//         </p>
//       </section>

//       {/* ===== SEARCH + FILTERS ===== */}
//       <section className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
//         <div className="grid md:grid-cols-4 gap-4">

//           {/* Search */}
//           <input
//             type="text"
//             placeholder="Search projects..."
//             className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           {/* Skill Filter */}
//           <select className="border rounded-lg px-4 py-2">
//             <option>All Skills</option>
//             <option>UI/UX</option>
//             <option>Frontend</option>
//             <option>Backend</option>
//             <option>Design</option>
//           </select>

//           {/* Difficulty Filter */}
//           <select className="border rounded-lg px-4 py-2">
//             <option>All Levels</option>
//             <option>Beginner</option>
//             <option>Intermediate</option>
//             <option>Advanced</option>
//           </select>

//           {/* Status */}
//           <select className="border rounded-lg px-4 py-2">
//             <option>Open Projects</option>
//           </select>
//         </div>
//       </section>

//       {/* ===== PROJECT LIST ===== */}
//       <section className="grid gap-6">

//         {projects.length === 0 ? (
//           /* EMPTY STATE */
//           <div className="bg-white border rounded-xl p-12 text-center text-gray-600">
//             <p className="mb-4">
//               No projects available at the moment.
//             </p>
//             <p className="text-sm">
//               Check back soon — new opportunities are added regularly.
//             </p>
//           </div>
//         ) : (
//           projects.map((project) => (
//             <div
//               key={project.id}
//               className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-md transition"
//             >
//               {/* Header */}
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h2 className="text-xl font-semibold">
//                     {project.title}
//                   </h2>
//                   <p className="text-sm text-gray-500">
//                     {project.organization}
//                   </p>
//                 </div>

//                 <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-600 font-semibold">
//                   {project.status}
//                 </span>
//               </div>

//               {/* Description */}
//               <p className="text-gray-600 mb-6 max-w-3xl">
//                 {project.description}
//               </p>

//               {/* Meta */}
//               <div className="flex flex-wrap items-center gap-6 text-sm">

//                 {/* Skills */}
//                 <div className="flex gap-2 flex-wrap">
//                   {project.skills.map((skill) => (
//                     <span
//                       key={skill}
//                       className="px-3 py-1 bg-gray-100 rounded-full"
//                     >
//                       {skill}
//                     </span>
//                   ))}
//                 </div>

//                 {/* Difficulty */}
//                 <span className="text-gray-500">
//                   Level: <strong>{project.difficulty}</strong>
//                 </span>
//               </div>

//               {/* CTA */}
//               <div className="mt-6">
//                 <a
//                   href={`/projects/${project.id}`}
//                   className="inline-block bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
//                 >
//                   View Project
//                 </a>
//               </div>
//             </div>
//           ))
//         )}
//       </section>

//     </main>
//   );
// }


import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function BrowseProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VOLUNTEER") {
    redirect("/login");
  }

  // 🔥 REAL DATA FROM DATABASE
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
    <main className="px-10 py-10 space-y-10 bg-gray-50 min-h-screen">

      {/* ===== PAGE HEADER ===== */}
      <section>
        <h1 className="text-3xl font-bold">Browse Projects</h1>
        <p className="text-gray-600 mt-1 max-w-2xl">
          Explore real projects from organizations and start building
          hands-on experience that strengthens your portfolio.
        </p>
      </section>

      {/* ===== SEARCH + FILTERS (UI READY, LOGIC LATER) ===== */}
      <section className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <div className="grid md:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Search projects..."
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select className="border rounded-lg px-4 py-2">
            <option>All Skills</option>
          </select>

          <select className="border rounded-lg px-4 py-2">
            <option>All Levels</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <select className="border rounded-lg px-4 py-2">
            <option>Open Projects</option>
          </select>
        </div>
      </section>

      {/* ===== PROJECT LIST ===== */}
      <section className="grid gap-6">
        {projects.length === 0 ? (
          <div className="bg-white border rounded-xl p-12 text-center text-gray-600">
            <p className="mb-4">No projects available at the moment.</p>
            <p className="text-sm">
              Check back soon — organizations are posting new opportunities.
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {project.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {project.organization.name}
                  </p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-600 font-semibold">
                  OPEN
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6 max-w-3xl">
                {project.description}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm">

                <div className="flex gap-2 flex-wrap">
                  {project.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-gray-100 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <span className="text-gray-500">
                  Level:{" "}
                  <strong>
                    {project.difficulty.charAt(0) +
                      project.difficulty.slice(1).toLowerCase()}
                  </strong>
                </span>
              </div>

              {/* CTA */}
              <div className="mt-6">
                <a
                  href={`/projects/${project.id}`}
                  className="inline-block bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  View Project
                </a>
              </div>
            </div>
          ))
        )}
      </section>

    </main>
  );
}

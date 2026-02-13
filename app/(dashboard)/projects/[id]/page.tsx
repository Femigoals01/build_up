

// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import ApplyButton from "@/components/projects/ApplyButton";

// export default async function ProjectDetailPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER") {
//     redirect("/login");
//   }

//   const project = await prisma.project.findUnique({
//     where: { id: params.id },
//     include: {
//       organization: {
//         select: { name: true },
//       },
//     },
//   });

//   if (!project || project.status !== "OPEN") {
//     redirect("/projects");
//   }

//   return (
//     <main className="px-10 py-10 bg-gray-50 min-h-screen">

//       {/* ===== HEADER ===== */}
//       <section className="mb-10">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold">{project.title}</h1>
//             <p className="text-gray-600 mt-1">
//               {project.organization.name}
//             </p>
//           </div>

//           <span className="px-4 py-2 text-sm font-semibold rounded-full bg-green-50 text-green-600">
//             {project.status}
//           </span>
//         </div>
//       </section>

//       {/* ===== MAIN CONTENT ===== */}
//       <section className="grid lg:grid-cols-3 gap-8">

//         {/* LEFT */}
//         <div className="lg:col-span-2 space-y-8">

//           <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
//             <h2 className="text-xl font-semibold mb-4">
//               About this project
//             </h2>
//             <p className="text-gray-600 leading-relaxed">
//               {project.description}
//             </p>
//           </div>

//           {project.requirements && (
//             <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
//               <h2 className="text-xl font-semibold mb-4">
//                 Requirements
//               </h2>
//               <p className="text-gray-600">
//                 {project.requirements}
//               </p>
//             </div>
//           )}

//         </div>

//         {/* RIGHT */}
//         <aside className="space-y-6">

//           <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
//             <h3 className="text-lg font-semibold mb-4">
//               Project details
//             </h3>

//             <div className="space-y-3 text-sm text-gray-600">
//               <p>
//                 <strong>Difficulty:</strong>{" "}
//                 {project.difficulty.charAt(0) +
//                   project.difficulty.slice(1).toLowerCase()}
//               </p>
//             </div>

//             <div className="mt-4">
//               <h4 className="text-sm font-semibold mb-2">
//                 Skills needed
//               </h4>
//               <div className="flex flex-wrap gap-2">
//                 {project.skills.map((skill) => (
//                   <span
//                     key={skill}
//                     className="px-3 py-1 bg-gray-100 rounded-full text-sm"
//                   >
//                     {skill}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* APPLY */}
//           <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
//             <p className="text-gray-600 mb-4 text-sm">
//               Ready to contribute and grow your portfolio?
//             </p>

//             <ApplyButton projectId={project.id} />

//             <p className="text-xs text-gray-500 mt-3 text-center">
//               You’ll be notified when the organization responds.
//             </p>
//           </div>

//         </aside>
//       </section>

//     </main>
//   );
// }


import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import ApplyButton from "@/components/projects/ApplyButton";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ Next.js 16 FIX
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VOLUNTEER") {
    redirect("/login");
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      organization: {
        select: { name: true },
      },
    },
  });

  if (!project || project.status !== "OPEN") {
    redirect("/projects");
  }

  return (
    <main className="px-10 py-10 bg-gray-50 min-h-screen">
      {/* ===== HEADER ===== */}
      <section className="mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <p className="text-gray-600 mt-1">
              {project.organization.name}
            </p>
          </div>

          <span className="px-4 py-2 text-sm font-semibold rounded-full bg-green-50 text-green-600">
            {project.status}
          </span>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <section className="grid lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              About this project
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {project.description}
            </p>
          </div>

          {project.requirements && (
            <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                Requirements
              </h2>
              <p className="text-gray-600">
                {project.requirements}
              </p>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <aside className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              Project details
            </h3>

            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>Difficulty:</strong>{" "}
                {project.difficulty.charAt(0) +
                  project.difficulty.slice(1).toLowerCase()}
              </p>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">
                Skills needed
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* APPLY */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
            <p className="text-gray-600 mb-4 text-sm">
              Ready to contribute and grow your portfolio?
            </p>

            <ApplyButton projectId={project.id} />

            <p className="text-xs text-gray-500 mt-3 text-center">
              You’ll be notified when the organization responds.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

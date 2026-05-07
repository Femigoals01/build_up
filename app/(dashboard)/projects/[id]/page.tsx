




// import React from "react";
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import ApplyButton from "@/components/projects/ApplyButton";

// export default async function ProjectDetailPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   // ✅ Next.js 16 FIX
//   const { id } = await params;

//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER") {
//     redirect("/login");
//   }

//   const project = await prisma.project.findUnique({
//     where: { id },
//     include: {
//       organization: {
//         select: { name: true },
//       },
//     },
//   });

//   // if (!project || project.status !== "OPEN") {
//   //   redirect("/projects");
//   // }

//   if (
//   !project ||
//   (project.status !== "OPEN" && project.status !== "IN_PROGRESS")
// ) {
//   redirect("/projects");
// }

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



import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import ApplyButton from "@/components/projects/ApplyButton";

function formatNairaFromKobo(amount?: number | null) {
  if (!amount) return "₦0";

  return `₦${(amount / 100).toLocaleString("en-NG", {
    maximumFractionDigits: 0,
  })}`;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

  if (
    !project ||
    (project.status !== "OPEN" && project.status !== "IN_PROGRESS")
  ) {
    redirect("/projects");
  }

  return (
    <main className="min-h-screen bg-gray-50 px-10 py-10">
      <section className="mb-10">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold">{project.title}</h1>

            <p className="mt-1 text-gray-600">
              {project.organization.name}
            </p>

            <p className="mt-3 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
              Project Amount: {formatNairaFromKobo(project.stipendAmount)}
            </p>
          </div>

          <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-600">
            {project.status}
          </span>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">About this project</h2>
            <p className="leading-relaxed text-gray-600">
              {project.description}
            </p>
          </div>

          {project.requirements && (
            <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Requirements</h2>
              <p className="text-gray-600">{project.requirements}</p>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Project details</h3>

            <div className="space-y-4 text-sm text-gray-600">
              <p>
                <strong>Difficulty:</strong>{" "}
                {project.difficulty.charAt(0) +
                  project.difficulty.slice(1).toLowerCase()}
              </p>

              <p>
                <strong>Project Amount:</strong>{" "}
                <span className="font-bold text-emerald-700">
                  {formatNairaFromKobo(project.stipendAmount)}
                </span>
              </p>
            </div>

            <div className="mt-4">
              <h4 className="mb-2 text-sm font-semibold">Skills needed</h4>

              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="mb-4 text-sm text-gray-600">
              Ready to contribute and grow your portfolio?
            </p>

            <ApplyButton projectId={project.id} />

            <p className="mt-3 text-center text-xs text-gray-500">
              You’ll be notified when the organization responds.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
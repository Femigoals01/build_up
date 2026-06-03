

// import { getServerSession } from "next-auth";
// import { redirect, notFound } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import EditProjectForm from "./EditProjectForm";

// export const dynamic = "force-dynamic";

// export default async function EditProjectPage({
//   params,
// }: {
//   params: Promise<{ projectId: string }>;
// }) {
//   const session = await getServerSession(authOptions);

//   if (
//     !session ||
//     session.user.role !== "ORGANIZATION" ||
//     !session.user.id
//   ) {
//     redirect("/login");
//   }

//   const { projectId } = await params;

// //   const project = await prisma.project.findUnique({
// //     where: { id },
// //     include: {
// //       applications: true,
// //       funding: true,
// //     },
// //   });


// const project = await prisma.project.findUnique({
//   where: { id: projectId },
//   include: {
//     applications: true,
//   },
// });

// const funding = await prisma.projectFunding.findUnique({
//   where: { projectId },
// });

//   if (!project) {
//     notFound();
//   }

//   if (project.organizationId !== session.user.id) {
//     redirect("/dashboard/organization");
//   }

//   const hasSelectedVolunteer = project.applications.some((application) =>
//     ["AWAITING_PAYMENT", "ACCEPTED", "COMPLETED"].includes(
//       application.status
//     )
//   );

// //   const fundingStarted =
// //     Boolean(project.funding?.paidAt) ||
// //     ["HELD", "RELEASED", "DISPUTED", "REFUNDED"].includes(
// //       project.funding?.status || ""
// //     );

// const fundingStarted =
//   Boolean(funding?.paidAt) ||
//   ["HELD", "RELEASED", "DISPUTED", "REFUNDED"].includes(
//     funding?.status || ""
//   );

//   if (
//     project.status !== "OPEN" ||
//     hasSelectedVolunteer ||
//     fundingStarted
//   ) {
//     redirect("/dashboard/organization");
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
//       <div className="mx-auto max-w-5xl">
//         <div className="mb-8">
//           <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
//             EDIT PROJECT
//           </span>

//           <h1 className="mt-4 text-3xl font-black text-slate-900">
//             Update Project
//           </h1>

//           <p className="mt-2 text-slate-600">
//             You can edit this project because no volunteer has been selected
//             and funding has not started.
//           </p>
//         </div>

//         <EditProjectForm
//           project={{
//             id: project.id,
//             title: project.title,
//             description: project.description,
//             requirements: project.requirements || "",
//             difficulty: project.difficulty,
//             skills: project.skills,
//             stipendAmount:
//               Math.round((project.stipendAmount || 0) / 100),
//             deliveryDays: project.deliveryDays || 7,
//           }}
//         />
//       </div>
//     </div>
//   );
// }



import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import EditProjectForm from "./EditProjectForm";

export const dynamic = "force-dynamic";

function formatNairaFromKobo(amount?: number | null) {
  if (!amount) return "₦0";

  return `₦${(amount / 100).toLocaleString("en-NG", {
    maximumFractionDigits: 0,
  })}`;
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
    redirect("/login");
  }

  const { projectId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      applications: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  const funding = await prisma.projectFunding.findUnique({
    where: { projectId },
  });

  if (!project) {
    notFound();
  }

  if (project.organizationId !== session.user.id) {
    redirect("/dashboard/organization");
  }

  const hasSelectedVolunteer = project.applications.some((application) =>
    ["AWAITING_PAYMENT", "ACCEPTED", "COMPLETED"].includes(application.status)
  );

  const fundingStarted =
    Boolean(funding?.paidAt) ||
    ["HELD", "RELEASED", "DISPUTED", "REFUNDED"].includes(
      funding?.status || ""
    );

  if (project.status !== "OPEN" || hasSelectedVolunteer || fundingStarted) {
    redirect("/dashboard/organization");
  }

  // return (
  //   <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.10),transparent_32%),linear-gradient(135deg,#f8fafc_0%,#ffffff_45%,#eff6ff_100%)] px-4 py-6 md:px-8 lg:px-10 lg:py-8">
  //     <div className="mx-auto max-w-7xl space-y-8">
  //       <section className="relative overflow-hidden rounded-[34px] border border-white/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
  //         <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-100 blur-3xl" />
  //         <div className="absolute bottom-0 left-10 h-56 w-56 rounded-full bg-indigo-100 blur-3xl" />

  //         <div className="relative grid gap-8 p-6 md:p-8 lg:grid-cols-[1.35fr_0.65fr] lg:p-10">
  //           <div>
  //             <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-blue-700">
  //               <span className="h-2 w-2 rounded-full bg-blue-600" />
  //               Editable Project
  //             </div>

  //             <h1 className="mt-5 max-w-3xl text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
  //               Refine your project before selecting a volunteer.
  //             </h1>

  //             <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
  //               Update the project title, description, requirements, skills,
  //               stipend, and delivery timeline while the project is still open.
  //               Once a volunteer is selected or funding starts, this project
  //               will be locked.
  //             </p>

  //             <div className="mt-6 flex flex-wrap gap-3">
  //               <Link
  //                 href="/dashboard/organization"
  //                 className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
  //               >
  //                 Back to Dashboard
  //               </Link>

  //               <Link
  //                 href={`/dashboard/projects/${project.id}`}
  //                 className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
  //               >
  //                 View Project
  //               </Link>
  //             </div>
  //           </div>

  //           <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5 shadow-sm backdrop-blur">
  //             <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
  //               Project Snapshot
  //             </p>

  //             <h2 className="mt-3 line-clamp-2 text-xl font-black text-slate-950">
  //               {project.title}
  //             </h2>

  //             <div className="mt-5 grid grid-cols-2 gap-3">
  //               <div className="rounded-2xl border border-slate-200 bg-white p-4">
  //                 <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
  //                   Status
  //                 </p>
  //                 <p className="mt-2 text-sm font-black text-emerald-700">
  //                   {project.status}
  //                 </p>
  //               </div>

  //               <div className="rounded-2xl border border-slate-200 bg-white p-4">
  //                 <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
  //                   Stipend
  //                 </p>
  //                 <p className="mt-2 text-sm font-black text-slate-900">
  //                   {formatNairaFromKobo(project.stipendAmount)}
  //                 </p>
  //               </div>

  //               <div className="rounded-2xl border border-slate-200 bg-white p-4">
  //                 <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
  //                   Delivery
  //                 </p>
  //                 <p className="mt-2 text-sm font-black text-slate-900">
  //                   {project.deliveryDays || 7} days
  //                 </p>
  //               </div>

  //               <div className="rounded-2xl border border-slate-200 bg-white p-4">
  //                 <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
  //                   Applicants
  //                 </p>
  //                 <p className="mt-2 text-sm font-black text-slate-900">
  //                   {project.applications.length}
  //                 </p>
  //               </div>
  //             </div>

  //             <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
  //               <p className="text-sm font-bold text-emerald-800">
  //                 ✅ Safe to edit
  //               </p>
  //               <p className="mt-1 text-xs leading-5 text-emerald-700">
  //                 No volunteer has been selected and funding has not started.
  //               </p>
  //             </div>
  //           </div>
  //         </div>
  //       </section>

  //       <section className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
  //         <aside className="space-y-5">
  //           <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
  //             <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
  //               Editing Rules
  //             </p>

  //             <div className="mt-5 space-y-4">
  //               <div className="flex gap-3">
  //                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-sm">
  //                   1
  //                 </div>
  //                 <div>
  //                   <p className="text-sm font-bold text-slate-900">
  //                     Edit before selection
  //                   </p>
  //                   <p className="mt-1 text-xs leading-5 text-slate-500">
  //                     You can update this project only while no volunteer has
  //                     been selected.
  //                   </p>
  //                 </div>
  //               </div>

  //               <div className="flex gap-3">
  //                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-sm">
  //                   2
  //                 </div>
  //                 <div>
  //                   <p className="text-sm font-bold text-slate-900">
  //                     Locked after award
  //                   </p>
  //                   <p className="mt-1 text-xs leading-5 text-slate-500">
  //                     Once an application or invite is accepted, project editing
  //                     becomes unavailable.
  //                   </p>
  //                 </div>
  //               </div>

  //               <div className="flex gap-3">
  //                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-sm">
  //                   3
  //                 </div>
  //                 <div>
  //                   <p className="text-sm font-bold text-slate-900">
  //                     Funding protects agreement
  //                   </p>
  //                   <p className="mt-1 text-xs leading-5 text-slate-500">
  //                     After funding begins, the project details become part of
  //                     the agreement between organization and volunteer.
  //                   </p>
  //                 </div>
  //               </div>
  //             </div>
  //           </div>

  //           <div className="rounded-[28px] border border-blue-100 bg-blue-50 p-5">
  //             <p className="text-sm font-black text-blue-900">
  //               Tip for better applications
  //             </p>

  //             <p className="mt-2 text-sm leading-6 text-blue-800">
  //               Keep your project description clear, list the expected outcome,
  //               and include the exact skills needed so the right volunteers can
  //               apply.
  //             </p>
  //           </div>
  //         </aside>

  //         <div className="min-w-0">
  //           <EditProjectForm
  //             project={{
  //               id: project.id,
  //               title: project.title,
  //               description: project.description,
  //               requirements: project.requirements || "",
  //               difficulty: project.difficulty,
  //               skills: project.skills,
  //               stipendAmount: Math.round((project.stipendAmount || 0) / 100),
  //               deliveryDays: project.deliveryDays || 7,
  //             }}
  //           />
  //         </div>
  //       </section>
  //     </div>
  //   </main>
  // );


  return (
  <main className="min-h-screen bg-slate-50 px-4 py-6 md:px-6 lg:px-8">
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <Link
          href="/dashboard/organization"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
          Edit Project
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Update your project details before selecting a volunteer.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-lg font-bold text-slate-900">
            Project Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Modify title, description, skills, stipend and delivery timeline.
          </p>
        </div>

        <div className="p-6 md:p-8">
          <EditProjectForm
            project={{
              id: project.id,
              title: project.title,
              description: project.description,
              requirements: project.requirements || "",
              difficulty: project.difficulty,
              skills: project.skills,
              stipendAmount:
                Math.round((project.stipendAmount || 0) / 100),
              deliveryDays: project.deliveryDays || 7,
            }}
          />
        </div>
      </div>
    </div>
  </main>
);
}
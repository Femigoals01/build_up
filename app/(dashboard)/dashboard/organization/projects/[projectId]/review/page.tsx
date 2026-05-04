

// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import Link from "next/link";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import ProjectReviewForm from "./ProjectReviewForm";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// export default async function OrganizationProjectReviewPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
//     redirect("/login");
//   }

//   const { id: projectId } = await params;

//   const project = await prisma.project.findFirst({
//     where: {
//       id: projectId,
//       organizationId: session.user.id,
//     },
//     include: {
//       applications: {
//         where: {
//           status: { in: ["ACCEPTED", "COMPLETED"] },
//         },
//         include: {
//           volunteer: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//               profileImageUrl: true,
//               headline: true,
//               username: true,
//             },
//           },
//         },
//         take: 1,
//       },
//       reviews: {
//         where: {
//           organizationId: session.user.id,
//         },
//         select: {
//           id: true,
//         },
//       },
//     },
//   });

//   if (!project) {
//     redirect("/dashboard/organization");
//   }

//   const assignedVolunteer = project.applications[0]?.volunteer ?? null;
//   const reviewAlreadySubmitted = project.reviews.length > 0;

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-8 md:px-8 lg:px-10">
//       <div className="mx-auto max-w-4xl space-y-8">
//         <Link
//           href="/dashboard/organization"
//           className="inline-flex text-sm font-semibold text-blue-600 hover:underline"
//         >
//           ← Back to Organization Dashboard
//         </Link>

//         <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
//           <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 px-6 py-8 text-white md:px-8">
//             <div className="absolute right-[-3rem] top-[-3rem] h-40 w-40 rounded-full bg-white/10 blur-3xl" />
//             <div className="relative">
//               <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">
//                 Project Review
//               </p>
//               <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
//                 Review completed work
//               </h1>
//               <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100 md:text-base">
//                 Rate the volunteer’s contribution and leave feedback that will
//                 strengthen their BuildUp profile and portfolio proof.
//               </p>
//             </div>
//           </div>

//           <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[0.9fr_1.1fr]">
//             <aside className="space-y-5">
//               <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
//                 <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
//                   Project
//                 </p>
//                 <h2 className="mt-3 text-xl font-bold text-slate-900">
//                   {project.title}
//                 </h2>
//                 <p className="mt-2 text-sm leading-6 text-slate-600">
//                   {project.description ||
//                     "This project has been marked as completed."}
//                 </p>

//                 <span className="mt-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
//                   {project.status.replaceAll("_", " ")}
//                 </span>
//               </div>

//               <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
//                 <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
//                   Volunteer
//                 </p>

//                 {assignedVolunteer ? (
//                   <div className="mt-4 flex items-start gap-4">
//                     {assignedVolunteer.profileImageUrl ? (
//                       <img
//                         src={assignedVolunteer.profileImageUrl}
//                         alt={assignedVolunteer.name ?? "Volunteer"}
//                         className="h-14 w-14 rounded-2xl object-cover"
//                       />
//                     ) : (
//                       <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-lg font-bold text-blue-700">
//                         {(assignedVolunteer.name ?? "U")
//                           .charAt(0)
//                           .toUpperCase()}
//                       </div>
//                     )}

//                     <div className="min-w-0">
//                       <p className="font-semibold text-slate-900">
//                         {assignedVolunteer.name ?? "Unnamed volunteer"}
//                       </p>
//                       <p className="mt-1 truncate text-sm text-slate-500">
//                         {assignedVolunteer.email}
//                       </p>
//                       {assignedVolunteer.headline ? (
//                         <p className="mt-2 text-sm text-slate-600">
//                           {assignedVolunteer.headline}
//                         </p>
//                       ) : null}
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="mt-3 text-sm text-slate-500">
//                     No completed volunteer was found for this project.
//                   </p>
//                 )}
//               </div>
//             </aside>

//             <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
//               {reviewAlreadySubmitted ? (
//                 <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-6 text-center">
//                   <h3 className="text-lg font-bold text-emerald-800">
//                     Review already submitted
//                   </h3>
//                   <p className="mt-2 text-sm leading-6 text-emerald-700">
//                     You have already reviewed this completed project.
//                   </p>

//                   <Link
//                     href="/dashboard/organization"
//                     className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
//                   >
//                     Back to Dashboard
//                   </Link>
//                 </div>
//               ) : assignedVolunteer ? (
//                 <ProjectReviewForm projectId={project.id} />
//               ) : (
//                 <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-6 text-center">
//                   <h3 className="text-lg font-bold text-amber-800">
//                     No volunteer to review
//                   </h3>
//                   <p className="mt-2 text-sm leading-6 text-amber-700">
//                     This project needs an accepted or completed volunteer before
//                     a review can be submitted.
//                   </p>
//                 </div>
//               )}
//             </section>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }



import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import ProjectReviewForm from "./ProjectReviewForm";

export const dynamic = "force-dynamic";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZATION") {
    redirect("/login");
  }

  const { projectId } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: session.user.id,
    },
    include: {
      applications: {
        where: {
          status: { in: ["ACCEPTED", "COMPLETED"] },
        },
        include: {
          volunteer: true,
        },
      },
      reviews: {
        where: {
          organizationId: session.user.id,
        },
      },
    },
  });

  if (!project) {
    redirect("/dashboard/organization");
  }

  const volunteer = project.applications[0]?.volunteer;
  const alreadyReviewed = project.reviews.length > 0;

  return (
    <main className="min-h-screen px-6 py-10 bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
      <div className="max-w-4xl mx-auto space-y-8">

        <Link
          href="/dashboard/organization"
          className="text-sm text-blue-600 font-semibold hover:underline"
        >
          ← Back to Dashboard
        </Link>

        {/* HEADER */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-blue-700 text-white p-8 shadow-lg">
          <h1 className="text-3xl font-bold">Review Project</h1>
          <p className="mt-2 text-sm text-blue-100">
            Rate the volunteer and leave feedback.
          </p>
        </div>

        {/* PROJECT */}
        <div className="bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-semibold">{project.title}</h2>
          <p className="text-sm text-gray-600 mt-2">
            {project.description}
          </p>
        </div>

        {/* VOLUNTEER */}
        {volunteer && (
          <div className="bg-white border rounded-2xl p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center font-bold text-blue-600">
              {volunteer.name?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold">{volunteer.name}</p>
              <p className="text-sm text-gray-500">{volunteer.email}</p>
            </div>
          </div>
        )}

        {/* FORM */}
        <div className="bg-white border rounded-2xl p-6">
          {alreadyReviewed ? (
            <div className="text-center text-green-600 font-semibold">
              Review already submitted
            </div>
          ) : volunteer ? (
            <ProjectReviewForm projectId={projectId} />
          ) : (
            <p className="text-gray-500">
              No volunteer found for this project.
            </p>
          )}
        </div>

      </div>
    </main>
  );
}
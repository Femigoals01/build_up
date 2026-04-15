



// import { getServerSession } from "next-auth";
// import { redirect, notFound } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export default async function ProjectDetailsPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const session = await getServerSession(authOptions);

//   if (!session) {
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

//   if (!project) return notFound();

//   return (
//     <main className="min-h-screen bg-gray-50 px-10 py-10">
//       <div className="max-w-4xl mx-auto space-y-8">

//         {/* Header */}
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             {project.title}
//           </h1>
//           <p className="text-gray-500 mt-2">
//             Posted by {project.organization.name}
//           </p>
//         </div>

//         {/* Description */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <h2 className="text-lg font-semibold mb-2">Project Description</h2>
//           <p className="text-gray-700 leading-relaxed">
//             {project.description}
//           </p>
//         </div>

//         {/* Requirements */}
//         {project.requirements && (
//           <div className="bg-white p-6 rounded-xl shadow-sm border">
//             <h2 className="text-lg font-semibold mb-2">Requirements</h2>
//             <p className="text-gray-700">
//               {project.requirements}
//             </p>
//           </div>
//         )}

//         {/* Skills */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <h2 className="text-lg font-semibold mb-3">Skills Needed</h2>
//           <div className="flex flex-wrap gap-2">
//             {project.skills.map((skill: string, i: number) => (
//               <span
//                 key={i}
//                 className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
//               >
//                 {skill}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* CTA */}
//         <div className="flex justify-end">
//           <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
//             Apply to Project
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }



// import { getServerSession } from "next-auth";
// import { redirect, notFound } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export default async function ProjectDetailsPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     redirect("/login");
//   }

//   const { id } = await params;

//   const project = await prisma.project.findUnique({
//     where: { id },
//     include: {
//       organization: {
//         select: { name: true },
//       },
//     },
//   });

//   if (!project) return notFound();

//   return (
//     <main className="min-h-screen bg-gray-50 px-10 py-10">
//       <div className="max-w-4xl mx-auto space-y-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             {project.title}
//           </h1>
//           <p className="text-gray-500 mt-2">
//             Posted by {project.organization.name}
//           </p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <h2 className="text-lg font-semibold mb-2">Project Description</h2>
//           <p className="text-gray-700 leading-relaxed">
//             {project.description}
//           </p>
//         </div>

//         {project.requirements && (
//           <div className="bg-white p-6 rounded-xl shadow-sm border">
//             <h2 className="text-lg font-semibold mb-2">Requirements</h2>
//             <p className="text-gray-700">{project.requirements}</p>
//           </div>
//         )}

//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <h2 className="text-lg font-semibold mb-3">Skills Needed</h2>
//           <div className="flex flex-wrap gap-2">
//             {project.skills.map((skill: string, i: number) => (
//               <span
//                 key={i}
//                 className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
//               >
//                 {skill}
//               </span>
//             ))}
//           </div>
//         </div>

//         <div className="flex justify-end">
//           <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
//             Apply to Project
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }



// import { getServerSession } from "next-auth";
// import { redirect, notFound } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// function getFocusBanner(focus?: string) {
//   switch (focus) {
//     case "invite-accepted":
//       return {
//         title: "Invite accepted",
//         message:
//           "A volunteer accepted your invitation for this project. Review the project activity and continue the workflow from here.",
//         className: "border-emerald-200 bg-emerald-50 text-emerald-800",
//       };
//     case "invite-declined":
//       return {
//         title: "Invite declined",
//         message:
//           "A volunteer declined your invitation for this project. You can invite another volunteer or review your candidate pipeline.",
//         className: "border-amber-200 bg-amber-50 text-amber-800",
//       };
//     default:
//       return null;
//   }
// }

// export default async function ProjectDetailsPage({
//   params,
//   searchParams,
// }: {
//   params: Promise<{ id: string }>;
//   searchParams?: Promise<{ focus?: string }>;
// }) {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     redirect("/login");
//   }

//   const { id } = await params;
//   const resolvedSearchParams = await searchParams;
//   const focus = resolvedSearchParams?.focus;
//   const focusBanner = getFocusBanner(focus);

//   const project = await prisma.project.findUnique({
//     where: { id },
//     include: {
//       organization: {
//         select: { name: true },
//       },
//     },
//   });

//   if (!project) return notFound();

//   return (
//     <main className="min-h-screen bg-gray-50 px-10 py-10">
//       <div className="max-w-4xl mx-auto space-y-8">
//         {focusBanner && (
//           <div className={`rounded-2xl border px-5 py-4 ${focusBanner.className}`}>
//             <h2 className="text-sm font-bold uppercase tracking-[0.16em]">
//               {focusBanner.title}
//             </h2>
//             <p className="mt-2 text-sm leading-6">
//               {focusBanner.message}
//             </p>
//           </div>
//         )}

//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">
//             {project.title}
//           </h1>
//           <p className="text-gray-500 mt-2">
//             Posted by {project.organization.name}
//           </p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <h2 className="text-lg font-semibold mb-2">Project Description</h2>
//           <p className="text-gray-700 leading-relaxed">
//             {project.description}
//           </p>
//         </div>

//         {project.requirements && (
//           <div className="bg-white p-6 rounded-xl shadow-sm border">
//             <h2 className="text-lg font-semibold mb-2">Requirements</h2>
//             <p className="text-gray-700">
//               {project.requirements}
//             </p>
//           </div>
//         )}

//         <div className="bg-white p-6 rounded-xl shadow-sm border">
//           <h2 className="text-lg font-semibold mb-3">Skills Needed</h2>
//           <div className="flex flex-wrap gap-2">
//             {project.skills.map((skill: string, i: number) => (
//               <span
//                 key={i}
//                 className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
//               >
//                 {skill}
//               </span>
//             ))}
//           </div>
//         </div>

//         <div className="flex justify-end">
//           <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
//             Apply to Project
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }



import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import ApplyButton from "@/components/projects/ApplyButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getFocusBanner(focus?: string) {
  switch (focus) {
    case "invite-accepted":
      return {
        title: "Invite accepted",
        message:
          "A volunteer accepted your invitation for this project. Review the project activity and continue the workflow from here.",
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-800",
        icon: "✅",
      };
    case "invite-declined":
      return {
        title: "Invite declined",
        message:
          "A volunteer declined your invitation for this project. You can review other candidates or send a new invitation.",
        className:
          "border-amber-200 bg-amber-50 text-amber-800",
        icon: "⚠️",
      };
    default:
      return null;
  }
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function getStatusStyles(status: string) {
  switch (status) {
    case "OPEN":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "IN_PROGRESS":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "COMPLETED":
      return "border-slate-200 bg-slate-100 text-slate-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

export default async function ProjectDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ focus?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.id) {
    redirect("/login");
  }

  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const focus = resolvedSearchParams?.focus;
  const focusBanner = getFocusBanner(focus);

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
      applications: {
        include: {
          volunteer: {
            select: {
              id: true,
              name: true,
              email: true,
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!project) return notFound();

  const isOrganizationViewer = session.user.role === "ORGANIZATION";
  const isVolunteerViewer = session.user.role === "VOLUNTEER";
  const isProjectOwner = project.organization.id === session.user.id;

  const acceptedVolunteers = project.applications.filter(
    (app) => app.status === "ACCEPTED"
  );
  const pendingApplications = project.applications.filter(
    (app) => app.status === "PENDING"
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 md:px-8 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {focusBanner && (
          <section
            className={`rounded-[26px] border px-5 py-5 shadow-sm sm:px-6 ${focusBanner.className}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-xl shadow-sm">
                {focusBanner.icon}
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em]">
                  Project Update
                </p>
                <h2 className="mt-2 text-lg font-bold">{focusBanner.title}</h2>
                <p className="mt-2 text-sm leading-6">{focusBanner.message}</p>
              </div>
            </div>
          </section>
        )}

        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="relative px-6 py-8 md:px-8 md:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.06),transparent_24%)]" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  Project Details
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  {project.title}
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500 md:text-base">
                  Posted by {project.organization.name}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(
                      project.status
                    )}`}
                  >
                    {formatStatus(project.status)}
                  </span>

                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                    {project.applications.length} applicant
                    {project.applications.length === 1 ? "" : "s"}
                  </span>

                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                    {acceptedVolunteers.length} active volunteer
                    {acceptedVolunteers.length === 1 ? "" : "s"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {isOrganizationViewer ? (
                  <>
                    <Link
                      href="/dashboard/organization"
                      className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Back to Dashboard
                    </Link>

                    <Link
                      href="/dashboard/organization/invites"
                      className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                      Invite History
                    </Link>
                  </>
                ) : isVolunteerViewer ? (
                  <ApplyButton projectId={project.id} />
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                Project Description
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-700 md:text-base">
                {project.description}
              </p>
            </section>

            {project.requirements && (
              <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                  Requirements
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-700 md:text-base">
                  {project.requirements}
                </p>
              </section>
            )}

            <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                Skills Needed
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.skills.map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
              <h2 className="text-lg font-semibold text-slate-900">
                Project Snapshot
              </h2>

              <div className="mt-5 grid gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Status
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {formatStatus(project.status)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Organization
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {project.organization.name}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Applicants
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {project.applications.length}
                  </p>
                </div>
              </div>
            </section>

            {isOrganizationViewer && isProjectOwner && (
              <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
                <h2 className="text-lg font-semibold text-slate-900">
                  Organization View
                </h2>

                <div className="mt-5 grid gap-4">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                      Accepted Volunteers
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {acceptedVolunteers.length}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                      Pending Applications
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {pendingApplications.length}
                    </p>
                  </div>
                </div>

                {acceptedVolunteers.length > 0 && (
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Active Volunteer Names
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {acceptedVolunteers.map((app) => (
                        <span
                          key={app.id}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700"
                        >
                          {app.volunteer.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}


// import { getServerSession } from "next-auth";
// import { redirect, notFound } from "next/navigation";
// import Link from "next/link";
// import { revalidatePath } from "next/cache";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// type PageProps = {
//   params: Promise<{
//     projectId: string;
//   }>;
// };

// type VolunteerCardProps = {
//   volunteer: {
//     id: string;
//     name: string;
//     email: string;
//     username: string;
//     headline: string | null;
//     bio: string | null;
//     skills: string | null;
//     country: string | null;
//     profileImageUrl: string | null;
//     availabilityStatus: string | null;
//   };
//   projectId: string;
//   badge?: string;
//   helperText?: string;
// };

// function getSkillsArray(skills?: string | null) {
//   return skills
//     ? skills
//         .split(",")
//         .map((s) => s.trim())
//         .filter(Boolean)
//         .slice(0, 5)
//     : [];
// }

// async function inviteVolunteer(formData: FormData) {
//   "use server";

//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
//     redirect("/login");
//   }

//   const projectId = String(formData.get("projectId") || "");
//   const volunteerId = String(formData.get("volunteerId") || "");

//   if (!projectId || !volunteerId) {
//     return;
//   }

//   const project = await prisma.project.findUnique({
//     where: { id: projectId },
//     select: {
//       id: true,
//       status: true,
//       organizationId: true,
//     },
//   });

//   if (!project || project.organizationId !== session.user.id) {
//     return;
//   }

//   if (project.status === "COMPLETED") {
//     return;
//   }

//   const existing = await prisma.application.findFirst({
//     where: {
//       projectId,
//       volunteerId,
//     },
//     select: { id: true },
//   });

//   if (existing) {
//     return;
//   }

//   await prisma.application.create({
//     data: {
//       volunteerId,
//       projectId,
//       status: "PENDING",
//       source: "ORGANIZATION",
//     },
//   });

//   revalidatePath(`/dashboard/organization/projects/${projectId}/invite`);
//   revalidatePath("/dashboard/organization");
// }

// function VolunteerCard({
//   volunteer,
//   projectId,
//   badge,
//   helperText,
// }: VolunteerCardProps) {
//   const skills = getSkillsArray(volunteer.skills);

//   return (
//     <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
//       <div className="flex items-start gap-4">
//         {volunteer.profileImageUrl ? (
//           <img
//             src={volunteer.profileImageUrl}
//             alt={volunteer.name}
//             className="h-14 w-14 rounded-2xl object-cover"
//           />
//         ) : (
//           <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-lg font-semibold text-blue-700">
//             {volunteer.name.charAt(0).toUpperCase()}
//           </div>
//         )}

//         <div className="min-w-0 flex-1">
//           <div className="flex flex-wrap items-start justify-between gap-3">
//             <div className="min-w-0">
//               <p className="truncate text-base font-semibold text-slate-900">
//                 {volunteer.name}
//               </p>
//               <p className="truncate text-sm text-slate-500">
//                 {volunteer.email}
//               </p>
//               {volunteer.headline ? (
//                 <p className="mt-1 text-sm text-slate-600">
//                   {volunteer.headline}
//                 </p>
//               ) : null}
//             </div>

//             {badge ? (
//               <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
//                 {badge}
//               </span>
//             ) : null}
//           </div>

//           {helperText ? (
//             <p className="mt-2 text-sm text-slate-500">{helperText}</p>
//           ) : null}

//           {volunteer.bio ? (
//             <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
//               {volunteer.bio}
//             </p>
//           ) : null}

//           <div className="mt-4 flex flex-wrap gap-2">
//             {volunteer.country ? (
//               <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
//                 {volunteer.country}
//               </span>
//             ) : null}

//             {volunteer.availabilityStatus ? (
//               <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
//                 {volunteer.availabilityStatus}
//               </span>
//             ) : null}

//             {skills.map((skill) => (
//               <span
//                 key={skill}
//                 className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
//               >
//                 {skill}
//               </span>
//             ))}
//           </div>

//           <div className="mt-5 flex flex-wrap gap-2">
//             <Link
//               href={`/portfolio/${volunteer.username}`}
//               className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//             >
//               View Profile
//             </Link>

//             <form action={inviteVolunteer}>
//               <input type="hidden" name="projectId" value={projectId} />
//               <input type="hidden" name="volunteerId" value={volunteer.id} />
//               <button
//                 type="submit"
//                 className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
//               >
//                 Invite to Project
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default async function InviteVolunteersPage({ params }: PageProps) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
//     redirect("/login");
//   }

//   const { projectId } = await params;

//   const project = await prisma.project.findUnique({
//     where: { id: projectId },
//     select: {
//       id: true,
//       title: true,
//       description: true,
//       status: true,
//       difficulty: true,
//       skills: true,
//       organizationId: true,
//     },
//   });

//   if (!project) {
//     notFound();
//   }

//   if (project.organizationId !== session.user.id) {
//     redirect("/dashboard/organization");
//   }

//   const currentProjectApplications = await prisma.application.findMany({
//     where: {
//       projectId: project.id,
//     },
//     select: {
//       volunteerId: true,
//     },
//   });

//   const excludedVolunteerIds = new Set(
//     currentProjectApplications.map((a) => a.volunteerId)
//   );

//   const previousCollaborations = await prisma.application.findMany({
//     where: {
//       project: {
//         organizationId: session.user.id,
//         NOT: {
//           id: project.id,
//         },
//       },
//       status: {
//         in: ["ACCEPTED", "COMPLETED"],
//       },
//     },
//     select: {
//       volunteer: {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           username: true,
//           headline: true,
//           bio: true,
//           skills: true,
//           country: true,
//           profileImageUrl: true,
//           availabilityStatus: true,
//         },
//       },
//     },
//   });

//   const workedWithBeforeMap = new Map<
//     string,
//     {
//       id: string;
//       name: string;
//       email: string;
//       username: string;
//       headline: string | null;
//       bio: string | null;
//       skills: string | null;
//       country: string | null;
//       profileImageUrl: string | null;
//       availabilityStatus: string | null;
//     }
//   >();

//   for (const item of previousCollaborations) {
//     if (!excludedVolunteerIds.has(item.volunteer.id)) {
//       workedWithBeforeMap.set(item.volunteer.id, item.volunteer);
//     }
//   }

//   const workedWithBefore = Array.from(workedWithBeforeMap.values());

//   const activeVolunteers = await prisma.user.findMany({
//     where: {
//       role: "VOLUNTEER",
//       id: {
//         notIn: [
//           ...excludedVolunteerIds,
//           ...workedWithBefore.map((v) => v.id),
//         ],
//       },
//     },
//     orderBy: {
//       lastActivitySeenAt: "desc",
//     },
//     take: 50,
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       username: true,
//       headline: true,
//       bio: true,
//       skills: true,
//       country: true,
//       profileImageUrl: true,
//       availabilityStatus: true,
//     },
//   });

//   return (
//     <div className="mx-auto max-w-7xl space-y-8">
//       <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
//         <div className="border-b border-slate-200 px-6 py-5 md:px-8">
//           <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
//             <div className="max-w-3xl">
//               <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
//                 Invite Volunteers
//               </p>
//               <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//                 Invite people to {project.title}
//               </h1>
//               <p className="mt-3 text-sm leading-6 text-slate-600">
//                 Find strong candidates, prioritize people who have worked with your organization before,
//                 and send them direct project invitations.
//               </p>

//               <div className="mt-4 flex flex-wrap gap-2">
//                 <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
//                   {project.status}
//                 </span>
//                 <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
//                   {project.difficulty}
//                 </span>
//                 {project.skills.map((skill) => (
//                   <span
//                     key={skill}
//                     className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
//                   >
//                     {skill}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-2">
//               <Link
//                 href={`/dashboard/projects/${project.id}`}
//                 className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//               >
//                 View Project
//               </Link>
//               <Link
//                 href="/dashboard/organization"
//                 className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
//               >
//                 Back to Dashboard
//               </Link>
//             </div>
//           </div>
//         </div>

//         <div className="px-6 py-6 md:px-8">
//           {project.description ? (
//             <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
//               <p className="text-sm leading-7 text-slate-600">
//                 {project.description}
//               </p>
//             </div>
//           ) : null}
//         </div>
//       </section>

//       <section className="space-y-4">
//         <div>
//           <h2 className="text-xl font-semibold text-slate-900">
//             Worked with your organization before
//           </h2>
//           <p className="mt-1 text-sm text-slate-500">
//             These volunteers already have experience working with your team.
//           </p>
//         </div>

//         {workedWithBefore.length === 0 ? (
//           <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//             <p className="text-sm font-medium text-slate-700">
//               No previous collaborators available to invite right now.
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
//             {workedWithBefore.map((volunteer) => (
//               <VolunteerCard
//                 key={volunteer.id}
//                 volunteer={volunteer}
//                 projectId={project.id}
//                 badge="Worked with you before"
//                 helperText="Previously accepted or completed work with your organization."
//               />
//             ))}
//           </div>
//         )}
//       </section>

//       <section className="space-y-4">
//         <div>
//           <h2 className="text-xl font-semibold text-slate-900">
//             Active volunteers
//           </h2>
//           <p className="mt-1 text-sm text-slate-500">
//             Recently active volunteers you can invite to this project.
//           </p>
//         </div>

//         {activeVolunteers.length === 0 ? (
//           <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//             <p className="text-sm font-medium text-slate-700">
//               No additional volunteers are available to invite right now.
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
//             {activeVolunteers.map((volunteer) => (
//               <VolunteerCard
//                 key={volunteer.id}
//                 volunteer={volunteer}
//                 projectId={project.id}
//               />
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }







import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

type VolunteerCardProps = {
  volunteer: {
    id: string;
    name: string;
    email: string;
    username: string;
    headline: string | null;
    bio: string | null;
    skills: string | null;
    country: string | null;
    profileImageUrl: string | null;
    availabilityStatus: string | null;
  };
  projectId: string;
  badge?: string;
  helperText?: string;
};

function getSkillsArray(skills?: string | null) {
  return skills
    ? skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 5)
    : [];
}

async function inviteVolunteer(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
    redirect("/login");
  }

  const projectId = String(formData.get("projectId") || "");
  const volunteerId = String(formData.get("volunteerId") || "");

  if (!projectId || !volunteerId) return;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      status: true,
      organizationId: true,
    },
  });

  if (!project || project.organizationId !== session.user.id) return;
  if (project.status === "COMPLETED") return;

  const assignedVolunteer = await prisma.application.findFirst({
    where: {
      projectId,
      status: {
        in: ["ACCEPTED", "COMPLETED"],
      },
    },
    select: { id: true },
  });

  if (assignedVolunteer) return;

  const existing = await prisma.application.findFirst({
    where: {
      projectId,
      volunteerId,
    },
    select: { id: true },
  });

  if (existing) return;

  await prisma.application.create({
    data: {
      volunteerId,
      projectId,
      status: "PENDING",
      source: "ORGANIZATION",
    },
  });

  revalidatePath(`/dashboard/organization/projects/${projectId}/invite`);
  revalidatePath("/dashboard/organization");
}

function VolunteerCard({
  volunteer,
  projectId,
  badge,
  helperText,
}: VolunteerCardProps) {
  const skills = getSkillsArray(volunteer.skills);

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4">
        {volunteer.profileImageUrl ? (
          <img
            src={volunteer.profileImageUrl}
            alt={volunteer.name}
            className="h-14 w-14 rounded-2xl object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-lg font-semibold text-blue-700">
            {volunteer.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-slate-900">
                {volunteer.name}
              </p>
              <p className="truncate text-sm text-slate-500">
                {volunteer.email}
              </p>
              {volunteer.headline ? (
                <p className="mt-1 text-sm text-slate-600">
                  {volunteer.headline}
                </p>
              ) : null}
            </div>

            {badge ? (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {badge}
              </span>
            ) : null}
          </div>

          {helperText ? (
            <p className="mt-2 text-sm text-slate-500">{helperText}</p>
          ) : null}

          {volunteer.bio ? (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
              {volunteer.bio}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            {volunteer.country ? (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                {volunteer.country}
              </span>
            ) : null}

            {volunteer.availabilityStatus ? (
              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {volunteer.availabilityStatus}
              </span>
            ) : null}

            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={`/portfolio/${volunteer.username}`}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Profile
            </Link>

            <form action={inviteVolunteer}>
              <input type="hidden" name="projectId" value={projectId} />
              <input type="hidden" name="volunteerId" value={volunteer.id} />
              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Invite to Project
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function InviteVolunteersPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
    redirect("/login");
  }

  const { projectId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      difficulty: true,
      skills: true,
      organizationId: true,
    },
  });

  if (!project) notFound();
  if (project.organizationId !== session.user.id) {
    redirect("/dashboard/organization");
  }

  const assignedVolunteer = await prisma.application.findFirst({
    where: {
      projectId: project.id,
      status: {
        in: ["ACCEPTED", "COMPLETED"],
      },
    },
    select: {
      volunteer: {
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
        },
      },
    },
  });

  if (assignedVolunteer) {
    return (
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Invite Volunteers
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {project.title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            This project already has an assigned volunteer, so no further invites can be sent.
          </p>

          <div className="mt-6 rounded-[22px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">
              Assigned volunteer
            </p>
            <p className="mt-2 text-base text-slate-700">
              {assignedVolunteer.volunteer.name}
            </p>
            <p className="text-sm text-slate-500">
              {assignedVolunteer.volunteer.email}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/portfolio/${assignedVolunteer.volunteer.username}`}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                View Profile
              </Link>

              <Link
                href={`/dashboard/projects/${project.id}`}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                View Project
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const currentProjectApplications = await prisma.application.findMany({
    where: {
      projectId: project.id,
    },
    select: {
      volunteerId: true,
    },
  });

  const excludedVolunteerIds = new Set(
    currentProjectApplications.map((a) => a.volunteerId)
  );

  const previousCollaborations = await prisma.application.findMany({
    where: {
      project: {
        organizationId: session.user.id,
        NOT: {
          id: project.id,
        },
      },
      status: {
        in: ["ACCEPTED", "COMPLETED"],
      },
    },
    select: {
      volunteer: {
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          headline: true,
          bio: true,
          skills: true,
          country: true,
          profileImageUrl: true,
          availabilityStatus: true,
        },
      },
    },
  });

  const workedWithBeforeMap = new Map<
    string,
    {
      id: string;
      name: string;
      email: string;
      username: string;
      headline: string | null;
      bio: string | null;
      skills: string | null;
      country: string | null;
      profileImageUrl: string | null;
      availabilityStatus: string | null;
    }
  >();

  for (const item of previousCollaborations) {
    if (!excludedVolunteerIds.has(item.volunteer.id)) {
      workedWithBeforeMap.set(item.volunteer.id, item.volunteer);
    }
  }

  const workedWithBefore = Array.from(workedWithBeforeMap.values());

  const activeVolunteers = await prisma.user.findMany({
    where: {
      role: "VOLUNTEER",
      id: {
        notIn: [
          ...excludedVolunteerIds,
          ...workedWithBefore.map((v) => v.id),
        ],
      },
    },
    orderBy: {
      lastActivitySeenAt: "desc",
    },
    take: 50,
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      headline: true,
      bio: true,
      skills: true,
      country: true,
      profileImageUrl: true,
      availabilityStatus: true,
    },
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5 md:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Invite Volunteers
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Invite people to {project.title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Find strong candidates, prioritize people who have worked with your organization before,
                and send them direct project invitations.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                  {project.status}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                  {project.difficulty}
                </span>
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href={`/dashboard/projects/${project.id}`}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                View Project
              </Link>
              <Link
                href="/dashboard/organization"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 md:px-8">
          {project.description ? (
            <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm leading-7 text-slate-600">
                {project.description}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Worked with your organization before
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            These volunteers already have experience working with your team.
          </p>
        </div>

        {workedWithBefore.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <p className="text-sm font-medium text-slate-700">
              No previous collaborators available to invite right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {workedWithBefore.map((volunteer) => (
              <VolunteerCard
                key={volunteer.id}
                volunteer={volunteer}
                projectId={project.id}
                badge="Worked with you before"
                helperText="Previously accepted or completed work with your organization."
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Active volunteers
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Recently active volunteers you can invite to this project.
          </p>
        </div>

        {activeVolunteers.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <p className="text-sm font-medium text-slate-700">
              No additional volunteers are available to invite right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {activeVolunteers.map((volunteer) => (
              <VolunteerCard
                key={volunteer.id}
                volunteer={volunteer}
                projectId={project.id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


// import Image from "next/image";
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import { prisma } from "@/lib/prisma";

// export const dynamic = "force-dynamic";

// function parseSkills(skills?: string | null) {
//   if (!skills) return [];

//   return skills
//     .split(",")
//     .map((skill) => skill.trim())
//     .filter(Boolean);
// }

// function getMentorLevelTitle(level: number) {
//   if (level >= 5) return "Mentor Master";
//   if (level >= 4) return "Elite Mentor";
//   if (level >= 3) return "Experienced Guide";
//   if (level >= 2) return "Rising Mentor";

//   return "New Mentor";
// }

// function getInitial(name?: string | null) {
//   return name?.trim()?.charAt(0)?.toUpperCase() || "M";
// }

// export default async function PublicMentorProfilePage({
//   params,
// }: {
//   params: Promise<{ username: string }>;
// }) {
//   const { username } = await params;

//   const mentor = await prisma.user.findFirst({
//     where: {
//       username,
//       role: "MENTOR",
//       mentorStatus: "APPROVED",
//       accountStatus: "ACTIVE",
//     },
//     include: {
//       badges: true,
//       mentoredProjects: {
//         where: {
//           status: "COMPLETED",
//         },
//         select: {
//           id: true,
//           title: true,
//           referenceNo: true,
//           createdAt: true,
//           organization: {
//             select: {
//               name: true,
//             },
//           },
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//       },
//       mentorReviewsReceived: {
//         orderBy: {
//           createdAt: "desc",
//         },
//         include: {
//           volunteer: {
//             select: {
//               name: true,
//               username: true,
//             },
//           },
//           project: {
//             select: {
//               title: true,
//               referenceNo: true,
//             },
//           },
//         },
//       },
//     },
//   });

//   if (!mentor) {
//     notFound();
//   }

//   const skills = parseSkills(mentor.skills);
//   const projectsGuided = mentor.mentoredProjects.length;
//   const reviewsCount = mentor.mentorReviewsReceived.length;

//   const guidanceAverage =
//     reviewsCount > 0
//       ? (
//           mentor.mentorReviewsReceived.reduce(
//             (sum, review) => sum + review.guidance,
//             0
//           ) / reviewsCount
//         ).toFixed(1)
//       : "0.0";

//   const communicationAverage =
//     reviewsCount > 0
//       ? (
//           mentor.mentorReviewsReceived.reduce(
//             (sum, review) => sum + review.communication,
//             0
//           ) / reviewsCount
//         ).toFixed(1)
//       : "0.0";

//   const availabilityAverage =
//     reviewsCount > 0
//       ? (
//           mentor.mentorReviewsReceived.reduce(
//             (sum, review) => sum + review.availability,
//             0
//           ) / reviewsCount
//         ).toFixed(1)
//       : "0.0";

//   const professionalismAverage =
//     reviewsCount > 0
//       ? (
//           mentor.mentorReviewsReceived.reduce(
//             (sum, review) => sum + review.professionalism,
//             0
//           ) / reviewsCount
//         ).toFixed(1)
//       : "0.0";

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900">
//       <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 px-4 py-16 text-white">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_30%)]" />

//         <div className="relative mx-auto max-w-7xl">
//           <Link
//             href="/dashboard/volunteer/mentors"
//             className="inline-flex text-sm font-semibold text-blue-100 transition hover:text-white"
//           >
//             ← Back to mentors
//           </Link>

//           <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
//             <div className="flex flex-col gap-6 md:flex-row md:items-center">
//               <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-[36px] border border-white/20 bg-white/10 shadow-2xl">
//                 {mentor.profileImageUrl ? (
//                   <Image
//                     src={mentor.profileImageUrl}
//                     alt={mentor.name || "Mentor profile image"}
//                     fill
//                     className="object-cover"
//                     sizes="128px"
//                   />
//                 ) : (
//                   <div className="flex h-full w-full items-center justify-center bg-blue-600 text-5xl font-black text-white">
//                     {getInitial(mentor.name)}
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <div className="flex flex-wrap items-center gap-2">
//                   <span className="rounded-full border border-emerald-300/30 bg-emerald-400/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-100">
//                     Approved Mentor
//                   </span>

//                   <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-100">
//                     Level {mentor.mentorLevel}
//                   </span>
//                 </div>

//                 <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
//                   {mentor.name}
//                 </h1>

//                 {mentor.headline ? (
//                   <p className="mt-3 max-w-2xl text-lg font-semibold text-blue-100">
//                     {mentor.headline}
//                   </p>
//                 ) : (
//                   <p className="mt-3 max-w-2xl text-lg font-semibold text-blue-100">
//                     {getMentorLevelTitle(mentor.mentorLevel)}
//                   </p>
//                 )}

//                 <p className="mt-2 text-sm font-semibold text-blue-200">
//                   @{mentor.username}
//                 </p>
//               </div>
//             </div>

//             <div className="rounded-[30px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
//               <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-100">
//                 Mentor Reputation
//               </p>

//               <div className="mt-5 grid grid-cols-2 gap-3">
//                 <HeroMetric
//                   label="Projects Guided"
//                   value={String(projectsGuided)}
//                 />
//                 <HeroMetric
//                   label="Rating"
//                   value={`${Number(mentor.mentorRating || 0).toFixed(1)} ⭐`}
//                 />
//                 <HeroMetric
//                   label="Points"
//                   value={String(mentor.mentorshipPoints || 0)}
//                 />
//                 <HeroMetric
//                   label="Reviews"
//                   value={String(mentor.mentorRatingCount || reviewsCount)}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="mx-auto max-w-7xl px-4 py-10">
//         <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
//           <div className="space-y-8">
//             <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
//               <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
//                 About Mentor
//               </p>

//               <h2 className="mt-2 text-3xl font-black text-slate-950">
//                 Professional Guidance Profile
//               </h2>

//               <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
//                 {mentor.bio ||
//                   "This mentor has not added a full bio yet, but is approved on BuildUp and available to guide volunteers on active projects."}
//               </p>

//               <div className="mt-6 grid gap-4 md:grid-cols-3">
//                 <InfoCard
//                   label="Experience"
//                   value={mentor.experience ? `${mentor.experience} years` : "N/A"}
//                 />
//                 <InfoCard
//                   label="Country"
//                   value={mentor.country || "Not specified"}
//                 />
//                 <InfoCard
//                   label="Mentor Level"
//                   value={getMentorLevelTitle(mentor.mentorLevel)}
//                 />
//               </div>
//             </section>

//             <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
//               <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
//                 Skills & Expertise
//               </p>

//               <h2 className="mt-2 text-3xl font-black text-slate-950">
//                 Areas of Guidance
//               </h2>

//               {skills.length > 0 ? (
//                 <div className="mt-6 flex flex-wrap gap-2">
//                   {skills.map((skill) => (
//                     <span
//                       key={skill}
//                       className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700"
//                     >
//                       {skill}
//                     </span>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="mt-4 text-sm text-slate-500">
//                   No skills listed yet.
//                 </p>
//               )}
//             </section>

//             <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
//               <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
//                 Mentor Performance
//               </p>

//               <h2 className="mt-2 text-3xl font-black text-slate-950">
//                 Review Metrics
//               </h2>

//               <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                 <MetricCard label="Guidance" value={guidanceAverage} />
//                 <MetricCard label="Communication" value={communicationAverage} />
//                 <MetricCard label="Availability" value={availabilityAverage} />
//                 <MetricCard
//                   label="Professionalism"
//                   value={professionalismAverage}
//                 />
//               </div>
//             </section>

//             <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
//               <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//                 <div>
//                   <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
//                     Guided Projects
//                   </p>

//                   <h2 className="mt-2 text-3xl font-black text-slate-950">
//                     Completed Mentorship Impact
//                   </h2>
//                 </div>

//                 <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-600">
//                   {projectsGuided} completed
//                 </span>
//               </div>

//               {mentor.mentoredProjects.length > 0 ? (
//                 <div className="mt-6 grid gap-4">
//                   {mentor.mentoredProjects.slice(0, 6).map((project) => (
//                     <div
//                       key={project.id}
//                       className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
//                     >
//                       <p className="text-lg font-black text-slate-950">
//                         {project.title}
//                       </p>

//                       <p className="mt-2 text-sm text-slate-500">
//                         Organization:{" "}
//                         <span className="font-bold text-slate-700">
//                           {project.organization?.name || "Unknown"}
//                         </span>
//                       </p>

//                       {project.referenceNo ? (
//                         <p className="mt-2 font-mono text-xs font-bold text-blue-600">
//                           {project.referenceNo}
//                         </p>
//                       ) : null}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="mt-5 text-sm text-slate-500">
//                   No completed guided projects yet.
//                 </p>
//               )}
//             </section>
//           </div>

//           <aside className="space-y-6">
//             <section className="rounded-[32px] border border-slate-900 bg-slate-950 p-6 text-white shadow-sm">
//               <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
//                 BuildUp Mentor Badge
//               </p>

//               <h3 className="mt-3 text-2xl font-black">
//                 {getMentorLevelTitle(mentor.mentorLevel)}
//               </h3>

//               <p className="mt-3 text-sm leading-6 text-slate-300">
//                 This mentor contributes to BuildUp by guiding volunteers through
//                 practical project experience and real-world delivery.
//               </p>
//             </section>

//             <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
//               <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
//                 Achievements
//               </p>

//               {mentor.badges.length > 0 ? (
//                 <div className="mt-5 space-y-3">
//                   {mentor.badges.map((badge) => (
//                     <div
//                       key={badge.id}
//                       className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
//                     >
//                       <p className="text-sm font-black text-slate-900">
//                         {badge.icon} {badge.name}
//                       </p>

//                       <p className="mt-1 text-xs leading-5 text-slate-500">
//                         {badge.description}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="mt-4 text-sm text-slate-500">
//                   No badges earned yet.
//                 </p>
//               )}
//             </section>

//             <section className="rounded-[32px] border border-blue-100 bg-blue-50 p-6">
//               <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
//                 Want Guidance?
//               </p>

//               <h3 className="mt-2 text-xl font-black text-slate-950">
//                 Request this mentor from your volunteer dashboard.
//               </h3>

//               <Link
//                 href="/dashboard/volunteer/mentors"
//                 className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
//               >
//                 Request Mentorship
//               </Link>
//             </section>
//           </aside>
//         </div>
//       </section>
//     </main>
//   );
// }

// function HeroMetric({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
//       <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-100">
//         {label}
//       </p>

//       <p className="mt-2 text-2xl font-black text-white">{value}</p>
//     </div>
//   );
// }

// function InfoCard({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//       <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
//         {label}
//       </p>

//       <p className="mt-2 text-sm font-black text-slate-900">{value}</p>
//     </div>
//   );
// }

// function MetricCard({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//       <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
//         {label}
//       </p>

//       <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
//     </div>
//   );
// }





import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function parseSkills(skills?: string | null) {
  if (!skills) return [];

  return skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function getMentorLevelTitle(level: number) {
  if (level >= 5) return "Mentor Master";
  if (level >= 4) return "Elite Mentor";
  if (level >= 3) return "Experienced Guide";
  if (level >= 2) return "Rising Mentor";

  return "New Mentor";
}

function getInitial(name?: string | null) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "M";
}

export default async function PublicMentorProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const mentor = await prisma.user.findFirst({
    where: {
      username,
      role: "MENTOR",
      mentorStatus: "APPROVED",
      accountStatus: "ACTIVE",
    },
    include: {
      badges: true,
      mentorCertifications: {
        where: {
          status: "APPROVED",
        },
        select: {
          id: true,
        },
        take: 1,
      },
      mentoredProjects: {
        where: {
          status: "COMPLETED",
        },
        select: {
          id: true,
          title: true,
          referenceNo: true,
          createdAt: true,
          organization: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      mentorReviewsReceived: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          volunteer: {
            select: {
              name: true,
              username: true,
            },
          },
          project: {
            select: {
              title: true,
              referenceNo: true,
            },
          },
        },
      },
    },
  });

  if (!mentor) {
    notFound();
  }

  const skills = parseSkills(mentor.skills);
  const projectsGuided = mentor.mentoredProjects.length;
  const reviewsCount = mentor.mentorReviewsReceived.length;
  const isCertified = mentor.mentorCertifications.length > 0;

  const guidanceAverage =
    reviewsCount > 0
      ? (
          mentor.mentorReviewsReceived.reduce(
            (sum, review) => sum + review.guidance,
            0
          ) / reviewsCount
        ).toFixed(1)
      : "0.0";

  const communicationAverage =
    reviewsCount > 0
      ? (
          mentor.mentorReviewsReceived.reduce(
            (sum, review) => sum + review.communication,
            0
          ) / reviewsCount
        ).toFixed(1)
      : "0.0";

  const availabilityAverage =
    reviewsCount > 0
      ? (
          mentor.mentorReviewsReceived.reduce(
            (sum, review) => sum + review.availability,
            0
          ) / reviewsCount
        ).toFixed(1)
      : "0.0";

  const professionalismAverage =
    reviewsCount > 0
      ? (
          mentor.mentorReviewsReceived.reduce(
            (sum, review) => sum + review.professionalism,
            0
          ) / reviewsCount
        ).toFixed(1)
      : "0.0";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 px-4 py-16 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <Link
            href="/dashboard/volunteer/mentors"
            className="inline-flex text-sm font-semibold text-blue-100 transition hover:text-white"
          >
            ← Back to mentors
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-[36px] border border-white/20 bg-white/10 shadow-2xl">
                {mentor.profileImageUrl ? (
                  <Image
                    src={mentor.profileImageUrl}
                    alt={mentor.name || "Mentor profile image"}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-blue-600 text-5xl font-black text-white">
                    {getInitial(mentor.name)}
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-emerald-300/30 bg-emerald-400/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-100">
                    Approved Mentor
                  </span>

                  {isCertified && (
                    <span className="rounded-full border border-emerald-300/30 bg-emerald-400/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-100">
                      🎓 BuildUp Certified Mentor
                    </span>
                  )}

                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-100">
                    Level {mentor.mentorLevel}
                  </span>
                </div>

                <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
                  {mentor.name}
                </h1>

                {mentor.headline ? (
                  <p className="mt-3 max-w-2xl text-lg font-semibold text-blue-100">
                    {mentor.headline}
                  </p>
                ) : (
                  <p className="mt-3 max-w-2xl text-lg font-semibold text-blue-100">
                    {getMentorLevelTitle(mentor.mentorLevel)}
                  </p>
                )}

                <p className="mt-2 text-sm font-semibold text-blue-200">
                  @{mentor.username}
                </p>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-100">
                Mentor Reputation
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <HeroMetric
                  label="Projects Guided"
                  value={String(projectsGuided)}
                />
                <HeroMetric
                  label="Rating"
                  value={`${Number(mentor.mentorRating || 0).toFixed(1)} ⭐`}
                />
                <HeroMetric
                  label="Points"
                  value={String(mentor.mentorshipPoints || 0)}
                />
                <HeroMetric
                  label="Reviews"
                  value={String(mentor.mentorRatingCount || reviewsCount)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                About Mentor
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-950">
                Professional Guidance Profile
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
                {mentor.bio ||
                  "This mentor has not added a full bio yet, but is approved on BuildUp and available to guide volunteers on active projects."}
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <InfoCard
                  label="Experience"
                  value={mentor.experience ? `${mentor.experience} years` : "N/A"}
                />
                <InfoCard label="Country" value={mentor.country || "Not specified"} />
                <InfoCard
                  label="Mentor Level"
                  value={getMentorLevelTitle(mentor.mentorLevel)}
                />
              </div>
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                Skills & Expertise
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-950">
                Areas of Guidance
              </h2>

              {skills.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  No skills listed yet.
                </p>
              )}
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                Mentor Performance
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-950">
                Review Metrics
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard label="Guidance" value={guidanceAverage} />
                <MetricCard label="Communication" value={communicationAverage} />
                <MetricCard label="Availability" value={availabilityAverage} />
                <MetricCard label="Professionalism" value={professionalismAverage} />
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            {isCertified && (
              <section className="rounded-[32px] border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                  Certified Status
                </p>

                <h3 className="mt-3 text-2xl font-black text-emerald-950">
                  🎓 BuildUp Certified Mentor
                </h3>

                <p className="mt-3 text-sm leading-6 text-emerald-700">
                  This mentor has met BuildUp’s certification standards for
                  completed sessions, reviews, rating, professionalism, and
                  mentorship quality.
                </p>
              </section>
            )}

            <section className="rounded-[32px] border border-slate-900 bg-slate-950 p-6 text-white shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                BuildUp Mentor Badge
              </p>

              <h3 className="mt-3 text-2xl font-black">
                {getMentorLevelTitle(mentor.mentorLevel)}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                This mentor contributes to BuildUp by guiding volunteers through
                practical project experience and real-world delivery.
              </p>
            </section>

            <section className="rounded-[32px] border border-blue-100 bg-blue-50 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                Want Guidance?
              </p>

              <h3 className="mt-2 text-xl font-black text-slate-950">
                Request this mentor from your volunteer dashboard.
              </h3>

              <Link
                href="/dashboard/volunteer/mentors"
                className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Request Mentorship
              </Link>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-100">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}
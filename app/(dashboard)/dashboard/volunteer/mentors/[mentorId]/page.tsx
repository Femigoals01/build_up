



// import Image from "next/image";
// import Link from "next/link";
// import { notFound, redirect } from "next/navigation";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import MentorProfileActions from "@/components/mentorship/MentorProfileActions";

// export const dynamic = "force-dynamic";

// function getInitials(name: string) {
//   return name
//     .split(" ")
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((part) => part[0]?.toUpperCase())
//     .join("");
// }

// function parseSkills(skills: string | null) {
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

// function formatRating(value: number | null | undefined) {
//   return Number(value || 0).toFixed(1);
// }

// export default async function VolunteerMentorProfilePage({
//   params,
// }: {
//   params: { mentorId: string };
// }) {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id || session.user.role !== "VOLUNTEER") {
//     redirect("/login");
//   }

//   const mentor = await prisma.user.findFirst({
//     where: {
//       id: params.mentorId,
//       role: "MENTOR",
//     },
//     select: {
//       id: true,
//       name: true,
//       username: true,
//       email: true,
//       bio: true,
//       headline: true,
//       skills: true,
//       experience: true,
//       profileImageUrl: true,
//       rating: true,
//       ratingCount: true,
//       mentorRating: true,
//       mentorRatingCount: true,
//       mentorLevel: true,
//       mentorshipPoints: true,
//       badges: {
//         orderBy: {
//           createdAt: "desc",
//         },
//         take: 8,
//       },
//       mentorAvailabilities: {
//         where: {
//           isActive: true,
//         },
//         orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
//       },
//       mentorReviewsReceived: {
//         orderBy: {
//           createdAt: "desc",
//         },
//         take: 6,
//         include: {
//           volunteer: {
//             select: {
//               name: true,
//               profileImageUrl: true,
//             },
//           },
//           project: {
//             select: {
//               title: true,
//             },
//           },
//         },
//       },
//     },
//   });

//   if (!mentor) {
//     notFound();
//   }

//   const projects = await prisma.project.findMany({
//     where: {
//       applications: {
//         some: {
//           volunteerId: session.user.id,
//           status: {
//             in: ["ACCEPTED", "COMPLETED"],
//           },
//         },
//       },
//     },
//     select: {
//       id: true,
//       title: true,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });

//   const projectsGuided = await prisma.project.count({
//     where: {
//       mentorId: mentor.id,
//     },
//   });

//   const totalSessions = await prisma.mentorBooking.count({
//     where: {
//       mentorId: mentor.id,
//       status: {
//         not: "CANCELLED",
//       },
//     },
//   });

//   const confirmedSessions = await prisma.mentorBooking.count({
//     where: {
//       mentorId: mentor.id,
//       status: "CONFIRMED",
//     },
//   });

//   const successRate =
//     totalSessions > 0
//       ? Math.round((confirmedSessions / totalSessions) * 100)
//       : 0;

//   const skills = parseSkills(mentor.skills);
//   const displayRating = mentor.mentorRating || mentor.rating || 0;
//   const displayRatingCount =
//     mentor.mentorRatingCount || mentor.ratingCount || 0;

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-8 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-6xl space-y-6">
//         <div className="flex items-center justify-between gap-3">
//           <Link
//             href="/dashboard/volunteer/mentors"
//             className="text-sm font-bold text-blue-600 hover:text-blue-700"
//           >
//             ← Back to mentors
//           </Link>

//           {mentor.username && (
//             <Link
//               href={`/mentor/${mentor.username}`}
//               className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100"
//             >
//               View Public Profile
//             </Link>
//           )}
//         </div>

//         <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
//           <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 px-6 py-10 text-white sm:px-8">
//             <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

//             <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
//               <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
//                 <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-lg">
//                   {mentor.profileImageUrl ? (
//                     <Image
//                       src={mentor.profileImageUrl}
//                       alt={mentor.name}
//                       fill
//                       className="object-cover"
//                       sizes="96px"
//                     />
//                   ) : (
//                     <div className="flex h-full w-full items-center justify-center text-2xl font-black text-white">
//                       {getInitials(mentor.name)}
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">
//                     {getMentorLevelTitle(mentor.mentorLevel)}
//                   </p>

//                   <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
//                     {mentor.name}
//                   </h1>

//                   {mentor.headline && (
//                     <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
//                       {mentor.headline}
//                     </p>
//                   )}

//                   <div className="mt-4 flex flex-wrap gap-2">
//                     <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
//                       ⭐ {formatRating(displayRating)} rating
//                     </span>

//                     <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
//                       {displayRatingCount} review
//                       {displayRatingCount === 1 ? "" : "s"}
//                     </span>

//                     <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
//                       Level {mentor.mentorLevel}
//                     </span>

//                     <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
//                       {mentor.mentorshipPoints} points
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <MentorProfileActions mentorId={mentor.id} projects={projects} />
//             </div>
//           </div>

//           <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
//             <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
//               <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
//                 Projects Guided
//               </p>
//               <p className="mt-2 text-3xl font-black text-slate-900">
//                 {projectsGuided}
//               </p>
//             </div>

//             <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
//               <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
//                 Sessions
//               </p>
//               <p className="mt-2 text-3xl font-black text-slate-900">
//                 {totalSessions}
//               </p>
//             </div>

//             <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
//               <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
//                 Rating Count
//               </p>
//               <p className="mt-2 text-3xl font-black text-slate-900">
//                 {displayRatingCount}
//               </p>
//             </div>

//             <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
//               <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
//                 Success Rate
//               </p>
//               <p className="mt-2 text-3xl font-black text-slate-900">
//                 {successRate}%
//               </p>
//             </div>
//           </div>
//         </section>

//         <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
//           <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//             <h2 className="text-xl font-bold text-slate-900">About Mentor</h2>

//             <p className="mt-4 text-sm leading-7 text-slate-600">
//               {mentor.bio?.trim()
//                 ? mentor.bio
//                 : "This mentor has not added a detailed bio yet."}
//             </p>

//             <div className="mt-6 grid gap-4 sm:grid-cols-2">
//               <div className="rounded-3xl bg-slate-50 p-5">
//                 <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
//                   Experience
//                 </p>
//                 <p className="mt-2 text-base font-bold text-slate-900">
//                   {mentor.experience || "Not specified"} years
//                 </p>
//               </div>

//               <div className="rounded-3xl bg-slate-50 p-5">
//                 <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
//                   Public Handle
//                 </p>
//                 <p className="mt-2 text-base font-bold text-slate-900">
//                   {mentor.username ? `@${mentor.username}` : "Not set"}
//                 </p>
//               </div>
//             </div>
//           </section>

//           <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//             <h2 className="text-xl font-bold text-slate-900">
//               Availability Preview
//             </h2>

//             <div className="mt-4 space-y-3">
//               {mentor.mentorAvailabilities.length === 0 ? (
//                 <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-semibold text-slate-500">
//                   No office hours added yet.
//                 </div>
//               ) : (
//                 mentor.mentorAvailabilities.map((slot) => (
//                   <div
//                     key={slot.id}
//                     className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
//                   >
//                     <p className="text-sm font-bold text-slate-900">
//                       {slot.dayOfWeek}
//                     </p>

//                     <p className="mt-1 text-sm font-semibold text-slate-600">
//                       {slot.startTime} - {slot.endTime}
//                     </p>
//                   </div>
//                 ))
//               )}
//             </div>
//           </section>
//         </div>

//         <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//           <h2 className="text-xl font-bold text-slate-900">Skills</h2>

//           <div className="mt-4 flex flex-wrap gap-2">
//             {skills.length === 0 ? (
//               <p className="text-sm text-slate-500">No skills listed yet.</p>
//             ) : (
//               skills.map((skill) => (
//                 <span
//                   key={skill}
//                   className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"
//                 >
//                   {skill}
//                 </span>
//               ))
//             )}
//           </div>
//         </section>

//         <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//           <h2 className="text-xl font-bold text-slate-900">Badges</h2>

//           <div className="mt-4 flex flex-wrap gap-2">
//             {mentor.badges.length === 0 ? (
//               <p className="text-sm text-slate-500">No badges earned yet.</p>
//             ) : (
//               mentor.badges.map((badge) => (
//                 <span
//                   key={badge.id}
//                   title={badge.description}
//                   className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700"
//                 >
//                   {badge.icon} {badge.name}
//                 </span>
//               ))
//             )}
//           </div>
//         </section>

//         <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//           <h2 className="text-xl font-bold text-slate-900">Reviews</h2>

//           <div className="mt-5 space-y-4">
//             {mentor.mentorReviewsReceived.length === 0 ? (
//               <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm font-semibold text-slate-500">
//                 No mentor reviews yet.
//               </div>
//             ) : (
//               mentor.mentorReviewsReceived.map((review) => (
//                 <article
//                   key={review.id}
//                   className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
//                 >
//                   <div className="flex flex-wrap items-center justify-between gap-3">
//                     <div>
//                       <p className="font-bold text-slate-900">
//                         {review.volunteer.name}
//                       </p>

//                       <p className="mt-1 text-xs font-semibold text-slate-500">
//                         Project: {review.project.title}
//                       </p>
//                     </div>

//                     <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
//                       ⭐ {review.rating}/5
//                     </div>
//                   </div>

//                   <p className="mt-4 text-sm leading-6 text-slate-700">
//                     {review.comment}
//                   </p>

//                   <div className="mt-4 grid gap-2 sm:grid-cols-4">
//                     <span className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-600">
//                       Guidance: {review.guidance}/5
//                     </span>
//                     <span className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-600">
//                       Communication: {review.communication}/5
//                     </span>
//                     <span className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-600">
//                       Availability: {review.availability}/5
//                     </span>
//                     <span className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-600">
//                       Professionalism: {review.professionalism}/5
//                     </span>
//                   </div>
//                 </article>
//               ))
//             )}
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }





import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import MentorProfileActions from "@/components/mentorship/MentorProfileActions";

export const dynamic = "force-dynamic";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function parseSkills(skills: string | null) {
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

function formatRating(value: number | null | undefined) {
  return Number(value || 0).toFixed(1);
}

export default async function VolunteerMentorProfilePage({
  params,
}: {
  params: { mentorId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "VOLUNTEER") {
    redirect("/login");
  }

  const mentor = await prisma.user.findFirst({
    where: {
      id: params.mentorId,
      role: "MENTOR",
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      bio: true,
      headline: true,
      skills: true,
      experience: true,
      profileImageUrl: true,
      rating: true,
      ratingCount: true,
      mentorRating: true,
      mentorRatingCount: true,
      mentorLevel: true,
      mentorshipPoints: true,
      mentorCertifications: {
        where: {
          status: "APPROVED",
        },
        select: {
          id: true,
        },
        take: 1,
      },
      badges: {
        orderBy: {
          createdAt: "desc",
        },
        take: 8,
      },
      mentorAvailabilities: {
        where: {
          isActive: true,
        },
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      },
      mentorReviewsReceived: {
        orderBy: {
          createdAt: "desc",
        },
        take: 6,
        include: {
          volunteer: {
            select: {
              name: true,
              profileImageUrl: true,
            },
          },
          project: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  });

  if (!mentor) {
    notFound();
  }

  const projects = await prisma.project.findMany({
    where: {
      applications: {
        some: {
          volunteerId: session.user.id,
          status: {
            in: ["ACCEPTED", "COMPLETED"],
          },
        },
      },
    },
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const projectsGuided = await prisma.project.count({
    where: {
      mentorId: mentor.id,
    },
  });

  const totalSessions = await prisma.mentorBooking.count({
    where: {
      mentorId: mentor.id,
      status: {
        not: "CANCELLED",
      },
    },
  });

  const completedSessions = await prisma.mentorBooking.count({
    where: {
      mentorId: mentor.id,
      status: "COMPLETED",
    },
  });

  const successRate =
    totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

  const skills = parseSkills(mentor.skills);
  const displayRating = mentor.mentorRating || mentor.rating || 0;
  const displayRatingCount = mentor.mentorRatingCount || mentor.ratingCount || 0;
  const isCertified = mentor.mentorCertifications.length > 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/dashboard/volunteer/mentors"
            className="text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            ← Back to mentors
          </Link>

          {mentor.username && (
            <Link
              href={`/mentor/${mentor.username}`}
              className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100"
            >
              View Public Profile
            </Link>
          )}
        </div>

        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 px-6 py-10 text-white sm:px-8">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-lg">
                  {mentor.profileImageUrl ? (
                    <Image
                      src={mentor.profileImageUrl}
                      alt={mentor.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-black text-white">
                      {getInitials(mentor.name)}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-100">
                      {getMentorLevelTitle(mentor.mentorLevel)}
                    </span>

                    {isCertified && (
                      <span className="rounded-full border border-emerald-300/30 bg-emerald-400/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-100">
                        🎓 BuildUp Certified Mentor
                      </span>
                    )}
                  </div>

                  <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                    {mentor.name}
                  </h1>

                  {mentor.headline && (
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                      {mentor.headline}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                      ⭐ {formatRating(displayRating)} rating
                    </span>

                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                      {displayRatingCount} review
                      {displayRatingCount === 1 ? "" : "s"}
                    </span>

                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                      Level {mentor.mentorLevel}
                    </span>

                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                      {mentor.mentorshipPoints} points
                    </span>
                  </div>
                </div>
              </div>

              <MentorProfileActions mentorId={mentor.id} projects={projects} />
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
            <StatBox label="Projects Guided" value={String(projectsGuided)} />
            <StatBox label="Sessions" value={String(totalSessions)} />
            <StatBox label="Rating Count" value={String(displayRatingCount)} />
            <StatBox label="Success Rate" value={`${successRate}%`} />
          </div>
        </section>

        {isCertified && (
          <section className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Certified Status
            </p>

            <h2 className="mt-2 text-2xl font-black text-emerald-950">
              🎓 BuildUp Certified Mentor
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-emerald-700">
              This mentor has met BuildUp’s certification standards for
              completed sessions, reviews, rating, professionalism, and
              mentorship quality.
            </p>
          </section>
        )}

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">About Mentor</h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            {mentor.bio?.trim()
              ? mentor.bio
              : "This mentor has not added a detailed bio yet."}
          </p>
        </section>
      </div>
    </main>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
    </div>
  );
}
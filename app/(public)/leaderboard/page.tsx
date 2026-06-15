


// import Link from "next/link";
// import { prisma } from "@/lib/prisma";

// export const dynamic = "force-dynamic";

// type LeaderboardFilter = "all" | "top-rated" | "highest-points" | "most-badges";

// function getLevelTitle(level: number) {
//   if (level >= 5) return "BuildUp Master";
//   if (level >= 4) return "Elite Volunteer";
//   if (level >= 3) return "Experienced Contributor";
//   if (level >= 2) return "Rising Professional";
//   return "Emerging Talent";
// }

// function getRankBadge(index: number) {
//   if (index === 0) return "🥇";
//   if (index === 1) return "🥈";
//   if (index === 2) return "🥉";
//   return `#${index + 1}`;
// }

// function getRankStatus(index: number) {
//   if (index === 0) return "Top Contributor";
//   if (index <= 2) return "Elite Performer";
//   if (index <= 9) return "Top 10 Volunteer";
//   return "Ranked Volunteer";
// }

// function getFilterTitle(filter: LeaderboardFilter) {
//   if (filter === "top-rated") return "Top Rated Volunteers";
//   if (filter === "highest-points") return "Highest Points";
//   if (filter === "most-badges") return "Most Badges Earned";
//   return "Top BuildUp Volunteers";
// }

// export default async function LeaderboardPage({
//   searchParams,
// }: {
//   searchParams?: Promise<{ filter?: string }>;
// }) {
//   const resolvedSearchParams = searchParams ? await searchParams : {};
//   const rawFilter = resolvedSearchParams.filter || "all";

//   const activeFilter: LeaderboardFilter = [
//     "all",
//     "top-rated",
//     "highest-points",
//     "most-badges",
//   ].includes(rawFilter)
//     ? (rawFilter as LeaderboardFilter)
//     : "all";

//   const volunteers = await prisma.user.findMany({
//     where: { role: "VOLUNTEER" },
//     select: {
//       id: true,
//       name: true,
//       username: true,
//       profileImageUrl: true,
//       rating: true,
//       ratingCount: true,
//       level: true,
//       points: true,
//       badges: true,
//       portfolio: { select: { id: true } },
//     },
//     orderBy: [{ points: "desc" }, { rating: "desc" }],
//     take: 100,
//   });

//   const sortedVolunteers = [...volunteers].sort((a, b) => {
//     if (activeFilter === "top-rated") {
//       if (Number(b.rating || 0) !== Number(a.rating || 0)) {
//         return Number(b.rating || 0) - Number(a.rating || 0);
//       }

//       return Number(b.ratingCount || 0) - Number(a.ratingCount || 0);
//     }

//     if (activeFilter === "most-badges") {
//       const bBadges = b.badges?.length || 0;
//       const aBadges = a.badges?.length || 0;

//       if (bBadges !== aBadges) return bBadges - aBadges;

//       return Number(b.points || 0) - Number(a.points || 0);
//     }

//     return Number(b.points || 0) - Number(a.points || 0);
//   });

//   const topRatedCount = volunteers.filter(
//     (volunteer) => Number(volunteer.rating || 0) >= 4.5
//   ).length;

//   const totalBadges = volunteers.reduce(
//     (sum, volunteer) => sum + (volunteer.badges?.length || 0),
//     0
//   );

//   const filters: {
//     label: string;
//     value: LeaderboardFilter;
//     href: string;
//     count: number;
//   }[] = [
//     {
//       label: "All Volunteers",
//       value: "all",
//       href: "/leaderboard",
//       count: volunteers.length,
//     },
//     {
//       label: "Top Rated",
//       value: "top-rated",
//       href: "/leaderboard?filter=top-rated",
//       count: topRatedCount,
//     },
//     {
//       label: "Highest Points",
//       value: "highest-points",
//       href: "/leaderboard?filter=highest-points",
//       count: volunteers.length,
//     },
//     {
//       label: "Most Badges",
//       value: "most-badges",
//       href: "/leaderboard?filter=most-badges",
//       count: totalBadges,
//     },
//   ];

//   return (
//     <main className="min-h-screen bg-slate-50">
//       <section className="relative overflow-hidden bg-[linear-gradient(135deg,#020617_0%,#172554_45%,#2563eb_100%)]">
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%)]" />
//         <div className="absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

//         <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
//           <div className="max-w-3xl">
//             <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white shadow-sm backdrop-blur">
//               🏆 BuildUp Rankings
//             </div>

//             <h1 className="mt-7 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
//               Volunteer Leaderboard
//             </h1>

//             <p className="mt-5 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">
//               Recognizing the most active, trusted, and highly rated
//               contributors across the BuildUp ecosystem.
//             </p>
//           </div>
//         </div>
//       </section>

//       <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
//         <div className="grid gap-5 md:grid-cols-3">
//           <SummaryCard label="Ranked Volunteers" value={volunteers.length} />
//           <SummaryCard label="Total Badges Earned" value={totalBadges} />
//           <SummaryCard label="Community Excellence" value="100%" blue />
//         </div>
//       </section>

//       <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
//         <div className="mb-6 flex flex-wrap gap-2 rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm">
//           {filters.map((filter) => {
//             const active = activeFilter === filter.value;

//             return (
//               <Link
//                 key={filter.value}
//                 href={filter.href}
//                 className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-black transition ${
//                   active
//                     ? "bg-blue-600 text-white"
//                     : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
//                 }`}
//               >
//                 <span>{filter.label}</span>
//                 <span
//                   className={`rounded-full px-2 py-0.5 text-xs ${
//                     active
//                       ? "bg-white/20 text-white"
//                       : "bg-white text-slate-500"
//                   }`}
//                 >
//                   {filter.count}
//                 </span>
//               </Link>
//             );
//           })}
//         </div>

//         <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
//           <div className="border-b border-slate-200 bg-white px-5 py-6 sm:px-7">
//             <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
//               Global Rankings
//             </p>

//             <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
//               {getFilterTitle(activeFilter)}
//             </h2>
//           </div>

//           {sortedVolunteers.length === 0 ? (
//             <div className="px-6 py-16 text-center">
//               <p className="text-lg font-bold text-slate-800">
//                 No volunteers ranked yet.
//               </p>
//               <p className="mt-2 text-sm text-slate-500">
//                 Rankings will appear once volunteers start earning points.
//               </p>
//             </div>
//           ) : (
//             <div className="divide-y divide-slate-100">
//               {sortedVolunteers.map((volunteer, index) => (
//                 <div
//                   key={volunteer.id}
//                   className="group bg-white px-5 py-5 transition hover:bg-blue-50/40 sm:px-7"
//                 >
//                   <div className="grid gap-5 lg:grid-cols-[1fr_auto_auto] lg:items-center">
//                     <div className="flex min-w-0 items-center gap-4">
//                       <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-base font-black text-white shadow-sm">
//                         {getRankBadge(index)}
//                       </div>

//                       {volunteer.profileImageUrl ? (
//                         <img
//                           src={volunteer.profileImageUrl}
//                           alt={volunteer.name || "Volunteer"}
//                           className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-2 ring-white"
//                         />
//                       ) : (
//                         <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black text-white ring-2 ring-white">
//                           {(volunteer.name || "B").charAt(0).toUpperCase()}
//                         </div>
//                       )}

//                       <div className="min-w-0">
//                         <div className="flex flex-wrap items-center gap-2">
//                           <h3 className="truncate text-lg font-black text-slate-950">
//                             {volunteer.name || "BuildUp Volunteer"}
//                           </h3>

//                           <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
//                             {getRankStatus(index)}
//                           </span>
//                         </div>

//                         <p className="truncate text-sm font-bold text-blue-600">
//                           @{volunteer.username || "unknown"}
//                         </p>

//                         <p className="mt-1 text-sm font-medium text-slate-500">
//                           {getLevelTitle(volunteer.level || 1)}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[520px]">
//                       <Stat label="Level" value={`L${volunteer.level || 1}`} />
//                       <Stat
//                         label="Points"
//                         value={String(volunteer.points || 0)}
//                       />
//                       <Stat
//                         label="Rating"
//                         value={`${Number(volunteer.rating || 0).toFixed(1)} ⭐`}
//                       />
//                       <Stat
//                         label="Badges"
//                         value={String(volunteer.badges?.length || 0)}
//                       />
//                     </div>

//                     {volunteer.username ? (
//                       <Link
//                         href={`/portfolio/${volunteer.username}`}
//                         className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white shadow-sm transition hover:bg-blue-700"
//                       >
//                         View Portfolio
//                       </Link>
//                     ) : null}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>
//     </main>
//   );
// }

// function SummaryCard({
//   label,
//   value,
//   blue = false,
// }: {
//   label: string;
//   value: string | number;
//   blue?: boolean;
// }) {
//   return (
//     <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//       <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
//         {label}
//       </p>

//       <p
//         className={`mt-3 text-4xl font-black ${
//           blue ? "text-blue-600" : "text-slate-950"
//         }`}
//       >
//         {value}
//       </p>
//     </div>
//   );
// }

// function Stat({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
//       <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
//         {label}
//       </p>

//       <p className="mt-1 text-base font-black text-slate-950">{value}</p>
//     </div>
//   );
// }





import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type LeaderboardType = "volunteers" | "mentors";

type VolunteerFilter = "all" | "top-rated" | "highest-points" | "most-badges";

type MentorFilter =
  | "all"
  | "certified"
  | "available"
  | "top-rated"
  | "highest-points";

function getVolunteerLevelTitle(level: number) {
  if (level >= 5) return "BuildUp Master";
  if (level >= 4) return "Elite Volunteer";
  if (level >= 3) return "Experienced Contributor";
  if (level >= 2) return "Rising Professional";

  return "Emerging Talent";
}

function getMentorLevelTitle(level: number) {
  if (level >= 5) return "Mentor Master";
  if (level >= 4) return "Elite Mentor";
  if (level >= 3) return "Experienced Guide";
  if (level >= 2) return "Rising Mentor";

  return "New Mentor";
}

function getRankBadge(index: number) {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";

  return `#${index + 1}`;
}

function getVolunteerRankStatus(index: number) {
  if (index === 0) return "Top Contributor";
  if (index <= 2) return "Elite Performer";
  if (index <= 9) return "Top 10 Volunteer";

  return "Ranked Volunteer";
}

function getMentorRankStatus(index: number) {
  if (index === 0) return "Top Mentor";
  if (index <= 2) return "Elite Mentor";
  if (index <= 9) return "Top 10 Mentor";

  return "Ranked Mentor";
}

function getVolunteerFilterTitle(filter: VolunteerFilter) {
  if (filter === "top-rated") return "Top Rated Volunteers";
  if (filter === "highest-points") return "Highest Points";
  if (filter === "most-badges") return "Most Badges Earned";

  return "Top BuildUp Volunteers";
}

function getMentorFilterTitle(filter: MentorFilter) {
  if (filter === "certified") return "Certified Mentors";
  if (filter === "available") return "Available Mentors";
  if (filter === "top-rated") return "Top Rated Mentors";
  if (filter === "highest-points") return "Highest Mentorship Points";

  return "Top BuildUp Mentors";
}

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ type?: string; filter?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const activeType: LeaderboardType =
    resolvedSearchParams.type === "mentors" ? "mentors" : "volunteers";

  const rawFilter = resolvedSearchParams.filter || "all";

  const activeVolunteerFilter: VolunteerFilter = [
    "all",
    "top-rated",
    "highest-points",
    "most-badges",
  ].includes(rawFilter)
    ? (rawFilter as VolunteerFilter)
    : "all";

  const activeMentorFilter: MentorFilter = [
    "all",
    "certified",
    "available",
    "top-rated",
    "highest-points",
  ].includes(rawFilter)
    ? (rawFilter as MentorFilter)
    : "all";

  const [volunteers, mentors, completedBookings] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: "VOLUNTEER",
      },
      select: {
        id: true,
        name: true,
        username: true,
        profileImageUrl: true,
        rating: true,
        ratingCount: true,
        level: true,
        points: true,
        badges: true,
        portfolio: {
          select: {
            id: true,
          },
        },
      },
      orderBy: [{ points: "desc" }, { rating: "desc" }],
      take: 100,
    }),

    prisma.user.findMany({
      where: {
        role: "MENTOR",
        mentorStatus: "APPROVED",
        accountStatus: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        username: true,
        profileImageUrl: true,
        headline: true,
        mentorRating: true,
        mentorRatingCount: true,
        mentorLevel: true,
        mentorshipPoints: true,
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
        mentorAvailabilities: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
          },
        },
        mentoredProjects: {
          where: {
            status: "COMPLETED",
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: [
        {
          mentorshipPoints: "desc",
        },
        {
          mentorRating: "desc",
        },
        {
          mentorRatingCount: "desc",
        },
      ],
      take: 100,
    }),

    prisma.mentorBooking.findMany({
      where: {
        status: "COMPLETED",
      },
      select: {
        mentorId: true,
      },
    }),
  ]);

  const completedSessionsByMentor = completedBookings.reduce<
    Record<string, number>
  >((acc, booking) => {
    acc[booking.mentorId] = (acc[booking.mentorId] || 0) + 1;
    return acc;
  }, {});

  const sortedVolunteers = [...volunteers].sort((a, b) => {
    if (activeVolunteerFilter === "top-rated") {
      if (Number(b.rating || 0) !== Number(a.rating || 0)) {
        return Number(b.rating || 0) - Number(a.rating || 0);
      }

      return Number(b.ratingCount || 0) - Number(a.ratingCount || 0);
    }

    if (activeVolunteerFilter === "most-badges") {
      const bBadges = b.badges?.length || 0;
      const aBadges = a.badges?.length || 0;

      if (bBadges !== aBadges) return bBadges - aBadges;

      return Number(b.points || 0) - Number(a.points || 0);
    }

    return Number(b.points || 0) - Number(a.points || 0);
  });

  const filteredMentors = mentors
    .filter((mentor) => {
      if (activeMentorFilter === "certified") {
        return mentor.mentorCertifications.length > 0;
      }

      if (activeMentorFilter === "available") {
        return mentor.mentorAvailabilities.length > 0;
      }

      if (activeMentorFilter === "top-rated") {
        return mentor.mentorRating >= 4.5 && mentor.mentorRatingCount > 0;
      }

      return true;
    })
    .sort((a, b) => {
      if (activeMentorFilter === "top-rated") {
        if (Number(b.mentorRating || 0) !== Number(a.mentorRating || 0)) {
          return Number(b.mentorRating || 0) - Number(a.mentorRating || 0);
        }

        return (
          Number(b.mentorRatingCount || 0) -
          Number(a.mentorRatingCount || 0)
        );
      }

      return Number(b.mentorshipPoints || 0) - Number(a.mentorshipPoints || 0);
    });

  const volunteerTopRatedCount = volunteers.filter(
    (volunteer) => Number(volunteer.rating || 0) >= 4.5
  ).length;

  const volunteerTotalBadges = volunteers.reduce(
    (sum, volunteer) => sum + (volunteer.badges?.length || 0),
    0
  );

  const certifiedMentorCount = mentors.filter(
    (mentor) => mentor.mentorCertifications.length > 0
  ).length;

  const availableMentorCount = mentors.filter(
    (mentor) => mentor.mentorAvailabilities.length > 0
  ).length;

  const topRatedMentorCount = mentors.filter(
    (mentor) => mentor.mentorRating >= 4.5 && mentor.mentorRatingCount > 0
  ).length;

  const totalMentorReviews = mentors.reduce(
    (sum, mentor) => sum + mentor.mentorRatingCount,
    0
  );

  const totalMentorGuidedProjects = mentors.reduce(
    (sum, mentor) => sum + mentor.mentoredProjects.length,
    0
  );

  const totalCompletedMentorSessions = Object.values(
    completedSessionsByMentor
  ).reduce((sum, value) => sum + value, 0);

  const volunteerFilters: {
    label: string;
    value: VolunteerFilter;
    href: string;
    count: number;
  }[] = [
    {
      label: "All Volunteers",
      value: "all",
      href: "/leaderboard?type=volunteers",
      count: volunteers.length,
    },
    {
      label: "Top Rated",
      value: "top-rated",
      href: "/leaderboard?type=volunteers&filter=top-rated",
      count: volunteerTopRatedCount,
    },
    {
      label: "Highest Points",
      value: "highest-points",
      href: "/leaderboard?type=volunteers&filter=highest-points",
      count: volunteers.length,
    },
    {
      label: "Most Badges",
      value: "most-badges",
      href: "/leaderboard?type=volunteers&filter=most-badges",
      count: volunteerTotalBadges,
    },
  ];

  const mentorFilters: {
    label: string;
    value: MentorFilter;
    href: string;
    count: number;
  }[] = [
    {
      label: "All Mentors",
      value: "all",
      href: "/leaderboard?type=mentors",
      count: mentors.length,
    },
    {
      label: "Certified",
      value: "certified",
      href: "/leaderboard?type=mentors&filter=certified",
      count: certifiedMentorCount,
    },
    {
      label: "Available",
      value: "available",
      href: "/leaderboard?type=mentors&filter=available",
      count: availableMentorCount,
    },
    {
      label: "Top Rated",
      value: "top-rated",
      href: "/leaderboard?type=mentors&filter=top-rated",
      count: topRatedMentorCount,
    },
    {
      label: "Highest Points",
      value: "highest-points",
      href: "/leaderboard?type=mentors&filter=highest-points",
      count: mentors.length,
    },
  ];

  const currentFilters =
    activeType === "mentors" ? mentorFilters : volunteerFilters;

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#020617_0%,#172554_45%,#2563eb_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%)]" />
        <div className="absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white shadow-sm backdrop-blur">
              🏆 BuildUp Rankings
            </div>

            <h1 className="mt-7 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              {activeType === "mentors"
                ? "Mentor Leaderboard"
                : "Volunteer Leaderboard"}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">
              {activeType === "mentors"
                ? "Recognizing BuildUp mentors by mentorship points, ratings, certifications, availability, and completed guidance impact."
                : "Recognizing the most active, trusted, and highly rated contributors across the BuildUp ecosystem."}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-2 rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm">
          <Link
            href="/leaderboard?type=volunteers"
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition ${
              activeType === "volunteers"
                ? "bg-blue-600 text-white"
                : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
            }`}
          >
            🧑‍💻 Volunteers
          </Link>

          <Link
            href="/leaderboard?type=mentors"
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition ${
              activeType === "mentors"
                ? "bg-blue-600 text-white"
                : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
            }`}
          >
            🎓 Mentors
          </Link>
        </div>

        {activeType === "mentors" ? (
          <div className="grid gap-5 md:grid-cols-4">
            <SummaryCard label="Ranked Mentors" value={mentors.length} />
            <SummaryCard label="Certified Mentors" value={certifiedMentorCount} />
            <SummaryCard label="Mentor Reviews" value={totalMentorReviews} />
            <SummaryCard
              label="Completed Sessions"
              value={totalCompletedMentorSessions}
              blue
            />
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            <SummaryCard label="Ranked Volunteers" value={volunteers.length} />
            <SummaryCard label="Total Badges Earned" value={volunteerTotalBadges} />
            <SummaryCard label="Community Excellence" value="100%" blue />
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-2 rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm">
          {currentFilters.map((filter) => {
            const active =
              activeType === "mentors"
                ? activeMentorFilter === filter.value
                : activeVolunteerFilter === filter.value;

            return (
              <Link
                key={filter.value}
                href={filter.href}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-black transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <span>{filter.label}</span>

                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-white text-slate-500"
                  }`}
                >
                  {filter.count}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-white px-5 py-6 sm:px-7">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              Global Rankings
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              {activeType === "mentors"
                ? getMentorFilterTitle(activeMentorFilter)
                : getVolunteerFilterTitle(activeVolunteerFilter)}
            </h2>
          </div>

          {activeType === "mentors" ? (
            filteredMentors.length === 0 ? (
              <EmptyState
                title="No mentors ranked yet."
                text="Mentor rankings will appear once mentors start earning points, reviews, and completed sessions."
              />
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredMentors.map((mentor, index) => {
                  const isCertified = mentor.mentorCertifications.length > 0;
                  const hasAvailability = mentor.mentorAvailabilities.length > 0;
                  const projectsGuided = mentor.mentoredProjects.length;
                  const completedSessions =
                    completedSessionsByMentor[mentor.id] || 0;

                  return (
                    <div
                      key={mentor.id}
                      className="group bg-white px-5 py-5 transition hover:bg-blue-50/40 sm:px-7"
                    >
                      <div className="grid gap-5 lg:grid-cols-[1fr_auto_auto] lg:items-center">
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-base font-black text-white shadow-sm">
                            {getRankBadge(index)}
                          </div>

                          {mentor.profileImageUrl ? (
                            <img
                              src={mentor.profileImageUrl}
                              alt={mentor.name || "Mentor"}
                              className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-2 ring-white"
                            />
                          ) : (
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black text-white ring-2 ring-white">
                              {(mentor.name || "M").charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-lg font-black text-slate-950">
                                {mentor.name || "BuildUp Mentor"}
                              </h3>

                              <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                                {getMentorRankStatus(index)}
                              </span>

                              {isCertified && (
                                <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                                  🎓 Certified
                                </span>
                              )}

                              {hasAvailability && (
                                <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                                  🟢 Available
                                </span>
                              )}
                            </div>

                            <p className="truncate text-sm font-bold text-blue-600">
                              @{mentor.username || "unknown"}
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-500">
                              {mentor.headline ||
                                getMentorLevelTitle(mentor.mentorLevel || 1)}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 lg:w-[640px]">
                          <Stat
                            label="Level"
                            value={`L${mentor.mentorLevel || 1}`}
                          />

                          <Stat
                            label="Points"
                            value={String(mentor.mentorshipPoints || 0)}
                          />

                          <Stat
                            label="Rating"
                            value={`${Number(
                              mentor.mentorRating || 0
                            ).toFixed(1)} ⭐`}
                          />

                          <Stat
                            label="Projects"
                            value={String(projectsGuided)}
                          />

                          <Stat
                            label="Sessions"
                            value={String(completedSessions)}
                          />
                        </div>

                        {mentor.username ? (
                          <Link
                            href={`/mentor/${mentor.username}`}
                            className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white shadow-sm transition hover:bg-blue-700"
                          >
                            View Mentor
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : sortedVolunteers.length === 0 ? (
            <EmptyState
              title="No volunteers ranked yet."
              text="Rankings will appear once volunteers start earning points."
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {sortedVolunteers.map((volunteer, index) => (
                <div
                  key={volunteer.id}
                  className="group bg-white px-5 py-5 transition hover:bg-blue-50/40 sm:px-7"
                >
                  <div className="grid gap-5 lg:grid-cols-[1fr_auto_auto] lg:items-center">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-base font-black text-white shadow-sm">
                        {getRankBadge(index)}
                      </div>

                      {volunteer.profileImageUrl ? (
                        <img
                          src={volunteer.profileImageUrl}
                          alt={volunteer.name || "Volunteer"}
                          className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-2 ring-white"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black text-white ring-2 ring-white">
                          {(volunteer.name || "B").charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-lg font-black text-slate-950">
                            {volunteer.name || "BuildUp Volunteer"}
                          </h3>

                          <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                            {getVolunteerRankStatus(index)}
                          </span>
                        </div>

                        <p className="truncate text-sm font-bold text-blue-600">
                          @{volunteer.username || "unknown"}
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-500">
                          {getVolunteerLevelTitle(volunteer.level || 1)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[520px]">
                      <Stat label="Level" value={`L${volunteer.level || 1}`} />

                      <Stat
                        label="Points"
                        value={String(volunteer.points || 0)}
                      />

                      <Stat
                        label="Rating"
                        value={`${Number(volunteer.rating || 0).toFixed(
                          1
                        )} ⭐`}
                      />

                      <Stat
                        label="Badges"
                        value={String(volunteer.badges?.length || 0)}
                      />
                    </div>

                    {volunteer.username ? (
                      <Link
                        href={`/portfolio/${volunteer.username}`}
                        className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white shadow-sm transition hover:bg-blue-700"
                      >
                        View Portfolio
                      </Link>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  blue = false,
}: {
  label: string;
  value: string | number;
  blue?: boolean;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>

      <p
        className={`mt-3 text-4xl font-black ${
          blue ? "text-blue-600" : "text-slate-950"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-base font-black text-slate-950">{value}</p>
    </div>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="px-6 py-16 text-center">
      <p className="text-lg font-bold text-slate-800">{title}</p>
      <p className="mt-2 text-sm text-slate-500">{text}</p>
    </div>
  );
}
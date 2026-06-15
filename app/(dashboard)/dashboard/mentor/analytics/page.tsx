



// import Link from "next/link";
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export const dynamic = "force-dynamic";

// function average(values: number[]) {
//   if (values.length === 0) return 0;
//   return values.reduce((sum, value) => sum + value, 0) / values.length;
// }

// function formatNumber(value: number) {
//   return new Intl.NumberFormat("en").format(value);
// }

// function getLevelTitle(level: number) {
//   if (level >= 5) return "Mentor Master";
//   if (level >= 4) return "Elite Mentor";
//   if (level >= 3) return "Experienced Guide";
//   if (level >= 2) return "Rising Mentor";

//   return "New Mentor";
// }

// function getStatusStyle(status: string) {
//   if (status === "COMPLETED") {
//     return "border-blue-200 bg-blue-50 text-blue-700";
//   }

//   if (status === "CONFIRMED") {
//     return "border-emerald-200 bg-emerald-50 text-emerald-700";
//   }

//   if (status === "CANCELLED") {
//     return "border-red-200 bg-red-50 text-red-700";
//   }

//   return "border-amber-200 bg-amber-50 text-amber-700";
// }

// export default async function MentorAnalyticsPage() {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id || session.user.role !== "MENTOR") {
//     redirect("/login");
//   }

//   const [mentor, bookings, reviews, mentorRankings] = await Promise.all([
//     prisma.user.findUnique({
//       where: {
//         id: session.user.id,
//       },
//       select: {
//         id: true,
//         name: true,
//         username: true,
//         mentorRating: true,
//         mentorRatingCount: true,
//         mentorLevel: true,
//         mentorshipPoints: true,
//       },
//     }),

//     prisma.mentorBooking.findMany({
//       where: {
//         mentorId: session.user.id,
//       },
//       include: {
//         volunteer: {
//           select: {
//             name: true,
//             email: true,
//           },
//         },
//         project: {
//           select: {
//             title: true,
//           },
//         },
//       },
//       orderBy: {
//         date: "desc",
//       },
//     }),

//     prisma.mentorReview.findMany({
//       where: {
//         mentorId: session.user.id,
//       },
//       include: {
//         volunteer: {
//           select: {
//             name: true,
//           },
//         },
//         project: {
//           select: {
//             title: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     }),

//     prisma.user.findMany({
//       where: {
//         role: "MENTOR",
//         mentorStatus: "APPROVED",
//         accountStatus: "ACTIVE",
//       },
//       select: {
//         id: true,
//         mentorshipPoints: true,
//         mentorRating: true,
//         mentorRatingCount: true,
//       },
//       orderBy: [
//         {
//           mentorshipPoints: "desc",
//         },
//         {
//           mentorRating: "desc",
//         },
//         {
//           mentorRatingCount: "desc",
//         },
//       ],
//     }),
//   ]);

//   if (!mentor) {
//     redirect("/login");
//   }

//   const totalBookings = bookings.length;
//   const pendingBookings = bookings.filter(
//     (booking) => booking.status === "PENDING"
//   ).length;
//   const confirmedBookings = bookings.filter(
//     (booking) => booking.status === "CONFIRMED"
//   ).length;
//   const completedBookings = bookings.filter(
//     (booking) => booking.status === "COMPLETED"
//   ).length;
//   const cancelledBookings = bookings.filter(
//     (booking) => booking.status === "CANCELLED"
//   ).length;

//   const completionRate =
//     totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0;

//   const guidanceAverage = average(reviews.map((review) => review.guidance));
//   const communicationAverage = average(
//     reviews.map((review) => review.communication)
//   );
//   const availabilityAverage = average(
//     reviews.map((review) => review.availability)
//   );
//   const professionalismAverage = average(
//     reviews.map((review) => review.professionalism)
//   );

//   const mentorRank =
//     mentorRankings.findIndex((item) => item.id === mentor.id) + 1;

//   const recentReviews = reviews.slice(0, 5);
//   const recentBookings = bookings.slice(0, 5);

//   return (
//     <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-7xl space-y-8">
//         <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
//           <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 px-6 py-10 text-white sm:px-8">
//             <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
//               Mentor Analytics
//             </p>

//             <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
//               Your mentorship performance
//             </h1>

//             <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
//               Track your bookings, reviews, session completion, ranking,
//               mentorship points, and overall mentor growth.
//             </p>
//           </div>

//           <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-5 lg:p-8">
//             <StatCard
//               label="Average Rating"
//               value={Number(mentor.mentorRating || 0).toFixed(1)}
//               helper={`${mentor.mentorRatingCount} review${
//                 mentor.mentorRatingCount === 1 ? "" : "s"
//               }`}
//               icon="⭐"
//             />

//             <StatCard
//               label="Completed Sessions"
//               value={String(completedBookings)}
//               helper={`${completionRate}% completion rate`}
//               icon="✅"
//             />

//             <StatCard
//               label="Mentor Level"
//               value={String(mentor.mentorLevel)}
//               helper={getLevelTitle(mentor.mentorLevel)}
//               icon="🏆"
//             />

//             <StatCard
//               label="Points"
//               value={formatNumber(mentor.mentorshipPoints)}
//               helper="Mentorship points"
//               icon="⚡"
//             />

//             <StatCard
//               label="Rank"
//               value={mentorRank > 0 ? `#${mentorRank}` : "N/A"}
//               helper={`of ${mentorRankings.length} mentors`}
//               icon="📈"
//             />
//           </div>
//         </section>

//         <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
//           <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//             <div className="mb-6">
//               <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
//                 Booking Analytics
//               </p>

//               <h2 className="mt-2 text-2xl font-black text-slate-900">
//                 Session Overview
//               </h2>
//             </div>

//             <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
//               <MiniCard label="Total" value={totalBookings} />
//               <MiniCard label="Pending" value={pendingBookings} />
//               <MiniCard label="Confirmed" value={confirmedBookings} />
//               <MiniCard label="Completed" value={completedBookings} />
//               <MiniCard label="Cancelled" value={cancelledBookings} />
//             </div>

//             <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
//               <div className="flex items-center justify-between gap-4">
//                 <div>
//                   <p className="text-sm font-bold text-slate-900">
//                     Completion Rate
//                   </p>

//                   <p className="mt-1 text-sm text-slate-500">
//                     Percentage of bookings marked as completed.
//                   </p>
//                 </div>

//                 <p className="text-3xl font-black text-blue-700">
//                   {completionRate}%
//                 </p>
//               </div>

//               <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
//                 <div
//                   className="h-full rounded-full bg-blue-600"
//                   style={{ width: `${completionRate}%` }}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//             <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
//               Quick Actions
//             </p>

//             <h2 className="mt-2 text-2xl font-black text-slate-900">
//               Manage mentorship
//             </h2>

//             <div className="mt-6 grid gap-3">
//               <Link
//                 href="/dashboard/mentor/bookings"
//                 className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
//               >
//                 Manage Bookings
//               </Link>

//               <Link
//                 href="/dashboard/mentor/availability"
//                 className="inline-flex h-12 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700"
//               >
//                 Manage Availability
//               </Link>

//               <Link
//                 href="/dashboard/mentor/requests"
//                 className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
//               >
//                 View Mentorship Requests
//               </Link>
//             </div>
//           </div>
//         </section>

//         <section className="grid gap-6 lg:grid-cols-2">
//           <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//             <div className="mb-6">
//               <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
//                 Rating Breakdown
//               </p>

//               <h2 className="mt-2 text-2xl font-black text-slate-900">
//                 Mentor Performance
//               </h2>
//             </div>

//             <div className="space-y-4">
//               <PerformanceBar label="Guidance" value={guidanceAverage} />
//               <PerformanceBar
//                 label="Communication"
//                 value={communicationAverage}
//               />
//               <PerformanceBar
//                 label="Availability"
//                 value={availabilityAverage}
//               />
//               <PerformanceBar
//                 label="Professionalism"
//                 value={professionalismAverage}
//               />
//             </div>
//           </div>

//           <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//             <div className="mb-6">
//               <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
//                 Latest Activity
//               </p>

//               <h2 className="mt-2 text-2xl font-black text-slate-900">
//                 Recent Bookings
//               </h2>
//             </div>

//             {recentBookings.length === 0 ? (
//               <EmptyState text="No bookings yet." />
//             ) : (
//               <div className="space-y-3">
//                 {recentBookings.map((booking) => (
//                   <div
//                     key={booking.id}
//                     className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
//                   >
//                     <div className="flex flex-wrap items-center justify-between gap-3">
//                       <div>
//                         <p className="font-bold text-slate-900">
//                           {booking.volunteer.name}
//                         </p>

//                         <p className="mt-1 text-sm text-slate-500">
//                           {booking.project?.title || "No project linked"}
//                         </p>
//                       </div>

//                       <span
//                         className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
//                           booking.status
//                         )}`}
//                       >
//                         {booking.status}
//                       </span>
//                     </div>

//                     <p className="mt-3 text-sm font-semibold text-slate-600">
//                       {booking.startTime} - {booking.endTime}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </section>

//         <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
//             <div>
//               <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
//                 Volunteer Feedback
//               </p>

//               <h2 className="mt-2 text-2xl font-black text-slate-900">
//                 Recent Reviews
//               </h2>
//             </div>

//             <Link
//               href="/mentors"
//               className="text-sm font-bold text-blue-600 hover:text-blue-700"
//             >
//               View public rankings →
//             </Link>
//           </div>

//           {recentReviews.length === 0 ? (
//             <EmptyState text="No reviews received yet." />
//           ) : (
//             <div className="grid gap-4 md:grid-cols-2">
//               {recentReviews.map((review) => (
//                 <article
//                   key={review.id}
//                   className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
//                 >
//                   <div className="flex flex-wrap items-center justify-between gap-3">
//                     <div>
//                       <p className="font-black text-slate-900">
//                         {review.volunteer.name}
//                       </p>

//                       <p className="mt-1 text-sm text-slate-500">
//                         {review.project.title}
//                       </p>
//                     </div>

//                     <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
//                       ⭐ {review.rating}/5
//                     </div>
//                   </div>

//                   <p className="mt-4 text-sm leading-6 text-slate-700">
//                     {review.comment}
//                   </p>
//                 </article>
//               ))}
//             </div>
//           )}
//         </section>
//       </div>
//     </main>
//   );
// }

// function StatCard({
//   label,
//   value,
//   helper,
//   icon,
// }: {
//   label: string;
//   value: string;
//   helper: string;
//   icon: string;
// }) {
//   return (
//     <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
//       <div className="flex items-start justify-between gap-3">
//         <div>
//           <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
//             {label}
//           </p>

//           <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>

//           <p className="mt-1 text-sm font-semibold text-slate-500">{helper}</p>
//         </div>

//         <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// function MiniCard({ label, value }: { label: string; value: number }) {
//   return (
//     <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
//       <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
//         {label}
//       </p>

//       <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
//     </div>
//   );
// }

// function PerformanceBar({ label, value }: { label: string; value: number }) {
//   const percent = Math.min(Math.round((value / 5) * 100), 100);

//   return (
//     <div>
//       <div className="mb-2 flex items-center justify-between gap-3">
//         <p className="text-sm font-bold text-slate-700">{label}</p>
//         <p className="text-sm font-black text-slate-900">
//           {value.toFixed(1)}/5
//         </p>
//       </div>

//       <div className="h-3 overflow-hidden rounded-full bg-slate-100">
//         <div
//           className="h-full rounded-full bg-blue-600"
//           style={{ width: `${percent}%` }}
//         />
//       </div>
//     </div>
//   );
// }

// function EmptyState({ text }: { text: string }) {
//   return (
//     <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm font-semibold text-slate-500">
//       {text}
//     </div>
//   );
// }




import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en").format(value);
}

function getLevelTitle(level: number) {
  if (level >= 5) return "Mentor Master";
  if (level >= 4) return "Elite Mentor";
  if (level >= 3) return "Experienced Guide";
  if (level >= 2) return "Rising Mentor";

  return "New Mentor";
}

function getRewardTier(points: number) {
  if (points >= 5000) {
    return {
      name: "Platinum Mentor",
      icon: "💎",
      currentMin: 5000,
      nextMin: 5000,
      nextName: "Top Tier Reached",
      benefits: [
        "Maximum mentor visibility",
        "Priority ranking boost",
        "Elite mentor recognition",
        "Featured public profile",
      ],
    };
  }

  if (points >= 3000) {
    return {
      name: "Gold Mentor",
      icon: "🥇",
      currentMin: 3000,
      nextMin: 5000,
      nextName: "Platinum Mentor",
      benefits: [
        "High mentor visibility",
        "Leaderboard ranking boost",
        "Advanced trust badge",
      ],
    };
  }

  if (points >= 1500) {
    return {
      name: "Silver Mentor",
      icon: "🥈",
      currentMin: 1500,
      nextMin: 3000,
      nextName: "Gold Mentor",
      benefits: [
        "Improved mentor visibility",
        "Recognized mentor badge",
        "Higher trust signals",
      ],
    };
  }

  if (points >= 500) {
    return {
      name: "Bronze Mentor",
      icon: "🥉",
      currentMin: 500,
      nextMin: 1500,
      nextName: "Silver Mentor",
      benefits: [
        "Starter mentor recognition",
        "Basic leaderboard visibility",
        "Progress badge",
      ],
    };
  }

  return {
    name: "Starter Mentor",
    icon: "🌱",
    currentMin: 0,
    nextMin: 500,
    nextName: "Bronze Mentor",
    benefits: [
      "Begin earning mentor points",
      "Build verified reviews",
      "Unlock mentor badges",
    ],
  };
}

function getStatusStyle(status: string) {
  if (status === "COMPLETED") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (status === "CONFIRMED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "CANCELLED") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

export default async function MentorAnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "MENTOR") {
    redirect("/login");
  }

  const [mentor, bookings, reviews, mentorRankings] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        username: true,
        mentorRating: true,
        mentorRatingCount: true,
        mentorLevel: true,
        mentorshipPoints: true,
        badges: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            name: true,
            description: true,
            icon: true,
            category: true,
          },
        },
      },
    }),

    prisma.mentorBooking.findMany({
      where: {
        mentorId: session.user.id,
      },
      include: {
        volunteer: {
          select: {
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    }),

    prisma.mentorReview.findMany({
      where: {
        mentorId: session.user.id,
      },
      include: {
        volunteer: {
          select: {
            name: true,
          },
        },
        project: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.user.findMany({
      where: {
        role: "MENTOR",
        mentorStatus: "APPROVED",
        accountStatus: "ACTIVE",
      },
      select: {
        id: true,
        mentorshipPoints: true,
        mentorRating: true,
        mentorRatingCount: true,
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
    }),
  ]);

  if (!mentor) {
    redirect("/login");
  }

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "PENDING"
  ).length;
  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "CONFIRMED"
  ).length;
  const completedBookings = bookings.filter(
    (booking) => booking.status === "COMPLETED"
  ).length;
  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "CANCELLED"
  ).length;

  const completionRate =
    totalBookings > 0
      ? Math.round((completedBookings / totalBookings) * 100)
      : 0;

  const guidanceAverage = average(reviews.map((review) => review.guidance));
  const communicationAverage = average(
    reviews.map((review) => review.communication)
  );
  const availabilityAverage = average(
    reviews.map((review) => review.availability)
  );
  const professionalismAverage = average(
    reviews.map((review) => review.professionalism)
  );

  const mentorRank =
    mentorRankings.findIndex((item) => item.id === mentor.id) + 1;

  const recentReviews = reviews.slice(0, 5);
  const recentBookings = bookings.slice(0, 5);

  const rewardTier = getRewardTier(mentor.mentorshipPoints);
  const pointsNeeded = Math.max(
    rewardTier.nextMin - mentor.mentorshipPoints,
    0
  );

  const rewardProgress =
    rewardTier.nextMin === rewardTier.currentMin
      ? 100
      : Math.min(
          Math.round(
            ((mentor.mentorshipPoints - rewardTier.currentMin) /
              (rewardTier.nextMin - rewardTier.currentMin)) *
              100
          ),
          100
        );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 px-6 py-10 text-white sm:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
              Mentor Analytics
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Your mentorship performance
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
              Track your bookings, reviews, session completion, rewards,
              ranking, mentorship points, and overall mentor growth.
            </p>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-5 lg:p-8">
            <StatCard
              label="Average Rating"
              value={Number(mentor.mentorRating || 0).toFixed(1)}
              helper={`${mentor.mentorRatingCount} review${
                mentor.mentorRatingCount === 1 ? "" : "s"
              }`}
              icon="⭐"
            />

            <StatCard
              label="Completed Sessions"
              value={String(completedBookings)}
              helper={`${completionRate}% completion rate`}
              icon="✅"
            />

            <StatCard
              label="Mentor Level"
              value={String(mentor.mentorLevel)}
              helper={getLevelTitle(mentor.mentorLevel)}
              icon="🏆"
            />

            <StatCard
              label="Points"
              value={formatNumber(mentor.mentorshipPoints)}
              helper="Mentorship points"
              icon="⚡"
            />

            <StatCard
              label="Rank"
              value={mentorRank > 0 ? `#${mentorRank}` : "N/A"}
              helper={`of ${mentorRankings.length} mentors`}
              icon="📈"
            />
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                Mentor Rewards
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-900">
                Rewards & Milestones
              </h2>

              <div className="mt-6 rounded-[28px] border border-blue-100 bg-blue-50 p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-blue-700">
                      Current Reward Tier
                    </p>

                    <h3 className="mt-2 text-3xl font-black text-blue-950">
                      {rewardTier.icon} {rewardTier.name}
                    </h3>

                    <p className="mt-2 text-sm font-semibold text-blue-700">
                      {pointsNeeded === 0
                        ? "You have reached the highest reward tier."
                        : `${formatNumber(pointsNeeded)} points needed to reach ${
                            rewardTier.nextName
                          }.`}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-white px-5 py-4 text-center shadow-sm">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Progress
                    </p>

                    <p className="mt-1 text-3xl font-black text-slate-900">
                      {rewardProgress}%
                    </p>
                  </div>
                </div>

                <div className="mt-6 h-4 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${rewardProgress}%` }}
                  />
                </div>

                <div className="mt-3 flex justify-between text-xs font-bold text-blue-700">
                  <span>{formatNumber(rewardTier.currentMin)} pts</span>
                  <span>{formatNumber(rewardTier.nextMin)} pts</span>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Benefits Unlocked
              </p>

              <div className="mt-4 space-y-3">
                {rewardTier.benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700"
                  >
                    <span className="text-emerald-600">✓</span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Badges Earned
                </p>

                <h3 className="mt-1 text-xl font-black text-slate-900">
                  {mentor.badges.length} badge
                  {mentor.badges.length === 1 ? "" : "s"} unlocked
                </h3>
              </div>

              <Link
                href="/mentors"
                className="text-sm font-bold text-blue-600 hover:text-blue-700"
              >
                View public rankings →
              </Link>
            </div>

            {mentor.badges.length === 0 ? (
              <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm font-semibold text-slate-500">
                No badges yet. Complete sessions and earn reviews to unlock
                mentor badges.
              </div>
            ) : (
              <div className="mt-5 flex flex-wrap gap-3">
                {mentor.badges.map((badge) => (
                  <div
                    key={badge.id}
                    title={badge.description}
                    className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-black text-amber-700"
                  >
                    {badge.icon} {badge.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                Booking Analytics
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-900">
                Session Overview
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <MiniCard label="Total" value={totalBookings} />
              <MiniCard label="Pending" value={pendingBookings} />
              <MiniCard label="Confirmed" value={confirmedBookings} />
              <MiniCard label="Completed" value={completedBookings} />
              <MiniCard label="Cancelled" value={cancelledBookings} />
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Completion Rate
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Percentage of bookings marked as completed.
                  </p>
                </div>

                <p className="text-3xl font-black text-blue-700">
                  {completionRate}%
                </p>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
              Quick Actions
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900">
              Manage mentorship
            </h2>

            <div className="mt-6 grid gap-3">
              <Link
                href="/dashboard/mentor/bookings"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Manage Bookings
              </Link>

              <Link
                href="/dashboard/mentor/availability"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Manage Availability
              </Link>

              <Link
                href="/dashboard/mentor/requests"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                View Mentorship Requests
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                Rating Breakdown
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-900">
                Mentor Performance
              </h2>
            </div>

            <div className="space-y-4">
              <PerformanceBar label="Guidance" value={guidanceAverage} />
              <PerformanceBar
                label="Communication"
                value={communicationAverage}
              />
              <PerformanceBar
                label="Availability"
                value={availabilityAverage}
              />
              <PerformanceBar
                label="Professionalism"
                value={professionalismAverage}
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                Latest Activity
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-900">
                Recent Bookings
              </h2>
            </div>

            {recentBookings.length === 0 ? (
              <EmptyState text="No bookings yet." />
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-slate-900">
                          {booking.volunteer.name}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {booking.project?.title || "No project linked"}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-600">
                      {booking.startTime} - {booking.endTime}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                Volunteer Feedback
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-900">
                Recent Reviews
              </h2>
            </div>

            <Link
              href="/mentors"
              className="text-sm font-bold text-blue-600 hover:text-blue-700"
            >
              View public rankings →
            </Link>
          </div>

          {recentReviews.length === 0 ? (
            <EmptyState text="No reviews received yet." />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {recentReviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-black text-slate-900">
                        {review.volunteer.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {review.project.title}
                      </p>
                    </div>

                    <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                      ⭐ {review.rating}/5
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-700">
                    {review.comment}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  helper,
  icon,
}: {
  label: string;
  value: string;
  helper: string;
  icon: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>

          <p className="mt-1 text-sm font-semibold text-slate-500">{helper}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
}

function MiniCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function PerformanceBar({ label, value }: { label: string; value: number }) {
  const percent = Math.min(Math.round((value / 5) * 100), 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-700">{label}</p>

        <p className="text-sm font-black text-slate-900">
          {value.toFixed(1)}/5
        </p>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm font-semibold text-slate-500">
      {text}
    </div>
  );
}
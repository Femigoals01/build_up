




// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import StarRating from "@/components/StarRating";
// import RatingTrendChart from "@/components/RatingTrendChart";
// import PortfolioShare from "@/components/PortfolioShare";
// import SidebarShell from "@/components/sidebar/SidebarShell";
// import SidebarItem from "@/components/sidebar/SidebarItem";
// import StatsGrid from "@/components/stats/StatsGrid";
// import StatCard from "@/components/stats/StatCard";
// import ActionPanel from "@/components/dashboard/ActionPanel";
// import NotificationBell from "@/components/notifications/NotificationBell";
// import UnreadBadge from "@/components/chat/UnreadBadge";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// const BADGE_TIERS = [
//   { threshold: 1, name: "First Project Completed", icon: "🏅" },
//   { threshold: 5, name: "5 Projects Completed", icon: "🥉" },
//   { threshold: 10, name: "10 Projects Completed", icon: "🥈" },
//   { threshold: 20, name: "20 Projects Completed", icon: "🥇" },
// ] as const;

// type Star = 1 | 2 | 3 | 4 | 5;

// type Mentor = {
//   id: string;
//   name: string;
//   username: string;
//   skills: string | null;
//   experience: string | null;
//   rating: number;
//   ratingCount: number;
// };

// export default async function VolunteerDashboard() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
//     redirect("/login");
//   }

//   const notifications = await prisma.notification.findMany({
//     where: { userId: session.user.id },
//     orderBy: { createdAt: "desc" },
//     take: 5,
//   });

//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   const volunteer = await prisma.user.findUnique({
//     where: { id: session.user.id },
//     select: {
//       rating: true,
//       ratingCount: true,
//       username: true,
//       lastActivitySeenAt: true,
//       skills: true,
//     },
//   });

//   if (!volunteer?.username) redirect("/login");

//   const volunteerSkills =
//     typeof volunteer.skills === "string" && volunteer.skills.trim().length > 0
//       ? volunteer.skills
//           .split(",")
//           .map((skill) => skill.trim())
//           .filter(Boolean)
//       : [];

//   const lastSeen = volunteer.lastActivitySeenAt ?? new Date(0);
//   const safeRating = volunteer.rating ?? 0;
//   const safeRatingCount = volunteer.ratingCount ?? 0;

//   const portfolioUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portfolio/${volunteer.username}`;

//   const applications = await prisma.application.findMany({
//     where: { volunteerId: session.user.id },
//     include: {
//       project: {
//         include: {
//           organization: { select: { name: true } },
//           reviews: true,
//           mentor: {
//             select: {
//               id: true,
//               name: true,
//               username: true,
//               skills: true,
//               experience: true,
//               rating: true,
//               ratingCount: true,
//             },
//           },
//           chat: true,
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   });

//   const badges = await prisma.badge.findMany({
//     where: { userId: session.user.id },
//     orderBy: { createdAt: "asc" },
//   });

//   const earnedBadgeNames = new Set(badges.map((b) => b.name));

//   const ratingHistory = await prisma.review.findMany({
//     where: { volunteerId: session.user.id },
//     select: { rating: true, createdAt: true },
//     orderBy: { createdAt: "asc" },
//   });

//   const ratingTrend = ratingHistory.map((r) => ({
//     date: new Date(r.createdAt).toLocaleDateString("en-GB", {
//       day: "numeric",
//       month: "short",
//     }),
//     rating: r.rating,
//   }));

//   const starCounts: Record<Star, number> = {
//     5: 0,
//     4: 0,
//     3: 0,
//     2: 0,
//     1: 0,
//   };

//   ratingHistory.forEach((r) => {
//     starCounts[r.rating as Star]++;
//   });

//   const totalReviews = ratingHistory.length;

//   // const activeApps = applications.filter(
//   //   (a) => a.status === "ACCEPTED" && a.project.status === "OPEN"
//   // );


//   const activeApps = applications.filter(
//   (a) =>
//     a.status === "ACCEPTED" &&
//     (a.project.status === "OPEN" || a.project.status === "IN_PROGRESS")
// );



//   const pendingApps = applications.filter((a) => a.status === "PENDING");

//   const completedApps = applications.filter(
//     (a) => a.status === "COMPLETED" && a.project.status === "COMPLETED"
//   );

//   const completedCount = completedApps.length;

//   const hasAnyReview = completedApps.some((app) =>
//     app.project.reviews.some((r) => r.volunteerId === session.user.id)
//   );



//     const dashboardProjects = [...activeApps, ...pendingApps];

//   const openProjects = await prisma.project.findMany({
//     where: { status: "OPEN" },
//     include: {
//       organization: { select: { name: true } },
//     },
//   });

//   const recommendedProjects = openProjects
//     .map((project) => {
//       const matchedSkills = project.skills.filter((skill) =>
//         volunteerSkills.includes(skill)
//       );

//       return {
//         ...project,
//         matchScore: matchedSkills.length,
//         matchedSkills,
//       };
//     })
//     .filter((p) => p.matchScore > 0)
//     .sort((a, b) => b.matchScore - a.matchScore)
//     .slice(0, 4);

//   const activities = [
//     ...applications
//       .filter((a) => a.status === "ACCEPTED")
//       .map((a) => ({
//         id: `chat-${a.id}`,
//         title: "Project chat available",
//         description: a.project.title,
//         date: a.createdAt,
//         icon: "💬",
//       })),
//     ...applications.map((app) => ({
//       id: `app-${app.id}`,
//       title: "Application submitted",
//       description: app.project.title,
//       date: app.createdAt,
//       icon: "📨",
//     })),
//     ...completedApps.map((app) => ({
//       id: `completed-${app.id}`,
//       title: "Project completed",
//       description: app.project.title,
//       date: app.createdAt,
//       icon: "🏁",
//     })),
//     ...ratingHistory.map((r, i) => ({
//       id: `review-${i}`,
//       title: "New review received",
//       description: `${r.rating}★ rating`,
//       date: r.createdAt,
//       icon: "⭐",
//     })),
//     ...badges.map((b) => ({
//       id: `badge-${b.id}`,
//       title: "Badge earned",
//       description: b.name,
//       date: b.createdAt,
//       icon: b.icon,
//     })),
//   ]
//     .map((a) => ({ ...a, unread: a.date > lastSeen }))
//     .sort((a, b) => b.date.getTime() - a.date.getTime())
//     .slice(0, 8);

//   await prisma.user.update({
//     where: { id: session.user.id },
//     data: { lastActivitySeenAt: new Date() },
//   });

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
//       <SidebarShell>
//         <SidebarItem href="/dashboard" label="Dashboard" icon="🏠" active />
//         <SidebarItem href="/projects" label="Projects" icon="💼" />
//         <SidebarItem
//           href="/dashboard/volunteer/mentors"
//           label="Mentors"
//           icon="🧑‍🏫"
//         />
//         <SidebarItem href="/portfolio" label="Portfolio" icon="🌍" />
//         <SidebarItem
//           href="/dashboard/messages"
//           label={
//             <span className="flex items-center gap-2">
//               Messages
//               <UnreadBadge />
//             </span>
//           }
//           icon="💬"
//         />
//         <SidebarItem
//           href="/dashboard/volunteer/inbox"
//           label={
//             <span className="flex items-center gap-2">
//               Inbox
//               <UnreadBadge />
//             </span>
//           }
//           icon="📨"
//         />
//         <SidebarItem href="/dashboard/settings" label="Settings" icon="⚙️" />
//       </SidebarShell>

//       <main className="flex-1 px-6 md:px-10 py-8 md:py-10 space-y-10">
//         {/* HERO */}
//         <section className="relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 p-8 md:p-10 text-white shadow-xl shadow-blue-200/50">
//           <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
//           <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-indigo-300/20 blur-2xl" />

//           <div className="relative flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
//             <div className="max-w-2xl">
//               <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-blue-50">
//                 Volunteer dashboard
//               </span>

//               <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
//                 Welcome back, {session.user.name}
//               </h1>

//               <p className="mt-3 text-blue-100 max-w-xl leading-relaxed">
//                 Track your progress, manage your active work, monitor reviews,
//                 and continue building proof of experience through real projects.
//               </p>

//               <div className="mt-5 flex flex-wrap items-center gap-3">
//                 <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
//                   <StarRating rating={safeRating} />
//                   <span className="font-semibold">{safeRating.toFixed(1)} / 5</span>
//                   <span className="text-sm text-blue-100">
//                     ({safeRatingCount} reviews)
//                   </span>
//                 </div>

//                 <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-blue-50 backdrop-blur-sm">
//                   {completedCount} completed project{completedCount === 1 ? "" : "s"}
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center gap-4">
//               <NotificationBell
//                 notifications={notifications}
//                 unreadCount={unreadCount}
//               />
//               <PortfolioShare url={portfolioUrl} />
//             </div>
//           </div>
//         </section>

//         <ActionPanel
//           pending={pendingApps.length}
//           active={activeApps.length}
//           completed={completedCount}
//         />

//         {/* STATS */}
//         <StatsGrid>
//           <StatCard
//             title="Active Projects"
//             value={activeApps.length}
//             icon="🚀"
//             gradient="bg-gradient-to-r from-blue-500 to-indigo-500"
//             subtitle="Currently in progress"
//           />
//           <StatCard
//             title="Completed Projects"
//             value={completedApps.length}
//             icon="✅"
//             gradient="bg-gradient-to-r from-green-500 to-emerald-500"
//             subtitle="Successfully delivered"
//           />
//           <StatCard
//             title="Pending Applications"
//             value={pendingApps.length}
//             icon="⏳"
//             gradient="bg-gradient-to-r from-yellow-400 to-orange-500"
//             subtitle="Awaiting response"
//           />
//           <StatCard
//             title="Badges Earned"
//             value={badges.length}
//             icon="🏆"
//             gradient="bg-gradient-to-r from-purple-500 to-pink-500"
//             subtitle="Milestones unlocked"
//           />
//         </StatsGrid>

//         {/* TOP GRID */}
//         <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//           {/* RECOMMENDED PROJECTS */}
//           <div className="xl:col-span-2 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
//             <div className="flex items-start justify-between gap-4 mb-6">
//               <div>
//                 <h2 className="text-xl font-semibold tracking-tight">
//                   ✨ Recommended for You
//                 </h2>
//                 <p className="mt-1 text-sm text-gray-500">
//                   Projects matched to your current skill set.
//                 </p>
//               </div>
//               <a
//                 href="/projects"
//                 className="text-sm font-semibold text-blue-600 hover:underline"
//               >
//                 Explore all →
//               </a>
//             </div>

//             {recommendedProjects.length === 0 ? (
//               <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-gray-600">
//                 Add more skills to your profile to unlock better project
//                 recommendations.
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 {recommendedProjects.map((project) => (
//                   <div
//                     key={project.id}
//                     className="group rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition bg-white"
//                   >
//                     <div className="flex items-start justify-between gap-3">
//                       <div>
//                         <h3 className="font-semibold text-lg leading-snug group-hover:text-blue-600 transition">
//                           {project.title}
//                         </h3>
//                         <p className="text-sm text-gray-500 mt-1">
//                           {project.organization.name}
//                         </p>
//                       </div>

//                       <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 whitespace-nowrap">
//                         {project.matchScore} match
//                       </span>
//                     </div>

//                     <div className="flex flex-wrap gap-2 mt-4">
//                       {project.matchedSkills.map((skill) => (
//                         <span
//                           key={skill}
//                           className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium"
//                         >
//                           {skill}
//                         </span>
//                       ))}
//                     </div>

//                     <a
//                       href={`/projects/${project.id}`}
//                       className="inline-flex items-center mt-5 text-sm font-semibold text-blue-600 hover:underline"
//                     >
//                       View project →
//                     </a>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* ACTIVITY FEED */}
//           <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
//             <div className="mb-6">
//               <h2 className="text-xl font-semibold tracking-tight">
//                 📌 Recent Activity
//               </h2>
//               <p className="mt-1 text-sm text-gray-500">
//                 Your latest applications, reviews, chats, and badges.
//               </p>
//             </div>

//             <ol className="space-y-4">
//               {activities.length === 0 ? (
//                 <p className="text-sm text-gray-600">No recent activity yet.</p>
//               ) : (
//                 activities.map((a) => (
//                   <li
//                     key={a.id}
//                     className={`flex items-start gap-4 rounded-2xl p-4 border transition ${
//                       a.unread
//                         ? "bg-blue-50 border-blue-200"
//                         : "bg-gray-50 border-gray-100"
//                     }`}
//                   >
//                     <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
//                       {a.icon}
//                     </div>

//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium text-gray-900">{a.title}</p>
//                       <p className="text-sm text-gray-600">{a.description}</p>
//                     </div>

//                     {a.unread && (
//                       <span className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold text-white">
//                         NEW
//                       </span>
//                     )}
//                   </li>
//                 ))
//               )}
//             </ol>
//           </div>
//         </section>

//         {/* CURRENT PROJECTS */}
//         <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//             <div>
//               <h2 className="text-xl font-semibold tracking-tight">
//                 💼 Current Projects
//               </h2>
//               <p className="mt-1 text-sm text-gray-500">
//                 Your active and pending project engagements.
//               </p>
//             </div>

//             <a
//               href="/dashboard/projects"
//               className="text-sm font-semibold text-blue-600 hover:underline"
//             >
//               View all projects →
//             </a>
//           </div>

//           {dashboardProjects.length === 0 ? (
//             <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-gray-600">
//               No active or pending projects right now.
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//               {dashboardProjects.map((app) => {
//                 const project = app.project;
//                 // const isActive =
//                 //   app.status === "ACCEPTED" && project.status === "OPEN";

//                 const isActive =
//   app.status === "ACCEPTED" &&
//   (project.status === "OPEN" || project.status === "IN_PROGRESS");

//                 return (
//                   <div
//                     key={app.id}
//                     className="relative rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg transition"
//                   >
//                     <div
//                       className={`absolute left-0 top-5 bottom-5 w-1 rounded-full ${
//                         isActive ? "bg-blue-500" : "bg-yellow-500"
//                       }`}
//                     />

//                     <div className="pl-3">
//                       <div className="flex items-start justify-between gap-3">
//                         <div>
//                           <h3 className="font-semibold text-lg leading-snug">
//                             {project.title}
//                           </h3>
//                           <p className="text-sm text-gray-500 mt-1">
//                             {project.organization.name}
//                           </p>
//                         </div>

//                         <span
//                           className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
//                             isActive
//                               ? "bg-blue-50 text-blue-700"
//                               : "bg-yellow-50 text-yellow-700"
//                           }`}
//                         >
//                           {isActive ? "Active" : "Pending"}
//                         </span>
//                       </div>

//                       <MentorSection mentor={project.mentor} />

//                       {/* {isActive && project.chat && (
//                         <a
//                           href={`/dashboard/projects/${project.id}/chat`}
//                           className="relative mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition"
//                         >
//                           💬 Open project chat
//                           <UnreadBadge />
//                         </a>
//                       )} */}


//                       {isActive && (
//   <a
//     href={`/dashboard/projects/${project.id}/chat`}
//     className="relative mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline"
//   >
//     💬 Open project chat
//     <UnreadBadge />
//   </a>
// )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </section>

//         {/* ANALYTICS + BADGES (REARRANGED) */}
//         <section className="space-y-8">
//           {/* TOP ROW */}
//           <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//             {/* RATING TREND */}
//             <div className="xl:col-span-2 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
//               <div className="mb-6">
//                 <h2 className="text-xl font-semibold tracking-tight">
//                   📈 Rating Trend
//                 </h2>
//                 <p className="mt-1 text-sm text-gray-500">
//                   See how your ratings have changed over time.
//                 </p>
//               </div>
//               <RatingTrendChart data={ratingTrend} />
//             </div>

//             {/* RATING BREAKDOWN */}
//             <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
//               <div className="mb-6">
//                 <h2 className="text-xl font-semibold tracking-tight">
//                   Rating Breakdown
//                 </h2>
//                 <p className="mt-1 text-sm text-gray-500">
//                   Distribution of your review scores.
//                 </p>
//               </div>

//               {totalReviews === 0 ? (
//                 <p className="text-gray-600">No ratings yet.</p>
//               ) : (
//                 <div className="space-y-4">
//                   {[5, 4, 3, 2, 1].map((star) => {
//                     const count = starCounts[star as Star];
//                     const percentage = Math.round((count / totalReviews) * 100);

//                     return (
//                       <div key={star} className="flex items-center gap-4">
//                         <div className="w-20 text-sm font-medium text-yellow-500">
//                           {"★".repeat(star)}
//                           {"☆".repeat(5 - star)}
//                         </div>

//                         <div className="flex-1 h-3 rounded-full bg-gray-200 overflow-hidden">
//                           <div
//                             className="h-full rounded-full bg-yellow-400"
//                             style={{ width: `${percentage}%` }}
//                           />
//                         </div>

//                         <div className="w-10 text-sm text-gray-600 text-right">
//                           {count}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* BADGE PROGRESS */}
//           <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
//             <div className="mb-6">
//               <h2 className="text-xl font-semibold tracking-tight">
//                 🏆 Badge Progress
//               </h2>
//               <p className="mt-1 text-sm text-gray-500">
//                 Milestones unlocked through completed work and delivery.
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
//               {BADGE_TIERS.map((tier) => {
//                 const earned = earnedBadgeNames.has(tier.name);
//                 const progress = Math.min(
//                   (completedCount / tier.threshold) * 100,
//                   100
//                 );

//                 return (
//                   <div
//                     key={tier.name}
//                     className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
//                   >
//                     <div className="flex items-center justify-between gap-3 mb-4">
//                       <span className="text-2xl">{tier.icon}</span>
//                       <span
//                         className={`text-[11px] font-bold px-2 py-1 rounded-full ${
//                           earned
//                             ? "bg-green-100 text-green-700"
//                             : "bg-blue-100 text-blue-700"
//                         }`}
//                       >
//                         {earned ? "Earned" : `${Math.round(progress)}%`}
//                       </span>
//                     </div>

//                     <h3 className="text-sm font-semibold text-gray-900 min-h-[40px]">
//                       {tier.name}
//                     </h3>

//                     <p className="mt-2 text-xs text-gray-500">
//                       Target: {tier.threshold} completed project
//                       {tier.threshold === 1 ? "" : "s"}
//                     </p>

//                     <div className="mt-4 h-2 rounded-full bg-gray-200 overflow-hidden">
//                       <div
//                         className={`h-full rounded-full ${
//                           earned ? "bg-green-500" : "bg-blue-500"
//                         }`}
//                         style={{ width: `${progress}%` }}
//                       />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </section>

//         {/* REVIEWS */}
//         <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
//           <div className="mb-6">
//             <h2 className="text-xl font-semibold tracking-tight">⭐ Reviews</h2>
//             <p className="mt-1 text-sm text-gray-500">
//               Feedback from organizations on your completed work.
//             </p>
//           </div>

//           {!hasAnyReview ? (
//             <p className="text-gray-600">No reviews yet.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {completedApps
//                 .flatMap((app) =>
//                   app.project.reviews
//                     .filter((r) => r.volunteerId === session.user.id)
//                     .map((r) => ({
//                       ...r,
//                       organization: app.project.organization.name,
//                     }))
//                 )
//                 .slice(0, 4)
//                 .map((review) => (
//                   <div
//                     key={review.id}
//                     className="rounded-2xl border border-gray-200 bg-gray-50 p-6"
//                   >
//                     <StarRating rating={review.rating} />
//                     <p className="mt-4 italic text-gray-800 leading-relaxed">
//                       “{review.comment}”
//                     </p>
//                     <p className="mt-4 text-sm font-medium text-gray-500">
//                       — {review.organization}
//                     </p>
//                   </div>
//                 ))}
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }

// function MentorSection({ mentor }: { mentor: Mentor | null }) {
//   if (!mentor) {
//     return (
//       <p className="mt-4 text-sm text-gray-500 italic">
//         No mentor assigned yet
//       </p>
//     );
//   }

//   const mentorSkills =
//     typeof mentor.skills === "string" && mentor.skills.trim().length > 0
//       ? mentor.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
//       : [];

//   return (
//     <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
//       <div className="flex items-center justify-between gap-3">
//         <h4 className="font-semibold text-indigo-900">Assigned Mentor</h4>
//         <span className="rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white">
//           Active
//         </span>
//       </div>

//       <div className="mt-3">
//         <p className="font-semibold text-gray-900">{mentor.name}</p>
//         <p className="text-xs text-gray-600">
//           Experience: {mentor.experience ?? "N/A"} years
//         </p>
//       </div>

//       {mentorSkills.length > 0 && (
//         <div className="mt-3 flex flex-wrap gap-2">
//           {mentorSkills.map((skill) => (
//             <span
//               key={skill}
//               className="rounded-full border border-indigo-200 bg-white px-2.5 py-1 text-xs font-medium text-indigo-700"
//             >
//               {skill}
//             </span>
//           ))}
//         </div>
//       )}

//       <p className="mt-3 text-sm font-medium text-yellow-600">
//         ⭐ {mentor.rating.toFixed(1)} ({mentor.ratingCount})
//       </p>

//       <a
//         href={`/portfolio/${mentor.username}`}
//         className="mt-3 inline-block text-sm font-semibold text-indigo-700 hover:underline"
//       >
//         View mentor profile →
//       </a>
//     </div>
//   );
// }







// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import StarRating from "@/components/StarRating";
// import RatingTrendChart from "@/components/RatingTrendChart";
// import PortfolioShare from "@/components/PortfolioShare";
// import SidebarShell from "@/components/sidebar/SidebarShell";
// import SidebarItem from "@/components/sidebar/SidebarItem";
// import StatsGrid from "@/components/stats/StatsGrid";
// import StatCard from "@/components/stats/StatCard";
// import ActionPanel from "@/components/dashboard/ActionPanel";
// import NotificationBell from "@/components/notifications/NotificationBell";
// import UnreadBadge from "@/components/chat/UnreadBadge";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// const BADGE_TIERS = [
//   { threshold: 1, name: "First Project Completed", icon: "🏅" },
//   { threshold: 5, name: "5 Projects Completed", icon: "🥉" },
//   { threshold: 10, name: "10 Projects Completed", icon: "🥈" },
//   { threshold: 20, name: "20 Projects Completed", icon: "🥇" },
// ] as const;

// type Star = 1 | 2 | 3 | 4 | 5;

// type Mentor = {
//   id: string;
//   name: string;
//   username: string;
//   skills: string | null;
//   experience: string | null;
//   rating: number;
//   ratingCount: number;
// };

// export default async function VolunteerDashboard() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
//     redirect("/login");
//   }

//   const notifications = await prisma.notification.findMany({
//     where: { userId: session.user.id },
//     orderBy: { createdAt: "desc" },
//     take: 5,
//   });

//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   const volunteer = await prisma.user.findUnique({
//     where: { id: session.user.id },
//     select: {
//       rating: true,
//       ratingCount: true,
//       username: true,
//       lastActivitySeenAt: true,
//       skills: true,
//     },
//   });

//   if (!volunteer?.username) redirect("/login");

//   const volunteerSkills =
//     typeof volunteer.skills === "string" && volunteer.skills.trim().length > 0
//       ? volunteer.skills
//           .split(",")
//           .map((skill) => skill.trim())
//           .filter(Boolean)
//       : [];

//   const lastSeen = volunteer.lastActivitySeenAt ?? new Date(0);
//   const safeRating = volunteer.rating ?? 0;
//   const safeRatingCount = volunteer.ratingCount ?? 0;

//   const portfolioUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portfolio/${volunteer.username}`;

//   const applications = await prisma.application.findMany({
//     where: { volunteerId: session.user.id },
//     include: {
//       project: {
//         include: {
//           organization: { select: { name: true } },
//           reviews: true,
//           mentor: {
//             select: {
//               id: true,
//               name: true,
//               username: true,
//               skills: true,
//               experience: true,
//               rating: true,
//               ratingCount: true,
//             },
//           },
//           chat: true,
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   });

//   const badges = await prisma.badge.findMany({
//     where: { userId: session.user.id },
//     orderBy: { createdAt: "asc" },
//   });

//   const earnedBadgeNames = new Set(badges.map((b) => b.name));

//   const ratingHistory = await prisma.review.findMany({
//     where: { volunteerId: session.user.id },
//     select: { rating: true, createdAt: true },
//     orderBy: { createdAt: "asc" },
//   });

//   const ratingTrend = ratingHistory.map((r) => ({
//     date: new Date(r.createdAt).toLocaleDateString("en-GB", {
//       day: "numeric",
//       month: "short",
//     }),
//     rating: r.rating,
//   }));

//   const starCounts: Record<Star, number> = {
//     5: 0,
//     4: 0,
//     3: 0,
//     2: 0,
//     1: 0,
//   };

//   ratingHistory.forEach((r) => {
//     starCounts[r.rating as Star]++;
//   });

//   const totalReviews = ratingHistory.length;

//   const activeApps = applications.filter(
//     (a) =>
//       a.status === "ACCEPTED" &&
//       (a.project.status === "OPEN" || a.project.status === "IN_PROGRESS")
//   );

//   const pendingApps = applications.filter((a) => a.status === "PENDING");

//   const completedApps = applications.filter(
//     (a) => a.status === "COMPLETED" && a.project.status === "COMPLETED"
//   );

//   const completedCount = completedApps.length;

//   const hasAnyReview = completedApps.some((app) =>
//     app.project.reviews.some((r) => r.volunteerId === session.user.id)
//   );

//   const dashboardProjects = [...activeApps, ...pendingApps];

//   const openProjects = await prisma.project.findMany({
//     where: { status: "OPEN" },
//     include: {
//       organization: { select: { name: true } },
//     },
//   });

//   const recommendedProjects = openProjects
//     .map((project) => {
//       const matchedSkills = project.skills.filter((skill) =>
//         volunteerSkills.includes(skill)
//       );

//       return {
//         ...project,
//         matchScore: matchedSkills.length,
//         matchedSkills,
//       };
//     })
//     .filter((p) => p.matchScore > 0)
//     .sort((a, b) => b.matchScore - a.matchScore)
//     .slice(0, 4);

//   const activities = [
//     ...applications
//       .filter((a) => a.status === "ACCEPTED")
//       .map((a) => ({
//         id: `chat-${a.id}`,
//         title: "Project chat available",
//         description: a.project.title,
//         date: a.createdAt,
//         icon: "💬",
//       })),
//     ...applications.map((app) => ({
//       id: `app-${app.id}`,
//       title: "Application submitted",
//       description: app.project.title,
//       date: app.createdAt,
//       icon: "📨",
//     })),
//     ...completedApps.map((app) => ({
//       id: `completed-${app.id}`,
//       title: "Project completed",
//       description: app.project.title,
//       date: app.createdAt,
//       icon: "🏁",
//     })),
//     ...ratingHistory.map((r, i) => ({
//       id: `review-${i}`,
//       title: "New review received",
//       description: `${r.rating}★ rating`,
//       date: r.createdAt,
//       icon: "⭐",
//     })),
//     ...badges.map((b) => ({
//       id: `badge-${b.id}`,
//       title: "Badge earned",
//       description: b.name,
//       date: b.createdAt,
//       icon: b.icon,
//     })),
//   ]
//     .map((a) => ({ ...a, unread: a.date > lastSeen }))
//     .sort((a, b) => b.date.getTime() - a.date.getTime())
//     .slice(0, 8);

//   await prisma.user.update({
//     where: { id: session.user.id },
//     data: { lastActivitySeenAt: new Date() },
//   });

//   return (
//     <div className="flex h-screen min-h-0 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
//       <aside className="sticky top-0 h-screen w-[280px] shrink-0 overflow-y-auto border-r border-slate-200/70 bg-white/90 backdrop-blur">
//         <SidebarShell>
//           <SidebarItem href="/dashboard" label="Dashboard" icon="🏠" active />
//           <SidebarItem href="/projects" label="Projects" icon="💼" />
//           <SidebarItem
//             href="/dashboard/volunteer/mentors"
//             label="Mentors"
//             icon="🧑‍🏫"
//           />
//           <SidebarItem href="/portfolio" label="Portfolio" icon="🌍" />
//           <SidebarItem
//             href="/dashboard/messages"
//             label={
//               <span className="flex items-center gap-2">
//                 Messages
//                 <UnreadBadge />
//               </span>
//             }
//             icon="💬"
//           />
//           <SidebarItem
//             href="/dashboard/volunteer/inbox"
//             label={
//               <span className="flex items-center gap-2">
//                 Inbox
//                 <UnreadBadge />
//               </span>
//             }
//             icon="📨"
//           />
//           <SidebarItem href="/dashboard/settings" label="Settings" icon="⚙️" />
//         </SidebarShell>
//       </aside>

//       <main className="flex-1 min-h-0 overflow-y-auto px-6 md:px-10 py-8 md:py-10 space-y-10">
//         <section className="relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 p-8 md:p-10 text-white shadow-xl shadow-blue-200/50">
//           <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
//           <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-indigo-300/20 blur-2xl" />

//           <div className="relative flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
//             <div className="max-w-2xl">
//               <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-blue-50">
//                 Volunteer dashboard
//               </span>

//               <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
//                 Welcome back, {session.user.name}
//               </h1>

//               <p className="mt-3 text-blue-100 max-w-xl leading-relaxed">
//                 Track your progress, manage your active work, monitor reviews,
//                 and continue building proof of experience through real projects.
//               </p>

//               <div className="mt-5 flex flex-wrap items-center gap-3">
//                 <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
//                   <StarRating rating={safeRating} />
//                   <span className="font-semibold">{safeRating.toFixed(1)} / 5</span>
//                   <span className="text-sm text-blue-100">
//                     ({safeRatingCount} reviews)
//                   </span>
//                 </div>

//                 <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-blue-50 backdrop-blur-sm">
//                   {completedCount} completed project{completedCount === 1 ? "" : "s"}
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center gap-4">
//               <NotificationBell
//                 notifications={notifications}
//                 unreadCount={unreadCount}
//               />
//               <PortfolioShare url={portfolioUrl} />
//             </div>
//           </div>
//         </section>

//         <ActionPanel
//           pending={pendingApps.length}
//           active={activeApps.length}
//           completed={completedCount}
//         />

//         <StatsGrid>
//           <StatCard
//             title="Active Projects"
//             value={activeApps.length}
//             icon="🚀"
//             gradient="bg-gradient-to-r from-blue-500 to-indigo-500"
//             subtitle="Currently in progress"
//           />
//           <StatCard
//             title="Completed Projects"
//             value={completedApps.length}
//             icon="✅"
//             gradient="bg-gradient-to-r from-green-500 to-emerald-500"
//             subtitle="Successfully delivered"
//           />
//           <StatCard
//             title="Pending Applications"
//             value={pendingApps.length}
//             icon="⏳"
//             gradient="bg-gradient-to-r from-yellow-400 to-orange-500"
//             subtitle="Awaiting response"
//           />
//           <StatCard
//             title="Badges Earned"
//             value={badges.length}
//             icon="🏆"
//             gradient="bg-gradient-to-r from-purple-500 to-pink-500"
//             subtitle="Milestones unlocked"
//           />
//         </StatsGrid>

//         <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//           <div className="xl:col-span-2 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
//             <div className="flex items-start justify-between gap-4 mb-6">
//               <div>
//                 <h2 className="text-xl font-semibold tracking-tight">
//                   ✨ Recommended for You
//                 </h2>
//                 <p className="mt-1 text-sm text-gray-500">
//                   Projects matched to your current skill set.
//                 </p>
//               </div>
//               <a
//                 href="/projects"
//                 className="text-sm font-semibold text-blue-600 hover:underline"
//               >
//                 Explore all →
//               </a>
//             </div>

//             {recommendedProjects.length === 0 ? (
//               <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-gray-600">
//                 Add more skills to your profile to unlock better project
//                 recommendations.
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 {recommendedProjects.map((project) => (
//                   <div
//                     key={project.id}
//                     className="group rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition bg-white"
//                   >
//                     <div className="flex items-start justify-between gap-3">
//                       <div>
//                         <h3 className="font-semibold text-lg leading-snug group-hover:text-blue-600 transition">
//                           {project.title}
//                         </h3>
//                         <p className="text-sm text-gray-500 mt-1">
//                           {project.organization.name}
//                         </p>
//                       </div>

//                       <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 whitespace-nowrap">
//                         {project.matchScore} match
//                       </span>
//                     </div>

//                     <div className="flex flex-wrap gap-2 mt-4">
//                       {project.matchedSkills.map((skill) => (
//                         <span
//                           key={skill}
//                           className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium"
//                         >
//                           {skill}
//                         </span>
//                       ))}
//                     </div>

//                     <a
//                       href={`/projects/${project.id}`}
//                       className="inline-flex items-center mt-5 text-sm font-semibold text-blue-600 hover:underline"
//                     >
//                       View project →
//                     </a>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
//             <div className="mb-6">
//               <h2 className="text-xl font-semibold tracking-tight">
//                 📌 Recent Activity
//               </h2>
//               <p className="mt-1 text-sm text-gray-500">
//                 Your latest applications, reviews, chats, and badges.
//               </p>
//             </div>

//             <ol className="space-y-4">
//               {activities.length === 0 ? (
//                 <p className="text-sm text-gray-600">No recent activity yet.</p>
//               ) : (
//                 activities.map((a) => (
//                   <li
//                     key={a.id}
//                     className={`flex items-start gap-4 rounded-2xl p-4 border transition ${
//                       a.unread
//                         ? "bg-blue-50 border-blue-200"
//                         : "bg-gray-50 border-gray-100"
//                     }`}
//                   >
//                     <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
//                       {a.icon}
//                     </div>

//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium text-gray-900">{a.title}</p>
//                       <p className="text-sm text-gray-600">{a.description}</p>
//                     </div>

//                     {a.unread && (
//                       <span className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold text-white">
//                         NEW
//                       </span>
//                     )}
//                   </li>
//                 ))
//               )}
//             </ol>
//           </div>
//         </section>

//         <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//             <div>
//               <h2 className="text-xl font-semibold tracking-tight">
//                 💼 Current Projects
//               </h2>
//               <p className="mt-1 text-sm text-gray-500">
//                 Your active and pending project engagements.
//               </p>
//             </div>

//             <a
//               href="/dashboard/projects"
//               className="text-sm font-semibold text-blue-600 hover:underline"
//             >
//               View all projects →
//             </a>
//           </div>

//           {dashboardProjects.length === 0 ? (
//             <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-gray-600">
//               No active or pending projects right now.
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//               {dashboardProjects.map((app) => {
//                 const project = app.project;

//                 const isActive =
//                   app.status === "ACCEPTED" &&
//                   (project.status === "OPEN" || project.status === "IN_PROGRESS");

//                 return (
//                   <div
//                     key={app.id}
//                     className="relative rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg transition"
//                   >
//                     <div
//                       className={`absolute left-0 top-5 bottom-5 w-1 rounded-full ${
//                         isActive ? "bg-blue-500" : "bg-yellow-500"
//                       }`}
//                     />

//                     <div className="pl-3">
//                       <div className="flex items-start justify-between gap-3">
//                         <div>
//                           <h3 className="font-semibold text-lg leading-snug">
//                             {project.title}
//                           </h3>
//                           <p className="text-sm text-gray-500 mt-1">
//                             {project.organization.name}
//                           </p>
//                         </div>

//                         <span
//                           className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
//                             isActive
//                               ? "bg-blue-50 text-blue-700"
//                               : "bg-yellow-50 text-yellow-700"
//                           }`}
//                         >
//                           {isActive ? "Active" : "Pending"}
//                         </span>
//                       </div>

//                       <MentorSection mentor={project.mentor} />

//                       {isActive && (
//                         <a
//                           href={`/dashboard/projects/${project.id}/chat`}
//                           className="relative mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline"
//                         >
//                           💬 Open project chat
//                           <UnreadBadge />
//                         </a>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </section>

//         <section className="space-y-8">
//           <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//             <div className="xl:col-span-2 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
//               <div className="mb-6">
//                 <h2 className="text-xl font-semibold tracking-tight">
//                   📈 Rating Trend
//                 </h2>
//                 <p className="mt-1 text-sm text-gray-500">
//                   See how your ratings have changed over time.
//                 </p>
//               </div>
//               <RatingTrendChart data={ratingTrend} />
//             </div>

//             <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
//               <div className="mb-6">
//                 <h2 className="text-xl font-semibold tracking-tight">
//                   Rating Breakdown
//                 </h2>
//                 <p className="mt-1 text-sm text-gray-500">
//                   Distribution of your review scores.
//                 </p>
//               </div>

//               {totalReviews === 0 ? (
//                 <p className="text-gray-600">No ratings yet.</p>
//               ) : (
//                 <div className="space-y-4">
//                   {[5, 4, 3, 2, 1].map((star) => {
//                     const count = starCounts[star as Star];
//                     const percentage = Math.round((count / totalReviews) * 100);

//                     return (
//                       <div key={star} className="flex items-center gap-4">
//                         <div className="w-20 text-sm font-medium text-yellow-500">
//                           {"★".repeat(star)}
//                           {"☆".repeat(5 - star)}
//                         </div>

//                         <div className="flex-1 h-3 rounded-full bg-gray-200 overflow-hidden">
//                           <div
//                             className="h-full rounded-full bg-yellow-400"
//                             style={{ width: `${percentage}%` }}
//                           />
//                         </div>

//                         <div className="w-10 text-sm text-gray-600 text-right">
//                           {count}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
//             <div className="mb-6">
//               <h2 className="text-xl font-semibold tracking-tight">
//                 🏆 Badge Progress
//               </h2>
//               <p className="mt-1 text-sm text-gray-500">
//                 Milestones unlocked through completed work and delivery.
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
//               {BADGE_TIERS.map((tier) => {
//                 const earned = earnedBadgeNames.has(tier.name);
//                 const progress = Math.min(
//                   (completedCount / tier.threshold) * 100,
//                   100
//                 );

//                 return (
//                   <div
//                     key={tier.name}
//                     className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
//                   >
//                     <div className="flex items-center justify-between gap-3 mb-4">
//                       <span className="text-2xl">{tier.icon}</span>
//                       <span
//                         className={`text-[11px] font-bold px-2 py-1 rounded-full ${
//                           earned
//                             ? "bg-green-100 text-green-700"
//                             : "bg-blue-100 text-blue-700"
//                         }`}
//                       >
//                         {earned ? "Earned" : `${Math.round(progress)}%`}
//                       </span>
//                     </div>

//                     <h3 className="text-sm font-semibold text-gray-900 min-h-[40px]">
//                       {tier.name}
//                     </h3>

//                     <p className="mt-2 text-xs text-gray-500">
//                       Target: {tier.threshold} completed project
//                       {tier.threshold === 1 ? "" : "s"}
//                     </p>

//                     <div className="mt-4 h-2 rounded-full bg-gray-200 overflow-hidden">
//                       <div
//                         className={`h-full rounded-full ${
//                           earned ? "bg-green-500" : "bg-blue-500"
//                         }`}
//                         style={{ width: `${progress}%` }}
//                       />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </section>

//         <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
//           <div className="mb-6">
//             <h2 className="text-xl font-semibold tracking-tight">⭐ Reviews</h2>
//             <p className="mt-1 text-sm text-gray-500">
//               Feedback from organizations on your completed work.
//             </p>
//           </div>

//           {!hasAnyReview ? (
//             <p className="text-gray-600">No reviews yet.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {completedApps
//                 .flatMap((app) =>
//                   app.project.reviews
//                     .filter((r) => r.volunteerId === session.user.id)
//                     .map((r) => ({
//                       ...r,
//                       organization: app.project.organization.name,
//                     }))
//                 )
//                 .slice(0, 4)
//                 .map((review) => (
//                   <div
//                     key={review.id}
//                     className="rounded-2xl border border-gray-200 bg-gray-50 p-6"
//                   >
//                     <StarRating rating={review.rating} />
//                     <p className="mt-4 italic text-gray-800 leading-relaxed">
//                       “{review.comment}”
//                     </p>
//                     <p className="mt-4 text-sm font-medium text-gray-500">
//                       — {review.organization}
//                     </p>
//                   </div>
//                 ))}
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }

// function MentorSection({ mentor }: { mentor: Mentor | null }) {
//   if (!mentor) {
//     return (
//       <p className="mt-4 text-sm text-gray-500 italic">
//         No mentor assigned yet
//       </p>
//     );
//   }

//   const mentorSkills =
//     typeof mentor.skills === "string" && mentor.skills.trim().length > 0
//       ? mentor.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
//       : [];

//   return (
//     <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
//       <div className="flex items-center justify-between gap-3">
//         <h4 className="font-semibold text-indigo-900">Assigned Mentor</h4>
//         <span className="rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white">
//           Active
//         </span>
//       </div>

//       <div className="mt-3">
//         <p className="font-semibold text-gray-900">{mentor.name}</p>
//         <p className="text-xs text-gray-600">
//           Experience: {mentor.experience ?? "N/A"} years
//         </p>
//       </div>

//       {mentorSkills.length > 0 && (
//         <div className="mt-3 flex flex-wrap gap-2">
//           {mentorSkills.map((skill) => (
//             <span
//               key={skill}
//               className="rounded-full border border-indigo-200 bg-white px-2.5 py-1 text-xs font-medium text-indigo-700"
//             >
//               {skill}
//             </span>
//           ))}
//         </div>
//       )}

//       <p className="mt-3 text-sm font-medium text-yellow-600">
//         ⭐ {mentor.rating.toFixed(1)} ({mentor.ratingCount})
//       </p>

//       <a
//         href={`/portfolio/${mentor.username}`}
//         className="mt-3 inline-block text-sm font-semibold text-indigo-700 hover:underline"
//       >
//         View mentor profile →
//       </a>
//     </div>
//   );
// }







// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import StarRating from "@/components/StarRating";
// import RatingTrendChart from "@/components/RatingTrendChart";
// import PortfolioShare from "@/components/PortfolioShare";
// import SidebarShell from "@/components/sidebar/SidebarShell";
// import SidebarItem from "@/components/sidebar/SidebarItem";
// import StatsGrid from "@/components/stats/StatsGrid";
// import StatCard from "@/components/stats/StatCard";
// import ActionPanel from "@/components/dashboard/ActionPanel";
// import NotificationBell from "@/components/notifications/NotificationBell";
// import UnreadBadge from "@/components/chat/UnreadBadge";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// const BADGE_TIERS = [
//   { threshold: 1, name: "First Project Completed", icon: "🏅" },
//   { threshold: 5, name: "5 Projects Completed", icon: "🥉" },
//   { threshold: 10, name: "10 Projects Completed", icon: "🥈" },
//   { threshold: 20, name: "20 Projects Completed", icon: "🥇" },
// ] as const;

// type Star = 1 | 2 | 3 | 4 | 5;

// type Mentor = {
//   id: string;
//   name: string;
//   username: string;
//   skills: string | null;
//   experience: string | null;
//   rating: number;
//   ratingCount: number;
// };

// export default async function VolunteerDashboard() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
//     redirect("/login");
//   }

//   const notifications = await prisma.notification.findMany({
//     where: { userId: session.user.id },
//     orderBy: { createdAt: "desc" },
//     take: 5,
//   });

//   const unreadCount = notifications.filter((n) => !n.isRead).length;

//   const volunteer = await prisma.user.findUnique({
//     where: { id: session.user.id },
//     select: {
//       rating: true,
//       ratingCount: true,
//       username: true,
//       lastActivitySeenAt: true,
//       skills: true,
//     },
//   });

//   if (!volunteer?.username) redirect("/login");

//   const volunteerSkills =
//     typeof volunteer.skills === "string" && volunteer.skills.trim().length > 0
//       ? volunteer.skills
//           .split(",")
//           .map((skill) => skill.trim())
//           .filter(Boolean)
//       : [];

//   const lastSeen = volunteer.lastActivitySeenAt ?? new Date(0);
//   const safeRating = volunteer.rating ?? 0;
//   const safeRatingCount = volunteer.ratingCount ?? 0;

//   const portfolioUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portfolio/${volunteer.username}`;

//   const applications = await prisma.application.findMany({
//     where: { volunteerId: session.user.id },
//     include: {
//       project: {
//         include: {
//           organization: { select: { name: true } },
//           reviews: true,
//           mentor: {
//             select: {
//               id: true,
//               name: true,
//               username: true,
//               skills: true,
//               experience: true,
//               rating: true,
//               ratingCount: true,
//             },
//           },
//           chat: true,
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   });

//   const badges = await prisma.badge.findMany({
//     where: { userId: session.user.id },
//     orderBy: { createdAt: "asc" },
//   });

//   const earnedBadgeNames = new Set(badges.map((b) => b.name));

//   const ratingHistory = await prisma.review.findMany({
//     where: { volunteerId: session.user.id },
//     select: { rating: true, createdAt: true },
//     orderBy: { createdAt: "asc" },
//   });

//   const ratingTrend = ratingHistory.map((r) => ({
//     date: new Date(r.createdAt).toLocaleDateString("en-GB", {
//       day: "numeric",
//       month: "short",
//     }),
//     rating: r.rating,
//   }));

//   const starCounts: Record<Star, number> = {
//     5: 0,
//     4: 0,
//     3: 0,
//     2: 0,
//     1: 0,
//   };

//   ratingHistory.forEach((r) => {
//     starCounts[r.rating as Star]++;
//   });

//   const totalReviews = ratingHistory.length;

//   const activeApps = applications.filter(
//     (a) =>
//       a.status === "ACCEPTED" &&
//       (a.project.status === "OPEN" || a.project.status === "IN_PROGRESS")
//   );

//   const pendingApps = applications.filter((a) => a.status === "PENDING");

//   const completedApps = applications.filter(
//     (a) => a.status === "COMPLETED" && a.project.status === "COMPLETED"
//   );

//   const completedCount = completedApps.length;

//   const hasAnyReview = completedApps.some((app) =>
//     app.project.reviews.some((r) => r.volunteerId === session.user.id)
//   );

//   const dashboardProjects = [...activeApps, ...pendingApps];

//   const openProjects = await prisma.project.findMany({
//     where: { status: "OPEN" },
//     include: {
//       organization: { select: { name: true } },
//     },
//   });

//   const recommendedProjects = openProjects
//     .map((project) => {
//       const matchedSkills = project.skills.filter((skill) =>
//         volunteerSkills.includes(skill)
//       );

//       return {
//         ...project,
//         matchScore: matchedSkills.length,
//         matchedSkills,
//       };
//     })
//     .filter((p) => p.matchScore > 0)
//     .sort((a, b) => b.matchScore - a.matchScore)
//     .slice(0, 4);

//   const activities = [
//     ...applications
//       .filter((a) => a.status === "ACCEPTED")
//       .map((a) => ({
//         id: `chat-${a.id}`,
//         title: "Project chat available",
//         description: a.project.title,
//         date: a.createdAt,
//         icon: "💬",
//       })),
//     ...applications.map((app) => ({
//       id: `app-${app.id}`,
//       title: "Application submitted",
//       description: app.project.title,
//       date: app.createdAt,
//       icon: "📨",
//     })),
//     ...completedApps.map((app) => ({
//       id: `completed-${app.id}`,
//       title: "Project completed",
//       description: app.project.title,
//       date: app.createdAt,
//       icon: "🏁",
//     })),
//     ...ratingHistory.map((r, i) => ({
//       id: `review-${i}`,
//       title: "New review received",
//       description: `${r.rating}★ rating`,
//       date: r.createdAt,
//       icon: "⭐",
//     })),
//     ...badges.map((b) => ({
//       id: `badge-${b.id}`,
//       title: "Badge earned",
//       description: b.name,
//       date: b.createdAt,
//       icon: b.icon,
//     })),
//   ]
//     .map((a) => ({ ...a, unread: a.date > lastSeen }))
//     .sort((a, b) => b.date.getTime() - a.date.getTime())
//     .slice(0, 8);

//   await prisma.user.update({
//     where: { id: session.user.id },
//     data: { lastActivitySeenAt: new Date() },
//   });

//   return (
//     <div className="flex h-screen min-h-0 overflow-hidden overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
//       <aside className="sticky top-0 h-screen w-[280px] shrink-0 overflow-hidden border-r border-slate-200/70 bg-white/90 backdrop-blur">
//         <div className="h-full overflow-hidden">
//           <SidebarShell>
//             <SidebarItem href="/dashboard" label="Dashboard" icon="🏠" active />
//             <SidebarItem href="/projects" label="Projects" icon="💼" />
//             <SidebarItem
//               href="/dashboard/volunteer/mentors"
//               label="Mentors"
//               icon="🧑‍🏫"
//             />
//             <SidebarItem href="/portfolio" label="Portfolio" icon="🌍" />
//             <SidebarItem
//               href="/dashboard/messages"
//               label={
//                 <span className="flex items-center gap-2">
//                   Messages
//                   <UnreadBadge />
//                 </span>
//               }
//               icon="💬"
//             />
//             <SidebarItem
//               href="/dashboard/volunteer/inbox"
//               label={
//                 <span className="flex items-center gap-2">
//                   Inbox
//                   <UnreadBadge />
//                 </span>
//               }
//               icon="📨"
//             />
//             <SidebarItem href="/dashboard/settings" label="Settings" icon="⚙️" />
//           </SidebarShell>
//         </div>
//       </aside>

//       <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-6 md:px-10 py-8 md:py-10 space-y-10">
//         <section className="relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 p-8 md:p-10 text-white shadow-xl shadow-blue-200/50">
//           <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
//           <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-indigo-300/20 blur-2xl" />

//           <div className="relative flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
//             <div className="max-w-2xl">
//               <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-blue-50">
//                 Volunteer dashboard
//               </span>

//               <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
//                 Welcome back, {session.user.name}
//               </h1>

//               <p className="mt-3 text-blue-100 max-w-xl leading-relaxed">
//                 Track your progress, manage your active work, monitor reviews,
//                 and continue building proof of experience through real projects.
//               </p>

//               <div className="mt-5 flex flex-wrap items-center gap-3">
//                 <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
//                   <StarRating rating={safeRating} />
//                   <span className="font-semibold">{safeRating.toFixed(1)} / 5</span>
//                   <span className="text-sm text-blue-100">
//                     ({safeRatingCount} reviews)
//                   </span>
//                 </div>

//                 <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-blue-50 backdrop-blur-sm">
//                   {completedCount} completed project{completedCount === 1 ? "" : "s"}
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center gap-4">
//               <NotificationBell
//                 notifications={notifications}
//                 unreadCount={unreadCount}
//               />
//               <PortfolioShare url={portfolioUrl} />
//             </div>
//           </div>
//         </section>

//         <ActionPanel
//           pending={pendingApps.length}
//           active={activeApps.length}
//           completed={completedCount}
//         />

//         <StatsGrid>
//           <StatCard
//             title="Active Projects"
//             value={activeApps.length}
//             icon="🚀"
//             gradient="bg-gradient-to-r from-blue-500 to-indigo-500"
//             subtitle="Currently in progress"
//           />
//           <StatCard
//             title="Completed Projects"
//             value={completedApps.length}
//             icon="✅"
//             gradient="bg-gradient-to-r from-green-500 to-emerald-500"
//             subtitle="Successfully delivered"
//           />
//           <StatCard
//             title="Pending Applications"
//             value={pendingApps.length}
//             icon="⏳"
//             gradient="bg-gradient-to-r from-yellow-400 to-orange-500"
//             subtitle="Awaiting response"
//           />
//           <StatCard
//             title="Badges Earned"
//             value={badges.length}
//             icon="🏆"
//             gradient="bg-gradient-to-r from-purple-500 to-pink-500"
//             subtitle="Milestones unlocked"
//           />
//         </StatsGrid>

//         <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//           <div className="xl:col-span-2 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
//             <div className="flex items-start justify-between gap-4 mb-6">
//               <div>
//                 <h2 className="text-xl font-semibold tracking-tight">
//                   ✨ Recommended for You
//                 </h2>
//                 <p className="mt-1 text-sm text-gray-500">
//                   Projects matched to your current skill set.
//                 </p>
//               </div>
//               <a
//                 href="/projects"
//                 className="text-sm font-semibold text-blue-600 hover:underline"
//               >
//                 Explore all →
//               </a>
//             </div>

//             {recommendedProjects.length === 0 ? (
//               <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-gray-600">
//                 Add more skills to your profile to unlock better project
//                 recommendations.
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 {recommendedProjects.map((project) => (
//                   <div
//                     key={project.id}
//                     className="group rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition bg-white"
//                   >
//                     <div className="flex items-start justify-between gap-3">
//                       <div>
//                         <h3 className="font-semibold text-lg leading-snug group-hover:text-blue-600 transition">
//                           {project.title}
//                         </h3>
//                         <p className="text-sm text-gray-500 mt-1">
//                           {project.organization.name}
//                         </p>
//                       </div>

//                       <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 whitespace-nowrap">
//                         {project.matchScore} match
//                       </span>
//                     </div>

//                     <div className="flex flex-wrap gap-2 mt-4">
//                       {project.matchedSkills.map((skill) => (
//                         <span
//                           key={skill}
//                           className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium"
//                         >
//                           {skill}
//                         </span>
//                       ))}
//                     </div>

//                     <a
//                       href={`/projects/${project.id}`}
//                       className="inline-flex items-center mt-5 text-sm font-semibold text-blue-600 hover:underline"
//                     >
//                       View project →
//                     </a>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
//             <div className="mb-6">
//               <h2 className="text-xl font-semibold tracking-tight">
//                 📌 Recent Activity
//               </h2>
//               <p className="mt-1 text-sm text-gray-500">
//                 Your latest applications, reviews, chats, and badges.
//               </p>
//             </div>

//             <ol className="space-y-4">
//               {activities.length === 0 ? (
//                 <p className="text-sm text-gray-600">No recent activity yet.</p>
//               ) : (
//                 activities.map((a) => (
//                   <li
//                     key={a.id}
//                     className={`flex items-start gap-4 rounded-2xl p-4 border ${
//                       a.unread
//                         ? "bg-blue-50 border-blue-200"
//                         : "bg-gray-50 border-gray-100"
//                     }`}
//                   >
//                     <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
//                       {a.icon}
//                     </div>

//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium text-gray-900">{a.title}</p>
//                       <p className="text-sm text-gray-600">{a.description}</p>
//                     </div>

//                     {a.unread && (
//                       <span className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold text-white">
//                         NEW
//                       </span>
//                     )}
//                   </li>
//                 ))
//               )}
//             </ol>
//           </div>
//         </section>

//         <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//             <div>
//               <h2 className="text-xl font-semibold tracking-tight">
//                 💼 Current Projects
//               </h2>
//               <p className="mt-1 text-sm text-gray-500">
//                 Your active and pending project engagements.
//               </p>
//             </div>

//             <a
//               href="/dashboard/projects"
//               className="text-sm font-semibold text-blue-600 hover:underline"
//             >
//               View all projects →
//             </a>
//           </div>

//           {dashboardProjects.length === 0 ? (
//             <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-gray-600">
//               No active or pending projects right now.
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//               {dashboardProjects.map((app) => {
//                 const project = app.project;

//                 const isActive =
//                   app.status === "ACCEPTED" &&
//                   (project.status === "OPEN" || project.status === "IN_PROGRESS");

//                 return (
//                   <div
//                     key={app.id}
//                     className="relative rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg transition"
//                   >
//                     <div
//                       className={`absolute left-0 top-5 bottom-5 w-1 rounded-full ${
//                         isActive ? "bg-blue-500" : "bg-yellow-500"
//                       }`}
//                     />

//                     <div className="pl-3">
//                       <div className="flex items-start justify-between gap-3">
//                         <div>
//                           <h3 className="font-semibold text-lg leading-snug">
//                             {project.title}
//                           </h3>
//                           <p className="text-sm text-gray-500 mt-1">
//                             {project.organization.name}
//                           </p>
//                         </div>

//                         <span
//                           className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
//                             isActive
//                               ? "bg-blue-50 text-blue-700"
//                               : "bg-yellow-50 text-yellow-700"
//                           }`}
//                         >
//                           {isActive ? "Active" : "Pending"}
//                         </span>
//                       </div>

//                       <MentorSection mentor={project.mentor} />

//                       {isActive && (
//                         <a
//                           href={`/dashboard/projects/${project.id}/chat`}
//                           className="relative mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline"
//                         >
//                           💬 Open project chat
//                           <UnreadBadge />
//                         </a>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </section>

//         <section className="space-y-8">
//           <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//             <div className="xl:col-span-2 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
//               <div className="mb-6">
//                 <h2 className="text-xl font-semibold tracking-tight">
//                   📈 Rating Trend
//                 </h2>
//                 <p className="mt-1 text-sm text-gray-500">
//                   See how your ratings have changed over time.
//                 </p>
//               </div>
//               <RatingTrendChart data={ratingTrend} />
//             </div>

//             <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
//               <div className="mb-6">
//                 <h2 className="text-xl font-semibold tracking-tight">
//                   Rating Breakdown
//                 </h2>
//                 <p className="mt-1 text-sm text-gray-500">
//                   Distribution of your review scores.
//                 </p>
//               </div>

//               {totalReviews === 0 ? (
//                 <p className="text-gray-600">No ratings yet.</p>
//               ) : (
//                 <div className="space-y-4">
//                   {[5, 4, 3, 2, 1].map((star) => {
//                     const count = starCounts[star as Star];
//                     const percentage = Math.round((count / totalReviews) * 100);

//                     return (
//                       <div key={star} className="flex items-center gap-4">
//                         <div className="w-20 text-sm font-medium text-yellow-500">
//                           {"★".repeat(star)}
//                           {"☆".repeat(5 - star)}
//                         </div>

//                         <div className="flex-1 h-3 rounded-full bg-gray-200 overflow-hidden">
//                           <div
//                             className="h-full rounded-full bg-yellow-400"
//                             style={{ width: `${percentage}%` }}
//                           />
//                         </div>

//                         <div className="w-10 text-sm text-gray-600 text-right">
//                           {count}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
//             <div className="mb-6">
//               <h2 className="text-xl font-semibold tracking-tight">
//                 🏆 Badge Progress
//               </h2>
//               <p className="mt-1 text-sm text-gray-500">
//                 Milestones unlocked through completed work and delivery.
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
//               {BADGE_TIERS.map((tier) => {
//                 const earned = earnedBadgeNames.has(tier.name);
//                 const progress = Math.min(
//                   (completedCount / tier.threshold) * 100,
//                   100
//                 );

//                 return (
//                   <div
//                     key={tier.name}
//                     className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
//                   >
//                     <div className="flex items-center justify-between gap-3 mb-4">
//                       <span className="text-2xl">{tier.icon}</span>
//                       <span
//                         className={`text-[11px] font-bold px-2 py-1 rounded-full ${
//                           earned
//                             ? "bg-green-100 text-green-700"
//                             : "bg-blue-100 text-blue-700"
//                         }`}
//                       >
//                         {earned ? "Earned" : `${Math.round(progress)}%`}
//                       </span>
//                     </div>

//                     <h3 className="text-sm font-semibold text-gray-900 min-h-[40px]">
//                       {tier.name}
//                     </h3>

//                     <p className="mt-2 text-xs text-gray-500">
//                       Target: {tier.threshold} completed project
//                       {tier.threshold === 1 ? "" : "s"}
//                     </p>

//                     <div className="mt-4 h-2 rounded-full bg-gray-200 overflow-hidden">
//                       <div
//                         className={`h-full rounded-full ${
//                           earned ? "bg-green-500" : "bg-blue-500"
//                         }`}
//                         style={{ width: `${progress}%` }}
//                       />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </section>

//         <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
//           <div className="mb-6">
//             <h2 className="text-xl font-semibold tracking-tight">⭐ Reviews</h2>
//             <p className="mt-1 text-sm text-gray-500">
//               Feedback from organizations on your completed work.
//             </p>
//           </div>

//           {!hasAnyReview ? (
//             <p className="text-gray-600">No reviews yet.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {completedApps
//                 .flatMap((app) =>
//                   app.project.reviews
//                     .filter((r) => r.volunteerId === session.user.id)
//                     .map((r) => ({
//                       ...r,
//                       organization: app.project.organization.name,
//                     }))
//                 )
//                 .slice(0, 4)
//                 .map((review) => (
//                   <div
//                     key={review.id}
//                     className="rounded-2xl border border-gray-200 bg-gray-50 p-6"
//                   >
//                     <StarRating rating={review.rating} />
//                     <p className="mt-4 italic text-gray-800 leading-relaxed">
//                       “{review.comment}”
//                     </p>
//                     <p className="mt-4 text-sm font-medium text-gray-500">
//                       — {review.organization}
//                     </p>
//                   </div>
//                 ))}
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }

// function MentorSection({ mentor }: { mentor: Mentor | null }) {
//   if (!mentor) {
//     return (
//       <p className="mt-4 text-sm text-gray-500 italic">
//         No mentor assigned yet
//       </p>
//     );
//   }

//   const mentorSkills =
//     typeof mentor.skills === "string" && mentor.skills.trim().length > 0
//       ? mentor.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
//       : [];

//   return (
//     <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
//       <div className="flex items-center justify-between gap-3">
//         <h4 className="font-semibold text-indigo-900">Assigned Mentor</h4>
//         <span className="rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white">
//           Active
//         </span>
//       </div>

//       <div className="mt-3">
//         <p className="font-semibold text-gray-900">{mentor.name}</p>
//         <p className="text-xs text-gray-600">
//           Experience: {mentor.experience ?? "N/A"} years
//         </p>
//       </div>

//       {mentorSkills.length > 0 && (
//         <div className="mt-3 flex flex-wrap gap-2">
//           {mentorSkills.map((skill) => (
//             <span
//               key={skill}
//               className="rounded-full border border-indigo-200 bg-white px-2.5 py-1 text-xs font-medium text-indigo-700"
//             >
//               {skill}
//             </span>
//           ))}
//         </div>
//       )}

//       <p className="mt-3 text-sm font-medium text-yellow-600">
//         ⭐ {mentor.rating.toFixed(1)} ({mentor.ratingCount})
//       </p>

//       <a
//         href={`/portfolio/${mentor.username}`}
//         className="mt-3 inline-block text-sm font-semibold text-indigo-700 hover:underline"
//       >
//         View mentor profile →
//       </a>
//     </div>
//   );
// }






import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import StarRating from "@/components/StarRating";
import RatingTrendChart from "@/components/RatingTrendChart";
import PortfolioShare from "@/components/PortfolioShare";
import SidebarShell from "@/components/sidebar/SidebarShell";
import SidebarItem from "@/components/sidebar/SidebarItem";
import StatsGrid from "@/components/stats/StatsGrid";
import StatCard from "@/components/stats/StatCard";
import ActionPanel from "@/components/dashboard/ActionPanel";
import NotificationBell from "@/components/notifications/NotificationBell";
import UnreadBadge from "@/components/chat/UnreadBadge";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BADGE_TIERS = [
  { threshold: 1, name: "First Project Completed", icon: "🏅" },
  { threshold: 5, name: "5 Projects Completed", icon: "🥉" },
  { threshold: 10, name: "10 Projects Completed", icon: "🥈" },
  { threshold: 20, name: "20 Projects Completed", icon: "🥇" },
] as const;

type Star = 1 | 2 | 3 | 4 | 5;

type Mentor = {
  id: string;
  name: string;
  username: string;
  skills: string | null;
  experience: string | null;
  rating: number;
  ratingCount: number;
};

export default async function VolunteerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
    redirect("/login");
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const volunteer = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      rating: true,
      ratingCount: true,
      username: true,
      lastActivitySeenAt: true,
      skills: true,
      bio: true,
      experience: true,
    },
  });

  if (!volunteer?.username) redirect("/login");

  const portfolioCount = await prisma.portfolioItem.count({
    where: { volunteerId: session.user.id },
  });

  const volunteerSkills =
    typeof volunteer.skills === "string" && volunteer.skills.trim().length > 0
      ? volunteer.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : [];

  const lastSeen = volunteer.lastActivitySeenAt ?? new Date(0);
  const safeRating = volunteer.rating ?? 0;
  const safeRatingCount = volunteer.ratingCount ?? 0;

  const portfolioUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portfolio/${volunteer.username}`;

  const applications = await prisma.application.findMany({
    where: { volunteerId: session.user.id },
    include: {
      project: {
        include: {
          organization: { select: { name: true } },
          reviews: true,
          mentor: {
            select: {
              id: true,
              name: true,
              username: true,
              skills: true,
              experience: true,
              rating: true,
              ratingCount: true,
            },
          },
          chat: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const badges = await prisma.badge.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  });

  const earnedBadgeNames = new Set(badges.map((b) => b.name));

  const ratingHistory = await prisma.review.findMany({
    where: { volunteerId: session.user.id },
    select: { rating: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const ratingTrend = ratingHistory.map((r) => ({
    date: new Date(r.createdAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
    rating: r.rating,
  }));

  const starCounts: Record<Star, number> = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  ratingHistory.forEach((r) => {
    starCounts[r.rating as Star]++;
  });

  const totalReviews = ratingHistory.length;

  const activeApps = applications.filter(
    (a) =>
      a.status === "ACCEPTED" &&
      (a.project.status === "OPEN" || a.project.status === "IN_PROGRESS")
  );

  const pendingApps = applications.filter((a) => a.status === "PENDING");

  const completedApps = applications.filter(
    (a) => a.status === "COMPLETED" && a.project.status === "COMPLETED"
  );

  const completedCount = completedApps.length;

  const hasAnyReview = completedApps.some((app) =>
    app.project.reviews.some((r) => r.volunteerId === session.user.id)
  );

  const dashboardProjects = [...activeApps, ...pendingApps];

  const openProjects = await prisma.project.findMany({
    where: { status: "OPEN" },
    include: {
      organization: { select: { name: true } },
    },
  });

  const recommendedProjects = openProjects
    .map((project) => {
      const matchedSkills = project.skills.filter((skill) =>
        volunteerSkills.includes(skill)
      );

      return {
        ...project,
        matchScore: matchedSkills.length,
        matchedSkills,
      };
    })
    .filter((p) => p.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);

  const activities = [
    ...applications
      .filter((a) => a.status === "ACCEPTED")
      .map((a) => ({
        id: `chat-${a.id}`,
        title: "Project chat available",
        description: a.project.title,
        date: a.createdAt,
        icon: "💬",
      })),
    ...applications.map((app) => ({
      id: `app-${app.id}`,
      title: "Application submitted",
      description: app.project.title,
      date: app.createdAt,
      icon: "📨",
    })),
    ...completedApps.map((app) => ({
      id: `completed-${app.id}`,
      title: "Project completed",
      description: app.project.title,
      date: app.createdAt,
      icon: "🏁",
    })),
    ...ratingHistory.map((r, i) => ({
      id: `review-${i}`,
      title: "New review received",
      description: `${r.rating}★ rating`,
      date: r.createdAt,
      icon: "⭐",
    })),
    ...badges.map((b) => ({
      id: `badge-${b.id}`,
      title: "Badge earned",
      description: b.name,
      date: b.createdAt,
      icon: b.icon,
    })),
  ]
    .map((a) => ({ ...a, unread: a.date > lastSeen }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 8);

  const profileChecklist = [
    {
      label: "Username added",
      done: Boolean(volunteer.username?.trim()),
      href: "/dashboard/settings",
    },
    {
      label: "Bio completed",
      done: Boolean(volunteer.bio?.trim()),
      href: "/dashboard/settings",
    },
    {
      label: "Skills added",
      done: volunteerSkills.length > 0,
      href: "/dashboard/settings",
    },
    {
      label: "Experience added",
      done: Boolean(volunteer.experience?.trim()),
      href: "/dashboard/settings",
    },
    {
      label: "Portfolio item added",
      done: portfolioCount > 0,
      href: "/portfolio",
    },
  ];

  const completedProfileSteps = profileChecklist.filter((item) => item.done).length;
  const profileCompletion = Math.round(
    (completedProfileSteps / profileChecklist.length) * 100
  );
  const incompleteProfileSteps = profileChecklist.filter((item) => !item.done);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { lastActivitySeenAt: new Date() },
  });

  return (
    <div className="flex h-screen min-h-0 overflow-hidden overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
      <aside className="sticky top-0 h-screen w-[280px] shrink-0 overflow-hidden border-r border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="h-full overflow-hidden">
          <SidebarShell>
            <SidebarItem href="/dashboard" label="Dashboard" icon="🏠" active />
            <SidebarItem href="/projects" label="Projects" icon="💼" />
            <SidebarItem
              href="/dashboard/volunteer/mentors"
              label="Mentors"
              icon="🧑‍🏫"
            />
            <SidebarItem href="/portfolio" label="Portfolio" icon="🌍" />
            <SidebarItem
              href="/dashboard/messages"
              label={
                <span className="flex items-center gap-2">
                  Messages
                  <UnreadBadge />
                </span>
              }
              icon="💬"
            />
            <SidebarItem
              href="/dashboard/volunteer/inbox"
              label={
                <span className="flex items-center gap-2">
                  Inbox
                  <UnreadBadge />
                </span>
              }
              icon="📨"
            />
            <SidebarItem href="/dashboard/settings" label="Settings" icon="⚙️" />
          </SidebarShell>
        </div>
      </aside>

      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-6 md:px-10 py-8 md:py-10 space-y-10">
        <section className="relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 p-8 md:p-10 text-white shadow-xl shadow-blue-200/50">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-indigo-300/20 blur-2xl" />

          <div className="relative flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-blue-50">
                Volunteer dashboard
              </span>

              <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
                Welcome back, {session.user.name}
              </h1>

              <p className="mt-3 text-blue-100 max-w-xl leading-relaxed">
                Track your progress, manage your active work, monitor reviews,
                and continue building proof of experience through real projects.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <StarRating rating={safeRating} />
                  <span className="font-semibold">{safeRating.toFixed(1)} / 5</span>
                  <span className="text-sm text-blue-100">
                    ({safeRatingCount} reviews)
                  </span>
                </div>

                <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-blue-50 backdrop-blur-sm">
                  {completedCount} completed project{completedCount === 1 ? "" : "s"}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <NotificationBell
                notifications={notifications}
                unreadCount={unreadCount}
              />
              <PortfolioShare url={portfolioUrl} />
            </div>
          </div>
        </section>

        {/* PROFILE COMPLETION TRACKER */}
        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-xl font-semibold tracking-tight">
                ✅ Profile Completion
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                A stronger profile helps you get matched faster and present
                yourself better to organizations and mentors.
              </p>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Completion progress
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {profileCompletion}%
                  </span>
                </div>

                <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>

                <p className="mt-3 text-sm text-gray-600">
                  {completedProfileSteps} of {profileChecklist.length} profile steps completed
                </p>
              </div>
            </div>

            <div className="flex-1">
              <div className="grid gap-3">
                {profileChecklist.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
                      item.done
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {item.done ? "✅" : "⭕"}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          item.done ? "text-green-700" : "text-gray-700"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>

                    {!item.done && (
                      <a
                        href={item.href}
                        className="text-sm font-semibold text-blue-600 hover:underline"
                      >
                        Complete →
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {incompleteProfileSteps.length > 0 && (
                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4">
                  <p className="text-sm font-semibold text-blue-800">
                    Recommended next step
                  </p>
                  <p className="mt-1 text-sm text-blue-700">
                    Complete <strong>{incompleteProfileSteps[0].label}</strong> to improve your
                    visibility and project-readiness.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <ActionPanel
          pending={pendingApps.length}
          active={activeApps.length}
          completed={completedCount}
        />

        <StatsGrid>
          <StatCard
            title="Active Projects"
            value={activeApps.length}
            icon="🚀"
            gradient="bg-gradient-to-r from-blue-500 to-indigo-500"
            subtitle="Currently in progress"
          />
          <StatCard
            title="Completed Projects"
            value={completedApps.length}
            icon="✅"
            gradient="bg-gradient-to-r from-green-500 to-emerald-500"
            subtitle="Successfully delivered"
          />
          <StatCard
            title="Pending Applications"
            value={pendingApps.length}
            icon="⏳"
            gradient="bg-gradient-to-r from-yellow-400 to-orange-500"
            subtitle="Awaiting response"
          />
          <StatCard
            title="Badges Earned"
            value={badges.length}
            icon="🏆"
            gradient="bg-gradient-to-r from-purple-500 to-pink-500"
            subtitle="Milestones unlocked"
          />
        </StatsGrid>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  ✨ Recommended for You
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Projects matched to your current skill set.
                </p>
              </div>
              <a
                href="/projects"
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                Explore all →
              </a>
            </div>

            {recommendedProjects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-gray-600">
                Add more skills to your profile to unlock better project
                recommendations.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {recommendedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="group rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition bg-white"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-lg leading-snug group-hover:text-blue-600 transition">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {project.organization.name}
                        </p>
                      </div>

                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 whitespace-nowrap">
                        {project.matchScore} match
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.matchedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <a
                      href={`/projects/${project.id}`}
                      className="inline-flex items-center mt-5 text-sm font-semibold text-blue-600 hover:underline"
                    >
                      View project →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight">
                📌 Recent Activity
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Your latest applications, reviews, chats, and badges.
              </p>
            </div>

            <ol className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-sm text-gray-600">No recent activity yet.</p>
              ) : (
                activities.map((a) => (
                  <li
                    key={a.id}
                    className={`flex items-start gap-4 rounded-2xl p-4 border ${
                      a.unread
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-100"
                    }`}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
                      {a.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{a.title}</p>
                      <p className="text-sm text-gray-600">{a.description}</p>
                    </div>

                    {a.unread && (
                      <span className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold text-white">
                        NEW
                      </span>
                    )}
                  </li>
                ))
              )}
            </ol>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                💼 Current Projects
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Your active and pending project engagements.
              </p>
            </div>

            <a
              href="/dashboard/projects"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              View all projects →
            </a>
          </div>

          {dashboardProjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-gray-600">
              No active or pending projects right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {dashboardProjects.map((app) => {
                const project = app.project;

                const isActive =
                  app.status === "ACCEPTED" &&
                  (project.status === "OPEN" || project.status === "IN_PROGRESS");

                return (
                  <div
                    key={app.id}
                    className="relative rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg transition"
                  >
                    <div
                      className={`absolute left-0 top-5 bottom-5 w-1 rounded-full ${
                        isActive ? "bg-blue-500" : "bg-yellow-500"
                      }`}
                    />

                    <div className="pl-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-lg leading-snug">
                            {project.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {project.organization.name}
                          </p>
                        </div>

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            isActive
                              ? "bg-blue-50 text-blue-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {isActive ? "Active" : "Pending"}
                        </span>
                      </div>

                      <MentorSection mentor={project.mentor} />

                      {isActive && (
                        <a
                          href={`/dashboard/projects/${project.id}/chat`}
                          className="relative mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline"
                        >
                          💬 Open project chat
                          <UnreadBadge />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-semibold tracking-tight">
                  📈 Rating Trend
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  See how your ratings have changed over time.
                </p>
              </div>
              <RatingTrendChart data={ratingTrend} />
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-semibold tracking-tight">
                  Rating Breakdown
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Distribution of your review scores.
                </p>
              </div>

              {totalReviews === 0 ? (
                <p className="text-gray-600">No ratings yet.</p>
              ) : (
                <div className="space-y-4">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = starCounts[star as Star];
                    const percentage = Math.round((count / totalReviews) * 100);

                    return (
                      <div key={star} className="flex items-center gap-4">
                        <div className="w-20 text-sm font-medium text-yellow-500">
                          {"★".repeat(star)}
                          {"☆".repeat(5 - star)}
                        </div>

                        <div className="flex-1 h-3 rounded-full bg-gray-200 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-yellow-400"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <div className="w-10 text-sm text-gray-600 text-right">
                          {count}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight">
                🏆 Badge Progress
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Milestones unlocked through completed work and delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {BADGE_TIERS.map((tier) => {
                const earned = earnedBadgeNames.has(tier.name);
                const progress = Math.min(
                  (completedCount / tier.threshold) * 100,
                  100
                );

                return (
                  <div
                    key={tier.name}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
                  >
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="text-2xl">{tier.icon}</span>
                      <span
                        className={`text-[11px] font-bold px-2 py-1 rounded-full ${
                          earned
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {earned ? "Earned" : `${Math.round(progress)}%`}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-gray-900 min-h-[40px]">
                      {tier.name}
                    </h3>

                    <p className="mt-2 text-xs text-gray-500">
                      Target: {tier.threshold} completed project
                      {tier.threshold === 1 ? "" : "s"}
                    </p>

                    <div className="mt-4 h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          earned ? "bg-green-500" : "bg-blue-500"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold tracking-tight">⭐ Reviews</h2>
            <p className="mt-1 text-sm text-gray-500">
              Feedback from organizations on your completed work.
            </p>
          </div>

          {!hasAnyReview ? (
            <p className="text-gray-600">No reviews yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedApps
                .flatMap((app) =>
                  app.project.reviews
                    .filter((r) => r.volunteerId === session.user.id)
                    .map((r) => ({
                      ...r,
                      organization: app.project.organization.name,
                    }))
                )
                .slice(0, 4)
                .map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-6"
                  >
                    <StarRating rating={review.rating} />
                    <p className="mt-4 italic text-gray-800 leading-relaxed">
                      “{review.comment}”
                    </p>
                    <p className="mt-4 text-sm font-medium text-gray-500">
                      — {review.organization}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function MentorSection({ mentor }: { mentor: Mentor | null }) {
  if (!mentor) {
    return (
      <p className="mt-4 text-sm text-gray-500 italic">
        No mentor assigned yet
      </p>
    );
  }

  const mentorSkills =
    typeof mentor.skills === "string" && mentor.skills.trim().length > 0
      ? mentor.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
      : [];

  return (
    <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-semibold text-indigo-900">Assigned Mentor</h4>
        <span className="rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white">
          Active
        </span>
      </div>

      <div className="mt-3">
        <p className="font-semibold text-gray-900">{mentor.name}</p>
        <p className="text-xs text-gray-600">
          Experience: {mentor.experience ?? "N/A"} years
        </p>
      </div>

      {mentorSkills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {mentorSkills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-indigo-200 bg-white px-2.5 py-1 text-xs font-medium text-indigo-700"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <p className="mt-3 text-sm font-medium text-yellow-600">
        ⭐ {mentor.rating.toFixed(1)} ({mentor.ratingCount})
      </p>

      <a
        href={`/portfolio/${mentor.username}`}
        className="mt-3 inline-block text-sm font-semibold text-indigo-700 hover:underline"
      >
        View mentor profile →
      </a>
    </div>
  );
}
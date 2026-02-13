

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

/* ================= BADGE TIERS ================= */

const BADGE_TIERS = [
  { threshold: 1, name: "First Project Completed", icon: "🏅" },
  { threshold: 5, name: "5 Projects Completed", icon: "🥉" },
  { threshold: 10, name: "10 Projects Completed", icon: "🥈" },
  { threshold: 20, name: "20 Projects Completed", icon: "🥇" },
];

type Star = 1 | 2 | 3 | 4 | 5;

export default async function VolunteerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VOLUNTEER") {
    redirect("/login");
  }

  /* ================= NOTIFICATIONS ================= */

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  /* ================= VOLUNTEER ================= */

  const volunteer = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      rating: true,
      ratingCount: true,
      username: true,
      lastActivitySeenAt: true,
      skills: true,
    },
  });

  if (!volunteer?.username) redirect("/login");

  // const volunteerSkills = volunteer.skills ?? [];
  const volunteerSkills: string[] = Array.isArray(volunteer.skills)
  ? volunteer.skills
  : [];

  const lastSeen = volunteer.lastActivitySeenAt ?? new Date(0);

  const safeRating = volunteer.rating ?? 0;
  const safeRatingCount = volunteer.ratingCount ?? 0;

  const portfolioUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portfolio/${volunteer.username}`;

  /* ================= APPLICATIONS ================= */

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


  /* ================= BADGES ================= */

  const badges = await prisma.badge.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  });

  const earnedBadgeNames = new Set(badges.map((b) => b.name));

  /* ================= REVIEWS ================= */

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

  /* ================= STAR BREAKDOWN ================= */

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

  /* ================= DERIVED STATES ================= */

  const activeApps = applications.filter(
    (a) => a.status === "ACCEPTED" && a.project.status === "OPEN"
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

  /* ================= RECOMMENDED PROJECTS ================= */

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

  /* ================= ACTIVITY FEED ================= */

    


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

  await prisma.user.update({
    where: { id: session.user.id },
    data: { lastActivitySeenAt: new Date() },
  });

  /* ================= UI ================= */

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarShell>
        <SidebarItem href="/dashboard" label="Dashboard" icon="🏠" active />
        <SidebarItem href="/projects" label="Projects" icon="💼" />
         <SidebarItem href="/dashboard/volunteer/mentors" label="Mentors" icon="🧑‍🏫" />
        <SidebarItem href="/portfolio" label="Portfolio" icon="🌍" />
        {/* <SidebarItem href="/dashboard/messages" label="Messages" icon="💬" /> */}

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

        {/* <SidebarItem href="/dashboard/volunteer/inbox" label="Inbox" icon="📨" /> */}

        <SidebarItem href="/dashboard/volunteer/inbox" label = {<span className="flex items-center gap-2">
      Inbox
      <UnreadBadge />
    </span>
  }
  icon="📨"
/>


        <SidebarItem href="/dashboard/settings" label="Settings" icon="⚙️" />

      </SidebarShell>

      <main className="flex-1 px-10 py-10 space-y-12">

        {/* HERO */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {session.user.name}
              </h1>
              <div className="mt-4 flex items-center gap-3">
                <StarRating rating={safeRating} />
                <span className="font-semibold">
                  {safeRating.toFixed(1)} / 5
                </span>
                <span className="text-blue-200 text-sm">
                  ({safeRatingCount} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <NotificationBell
                notifications={notifications}
                unreadCount={unreadCount}
              />
              <PortfolioShare url={portfolioUrl} />
            </div>
          </div>
        </section>

        <ActionPanel
          pending={pendingApps.length}
          active={activeApps.length}
          completed={completedCount}
        />

        {/* STATS */}
        <StatsGrid>
          <StatCard title="Active Projects" value={activeApps.length} icon="🚀" gradient="bg-gradient-to-r from-blue-500 to-indigo-500" subtitle="Currently in progress" />
          <StatCard title="Completed Projects" value={completedApps.length} icon="✅" gradient="bg-gradient-to-r from-green-500 to-emerald-500" subtitle="Successfully delivered" />
          <StatCard title="Pending Applications" value={pendingApps.length} icon="⏳" gradient="bg-gradient-to-r from-yellow-400 to-orange-500" subtitle="Awaiting response" />
          <StatCard title="Badges Earned" value={badges.length} icon="🏆" gradient="bg-gradient-to-r from-purple-500 to-pink-500" subtitle="Milestones unlocked" />
        </StatsGrid>




        {/* ================= RECOMMENDED PROJECTS ================= */}
        <section className="bg-white border rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">
            ✨ Recommended for You
          </h2>

          {recommendedProjects.length === 0 ? (
            <p className="text-gray-600">
              Add more skills to your profile to unlock recommendations.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {recommendedProjects.map((project) => (
                <div key={project.id} className="border rounded-xl p-5 hover:shadow-lg transition">
                  <h3 className="font-semibold text-lg">{project.title}</h3>
                  <p className="text-sm text-gray-500">
                    {project.organization.name}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <p className="mt-3 text-xs font-medium text-green-600">
                    {project.matchScore} skill match
                  </p>

                  <a
                    href={`/projects/${project.id}`}
                    className="inline-block mt-4 text-sm font-medium text-blue-600 hover:underline"
                  >
                    View project →
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>

        

{/* ACTIVITY FEED */}
        <section className="bg-white border rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">📌 Recent Activity</h2>

          <ol className="space-y-4">
            {activities.map((a) => (
              <li
                key={a.id}
                className={`flex items-start gap-4 p-4 rounded-xl ${
                  a.unread
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : "bg-gray-50"
                }`}
              >
                <div className="text-2xl">{a.icon}</div>
                <div className="flex-1">
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-gray-600">{a.description}</p>
                </div>
                {a.unread && (
                  <span className="text-xs font-semibold text-blue-600">
                    NEW
                  </span>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* ⬇ EVERYTHING ELSE (Projects, Badges, Analytics, Reviews) REMAINS UNCHANGED ⬇ */}
        {/* Your existing code below this point stays exactly the same */}



 {/* PROJECTS */}
        <section className="bg-white border rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">💼 Current Projects</h2>
            <a href="/dashboard/projects" className="text-sm font-medium text-blue-600 hover:underline">
              View all projects →
            </a>
          </div>

          {dashboardProjects.length === 0 ? (
            <p className="text-gray-600">No active or pending projects right now.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {dashboardProjects.map((app) => {
                const project = app.project;
                const isActive =
                  app.status === "ACCEPTED" && project.status === "OPEN";

                return (
                  <div key={app.id} className="relative bg-white border rounded-2xl p-6 hover:shadow-lg transition">
                    <div className={`absolute left-0 top-0 h-full w-1 ${isActive ? "bg-blue-500" : "bg-yellow-500"}`} />
                    <h3 className="font-semibold text-lg">{project.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {project.organization.name}
                    </p>
                    <span className={`inline-block mt-4 text-xs px-3 py-1 rounded-full ${isActive ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {isActive ? "Active" : "Pending"}
                    </span>

                    <MentorSection mentor={project.mentor} />

                                      {/* {isActive && project.chat && (
                    <a
                      href={`/dashboard/projects/${project.id}/chat`}
                      className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline"
                    >
                      💬 Open project chat
                    </a>
                  )} */}

                  {isActive && project.chat && (
  <a
    href={`/dashboard/projects/${project.id}/chat`}
    className="relative mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline"
  >
    💬 Open project chat
    <UnreadBadge />
  </a>
)}



                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* BADGES */}
        <section className="bg-white border rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">🏆 Badge Progress</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BADGE_TIERS.map((tier) => {
              const earned = earnedBadgeNames.has(tier.name);
              const progress = Math.min(
                (completedCount / tier.threshold) * 100,
                100
              );

              return (
                <div key={tier.name} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between mb-2">
                    <span>{tier.icon}</span>
                    <span className="text-sm font-medium">{tier.name}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded">
                    <div
                      className={`h-2 rounded ${earned ? "bg-green-500" : "bg-blue-500"}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= ANALYTICS (RESTORED) ================= */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white border rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-6">Rating Breakdown</h2>

            {totalReviews === 0 ? (
              <p className="text-gray-600">No ratings yet.</p>
            ) : (
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = starCounts[star as Star];
                  const percentage = Math.round(
                    (count / totalReviews) * 100
                  );

                  return (
                    <div key={star} className="flex items-center gap-4">
                      <div className="w-20 text-sm font-medium text-yellow-500">
                        {"★".repeat(star)}
                        {"☆".repeat(5 - star)}
                      </div>

                      <div className="flex-1 h-3 bg-gray-200 rounded">
                        <div
                          className="h-3 bg-yellow-400 rounded"
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

          <div className="bg-white border rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-6">📈 Rating Trend</h2>
            <RatingTrendChart data={ratingTrend} />
          </div>
        </section>

        {/* REVIEWS */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold">⭐ Reviews</h2>

          {!hasAnyReview ? (
            <p className="text-gray-600">No reviews yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
                  <div key={review.id} className="space-y-2">
                    <StarRating rating={review.rating} />
                    <p className="italic text-gray-800">“{review.comment}”</p>
                    <p className="text-sm text-gray-500">
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




function MentorSection({ mentor }: { mentor: any }) {
  if (!mentor) {
    return (
      <p className="mt-3 text-sm text-gray-500 italic">
        No mentor assigned yet
      </p>
    );
  }

  return (
    <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-indigo-800">
          Assigned Mentor
        </h4>
        <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
          Active
        </span>
      </div>

      <div>
        <p className="font-semibold">{mentor.name}</p>
        <p className="text-xs text-gray-600">
          Experience: {mentor.experience ?? "N/A"} years
        </p>
      </div>

      {mentor.skills && (
        <div className="flex flex-wrap gap-2">
          {mentor.skills.split(",").map((skill: string) => (
            <span
              key={skill}
              className="text-xs bg-white text-indigo-700 px-2 py-1 rounded-full border"
            >
              {skill.trim()}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm text-yellow-600">
        ⭐ {mentor.rating.toFixed(1)} ({mentor.ratingCount})
      </p>

      <a
        href={`/portfolio/${mentor.username}`}
        className="inline-block text-sm text-indigo-700 hover:underline"
      >
        View mentor profile →
      </a>
    </div>
  );
}

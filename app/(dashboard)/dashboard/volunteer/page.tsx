



import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { calculateProfileStrength } from "@/lib/profileStrength";
import { getProfileLevel, getNextProfileLevel } from "@/lib/profileLevel";
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
import OnboardingBannerShell from "@/components/dashboard/OnboardingBannerShell";
import InviteResponseButtons from "@/components/projects/InviteResponseButtons";
import VolunteerInviteHeroCard from "@/components/dashboard/VolunteerInviteHeroCard";
import VolunteerRealtimeRefresh from "@/components/volunteer/VolunteerRealtimeRefresh";
import SubmissionCommentsThread from "@/components/submissions/SubmissionCommentsThread";
import ProfileCompletionCompact from "@/components/dashboard/ProfileCompletionCompact";




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
      country: true,
      countryCode: true,
      mobileNumber: true,
      profileImageUrl: true,
    },
  });

  if (!volunteer?.username) redirect("/login");

  const portfolioCount = await prisma.portfolioItem.count({
    where: { volunteerId: session.user.id },
  });

  const profileStrength = calculateProfileStrength({
    username: volunteer.username,
    bio: volunteer.bio,
    skills: volunteer.skills,
    experience: volunteer.experience,
    country: volunteer.country,
    countryCode: volunteer.countryCode,
    mobileNumber: volunteer.mobileNumber,
    profileImageUrl: volunteer.profileImageUrl,
    portfolioCount,
  });

  const profileLevel = getProfileLevel(profileStrength.score);
  const nextProfileLevel = getNextProfileLevel(profileStrength.score);

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



          //           submissions: {
          //   where: {
          //     volunteerId: session.user.id,
          //   },
          //   orderBy: {
          //     createdAt: "desc",
          //   },
          //   select: {
          //     id: true,
          //     status: true,
          //     createdAt: true,
          //     workUrl: true,
          //     fileUrl: true,
          //     feedback: true,
          //     version: true, // 🔥 important
          //   },
          // },

          submissions: {
            where: {
              volunteerId: session.user.id,
            },
            orderBy: {
              createdAt: "desc",
            },
            include: {
              comments: {
                include: {
                  user: {
                    select: { name: true },
                  },
                },
                orderBy: { createdAt: "asc" },
              },
            },
          },
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

  const invitedPendingApps = pendingApps.filter(
    (a) => a.source === "ORGANIZATION"
  );

  const latestInvite = invitedPendingApps[0] ?? null;

  const completedApps = applications.filter(
    (a) => a.status === "COMPLETED" && a.project.status === "COMPLETED"
  );

  const completedCount = completedApps.length;

  // const hasAnyReview = completedApps.some((app) =>
  //   app.project.reviews.some((r) => r.volunteerId === session.user.id)
  // );

  const allReviews = completedApps
  .flatMap((app) =>
    app.project.reviews
      .filter((r) => r.volunteerId === session.user.id)
      .map((r) => ({
        ...r,
        organization: app.project.organization.name,
        projectTitle: app.project.title,
      }))
  )
  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

const firstTenReviews = allReviews.slice(0, 10);
const remainingReviews = allReviews.slice(10);




  const dashboardProjects = [...activeApps, ...pendingApps];



  const openProjects = await prisma.project.findMany({
    where: {
      status: "OPEN",
      applications: {
        none: {
          status: {
            in: ["ACCEPTED", "COMPLETED"],
          },
        },
      },
    },
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
      title: app.source === "ORGANIZATION" ? "Invitation received" : "Application submitted",
      description: app.project.title,
      date: app.createdAt,
      icon: app.source === "ORGANIZATION" ? "📩" : "📨",
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
      label: "Country added",
      done: Boolean(volunteer.country?.trim()),
      href: "/dashboard/settings",
    },
    {
      label: "Phone number added",
      done: Boolean(
        volunteer.countryCode?.trim() && volunteer.mobileNumber?.trim()
      ),
      href: "/dashboard/settings",
    },
    {
      label: "Profile photo uploaded",
      done: Boolean(volunteer.profileImageUrl?.trim()),
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

  const onboardingSteps = [
    {
      label: "Complete your profile",
      done: profileCompletion === 100,
      href: "/dashboard/settings",
      description: "Add your details, skills, phone, country, and profile photo.",
      icon: "🧾",
    },
    {
      label: "Add your first portfolio item",
      done: portfolioCount > 0,
      href: "/portfolio",
      description: "Show proof of work and strengthen your public profile.",
      icon: "🌍",
    },
    {
      label: "Apply to your first live project",
      done: applications.length > 0,
      href: "/projects",
      description: "Start gaining real-world experience on active opportunities.",
      icon: "💼",
    },
    {
      label: "Complete your first project",
      done: completedCount > 0,
      href: "/dashboard",
      description: "Unlock reviews, badge progress, and stronger visibility.",
      icon: "🏁",
    },
  ];

  const completedOnboardingSteps = onboardingSteps.filter((step) => step.done).length;
  const onboardingProgress = Math.round(
    (completedOnboardingSteps / onboardingSteps.length) * 100
  );
  const nextOnboardingStep = onboardingSteps.find((step) => !step.done);
  const showOnboardingBanner =
    profileCompletion < 100 || completedCount === 0 || portfolioCount === 0;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { lastActivitySeenAt: new Date() },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
      <VolunteerRealtimeRefresh userId={session.user.id} />
      {/* <aside className="fixed inset-y-0 left-0 z-30 hidden overflow-hidden xl:block">
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
      </aside> */}

      <main className="min-h-screen">
        <div className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/90 backdrop-blur xl:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                Volunteer Dashboard
              </p>
              <h1 className="truncate text-lg font-bold text-slate-900">
                Welcome, {session.user.name}
              </h1>
            </div>

            <div className="flex items-center gap-3">


              <NotificationBell
                userId={session.user.id}
                notifications={notifications}
                unreadCount={unreadCount}
              />
              <PortfolioShare url={portfolioUrl} />
            </div>
          </div>

          <div className="overflow-x-auto px-4 pb-4 sm:px-6">
            <div className="flex w-max min-w-full gap-2">
              <MobileNavLink href="/dashboard" active icon="🏠" label="Dashboard" />
              <MobileNavLink href="/projects" icon="💼" label="Projects" />
              <MobileNavLink
                href="/dashboard/volunteer/mentors"
                icon="🧑‍🏫"
                label="Mentors"
              />
              <MobileNavLink href="/portfolio" icon="🌍" label="Portfolio" />
              <MobileNavLink
                href="/dashboard/messages"
                icon="💬"
                label="Messages"
                badge={<UnreadBadge />}
              />
              <MobileNavLink
                href="/dashboard/volunteer/inbox"
                icon="📨"
                label="Inbox"
                badge={<UnreadBadge />}
              />
              <MobileNavLink
                href="/dashboard/settings"
                icon="⚙️"
                label="Settings"
              />
            </div>
          </div>
        </div>

        <div className="space-y-8 px-4 py-5 sm:px-6 lg:px-8 xl:px-10 xl:py-10">

          <section className="relative rounded-3xl border border-white/40 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 p-6 text-white shadow-xl shadow-blue-200/50 sm:p-8 md:p-10">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-indigo-300/20 blur-2xl" />

            <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-blue-50">
                    Volunteer dashboard
                  </span>

                  {/* {onboardingProgress === 100 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100 backdrop-blur shadow-sm shadow-emerald-400/30">
                      <span className="text-emerald-300">✔</span>
                      Profile Complete
                    </span>
                  )}

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${profileLevel.bgClass} ${profileLevel.borderClass} border`}
                  >
                    <span>{profileLevel.icon}</span>
                    <span className={profileLevel.colorClass}>{profileLevel.name}</span>
                  </span> */}


                  {profileCompletion === 100 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100 backdrop-blur shadow-sm shadow-emerald-400/30">
                      <span className="text-emerald-300">✔</span>
                      Profile Complete
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-100 backdrop-blur">
                      ⚡ {profileCompletion}% Complete
                    </span>
                  )}
                </div>

                <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                  Welcome back, {session.user.name}
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-relaxed text-blue-100 sm:text-base">
                  Track your progress, manage your active work, monitor reviews,
                  and continue building proof of experience through real projects.
                </p>

                {/* <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur">
                    <p className="text-xs text-blue-100">Profile Strength</p>
                    <p className="text-lg font-bold text-white">
                      {profileStrength.score}%
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur">
                    <p className="text-xs text-blue-100">Current Level</p>
                    <p className="text-lg font-bold text-white">
                      {profileLevel.icon} {profileLevel.name}
                    </p>
                  </div>
                </div> */}

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur">
                    <p className="text-xs text-blue-100">Profile Strength</p>
                    <p className="text-lg font-bold text-white">
                      {profileStrength.score}% • {profileLevel.icon} {profileLevel.name}
                    </p>
                  </div>
                </div>

                {/* <div className="mt-3">
                  <p className="text-sm text-blue-100">
                    Level:{" "}
                    <span className="font-semibold text-white">
                      {profileLevel.name}
                    </span>
                    {nextProfileLevel && (
                      <>
                        {" "}• Reach{" "}
                        <span className="font-semibold text-white">
                          {nextProfileLevel.min}%
                        </span>{" "}
                        to unlock{" "}
                        <span className="font-semibold text-white">
                          {nextProfileLevel.name}
                        </span>
                      </>
                    )}
                  </p>
                </div> */}

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


              <div className="relative z-20 hidden flex-wrap items-center gap-4 xl:flex">



                <NotificationBell
                  userId={session.user.id}
                  notifications={notifications}
                  unreadCount={unreadCount}
                />
                <PortfolioShare url={portfolioUrl} />
              </div>
            </div>
          </section>



          {latestInvite && (
            <VolunteerInviteHeroCard
              applicationId={latestInvite.id}
              projectId={latestInvite.project.id}
              projectTitle={latestInvite.project.title}
              organizationName={latestInvite.project.organization.name}
            />
          )}

          <OnboardingBannerShell
            userId={session.user.id}
            show={showOnboardingBanner}
            onboardingProgress={onboardingProgress}
            completedOnboardingSteps={completedOnboardingSteps}
            totalOnboardingSteps={onboardingSteps.length}
            nextOnboardingStep={nextOnboardingStep}
            onboardingSteps={onboardingSteps}
          />

    


          <ProfileCompletionCompact
            score={profileStrength.score}
            levelName={profileLevel.name}
            levelIcon={profileLevel.icon}
            profileCompletion={profileCompletion}
            completedSteps={completedProfileSteps}
            totalSteps={profileChecklist.length}
            checklist={profileChecklist}
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


              
              <section>
  <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    ✨ Recommended for You
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Projects matched to your current skill set.
                  </p>
                </div>
                <Link
                  href="/projects"
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  Explore all →
                </Link>
              </div>

              {recommendedProjects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-gray-600">
                  Add more skills to your profile to unlock better project
                  recommendations.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {recommendedProjects.map((project) => (
                    <div
                      key={project.id}
                      className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold leading-snug transition group-hover:text-blue-600">
                            {project.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {project.organization.name}
                          </p>
                        </div>

                        <span className="whitespace-nowrap rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                          {project.matchScore} match
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.matchedSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/projects/${project.id}`}
                        className="mt-5 inline-flex items-center text-sm font-semibold text-blue-600 hover:underline"
                      >
                        View project →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
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
                      className={`flex items-start gap-4 rounded-2xl border p-4 ${a.unread
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-100 bg-gray-50"
                        }`}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
                        {a.icon}
                      </div>

                      <div className="min-w-0 flex-1">
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
            </div> */}
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  💼 Current Projects
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Your active and pending project engagements.
                </p>
              </div>

              {/* <Link
                href="/dashboard/projects"
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                View all projects →
              </Link> */}

              <Link
                href="/dashboard/volunteer/projects"
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                View all projects →
              </Link>
            </div>

            {dashboardProjects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-gray-600">
                No active or pending projects right now.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {dashboardProjects.map((app) => {
                  const project = app.project;

                  const isActive =
                    app.status === "ACCEPTED" &&
                    (project.status === "OPEN" || project.status === "IN_PROGRESS");

                  const isInvited = app.source === "ORGANIZATION";

                  const canRespondToInvite = isInvited && app.status === "PENDING";

                  return (
                    <div
                      key={app.id}
                      className="relative rounded-2xl border border-gray-200 bg-white p-6 transition hover:shadow-lg"
                    >
                      <div
                        className={`absolute bottom-5 left-0 top-5 w-1 rounded-full ${isActive ? "bg-blue-500" : "bg-yellow-500"
                          }`}
                      />

                      <div className="pl-3">
                        <div className="flex items-start justify-between gap-3">

                          <div>
                            <h3 className="text-lg font-semibold leading-snug">
                              {project.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {project.organization.name}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-2">
                              {isInvited && (
                                <span className="inline-flex rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                                  Invited by organization
                                </span>
                              )}

                              {!isInvited && app.status === "PENDING" && (
                                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                  Applied by you
                                </span>
                              )}
                            </div>

                            {canRespondToInvite && (
                              <InviteResponseButtons applicationId={app.id} />
                            )}
                          </div>

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isActive
                              ? "bg-blue-50 text-blue-700"
                              : "bg-yellow-50 text-yellow-700"
                              }`}
                          >
                            {isActive ? "Active" : "Pending"}
                          </span>
                        </div>

                        {/* <MentorSection mentor={project.mentor} /> */}

{isActive && (() => {
  const submissions = project.submissions || [];
  const latestSubmission = submissions[0];

  return (
    <div className="mt-4 space-y-4">

      {/* ================= STATUS ROW ================= */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          Active
        </span>

        {latestSubmission && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              latestSubmission.status === "APPROVED"
                ? "bg-emerald-50 text-emerald-700"
                : latestSubmission.status === "REJECTED"
                ? "bg-rose-50 text-rose-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {latestSubmission.status === "APPROVED" && "🟢 Approved"}
            {latestSubmission.status === "REJECTED" && "🔴 Revision Requested"}
            {latestSubmission.status === "PENDING" && "🟡 Pending Review"}
          </span>
        )}
      </div>

      {/* ================= MENTOR ================= */}
      {project.mentor && (
        <p className="text-sm text-slate-600">
          Mentor:{" "}
          <span className="font-semibold text-slate-900">
            {project.mentor.name}
          </span>
        </p>
      )}

      {/* ================= ACTIONS ================= */}
      <div className="flex flex-wrap gap-2 pt-2">

        {/* Message Organization */}
        <Link
          href={`/dashboard/messages/start?userId=${project.organizationId}`}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          💬 Message Organization
        </Link>

        {/* Submit / View Submission */}
        <Link
          href={`/dashboard/projects/${project.id}/submit`}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {!latestSubmission ? "Submit Work" : "View Submission"}
        </Link>

        {/* Project Details */}
        <Link
          href={`/dashboard/volunteer/projects/${project.id}`}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Project Details →
        </Link>
      </div>
    </div>
  );
})()}








                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="space-y-8">
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
              <div className="xl:col-span-2 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
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

              <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
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

                          <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full bg-yellow-400"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>

                          <div className="w-10 text-right text-sm text-gray-600">
                            {count}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold tracking-tight">
                  🏆 Badge Progress
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Milestones unlocked through completed work and delivery.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
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
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <span className="text-2xl">{tier.icon}</span>
                        <span
                          className={`rounded-full px-2 py-1 text-[11px] font-bold ${earned
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                            }`}
                        >
                          {earned ? "Earned" : `${Math.round(progress)}%`}
                        </span>
                      </div>

                      <h3 className="min-h-[40px] text-sm font-semibold text-gray-900">
                        {tier.name}
                      </h3>

                      <p className="mt-2 text-xs text-gray-500">
                        Target: {tier.threshold} completed project
                        {tier.threshold === 1 ? "" : "s"}
                      </p>

                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full ${earned ? "bg-green-500" : "bg-blue-500"
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

          {/* <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight">⭐ Reviews</h2>
              <p className="mt-1 text-sm text-gray-500">
                Feedback from organizations on your completed work.
              </p>
            </div>

            {!hasAnyReview ? (
              <p className="text-gray-600">No reviews yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                      <p className="mt-4 italic leading-relaxed text-gray-800">
                        “{review.comment}”
                      </p>
                      <p className="mt-4 text-sm font-medium text-gray-500">
                        — {review.organization}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </section> */}

<section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
  <div className="mb-6">
    <h2 className="text-xl font-semibold tracking-tight">⭐ Reviews</h2>
    <p className="mt-1 text-sm text-gray-500">
      Feedback from organizations on your completed work.
    </p>
  </div>

  {allReviews.length === 0 ? (
    <p className="text-gray-600">No reviews yet.</p>
  ) : (
    <div className="space-y-4">
      {firstTenReviews.map((review) => (
        <ReviewRow key={review.id} review={review} />
      ))}

      {/* {remainingReviews.length > 0 && (
        <details className="group">
          <summary className="mt-4 cursor-pointer list-none text-sm font-semibold text-blue-600 hover:underline">
            View all reviews ↓
          </summary>

          <div className="mt-4 space-y-4">
            {remainingReviews.map((review) => (
              <ReviewRow key={review.id} review={review} />
            ))}
          </div>
        </details>
      )} */}


      {remainingReviews.length > 0 && (
  <details className="group">
    {/* REVIEWS (hidden initially) */}
    <div className="hidden group-open:block space-y-4 mt-4">
      {remainingReviews.map((review) => (
        <ReviewRow key={review.id} review={review} />
      ))}
    </div>

    {/* TOGGLE BUTTON (always at bottom) */}
    <summary className="mt-6 cursor-pointer list-none text-sm font-semibold text-blue-600 hover:underline">
      <span className="group-open:hidden">View all reviews ↓</span>
      <span className="hidden group-open:inline">Show less ↑</span>
    </summary>
  </details>
)}
    </div>
  )}
</section>





        </div>
      </main>
    </div>
  );
}

function MentorSection({ mentor }: { mentor: Mentor | null }) {
  if (!mentor) {
    return (
      <p className="mt-4 text-sm italic text-gray-500">
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

      <Link
        href={`/portfolio/${mentor.username}`}
        className="mt-3 inline-block text-sm font-semibold text-indigo-700 hover:underline"
      >
        View mentor profile →
      </Link>

      <Link
        href={`/dashboard/messages/start?userId=${mentor.id}`}
        className="mt-3 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        💬 Message Mentor
      </Link>
    </div>
  );
}

function MobileNavLink({
  href,
  icon,
  label,
  active = false,
  badge,
}: {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
  badge?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${active
        ? "border-blue-200 bg-blue-50 text-blue-700"
        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
      {badge}
    </Link>
  );
}





function ReviewRow({ review }: { review: any }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <StarRating rating={review.rating} />

          <p className="mt-3 leading-relaxed text-gray-800">
            “{review.comment}”
          </p>

          <p className="mt-3 text-sm font-medium text-gray-500">
            — {review.organization}
          </p>
        </div>

        <div className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
          {review.projectTitle}
        </div>
      </div>
    </div>
  );
}
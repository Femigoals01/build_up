






import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { calculateProfileStrength } from "@/lib/profileStrength";
import { getProfileLevel } from "@/lib/profileLevel";
import StarRating from "@/components/StarRating";
import RatingTrendChart from "@/components/RatingTrendChart";
import PortfolioShare from "@/components/PortfolioShare";
import StatsGrid from "@/components/stats/StatsGrid";
import StatCard from "@/components/stats/StatCard";
import NotificationBell from "@/components/notifications/NotificationBell";
import UnreadBadge from "@/components/chat/UnreadBadge";
import OnboardingBannerShell from "@/components/dashboard/OnboardingBannerShell";
import InviteResponseButtons from "@/components/projects/InviteResponseButtons";
import VolunteerInviteHeroCard from "@/components/dashboard/VolunteerInviteHeroCard";
import VolunteerRealtimeRefresh from "@/components/volunteer/VolunteerRealtimeRefresh";
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

type ReviewRowData = {
  id: string;
  rating: number;
  comment: string | null;
  organization: string;
  projectTitle: string;
};


function normalizeSkill(value: string) {
  return value.toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ").trim();
}

function skillsMatch(projectSkill: string, volunteerSkill: string) {
  const projectValue = normalizeSkill(projectSkill);
  const volunteerValue = normalizeSkill(volunteerSkill);

  return (
    projectValue.includes(volunteerValue) ||
    volunteerValue.includes(projectValue)
  );
}



function formatNairaFromKobo(amount?: number | null) {
  if (!amount) return "₦0";

  return `₦${(amount / 100).toLocaleString("en-NG", {
    maximumFractionDigits: 0,
  })}`;
}





// function formatDeliveryDuration(days?: number | null) {
//   const safeDays = days && days > 0 ? days : 7;

//   return `${safeDays} ${safeDays === 1 ? "day" : "days"}`;
// }

// function getDeliveryCountdown(project: {
//   deliveryDays?: number | null;
//   deliveryDueAt?: Date | string | null;
// }) {
//   if (!project.deliveryDueAt) {
//     return `Delivery: ${formatDeliveryDuration(project.deliveryDays)} after funding`;
//   }

//   const dueAt = new Date(project.deliveryDueAt).getTime();
//   const difference = dueAt - Date.now();

//   if (difference <= 0) return "Delivery overdue";

//   const totalMinutes = Math.floor(difference / (1000 * 60));
//   const days = Math.floor(totalMinutes / (60 * 24));
//   const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
//   const minutes = totalMinutes % 60;

//   if (days > 0) return `${days}d ${hours}h ${minutes}m remaining`;
//   if (hours > 0) return `${hours}h ${minutes}m remaining`;

//   return `${minutes}m remaining`;
// }

// function getDeliveryStyles(project: {
//   deliveryDueAt?: Date | string | null;
// }) {
//   if (!project.deliveryDueAt) {
//     return "bg-slate-50 text-slate-700";
//   }

//   const dueAt = new Date(project.deliveryDueAt).getTime();

//   if (dueAt <= Date.now()) {
//     return "bg-rose-50 text-rose-700";
//   }

//   return "bg-indigo-50 text-indigo-700";
// }


function formatDeliveryDuration(days?: number | null) {
  const safeDays = days && days > 0 ? days : 7;

  return `${safeDays} ${safeDays === 1 ? "day" : "days"}`;
}

// function getDeliveryCountdown(project: {
//   deliveryDays?: number | null;
//   deliveryStartedAt?: Date | string | null;
//   deliveryDueAt?: Date | string | null;
// }) {
//   const safeDays = project.deliveryDays && project.deliveryDays > 0 ? project.deliveryDays : 7;

//   if (!project.deliveryStartedAt || !project.deliveryDueAt) {
//     // return `Delivery starts after funding • ${safeDays} ${
//     //   safeDays === 1 ? "day" : "days"
//     // } duration`;

//     if (!project.deliveryStartedAt || !project.deliveryDueAt) {
//       return `Delivery starts after funding • ${formatDeliveryDuration(
//         project.deliveryDays
//       )} duration`;
//     }
//   }

//   const dueAt = new Date(project.deliveryDueAt).getTime();
//   const difference = dueAt - Date.now();

//   if (difference <= 0) return "Delivery overdue";

//   const totalMinutes = Math.floor(difference / (1000 * 60));
//   const days = Math.floor(totalMinutes / (60 * 24));
//   const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
//   const minutes = totalMinutes % 60;

//   if (days > 0) return `${days}d ${hours}h ${minutes}m remaining`;
//   if (hours > 0) return `${hours}h ${minutes}m remaining`;

//   return `${minutes}m remaining`;
// }


// function getDeliveryCountdown(project: {
//   deliveryDays?: number | null;
//   deliveryStartedAt?: Date | string | null;
//   deliveryDueAt?: Date | string | null;
// }) {
//   if (!project.deliveryStartedAt || !project.deliveryDueAt) {
//     return `Delivery starts after funding • ${formatDeliveryDuration(
//       project.deliveryDays
//     )} duration`;
//   }

//   const dueAt = new Date(project.deliveryDueAt).getTime();
//   const difference = dueAt - Date.now();

//   if (difference <= 0) return "Delivery overdue";

//   const totalMinutes = Math.floor(difference / (1000 * 60));
//   const days = Math.floor(totalMinutes / (60 * 24));
//   const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
//   const minutes = totalMinutes % 60;

//   if (days > 0) return `${days}d ${hours}h ${minutes}m remaining`;
//   if (hours > 0) return `${hours}h ${minutes}m remaining`;

//   return `${minutes}m remaining`;
// }



// function getDeliveryCountdown(project: {
//   deliveryDays?: number | null;
//   deliveryStartedAt?: Date | string | null;
//   deliveryDueAt?: Date | string | null;
// }) {
//   if (!project.deliveryStartedAt || !project.deliveryDueAt) {
//     return `Delivery starts after funding • ${formatDeliveryDuration(
//       project.deliveryDays
//     )} duration`;
//   }

//   const dueAt = new Date(project.deliveryDueAt).getTime();
//   const difference = dueAt - Date.now();

//   if (difference <= 0) return "Delivery overdue";

//   const totalMinutes = Math.floor(difference / (1000 * 60));
//   const days = Math.floor(totalMinutes / (60 * 24));
//   const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
//   const minutes = totalMinutes % 60;

//   if (days > 0) return `${days}d ${hours}h ${minutes}m remaining`;
//   if (hours > 0) return `${hours}h ${minutes}m remaining`;

//   return `${minutes}m remaining`;
// }


// function getDeliveryCountdown(project: {
//   deliveryDays?: number | null;
//   deliveryStartedAt?: Date | string | null;
//   deliveryDueAt?: Date | string | null;
//   funding?: {
//     paidAt?: Date | string | null;
//     status?: string | null;
//   } | null;
// }) {
//   const deliveryDays = project.deliveryDays ?? 7;

//   const fallbackStartedAt = project.funding?.paidAt
//     ? new Date(project.funding.paidAt)
//     : null;

//   const startedAt = project.deliveryStartedAt
//     ? new Date(project.deliveryStartedAt)
//     : fallbackStartedAt;

//   const dueAt = project.deliveryDueAt
//     ? new Date(project.deliveryDueAt)
//     : fallbackStartedAt
//     ? new Date(fallbackStartedAt.getTime() + deliveryDays * 24 * 60 * 60 * 1000)
//     : null;

//   if (!startedAt || !dueAt) {
//     return `Delivery starts after funding • ${formatDeliveryDuration(
//       project.deliveryDays
//     )} duration`;
//   }

//   const difference = dueAt.getTime() - Date.now();

//   if (difference <= 0) return "Delivery overdue";

//   const totalMinutes = Math.floor(difference / (1000 * 60));
//   const days = Math.floor(totalMinutes / (60 * 24));
//   const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
//   const minutes = totalMinutes % 60;

//   if (days > 0) return `${days}d ${hours}h ${minutes}m remaining`;
//   if (hours > 0) return `${hours}h ${minutes}m remaining`;

//   return `${minutes}m remaining`;
// }




function getDeliveryCountdown(project: {
  deliveryDays?: number | null;
  deliveryStartedAt?: Date | string | null;
  deliveryDueAt?: Date | string | null;
  funding?: {
    paidAt?: Date | string | null;
    status?: string | null;
  } | null;
}) {
  const deliveryDays = project.deliveryDays ?? 7;

  const fallbackStartedAt = project.funding?.paidAt
    ? new Date(project.funding.paidAt)
    : null;

  const startedAt = project.deliveryStartedAt
    ? new Date(project.deliveryStartedAt)
    : fallbackStartedAt;

  const dueAt = project.deliveryDueAt
    ? new Date(project.deliveryDueAt)
    : fallbackStartedAt
    ? new Date(fallbackStartedAt.getTime() + deliveryDays * 24 * 60 * 60 * 1000)
    : null;

  if (!startedAt || !dueAt) {
    return `Delivery starts after funding • ${formatDeliveryDuration(
      project.deliveryDays
    )} duration`;
  }

  const difference = dueAt.getTime() - Date.now();

  if (difference <= 0) return "Delivery overdue";

  const totalMinutes = Math.floor(difference / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;

  return `${minutes}m remaining`;
}






// function getDeliveryStyles(project: {
//   deliveryStartedAt?: Date | string | null;
//   deliveryDueAt?: Date | string | null;
// }) {
//   if (!project.deliveryStartedAt || !project.deliveryDueAt) {
//     return "bg-slate-50 text-slate-700 border border-slate-200";
//   }

//   const dueAt = new Date(project.deliveryDueAt).getTime();
//   const difference = dueAt - Date.now();

//   if (difference <= 0) {
//     return "bg-rose-100 text-rose-800 border border-rose-200";
//   }

//   const twelveHours = 12 * 60 * 60 * 1000;

//   if (difference <= twelveHours) {
//     return "bg-red-100 text-red-700 border border-red-200 animate-pulse";
//   }

//   return "bg-indigo-50 text-indigo-700 border border-indigo-100";
// }



// function getDeliveryStyles(project: {
//   deliveryStartedAt?: Date | string | null;
//   deliveryDueAt?: Date | string | null;
//   funding?: {
//     paidAt?: Date | string | null;
//   } | null;
// }) {
//   const fallbackStartedAt = project.funding?.paidAt
//     ? new Date(project.funding.paidAt)
//     : null;

//   const deliveryDays = "deliveryDays" in project ? (project as any).deliveryDays ?? 7 : 7;

//   const dueAt = project.deliveryDueAt
//     ? new Date(project.deliveryDueAt)
//     : fallbackStartedAt
//     ? new Date(fallbackStartedAt.getTime() + deliveryDays * 24 * 60 * 60 * 1000)
//     : null;

//   if (!dueAt) {
//     return "bg-slate-50 text-slate-700 border border-slate-200";
//   }

//   const difference = dueAt.getTime() - Date.now();

//   if (difference <= 0) {
//     return "bg-rose-100 text-rose-800 border border-rose-200";
//   }

//   const twelveHours = 12 * 60 * 60 * 1000;

//   if (difference <= twelveHours) {
//     return "bg-red-100 text-red-700 border border-red-200 animate-pulse";
//   }

//   return "bg-indigo-50 text-indigo-700 border border-indigo-100";
// }




function getDeliveryStyles(project: {
  deliveryStartedAt?: Date | string | null;
  deliveryDueAt?: Date | string | null;
  funding?: {
    paidAt?: Date | string | null;
  } | null;
}) {
  const fallbackStartedAt = project.funding?.paidAt
    ? new Date(project.funding.paidAt)
    : null;

  const deliveryDays = "deliveryDays" in project ? (project as any).deliveryDays ?? 7 : 7;

  const dueAt = project.deliveryDueAt
    ? new Date(project.deliveryDueAt)
    : fallbackStartedAt
    ? new Date(fallbackStartedAt.getTime() + deliveryDays * 24 * 60 * 60 * 1000)
    : null;

  if (!dueAt) {
    return "bg-slate-50 text-slate-700 border border-slate-200";
  }

  const difference = dueAt.getTime() - Date.now();

  if (difference <= 0) {
    return "bg-rose-100 text-rose-800 border border-rose-200";
  }

  const twelveHours = 12 * 60 * 60 * 1000;

  if (difference <= twelveHours) {
    return "bg-red-100 text-red-700 border border-red-200 animate-pulse";
  }

  return "bg-indigo-50 text-indigo-700 border border-indigo-100";
}




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

  const volunteerSkills =
    typeof volunteer.skills === "string" && volunteer.skills.trim().length > 0
      ? volunteer.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
      : [];

  // const lastSeen = volunteer.lastActivitySeenAt ?? new Date(0);
  const safeRating = volunteer.rating ?? 0;
  const safeRatingCount = volunteer.ratingCount ?? 0;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const portfolioUrl = `${appUrl}/portfolio/${volunteer.username}`;

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
          submissions: {
            where: { volunteerId: session.user.id },
            orderBy: { createdAt: "desc" },
            include: {
              comments: {
                include: {
                  user: { select: { name: true } },
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




  // const projectIds = applications.map((app) => app.projectId);

  // const projectFundings = await prisma.projectFunding.findMany({
  //   where: {
  //     projectId: {
  //       in: projectIds,
  //     },
  //   },
  // });

  // const fundingMap = new Map(
  //   projectFundings.map((funding) => [funding.projectId, funding])
  // );

  // const applicationsWithDelivery = applications.map((app) => {
  //   const funding = fundingMap.get(app.projectId);

  //   if (
  //     app.project.deliveryStartedAt ||
  //     app.project.deliveryDueAt ||
  //     !funding?.paidAt
  //   ) {
  //     return app;
  //   }

  //   const deliveryDays = app.project.deliveryDays ?? 7;
  //   const deliveryStartedAt = funding.paidAt;
  //   const deliveryDueAt = new Date(
  //     deliveryStartedAt.getTime() + deliveryDays * 24 * 60 * 60 * 1000
  //   );

  //   return {
  //     ...app,
  //     project: {
  //       ...app.project,
  //       deliveryStartedAt,
  //       deliveryDueAt,
  //     },
  //   };
  // });




//   const projectIds = applications.map((app) => app.projectId);

// const projectFundings = await prisma.projectFunding.findMany({
//   where: {
//     projectId: {
//       in: projectIds,
//     },
//   },
// });

// const fundingMap = new Map(
//   projectFundings.map((funding) => [funding.projectId, funding])
// );

// const applicationsWithDelivery = applications.map((app) => {
//   const funding = fundingMap.get(app.projectId);

//   if (!funding?.paidAt) {
//     return app;
//   }

//   if (app.project.deliveryStartedAt && app.project.deliveryDueAt) {
//     return app;
//   }

//   const deliveryDays = app.project.deliveryDays ?? 7;
//   const deliveryStartedAt = funding.paidAt;
//   const deliveryDueAt = new Date(
//     deliveryStartedAt.getTime() + deliveryDays * 24 * 60 * 60 * 1000
//   );

//   return {
//     ...app,
//     project: {
//       ...app.project,
//       deliveryStartedAt,
//       deliveryDueAt,
//     },
//   };
// });




const projectIds = applications.map((app) => app.projectId);

const projectFundings = await prisma.projectFunding.findMany({
  where: {
    projectId: {
      in: projectIds,
    },
  },
});

const fundingMap = new Map(
  projectFundings.map((funding) => [funding.projectId, funding])
);

const applicationsWithDelivery = applications.map((app) => {
  const funding = fundingMap.get(app.projectId) ?? null;
  const paidAt = funding?.paidAt ? new Date(funding.paidAt) : null;

  if (!paidAt) {
    return {
      ...app,
      project: {
        ...app.project,
        funding,
      },
    };
  }

  const deliveryDays = app.project.deliveryDays ?? 7;

  const deliveryStartedAt =
    app.project.deliveryStartedAt ?? paidAt;

  const deliveryDueAt =
    app.project.deliveryDueAt ??
    new Date(paidAt.getTime() + deliveryDays * 24 * 60 * 60 * 1000);

  return {
    ...app,
    project: {
      ...app.project,
      funding,
      deliveryStartedAt,
      deliveryDueAt,
    },
  };
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

  // const activeApps = applications.filter(

  // const activeApps = applicationsWithDelivery.filter(
  //   (a) =>
  //     a.status === "ACCEPTED" &&
  //     (a.project.status === "OPEN" || a.project.status === "IN_PROGRESS")
  // );


//   const activeApps = applicationsWithDelivery.filter(
//   (a) =>
//     (a.status === "ACCEPTED" || a.status === "COMPLETED") &&
//     (a.project.status === "OPEN" ||
//       a.project.status === "IN_PROGRESS" ||
//       a.project.status === "COMPLETED")
// );


const activeApps = applicationsWithDelivery.filter(
  (a) =>
    (a.status === "ACCEPTED" || a.status === "COMPLETED") &&
    (a.project.status === "OPEN" ||
      a.project.status === "IN_PROGRESS" ||
      a.project.status === "COMPLETED")
);

  // const pendingApps = applications.filter((a) => a.status === "PENDING");

  // const pendingApps = applications.filter(

  const pendingApps = applicationsWithDelivery.filter(


    (a) => a.status === "PENDING" || a.status === "AWAITING_PAYMENT"
  );

  const invitedPendingApps = pendingApps.filter(
    (a) => a.source === "ORGANIZATION"
  );

  const latestInvite = invitedPendingApps[0] ?? null;

  // const completedApps = applications.filter(

  const completedApps = applicationsWithDelivery.filter(
    (a) => a.status === "COMPLETED" && a.project.status === "COMPLETED"
  );

  const completedCount = completedApps.length;

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

  // const recommendedProjects = openProjects
  //   .map((project) => {
  //     const matchedSkills = project.skills.filter((skill) =>
  //       volunteerSkills.includes(skill)
  //     );

  //     return {
  //       ...project,
  //       matchScore: matchedSkills.length,
  //       matchedSkills,
  //     };
  //   })
  //   .filter((p) => p.matchScore > 0)
  //   .sort((a, b) => b.matchScore - a.matchScore)
  //   .slice(0, 4);

  const recommendedProjects = openProjects
    .map((project) => {
      const matchedSkills = project.skills.filter((projectSkill) =>
        volunteerSkills.some((volunteerSkill) =>
          skillsMatch(projectSkill, volunteerSkill)
        )
      );

      return {
        ...project,
        matchScore: matchedSkills.length,
        matchedSkills,
      };
    })
    .filter((project) => project.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);

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
      // done: applications.length > 0,
      done: applicationsWithDelivery.length > 0,
      href: "/projects",
      description: "Start gaining real-world experience on active opportunities.",
      icon: "💼",
    },
    {
      label: "Complete your first project",
      done: completedCount > 0,
      href: "/dashboard/volunteer",
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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
      <VolunteerRealtimeRefresh userId={session.user.id} />

      <main className="min-h-screen w-full max-w-full overflow-x-hidden">
        <div className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/95 backdrop-blur xl:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-4">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Volunteer Dashboard
              </p>

              <h1 className="truncate text-base font-bold text-slate-900">
                Welcome, {session.user.name}
              </h1>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <NotificationBell
                userId={session.user.id}
                notifications={notifications}
                unreadCount={unreadCount}
              />

              <PortfolioShare url={portfolioUrl} />
            </div>
          </div>

          <div className="max-w-full overflow-x-auto px-4 pb-4">
            <div className="flex w-max gap-2">
              <MobileNavLink
                href="/dashboard/volunteer"
                active
                icon="🏠"
                label="Dashboard"
              />
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

        <div className="mx-auto w-full max-w-full space-y-6 px-4 py-4 sm:space-y-8 sm:px-6 sm:py-6 lg:max-w-[1600px] lg:px-8 xl:px-10 xl:py-10">
          <section className="relative max-w-full overflow-hidden rounded-[1.75rem] border border-white/40 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 p-5 text-white shadow-xl shadow-blue-200/50 sm:rounded-3xl sm:p-8 md:p-10">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-indigo-300/20 blur-2xl" />

            <div className="relative flex min-w-0 flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-blue-50">
                    Volunteer dashboard
                  </span>

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

                <h1 className="mt-4 break-words text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                  Welcome back, {session.user.name}
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-relaxed text-blue-100 sm:text-base">
                  Track your progress, manage your active work, monitor reviews,
                  and continue building proof of experience through real projects.
                </p>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <div className="w-full rounded-xl bg-white/10 px-4 py-3 backdrop-blur sm:w-auto">
                    <p className="text-xs text-blue-100">Profile Strength</p>
                    <p className="break-words text-base font-bold text-white sm:text-lg">
                      {profileStrength.score}% • {profileLevel.icon}{" "}
                      {profileLevel.name}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <div className="flex w-full flex-wrap items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm sm:w-auto sm:gap-3">
                    <StarRating rating={safeRating} />
                    <span className="font-semibold">{safeRating.toFixed(1)} / 5</span>
                    <span className="text-sm text-blue-100">
                      ({safeRatingCount} reviews)
                    </span>
                  </div>

                  <div className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm text-blue-50 backdrop-blur-sm sm:w-auto">
                    {completedCount} completed project
                    {completedCount === 1 ? "" : "s"}
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

          <section className="max-w-full overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h2 className="break-words text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                  ✨ Recommended for You
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Projects matched to your current skill set
                </p>
              </div>

              <Link
                href="/projects"
                className="inline-flex w-full items-center justify-center rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 sm:w-auto sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:hover:bg-transparent sm:hover:underline"
              >
                Explore all →
              </Link>
            </div>

            {recommendedProjects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 text-sm text-gray-600 sm:p-8 sm:text-base">
                Add more skills to your profile to unlock better project
                recommendations.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
                {recommendedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="group min-w-0 rounded-2xl border border-gray-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-lg sm:p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="break-words text-base font-semibold leading-snug text-slate-900 transition group-hover:text-blue-600 sm:text-lg">
                          {project.title}
                        </h3>

                        <p className="mt-1 break-words text-sm text-gray-500">
                          {project.organization.name}
                        </p>
                      </div>

                      <span className="w-fit whitespace-nowrap rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
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
          </section>

          <section className="max-w-full overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="break-words text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                  💼 Current Projects
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your active and pending project engagements.
                </p>


              </div>

              <Link
                href="/dashboard/volunteer/projects"
                className="inline-flex w-full items-center justify-center rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 sm:w-auto sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:hover:bg-transparent sm:hover:underline"
              >
                View all projects →
              </Link>
            </div>

            {dashboardProjects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 text-sm text-gray-600 sm:p-8 sm:text-base">
                No active or pending projects right now.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                {dashboardProjects.map((app) => {
                  const project = app.project;

                  const isActive =
                    app.status === "ACCEPTED" &&
                    (project.status === "OPEN" ||
                      project.status === "IN_PROGRESS");

                  const isInvited = app.source === "ORGANIZATION";
                  const canRespondToInvite = isInvited && app.status === "PENDING";

                  return (
                    <div
                      key={app.id}
                      className="relative min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 transition hover:shadow-lg sm:p-6"
                    >
                      <div
                        className={`absolute bottom-5 left-0 top-5 w-1 rounded-full ${isActive ? "bg-blue-500" : "bg-yellow-500"
                          }`}
                      />

                      <div className="min-w-0 pl-3">
                        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <h3 className="break-words text-base font-semibold leading-snug text-slate-900 sm:text-lg">
                              {project.title}
                            </h3>

                            <p className="mt-1 break-words text-sm text-gray-500">
                              {project.organization.name}
                            </p>

                            <p className="mt-2 text-sm font-semibold text-emerald-700">
                              Project Amount: {formatNairaFromKobo(project.stipendAmount)}
                            </p>


                            <span
                              className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getDeliveryStyles(
                                project
                              )}`}
                            >
                              ⏱ {getDeliveryCountdown(project)}
                            </span>




                            <div className="mt-3 flex flex-wrap gap-2">
                              {isInvited && (
                                <span className="inline-flex rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                                  Invited by organization
                                </span>
                              )}

                              {/* {!isInvited && app.status === "PENDING" && (
                                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                  Applied by you
                                </span>
                              )} */}

                              {!isInvited && app.status === "PENDING" && (
                                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                  Applied by you
                                </span>
                              )}

                              {app.status === "AWAITING_PAYMENT" && (
                                <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                  Selected — payment pending
                                </span>
                              )}
                            </div>

                            {canRespondToInvite && (
                              <div className="mt-4">
                                <InviteResponseButtons applicationId={app.id} />
                              </div>
                            )}
                          </div>

                          <span
                            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${isActive
                                ? "bg-blue-50 text-blue-700"
                                : "bg-yellow-50 text-yellow-700"
                              }`}
                          >
                            {isActive ? "Active" : "Pending"}
                          </span>
                        </div>

                        {isActive &&
                          (() => {
                            const submissions = project.submissions || [];
                            const latestSubmission = submissions[0];

                            return (
                              <div className="mt-5 min-w-0 space-y-4">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                    Active
                                  </span>

                                  {latestSubmission && (
                                    <span
                                      className={`rounded-full px-3 py-1 text-xs font-semibold ${latestSubmission.status === "APPROVED"
                                          ? "bg-emerald-50 text-emerald-700"
                                          : latestSubmission.status === "REJECTED"
                                            ? "bg-rose-50 text-rose-700"
                                            : "bg-amber-50 text-amber-700"
                                        }`}
                                    >
                                      {latestSubmission.status === "APPROVED" &&
                                        "🟢 Approved"}
                                      {latestSubmission.status === "REJECTED" &&
                                        "🔴 Revision Requested"}
                                      {latestSubmission.status === "PENDING" &&
                                        "🟡 Pending Review"}
                                    </span>
                                  )}
                                </div>

                                {project.mentor && (
                                  <p className="break-words text-sm text-slate-600">
                                    Mentor:{" "}
                                    <span className="font-semibold text-slate-900">
                                      {project.mentor.name}
                                    </span>
                                  </p>
                                )}

                                <div className="grid w-full gap-2 pt-2">
                                  <Link
                                    href={`/dashboard/messages/start?userId=${project.organizationId}`}
                                    className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                  >
                                    💬 Message Organizations
                                  </Link>

                                  <Link
                                    href={`/dashboard/projects/${project.id}/submit`}
                                    className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                  >
                                    {!latestSubmission
                                      ? "Submit Work"
                                      : "View Submission"}
                                  </Link>

                                  <Link
                                    href={`/dashboard/volunteer/projects/${project.id}`}
                                    className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
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

          <section className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 xl:grid-cols-3">
              <div className="max-w-full overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-8 xl:col-span-2">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                    📈 Rating Trend
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    See how your ratings have changed over time.
                  </p>
                </div>

                <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                  <div className="min-w-[520px]">
                    <RatingTrendChart data={ratingTrend} />
                  </div>
                </div>
              </div>

              <div className="max-w-full overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-8">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
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
                        <div key={star} className="flex items-center gap-3 sm:gap-4">
                          <div className="w-16 text-xs font-medium text-yellow-500 sm:w-20 sm:text-sm">
                            {"★".repeat(star)}
                            {"☆".repeat(5 - star)}
                          </div>

                          <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full bg-yellow-400"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>

                          <div className="w-8 text-right text-sm text-gray-600 sm:w-10">
                            {count}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="max-w-full overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                  🏆 Badge Progress
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Milestones unlocked through completed work and delivery.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
                {BADGE_TIERS.map((tier) => {
                  const earned = earnedBadgeNames.has(tier.name);

                  const progress = Math.min(
                    (completedCount / tier.threshold) * 100,
                    100
                  );

                  return (
                    <div
                      key={tier.name}
                      className="min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-5"
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

                      <h3 className="min-h-[40px] break-words text-sm font-semibold text-gray-900">
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

          <section className="max-w-full overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                ⭐ Reviews
              </h2>

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

                {remainingReviews.length > 0 && (
                  <details className="group">
                    <div className="mt-4 hidden space-y-4 group-open:block">
                      {remainingReviews.map((review) => (
                        <ReviewRow key={review.id} review={review} />
                      ))}
                    </div>

                    <summary className="mt-6 cursor-pointer list-none text-sm font-semibold text-blue-600 hover:underline">
                      <span className="group-open:hidden">
                        View all reviews ↓
                      </span>
                      <span className="hidden group-open:inline">
                        Show less ↑
                      </span>
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
  badge?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-2xl border px-3 py-2 text-xs font-medium transition sm:px-4 sm:py-2.5 sm:text-sm ${active
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

function ReviewRow({ review }: { review: ReviewRowData }) {
  return (
    <div className="max-w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <StarRating rating={review.rating} />

          <p className="mt-3 break-words text-sm leading-relaxed text-gray-800 sm:text-base">
            “{review.comment || "No comment provided."}”
          </p>

          <p className="mt-3 break-words text-sm font-medium text-gray-500">
            — {review.organization}
          </p>
        </div>

        <div className="w-fit max-w-full shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
          <span className="block max-w-[220px] truncate">
            {review.projectTitle}
          </span>
        </div>
      </div>
    </div>
  );
}
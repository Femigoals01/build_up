


// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// function getMentorLevel(projectsGuided: number) {
//   if (projectsGuided >= 50) return 5;
//   if (projectsGuided >= 30) return 4;
//   if (projectsGuided >= 15) return 3;
//   if (projectsGuided >= 5) return 2;
//   return 1;
// }

// function getMentorPoints(projectsGuided: number) {
//   return projectsGuided * 100;
// }

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const skill = searchParams.get("skill")?.trim();

//   const mentors = await prisma.user.findMany({
//     where: {
//       role: "MENTOR",
//       mentorStatus: "APPROVED",
//       ...(skill
//         ? {
//             skills: {
//               contains: skill,
//               mode: "insensitive",
//             },
//           }
//         : {}),
//     },
//     select: {
//       id: true,
//       name: true,
//       username: true,
//       bio: true,
//       headline: true,
//       experience: true,
//       skills: true,
//       profileImageUrl: true,
//       rating: true,
//       ratingCount: true,
//       badges: true,
//       mentoredProjects: {
//         select: {
//           id: true,
//           status: true,
//         },
//       },
//     },
//     orderBy: [
//       {
//         rating: "desc",
//       },
//       {
//         ratingCount: "desc",
//       },
//     ],
//   });

//   const formattedMentors = mentors.map((mentor) => {
//     const projectsGuided = mentor.mentoredProjects.filter(
//       (project) => project.status === "COMPLETED"
//     ).length;

//     const mentorLevel = getMentorLevel(projectsGuided);
//     const mentorshipPoints = getMentorPoints(projectsGuided);

//     return {
//       id: mentor.id,
//       name: mentor.name,
//       username: mentor.username,
//       bio: mentor.bio,
//       headline: mentor.headline,
//       experience: mentor.experience,
//       skills: mentor.skills,
//       profileImageUrl: mentor.profileImageUrl,
//       rating: mentor.rating,
//       ratingCount: mentor.ratingCount,

//       projectsGuided,
//       mentorLevel,
//       mentorshipPoints,

//       badges: mentor.badges.map((badge) => ({
//         id: badge.id,
//         name: badge.name,
//         description: badge.description,
//         icon: badge.icon,
//         category: badge.category,
//       })),
//     };
//   });

//   return NextResponse.json(formattedMentors);
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getMentorLevel(projectsGuided: number) {
  if (projectsGuided >= 50) return 5;
  if (projectsGuided >= 30) return 4;
  if (projectsGuided >= 15) return 3;
  if (projectsGuided >= 5) return 2;

  return 1;
}

function getMentorPoints(projectsGuided: number) {
  return projectsGuided * 100;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const skill = searchParams.get("skill")?.trim();

    const mentors = await prisma.user.findMany({
      where: {
        role: "MENTOR",
        mentorStatus: "APPROVED",
        accountStatus: "ACTIVE",
        ...(skill
          ? {
              skills: {
                contains: skill,
                mode: "insensitive",
              },
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        headline: true,
        experience: true,
        skills: true,
        profileImageUrl: true,
        rating: true,
        ratingCount: true,
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
          take: 1,
        },
        mentoredProjects: {
          select: {
            id: true,
            status: true,
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
        {
          rating: "desc",
        },
        {
          ratingCount: "desc",
        },
      ],
    });

    const formattedMentors = mentors.map((mentor) => {
      const projectsGuided = mentor.mentoredProjects.filter(
        (project) => project.status === "COMPLETED"
      ).length;

      const fallbackMentorLevel = getMentorLevel(projectsGuided);
      const fallbackMentorshipPoints = getMentorPoints(projectsGuided);

      const rating = mentor.mentorRating || mentor.rating || 0;
      const ratingCount = mentor.mentorRatingCount || mentor.ratingCount || 0;

      return {
        id: mentor.id,
        name: mentor.name,
        username: mentor.username,
        bio: mentor.bio,
        headline: mentor.headline,
        experience: mentor.experience,
        skills: mentor.skills,
        profileImageUrl: mentor.profileImageUrl,
        rating,
        ratingCount,

        projectsGuided,
        mentorLevel: mentor.mentorLevel || fallbackMentorLevel,
        mentorshipPoints:
          mentor.mentorshipPoints || fallbackMentorshipPoints,

        isCertified: mentor.mentorCertifications.length > 0,
        hasAvailability: mentor.mentorAvailabilities.length > 0,

        badges: mentor.badges.map((badge) => ({
          id: badge.id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          category: badge.category,
        })),
      };
    });

    return NextResponse.json(formattedMentors);
  } catch (error) {
    console.error("MENTORS SEARCH ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load mentors." },
      { status: 500 }
    );
  }
}
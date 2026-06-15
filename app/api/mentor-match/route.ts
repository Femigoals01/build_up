



// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// function normalize(value: string | null | undefined) {
//   return String(value || "")
//     .toLowerCase()
//     .replace(/[^a-z0-9\s]/g, " ")
//     .replace(/\s+/g, " ")
//     .trim();
// }

// function parseKeywords(value: string) {
//   return normalize(value)
//     .split(" ")
//     .filter((word) => word.length >= 3);
// }

// function calculateMatchScore({
//   mentor,
//   skillNeeded,
//   projectType,
//   careerGoal,
// }: {
//   mentor: {
//     name: string;
//     headline: string | null;
//     bio: string | null;
//     skills: string | null;
//     experience: string | null;
//     mentorRating: number;
//     mentorRatingCount: number;
//     mentorLevel: number;
//     mentorshipPoints: number;
//   };
//   skillNeeded: string;
//   projectType: string;
//   careerGoal: string;
// }) {
//   const mentorText = normalize(
//     [
//       mentor.name,
//       mentor.headline,
//       mentor.bio,
//       mentor.skills,
//       mentor.experience,
//     ].join(" ")
//   );

//   const skillWords = parseKeywords(skillNeeded);
//   const projectWords = parseKeywords(projectType);
//   const goalWords = parseKeywords(careerGoal);

//   let score = 0;

//   skillWords.forEach((word) => {
//     if (mentorText.includes(word)) score += 15;
//   });

//   projectWords.forEach((word) => {
//     if (mentorText.includes(word)) score += 8;
//   });

//   goalWords.forEach((word) => {
//     if (mentorText.includes(word)) score += 6;
//   });

//   score += Math.min(Number(mentor.mentorRating || 0) * 5, 25);
//   score += Math.min(Number(mentor.mentorLevel || 1) * 4, 20);
//   score += Math.min(Number(mentor.mentorRatingCount || 0) * 2, 20);
//   score += Math.min(Number(mentor.mentorshipPoints || 0) / 100, 20);

//   return Math.min(Math.round(score), 100);
// }

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id || session.user.role !== "VOLUNTEER") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();

//     const skillNeeded = String(body.skillNeeded || "").trim();
//     const projectType = String(body.projectType || "").trim();
//     const careerGoal = String(body.careerGoal || "").trim();

//     if (!skillNeeded && !projectType && !careerGoal) {
//       return NextResponse.json(
//         { error: "Please enter at least one matching field." },
//         { status: 400 }
//       );
//     }

//     const mentors = await prisma.user.findMany({
//       where: {
//         role: "MENTOR",
//         mentorStatus: "APPROVED",
//         accountStatus: "ACTIVE",
//       },
//       select: {
//         id: true,
//         name: true,
//         username: true,
//         headline: true,
//         bio: true,
//         skills: true,
//         experience: true,
//         profileImageUrl: true,
//         mentorRating: true,
//         mentorRatingCount: true,
//         mentorLevel: true,
//         mentorshipPoints: true,
//       },
//     });

//     const matches = mentors
//       .map((mentor) => ({
//         ...mentor,
//         matchScore: calculateMatchScore({
//           mentor,
//           skillNeeded,
//           projectType,
//           careerGoal,
//         }),
//       }))
//       .filter((mentor) => mentor.matchScore > 0)
//       .sort((a, b) => {
//         if (b.matchScore !== a.matchScore) {
//           return b.matchScore - a.matchScore;
//         }

//         if (b.mentorRating !== a.mentorRating) {
//           return b.mentorRating - a.mentorRating;
//         }

//         return b.mentorshipPoints - a.mentorshipPoints;
//       })
//       .slice(0, 10);

//     return NextResponse.json({
//       success: true,
//       matches,
//     });
//   } catch (error) {
//     console.error("MENTOR MATCH ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to find mentor matches." },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

function normalize(value: string | null | undefined) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseKeywords(value: string) {
  return normalize(value)
    .split(" ")
    .filter((word) => word.length >= 3);
}

function calculateMatchScore({
  mentor,
  skillNeeded,
  projectType,
  careerGoal,
}: {
  mentor: {
    name: string;
    headline: string | null;
    bio: string | null;
    skills: string | null;
    experience: string | null;
    mentorRating: number;
    mentorRatingCount: number;
    mentorLevel: number;
    mentorshipPoints: number;
  };
  skillNeeded: string;
  projectType: string;
  careerGoal: string;
}) {
  const mentorText = normalize(
    [
      mentor.name,
      mentor.headline,
      mentor.bio,
      mentor.skills,
      mentor.experience,
    ].join(" ")
  );

  const skillWords = parseKeywords(skillNeeded);
  const projectWords = parseKeywords(projectType);
  const goalWords = parseKeywords(careerGoal);

  let score = 0;

  skillWords.forEach((word) => {
    if (mentorText.includes(word)) score += 15;
  });

  projectWords.forEach((word) => {
    if (mentorText.includes(word)) score += 8;
  });

  goalWords.forEach((word) => {
    if (mentorText.includes(word)) score += 6;
  });

  score += Math.min(Number(mentor.mentorRating || 0) * 5, 25);
  score += Math.min(Number(mentor.mentorLevel || 1) * 4, 20);
  score += Math.min(Number(mentor.mentorRatingCount || 0) * 2, 20);
  score += Math.min(Number(mentor.mentorshipPoints || 0) / 100, 20);

  return Math.min(Math.round(score), 100);
}

function getMatchReasons({
  mentor,
  skillNeeded,
  projectType,
  careerGoal,
}: {
  mentor: {
    headline: string | null;
    bio: string | null;
    skills: string | null;
    experience: string | null;
    mentorRating: number;
    mentorRatingCount: number;
    mentorLevel: number;
    mentorshipPoints: number;
  };
  skillNeeded: string;
  projectType: string;
  careerGoal: string;
}) {
  const reasons: string[] = [];

  const mentorText = normalize(
    [mentor.headline, mentor.bio, mentor.skills, mentor.experience].join(" ")
  );

  const skillWords = parseKeywords(skillNeeded);
  const projectWords = parseKeywords(projectType);
  const goalWords = parseKeywords(careerGoal);

  const matchedSkills = skillWords.filter((word) => mentorText.includes(word));

  const matchedProjects = projectWords.filter((word) =>
    mentorText.includes(word)
  );

  const matchedGoals = goalWords.filter((word) => mentorText.includes(word));

  if (matchedSkills.length > 0) {
    reasons.push(`Matches your skill need: ${matchedSkills.join(", ")}`);
  }

  if (matchedProjects.length > 0) {
    reasons.push(`Relevant to your project type: ${matchedProjects.join(", ")}`);
  }

  if (matchedGoals.length > 0) {
    reasons.push(`Aligned with your career goal: ${matchedGoals.join(", ")}`);
  }

  if (mentor.mentorRating >= 4.5) {
    reasons.push(`Strong mentor rating: ${mentor.mentorRating.toFixed(1)}/5`);
  }

  if (mentor.mentorLevel >= 3) {
    reasons.push(`Experienced mentor level: Level ${mentor.mentorLevel}`);
  }

  if (mentor.mentorRatingCount > 0) {
    reasons.push(`${mentor.mentorRatingCount} verified mentor review(s)`);
  }

  if (mentor.mentorshipPoints > 0) {
    reasons.push(`${mentor.mentorshipPoints} mentorship points earned`);
  }

  if (reasons.length === 0) {
    reasons.push("Recommended based on general mentor profile strength.");
  }

  return reasons.slice(0, 5);
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "VOLUNTEER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const skillNeeded = String(body.skillNeeded || "").trim();
    const projectType = String(body.projectType || "").trim();
    const careerGoal = String(body.careerGoal || "").trim();

    if (!skillNeeded && !projectType && !careerGoal) {
      return NextResponse.json(
        { error: "Please enter at least one matching field." },
        { status: 400 }
      );
    }

    const mentors = await prisma.user.findMany({
      where: {
        role: "MENTOR",
        mentorStatus: "APPROVED",
        accountStatus: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        username: true,
        headline: true,
        bio: true,
        skills: true,
        experience: true,
        profileImageUrl: true,
        mentorRating: true,
        mentorRatingCount: true,
        mentorLevel: true,
        mentorshipPoints: true,
      },
    });

    const matches = mentors
      .map((mentor) => ({
        ...mentor,
        matchScore: calculateMatchScore({
          mentor,
          skillNeeded,
          projectType,
          careerGoal,
        }),
        matchReasons: getMatchReasons({
          mentor,
          skillNeeded,
          projectType,
          careerGoal,
        }),
      }))
      .filter((mentor) => mentor.matchScore > 0)
      .sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }

        if (b.mentorRating !== a.mentorRating) {
          return b.mentorRating - a.mentorRating;
        }

        return b.mentorshipPoints - a.mentorshipPoints;
      })
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      matches,
    });
  } catch (error) {
    console.error("MENTOR MATCH ERROR:", error);

    return NextResponse.json(
      { error: "Failed to find mentor matches." },
      { status: 500 }
    );
  }
}
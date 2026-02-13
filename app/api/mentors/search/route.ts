import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const skill = searchParams.get("skill");

  const mentors = await prisma.user.findMany({
    where: {
      role: "MENTOR",
      mentorStatus: "APPROVED",
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
      bio: true,
      experience: true,
      skills: true,
      rating: true,
      ratingCount: true,
    },
  });

  return NextResponse.json(mentors);
}

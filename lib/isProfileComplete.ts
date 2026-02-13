import { prisma } from "@/lib/prisma";

export async function isVolunteerProfileComplete(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      bio: true,
      skills: true,
      experience: true,
    },
  });

  if (!user) return false;

  return Boolean(
    user.name &&
    user.bio &&
    user.experience &&
    user.skills &&
    user.skills.length > 0
  );
}

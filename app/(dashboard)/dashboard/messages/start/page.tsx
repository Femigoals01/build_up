





import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

function isAllowedDirectChat(currentRole: string, targetRole: string) {
  const pair = [currentRole, targetRole].sort().join("-");

  return pair === "ORGANIZATION-VOLUNTEER" || pair === "MENTOR-VOLUNTEER";
}

export default async function StartChat({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session.user.role) {
    redirect("/login");
  }

  const { userId: targetUserId } = await searchParams;

  if (!targetUserId || targetUserId === session.user.id) {
    redirect("/dashboard");
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: {
      id: true,
      role: true,
    },
  });

  if (!targetUser) {
    redirect("/dashboard");
  }

  if (!isAllowedDirectChat(session.user.role, targetUser.role)) {
    redirect("/dashboard");
  }

  const existingConversation = await prisma.directConversation.findFirst({
    where: {
      AND: [
        {
          participants: {
            some: {
              userId: session.user.id,
            },
          },
        },
        {
          participants: {
            some: {
              userId: targetUserId,
            },
          },
        },
      ],
    },
    select: {
      id: true,
    },
  });

  if (existingConversation) {
    redirect(`/dashboard/messages/${existingConversation.id}`);
  }

  const conversation = await prisma.directConversation.create({
    data: {
      participants: {
        create: [{ userId: session.user.id }, { userId: targetUserId }],
      },
    },
    select: {
      id: true,
    },
  });

  redirect(`/dashboard/messages/${conversation.id}`);
}
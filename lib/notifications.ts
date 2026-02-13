import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";

type CreateNotificationArgs = {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
};

export async function createNotification({
  userId,
  title,
  message,
  type,
  link,
}: CreateNotificationArgs) {
  return prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
      link,
    },
  });
}

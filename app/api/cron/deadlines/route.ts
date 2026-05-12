import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HOUR = 60 * 60 * 1000;

async function notifyUser(userId: string) {
  try {
    await pusherServer.trigger(
      `private-user-notifications-${userId}`,
      "notification:new",
      { userId }
    );
  } catch (error) {
    console.error("Deadline pusher error:", error);
  }
}

export async function GET(req: Request) {
  try {
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret) {
      const authHeader = req.headers.get("authorization");

      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const now = new Date();

    const projects = await prisma.project.findMany({
      where: {
        status: "IN_PROGRESS",
        deliveryDueAt: { not: null },
      },
      select: {
        id: true,
        title: true,
        organizationId: true,
        deliveryDueAt: true,
        deadline48hNotifiedAt: true,
        deadline24hNotifiedAt: true,
        deadline12hNotifiedAt: true,
        deadlineOverdueNotifiedAt: true,
        applications: {
          where: {
            status: "ACCEPTED",
          },
          select: {
            volunteerId: true,
          },
          take: 1,
        },
      },
    });

    let sent = 0;

    for (const project of projects) {
      if (!project.deliveryDueAt) continue;

      const volunteerId = project.applications[0]?.volunteerId;
      if (!volunteerId) continue;

      const dueAt = new Date(project.deliveryDueAt);
      const diff = dueAt.getTime() - now.getTime();

      let milestone:
        | "deadline48hNotifiedAt"
        | "deadline24hNotifiedAt"
        | "deadline12hNotifiedAt"
        | "deadlineOverdueNotifiedAt"
        | null = null;

      let title = "";
      let message = "";

      if (diff <= 0 && !project.deadlineOverdueNotifiedAt) {
        milestone = "deadlineOverdueNotifiedAt";
        title = "Project delivery is overdue";
        message = `"${project.title}" is now overdue. Please submit your work or update the organization.`;
      } else if (diff <= 12 * HOUR && !project.deadline12hNotifiedAt) {
        milestone = "deadline12hNotifiedAt";
        title = "12 hours left to deliver";
        message = `"${project.title}" is due in less than 12 hours. Please submit your work soon.`;
      } else if (diff <= 24 * HOUR && !project.deadline24hNotifiedAt) {
        milestone = "deadline24hNotifiedAt";
        title = "24 hours left to deliver";
        message = `"${project.title}" is due in less than 24 hours.`;
      } else if (diff <= 48 * HOUR && !project.deadline48hNotifiedAt) {
        milestone = "deadline48hNotifiedAt";
        title = "48 hours left to deliver";
        message = `"${project.title}" is due in less than 48 hours.`;
      }

      if (!milestone) continue;

      await prisma.$transaction(async (tx) => {
        await tx.project.update({
          where: { id: project.id },
          data: {
            [milestone]: now,
          },
        });

        await tx.notification.createMany({
          data: [
            {
              userId: volunteerId,
              type: "DEADLINE",
              title,
              message,
              link: `/dashboard/volunteer/projects/${project.id}`,
            },
            {
              userId: project.organizationId,
              type: "DEADLINE",
              title,
              message: message.replace(
                "Please submit your work",
                "The volunteer should submit work"
              ),
              link: `/dashboard/organization/projects/${project.id}`,
            },
          ],
        });
      });

      await Promise.all([
        notifyUser(volunteerId),
        notifyUser(project.organizationId),
      ]);

      sent += 2;
    }

    return NextResponse.json({
      success: true,
      checked: projects.length,
      notificationsSent: sent,
    });
  } catch (error) {
    console.error("Deadline cron error:", error);

    return NextResponse.json(
      { error: "Deadline cron failed" },
      { status: 500 }
    );
  }
}
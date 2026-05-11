



import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const submissionId = String(body?.submissionId || "").trim();
    const message = String(body?.message || "").trim();

    if (!submissionId || !message) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const submission = await prisma.projectSubmission.findUnique({
      where: { id: submissionId },
      include: {
        project: {
          select: {
            organizationId: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    const canComment =
      session.user.id === submission.volunteerId ||
      session.user.id === submission.project.organizationId;

    if (!canComment) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const comment = await prisma.projectSubmissionComment.create({
      data: {
        submissionId,
        userId: session.user.id,
        message,
      },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    await pusherServer.trigger(
      `private-submission-${submissionId}`,
      "comment:new",
      {
        id: comment.id,
        submissionId,
        message: comment.message,
        createdAt: comment.createdAt,
        user: {
          name: comment.user.name,
        },
      }
    );

    return NextResponse.json(comment);
  } catch (err) {
    console.error("Submission comment error:", err);

    return NextResponse.json(
      { error: "Error adding comment" },
      { status: 500 }
    );
  }
}
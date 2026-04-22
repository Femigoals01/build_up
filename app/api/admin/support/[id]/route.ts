

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();

    const allowedStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED"];
    const status =
      typeof body.status === "string" ? body.status.trim().toUpperCase() : "";

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status." },
        { status: 400 }
      );
    }

    const updated = await prisma.supportMessage.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: "Support message updated successfully.",
      supportMessage: updated,
    });
  } catch (error) {
    console.error("Update support message error:", error);
    return NextResponse.json(
      { error: "Failed to update support message." },
      { status: 500 }
    );
  }
}
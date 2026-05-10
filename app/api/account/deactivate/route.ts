


import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const reason = String(body?.reason || "").trim();

    if (!reason) {
      return NextResponse.json(
        { error: "Reason is required" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        accountStatus: "DEACTIVATED",
        deactivatedAt: new Date(),
        accountActionReason: reason,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Deactivate account error:", error);

    return NextResponse.json(
      { error: "Failed to deactivate account" },
      { status: 500 }
    );
  }
}
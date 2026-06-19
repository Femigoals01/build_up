

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

function clean(value: unknown) {
  return String(value || "").trim();
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const reportId = clean(body.reportId);
    const action = clean(body.action);

    if (!reportId) {
      return NextResponse.json(
        { error: "Report ID is required." },
        { status: 400 }
      );
    }

    if (!["RESOLVE", "DISMISS"].includes(action)) {
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }

    const status = action === "RESOLVE" ? "RESOLVED" : "DISMISSED";

    const report = await prisma.communityReport.update({
      where: { id: reportId },
      data: {
        status,
        resolvedAt: new Date(),
        resolvedBy: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Report ${status.toLowerCase()} successfully.`,
      report,
    });
  } catch (error) {
    console.error("ADMIN COMMUNITY REPORT PATCH ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update report." },
      { status: 500 }
    );
  }
}
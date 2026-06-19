



import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

function clean(value: unknown) {
  return String(value || "").trim();
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const postId = clean(body.postId);

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required." },
        { status: 400 }
      );
    }

    await prisma.communityPost.delete({
      where: { id: postId },
    });

    return NextResponse.json({
      success: true,
      message: "Community post deleted successfully.",
    });
  } catch (error) {
    console.error("ADMIN COMMUNITY POST DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete community post." },
      { status: 500 }
    );
  }
}
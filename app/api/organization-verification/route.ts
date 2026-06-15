

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["PENDING", "APPROVED", "REJECTED"];

function clean(value: unknown) {
  return String(value || "").trim();
}

function nullableClean(value: unknown) {
  const cleaned = clean(value);
  return cleaned ? cleaned : null;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role === "ORGANIZATION") {
      const verification = await prisma.organizationVerification.findUnique({
        where: {
          organizationId: session.user.id,
        },
      });

      return NextResponse.json(verification);
    }

    if (session.user.role === "ADMIN") {
      const verifications = await prisma.organizationVerification.findMany({
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              email: true,
              username: true,
              country: true,
              profileImageUrl: true,
              organizationVerified: true,
              organizationVerificationStatus: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json(verifications);
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (error) {
    console.error("ORGANIZATION VERIFICATION GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load verification details." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ORGANIZATION") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const businessName = clean(body.businessName);
    const registrationNumber = nullableClean(body.registrationNumber);
    const websiteUrl = nullableClean(body.websiteUrl);
    const linkedinUrl = nullableClean(body.linkedinUrl);
    const businessAddress = nullableClean(body.businessAddress);
    const certificateUrl = nullableClean(body.certificateUrl);

    if (!businessName) {
      return NextResponse.json(
        { error: "Business name is required." },
        { status: 400 }
      );
    }

    const verification = await prisma.organizationVerification.upsert({
      where: {
        organizationId: session.user.id,
      },
      update: {
        businessName,
        registrationNumber,
        websiteUrl,
        linkedinUrl,
        businessAddress,
        certificateUrl,
        status: "PENDING",
        adminNotes: null,
        reviewedAt: null,
        submittedAt: new Date(),
      },
      create: {
        organizationId: session.user.id,
        businessName,
        registrationNumber,
        websiteUrl,
        linkedinUrl,
        businessAddress,
        certificateUrl,
        status: "PENDING",
      },
    });

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        organizationVerified: false,
        organizationVerifiedAt: null,
        organizationVerificationStatus: "PENDING",
      },
    });

    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title: "Verification submitted",
        message:
          "Your organization verification request has been submitted for admin review.",
        type: "SYSTEM",
        link: "/dashboard/organization/verification",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Verification request submitted successfully.",
        verification,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ORGANIZATION VERIFICATION POST ERROR:", error);

    return NextResponse.json(
      { error: "Failed to submit verification request." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const verificationId = clean(body.verificationId);
    const status = clean(body.status);
    const adminNotes = nullableClean(body.adminNotes);

    if (!verificationId) {
      return NextResponse.json(
        { error: "Verification ID is required." },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid verification status." },
        { status: 400 }
      );
    }

    const existing = await prisma.organizationVerification.findUnique({
      where: {
        id: verificationId,
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Verification request not found." },
        { status: 404 }
      );
    }

    const reviewedAt = status === "PENDING" ? null : new Date();

    const [verification] = await prisma.$transaction([
      prisma.organizationVerification.update({
        where: {
          id: verificationId,
        },
        data: {
          status,
          adminNotes,
          reviewedAt,
        },
      }),

      prisma.user.update({
        where: {
          id: existing.organizationId,
        },
        data: {
          organizationVerified: status === "APPROVED",
          organizationVerifiedAt: status === "APPROVED" ? new Date() : null,
          organizationVerificationStatus: status,
        },
      }),

      prisma.notification.create({
        data: {
          userId: existing.organizationId,
          title:
            status === "APPROVED"
              ? "Organization verified"
              : status === "REJECTED"
                ? "Verification rejected"
                : "Verification updated",
          message:
            status === "APPROVED"
              ? "Congratulations! Your organization is now verified on BuildUp."
              : status === "REJECTED"
                ? "Your organization verification request was not approved at this time."
                : "Your organization verification status has been updated.",
          type: "SYSTEM",
          link: "/dashboard/organization/verification",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Verification request updated successfully.",
      verification,
    });
  } catch (error) {
    console.error("ORGANIZATION VERIFICATION PATCH ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update verification request." },
      { status: 500 }
    );
  }
}
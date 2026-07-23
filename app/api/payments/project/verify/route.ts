



import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {

  console.log("========== VERIFY ROUTE HIT ==========");
console.log("URL:", req.url);

  const url = new URL(req.url);
  const reference = url.searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/organization?payment=missing-reference`
    );
  }

  try {
    const response = await fetch(
      `${process.env.PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();

    console.log("Paystack verify response:", data);

    if (!data.status || data.data?.status !== "success") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/organization?payment=failed`
      );
    }

    const funding = await prisma.projectFunding.findUnique({
      where: { paystackReference: reference },
    });

    console.log("Funding found:", funding);

    if (!funding) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/organization?payment=funding-not-found`
      );
    }

    if (funding.status === "HELD") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/organization?payment=already-confirmed`
      );
    }

    if (data.data.amount !== funding.stipendAmount) {
      await prisma.projectFunding.update({
        where: { id: funding.id },
        data: { status: "DISPUTED" },
      });

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/organization?payment=amount-mismatch`
      );
    }

    const awaitingApplication = await prisma.application.findFirst({
      where: {
        projectId: funding.projectId,
        status: "AWAITING_PAYMENT",
      },
      include: {
        project: true,
      },
    });

    console.log("Awaiting application:", awaitingApplication);

    await prisma.$transaction(async (tx) => {

      console.log("About to update funding...");
      await tx.projectFunding.update({
        where: { id: funding.id },
        data: {
          status: "HELD",
          paidAt: new Date(),
          volunteerId: awaitingApplication?.volunteerId ?? funding.volunteerId,
        },
      });

      console.log("Funding updated successfully.");

      if (awaitingApplication) {
        await tx.application.update({
          where: { id: awaitingApplication.id },
          data: { status: "ACCEPTED" },
        });

        await tx.project.update({
          where: { id: funding.projectId },
          data: { status: "IN_PROGRESS" },
        });

        const chat =
          (await tx.projectChat.findUnique({
            where: { projectId: funding.projectId },
          })) ??
          (await tx.projectChat.create({
            data: { projectId: funding.projectId },
          }));

        await tx.chatMessage.create({
          data: {
            chatId: chat.id,
            content:
              "✅ Project funded. Volunteer accepted and project is now in progress.",
            isSystem: true,
          },
        });

        await tx.notification.create({
          data: {
            userId: awaitingApplication.volunteerId,
            title: "Application accepted 🎉",
            message: `Payment is complete. You can now start work on "${awaitingApplication.project.title}".`,
            type: "APPLICATION",
            link: "/dashboard/volunteer",
          },
        });
      }
    });

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/organization?payment=success`
    );
  } catch (error) {
    console.error("VERIFY PROJECT PAYMENT ERROR:", error);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/organization?payment=error`
    );
  }
}
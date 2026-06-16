



import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const reference = url.searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/organization/opportunities?payment=missing-reference`
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

    if (!data.status || data.data?.status !== "success") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/organization/opportunities?payment=failed`
      );
    }

    const sponsorship = await prisma.opportunitySponsorship.findUnique({
      where: {
        paystackReference: reference,
      },
      include: {
        opportunity: {
          select: {
            id: true,
            title: true,
            organizationId: true,
          },
        },
      },
    });

    if (!sponsorship) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/organization/opportunities?payment=sponsorship-not-found`
      );
    }

    if (sponsorship.status === "PAID") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/organization/opportunities?payment=already-confirmed`
      );
    }

    if (data.data.amount !== sponsorship.amount) {
      await prisma.opportunitySponsorship.update({
        where: {
          id: sponsorship.id,
        },
        data: {
          status: "DISPUTED",
        },
      });

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/organization/opportunities?payment=amount-mismatch`
      );
    }

    const paidAt = new Date();
    const expiresAt = addDays(sponsorship.days);

    await prisma.$transaction(async (tx) => {
      await tx.opportunitySponsorship.update({
        where: {
          id: sponsorship.id,
        },
        data: {
          status: "PAID",
          paidAt,
          expiresAt,
        },
      });

      await tx.opportunity.update({
        where: {
          id: sponsorship.opportunityId,
        },
        data: {
          featured: true,
          sponsoredTier: sponsorship.tier,
          sponsoredAt: paidAt,
          featuredUntil: expiresAt,
        },
      });

      await tx.notification.create({
        data: {
          userId: sponsorship.organizationId,
          title: "Opportunity promoted successfully",
          message: `"${sponsorship.opportunity.title}" is now sponsored and featured on BuildUp.`,
          type: "SYSTEM",
          link: "/dashboard/organization/opportunities",
        },
      });
    });

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/organization/opportunities?payment=sponsor-success`
    );
  } catch (error) {
    console.error("VERIFY OPPORTUNITY SPONSOR PAYMENT ERROR:", error);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/organization/opportunities?payment=error`
    );
  }
}
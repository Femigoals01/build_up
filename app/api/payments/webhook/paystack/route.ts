






// import { NextResponse } from "next/server";
// import crypto from "crypto";
// import { prisma } from "@/lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const secret = process.env.PAYSTACK_SECRET_KEY;

//     if (!secret) {
//       console.error("PAYSTACK_SECRET_KEY is missing");
//       return NextResponse.json({ received: true }, { status: 200 });
//     }

//     const rawBody = await req.text();
//     const signature = req.headers.get("x-paystack-signature");

//     const hash = crypto
//       .createHmac("sha512", secret)
//       .update(rawBody)
//       .digest("hex");

//     if (!signature || hash !== signature) {
//       return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
//     }

//     const event = JSON.parse(rawBody);
//     const eventName = event.event;

//     if (eventName === "charge.success") {
//       await handleChargeSuccess(event);
//     }

//     if (eventName === "transfer.success") {
//       await handleTransferSuccess(event);
//     }

//     if (eventName === "transfer.failed" || eventName === "transfer.reversed") {
//       await handleTransferFailedOrReversed(event);
//     }

//     return NextResponse.json({ received: true }, { status: 200 });
//   } catch (error) {
//     console.error("PAYSTACK WEBHOOK ERROR:", error);
//     return NextResponse.json({ received: true }, { status: 200 });
//   }
// }

// async function handleChargeSuccess(event: any) {
//   const reference = event.data?.reference;
//   const status = event.data?.status;
//   const amount = event.data?.amount;

//   if (!reference || status !== "success") return;

//   const funding = await prisma.projectFunding.findUnique({
//     where: { paystackReference: reference },
//   });

//   if (!funding || funding.status !== "UNPAID") return;

//   if (amount !== funding.stipendAmount) {
//     await prisma.projectFunding.update({
//       where: { id: funding.id },
//       data: { status: "DISPUTED" },
//     });

//     return;
//   }

//   const awaitingApplication = await prisma.application.findFirst({
//     where: {
//       projectId: funding.projectId,
//       status: "AWAITING_PAYMENT",
//     },
//     include: {
//       project: true,
//       volunteer: {
//         select: {
//           id: true,
//           name: true,
//         },
//       },
//     },
//   });

//   const deliveryStartedAt = new Date();
//   const deliveryDays = awaitingApplication?.project.deliveryDays ?? 7;
//   const deliveryDueAt = new Date(
//     deliveryStartedAt.getTime() + deliveryDays * 24 * 60 * 60 * 1000
//   );

//   await prisma.$transaction(async (tx) => {
//     await tx.projectFunding.update({
//       where: { id: funding.id },
//       data: {
//         status: "HELD",
//         paidAt: deliveryStartedAt,
//         volunteerId: awaitingApplication?.volunteerId ?? funding.volunteerId,
//       },
//     });

//     if (awaitingApplication) {
//       const project = awaitingApplication.project;
//       const volunteerId = awaitingApplication.volunteerId;

//       await tx.application.update({
//         where: { id: awaitingApplication.id },
//         data: { status: "ACCEPTED" },
//       });

//       await tx.project.update({
//         where: { id: funding.projectId },
//         data: {
//           status: "IN_PROGRESS",
//           deliveryStartedAt,
//           deliveryDueAt,
//         },
//       });

//       const chat =
//         (await tx.projectChat.findUnique({
//           where: { projectId: funding.projectId },
//         })) ??
//         (await tx.projectChat.create({
//           data: { projectId: funding.projectId },
//         }));

//       await tx.chatMessage.create({
//         data: {
//           chatId: chat.id,
//           content: `✅ Project funded. Volunteer accepted and project is now in progress. Delivery countdown has started for ${deliveryDays} day${
//             deliveryDays === 1 ? "" : "s"
//           }.`,
//           isSystem: true,
//         },
//       });

//       await tx.notification.create({
//         data: {
//           userId: volunteerId,
//           type: "PAYMENT",
//           title: "Project officially started",
//           message: `Payment has been completed for "${project.title}". Your delivery countdown has started.`,
//           link: `/dashboard/volunteer/projects/${project.id}`,
//         },
//       });

//       await tx.notification.create({
//         data: {
//           userId: volunteerId,
//           type: "PROJECT",
//           title: "Delivery countdown started",
//           message: `You have ${deliveryDays} day${
//             deliveryDays === 1 ? "" : "s"
//           } to deliver "${project.title}".`,
//           link: `/dashboard/volunteer/projects/${project.id}`,
//         },
//       });
//     }
//   });
// }

// async function handleTransferSuccess(event: any) {
//   const transferCode = event.data?.transfer_code;
//   const reference = event.data?.reference;

//   if (!transferCode && !reference) return;

//   const withdrawal = await prisma.withdrawalRequest.findFirst({
//     where: {
//       OR: [
//         transferCode ? { paystackTransferCode: transferCode } : {},
//         reference ? { paystackTransferCode: reference } : {},
//       ],
//     },
//   });

//   if (!withdrawal || withdrawal.status === "COMPLETED") return;

//   await prisma.$transaction(async (tx) => {
//     await tx.withdrawalRequest.update({
//       where: { id: withdrawal.id },
//       data: {
//         status: "COMPLETED",
//         processedAt: new Date(),
//       },
//     });

//     await tx.wallet.update({
//       where: { userId: withdrawal.userId },
//       data: {
//         pending: { decrement: withdrawal.amount },
//         withdrawn: { increment: withdrawal.amount },
//       },
//     });

//     if (withdrawal.walletTransactionId) {
//       await tx.walletTransaction.update({
//         where: { id: withdrawal.walletTransactionId },
//         data: { status: "COMPLETED" },
//       });
//     }

//     await tx.notification.create({
//       data: {
//         userId: withdrawal.userId,
//         title: "Withdrawal completed",
//         message: "Your BuildUp wallet withdrawal has been completed.",
//         type: "SYSTEM",
//         link: "/dashboard/wallet",
//       },
//     });
//   });
// }

// async function handleTransferFailedOrReversed(event: any) {
//   const transferCode = event.data?.transfer_code;
//   const reference = event.data?.reference;
//   const reason =
//     event.data?.failure_reason ||
//     event.data?.reason ||
//     event.data?.gateway_response ||
//     "Transfer failed or was reversed by Paystack.";

//   if (!transferCode && !reference) return;

//   const withdrawal = await prisma.withdrawalRequest.findFirst({
//     where: {
//       OR: [
//         transferCode ? { paystackTransferCode: transferCode } : {},
//         reference ? { paystackTransferCode: reference } : {},
//       ],
//     },
//   });

//   if (!withdrawal || withdrawal.status === "FAILED") return;

//   await prisma.$transaction(async (tx) => {
//     await tx.withdrawalRequest.update({
//       where: { id: withdrawal.id },
//       data: {
//         status: "FAILED",
//         failureReason: reason,
//         processedAt: new Date(),
//       },
//     });

//     await tx.wallet.update({
//       where: { userId: withdrawal.userId },
//       data: {
//         pending: { decrement: withdrawal.amount },
//         balance: { increment: withdrawal.amount },
//       },
//     });

//     if (withdrawal.walletTransactionId) {
//       await tx.walletTransaction.update({
//         where: { id: withdrawal.walletTransactionId },
//         data: { status: "FAILED" },
//       });
//     }

//     await tx.notification.create({
//       data: {
//         userId: withdrawal.userId,
//         title: "Withdrawal failed",
//         message:
//           "Your BuildUp wallet withdrawal failed or was reversed. The amount has been returned to your wallet balance.",
//         type: "SYSTEM",
//         link: "/dashboard/wallet",
//       },
//     });
//   });
// }




import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!secret) {
      console.error("PAYSTACK_SECRET_KEY is missing");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    const hash = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    if (!signature || hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventName = event.event;

    if (eventName === "charge.success") {
      await handleChargeSuccess(event);
    }

    if (eventName === "transfer.success") {
      await handleTransferSuccess(event);
    }

    if (eventName === "transfer.failed" || eventName === "transfer.reversed") {
      await handleTransferFailedOrReversed(event);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("PAYSTACK WEBHOOK ERROR:", error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function handleChargeSuccess(event: any) {
  const reference = event.data?.reference;
  const status = event.data?.status;
  const amount = event.data?.amount;

  if (!reference || status !== "success") return;

  const sponsorshipHandled = await handleOpportunitySponsorshipPayment({
    reference,
    amount,
  });

  if (sponsorshipHandled) return;

  await handleProjectFundingPayment({
    reference,
    amount,
  });
}

async function handleOpportunitySponsorshipPayment({
  reference,
  amount,
}: {
  reference: string;
  amount: number;
}) {
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

  if (!sponsorship) return false;

  if (sponsorship.status === "PAID") return true;

  if (sponsorship.status !== "UNPAID") return true;

  if (amount !== sponsorship.amount) {
    await prisma.opportunitySponsorship.update({
      where: {
        id: sponsorship.id,
      },
      data: {
        status: "DISPUTED",
      },
    });

    return true;
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

  return true;
}

async function handleProjectFundingPayment({
  reference,
  amount,
}: {
  reference: string;
  amount: number;
}) {
  const funding = await prisma.projectFunding.findUnique({
    where: { paystackReference: reference },
  });

  if (!funding || funding.status !== "UNPAID") return;

  if (amount !== funding.stipendAmount) {
    await prisma.projectFunding.update({
      where: { id: funding.id },
      data: { status: "DISPUTED" },
    });

    return;
  }

  const awaitingApplication = await prisma.application.findFirst({
    where: {
      projectId: funding.projectId,
      status: "AWAITING_PAYMENT",
    },
    include: {
      project: true,
      volunteer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const deliveryStartedAt = new Date();
  const deliveryDays = awaitingApplication?.project.deliveryDays ?? 7;
  const deliveryDueAt = new Date(
    deliveryStartedAt.getTime() + deliveryDays * 24 * 60 * 60 * 1000
  );

  await prisma.$transaction(async (tx) => {
    await tx.projectFunding.update({
      where: { id: funding.id },
      data: {
        status: "HELD",
        paidAt: deliveryStartedAt,
        volunteerId: awaitingApplication?.volunteerId ?? funding.volunteerId,
      },
    });

    if (awaitingApplication) {
      const project = awaitingApplication.project;
      const volunteerId = awaitingApplication.volunteerId;

      await tx.application.update({
        where: { id: awaitingApplication.id },
        data: { status: "ACCEPTED" },
      });

      await tx.project.update({
        where: { id: funding.projectId },
        data: {
          status: "IN_PROGRESS",
          deliveryStartedAt,
          deliveryDueAt,
        },
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
          content: `✅ Project funded. Volunteer accepted and project is now in progress. Delivery countdown has started for ${deliveryDays} day${
            deliveryDays === 1 ? "" : "s"
          }.`,
          isSystem: true,
        },
      });

      await tx.notification.create({
        data: {
          userId: volunteerId,
          type: "PAYMENT",
          title: "Project officially started",
          message: `Payment has been completed for "${project.title}". Your delivery countdown has started.`,
          link: `/dashboard/volunteer/projects/${project.id}`,
        },
      });

      await tx.notification.create({
        data: {
          userId: volunteerId,
          type: "PROJECT",
          title: "Delivery countdown started",
          message: `You have ${deliveryDays} day${
            deliveryDays === 1 ? "" : "s"
          } to deliver "${project.title}".`,
          link: `/dashboard/volunteer/projects/${project.id}`,
        },
      });
    }
  });
}

async function handleTransferSuccess(event: any) {
  const transferCode = event.data?.transfer_code;
  const reference = event.data?.reference;

  if (!transferCode && !reference) return;

  const withdrawal = await prisma.withdrawalRequest.findFirst({
    where: {
      OR: [
        transferCode ? { paystackTransferCode: transferCode } : {},
        reference ? { paystackTransferCode: reference } : {},
      ],
    },
  });

  if (!withdrawal || withdrawal.status === "COMPLETED") return;

  await prisma.$transaction(async (tx) => {
    await tx.withdrawalRequest.update({
      where: { id: withdrawal.id },
      data: {
        status: "COMPLETED",
        processedAt: new Date(),
      },
    });

    await tx.wallet.update({
      where: { userId: withdrawal.userId },
      data: {
        pending: { decrement: withdrawal.amount },
        withdrawn: { increment: withdrawal.amount },
      },
    });

    if (withdrawal.walletTransactionId) {
      await tx.walletTransaction.update({
        where: { id: withdrawal.walletTransactionId },
        data: { status: "COMPLETED" },
      });
    }

    await tx.notification.create({
      data: {
        userId: withdrawal.userId,
        title: "Withdrawal completed",
        message: "Your BuildUp wallet withdrawal has been completed.",
        type: "SYSTEM",
        link: "/dashboard/wallet",
      },
    });
  });
}

async function handleTransferFailedOrReversed(event: any) {
  const transferCode = event.data?.transfer_code;
  const reference = event.data?.reference;
  const reason =
    event.data?.failure_reason ||
    event.data?.reason ||
    event.data?.gateway_response ||
    "Transfer failed or was reversed by Paystack.";

  if (!transferCode && !reference) return;

  const withdrawal = await prisma.withdrawalRequest.findFirst({
    where: {
      OR: [
        transferCode ? { paystackTransferCode: transferCode } : {},
        reference ? { paystackTransferCode: reference } : {},
      ],
    },
  });

  if (!withdrawal || withdrawal.status === "FAILED") return;

  await prisma.$transaction(async (tx) => {
    await tx.withdrawalRequest.update({
      where: { id: withdrawal.id },
      data: {
        status: "FAILED",
        failureReason: reason,
        processedAt: new Date(),
      },
    });

    await tx.wallet.update({
      where: { userId: withdrawal.userId },
      data: {
        pending: { decrement: withdrawal.amount },
        balance: { increment: withdrawal.amount },
      },
    });

    if (withdrawal.walletTransactionId) {
      await tx.walletTransaction.update({
        where: { id: withdrawal.walletTransactionId },
        data: { status: "FAILED" },
      });
    }

    await tx.notification.create({
      data: {
        userId: withdrawal.userId,
        title: "Withdrawal failed",
        message:
          "Your BuildUp wallet withdrawal failed or was reversed. The amount has been returned to your wallet balance.",
        type: "SYSTEM",
        link: "/dashboard/wallet",
      },
    });
  });
}
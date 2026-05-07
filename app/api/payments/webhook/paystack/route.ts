// // import { NextResponse } from "next/server";
// // import crypto from "crypto";
// // import { prisma } from "@/lib/prisma";

// // export async function POST(req: Request) {
// //   try {
// //     const secret = process.env.PAYSTACK_SECRET_KEY;

// //     if (!secret) {
// //       console.error("PAYSTACK_SECRET_KEY is missing");
// //       return NextResponse.json({ error: "Missing secret" }, { status: 500 });
// //     }

// //     const rawBody = await req.text();

// //     const signature = req.headers.get("x-paystack-signature");

// //     const hash = crypto
// //       .createHmac("sha512", secret)
// //       .update(rawBody)
// //       .digest("hex");

// //     if (!signature || hash !== signature) {
// //       return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
// //     }

// //     const event = JSON.parse(rawBody);

// //     if (event.event !== "charge.success") {
// //       return NextResponse.json({ received: true }, { status: 200 });
// //     }

// //     const reference = event.data?.reference;
// //     const status = event.data?.status;
// //     const amount = event.data?.amount;

// //     if (!reference || status !== "success") {
// //       return NextResponse.json({ received: true }, { status: 200 });
// //     }

// //     const funding = await prisma.projectFunding.findUnique({
// //       where: {
// //         paystackReference: reference,
// //       },
// //     });

// //     if (!funding) {
// //       console.error("Funding record not found for reference:", reference);
// //       return NextResponse.json({ received: true }, { status: 200 });
// //     }

// //     if (funding.status !== "UNPAID") {
// //       return NextResponse.json({ received: true }, { status: 200 });
// //     }

// //     if (amount !== funding.stipendAmount) {
// //       console.error("Paystack amount mismatch:", {
// //         reference,
// //         paidAmount: amount,
// //         expectedAmount: funding.stipendAmount,
// //       });

// //       await prisma.projectFunding.update({
// //         where: { id: funding.id },
// //         data: {
// //           status: "DISPUTED",
// //         },
// //       });

// //       return NextResponse.json({ received: true }, { status: 200 });
// //     }

// //     await prisma.projectFunding.update({
// //       where: { id: funding.id },
// //       data: {
// //         status: "HELD",
// //         paidAt: new Date(),
// //       },
// //     });

// //     return NextResponse.json({ received: true }, { status: 200 });
// //   } catch (error) {
// //     console.error("PAYSTACK WEBHOOK ERROR:", error);

// //     return NextResponse.json({ received: true }, { status: 200 });
// //   }
// // }



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

//   await prisma.projectFunding.update({
//     where: { id: funding.id },
//     data: {
//       status: "HELD",
//       paidAt: new Date(),
//     },
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

//   if (!withdrawal) return;

//   if (withdrawal.status === "COMPLETED") return;

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
//         pending: {
//           decrement: withdrawal.amount,
//         },
//         withdrawn: {
//           increment: withdrawal.amount,
//         },
//       },
//     });

//     if (withdrawal.walletTransactionId) {
//       await tx.walletTransaction.update({
//         where: { id: withdrawal.walletTransactionId },
//         data: {
//           status: "COMPLETED",
//         },
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

//   if (!withdrawal) return;

//   if (withdrawal.status === "FAILED") return;

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
//         pending: {
//           decrement: withdrawal.amount,
//         },
//         balance: {
//           increment: withdrawal.amount,
//         },
//       },
//     });

//     if (withdrawal.walletTransactionId) {
//       await tx.walletTransaction.update({
//         where: { id: withdrawal.walletTransactionId },
//         data: {
//           status: "FAILED",
//         },
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

async function handleChargeSuccess(event: any) {
  const reference = event.data?.reference;
  const status = event.data?.status;
  const amount = event.data?.amount;

  if (!reference || status !== "success") return;

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

  await prisma.$transaction(async (tx) => {
    await tx.projectFunding.update({
      where: { id: funding.id },
      data: {
        status: "HELD",
        paidAt: new Date(),
        volunteerId: awaitingApplication?.volunteerId ?? funding.volunteerId,
      },
    });

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
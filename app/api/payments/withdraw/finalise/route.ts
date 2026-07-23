




import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // if (!session?.user?.id) {
    //   return NextResponse.json(
    //     { error: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    if (
    !session ||
    session.user.role !== "ADMIN"
) {
    return NextResponse.json(
        {
            error: "Unauthorized",
        },
        {
            status: 401,
        }
    );
}

    const { transferId, otp } = await req.json();

    if (!transferId || !otp) {
      return NextResponse.json(
        {
          error: "Transfer ID and OTP are required.",
        },
        {
          status: 400,
        }
      );
    }

    const transfer = await prisma.transfer.findUnique({
      where: {
        id: transferId,
      },
    });

    if (!transfer) {
      return NextResponse.json(
        {
          error: "Transfer not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (!transfer.paystackTransferCode) {
      return NextResponse.json(
        {
          error: "Transfer code missing.",
        },
        {
          status: 400,
        }
      );
    }

    const response = await fetch(
      `${process.env.PAYSTACK_BASE_URL}/transfer/finalize_transfer`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          transfer_code: transfer.paystackTransferCode,
          otp,
        }),
      }
    );

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json(
        {
          error: data.message,
        },
        {
          status: 400,
        }
      );
    }



// const withdrawal = await prisma.withdrawalRequest.findFirst({
//   where: {
//     transferId: transfer.id,
//   },
// });

// await prisma.$transaction(async (tx) => {

//   await tx.transfer.update({
//     where: {
//       id: transfer.id,
//     },
//     data: {
//       status: "SUCCESS",
//       processedAt: new Date(),
//     },
//   });

//   if (withdrawal) {
//     await tx.withdrawalRequest.update({
//       where: {
//         id: withdrawal.id,
//       },
//       data: {
//         status: "COMPLETED",
//         processedAt: new Date(),
//       },
//     });

//     if (withdrawal.walletTransactionId) {
//       await tx.walletTransaction.update({
//         where: {
//           id: withdrawal.walletTransactionId,
//         },
//         data: {
//           status: "COMPLETED",
//         },
//       });
//     }
//   }

//   await tx.wallet.update({
//     where: {
//       userId: transfer.volunteerId,
//     },
//     data: {
//       pending: {
//         decrement: transfer.amount,
//       },
//       withdrawn: {
//         increment: transfer.amount,
//       },
//     },
//   });

//   await tx.projectFunding.update({
//     where: {
//       id: transfer.fundingId,
//     },
//     data: {
//       status: "RELEASED",
//       releasedAt: new Date(),
//     },
//   });

//   await tx.notification.create({
//     data: {
//       userId: transfer.volunteerId,
//       title: "Payment Completed",
//       message:
//         "Your BuildUp payment has been successfully transferred to your bank account.",
//       type: "PAYMENT",
//       link: "/dashboard/wallet",
//     },
//   });

// });

// return NextResponse.json({
//   success: true,
//   message: "Transfer completed successfully.",
// });


//------------------------------------------------------
// Verify transfer with Paystack
//------------------------------------------------------

// const verifyResponse = await fetch(
//   `${process.env.PAYSTACK_BASE_URL}/transfer/verify/${transfer.paystackReference}`,
//   {
//     headers: {
//       Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//     },
//   }
// );

// const verify = await verifyResponse.json();

// console.log("VERIFY RESPONSE");
// console.log(verify);

// const transferStatus =
//   verify?.data?.status?.toLowerCase() ?? "";


//   if (transferStatus !== "success") {

//   return NextResponse.json({
//     success: true,
//     message:
//       "OTP accepted. Paystack is still processing the transfer.",
//   });

// }


// const withdrawal = await prisma.withdrawalRequest.findFirst({
//   where: {
//     transferId: transfer.id,
//   },
// });

// await prisma.$transaction(async (tx) => {

//   //--------------------------------
//   // Transfer
//   //--------------------------------

//   await tx.transfer.update({
//     where: {
//       id: transfer.id,
//     },
//     data: {
//       status: "SUCCESS",
//       processedAt: new Date(),
//     },
//   });

//   //--------------------------------
//   // Withdrawal
//   //--------------------------------

//   if (withdrawal) {

//     await tx.withdrawalRequest.update({
//       where: {
//         id: withdrawal.id,
//       },
//       data: {
//         status: "COMPLETED",
//         processedAt: new Date(),
//       },
//     });

//     if (withdrawal.walletTransactionId) {

//       await tx.walletTransaction.update({
//         where: {
//           id: withdrawal.walletTransactionId,
//         },
//         data: {
//           status: "COMPLETED",
//         },
//       });

//     }

//   }

//   //--------------------------------
//   // Wallet
//   //--------------------------------

//   await tx.wallet.update({
//     where: {
//       userId: transfer.volunteerId,
//     },
//     data: {

//       pending: {
//         decrement: transfer.amount,
//       },

//       withdrawn: {
//         increment: transfer.amount,
//       },

//     },
//   });

//   //--------------------------------
//   // Funding
//   //--------------------------------

//   await tx.projectFunding.update({
//     where: {
//       id: transfer.fundingId,
//     },
//     data: {
//       status: "RELEASED",
//       releasedAt: new Date(),
//     },
//   });

//   //--------------------------------
//   // Volunteer Notification
//   //--------------------------------

//   await tx.notification.create({
//     data: {

//       userId: transfer.volunteerId,

//       title: "Payment Successful",

//       message:
//         "Your payment has been successfully transferred to your bank account.",

//       type: "PAYMENT",

//       link: "/dashboard/wallet",

//     },
//   });

// });


// return NextResponse.json({
//   success: true,
//   message: "Transfer completed successfully.",
// });




await prisma.notification.create({
  data: {
    userId: session.user.id,
    title: "OTP Submitted",
    message:
      "OTP accepted successfully. Waiting for Paystack confirmation.",
    type: "SYSTEM",
  },
});

return NextResponse.json({
  success: true,
  message:
    "OTP accepted successfully. Waiting for Paystack confirmation.",
});


  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
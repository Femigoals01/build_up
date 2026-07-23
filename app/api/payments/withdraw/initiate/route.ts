


// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const { amount } = await req.json();

//     if (!amount || amount <= 0) {
//       return NextResponse.json(
//         { error: "Invalid withdrawal amount." },
//         { status: 400 }
//       );
//     }

//     //------------------------------------------------------
//     // Wallet
//     //------------------------------------------------------

//     const wallet = await prisma.wallet.findUnique({
//       where: {
//         userId: session.user.id,
//       },
//     });

//     if (!wallet) {
//       return NextResponse.json(
//         { error: "Wallet not found." },
//         { status: 404 }
//       );
//     }

//     if (wallet.available < amount) {
//       return NextResponse.json(
//         { error: "Insufficient wallet balance." },
//         { status: 400 }
//       );
//     }

//     //------------------------------------------------------
//     // Bank Account
//     //------------------------------------------------------

//     const bank = await prisma.bankAccount.findUnique({
//       where: {
//         userId: session.user.id,
//       },
//     });

//     if (!bank) {
//       return NextResponse.json(
//         { error: "Please add your bank account first." },
//         { status: 400 }
//       );
//     }

//     if (!bank.paystackRecipientCode) {
//       return NextResponse.json(
//         {
//           error:
//             "Recipient has not been registered with Paystack."
//         },
//         { status: 400 }
//       );
//     }

//     //------------------------------------------------------
//     // Create withdrawal request
//     //------------------------------------------------------

//     const withdrawal = await prisma.withdrawalRequest.create({
//       data: {
//         userId: session.user.id,
//         amount,

//         bankName: bank.bankName,
//         accountName: bank.accountName,
//         accountNumber: bank.accountNumber,

//         paystackRecipientCode:
//           bank.paystackRecipientCode,

//         status: "PROCESSING",
//       },
//     });

//     //------------------------------------------------------
//     // Create transfer record
//     //------------------------------------------------------

//     const transfer = await prisma.transfer.create({
//       data: {
//         withdrawalId: withdrawal.id,
//         volunteerId: session.user.id,
//         amount,
//         status: "PROCESSING",
//       },
//     });

//     //------------------------------------------------------
//     // Update withdrawal with transfer
//     //------------------------------------------------------

//     await prisma.withdrawalRequest.update({
//       where: {
//         id: withdrawal.id,
//       },
//       data: {
//         transferId: transfer.id,
//       },
//     });

//     //------------------------------------------------------
//     // Move Wallet Money
//     //------------------------------------------------------

//     await prisma.wallet.update({
//       where: {
//         userId: session.user.id,
//       },
//       data: {
//         available: {
//           decrement: amount,
//         },
//         pending: {
//           increment: amount,
//         },
//       },
//     });

//     //------------------------------------------------------
//     // Wallet Transaction
//     //------------------------------------------------------

//     await prisma.walletTransaction.create({
//       data: {
//         userId: session.user.id,
//         amount,
//         type: "WITHDRAWAL",
//         status: "PROCESSING",
//         description: "Withdrawal initiated",
//       },
//     });

//     //------------------------------------------------------
//     // Paystack Transfer
//     //------------------------------------------------------

//     const response = await fetch(
//       `${process.env.PAYSTACK_BASE_URL}/transfer`,
//       {
//         method: "POST",

//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },

//         body: JSON.stringify({
//           source: "balance",

//           amount,

//           recipient: bank.paystackRecipientCode,

//           reason: "BuildUp Wallet Withdrawal",

//           reference: transfer.id,
//         }),
//       }
//     );

//     const data = await response.json();

//     //------------------------------------------------------
//     // Paystack Failed
//     //------------------------------------------------------

//     if (!data.status) {
//       await prisma.transfer.update({
//         where: {
//           id: transfer.id,
//         },
//         data: {
//           status: "FAILED",
//         },
//       });

//       await prisma.withdrawalRequest.update({
//         where: {
//           id: withdrawal.id,
//         },
//         data: {
//           status: "FAILED",
//           failureReason:
//             data.message ?? "Transfer failed",
//         },
//       });

//       await prisma.wallet.update({
//         where: {
//           userId: session.user.id,
//         },
//         data: {
//           available: {
//             increment: amount,
//           },
//           pending: {
//             decrement: amount,
//           },
//         },
//       });

//       return NextResponse.json(
//         {
//           error:
//             data.message ?? "Unable to process withdrawal.",
//         },
//         { status: 400 }
//       );
//     }

//     //------------------------------------------------------
//     // Save Paystack Data
//     //------------------------------------------------------

//     await prisma.transfer.update({
//       where: {
//         id: transfer.id,
//       },
//       data: {
//         paystackTransferCode:
//           data.data.transfer_code,

//         paystackReference:
//           data.data.reference,
//       },
//     });

//     await prisma.withdrawalRequest.update({
//       where: {
//         id: withdrawal.id,
//       },
//       data: {
//         paystackTransferCode:
//           data.data.transfer_code,
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Withdrawal initiated.",
//     });

//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       {
//         error: "Internal Server Error",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }









import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {
  try {
    //------------------------------------------------------
    // Session
    //------------------------------------------------------

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    //------------------------------------------------------
    // Body
    //------------------------------------------------------

    // const { fundingId } = await req.json();


    const { transferId } = await req.json();

if (!transferId) {
    return NextResponse.json(
        { error: "Transfer ID is required." },
        { status: 400 }
    );
}

   

    //------------------------------------------------------
    // Existing Transfer
    //------------------------------------------------------

    // const transfer = await prisma.transfer.findFirst({
    //   where: {
    //     fundingId,
    //   },
    //   include: {
    //     funding: true,
    //   },
    // });


    const transfer = await prisma.transfer.findUnique({
    where:{
        id: transferId,
    },
    include:{
        funding:true,
    }
});

    if (!transfer) {
      return NextResponse.json(
        {
          error: "Transfer record not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (!transfer.funding) {
      return NextResponse.json(
        {
          error: "Funding record missing.",
        },
        {
          status: 404,
        }
      );
    }

    //------------------------------------------------------
    // Prevent duplicate payout
    //------------------------------------------------------

    // if (
    //   transfer.status === "PROCESSING" ||
    //   transfer.status === "SUCCESS"
    // ) {
    //   return NextResponse.json({
    //     success: true,
    //     message: "Transfer already initiated.",
    //   });
    // }


    if (
    transfer.status !== "PENDING"
)
{
    return NextResponse.json({
        success:true,
        message:"Transfer already initiated."
    });
}

    //------------------------------------------------------
    // Volunteer Bank Account
    //------------------------------------------------------

    const bank = await prisma.bankAccount.findUnique({
      where: {
        userId: transfer.volunteerId,
      },
    });

    if (!bank) {
      return NextResponse.json(
        {
          error: "Volunteer bank account not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (!bank.paystackRecipientCode) {
      return NextResponse.json(
        {
          error:
            "Volunteer bank account has not been registered with Paystack.",
        },
        {
          status: 400,
        }
      );
    }

    //------------------------------------------------------
    // Funding Validation
    //------------------------------------------------------

    if (
      transfer.funding.status !== "TRANSFER_PENDING"
    ) {
      return NextResponse.json(
        {
          error:
            "Funding is not awaiting transfer.",
        },
        {
          status: 400,
        }
      );
    }


    //------------------------------------------------------
    // Mark transfer as processing
    //------------------------------------------------------

    await prisma.transfer.update({
      where: {
        id: transfer.id,
      },
      data: {
        status: "PROCESSING",
        
      },
    });

    await prisma.projectFunding.update({
      where: {
        id: transfer.fundingId,
      },
      data: {
        status: "TRANSFER_PENDING",
      },
    });


    //------------------------------------------------------
    // Prevent duplicate Withdrawal Requests
    //------------------------------------------------------

    const existingWithdrawal =
      await prisma.withdrawalRequest.findFirst({
        where: {
          transferId: transfer.id,
        },
      });

    if (existingWithdrawal) {
      return NextResponse.json({
        success: true,
        message: "Transfer already initiated.",
      });
    }

    //------------------------------------------------------
    // Create Withdrawal Request
    //------------------------------------------------------

    const withdrawal =
      await prisma.withdrawalRequest.create({
        data: {
          userId: transfer.volunteerId,

          transferId: transfer.id,

          amount: transfer.amount,

          bankName: bank.bankName,

          accountName: bank.accountName,

          accountNumber: bank.accountNumber,

          paystackRecipientCode:
            bank.paystackRecipientCode,

          status: "PROCESSING",
        },
      });


    // await prisma.transfer.update({
    //   where: {
    //     id: transfer.id,
    //   },
    //   data: {

    //   },
    // });
    //------------------------------------------------------
    // Initiate Paystack Transfer
    //------------------------------------------------------

    const response = await fetch(
      `${process.env.PAYSTACK_BASE_URL}/transfer`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,

          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          source: "balance",

          // amount: transfer.amount,
          amount: Math.round(transfer.amount),

          recipient:
            bank.paystackRecipientCode,

          reason:
            "BuildUp Project Payment",

          reference: transfer.id,
        }),
      }
    );

    const data = await response.json();

    console.log("PAYSTACK TRANSFER RESPONSE");

    console.log(data);

    //------------------------------------------------------
    // Paystack Error
    //------------------------------------------------------

    if (!data.status) {

      await prisma.transfer.update({
        where: {
          id: transfer.id,
        },
        data: {
          status: "FAILED",

          failureReason:
            data.message ??
            "Transfer initiation failed",
        },
      });

      await prisma.withdrawalRequest.update({
        where: {
          id: withdrawal.id,
        },
        data: {
          status: "FAILED",

          failureReason:
            data.message ??
            "Transfer initiation failed",
        },
      });

      return NextResponse.json(
        {
          error:
            data.message ??
            "Unable to initiate transfer.",
        },
        {
          status: 400,
        }
      );
    }



    //------------------------------------------------------
    // Save Paystack Transfer Details
    //------------------------------------------------------

    await prisma.transfer.update({
      where: {
        id: transfer.id,
      },
      data: {
        paystackTransferCode:
          data.data.transfer_code,

        paystackReference:
          data.data.reference,
      },
    });

    await prisma.withdrawalRequest.update({
      where: {
        id: withdrawal.id,
      },
      data: {
        paystackTransferCode:
          data.data.transfer_code,
      },
    });

    //------------------------------------------------------
    // Notify Volunteer
    //------------------------------------------------------

    await prisma.notification.create({


      data: {
        userId: transfer.volunteerId,

        title: "Payment Processing",

        message:
          "Your payment has been initiated and is being processed by Paystack. You will receive another notification once it reaches your bank account.",

        type: "PAYMENT",

        link: "/dashboard/wallet",
      },
    });

    console.log(
      `Transfer initiated ${transfer.id}`
    );


    //------------------------------------------------------
    // Return Success
    //------------------------------------------------------

    return NextResponse.json({
      success: true,

      message:
        "Transfer initiated successfully.",
    });


  } catch (error) {
    console.error(
      "AUTOMATIC PAYOUT INITIATE ERROR:",
      error
    );

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
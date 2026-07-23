




// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import { pusherServer } from "@/lib/pusher-server";
// import { sendEmail } from "@/lib/sendEmail";


// type RespondBody = {
//   submissionId?: string;
//   projectId?: string;
//   volunteerId?: string;
//   action?: "approve" | "reject";
//   feedback?: string;
// };

// async function notifyUser(userId: string) {
//   try {
//     await pusherServer.trigger(
//       `private-user-notifications-${userId}`,
//       "notification:new",
//       { userId }
//     );
//   } catch (error) {
//     console.error("Failed to push notification:", error);
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body: RespondBody = await req.json();

//     const submissionId = body.submissionId?.trim();
//     const action = body.action;
//     const feedback = body.feedback?.trim() || "";

//     if (!submissionId || !action) {
//       return NextResponse.json(
//         { error: "Submission ID and action are required." },
//         { status: 400 }
//       );
//     }

//     if (action !== "approve" && action !== "reject") {
//       return NextResponse.json({ error: "Invalid action." }, { status: 400 });
//     }

//     if (action === "reject" && !feedback) {
//       return NextResponse.json(
//         { error: "Revision feedback is required." },
//         { status: 400 }
//       );
//     }

//     const submission = await prisma.projectSubmission.findUnique({
//       where: { id: submissionId },
//       include: {
//         project: {
//           include: {
//             applications: true,
//             chat: true,
//           },
//         },
//         volunteer: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//       },
//     });

//     if (!submission) {
//       return NextResponse.json(
//         { error: "Submission not found." },
//         { status: 404 }
//       );
//     }

//     if (submission.project.organizationId !== session.user.id) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     if (submission.status !== "PENDING") {
//       return NextResponse.json(
//         { error: "This submission has already been reviewed." },
//         { status: 400 }
//       );
//     }

//     // =========================
//     // REVISION REQUEST
//     // =========================

//     if (action === "reject") {
//       await prisma.$transaction(async (tx) => {
//         await tx.projectSubmission.update({
//           where: { id: submission.id },
//           data: {
//             status: "REJECTED",
//             feedback,
//             reviewedAt: new Date(),
//           },
//         });

// //         try {
// //   await fetch(
// //     `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/transfer/initiate`,
// //     {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({
// //         fundingId: funding.id,
// //       }),
// //     }
// //   );
// // } catch (err) {
// //   console.error("Automatic payout failed:", err);
// // }

//         await tx.projectSubmissionComment.create({
//           data: {
//             submissionId: submission.id,
//             userId: session.user.id,
//             message: feedback,
//           },
//         });

//         await tx.notification.create({
//           data: {
//             userId: submission.volunteerId,
//             title: "Revision requested",
//             message: `Your submission for "${submission.project.title}" needs revision. Please check the feedback and resubmit.`,
//             type: "SUBMISSION",
//             link: `/dashboard/volunteer/projects/${submission.projectId}`,
//           },
//         });

//         if (submission.project.chat) {
//           await tx.chatMessage.create({
//             data: {
//               chatId: submission.project.chat.id,
//               senderId: session.user.id,
//               content: `🔁 Revision requested: ${feedback}`,
//             },
//           });

//           await tx.chatMessage.create({
//             data: {
//               chatId: submission.project.chat.id,
//               content:
//                 "🔔 Revision requested. The volunteer has been notified and can submit an updated version.",
//               isSystem: true,
//             },
//           });
//         }
//       });

//       await notifyUser(submission.volunteerId);


// //       try {
// //   await fetch(
// //     `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/withdraw/initiate`,
// //     {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({
// //         fundingId: funding.id,
// //       }),
// //     }
// //   );
// // } catch (err) {
// //   console.error("Automatic payout failed:", err);
// // }

//       await sendEmail({
//         to: submission.volunteer.email,
//         subject: "Revision requested on your BuildUp submission",
//         text: `Revision was requested for "${submission.project.title}". Feedback: ${feedback}`,
//         html: `
//           <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px;">
//             <h2 style="color:#dc2626;">
//               🔁 Revision Requested
//             </h2>

//             <p style="line-height:1.7;color:#475569;">
//               Hi ${submission.volunteer.name || "there"},
//             </p>

//             <p style="line-height:1.7;color:#475569;">
//               Your submission for:
//             </p>

//             <div style="background:#f8fafc;padding:16px;border-radius:16px;margin:16px 0;">
//               <strong style="font-size:18px;color:#0f172a;">
//                 ${submission.project.title}
//               </strong>
//             </div>

//             <p style="line-height:1.7;color:#475569;">
//               requires some updates before approval.
//             </p>

//             <div style="background:#fef2f2;padding:16px;border-radius:16px;margin-top:20px;">
//               <strong style="display:block;margin-bottom:8px;color:#991b1b;">
//                 Feedback:
//               </strong>

//               <p style="margin:0;color:#7f1d1d;">
//                 ${feedback}
//               </p>
//             </div>

//             <a
//               href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/volunteer/projects/${submission.projectId}"
//               style="
//                 display:inline-block;
//                 margin-top:24px;
//                 background:#2563eb;
//                 color:white;
//                 padding:12px 18px;
//                 border-radius:12px;
//                 text-decoration:none;
//                 font-weight:bold;
//               "
//             >
//               View Project
//             </a>
//           </div>
//         `,
//       });

//       return NextResponse.json({ success: true });
//     }

//     // =========================
//     // APPROVAL FLOW
//     // =========================

//     const funding = await prisma.projectFunding.findUnique({
//       where: {
//         projectId: submission.projectId,
//       },
//     });

//     if (!funding) {
//       return NextResponse.json(
//         { error: "Funding record not found for this project." },
//         { status: 404 }
//       );
//     }

//     if (funding.status !== "HELD") {
//       return NextResponse.json(
//         {
//           error:
//             "Project funds must be HELD before approval can release payment.",
//         },
//         { status: 400 }
//       );
//     }

//     const acceptedApplication = submission.project.applications.find(
//       (application) =>
//         application.volunteerId === submission.volunteerId &&
//         (application.status === "ACCEPTED" ||
//           application.status === "COMPLETED")
//     );

//     if (!acceptedApplication) {
//       return NextResponse.json(
//         { error: "No accepted application found for this volunteer." },
//         { status: 400 }
//       );
//     }

//     await prisma.$transaction(async (tx) => {
//       await tx.projectSubmission.update({
//         where: { id: submission.id },
//         data: {
//           status: "APPROVED",
//           feedback: feedback || null,
//           reviewedAt: new Date(),
//         },
//       });


//       await fetch(
//    `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/transfer/initiate`,
//    {
//       method:"POST",
//       headers:{
//          "Content-Type":"application/json",
//       },
//       body: JSON.stringify({
//           fundingId: funding.id
//       })
//    }
// );

//       // await tx.projectFunding.update({
//       //   where: { id: funding.id },
//       //   data: {
//       //     status: "RELEASED",
//       //     volunteerId: submission.volunteerId,
//       //     releasedAt: new Date(),
//       //   },
//       // });

//       // await tx.wallet.upsert({
//       //   where: {
//       //     userId: submission.volunteerId,
//       //   },
//       //   update: {
//       //     balance: {
//       //       increment: funding.volunteerAmount,
//       //     },
//       //   },
//       //   create: {
//       //     userId: submission.volunteerId,
//       //     balance: funding.volunteerAmount,
//       //     pending: 0,
//       //     withdrawn: 0,
//       //   },
//       // });

//       // await tx.walletTransaction.create({
//       //   data: {
//       //     userId: submission.volunteerId,
//       //     projectId: submission.projectId,
//       //     type: "PROJECT_EARNING",
//       //     amount: funding.volunteerAmount,
//       //     status: "COMPLETED",
//       //     description: `Earning released for completed project: ${submission.project.title}`,
//       //   },
//       // });

//       // await tx.walletTransaction.create({
//       //   data: {
//       //     userId: session.user.id,
//       //     projectId: submission.projectId,
//       //     type: "PLATFORM_FEE",
//       //     amount: funding.platformFee,
//       //     status: "COMPLETED",
//       //     description: `BuildUp 18% platform fee for project: ${submission.project.title}`,
//       //   },
//       // });




//       await tx.projectFunding.update({
//   where: { id: funding.id },
//   data: {
//     status: "TRANSFER_PENDING",
//     volunteerId: submission.volunteerId,
//   },
// });

// const wallet = await tx.wallet.upsert({
//   where: {
//     userId: submission.volunteerId,
//   },
//   update: {
//     pending: {
//       increment: funding.volunteerAmount,
//     },
//   },
//   create: {
//     userId: submission.volunteerId,
//     available: 0,
//     pending: funding.volunteerAmount,
//     withdrawn: 0,
//   },
// });

// await tx.walletTransaction.create({
//   data: {
//     userId: submission.volunteerId,
//     projectId: submission.projectId,
//     type: "PROJECT_RELEASED",
//     amount: funding.volunteerAmount,
//     status: "PROCESSING",
//     description: `Escrow released for ${submission.project.title}`,
//   },
// });

// await tx.transfer.create({
//   data: {
//     fundingId: funding.id,
//     volunteerId: submission.volunteerId,
//     amount: funding.volunteerAmount,
//     status: "PROCESSING",
//   },
// });



//       await tx.notification.create({
//         data: {
//           userId: submission.volunteerId,
//           title: "Submission approved",
//           message: `Your work for "${submission.project.title}" was approved.`,
//           type: "SUBMISSION",
//           link: `/dashboard/volunteer/projects/${submission.projectId}`,
//         },
//       });

//       await tx.notification.create({
//         data: {
//           userId: submission.volunteerId,
//           title: "Project approved",
//           // message: `Your earning for "${submission.project.title}" has been added to your wallet.`,

//           message: "Your payment is being processed and will arrive in your bank account shortly.",
//           type: "PAYMENT",
//           link: "/dashboard/wallet",
//         },
//       });

//       if (submission.project.chat) {
//         await tx.chatMessage.create({
//           data: {
//             chatId: submission.project.chat.id,
//             senderId: session.user.id,
//             content:
//               "✅ Work approved. Payment released. Proceeding to completion verification.",
//           },
//         });

//         await tx.chatMessage.create({
//           data: {
//             chatId: submission.project.chat.id,
//             content:
//               "🎉 Submission approved. The organization can now finalize project completion and review.",
//             isSystem: true,
//           },
//         });
//       }
//     });


//     const transfer = await prisma.transfer.findFirst({
//   where: {
//     fundingId: funding.id,
//   },
// });

// if (transfer) {
//   try {
//     await fetch(
//       `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/withdraw/initiate`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           transferId: transfer.id,
//         }),
//       }
//     );
//   } catch (err) {
//     console.error("Automatic payout failed:", err);
//   }
// }

//     await notifyUser(submission.volunteerId);

//     await sendEmail({
//       to: submission.volunteer.email,
//       subject: "Your BuildUp submission was approved",
//       text: `Your submission for "${submission.project.title}" was approved and Your payment is being processed.

// BuildUp has initiated transfer to your verified bank account.

// Most transfers arrive within a few minutes.`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px;">
//           <h2 style="color:#16a34a;">
//             🎉 Submission Approved
//           </h2>

//           <p style="line-height:1.7;color:#475569;">
//             Hi ${submission.volunteer.name || "there"},
//           </p>

//           <p style="line-height:1.7;color:#475569;">
//             Your work for:
//           </p>

//           <div style="background:#ecfdf5;padding:16px;border-radius:16px;margin:16px 0;">
//             <strong style="font-size:18px;color:#166534;">
//               ${submission.project.title}
//             </strong>
//           </div>

//           <p style="line-height:1.7;color:#475569;">
//             has been approved successfully.
//           </p>

//           <div style="background:#eff6ff;padding:16px;border-radius:16px;margin-top:20px;">
//             <strong style="color:#1d4ed8;">
//               💰 Your payment is now being processed.

// BuildUp has initiated the transfer to your verified bank account.

// Most transfers arrive within a few minutes depending on Paystack.
//             </strong>
//           </div>

//           <a
//             href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/wallet"
//             style="
//               display:inline-block;
//               margin-top:24px;
//               background:#2563eb;
//               color:white;
//               padding:12px 18px;
//               border-radius:12px;
//               text-decoration:none;
//               font-weight:bold;
//             "
//           >
//             Open Wallet
//           </a>
//         </div>
//       `,
//     });

//     return NextResponse.json({
//       success: true,
//       redirectTo: `/dashboard/organization/projects/${submission.projectId}/complete`,
//     });
//   } catch (error) {
//     console.error("SUBMISSION RESPOND ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to respond to submission." },
//       { status: 500 }
//     );
//   }
// }




















import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher-server";
import { sendEmail } from "@/lib/sendEmail";

type RespondBody = {
  submissionId?: string;
  projectId?: string;
  volunteerId?: string;
  action?: "approve" | "reject";
  feedback?: string;
};

async function notifyUser(userId: string) {
  try {
    await pusherServer.trigger(
      `private-user-notifications-${userId}`,
      "notification:new",
      { userId }
    );
  } catch (error) {
    console.error("Failed to push notification:", error);
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: RespondBody = await req.json();

    const submissionId = body.submissionId?.trim();
    const action = body.action;
    const feedback = body.feedback?.trim() || "";

    if (!submissionId || !action) {
      return NextResponse.json(
        { error: "Submission ID and action are required." },
        { status: 400 }
      );
    }

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "Invalid action." },
        { status: 400 }
      );
    }

    if (action === "reject" && !feedback) {
      return NextResponse.json(
        { error: "Revision feedback is required." },
        { status: 400 }
      );
    }

    const submission = await prisma.projectSubmission.findUnique({
      where: {
        id: submissionId,
      },
      include: {
        project: {
          include: {
            applications: true,
            chat: true,
          },
        },
        volunteer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found." },
        { status: 404 }
      );
    }

    if (submission.project.organizationId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    if (submission.status !== "PENDING") {
      return NextResponse.json(
        {
          error: "This submission has already been reviewed.",
        },
        { status: 400 }
      );
    }

    // ===================================================
    // REVISION REQUEST
    // ===================================================

    if (action === "reject") {
      await prisma.$transaction(async (tx) => {
        await tx.projectSubmission.update({
          where: {
            id: submission.id,
          },
          data: {
            status: "REJECTED",
            feedback,
            reviewedAt: new Date(),
          },
        });

        await tx.projectSubmissionComment.create({
          data: {
            submissionId: submission.id,
            userId: session.user.id,
            message: feedback,
          },
        });

        await tx.notification.create({
          data: {
            userId: submission.volunteerId,
            title: "Revision requested",
            message: `Your submission for "${submission.project.title}" needs revision. Please check the feedback and resubmit.`,
            type: "SUBMISSION",
            link: `/dashboard/volunteer/projects/${submission.projectId}`,
          },
        });

        if (submission.project.chat) {
          await tx.chatMessage.create({
            data: {
              chatId: submission.project.chat.id,
              senderId: session.user.id,
              content: `🔁 Revision requested: ${feedback}`,
            },
          });

          await tx.chatMessage.create({
            data: {
              chatId: submission.project.chat.id,
              isSystem: true,
              content:
                "🔔 Revision requested. The volunteer has been notified and can submit an updated version.",
            },
          });
        }
      });

      await notifyUser(submission.volunteerId);

      try {
        await sendEmail({
          to: submission.volunteer.email,
          subject: "Revision requested on your BuildUp submission",
          text: `Revision was requested for "${submission.project.title}". Feedback: ${feedback}`,
          html: `
          <div style="font-family: Arial, sans-serif; max-width:620px; margin:0 auto; padding:24px;">

            <h2 style="color:#dc2626;">
              🔁 Revision Requested
            </h2>

            <p>
              Hi ${submission.volunteer.name || "there"},
            </p>

            <p>
              Your submission for:
            </p>

            <div style="background:#f8fafc;padding:16px;border-radius:16px;margin:16px 0;">
              <strong style="font-size:18px;">
                ${submission.project.title}
              </strong>
            </div>

            <p>
              requires some updates before approval.
            </p>

            <div style="background:#fef2f2;padding:16px;border-radius:16px;">
              <strong>
                Feedback
              </strong>

              <p>
                ${feedback}
              </p>
            </div>

            <a
              href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/volunteer/projects/${submission.projectId}"
              style="
                display:inline-block;
                margin-top:24px;
                background:#2563eb;
                color:#fff;
                padding:12px 18px;
                border-radius:12px;
                text-decoration:none;
                font-weight:bold;
              "
            >
              View Project
            </a>

          </div>
          `,
        });
      } catch (err) {
        console.error("Failed to send revision email:", err);
      }

      return NextResponse.json({
        success: true,
      });
    }

    // ===================================================
    // APPROVAL FLOW
    // ===================================================


    const funding = await prisma.projectFunding.findUnique({
      where: {
        projectId: submission.projectId,
      },
    });

    if (!funding) {
      return NextResponse.json(
        { error: "Funding record not found for this project." },
        { status: 404 }
      );
    }

    if (funding.status !== "HELD") {
      return NextResponse.json(
        {
          error:
            "Project funds must be HELD before approval can release payment.",
        },
        { status: 400 }
      );
    }

    const acceptedApplication = submission.project.applications.find(
      (application) =>
        application.volunteerId === submission.volunteerId &&
        (application.status === "ACCEPTED" ||
          application.status === "COMPLETED")
    );

    const bankAccount = await prisma.bankAccount.findUnique({
      where: {
        userId: submission.volunteerId,
      },
    });

    if (!bankAccount) {
      return NextResponse.json(
        {
          error: "Volunteer has not added a bank account.",
        },
        {
          status: 400,
        }
      );
    }

    if (!acceptedApplication) {
      return NextResponse.json(
        { error: "No accepted application found for this volunteer." },
        { status: 400 }
      );
    }

    const transfer = await prisma.$transaction(async (tx) => {
      await tx.projectSubmission.update({
        where: {
          id: submission.id,
        },
        data: {
          status: "APPROVED",
          feedback: feedback || null,
          reviewedAt: new Date(),
        },
      });

      await tx.projectFunding.update({
        where: {
          id: funding.id,
        },
        data: {
          status: "APPROVED",
          volunteerId: submission.volunteerId,
        },
      });

      await tx.wallet.upsert({
        where: {
          userId: submission.volunteerId,
        },
        update: {
          pending: {
            increment: funding.volunteerAmount,
          },
        },
        create: {
          userId: submission.volunteerId,
          available: 0,
          pending: funding.volunteerAmount,
          withdrawn: 0,
        },
      });

      await tx.walletTransaction.create({
        data: {
          userId: submission.volunteerId,
          projectId: submission.projectId,
          type: "PROJECT_RELEASED",
          amount: funding.volunteerAmount,
          status: "PROCESSING",
          description: `Escrow released for ${submission.project.title}`,
        },
      });

            const walletTransaction = await tx.walletTransaction.create({
        data: {
          userId: submission.volunteerId,
          projectId: submission.projectId,
          type: "PROJECT_RELEASED",
          amount: funding.volunteerAmount,
          status: "PROCESSING",
          description: `Escrow released for ${submission.project.title}`,
        },
      });

      const createdTransfer = await tx.transfer.create({
        data: {
          fundingId: funding.id,
          volunteerId: submission.volunteerId,
          amount: funding.volunteerAmount,
          status: "PENDING",
        },
      });

      await tx.withdrawalRequest.create({
        data: {
          userId: submission.volunteerId,

          amount: funding.volunteerAmount,

          status: "PENDING",

          bankName: bankAccount.bankName,

          accountName: bankAccount.accountName,

          accountNumber: bankAccount.accountNumber,

          paystackRecipientCode:
            bankAccount.paystackRecipientCode,

          transferId: createdTransfer.id,

          walletTransactionId:
            walletTransaction.id,
        },
      });







      await tx.notification.create({
        data: {
          userId: submission.volunteerId,
          title: "Submission approved",
          message: `Your work for "${submission.project.title}" was approved.`,
          type: "SUBMISSION",
          link: `/dashboard/volunteer/projects/${submission.projectId}`,
        },
      });

      await tx.notification.create({
        data: {
          userId: submission.volunteerId,
          title: "Project Approved",
          message:
            "Your project has been approved. BuildUp will release your payment shortly after a final review.",
          type: "PAYMENT",
          link: "/dashboard/wallet",
        },
      });

      if (submission.project.chat) {
        await tx.chatMessage.create({
          data: {
            chatId: submission.project.chat.id,
            senderId: session.user.id,
            content:
              "✅ Work approved. Payment is awaiting BuildUp approval for release.",
          },
        });

        await tx.chatMessage.create({
          data: {
            chatId: submission.project.chat.id,
            isSystem: true,
            content:
              "🎉 Submission approved. Payment is awaiting release by BuildUp.",
          },
        });
      }

      return createdTransfer;
    });




    /*
    |--------------------------------------------------------------------------
    | AFTER DATABASE TRANSACTION
    |--------------------------------------------------------------------------
    | Safe to call external APIs now
    */

    // try {
    //   const appUrl =
    //     process.env.APP_URL ??
    //     process.env.NEXT_PUBLIC_APP_URL ??
    //     "http://localhost:3000";

    //   const payoutResponse = await fetch(
    //     `${appUrl}/api/payments/withdraw/initiate`,
    //     {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",

    //         // VERY IMPORTANT
    //         Cookie: req.headers.get("cookie") ?? "",
    //       },

    //       body: JSON.stringify({
    //         transferId: transfer.id,
    //       }),
    //     }
    //   );

    //   if (!payoutResponse.ok) {
    //     const error = await payoutResponse.text();

    //     console.error(
    //       "Automatic payout failed:",
    //       payoutResponse.status,
    //       error
    //     );
    //   }
    // } catch (err) {
    //   console.error("Automatic payout failed:", err);
    // }






    await notifyUser(submission.volunteerId);

    try {
      await sendEmail({
        to: submission.volunteer.email,
        subject: "Congratulations! Your BuildUp submission was approved",
        text: `Your submission for "${submission.project.title}" was approved.

            Your work has been approved.

            Your payment is now awaiting admin processing.

            Once our finance team starts the transfer you will receive another notification.`,

        html: `
      <div style="font-family: Arial, sans-serif; max-width:620px; margin:0 auto; padding:24px;">

        <h2 style="color:#16a34a;">
          🎉 Submission Approved
        </h2>

        <p>
          Hi ${submission.volunteer.name || "there"},
        </p>

        <p>Your work for:</p>

        <div style="background:#ecfdf5;padding:16px;border-radius:16px;margin:16px 0;">
          <strong style="font-size:18px;color:#166534;">
            ${submission.project.title}
          </strong>
        </div>

        <p>
          has been approved successfully.
        </p>

        <div style="background:#eff6ff;padding:16px;border-radius:16px;margin-top:20px;">
          <strong style="color:#1d4ed8;">
            💰 Payment Processing
          </strong>

          <p style="margin-top:10px;">
            Payment has been approved and is awaiting admin processing.

            <br><br>

            Your project has been approved successfully. <br>

            Your payment has been approved and is awaiting release by the BuildUp finance team. <br>

            You will receive another notification as soon as the transfer to your bank account has been initiated.

            <br><br>

            Most transfers arrive within a few minutes depending on Paystack.
          </p>
        </div>

        <a
          href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/wallet"
          style="
            display:inline-block;
            margin-top:24px;
            background:#2563eb;
            color:#fff;
            padding:12px 18px;
            border-radius:12px;
            text-decoration:none;
            font-weight:bold;
          "
        >
          Open Wallet
        </a>

      </div>
    `,
      });
    } catch (err) {
      console.error("Failed to send approval email:", err);
    }

    return NextResponse.json({
      success: true,
      redirectTo: `/dashboard/organization/projects/${submission.projectId}/complete`,
    });

  } catch (error) {
    console.error("SUBMISSION RESPOND ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to respond to submission.",
      },
      {
        status: 500,
      }
    );
  }
}
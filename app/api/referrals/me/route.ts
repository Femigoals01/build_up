


// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export async function GET() {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.email) {
//     return NextResponse.json(
//       { error: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   const user = await prisma.user.findUnique({
//     where: {
//       email: session.user.email,
//     },
//     include: {
//       referralsMade: {
//         include: {
//           referred: true,
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//       },
//     },
//   });

//   if (!user) {
//     return NextResponse.json(
//       { error: "User not found" },
//       { status: 404 }
//     );
//   }

//   return NextResponse.json({
//     referralCode: user.referralCode,
//     referralCount: user.referralCount,
//     referralBalance: user.referralBalance,

//     referrals:
//       user.referralsMade.map((ref) => ({
//         id: ref.referred.id,
//         name: ref.referred.name,
//         createdAt: ref.createdAt,
//       })) || [],
//   });
// }





import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        referralsMade: {
          include: {
            referred: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                profileImageUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      referralCode: user.referralCode,
      referralCount: user.referralCount,
      referralBalance: user.referralBalance,

      referrals: user.referralsMade.map((referral) => ({
        id: referral.id,
        createdAt: referral.createdAt,
        rewardPaid: referral.rewardPaid,

        referredUser: {
          id: referral.referred.id,
          name: referral.referred.name,
          email: referral.referred.email,
          role: referral.referred.role,
          profileImageUrl: referral.referred.profileImageUrl,
          joinedAt: referral.referred.createdAt,
        },
      })),
    });
  } catch (error) {
    console.error("REFERRAL DASHBOARD ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load referral data" },
      { status: 500 }
    );
  }
}
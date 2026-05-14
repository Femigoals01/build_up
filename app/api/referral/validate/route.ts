


// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET(req: NextRequest) {
//   try {
//     const code =
//       req.nextUrl.searchParams.get("code")?.trim().toUpperCase();

//     if (!code) {
//       return NextResponse.json(
//         { valid: false },
//         { status: 400 }
//       );
//     }

//     const user = await prisma.user.findUnique({
//       where: {
//         referralCode: code,
//       },
//       select: {
//         id: true,
//       },
//     });

//     return NextResponse.json({
//       valid: !!user,
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       { valid: false },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const code = body.code?.trim().toUpperCase();

    if (!code) {
      return NextResponse.json(
        { error: "Referral code required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        referralCode: code,
      },
      select: {
        id: true,
        name: true,
        referralCode: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid referral code" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      user,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
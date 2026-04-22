

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const { mentorId } = await req.json();

//     if (!mentorId) {
//       return NextResponse.json(
//         { error: "Mentor ID is required" },
//         { status: 400 }
//       );
//     }

//     // ✅ 1. APPROVE MENTOR → SET ROLE
//     await prisma.user.update({
//       where: { id: mentorId },
//       data: {
//         role: "MENTOR",
//       },
//     });

//     // ✅ 2. SEND NOTIFICATION
//     await prisma.notification.create({
//       data: {
//         userId: mentorId,
//         title: "Mentor Approved 🎉",
//         message:
//           "Your mentor account has been approved! You can now access your mentor dashboard.",
//         type: "SYSTEM",
//       },
//     });

//     return NextResponse.json(
//       { message: "Mentor approved successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Approve Mentor Error:", error);
//     return NextResponse.json(
//       { error: "Failed to approve mentor" },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { mentorId } = await req.json();

    if (!mentorId) {
      return NextResponse.json(
        { error: "Mentor ID is required" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: mentorId },
      data: {
        role: "MENTOR",
        mentorStatus: "APPROVED",
      },
    });

    await prisma.notification.create({
      data: {
        userId: mentorId,
        title: "Mentor Approved 🎉",
        message:
          "Your mentor account has been approved! You can now access your mentor dashboard.",
        type: "SYSTEM",
      },
    });

    return NextResponse.json(
      { message: "Mentor approved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Approve Mentor Error:", error);
    return NextResponse.json(
      { error: "Failed to approve mentor" },
      { status: 500 }
    );
  }
}
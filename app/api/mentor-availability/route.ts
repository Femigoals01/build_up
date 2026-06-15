

// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// const VALID_DAYS = [
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
//   "Sunday",
// ];

// function isValidTime(value: string) {
//   return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
// }

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id || session.user.role !== "MENTOR") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const availability = await prisma.mentorAvailability.findMany({
//       where: {
//         mentorId: session.user.id,
//       },
//       orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
//     });

//     return NextResponse.json(availability);
//   } catch (error) {
//     console.error("MENTOR AVAILABILITY GET ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to load availability." },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id || session.user.role !== "MENTOR") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();

//     const dayOfWeek = String(body.dayOfWeek || "").trim();
//     const startTime = String(body.startTime || "").trim();
//     const endTime = String(body.endTime || "").trim();

//     if (!VALID_DAYS.includes(dayOfWeek)) {
//       return NextResponse.json(
//         { error: "Please select a valid day." },
//         { status: 400 }
//       );
//     }

//     if (!isValidTime(startTime) || !isValidTime(endTime)) {
//       return NextResponse.json(
//         { error: "Please use valid time format, for example 09:00." },
//         { status: 400 }
//       );
//     }

//     if (startTime >= endTime) {
//       return NextResponse.json(
//         { error: "End time must be later than start time." },
//         { status: 400 }
//       );
//     }

//     const availability = await prisma.mentorAvailability.create({
//       data: {
//         mentorId: session.user.id,
//         dayOfWeek,
//         startTime,
//         endTime,
//       },
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Availability added successfully.",
//         availability,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("MENTOR AVAILABILITY POST ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to save availability." },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id || session.user.role !== "MENTOR") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();
//     const id = String(body.id || "").trim();

//     if (!id) {
//       return NextResponse.json(
//         { error: "Availability ID is required." },
//         { status: 400 }
//       );
//     }

//     const availability = await prisma.mentorAvailability.findFirst({
//       where: {
//         id,
//         mentorId: session.user.id,
//       },
//     });

//     if (!availability) {
//       return NextResponse.json(
//         { error: "Availability not found." },
//         { status: 404 }
//       );
//     }

//     await prisma.mentorAvailability.delete({
//       where: {
//         id,
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Availability removed successfully.",
//     });
//   } catch (error) {
//     console.error("MENTOR AVAILABILITY DELETE ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to remove availability." },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const VALID_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function isValidTime(value: string) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);

    const mentorId = searchParams.get("mentorId");

    const targetMentorId =
      session.user.role === "MENTOR"
        ? session.user.id
        : mentorId;

    if (!targetMentorId) {
      return NextResponse.json(
        { error: "Mentor ID is required." },
        { status: 400 }
      );
    }

    const availability = await prisma.mentorAvailability.findMany({
      where: {
        mentorId: targetMentorId,
        isActive: true,
      },
      orderBy: [
        { dayOfWeek: "asc" },
        { startTime: "asc" },
      ],
    });

    return NextResponse.json(availability);
  } catch (error) {
    console.error("MENTOR AVAILABILITY GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load availability." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "MENTOR") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const dayOfWeek = String(body.dayOfWeek || "").trim();
    const startTime = String(body.startTime || "").trim();
    const endTime = String(body.endTime || "").trim();

    if (!VALID_DAYS.includes(dayOfWeek)) {
      return NextResponse.json(
        { error: "Please select a valid day." },
        { status: 400 }
      );
    }

    if (!isValidTime(startTime) || !isValidTime(endTime)) {
      return NextResponse.json(
        {
          error:
            "Please use valid time format, for example 09:00.",
        },
        { status: 400 }
      );
    }

    if (startTime >= endTime) {
      return NextResponse.json(
        {
          error:
            "End time must be later than start time.",
        },
        { status: 400 }
      );
    }

    const availability = await prisma.mentorAvailability.create({
      data: {
        mentorId: session.user.id,
        dayOfWeek,
        startTime,
        endTime,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Availability added successfully.",
        availability,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("MENTOR AVAILABILITY POST ERROR:", error);

    return NextResponse.json(
      { error: "Failed to save availability." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "MENTOR") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const id = String(body.id || "").trim();

    if (!id) {
      return NextResponse.json(
        { error: "Availability ID is required." },
        { status: 400 }
      );
    }

    const availability =
      await prisma.mentorAvailability.findFirst({
        where: {
          id,
          mentorId: session.user.id,
        },
      });

    if (!availability) {
      return NextResponse.json(
        { error: "Availability not found." },
        { status: 404 }
      );
    }

    await prisma.mentorAvailability.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Availability removed successfully.",
    });
  } catch (error) {
    console.error("MENTOR AVAILABILITY DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to remove availability." },
      { status: 500 }
    );
  }
}
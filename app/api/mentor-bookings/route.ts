





// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// function isValidTime(value: string) {
//   return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
// }

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const where =
//       session.user.role === "MENTOR"
//         ? { mentorId: session.user.id }
//         : { volunteerId: session.user.id };

//     const bookings = await prisma.mentorBooking.findMany({
//       where,
//       include: {
//         mentor: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             headline: true,
//             profileImageUrl: true,
//           },
//         },
//         volunteer: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             headline: true,
//             profileImageUrl: true,
//           },
//         },
//         project: {
//           select: {
//             id: true,
//             title: true,
//           },
//         },
//       },
//       orderBy: {
//         date: "desc",
//       },
//     });

//     return NextResponse.json(bookings);
//   } catch (error) {
//     console.error("MENTOR BOOKINGS GET ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to load mentor bookings." },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id || session.user.role !== "VOLUNTEER") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();

//     const mentorId = String(body.mentorId || "").trim();
//     const projectId = body.projectId ? String(body.projectId).trim() : null;
//     const date = String(body.date || "").trim();
//     const startTime = String(body.startTime || "").trim();
//     const endTime = String(body.endTime || "").trim();
//     const note = body.note ? String(body.note).trim() : null;

//     if (!mentorId) {
//       return NextResponse.json(
//         { error: "Mentor ID is required." },
//         { status: 400 }
//       );
//     }

//     if (!date) {
//       return NextResponse.json(
//         { error: "Please select a booking date." },
//         { status: 400 }
//       );
//     }

//     if (!isValidTime(startTime) || !isValidTime(endTime)) {
//       return NextResponse.json(
//         { error: "Please select a valid time slot." },
//         { status: 400 }
//       );
//     }

//     if (startTime >= endTime) {
//       return NextResponse.json(
//         { error: "End time must be later than start time." },
//         { status: 400 }
//       );
//     }

//     const mentor = await prisma.user.findFirst({
//       where: {
//         id: mentorId,
//         role: "MENTOR",
//       },
//       select: {
//         id: true,
//       },
//     });

//     if (!mentor) {
//       return NextResponse.json(
//         { error: "Mentor not found." },
//         { status: 404 }
//       );
//     }

//     const bookingDate = new Date(date);

//     if (Number.isNaN(bookingDate.getTime())) {
//       return NextResponse.json(
//         { error: "Invalid booking date." },
//         { status: 400 }
//       );
//     }

//     const existingBooking = await prisma.mentorBooking.findFirst({
//       where: {
//         mentorId,
//         date: bookingDate,
//         startTime,
//         endTime,
//         status: {
//           not: "CANCELLED",
//         },
//       },
//     });

//     if (existingBooking) {
//       return NextResponse.json(
//         { error: "This time slot has already been booked." },
//         { status: 409 }
//       );
//     }

//     const booking = await prisma.mentorBooking.create({
//       data: {
//         mentorId,
//         volunteerId: session.user.id,
//         projectId,
//         date: bookingDate,
//         startTime,
//         endTime,
//         note,
//         status: "PENDING",
//       },
//     });

//     await prisma.notification.create({
//       data: {
//         userId: mentorId,
//         title: "New mentor booking",
//         message: "A volunteer has booked a mentorship session with you.",
//         type: "SYSTEM",
//         link: "/dashboard/mentor/bookings",
//       },
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Mentorship session booked successfully.",
//         booking,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("MENTOR BOOKINGS POST ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to book mentorship session." },
//       { status: 500 }
//     );
//   }
// }

// export async function PATCH(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();

//     const bookingId = String(body.bookingId || "").trim();
//     const status = String(body.status || "").trim();
//     const meetingLink = body.meetingLink
//       ? String(body.meetingLink).trim()
//       : null;

//     const VALID_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED"];

//     if (!bookingId) {
//       return NextResponse.json(
//         { error: "Booking ID is required." },
//         { status: 400 }
//       );
//     }

//     if (!VALID_STATUSES.includes(status)) {
//       return NextResponse.json(
//         { error: "Invalid booking status." },
//         { status: 400 }
//       );
//     }

//     if (session.user.role === "VOLUNTEER" && status !== "CANCELLED") {
//       return NextResponse.json(
//         { error: "Volunteers can only cancel bookings." },
//         { status: 403 }
//       );
//     }

//     const booking = await prisma.mentorBooking.findFirst({
//       where:
//         session.user.role === "MENTOR"
//           ? {
//               id: bookingId,
//               mentorId: session.user.id,
//             }
//           : {
//               id: bookingId,
//               volunteerId: session.user.id,
//             },
//     });

//     if (!booking) {
//       return NextResponse.json(
//         { error: "Booking not found." },
//         { status: 404 }
//       );
//     }

//     const updatedBooking = await prisma.mentorBooking.update({
//       where: {
//         id: bookingId,
//       },
//       data:
//         session.user.role === "MENTOR"
//           ? {
//               status,
//               meetingLink,
//             }
//           : {
//               status: "CANCELLED",
//             },
//     });

//     const notificationUserId =
//       session.user.role === "MENTOR" ? booking.volunteerId : booking.mentorId;

//     await prisma.notification.create({
//       data: {
//         userId: notificationUserId,
//         title:
//           status === "CONFIRMED"
//             ? "Mentorship session confirmed"
//             : "Mentorship session cancelled",
//         message:
//           session.user.role === "VOLUNTEER"
//             ? "A volunteer has cancelled a mentorship session."
//             : status === "CONFIRMED"
//               ? "Your mentorship session has been confirmed by the mentor."
//               : "Your mentorship session has been cancelled by the mentor.",
//         type: "SYSTEM",
//         link:
//           session.user.role === "VOLUNTEER"
//             ? "/dashboard/mentor/bookings"
//             : "/dashboard/volunteer/bookings",
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Booking updated successfully.",
//       booking: updatedBooking,
//     });
//   } catch (error) {
//     console.error("MENTOR BOOKINGS PATCH ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to update mentor booking." },
//       { status: 500 }
//     );
//   }
// }





import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

function isValidTime(value: string) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const where =
      session.user.role === "MENTOR"
        ? { mentorId: session.user.id }
        : { volunteerId: session.user.id };

    const bookings = await prisma.mentorBooking.findMany({
      where,
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            headline: true,
            profileImageUrl: true,
          },
        },
        volunteer: {
          select: {
            id: true,
            name: true,
            email: true,
            headline: true,
            profileImageUrl: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("MENTOR BOOKINGS GET ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load mentor bookings." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "VOLUNTEER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const mentorId = String(body.mentorId || "").trim();
    const projectId = body.projectId ? String(body.projectId).trim() : null;
    const date = String(body.date || "").trim();
    const startTime = String(body.startTime || "").trim();
    const endTime = String(body.endTime || "").trim();
    const note = body.note ? String(body.note).trim() : null;

    if (!mentorId) {
      return NextResponse.json(
        { error: "Mentor ID is required." },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { error: "Please select a booking date." },
        { status: 400 }
      );
    }

    if (!isValidTime(startTime) || !isValidTime(endTime)) {
      return NextResponse.json(
        { error: "Please select a valid time slot." },
        { status: 400 }
      );
    }

    if (startTime >= endTime) {
      return NextResponse.json(
        { error: "End time must be later than start time." },
        { status: 400 }
      );
    }

    const mentor = await prisma.user.findFirst({
      where: {
        id: mentorId,
        role: "MENTOR",
      },
      select: {
        id: true,
      },
    });

    if (!mentor) {
      return NextResponse.json(
        { error: "Mentor not found." },
        { status: 404 }
      );
    }

    const bookingDate = new Date(date);

    if (Number.isNaN(bookingDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid booking date." },
        { status: 400 }
      );
    }

    const existingBooking = await prisma.mentorBooking.findFirst({
      where: {
        mentorId,
        date: bookingDate,
        startTime,
        endTime,
        status: {
          not: "CANCELLED",
        },
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "This time slot has already been booked." },
        { status: 409 }
      );
    }

    const booking = await prisma.mentorBooking.create({
      data: {
        mentorId,
        volunteerId: session.user.id,
        projectId,
        date: bookingDate,
        startTime,
        endTime,
        note,
        status: "PENDING",
      },
    });

    await prisma.notification.create({
      data: {
        userId: mentorId,
        title: "New mentor booking",
        message: "A volunteer has booked a mentorship session with you.",
        type: "SYSTEM",
        link: "/dashboard/mentor/bookings",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Mentorship session booked successfully.",
        booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("MENTOR BOOKINGS POST ERROR:", error);

    return NextResponse.json(
      { error: "Failed to book mentorship session." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const bookingId = String(body.bookingId || "").trim();
    const status = String(body.status || "").trim();
    const meetingLink = body.meetingLink
      ? String(body.meetingLink).trim()
      : null;

    const VALID_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required." },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid booking status." },
        { status: 400 }
      );
    }

    if (session.user.role === "VOLUNTEER" && status !== "CANCELLED") {
      return NextResponse.json(
        { error: "Volunteers can only cancel bookings." },
        { status: 403 }
      );
    }

    if (
      session.user.role !== "MENTOR" &&
      session.user.role !== "VOLUNTEER"
    ) {
      return NextResponse.json(
        { error: "Only mentors and volunteers can update bookings." },
        { status: 403 }
      );
    }

    const booking = await prisma.mentorBooking.findFirst({
      where:
        session.user.role === "MENTOR"
          ? {
              id: bookingId,
              mentorId: session.user.id,
            }
          : {
              id: bookingId,
              volunteerId: session.user.id,
            },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 }
      );
    }

    const updatedBooking = await prisma.mentorBooking.update({
      where: {
        id: bookingId,
      },
      data:
        session.user.role === "MENTOR"
          ? {
              status,
              meetingLink,
            }
          : {
              status: "CANCELLED",
            },
    });

    const notificationUserId =
      session.user.role === "MENTOR" ? booking.volunteerId : booking.mentorId;

    await prisma.notification.create({
      data: {
        userId: notificationUserId,
        title:
          status === "CONFIRMED"
            ? "Mentorship session confirmed"
            : status === "COMPLETED"
              ? "Mentorship session completed"
              : "Mentorship session cancelled",
        message:
          session.user.role === "VOLUNTEER"
            ? "A volunteer has cancelled a mentorship session."
            : status === "CONFIRMED"
              ? "Your mentorship session has been confirmed by the mentor."
              : status === "COMPLETED"
                ? "Your mentorship session has been marked as completed."
                : "Your mentorship session has been cancelled by the mentor.",
        type: "SYSTEM",
        link:
          session.user.role === "VOLUNTEER"
            ? "/dashboard/mentor/bookings"
            : "/dashboard/volunteer/bookings",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Booking updated successfully.",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("MENTOR BOOKINGS PATCH ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update mentor booking." },
      { status: 500 }
    );
  }
}
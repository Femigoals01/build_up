

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";


// export async function PATCH(
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     // 🔥 Next.js 16 async params
//     const { id } = await context.params;

//     // 🔐 AUTH CHECK (organization only)
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== "ORGANIZATION") {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const body = await req.json();
//     const { status } = body;

//     if (!["ACCEPTED", "REJECTED"].includes(status)) {
//       return NextResponse.json(
//         { error: "Invalid status" },
//         { status: 400 }
//       );
//     }

//     // ✅ Update application + fetch related data
//     const updatedApplication = await prisma.application.update({
//       where: { id },
//       data: { status },
//       include: {
//         volunteer: true,
//         project: true,
//       },
//     });

//     // 🔔 CREATE NOTIFICATION FOR VOLUNTEER
//     await prisma.notification.create({
//       data: {
//         userId: updatedApplication.volunteerId,
//         title:
//           status === "ACCEPTED"
//             ? "Application Accepted 🎉"
//             : "Application Update",
//         message:
//           status === "ACCEPTED"
//             ? `You’ve been accepted to work on "${updatedApplication.project.title}".`
//             : `Your application for "${updatedApplication.project.title}" was not selected.`,
//       },
//     });

//     return NextResponse.json(updatedApplication);
//   } catch (error) {
//     console.error("APPLICATION STATUS UPDATE FAILED:", error);

//     return NextResponse.json(
//       { error: "Failed to update status" },
//       { status: 500 }
//     );
//   }
// }




// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// export async function PATCH(
//   req: Request,
//   context: { params: Promise<{ id: string }> }
// ) {
//   try {
//     // 🔥 Next.js 16 async params
//     const { id } = await context.params;

//     // 🔐 AUTH CHECK (organization only)
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== "ORGANIZATION") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await req.json();
//     const { status } = body;

//     if (!["ACCEPTED", "REJECTED"].includes(status)) {
//       return NextResponse.json(
//         { error: "Invalid status" },
//         { status: 400 }
//       );
//     }

//     // ✅ Update application
//     const updatedApplication = await prisma.application.update({
//       where: { id },
//       data: { status },
//       include: {
//         volunteer: true,
//         project: true,
//       },
//     });

//     // 🔔 CREATE NOTIFICATION FOR VOLUNTEER
//     await prisma.notification.create({
//   data: {
//     userId: updatedApplication.volunteerId,
//     title:
//       status === "ACCEPTED"
//         ? "Application Accepted 🎉"
//         : "Application Update",
//     message:
//       status === "ACCEPTED"
//         ? `You’ve been accepted to work on "${updatedApplication.project.title}".`
//         : `Your application for "${updatedApplication.project.title}" was not selected.`,
//     type: "APPLICATION", // ✅ REQUIRED
//     link: `/dashboard/projects`, // ✅ optional but recommended
//   },
// });


//     return NextResponse.json(updatedApplication);
//   } catch (error) {
//     console.error("APPLICATION STATUS UPDATE FAILED:", error);

//     return NextResponse.json(
//       { error: "Failed to update status" },
//       { status: 500 }
//     );
//   }
// }




// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { NotificationType } from "@prisma/client";


// export async function PATCH(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== "ORGANIZATION") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { id } = params;

//     // ✅ Mark project as completed
//     const project = await prisma.project.update({
//       where: { id },
//       data: { status: "COMPLETED" },
//       include: {
//         applications: {
//           where: { status: "ACCEPTED" },
//           include: { volunteer: true },
//         },
//       },
//     });

//     // 🔔 Notify all accepted volunteers
//     const notifications = project.applications.map((app) => ({
//   userId: app.volunteerId,
//   title: "Project Completed 🏁",
//   message: `The project "${project.title}" has been marked as completed. Great work!`,
//   type: NotificationType.PROJECT, // ✅ FIX
//   link: `/portfolio/${app.volunteer.username}`,
// }));


//     if (notifications.length > 0) {
//       await prisma.notification.createMany({
//         data: notifications,
//       });
//     }

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("PROJECT COMPLETION FAILED:", error);
//     return NextResponse.json(
//       { error: "Failed to complete project" },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NotificationType } from "@prisma/client";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ORGANIZATION") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { status } = await req.json();

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        volunteer: true,
        project: true,
      },
    });

    await prisma.notification.create({
      data: {
        userId: updatedApplication.volunteerId,
        title:
          status === "ACCEPTED"
            ? "Application Accepted 🎉"
            : "Application Update",
        message:
          status === "ACCEPTED"
            ? `You’ve been accepted to work on "${updatedApplication.project.title}".`
            : `Your application for "${updatedApplication.project.title}" was not selected.`,
        type: NotificationType.APPLICATION, // ✅ REQUIRED
        link: `/dashboard/projects`, // ✅ OPTIONAL BUT GOOD UX
      },
    });

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error("APPLICATION STATUS UPDATE FAILED:", error);

    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}

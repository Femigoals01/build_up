



// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import nodemailer from "nodemailer";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const session = await getServerSession(authOptions);

//     const name = typeof body.name === "string" ? body.name.trim() : "";
//     const email = typeof body.email === "string" ? body.email.trim() : "";
//     const subject = typeof body.subject === "string" ? body.subject.trim() : "";
//     const category =
//       typeof body.category === "string" && body.category.trim()
//         ? body.category.trim()
//         : null;
//     const message =
//       typeof body.message === "string" ? body.message.trim() : "";

//     if (!name || !email || !subject || !message) {
//       return NextResponse.json(
//         { error: "Name, email, subject, and message are required." },
//         { status: 400 }
//       );
//     }

//     const supportMessage = await prisma.supportMessage.create({
//       data: {
//         name,
//         email,
//         subject,
//         category,
//         message,
//         userId: session?.user?.id ?? null,
//       },
//     });

//     if (
//       process.env.SMTP_HOST &&
//       process.env.SMTP_PORT &&
//       process.env.SMTP_USER &&
//       process.env.SMTP_PASS &&
//       process.env.SMTP_FROM &&
//       process.env.SUPPORT_TO_EMAIL
//     ) {
//       const transporter = nodemailer.createTransport({
//         host: process.env.SMTP_HOST,
//         port: Number(process.env.SMTP_PORT),
//         secure: Number(process.env.SMTP_PORT) === 465,
//         auth: {
//           user: process.env.SMTP_USER,
//           pass: process.env.SMTP_PASS,
//         },
//       });

//       await transporter.sendMail({
//         from: process.env.SMTP_FROM,
//         to: process.env.SUPPORT_TO_EMAIL,
//         replyTo: email,
//         subject: `[BuildUp Support] ${subject}`,
//         text: `
// New support request received

// Name: ${name}
// Email: ${email}
// Category: ${category || "Not specified"}
// Subject: ${subject}

// Message:
// ${message}
//         `,
//         html: `
//           <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
//             <h2 style="margin-bottom: 16px;">New BuildUp Support Request</h2>

//             <p><strong>Name:</strong> ${name}</p>
//             <p><strong>Email:</strong> ${email}</p>
//             <p><strong>Category:</strong> ${category || "Not specified"}</p>
//             <p><strong>Subject:</strong> ${subject}</p>

//             <div style="margin-top: 20px;">
//               <p><strong>Message:</strong></p>
//               <div style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
//                 ${message.replace(/\n/g, "<br />")}
//               </div>
//             </div>
//           </div>
//         `,
//       });
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Support request submitted successfully.",
//         supportMessage,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Support submission error:", error);

//     return NextResponse.json(
//       { error: "Something went wrong while submitting your request." },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import nodemailer from "nodemailer";
import { createUniqueSupportTicketNo } from "@/lib/references";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const session = await getServerSession(authOptions);

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";

    const category =
      typeof body.category === "string" && body.category.trim()
        ? body.category.trim()
        : null;

    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    const projectId =
      typeof body.projectId === "string" && body.projectId.trim()
        ? body.projectId.trim()
        : null;

    const priority =
      typeof body.priority === "string" && body.priority.trim()
        ? body.priority.trim().toUpperCase()
        : "NORMAL";

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Name, email, subject, and message are required." },
        { status: 400 }
      );
    }

    const ticketNo = await createUniqueSupportTicketNo();

    const supportMessage = await prisma.supportMessage.create({
      data: {
        ticketNo,
        name,
        email,
        subject,
        category,
        message,
        priority,
        projectId,
        userId: session?.user?.id ?? null,
      },
    });

    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM &&
      process.env.SUPPORT_TO_EMAIL
    ) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.SUPPORT_TO_EMAIL,
        replyTo: email,
        subject: `[BuildUp Support ${ticketNo}] ${subject}`,
        text: `
New support request received

Ticket No: ${ticketNo}
Name: ${name}
Email: ${email}
Category: ${category || "Not specified"}
Priority: ${priority}
Project ID: ${projectId || "Not linked"}
Subject: ${subject}

Message:
${message}
        `,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
            <h2 style="margin-bottom: 16px;">New BuildUp Support Request</h2>

            <div style="padding: 14px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; margin-bottom: 18px;">
              <p style="margin: 0; font-size: 13px; color: #2563eb; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">
                Ticket Reference
              </p>
              <p style="margin: 6px 0 0; font-size: 20px; font-weight: 800; color: #0f172a;">
                ${ticketNo}
              </p>
            </div>

            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Category:</strong> ${category || "Not specified"}</p>
            <p><strong>Priority:</strong> ${priority}</p>
            <p><strong>Project ID:</strong> ${projectId || "Not linked"}</p>
            <p><strong>Subject:</strong> ${subject}</p>

            <div style="margin-top: 20px;">
              <p><strong>Message:</strong></p>
              <div style="padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
                ${message.replace(/\n/g, "<br />")}
              </div>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Support request submitted successfully.",
        ticketNo,
        supportMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Support submission error:", error);

    return NextResponse.json(
      { error: "Something went wrong while submitting your request." },
      { status: 500 }
    );
  }
}



// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import {
//   generatePasswordResetToken,
//   sendPasswordResetEmail,
// } from "@/lib/passwordReset";

// export const runtime = "nodejs";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const email = String(body?.email || "").trim().toLowerCase();

//     if (!email) {
//       return NextResponse.json(
//         { error: "Email is required." },
//         { status: 400 }
//       );
//     }

//     const user = await prisma.user.findUnique({
//       where: { email },
//       select: {
//         id: true,
//         email: true,
//       },
//     });

//     // Do not reveal whether the email exists
//     if (!user) {
//       return NextResponse.json({
//         message:
//           "If an account with that email exists, a password reset link has been sent.",
//       });
//     }

//     const { token, expiry } = generatePasswordResetToken();

//     await prisma.user.update({
//       where: { id: user.id },
//       data: {
//         passwordResetToken: token,
//         passwordResetExpiry: expiry,
//       },
//     });

//     await sendPasswordResetEmail(user.email, token);

//     return NextResponse.json({
//       message:
//         "If an account with that email exists, a password reset link has been sent.",
//     });
//   } catch (error) {
//     console.error("Forgot password error:", error);
//     return NextResponse.json(
//       { error: "Failed to process forgot password request." },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  generatePasswordResetToken,
  sendPasswordResetEmail,
} from "@/lib/passwordReset";
import { consumeRateLimit, getClientIp } from "@/lib/rateLimit";

const FORGOT_PASSWORD_LIMIT = 3;
const FORGOT_PASSWORD_WINDOW_MS = 15 * 60 * 1000;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }

    const clientIp = getClientIp(req);

    const ipLimit = consumeRateLimit(
      `forgot-password:ip:${clientIp}`,
      FORGOT_PASSWORD_LIMIT,
      FORGOT_PASSWORD_WINDOW_MS
    );

    if (!ipLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many reset requests. Try again in ${ipLimit.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const emailLimit = consumeRateLimit(
      `forgot-password:email:${email}`,
      FORGOT_PASSWORD_LIMIT,
      FORGOT_PASSWORD_WINDOW_MS
    );

    if (!emailLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many reset requests for this email. Try again in ${emailLimit.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
      },
    });

    // Do not reveal whether the email exists
    if (!user) {
      return NextResponse.json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    const { token, expiry } = generatePasswordResetToken();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: token,
        passwordResetExpiry: expiry,
      },
    });

    await sendPasswordResetEmail(user.email, token);

    return NextResponse.json({
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process forgot password request." },
      { status: 500 }
    );
  }
}
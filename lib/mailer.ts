

// import nodemailer from "nodemailer";

// export function getMailer() {
//   return nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: Number(process.env.SMTP_PORT || 587),
//     secure: Number(process.env.SMTP_PORT) === 465,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });
// }

// export async function sendVerificationOtpEmail(email: string, otp: string) {
//   const transporter = getMailer();

//   await transporter.sendMail({
//     from: process.env.SMTP_FROM,
//     to: email,
//     subject: "Verify your BuildUp account",
//     html: `
//       <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
//         <h2 style="margin-bottom: 8px;">Verify your BuildUp account</h2>
//         <p>Welcome to BuildUp.</p>
//         <p>Your verification code is:</p>
//         <div style="font-size: 28px; font-weight: 700; letter-spacing: 6px; margin: 16px 0; color: #2563eb;">
//           ${otp}
//         </div>
//         <p>This code expires in 10 minutes.</p>
//         <p>If you did not create this account, you can ignore this email.</p>
//       </div>
//     `,
//   });
// }





import nodemailer from "nodemailer";

export function getMailer() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendVerificationOtpEmail(email: string, otp: string) {
  const transporter = getMailer();

  const from = process.env.SMTP_FROM;

  if (!from) {
    throw new Error("SMTP_FROM is not configured");
  }

  const info = await transporter.sendMail({
    from,
    to: email,
    subject: "Verify your BuildUp account",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Verify your BuildUp account</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing: 5px;">${otp}</h1>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  });

  console.log("Email sent:", info.messageId);
}
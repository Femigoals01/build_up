

import nodemailer from "nodemailer";

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

const smtpPort = Number(process.env.SMTP_PORT || 587);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS ||
    !process.env.SMTP_FROM
  ) {
    console.warn("Email not sent: SMTP environment variables are missing.");
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
    text: text || subject,
  });
}
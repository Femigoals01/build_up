// import crypto from "crypto";
// import nodemailer from "nodemailer";

// const RESET_EXPIRY_MINUTES = 30;

// export function generatePasswordResetToken() {
//   const token = crypto.randomBytes(32).toString("hex");
//   const expiry = new Date(Date.now() + RESET_EXPIRY_MINUTES * 60 * 1000);

//   return { token, expiry };
// }

// export async function sendPasswordResetEmail(email: string, token: string) {
//   const host = process.env.SMTP_HOST;
//   const port = Number(process.env.SMTP_PORT || 587);
//   const user = process.env.SMTP_USER;
//   const pass = process.env.SMTP_PASS;
//   const from = process.env.SMTP_FROM || process.env.SMTP_USER;
//   const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

//   if (!host || !user || !pass || !from) {
//     throw new Error("SMTP configuration is missing.");
//   }

//   const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`;

//   const transporter = nodemailer.createTransport({
//     host,
//     port,
//     secure: port === 465,
//     auth: {
//       user,
//       pass,
//     },
//   });

//   await transporter.sendMail({
//     from,
//     to: email,
//     subject: "Reset your BuildUp password",
//     html: `
//       <div style="font-family: Arial, Helvetica, sans-serif; color: #0f172a; line-height: 1.6;">
//         <h2 style="margin-bottom: 8px;">Reset your password</h2>
//         <p style="margin-top: 0;">
//           We received a request to reset your BuildUp password.
//         </p>

//         <p>
//           Click the button below to choose a new password:
//         </p>

//         <p style="margin: 24px 0;">
//           <a
//             href="${resetUrl}"
//             style="
//               display: inline-block;
//               background: #2563eb;
//               color: white;
//               text-decoration: none;
//               padding: 12px 20px;
//               border-radius: 12px;
//               font-weight: 700;
//             "
//           >
//             Reset Password
//           </a>
//         </p>

//         <p>If the button does not work, copy and paste this link into your browser:</p>
//         <p style="word-break: break-all; color: #2563eb;">${resetUrl}</p>

//         <p>This link expires in ${RESET_EXPIRY_MINUTES} minutes.</p>
//         <p>If you did not request this, you can ignore this email.</p>
//       </div>
//     `,
//   });
// }




import crypto from "crypto";
import nodemailer from "nodemailer";

const RESET_EXPIRY_MINUTES = 30;

export function generatePasswordResetToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + RESET_EXPIRY_MINUTES * 60 * 1000);

  return { token, expiry };
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  if (!host || !user || !pass || !from) {
    throw new Error("SMTP configuration is missing.");
  }

  const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from,
    to: email,
    subject: "Reset your BuildUp password",
    html: `
      <div style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
        <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
          <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:24px;overflow:hidden;box-shadow:0 18px 50px rgba(15,23,42,0.08);">
            
            <div style="background:linear-gradient(135deg,#2563eb 0%,#4f46e5 100%);padding:28px 32px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.12);padding:12px 18px;border-radius:18px;">
                <div style="font-size:24px;font-weight:800;letter-spacing:-0.02em;color:#ffffff;">
                  BuildUp
                </div>
                <div style="margin-top:4px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#dbeafe;">
                  Real projects. Real growth.
                </div>
              </div>
            </div>

            <div style="padding:36px 32px;">
              <div style="text-align:center;">
                <div style="font-size:44px;line-height:1;">🔐</div>
                <h1 style="margin:18px 0 8px;font-size:30px;line-height:1.2;font-weight:800;color:#0f172a;">
                  Reset your password
                </h1>
                <p style="margin:0 auto;max-width:470px;font-size:15px;line-height:1.7;color:#475569;">
                  We received a request to reset your <strong>BuildUp</strong> password. Click the button below to choose a new one.
                </p>
              </div>

              <div style="margin:30px 0;text-align:center;">
                <a
                  href="${resetUrl}"
                  style="
                    display:inline-block;
                    background:linear-gradient(135deg,#2563eb 0%,#4f46e5 100%);
                    color:#ffffff;
                    text-decoration:none;
                    padding:14px 24px;
                    border-radius:16px;
                    font-size:15px;
                    font-weight:700;
                    box-shadow:0 10px 25px rgba(37,99,235,0.22);
                  "
                >
                  Reset Password
                </a>
              </div>

              <div style="border:1px solid #e2e8f0;border-radius:18px;background:#f8fafc;padding:18px 20px;">
                <p style="margin:0 0 8px;font-size:13px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#64748b;">
                  Reset Link
                </p>
                <p style="margin:0;word-break:break-all;font-size:14px;line-height:1.7;color:#2563eb;">
                  ${resetUrl}
                </p>
              </div>

              <div style="margin-top:20px;">
                <p style="margin:0;font-size:14px;line-height:1.8;color:#475569;">
                  This link expires in <strong>${RESET_EXPIRY_MINUTES} minutes</strong>.
                </p>
                <p style="margin:12px 0 0;font-size:14px;line-height:1.8;color:#64748b;">
                  If you did not request this, you can ignore this email and your password will stay the same.
                </p>
              </div>
            </div>

            <div style="border-top:1px solid #e2e8f0;background:#f8fafc;padding:18px 24px;text-align:center;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:#94a3b8;">
                BuildUp · Learn through real work
              </p>
            </div>
          </div>
        </div>
      </div>
    `,
  });
}





import crypto from "crypto";
import nodemailer from "nodemailer";

const OTP_EXPIRY_MINUTES = 10;

export function generateEmailOtp() {
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  return { otp, expiry };
}

export async function sendVerificationEmail(email: string, otp: string) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!host || !user || !pass || !from) {
    throw new Error("SMTP configuration is missing.");
  }

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
    subject: "Verify your BuildUp account",
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
                <div style="font-size:44px;line-height:1;">📩</div>
                <h1 style="margin:18px 0 8px;font-size:30px;line-height:1.2;font-weight:800;color:#0f172a;">
                  Verify your email
                </h1>
                <p style="margin:0 auto;max-width:460px;font-size:15px;line-height:1.7;color:#475569;">
                  Welcome to <strong>BuildUp</strong>. Use the verification code below to activate your account and continue your journey.
                </p>
              </div>

              <div style="margin:30px 0;padding:24px;border:1px solid #bfdbfe;border-radius:22px;background:linear-gradient(180deg,#eff6ff 0%,#ffffff 100%);text-align:center;">
                <div style="font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#2563eb;">
                  Verification Code
                </div>
                <div style="margin-top:14px;font-size:34px;font-weight:800;letter-spacing:10px;color:#1d4ed8;">
                  ${otp}
                </div>
              </div>

              <div style="border:1px solid #e2e8f0;border-radius:18px;background:#f8fafc;padding:18px 20px;">
                <p style="margin:0;font-size:14px;line-height:1.7;color:#475569;">
                  This code expires in <strong>${OTP_EXPIRY_MINUTES} minutes</strong>.
                </p>
              </div>

              <div style="margin-top:24px;">
                <p style="margin:0;font-size:14px;line-height:1.8;color:#64748b;">
                  If you did not create a BuildUp account, you can safely ignore this email.
                </p>
              </div>
            </div>

            <div style="border-top:1px solid #e2e8f0;background:#f8fafc;padding:18px 24px;text-align:center;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:#94a3b8;">
                BuildUp · Real experience beyond certificates
              </p>
            </div>
          </div>
        </div>
      </div>
    `,
  });
}
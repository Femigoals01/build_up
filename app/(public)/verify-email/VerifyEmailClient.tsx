

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BuildUpLogo from "@/components/brand/BuildUpLogo";

const RESEND_COOLDOWN = 60;

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Verification failed.");
        setLoading(false);
        return;
      }

      setMessage("Email verified successfully.");
      setTimeout(() => {
        router.push(
          email
            ? `/verify-email/success?email=${encodeURIComponent(email)}`
            : "/verify-email/success"
        );
      }, 900);
    } catch (err) {
      console.error("Verify email error:", err);
      setError("Something went wrong while verifying your email.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setError("Missing email address. Please return to registration.");
      return;
    }

    if (cooldown > 0) return;

    setError("");
    setMessage("");
    setResending(true);

    try {
      const res = await fetch("/api/auth/resend-email-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to resend verification code.");
        setResending(false);
        return;
      }

      setMessage("A new verification code has been sent to your email.");
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      console.error("Resend verification error:", err);
      setError("Something went wrong while resending the code.");
    } finally {
      setResending(false);
    }
  };

  const resendDisabled = resending || !email || cooldown > 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-8">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 lg:grid-cols-2">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Secure your BuildUp account
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-900">
              Verify your email.
              <br />
              Unlock your account.
              <br />
              Start building.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
              We sent a verification code to your email address. Enter it to
              activate your BuildUp account and continue to login.
            </p>
          </div>
        </section>

        <section className="w-full">
          <div className="mx-auto max-w-md overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <div className="relative px-6 py-8 md:px-8 md:py-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_22%)]" />

              <div className="relative z-10">
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center">
                    <BuildUpLogo
                      href="/"
                      showTagline={false}
                      className="justify-center"
                    />
                  </div>

                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Verify Your Email
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Enter the 6-digit code sent to your email address.
                  </p>
                </div>

                <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                    Verification Email
                  </p>
                  <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                    {email || "No email detected"}
                  </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-5">
                  {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  {message && (
                    <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                      {message}
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter 6-digit code"
                      className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-center text-lg tracking-[0.35em] outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      required
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      The code expires in 10 minutes.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    {loading ? "Verifying..." : "Verify Email"}
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendDisabled}
                    className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 px-5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resending
                      ? "Resending..."
                      : cooldown > 0
                      ? `Resend Code in ${cooldown}s`
                      : "Resend Code"}
                  </button>

                  <p className="text-center text-sm text-slate-500">
                    Already verified?{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      Go to login
                    </Link>
                  </p>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-500">
                    Complete verification to activate your BuildUp account.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-md rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm lg:hidden">
            <h3 className="text-base font-semibold text-slate-900">
              Why verify?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Verification helps secure your BuildUp account and ensures only
              confirmed users can access projects and dashboards.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
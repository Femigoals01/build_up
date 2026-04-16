
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import BuildUpLogo from "@/components/brand/BuildUpLogo";

// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     setLoading(true);

//     try {
//       const res = await fetch("/api/auth/forgot-password", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: email.trim().toLowerCase(),
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data?.error || "Failed to send reset link.");
//         setLoading(false);
//         return;
//       }

//       setMessage(
//         data?.message ||
//           "If an account with that email exists, a password reset link has been sent."
//       );
//     } catch (error) {
//       console.error("Forgot password page error:", error);
//       setError("Something went wrong while sending the reset link.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-8">
//       <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 lg:grid-cols-2">
//         <section className="hidden lg:block">
//           <div className="max-w-xl">
//             <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
//               <span className="h-2 w-2 rounded-full bg-blue-600" />
//               Recover your BuildUp account
//             </div>

//             <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-900">
//               Reset your password.
//               <br />
//               Recover access.
//               <br />
//               Keep building.
//             </h1>

//             <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
//               Enter the email address connected to your BuildUp account and we
//               will send you a secure password reset link.
//             </p>
//           </div>
//         </section>

//         <section className="w-full">
//           <div className="mx-auto max-w-md overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
//             <div className="relative px-6 py-8 md:px-8 md:py-10">
//               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_22%)]" />

//               <div className="relative z-10">
//                 <div className="mb-8 text-center">
//                   <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center">
//                     <BuildUpLogo
//                       href="/"
//                       showTagline={false}
//                       className="justify-center"
//                     />
//                   </div>

//                   <h1 className="text-3xl font-bold tracking-tight text-slate-900">
//                     Forgot Password
//                   </h1>

//                   <p className="mt-2 text-sm leading-6 text-slate-500">
//                     We’ll email you a reset link.
//                   </p>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-5">
//                   {error && (
//                     <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//                       {error}
//                     </div>
//                   )}

//                   {message && (
//                     <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
//                       {message}
//                     </div>
//                   )}

//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-slate-800">
//                       Email Address
//                     </label>
//                     <input
//                       type="email"
//                       placeholder="Enter your email"
//                       className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       required
//                     />
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
//                   >
//                     {loading ? "Sending..." : "Send Reset Link"}
//                   </button>

//                   <p className="text-center text-sm text-slate-500">
//                     Remembered your password?{" "}
//                     <Link
//                       href="/login"
//                       className="font-semibold text-blue-600 hover:underline"
//                     >
//                       Back to login
//                     </Link>
//                   </p>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }



"use client";

import { useState } from "react";
import Link from "next/link";
import BuildUpLogo from "@/components/brand/BuildUpLogo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successState, setSuccessState] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to send reset link.");
        setLoading(false);
        return;
      }

      setSubmittedEmail(normalizedEmail);
      setMessage(
        data?.message ||
          "If an account with that email exists, a password reset link has been sent."
      );
      setSuccessState(true);
    } catch (error) {
      console.error("Forgot password page error:", error);
      setError("Something went wrong while sending the reset link.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendAgain = async () => {
    if (!submittedEmail) return;

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: submittedEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to resend reset link.");
        setLoading(false);
        return;
      }

      setMessage(
        data?.message ||
          "If an account with that email exists, a password reset link has been sent."
      );
    } catch (error) {
      console.error("Forgot password resend error:", error);
      setError("Something went wrong while resending the reset link.");
    } finally {
      setLoading(false);
    }
  };

  if (successState) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-8">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center">
          <section className="w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <div className="relative px-6 py-10 md:px-10 md:py-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_22%)]" />

              <div className="relative z-10 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
                  <BuildUpLogo
                    href="/"
                    showTagline={false}
                    className="justify-center"
                  />
                </div>

                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-4xl">
                  📧
                </div>

                <p className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Check Your Email
                </p>

                <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  Password reset link sent
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 md:text-base">
                  If an account with that email exists, we’ve sent a secure link
                  to reset your BuildUp password.
                </p>

                {submittedEmail && (
                  <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                      Email Address
                    </p>
                    <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                      {submittedEmail}
                    </p>
                  </div>
                )}

                {message && (
                  <div className="mx-auto mt-5 max-w-xl rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="mx-auto mt-5 max-w-xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleSendAgain}
                    disabled={loading}
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    {loading ? "Sending..." : "Send Again"}
                  </button>

                  <Link
                    href="/login"
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Back to Login
                  </Link>
                </div>

                <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                  <p className="text-sm font-semibold text-slate-900">
                    What to do next
                  </p>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                    <li>• Open your email inbox and look for the BuildUp reset email</li>
                    <li>• Check your spam or promotions folder if you do not see it</li>
                    <li>• Use the reset link to choose a new password</li>
                  </ul>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setSuccessState(false);
                      setError("");
                      setMessage("");
                    }}
                    className="text-sm font-semibold text-blue-600 hover:underline"
                  >
                    Use another email
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-8">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 lg:grid-cols-2">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Recover your BuildUp account
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-900">
              Reset your password.
              <br />
              Recover access.
              <br />
              Keep building.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
              Enter the email address connected to your BuildUp account and we
              will send you a secure password reset link.
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
                    Forgot Password
                  </h1>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    We’ll email you a reset link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>

                  <p className="text-center text-sm text-slate-500">
                    Remembered your password?{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      Back to login
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
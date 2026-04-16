

// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { useMemo, useState } from "react";
// import Link from "next/link";
// import BuildUpLogo from "@/components/brand/BuildUpLogo";

// export default function ResetPasswordClient() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");

//     if (!token) {
//       setError("Missing reset token.");
//       return;
//     }

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch("/api/auth/reset-password", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           token,
//           password,
//           confirmPassword,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data?.error || "Failed to reset password.");
//         setLoading(false);
//         return;
//       }

//       setMessage("Password reset successful. Redirecting to login...");

//       setTimeout(() => {
//         router.push("/login");
//       }, 1200);
//     } catch (error) {
//       console.error("Reset password page error:", error);
//       setError("Something went wrong while resetting your password.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-8">
//       <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center">
//         <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
//           <div className="relative px-6 py-8 md:px-8 md:py-10">
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_22%)]" />

//             <div className="relative z-10">
//               <div className="mb-8 text-center">
//                 <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center">
//                   <BuildUpLogo
//                     href="/"
//                     showTagline={false}
//                     className="justify-center"
//                   />
//                 </div>

//                 <h1 className="text-3xl font-bold tracking-tight text-slate-900">
//                   Create New Password
//                 </h1>

//                 <p className="mt-2 text-sm leading-6 text-slate-500">
//                   Choose a secure new password for your BuildUp account.
//                 </p>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-5">
//                 {error && (
//                   <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//                     {error}
//                   </div>
//                 )}

//                 {message && (
//                   <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
//                     {message}
//                   </div>
//                 )}

//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-slate-800">
//                     New Password
//                   </label>

//                   <div className="relative">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Enter new password"
//                       className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-20 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                     />

//                     <button
//                       type="button"
//                       onClick={() => setShowPassword((prev) => !prev)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-600 hover:text-blue-700"
//                     >
//                       {showPassword ? "Hide" : "Show"}
//                     </button>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-slate-800">
//                     Confirm New Password
//                   </label>
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Re-enter new password"
//                     className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading || !token}
//                   className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
//                 >
//                   {loading ? "Resetting..." : "Reset Password"}
//                 </button>

//                 <p className="text-center text-sm text-slate-500">
//                   Back to{" "}
//                   <Link
//                     href="/login"
//                     className="font-semibold text-blue-600 hover:underline"
//                   >
//                     login
//                   </Link>
//                 </p>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }



// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { useMemo, useState } from "react";
// import Link from "next/link";
// import BuildUpLogo from "@/components/brand/BuildUpLogo";

// export default function ResetPasswordClient() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");

//     if (!token) {
//       setError("Missing reset token.");
//       return;
//     }

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch("/api/auth/reset-password", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           token,
//           password,
//           confirmPassword,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data?.error || "Failed to reset password.");
//         setLoading(false);
//         return;
//       }

//       setMessage("Password reset successful. Redirecting...");

//       setTimeout(() => {
//         router.push("/reset-password/success");
//       }, 900);
//     } catch (error) {
//       console.error("Reset password page error:", error);
//       setError("Something went wrong while resetting your password.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-8">
//       <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center">
//         <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
//           <div className="relative px-6 py-8 md:px-8 md:py-10">
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_22%)]" />

//             <div className="relative z-10">
//               <div className="mb-8 text-center">
//                 <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center">
//                   <BuildUpLogo
//                     href="/"
//                     showTagline={false}
//                     className="justify-center"
//                   />
//                 </div>

//                 <h1 className="text-3xl font-bold tracking-tight text-slate-900">
//                   Create New Password
//                 </h1>

//                 <p className="mt-2 text-sm leading-6 text-slate-500">
//                   Choose a secure new password for your BuildUp account.
//                 </p>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-5">
//                 {error && (
//                   <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//                     {error}
//                   </div>
//                 )}

//                 {message && (
//                   <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
//                     {message}
//                   </div>
//                 )}

//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-slate-800">
//                     New Password
//                   </label>

//                   <div className="relative">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Enter new password"
//                       className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-20 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                     />

//                     <button
//                       type="button"
//                       onClick={() => setShowPassword((prev) => !prev)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-600 hover:text-blue-700"
//                     >
//                       {showPassword ? "Hide" : "Show"}
//                     </button>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="mb-2 block text-sm font-semibold text-slate-800">
//                     Confirm New Password
//                   </label>
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Re-enter new password"
//                     className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading || !token}
//                   className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
//                 >
//                   {loading ? "Resetting..." : "Reset Password"}
//                 </button>

//                 <p className="text-center text-sm text-slate-500">
//                   Back to{" "}
//                   <Link
//                     href="/login"
//                     className="font-semibold text-blue-600 hover:underline"
//                   >
//                     login
//                   </Link>
//                 </p>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }




"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BuildUpLogo from "@/components/brand/BuildUpLogo";

type TokenStatus = "checking" | "valid" | "invalid";

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [tokenStatus, setTokenStatus] = useState<TokenStatus>("checking");
  const [tokenError, setTokenError] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function validateToken() {
      if (!token) {
        if (!cancelled) {
          setTokenStatus("invalid");
          setTokenError("This reset link is missing or invalid.");
        }
        return;
      }

      try {
        const res = await fetch("/api/auth/validate-reset-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok || !data?.valid) {
          if (!cancelled) {
            setTokenStatus("invalid");
            setTokenError(
              data?.error || "This reset link is invalid or has expired."
            );
          }
          return;
        }

        if (!cancelled) {
          setTokenStatus("valid");
        }
      } catch (err) {
        console.error("Reset token validation error:", err);

        if (!cancelled) {
          setTokenStatus("invalid");
          setTokenError("We could not validate this reset link.");
        }
      }
    }

    validateToken();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Missing reset token.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (
          data?.error?.toLowerCase().includes("invalid") ||
          data?.error?.toLowerCase().includes("expired")
        ) {
          setTokenStatus("invalid");
          setTokenError(data?.error || "This reset link is invalid or has expired.");
          setLoading(false);
          return;
        }

        setError(data?.error || "Failed to reset password.");
        setLoading(false);
        return;
      }

      setMessage("Password reset successful. Redirecting...");

      setTimeout(() => {
        router.push("/reset-password/success");
      }, 900);
    } catch (err) {
      console.error("Reset password page error:", err);
      setError("Something went wrong while resetting your password.");
    } finally {
      setLoading(false);
    }
  };

  if (tokenStatus === "checking") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-8">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center">
          <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center">
              <BuildUpLogo
                href="/"
                showTagline={false}
                className="justify-center"
              />
            </div>

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-4xl">
              🔐
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Verifying your reset link
            </h1>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              Please wait while we securely validate your password reset link.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (tokenStatus === "invalid") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-8">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center">
          <section className="w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <div className="relative px-6 py-10 md:px-10 md:py-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.08),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.06),transparent_22%)]" />

              <div className="relative z-10 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
                  <BuildUpLogo
                    href="/"
                    showTagline={false}
                    className="justify-center"
                  />
                </div>

                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl">
                  ⚠️
                </div>

                <p className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
                  Reset Link Invalid
                </p>

                <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  This password reset link can’t be used
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 md:text-base">
                  {tokenError ||
                    "This reset link is invalid, expired, or has already been used."}
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/forgot-password"
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Request New Link
                  </Link>

                  <Link
                    href="/login"
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Back to Login
                  </Link>
                </div>

                <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                  <p className="text-sm font-semibold text-slate-900">
                    Why this may happen
                  </p>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                    <li>• The reset link has expired</li>
                    <li>• The link was already used once</li>
                    <li>• The link may be incomplete or broken</li>
                  </ul>
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
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center">
        <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
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
                  Create New Password
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Choose a secure new password for your BuildUp account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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
                    New Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-20 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter new password"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>

                <p className="text-center text-sm text-slate-500">
                  Back to{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    login
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
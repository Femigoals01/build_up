


// "use client";

// import { signIn, getSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function LoginPage() {
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     const res = await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     });

//     if (res?.error) {
//       setError("Invalid email or password");
//       setLoading(false);
//       return;
//     }

//     // ✅ Fetch session to read role
//     const session = await getSession();

//     setLoading(false);

//     if (!session?.user?.role) {
//       setError("Unable to determine user role");
//       return;
//     }

//     // ✅ Role-based redirect
//     switch (session.user.role) {
//       case "ADMIN":
//         router.push("/dashboard/admin");
//         break;

//       case "MENTOR":
//         router.push("/dashboard/mentor");
//         break;

//       case "ORGANIZATION":
//         router.push("/dashboard/organization");
//         break;

//       case "VOLUNTEER":
//       default:
//         router.push("/dashboard/volunteer");
//         break;
//     }
//   };

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-gray-50">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-xl shadow w-96"
//       >
//         <h1 className="text-2xl font-bold mb-4 text-center">
//           Login to BuildUp
//         </h1>

//         {error && (
//           <p className="text-red-600 mb-4 text-sm text-center">
//             {error}
//           </p>
//         )}

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full border rounded px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-500"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full border rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-60"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </main>
//   );
// }




"use client";

import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    const session = await getSession();

    setLoading(false);

    if (!session?.user?.role) {
      setError("Unable to determine user role");
      return;
    }

    switch (session.user.role) {
      case "ADMIN":
        router.push("/dashboard/admin");
        break;
      case "MENTOR":
        router.push("/dashboard/mentor");
        break;
      case "ORGANIZATION":
        router.push("/dashboard/organization");
        break;
      case "VOLUNTEER":
      default:
        router.push("/dashboard/volunteer");
        break;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-8">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 lg:grid-cols-2">
        {/* LEFT PANEL */}
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Welcome back to BuildUp
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Proof of skill.
              <br />
              Real experience.
              <br />
              Meaningful growth.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
              Log in to access your dashboard, manage live projects, connect with
              mentors, and continue building verified experience on BuildUp.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Projects</p>
                <p className="mt-1 text-sm text-slate-500">
                  Work on real opportunities
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Mentors</p>
                <p className="mt-1 text-sm text-slate-500">
                  Learn with guidance
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Portfolio</p>
                <p className="mt-1 text-sm text-slate-500">
                  Build proof of work
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LOGIN CARD */}
        <section className="w-full">
          <div className="mx-auto max-w-md overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <div className="relative px-6 py-8 md:px-8 md:py-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_22%)]" />

              <div className="relative z-10">
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-sm">
                    B
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                    Login to BuildUp
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Enter your details to continue to your workspace.
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

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>

                  {/* 🔥 REGISTER LINK */}
                  <p className="text-center text-sm text-slate-500">
                    Don’t have an account?{" "}
                    <Link
                      href="/register/volunteer"
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      Register
                    </Link>
                  </p>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-500">
                    Access your projects, messages, mentors, and progress from
                    one place.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE INFO */}
          <div className="mx-auto mt-6 max-w-md rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm lg:hidden">
            <h3 className="text-base font-semibold text-slate-900">
              Why BuildUp?
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              BuildUp helps volunteers, mentors, and organizations collaborate on
              real-world projects and turn effort into visible proof of
              experience.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
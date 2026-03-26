

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function OrganizationRegister() {
//   const router = useRouter();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [bio, setBio] = useState("");

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const res = await fetch("/api/register/organization", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, email, password, bio }),
//     });

//     if (res.ok) {
//       alert("Organization registered. Please login.");
//       router.push("/login");
//     } else {
//       alert("Registration failed");
//     }
//   };

//   return (
//     <main className="min-h-screen flex justify-center items-center">
//       <form onSubmit={submit} className="bg-white p-8 rounded shadow w-96">
//         <h1 className="text-2xl font-bold mb-4">Register Organization</h1>

//         <input className="w-full border p-2 mb-3" placeholder="Organization Name"
//           onChange={(e) => setName(e.target.value)} required />

//         <input className="w-full border p-2 mb-3" placeholder="Email"
//           onChange={(e) => setEmail(e.target.value)} required />

//         <input type="password" className="w-full border p-2 mb-3" placeholder="Password"
//           onChange={(e) => setPassword(e.target.value)} required />

//         <textarea className="w-full border p-2 mb-4" placeholder="About your organization"
//           onChange={(e) => setBio(e.target.value)} />

//         <button className="w-full bg-blue-600 text-white p-2 rounded">
//           Create Account
//         </button>
//       </form>
//     </main>
//   );
// }



"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrganizationRegister() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register/organization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, bio }),
      });

      if (res.ok) {
        alert("Organization registered. Please login.");
        router.push("/login");
        return;
      }

      const contentType = res.headers.get("content-type");
      let message = "Registration failed";

      if (contentType?.includes("application/json")) {
        const data = await res.json();
        message = data?.error || message;
      }

      setError(message);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
              Join BuildUp as an Organization
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-900">
              Post meaningful
              <br />
              projects and discover
              <br />
              growing talent.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
              Create your organization account to publish real projects, connect
              with volunteers, collaborate with mentors, and build a stronger
              talent pipeline through BuildUp.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Projects</p>
                <p className="mt-1 text-sm text-slate-500">
                  Publish real opportunities
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Talent</p>
                <p className="mt-1 text-sm text-slate-500">
                  Discover emerging contributors
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Impact</p>
                <p className="mt-1 text-sm text-slate-500">
                  Support real learning through work
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* REGISTER CARD */}
        <section className="w-full">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <div className="relative px-6 py-8 md:px-8 md:py-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_22%)]" />

              <div className="relative z-10">
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-sm">
                    B
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                    Register Organization
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Create your organization profile and start posting
                    opportunities on BuildUp.
                  </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                  {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Organization Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your organization name"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your organization email"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Create a secure password"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="bio"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      About Your Organization
                    </label>
                    <textarea
                      id="bio"
                      placeholder="Tell volunteers about your organization, the kind of work you do, and the kinds of projects you may post."
                      className="min-h-[150px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      A clear description builds trust and helps attract better
                      applicants.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>

                  <p className="text-center text-sm text-slate-500">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      Login here
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/* MOBILE INFO */}
          <div className="mx-auto mt-6 max-w-2xl rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm lg:hidden">
            <h3 className="text-base font-semibold text-slate-900">
              Why register as an organization?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              BuildUp helps organizations post real projects, find emerging
              talent, and contribute to meaningful skills development through
              real-world collaboration.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
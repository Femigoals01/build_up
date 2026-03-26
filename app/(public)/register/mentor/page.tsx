


// "use client";

// import { useState } from "react";

// export default function MentorRegister() {
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setLoading(true);

//     const formData = new FormData(e.currentTarget);
//     const payload = Object.fromEntries(formData.entries());

//     try {
//       const res = await fetch("/api/register/mentor", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         throw new Error("Registration failed");
//       }

//       alert("Mentor registered successfully! Please login.");
//       window.location.href = "/login";
//     } catch (error) {
//       alert("Mentor registration failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <main className="min-h-screen flex justify-center items-center px-6 py-16 bg-gray-50">
//       <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-md">

//         {/* TITLE */}
//         <h2 className="text-3xl font-bold text-center mb-2">
//           Become a Mentor on BuildUp
//         </h2>
//         <p className="text-gray-600 text-center mb-8">
//           Share your experience, guide learners, and support impactful projects.
//         </p>

//         <form className="space-y-6" onSubmit={handleSubmit}>

//           {/* FULL NAME */}
//           <div>
//             <label className="block font-semibold mb-1">Full Name</label>
//             <input
//               name="name"
//               required
//               type="text"
//               placeholder="Enter your full name"
//               className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           {/* EMAIL */}
//           <div>
//             <label className="block font-semibold mb-1">Email Address</label>
//             <input
//               name="email"
//               required
//               type="email"
//               placeholder="Enter your email"
//               className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           {/* PASSWORD */}
//           <div>
//             <label className="block font-semibold mb-1">Password</label>
//             <input
//               name="password"
//               required
//               type="password"
//               placeholder="Create a secure password"
//               className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           {/* EXPERTISE */}
//           <div>
//             <label className="block font-semibold mb-1">Primary Expertise</label>
//             <select
//               name="expertise"
//               required
//               className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value="">Select your area</option>
//               <option>UI/UX Design</option>
//               <option>Frontend Development</option>
//               <option>Backend Development</option>
//               <option>Mobile App Development</option>
//               <option>Graphic Design</option>
//               <option>Project Management</option>
//               <option>Data Analysis</option>
//               <option>Digital Marketing</option>
//               <option>Other</option>
//             </select>
//           </div>

//           {/* EXPERIENCE */}
//           <div>
//             <label className="block font-semibold mb-1">
//               Years of Experience
//             </label>
//             <input
//               name="experience"
//               required
//               type="number"
//               min="0"
//               placeholder="e.g. 5"
//               className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           {/* PORTFOLIO */}
//           <div>
//             <label className="block font-semibold mb-1">
//               Portfolio / LinkedIn
//             </label>
//             <input
//               name="portfolio"
//               type="url"
//               placeholder="https://linkedin.com/in/you"
//               className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           {/* BIO */}
//           <div>
//             <label className="block font-semibold mb-1">Short Bio</label>
//             <textarea
//               name="bio"
//               required
//               placeholder="Tell us how you want to support volunteers…"
//               className="w-full border rounded-lg px-4 py-3 h-32 resize-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           {/* SUBMIT */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-indigo-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
//           >
//             {loading ? "Registering..." : "Register as Mentor"}
//           </button>
//         </form>

//         {/* SWITCH ROLE */}
//         <p className="text-center text-gray-600 mt-6">
//           Not a mentor?{" "}
//           <a
//             href="/choose-role"
//             className="text-indigo-600 font-semibold hover:underline"
//           >
//             Choose another role
//           </a>
//         </p>

//       </div>
//     </main>
//   );
// }




"use client";

import Link from "next/link";
import { useState } from "react";

export default function MentorRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/register/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let message = "Registration failed";
        const contentType = res.headers.get("content-type");

        if (contentType?.includes("application/json")) {
          const data = await res.json();
          message = data?.error || message;
        }

        throw new Error(message);
      }

      alert("Mentor registered successfully! Please login.");
      window.location.href = "/login";
    } catch (error: any) {
      setError(error?.message || "Mentor registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 px-4 py-8">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 lg:grid-cols-2">
        {/* LEFT PANEL */}
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
              Join BuildUp as a Mentor
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-900">
              Guide talent.
              <br />
              Share experience.
              <br />
              Create impact.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
              Become a mentor on BuildUp and help volunteers grow through real
              projects, practical feedback, and meaningful direction.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Mentorship</p>
                <p className="mt-1 text-sm text-slate-500">
                  Guide real contributors
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Projects</p>
                <p className="mt-1 text-sm text-slate-500">
                  Support real-world work
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Impact</p>
                <p className="mt-1 text-sm text-slate-500">
                  Help shape growth journeys
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* REGISTER CARD */}
        <section className="w-full">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <div className="relative px-6 py-8 md:px-8 md:py-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_22%)]" />

              <div className="relative z-10">
                {/* TITLE */}
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-sm">
                    B
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                    Become a Mentor on BuildUp
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Share your experience, guide learners, and support impactful
                    projects through structured mentorship.
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  {/* FULL NAME */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      type="text"
                      placeholder="Enter your full name"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      required
                      type="email"
                      placeholder="Enter your email"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      required
                      type="password"
                      placeholder="Create a secure password"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  {/* EXPERTISE + EXPERIENCE */}
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="expertise"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Primary Expertise
                      </label>
                      <select
                        id="expertise"
                        name="expertise"
                        required
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      >
                        <option value="">Select your area</option>
                        <option>UI/UX Design</option>
                        <option>Frontend Development</option>
                        <option>Backend Development</option>
                        <option>Mobile App Development</option>
                        <option>Graphic Design</option>
                        <option>Project Management</option>
                        <option>Data Analysis</option>
                        <option>Digital Marketing</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="experience"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Years of Experience
                      </label>
                      <input
                        id="experience"
                        name="experience"
                        required
                        type="number"
                        min="0"
                        placeholder="e.g. 5"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      />
                    </div>
                  </div>

                  {/* PORTFOLIO */}
                  <div>
                    <label
                      htmlFor="portfolio"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Portfolio / LinkedIn
                    </label>
                    <input
                      id="portfolio"
                      name="portfolio"
                      type="url"
                      placeholder="https://linkedin.com/in/you"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  {/* BIO */}
                  <div>
                    <label
                      htmlFor="bio"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Short Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      required
                      placeholder="Tell us how you want to support volunteers, what experience you bring, and the kind of mentorship you can provide."
                      className="min-h-[140px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Registering..." : "Register as Mentor"}
                  </button>

                  {/* SWITCH ROLE */}
                  <p className="text-center text-sm text-slate-500">
                    Not a mentor?{" "}
                    <Link
                      href="/choose-role"
                      className="font-semibold text-indigo-600 hover:underline"
                    >
                      Choose another role
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/* MOBILE INFO */}
          <div className="mx-auto mt-6 max-w-2xl rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm lg:hidden">
            <h3 className="text-base font-semibold text-slate-900">
              Why mentor on BuildUp?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              BuildUp gives mentors a chance to guide real projects, support
              rising talent, and contribute meaningfully to practical learning.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
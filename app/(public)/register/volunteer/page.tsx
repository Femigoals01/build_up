


// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function VolunteerRegister() {
//   const router = useRouter();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [skills, setSkills] = useState("");
//   const [experience, setExperience] = useState("");
//   const [bio, setBio] = useState("");

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();

//     const res = await fetch("/api/register/volunteer", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         name,
//         email,
//         password,
//         skills,
//         experience,
//         bio,
//       }),
//     });

//     if (res.ok) {
//       alert("Registration successful! Please login.");
//       router.push("/login");
//     } else {
//       alert("Error registering user");
//     }
//   };

//   return (
//     <main className="min-h-screen flex justify-center items-center px-6 py-16">
//       <div className="w-full max-w-2xl bg-white p-10 rounded-xl shadow">

//         <h2 className="text-3xl font-bold text-center mb-2">Create Volunteer Account</h2>

//         <form onSubmit={handleSubmit} className="space-y-6">

//           <input 
//             type="text"
//             placeholder="Full Name"
//             className="w-full border rounded-lg px-4 py-3"
//             onChange={(e) => setName(e.target.value)}
//             required
//           />

//           <input 
//             type="email"
//             placeholder="Email Address"
//             className="w-full border rounded-lg px-4 py-3"
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <input 
//             type="password"
//             placeholder="Password"
//             className="w-full border rounded-lg px-4 py-3"
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           <select 
//             className="w-full border rounded-lg px-4 py-3"
//             onChange={(e) => setSkills(e.target.value)}
//           >
//             <option>Select Primary Skill</option>
//             <option>UI/UX Design</option>
//             <option>Frontend Development</option>
//             <option>Backend Development</option>
//           </select>

//           <select 
//             className="w-full border rounded-lg px-4 py-3"
//             onChange={(e) => setExperience(e.target.value)}
//           >
//             <option>Experience Level</option>
//             <option>Beginner</option>
//             <option>Intermediate</option>
//             <option>Advanced</option>
//           </select>

//           <textarea
//             placeholder="Short Bio..."
//             className="w-full border rounded-lg px-4 py-3 h-28"
//             onChange={(e) => setBio(e.target.value)}
//           />

//           <button 
//             type="submit"
//             className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg"
//           >
//             Create Account
//           </button>

//         </form>

//         <p className="text-center text-gray-600 mt-6">
//           Already registered?{" "}
//           <a href="/login" className="text-blue-600 font-semibold">Login here</a>
//         </p>

//       </div>
//     </main>
//   );
// }




"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VolunteerRegister() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          skills,
          experience,
          bio,
        }),
      });

      if (res.ok) {
        alert("Registration successful! Please login.");
        router.push("/login");
        return;
      }

      const contentType = res.headers.get("content-type");
      let message = "Error registering user";

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
              Join BuildUp as a Volunteer
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-900">
              Start building
              <br />
              real experience
              <br />
              that counts.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
              Create your volunteer account to work on real-world projects,
              learn from mentors, and grow a portfolio backed by proof of work.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Projects</p>
                <p className="mt-1 text-sm text-slate-500">
                  Gain practical experience
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Mentors</p>
                <p className="mt-1 text-sm text-slate-500">
                  Get guidance and feedback
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Growth</p>
                <p className="mt-1 text-sm text-slate-500">
                  Build a stronger portfolio
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
                    Create Volunteer Account
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Set up your profile and start applying for real projects on
                    BuildUp.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
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
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
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
                      placeholder="Enter your email address"
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

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="skills"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Primary Skill
                      </label>
                      <select
                        id="skills"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                      >
                        <option value="">Select Primary Skill</option>
                        <option>UI/UX Design</option>
                        <option>Frontend Development</option>
                        <option>Backend Development</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="experience"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Experience Level
                      </label>
                      <select
                        id="experience"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                      >
                        <option value="">Experience Level</option>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="bio"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Short Bio
                    </label>
                    <textarea
                      id="bio"
                      placeholder="Tell us a little about yourself, your interests, and what kind of projects you want to work on."
                      className="min-h-[140px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>

                  <p className="text-center text-sm text-slate-500">
                    Already registered?{" "}
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
              Why join BuildUp?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              BuildUp helps you gain hands-on experience through real projects,
              mentorship, and visible proof of your skills.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}





// "use client";

// // import { useMemo, useState } from "react";
// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import BuildUpLogo from "@/components/brand/BuildUpLogo";

// const COUNTRY_OPTIONS = [
//   { name: "Nigeria", code: "+234" },
//   { name: "Ghana", code: "+233" },
//   { name: "Kenya", code: "+254" },
//   { name: "South Africa", code: "+27" },
//   { name: "United Kingdom", code: "+44" },
//   { name: "United States", code: "+1" },
//   { name: "Canada", code: "+1" },
//   { name: "India", code: "+91" },
//   { name: "Germany", code: "+49" },
//   { name: "France", code: "+33" },
// ];

// const SKILL_CATEGORIES = [
//   {
//     title: "Design & Creative",
//     skills: [
//       "UI/UX Design",
//       "Graphic Design",
//       "Branding & Identity Design",
//       "Product Design",
//       "Book Design",
//       "AI Art & Design",
//       "AI Artists",
//       "Photography",
//       "Photo Editing",
//     ],
//   },
//   {
//     title: "Technology & Development",
//     skills: [
//       "Frontend Development",
//       "Backend Development",
//       "Fullstack Development",
//       "Website Development",
//       "Create Your Website",
//       "Mobile App Development",
//       "AI Mobile Development",
//       "Artificial Intelligence (AI)",
//       "Machine Learning",
//       "Cyber Security",
//     ],
//   },
//   {
//     title: "Data & Analytics",
//     skills: [
//       "Data Analysis",
//       "Data Analytics",
//       "Data Analyst",
//       "Data Science",
//       "Business Intelligence",
//       "Research & Reporting",
//     ],
//   },
//   {
//     title: "Marketing & Growth",
//     skills: [
//       "Social Media Management",
//       "Digital Marketing",
//       "SEO & Content Marketing",
//       "Video Marketing",
//       "Podcast Marketing",
//       "Music Promotion",
//       "Sales & Lead Generation",
//     ],
//   },
//   {
//     title: "Video, Audio & Media",
//     skills: [
//       "Video Editing",
//       "Video & Animation",
//       "Motion Graphics",
//       "AI Video Creation",
//       "Music & Audio Production",
//       "Jingles & Intros",
//       "Podcast Production",
//     ],
//   },
//   {
//     title: "Business & Professional Services",
//     skills: [
//       "Business Planning",
//       "Project Management",
//       "Virtual Assistance",
//       "Career Counseling",
//       "Legal Services",
//       "Book Editing",
//       "Content Writing",
//       "Copywriting",
//       "Customer Support",
//       "Product Management",
//     ],
//   },
// ];

// export default function VolunteerRegister() {
//   const router = useRouter();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [country, setCountry] = useState("");
//   const [countryCode, setCountryCode] = useState("");
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [skills, setSkills] = useState("");
//   const [skillSearch, setSkillSearch] = useState("");
//   const [experience, setExperience] = useState("");
//   const [bio, setBio] = useState("");


//   const [referralCode, setReferralCode] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const selectedCountry = useMemo(
//     () => COUNTRY_OPTIONS.find((item) => item.name === country),
//     [country]
//   );

//   const filteredSkillCategories = useMemo(() => {
//     const query = skillSearch.trim().toLowerCase();

//     if (!query) return SKILL_CATEGORIES;

//     return SKILL_CATEGORIES.map((category) => ({
//       ...category,
//       skills: category.skills.filter((skill) =>
//         skill.toLowerCase().includes(query)
//       ),
//     })).filter((category) => category.skills.length > 0);
//   }, [skillSearch]);



//   useEffect(() => {
//   if (typeof window === "undefined") return;

//   const params = new URLSearchParams(window.location.search);
//   const ref = params.get("ref");

//   if (ref) {
//     setReferralCode(ref.trim().toUpperCase());
//   }
// }, []);
  

//   const handleCountryChange = (value: string) => {
//     setCountry(value);

//     const matchedCountry = COUNTRY_OPTIONS.find((item) => item.name === value);
//     if (matchedCountry) {
//       setCountryCode(matchedCountry.code);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const normalizedEmail = email.trim().toLowerCase();

//     if (!skills.trim()) {
//       setError("Please add your primary skill.");
//       setLoading(false);
//       return;
//     }

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters.");
//       setLoading(false);
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch("/api/register/volunteer", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name,
//           email: normalizedEmail,
//           password,
//           confirmPassword,
//           country,
//           countryCode,
//           mobileNumber,
//           skills,
//           experience,
//           bio,
//           referralCode,
//         }),
//       });

//       const contentType = res.headers.get("content-type");
//       let message = "Error registering user";
//       let returnedEmail = normalizedEmail;

//       if (contentType?.includes("application/json")) {
//         const data = await res.json();
//         message = data?.error || data?.message || message;
//         returnedEmail = data?.email || normalizedEmail;
//       }

//       if (res.ok) {
//         router.push(
//           `/verify-email?email=${encodeURIComponent(
//             returnedEmail.trim().toLowerCase()
//           )}`
//         );
//         return;
//       }

//       setError(message);
//     } catch {
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-8">
//       <div className="mx-auto grid min-h-screen max-w-6xl items-start gap-8 pt-8 lg:grid-cols-2 lg:pt-14">
//         <section className="hidden pt-4 lg:block">
//           <div className="max-w-xl">
//             <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
//               <span className="h-2 w-2 rounded-full bg-blue-600" />
//               Join BuildUp as a Volunteer
//             </div>

//             <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-900">
//               Start building
//               <br />
//               real experience
//               <br />
//               that counts.
//             </h1>

//             <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
//               Create your volunteer account to work on real-world projects,
//               learn from mentors, and grow a portfolio backed by proof of work.
//             </p>

//             <div className="mt-10 grid gap-4 sm:grid-cols-3">
//               <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//                 <p className="text-2xl font-bold text-slate-900">Projects</p>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Gain practical experience
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//                 <p className="text-2xl font-bold text-slate-900">Mentors</p>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Get guidance and feedback
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//                 <p className="text-2xl font-bold text-slate-900">Growth</p>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Build a stronger portfolio
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="w-full">
//           <div className="mx-auto max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
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

//                   <h2 className="text-3xl font-bold tracking-tight text-slate-900">
//                     Create Volunteer Account
//                   </h2>

//                   <p className="mt-2 text-sm leading-6 text-slate-500">
//                     Set up your profile and start applying for real projects on
//                     BuildUp.
//                   </p>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-5">
//                   {error && (
//                     <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//                       {error}
//                     </div>
//                   )}

//                   <div>
//                     <label
//                       htmlFor="name"
//                       className="mb-2 block text-sm font-semibold text-slate-800"
//                     >
//                       Full Name
//                     </label>
//                     <input
//                       id="name"
//                       type="text"
//                       placeholder="Enter your full name"
//                       className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                       required
//                     />
//                   </div>

//                   <div className="grid gap-5 md:grid-cols-2">
//                     <div>
//                       <label
//                         htmlFor="email"
//                         className="mb-2 block text-sm font-semibold text-slate-800"
//                       >
//                         Email Address
//                       </label>
//                       <input
//                         id="email"
//                         type="email"
//                         placeholder="Enter your email address"
//                         className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label
//                         htmlFor="country"
//                         className="mb-2 block text-sm font-semibold text-slate-800"
//                       >
//                         Country
//                       </label>
//                       <select
//                         id="country"
//                         className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                         value={country}
//                         onChange={(e) => handleCountryChange(e.target.value)}
//                         required
//                       >
//                         <option value="">Select country</option>
//                         {COUNTRY_OPTIONS.map((item) => (
//                           <option
//                             key={`${item.name}-${item.code}`}
//                             value={item.name}
//                           >
//                             {item.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="mobileNumber"
//                       className="mb-2 block text-sm font-semibold text-slate-800"
//                     >
//                       Mobile Number
//                     </label>

//                     <div className="flex gap-3">
//                       <select
//                         id="countryCode"
//                         className="h-12 w-32 shrink-0 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                         value={countryCode}
//                         onChange={(e) => setCountryCode(e.target.value)}
//                         required
//                       >
//                         <option value="">Code</option>
//                         {COUNTRY_OPTIONS.map((item) => (
//                           <option
//                             key={`${item.name}-${item.code}-code`}
//                             value={item.code}
//                           >
//                             {item.code}
//                           </option>
//                         ))}
//                       </select>

//                       <input
//                         id="mobileNumber"
//                         type="tel"
//                         inputMode="tel"
//                         placeholder="8123456789"
//                         className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                         value={mobileNumber}
//                         onChange={(e) => setMobileNumber(e.target.value)}
//                         required
//                       />
//                     </div>

//                     <p className="mt-2 text-xs text-slate-500">
//                       {selectedCountry
//                         ? `Selected country: ${selectedCountry.name}`
//                         : "Choose your country and country code before entering your number."}
//                     </p>
//                   </div>



// <div>
//   <label
//     htmlFor="referralCode"
//     className="mb-2 block text-sm font-semibold text-slate-800"
//   >
//     Referral Code (Optional)
//   </label>

//   <input
//     id="referralCode"
//     type="text"
//     placeholder="Enter referral code"
//     className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm uppercase text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//     value={referralCode}
//     onChange={(e) =>
//       setReferralCode(e.target.value.toUpperCase())
//     }
//   />

//   <p className="mt-2 text-xs text-slate-500">
//     Got invited by someone? Enter their referral code.
//   </p>
// </div>




//                   <div className="grid gap-5 md:grid-cols-2">
//                     <div>
//                       <label
//                         htmlFor="password"
//                         className="mb-2 block text-sm font-semibold text-slate-800"
//                       >
//                         Password
//                       </label>

//                       <div className="relative">
//                         <input
//                           id="password"
//                           type={showPassword ? "text" : "password"}
//                           placeholder="Create a secure password"
//                           className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-20 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                           value={password}
//                           onChange={(e) => setPassword(e.target.value)}
//                           required
//                         />

//                         <button
//                           type="button"
//                           onClick={() => setShowPassword((prev) => !prev)}
//                           className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-600 hover:text-blue-700"
//                         >
//                           {showPassword ? "Hide" : "Show"}
//                         </button>
//                       </div>
//                     </div>

//                     <div>
//                       <label
//                         htmlFor="confirmPassword"
//                         className="mb-2 block text-sm font-semibold text-slate-800"
//                       >
//                         Confirm Password
//                       </label>

//                       <input
//                         id="confirmPassword"
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Re-enter your password"
//                         className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="skillSearch"
//                       className="mb-2 block text-sm font-semibold text-slate-800"
//                     >
//                       Primary Skill
//                     </label>

//                     <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-3 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
//                       <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
//                         <span className="text-lg">🔎</span>
//                         <input
//                           id="skillSearch"
//                           type="text"
//                           placeholder="Search or type your skill e.g. AI Video..."
//                           value={skillSearch}
//                           onChange={(e) => setSkillSearch(e.target.value)}
//                           className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
//                         />
//                       </div>

//                       {skillSearch.trim() && !skills && (
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setSkills(skillSearch.trim());
//                             setSkillSearch("");
//                           }}
//                           className="mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
//                         >
//                           Add “{skillSearch.trim()}” as my skill
//                         </button>
//                       )}

//                       {skills && (
//                         <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
//                           <div className="min-w-0">
//                             <p className="text-xs font-semibold uppercase tracking-[0.14em] text-green-600">
//                               ✓ Skill Added
//                             </p>
//                             <p className="truncate text-sm font-semibold text-green-800">
//                               {skills}
//                             </p>
//                           </div>

//                           <button
//                             type="button"
//                             onClick={() => {
//                               setSkills("");
//                               setSkillSearch("");
//                             }}
//                             className="shrink-0 rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-green-700 transition hover:bg-green-100"
//                           >
//                             Change
//                           </button>
//                         </div>
//                       )}

//                       {!skills && (
//                         <div className="mt-4 max-h-72 space-y-4 overflow-y-auto pr-1">
//                           {filteredSkillCategories.length === 0 ? (
//                             <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-5 text-center text-sm text-slate-500">
//                               No skill found. Use the button above to add your
//                               typed skill.
//                             </div>
//                           ) : (
//                             filteredSkillCategories.map((category) => (
//                               <div key={category.title}>
//                                 <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
//                                   {category.title}
//                                 </p>

//                                 <div className="flex flex-wrap gap-2">
//                                   {category.skills.map((skill) => {
//                                     const active = skills === skill;

//                                     return (
//                                       <button
//                                         key={skill}
//                                         type="button"
//                                         onClick={() => {
//                                           setSkills(skill);
//                                           setSkillSearch("");
//                                         }}
//                                         className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
//                                           active
//                                             ? "border-blue-600 bg-blue-600 text-white shadow-sm"
//                                             : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
//                                         }`}
//                                       >
//                                         + Add {skill}
//                                       </button>
//                                     );
//                                   })}
//                                 </div>
//                               </div>
//                             ))
//                           )}
//                         </div>
//                       )}
//                     </div>

//                     <p className="mt-2 text-xs text-slate-500">
//                       Choose your strongest skill. You can add more later in
//                       your dashboard profile.
//                     </p>

//                     <input type="hidden" name="skills" value={skills} required />
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="experience"
//                       className="mb-2 block text-sm font-semibold text-slate-800"
//                     >
//                       Experience Level
//                     </label>
//                     <select
//                       id="experience"
//                       className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                       value={experience}
//                       onChange={(e) => setExperience(e.target.value)}
//                       required
//                     >
//                       <option value="">Experience Level</option>
//                       <option>Beginner</option>
//                       <option>Intermediate</option>
//                       <option>Advanced</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="bio"
//                       className="mb-2 block text-sm font-semibold text-slate-800"
//                     >
//                       Short Bio
//                     </label>
//                     <textarea
//                       id="bio"
//                       placeholder="Tell us a little about yourself, your interests, and what kind of projects you want to work on."
//                       className="min-h-[140px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                       value={bio}
//                       onChange={(e) => setBio(e.target.value)}
//                       required
//                     />
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading || !skills}
//                     className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//                   >
//                     {loading ? "Creating Account..." : "Create Account"}
//                   </button>

//                   <p className="text-center text-sm text-slate-500">
//                     Already registered?{" "}
//                     <Link
//                       href="/login"
//                       className="font-semibold text-blue-600 hover:underline"
//                     >
//                       Login here
//                     </Link>
//                   </p>
//                 </form>
//               </div>
//             </div>
//           </div>

//           <div className="mx-auto mt-6 max-w-2xl rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm lg:hidden">
//             <h3 className="text-base font-semibold text-slate-900">
//               Why join BuildUp?
//             </h3>
//             <p className="mt-2 text-sm leading-6 text-slate-500">
//               BuildUp helps you gain hands-on experience through real projects,
//               mentorship, and visible proof of your skills.
//             </p>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }




"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BuildUpLogo from "@/components/brand/BuildUpLogo";

const COUNTRY_OPTIONS = [
  { name: "Nigeria", code: "+234" },
  { name: "Ghana", code: "+233" },
  { name: "Kenya", code: "+254" },
  { name: "South Africa", code: "+27" },
  { name: "United Kingdom", code: "+44" },
  { name: "United States", code: "+1" },
  { name: "Canada", code: "+1" },
  { name: "India", code: "+91" },
  { name: "Germany", code: "+49" },
  { name: "France", code: "+33" },
];

const SKILL_CATEGORIES = [
  {
    title: "Design & Creative",
    skills: [
      "UI/UX Design",
      "Graphic Design",
      "Branding & Identity Design",
      "Product Design",
      "Book Design",
      "AI Art & Design",
      "AI Artists",
      "Photography",
      "Photo Editing",
    ],
  },
  {
    title: "Technology & Development",
    skills: [
      "Frontend Development",
      "Backend Development",
      "Fullstack Development",
      "Website Development",
      "Create Your Website",
      "Mobile App Development",
      "AI Mobile Development",
      "Artificial Intelligence (AI)",
      "Machine Learning",
      "Cyber Security",
    ],
  },
  {
    title: "Data & Analytics",
    skills: [
      "Data Analysis",
      "Data Analytics",
      "Data Analyst",
      "Data Science",
      "Business Intelligence",
      "Research & Reporting",
    ],
  },
  {
    title: "Marketing & Growth",
    skills: [
      "Social Media Management",
      "Digital Marketing",
      "SEO & Content Marketing",
      "Video Marketing",
      "Podcast Marketing",
      "Music Promotion",
      "Sales & Lead Generation",
    ],
  },
  {
    title: "Video, Audio & Media",
    skills: [
      "Video Editing",
      "Video & Animation",
      "Motion Graphics",
      "AI Video Creation",
      "Music & Audio Production",
      "Jingles & Intros",
      "Podcast Production",
    ],
  },
  {
    title: "Business & Professional Services",
    skills: [
      "Business Planning",
      "Project Management",
      "Virtual Assistance",
      "Career Counseling",
      "Legal Services",
      "Book Editing",
      "Content Writing",
      "Copywriting",
      "Customer Support",
      "Product Management",
    ],
  },
];

function isStrongPassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(
    password
  );
}

function cleanPhoneInput(value: string, countryCode: string) {
  const onlyNumbers = value.replace(/\D/g, "");

  if (countryCode === "+234") {
    return onlyNumbers.slice(0, 10);
  }

  return onlyNumbers.slice(0, 15);
}

export default function VolunteerRegister() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [skills, setSkills] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedCountry = useMemo(
    () => COUNTRY_OPTIONS.find((item) => item.name === country),
    [country]
  );

  const filteredSkillCategories = useMemo(() => {
    const query = skillSearch.trim().toLowerCase();

    if (!query) return SKILL_CATEGORIES;

    return SKILL_CATEGORIES.map((category) => ({
      ...category,
      skills: category.skills.filter((skill) =>
        skill.toLowerCase().includes(query)
      ),
    })).filter((category) => category.skills.length > 0);
  }, [skillSearch]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");

    if (ref) {
      setReferralCode(ref.trim().toUpperCase());
    }
  }, []);

  const handleCountryChange = (value: string) => {
    setCountry(value);

    const matchedCountry = COUNTRY_OPTIONS.find((item) => item.name === value);

    if (matchedCountry) {
      setCountryCode(matchedCountry.code);
      setMobileNumber((current) =>
        cleanPhoneInput(current, matchedCountry.code)
      );
    }
  };

  const handleCountryCodeChange = (value: string) => {
    setCountryCode(value);
    setMobileNumber((current) => cleanPhoneInput(current, value));
  };

  const handleMobileChange = (value: string) => {
    setMobileNumber(cleanPhoneInput(value, countryCode));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!skills.trim()) {
      setError("Please add your primary skill.");
      setLoading(false);
      return;
    }

    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (countryCode === "+234" && mobileNumber.length !== 10) {
      setError("Nigerian phone numbers must be exactly 10 digits after +234.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: normalizedEmail,
          password,
          confirmPassword,
          country,
          countryCode,
          mobileNumber,
          skills,
          experience,
          bio,
          referralCode,
        }),
      });

      const contentType = res.headers.get("content-type");
      let message = "Error registering user";
      let returnedEmail = normalizedEmail;

      if (contentType?.includes("application/json")) {
        const data = await res.json();
        message = data?.error || data?.message || message;
        returnedEmail = data?.email || normalizedEmail;
      }

      if (res.ok) {
        router.push(
          `/verify-email?email=${encodeURIComponent(
            returnedEmail.trim().toLowerCase()
          )}`
        );
        return;
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
      <div className="mx-auto grid min-h-screen max-w-6xl items-start gap-8 pt-8 lg:grid-cols-2 lg:pt-14">
        <section className="hidden pt-4 lg:block">
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

        <section className="w-full">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
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

                  <div className="grid gap-5 md:grid-cols-2">
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
                        htmlFor="country"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Country
                      </label>
                      <select
                        id="country"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        value={country}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        required
                      >
                        <option value="">Select country</option>
                        {COUNTRY_OPTIONS.map((item) => (
                          <option
                            key={`${item.name}-${item.code}`}
                            value={item.name}
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="mobileNumber"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Mobile Number
                    </label>

                    <div className="flex gap-3">
                      <select
                        id="countryCode"
                        className="h-12 w-32 shrink-0 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        value={countryCode}
                        onChange={(e) => handleCountryCodeChange(e.target.value)}
                        required
                      >
                        <option value="">Code</option>
                        {COUNTRY_OPTIONS.map((item) => (
                          <option
                            key={`${item.name}-${item.code}-code`}
                            value={item.code}
                          >
                            {item.code}
                          </option>
                        ))}
                      </select>

                      <input
                        id="mobileNumber"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder={
                          countryCode === "+234" ? "8123456789" : "Phone number"
                        }
                        className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        value={mobileNumber}
                        onChange={(e) => handleMobileChange(e.target.value)}
                        required
                      />
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      {selectedCountry
                        ? countryCode === "+234"
                          ? `Selected country: ${selectedCountry.name}. Enter exactly 10 digits after +234.`
                          : `Selected country: ${selectedCountry.name}. Numbers only.`
                        : "Choose your country and country code before entering your number."}
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="referralCode"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Referral Code (Optional)
                    </label>

                    <input
                      id="referralCode"
                      type="text"
                      placeholder="Enter referral code"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm uppercase text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      value={referralCode}
                      onChange={(e) =>
                        setReferralCode(e.target.value.toUpperCase())
                      }
                    />

                    <p className="mt-2 text-xs text-slate-500">
                      Got invited by someone? Enter their referral code.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Password
                      </label>

                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a secure password"
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-20 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
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

                      <p className="mt-2 text-xs text-slate-500">
                        Must be 8+ characters with uppercase, lowercase, number,
                        and special character.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Confirm Password
                      </label>

                      <input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="skillSearch"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Primary Skill
                    </label>

                    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-3 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                      <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                        <span className="text-lg">🔎</span>
                        <input
                          id="skillSearch"
                          type="text"
                          placeholder="Search or type your skill e.g. AI Video..."
                          value={skillSearch}
                          onChange={(e) => setSkillSearch(e.target.value)}
                          className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        />
                      </div>

                      {skillSearch.trim() && !skills && (
                        <button
                          type="button"
                          onClick={() => {
                            setSkills(skillSearch.trim());
                            setSkillSearch("");
                          }}
                          className="mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          Add “{skillSearch.trim()}” as my skill
                        </button>
                      )}

                      {skills && (
                        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-green-600">
                              ✓ Skill Added
                            </p>
                            <p className="truncate text-sm font-semibold text-green-800">
                              {skills}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSkills("");
                              setSkillSearch("");
                            }}
                            className="shrink-0 rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-green-700 transition hover:bg-green-100"
                          >
                            Change
                          </button>
                        </div>
                      )}

                      {!skills && (
                        <div className="mt-4 max-h-72 space-y-4 overflow-y-auto pr-1">
                          {filteredSkillCategories.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-5 text-center text-sm text-slate-500">
                              No skill found. Use the button above to add your
                              typed skill.
                            </div>
                          ) : (
                            filteredSkillCategories.map((category) => (
                              <div key={category.title}>
                                <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                                  {category.title}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                  {category.skills.map((skill) => {
                                    const active = skills === skill;

                                    return (
                                      <button
                                        key={skill}
                                        type="button"
                                        onClick={() => {
                                          setSkills(skill);
                                          setSkillSearch("");
                                        }}
                                        className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                                          active
                                            ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                                            : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                        }`}
                                      >
                                        + Add {skill}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Choose your strongest skill. You can add more later in
                      your dashboard profile.
                    </p>

                    <input type="hidden" name="skills" value={skills} required />
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
                      required
                    >
                      <option value="">Experience Level</option>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
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
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !skills}
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
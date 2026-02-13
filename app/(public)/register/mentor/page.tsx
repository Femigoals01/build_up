// export default function MentorRegister() {
//   return (
//     <main className="min-h-screen flex justify-center items-center px-6 py-16">
//       <div className="w-full max-w-2xl bg-white p-10 rounded-xl shadow">

//         {/* TITLE */}
//         <h2 className="text-3xl font-bold text-center mb-2">
//           Become a Mentor on BuildUp
//         </h2>
//         <p className="text-gray-600 text-center mb-8">
//           Share your experience, guide learners, and support impactful projects.
//         </p>

//         <form className="space-y-6">

//           {/* FULL NAME */}
//           <div>
//             <label className="block font-semibold mb-1">Full Name</label>
//             <input 
//               type="text"
//               placeholder="Enter your full name"
//               className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* EMAIL */}
//           <div>
//             <label className="block font-semibold mb-1">Email Address</label>
//             <input 
//               type="email"
//               placeholder="Enter your email"
//               className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* PASSWORD */}
//           <div>
//             <label className="block font-semibold mb-1">Password</label>
//             <input 
//               type="password"
//               placeholder="Create a secure password"
//               className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* EXPERTISE */}
//           <div>
//             <label className="block font-semibold mb-1">Primary Area of Expertise</label>
//             <select 
//               className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option>Select your area</option>
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

//           {/* YEARS OF EXPERIENCE */}
//           <div>
//             <label className="block font-semibold mb-1">Years of Experience</label>
//             <input 
//               type="number"
//               placeholder="e.g., 3"
//               className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               min="0"
//             />
//           </div>

//           {/* PORTFOLIO LINK */}
//           <div>
//             <label className="block font-semibold mb-1">Portfolio Link</label>
//             <input 
//               type="text"
//               placeholder="https://your-portfolio.com"
//               className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* BIO */}
//           <div>
//             <label className="block font-semibold mb-1">Short Bio</label>
//             <textarea
//               placeholder="Share your experience and how you want to help learners…"
//               className="w-full border rounded-lg px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* SUBMIT BUTTON */}
//           <button 
//             type="submit"
//             className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
//           >
//             Register as Mentor
//           </button>

//         </form>

//         {/* SWITCH ROLE */}
//         <p className="text-center text-gray-600 mt-6">
//           Not a mentor?{" "}
//           <a href="/choose-role" className="text-blue-600 font-semibold hover:underline">
//             Choose another role
//           </a>
//         </p>

//       </div>
//     </main>
//   );
// }



// "use client";

// import { useState } from "react";

// export default function MentorRegister() {
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setLoading(true);

//     const formData = new FormData(e.currentTarget);

//     const payload = Object.fromEntries(formData.entries());

//     const res = await fetch("/api/auth/register/mentor", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     setLoading(false);

//     if (res.ok) {
//       window.location.href = "/login";
//     } else {
//       alert("Mentor registration failed. Please try again.");
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
//             <label className="block font-semibold mb-1">Portfolio / LinkedIn</label>
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

import { useState } from "react";

export default function MentorRegister() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/register/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      alert("Mentor registered successfully! Please login.");
      window.location.href = "/login";
    } catch (error) {
      alert("Mentor registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex justify-center items-center px-6 py-16 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-md">

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-center mb-2">
          Become a Mentor on BuildUp
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Share your experience, guide learners, and support impactful projects.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* FULL NAME */}
          <div>
            <label className="block font-semibold mb-1">Full Name</label>
            <input
              name="name"
              required
              type="text"
              placeholder="Enter your full name"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block font-semibold mb-1">Email Address</label>
            <input
              name="email"
              required
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block font-semibold mb-1">Password</label>
            <input
              name="password"
              required
              type="password"
              placeholder="Create a secure password"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* EXPERTISE */}
          <div>
            <label className="block font-semibold mb-1">Primary Expertise</label>
            <select
              name="expertise"
              required
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
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

          {/* EXPERIENCE */}
          <div>
            <label className="block font-semibold mb-1">
              Years of Experience
            </label>
            <input
              name="experience"
              required
              type="number"
              min="0"
              placeholder="e.g. 5"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* PORTFOLIO */}
          <div>
            <label className="block font-semibold mb-1">
              Portfolio / LinkedIn
            </label>
            <input
              name="portfolio"
              type="url"
              placeholder="https://linkedin.com/in/you"
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* BIO */}
          <div>
            <label className="block font-semibold mb-1">Short Bio</label>
            <textarea
              name="bio"
              required
              placeholder="Tell us how you want to support volunteers…"
              className="w-full border rounded-lg px-4 py-3 h-32 resize-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register as Mentor"}
          </button>
        </form>

        {/* SWITCH ROLE */}
        <p className="text-center text-gray-600 mt-6">
          Not a mentor?{" "}
          <a
            href="/choose-role"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Choose another role
          </a>
        </p>

      </div>
    </main>
  );
}

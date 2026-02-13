

// export default function VolunteerRegister() {
//   return (
//     <main className="min-h-screen flex justify-center items-center px-6 py-16">
//       <div className="w-full max-w-2xl bg-white p-10 rounded-xl shadow">

//         {/* TITLE */}
//         <h2 className="text-3xl font-bold text-center mb-2">Create Volunteer Account</h2>
//         <p className="text-gray-600 text-center mb-8">
//           Join BuildUp as a volunteer and start building your real-world portfolio.
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
//             <label className="block font-semibold mb-1">Email</label>
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

//           {/* SKILLS */}
//           <div>
//             <label className="block font-semibold mb-1">Your Skills</label>
//             <select 
//               className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option>Select your primary skill</option>
//               <option>UI/UX Design</option>
//               <option>Frontend Development</option>
//               <option>Backend Development</option>
//               <option>Graphic Design</option>
//               <option>Social Media Management</option>
//               <option>Data Entry</option>
//               <option>Content Writing</option>
//             </select>
//           </div>

//           {/* EXPERIENCE LEVEL */}
//           <div>
//             <label className="block font-semibold mb-1">Experience Level</label>
//             <select 
//               className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option>Select experience level</option>
//               <option>Beginner</option>
//               <option>Intermediate</option>
//               <option>Advanced</option>
//             </select>
//           </div>

//           {/* SHORT BIO */}
//           <div>
//             <label className="block font-semibold mb-1">Short Bio</label>
//             <textarea
//               placeholder="Tell organizations a little about yourself..."
//               className="w-full border rounded-lg px-4 py-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* SUBMIT BUTTON */}
//           <button 
//             type="submit"
//             className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
//           >
//             Create Account
//           </button>

//         </form>

//         {/* LINK TO ROLE SELECTION */}
//         <p className="text-center text-gray-600 mt-6">
//           Not a volunteer?{" "}
//           <a href="/choose-role" className="text-blue-600 font-semibold hover:underline">
//             Choose another role
//           </a>
//         </p>

//       </div>
//     </main>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VolunteerRegister() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

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
    } else {
      alert("Error registering user");
    }
  };

  return (
    <main className="min-h-screen flex justify-center items-center px-6 py-16">
      <div className="w-full max-w-2xl bg-white p-10 rounded-xl shadow">

        <h2 className="text-3xl font-bold text-center mb-2">Create Volunteer Account</h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          <input 
            type="text"
            placeholder="Full Name"
            className="w-full border rounded-lg px-4 py-3"
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input 
            type="email"
            placeholder="Email Address"
            className="w-full border rounded-lg px-4 py-3"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input 
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg px-4 py-3"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select 
            className="w-full border rounded-lg px-4 py-3"
            onChange={(e) => setSkills(e.target.value)}
          >
            <option>Select Primary Skill</option>
            <option>UI/UX Design</option>
            <option>Frontend Development</option>
            <option>Backend Development</option>
          </select>

          <select 
            className="w-full border rounded-lg px-4 py-3"
            onChange={(e) => setExperience(e.target.value)}
          >
            <option>Experience Level</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <textarea
            placeholder="Short Bio..."
            className="w-full border rounded-lg px-4 py-3 h-28"
            onChange={(e) => setBio(e.target.value)}
          />

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg"
          >
            Create Account
          </button>

        </form>

        <p className="text-center text-gray-600 mt-6">
          Already registered?{" "}
          <a href="/login" className="text-blue-600 font-semibold">Login here</a>
        </p>

      </div>
    </main>
  );
}



// export default function Navbar() {
//   return (
//     <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
//       <h1 className="text-2xl font-bold text-blue-600">BuildUp</h1>

//       <div className="hidden md:flex space-x-6 text-lg">
//         <a href="#" className="hover:text-blue-600">Projects</a>
//         <a href="#" className="hover:text-blue-600">How it Works</a>
//         <a href="#" className="hover:text-blue-600">Contact</a>
//       </div>

//       <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//         Get Started
//       </button>
//     </nav>
//   );
// }



// "use client";

// import Link from "next/link";
// import { useState } from "react";

// export default function PublicNavbar() {
//   const [open, setOpen] = useState(false);

//   return (
//     <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
//       <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

//         {/* BRAND */}
//         <Link href="/" className="text-xl font-bold text-blue-600">
//           BuildUp
//         </Link>

//         {/* DESKTOP NAV */}
//         <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
//           <Link href="#how-it-works" className="hover:text-blue-600">
//             How it Works
//           </Link>
//           <Link href="/register/volunteer" className="hover:text-blue-600">
//             For Volunteers
//           </Link>
//           <Link href="/register/organization" className="hover:text-blue-600">
//             For Organizations
//           </Link>
//         </div>

//         {/* ACTIONS */}
//         <div className="hidden md:flex items-center gap-4">
//           <Link
//             href="/login"
//             className="text-sm font-medium text-gray-700 hover:text-blue-600"
//           >
//             Login
//           </Link>

//           <Link
//             href="/register/volunteer"
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
//           >
//             Get Started
//           </Link>
//         </div>

//         {/* MOBILE TOGGLE */}
//         <button
//           onClick={() => setOpen(!open)}
//           className="md:hidden text-2xl"
//         >
//           ☰
//         </button>
//       </nav>

//       {/* MOBILE MENU */}
//       {open && (
//         <div className="md:hidden bg-white border-t px-6 py-4 space-y-4">
//           <Link href="#how-it-works" className="block font-medium">
//             How it Works
//           </Link>
//           <Link href="/register/volunteer" className="block font-medium">
//             For Volunteers
//           </Link>
//           <Link href="/register/organization" className="block font-medium">
//             For Organizations
//           </Link>

//           <div className="pt-4 border-t space-y-3">
//             <Link href="/login" className="block font-medium">
//               Login
//             </Link>
//             <Link
//               href="/register/volunteer"
//               className="block text-center bg-blue-600 text-white py-2 rounded-lg font-semibold"
//             >
//               Get Started
//             </Link>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }



"use client";

import Link from "next/link";
import { useState } from "react";

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* BRAND */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-blue-600"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-bold">
            B
          </span>
          BuildUp
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-700">
          <Link
            href="#how-it-works"
            className="relative hover:text-blue-600 transition after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full"
          >
            How it Works
          </Link>
          <Link
            href="/register/volunteer"
            className="hover:text-blue-600 transition"
          >
            For Volunteers
          </Link>
          <Link
            href="/register/organization"
            className="hover:text-blue-600 transition"
          >
            For Organizations
          </Link>
        </div>

        {/* ACTIONS */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
          >
            Login
          </Link>

          <Link
            href="/register/volunteer"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-md shadow-blue-200"
          >
            Get Started
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-300 text-xl text-gray-700 hover:bg-gray-100 transition"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white/95 backdrop-blur border-t border-gray-200 px-6 py-6 space-y-5 shadow-lg">
          <Link
            href="#how-it-works"
            className="block text-base font-medium text-gray-800 hover:text-blue-600 transition"
            onClick={() => setOpen(false)}
          >
            How it Works
          </Link>

          <Link
            href="/register/volunteer"
            className="block text-base font-medium text-gray-800 hover:text-blue-600 transition"
            onClick={() => setOpen(false)}
          >
            For Volunteers
          </Link>

          <Link
            href="/register/organization"
            className="block text-base font-medium text-gray-800 hover:text-blue-600 transition"
            onClick={() => setOpen(false)}
          >
            For Organizations
          </Link>

          <div className="pt-5 border-t border-gray-200 space-y-4">
            <Link
              href="/login"
              className="block text-center text-sm font-medium text-gray-700 hover:text-blue-600 transition"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>

            <Link
              href="/register/volunteer"
              className="block text-center bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-md shadow-blue-200 hover:bg-blue-700 transition"
              onClick={() => setOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}




// "use client";

// import Link from "next/link";
// import { useState } from "react";

// export default function PublicNavbar() {
//   const [open, setOpen] = useState(false);

//   return (
//     <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
//       <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
//         {/* BRAND */}
//         <Link
//           href="/"
//           className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-blue-600"
//         >
//           <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-bold shadow-md shadow-blue-200">
//             B
//           </span>
//           BuildUp
//         </Link>

//         {/* DESKTOP NAV */}
//         <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
//           <Link
//             href="/"
//             className="relative hover:text-blue-600 transition after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full"
//           >
//             Home
//           </Link>

//           <Link
//             href="/#how-it-works"
//             className="relative hover:text-blue-600 transition after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all hover:after:w-full"
//           >
//             How it Works
//           </Link>

//           <Link
//             href="/register/volunteer"
//             className="hover:text-blue-600 transition"
//           >
//             For Volunteers
//           </Link>

//           <Link
//             href="/register/organization"
//             className="hover:text-blue-600 transition"
//           >
//             For Organizations
//           </Link>

//           <Link
//             href="/register/mentor"
//             className="hover:text-blue-600 transition"
//           >
//             For Mentors
//           </Link>
//         </div>

//         {/* ACTIONS */}
//         <div className="hidden md:flex items-center gap-4">
//           <Link
//             href="/login"
//             className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
//           >
//             Login
//           </Link>

//           <Link
//             href="/register/volunteer"
//             className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:bg-blue-700 transition"
//           >
//             Get Started
//           </Link>
//         </div>

//         {/* MOBILE TOGGLE */}
//         <button
//           onClick={() => setOpen(!open)}
//           className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-300 text-xl text-gray-700 hover:bg-gray-100 transition"
//           aria-label="Toggle menu"
//         >
//           {open ? "✕" : "☰"}
//         </button>
//       </nav>

//       {/* MOBILE MENU */}
//       {open && (
//         <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur px-6 py-6 space-y-5 shadow-lg">
//           <Link
//             href="/"
//             className="block text-base font-medium text-gray-800 hover:text-blue-600 transition"
//             onClick={() => setOpen(false)}
//           >
//             Home
//           </Link>

//           <Link
//             href="/#how-it-works"
//             className="block text-base font-medium text-gray-800 hover:text-blue-600 transition"
//             onClick={() => setOpen(false)}
//           >
//             How it Works
//           </Link>

//           <Link
//             href="/register/volunteer"
//             className="block text-base font-medium text-gray-800 hover:text-blue-600 transition"
//             onClick={() => setOpen(false)}
//           >
//             For Volunteers
//           </Link>

//           <Link
//             href="/register/organization"
//             className="block text-base font-medium text-gray-800 hover:text-blue-600 transition"
//             onClick={() => setOpen(false)}
//           >
//             For Organizations
//           </Link>

//           <Link
//             href="/register/mentor"
//             className="block text-base font-medium text-gray-800 hover:text-blue-600 transition"
//             onClick={() => setOpen(false)}
//           >
//             For Mentors
//           </Link>

//           <div className="pt-5 border-t border-gray-200 space-y-4">
//             <Link
//               href="/login"
//               className="block text-center text-sm font-medium text-gray-700 hover:text-blue-600 transition"
//               onClick={() => setOpen(false)}
//             >
//               Login
//             </Link>

//             <Link
//               href="/register/volunteer"
//               className="block rounded-xl bg-blue-600 py-3 text-center font-semibold text-white shadow-md shadow-blue-200 hover:bg-blue-700 transition"
//               onClick={() => setOpen(false)}
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
import { useEffect, useState } from "react";

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };

    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/75">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
        {/* BRAND */}
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-extrabold text-white shadow-[0_10px_25px_rgba(37,99,235,0.25)] transition duration-300 group-hover:scale-[1.03]">
            B
          </span>

          <div className="leading-tight">
            <span className="block text-lg font-extrabold tracking-tight text-slate-900 md:text-xl">
              BuildUp
            </span>
            <span className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400 sm:block">
              Real projects. Real growth.
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-7 text-sm font-medium text-slate-600">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/#how-it-works">How it Works</NavLink>
            <NavLink href="/register/volunteer">For Volunteers</NavLink>
            <NavLink href="/register/organization">For Organizations</NavLink>
            <NavLink href="/register/mentor">For Mentors</NavLink>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              Login
            </Link>

            <Link
              href="/register/volunteer"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(37,99,235,0.22)] transition hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg text-slate-700 transition hover:bg-slate-50 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="relative block h-5 w-5">
            <span
              className={`absolute left-0 top-1 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                open ? "top-2.5 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-2.5 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-4 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                open ? "top-2.5 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`overflow-hidden border-t border-slate-200 bg-white/95 backdrop-blur transition-all duration-300 md:hidden ${
          open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-2 px-4 py-5">
          <MobileNavLink href="/" onClick={() => setOpen(false)}>
            Home
          </MobileNavLink>

          <MobileNavLink href="/#how-it-works" onClick={() => setOpen(false)}>
            How it Works
          </MobileNavLink>

          <MobileNavLink
            href="/register/volunteer"
            onClick={() => setOpen(false)}
          >
            For Volunteers
          </MobileNavLink>

          <MobileNavLink
            href="/register/organization"
            onClick={() => setOpen(false)}
          >
            For Organizations
          </MobileNavLink>

          <MobileNavLink
            href="/register/mentor"
            onClick={() => setOpen(false)}
          >
            For Mentors
          </MobileNavLink>

          <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
            <Link
              href="/login"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>

            <Link
              href="/register/volunteer"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(37,99,235,0.18)] transition hover:bg-blue-700"
              onClick={() => setOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="relative text-sm font-medium text-slate-600 transition hover:text-blue-600 after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-blue-600 after:transition-all hover:after:w-full"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-50 hover:text-blue-600"
    >
      {children}
    </Link>
  );
}
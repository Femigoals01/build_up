




// import Link from "next/link";

// export default function Footer() {
//   return (
//     <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
//       <div className="mx-auto max-w-7xl px-6 py-14 md:px-8 lg:px-10">
//         <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
//           {/* BRAND */}
//           <div className="lg:col-span-1">
//             <div className="mb-4 flex items-center gap-3">
//               <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-extrabold text-white shadow-[0_10px_25px_rgba(37,99,235,0.25)]">
//                 B
//               </div>
//               <div>
//                 <h4 className="text-xl font-bold tracking-tight text-white">
//                   BuildUp
//                 </h4>
//                 <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
//                   Real projects. Real growth.
//                 </p>
//               </div>
//             </div>

//             <p className="max-w-sm text-sm leading-7 text-slate-400">
//               A platform connecting volunteers, organizations, and mentors
//               through real-world projects that build practical skills, trusted
//               portfolios, and meaningful growth.
//             </p>
//           </div>

//           {/* QUICK LINKS */}
//           <div>
//             <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">
//               Quick Links
//             </h4>
//             <ul className="space-y-3 text-sm">
//               <li>
//                 <Link
//                   href="/projects"
//                   className="transition hover:text-white"
//                 >
//                   Projects
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/#how-it-works"
//                   className="transition hover:text-white"
//                 >
//                   How it Works
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/register/mentor"
//                   className="transition hover:text-white"
//                 >
//                   Become a Mentor
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/contact"
//                   className="transition hover:text-white"
//                 >
//                   Contact
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* GET STARTED */}
//           <div>
//             <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">
//               Get Started
//             </h4>
//             <ul className="space-y-3 text-sm">
//               <li>
//                 <Link
//                   href="/register/volunteer"
//                   className="transition hover:text-white"
//                 >
//                   Join as Volunteer
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/register/organization"
//                   className="transition hover:text-white"
//                 >
//                   Join as Organization
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/register/mentor"
//                   className="transition hover:text-white"
//                 >
//                   Join as Mentor
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/login"
//                   className="transition hover:text-white"
//                 >
//                   Login
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* SOCIAL / COMMUNITY */}
//           <div>
//             <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">
//               Community
//             </h4>
//             <ul className="space-y-3 text-sm text-slate-400">
//               <li>
//                 <a href="#" className="transition hover:text-white">
//                   Instagram
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="transition hover:text-white">
//                   Twitter
//                 </a>
//               </li>
//               <li>
//                 <a href="#" className="transition hover:text-white">
//                   LinkedIn
//                 </a>
//               </li>
//             </ul>

//             <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
//               <p className="text-sm font-semibold text-white">
//                 Build experience that speaks.
//               </p>
//               <p className="mt-2 text-sm leading-6 text-slate-400">
//                 Join BuildUp to connect learning with real work and visible
//                 proof of skill.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* BOTTOM BAR */}
//         <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
//           <p>© {new Date().getFullYear()} BuildUp. All rights reserved.</p>

//           <div className="flex flex-wrap items-center gap-4">
//             <Link href="/privacy" className="transition hover:text-white">
//               Privacy
//             </Link>
//             <Link href="/terms" className="transition hover:text-white">
//               Terms
//             </Link>
//             <Link href="/contact" className="transition hover:text-white">
//               Support
//             </Link>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }




import Link from "next/link";
import BuildUpLogo from "@/components/brand/BuildUpLogo";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-8 lg:px-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
           <div className="mb-4 flex items-center">
  <BuildUpLogo
    href="/"
    showTagline
    dark
    textSize="lg"
    className="items-center"
    imageClassName="bg-white rounded-xl p-1"
  />
</div>

            <p className="max-w-sm text-sm leading-7 text-slate-400">
              A platform connecting volunteers, organizations, and mentors
              through real-world projects that build practical skills, trusted
              portfolios, and meaningful growth.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/projects" className="transition hover:text-white">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="transition hover:text-white">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/register/mentor" className="transition hover:text-white">
                  Become a Mentor
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Get Started
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/register/volunteer" className="transition hover:text-white">
                  Join as Volunteer
                </Link>
              </li>
              <li>
                <Link href="/register/organization" className="transition hover:text-white">
                  Join as Organization
                </Link>
              </li>
              <li>
                <Link href="/register/mentor" className="transition hover:text-white">
                  Join as Mentor
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-white">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Community
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <a href="#" className="transition hover:text-white">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  LinkedIn
                </a>
              </li>
            </ul>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-sm font-semibold text-white">
                Build experience that speaks.
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Join BuildUp to connect learning with real work and visible
                proof of skill.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} BuildUp. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              Terms
            </Link>
            <Link href="/contact" className="transition hover:text-white">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}





// import BuildUpLogo from "@/components/brand/BuildUpLogo";

// export default function Footer() {
//   return (
//     <footer className="border-t bg-white mt-20">
//       <div className="max-w-7xl mx-auto px-6 py-10">

//         <div className="flex flex-col md:flex-row md:justify-between gap-6">

//           <div>
//             <BuildUpLogo />
//             <p className="mt-3 text-sm text-gray-500 max-w-sm">
//               Build real experience. Work on real projects. Grow your career.
//             </p>
//           </div>

//           <div className="flex gap-10 text-sm">
//             <div>
//               <p className="font-semibold mb-2">Platform</p>
//               <p>Projects</p>
//               <p>Mentors</p>
//               <p>Portfolio</p>
//             </div>

//             <div>
//               <p className="font-semibold mb-2">Company</p>
//               <p>About</p>
//               <p>Contact</p>
//               <p>Privacy</p>
//             </div>
//           </div>

//         </div>

//         <div className="mt-10 text-center text-xs text-gray-400">
//           © {new Date().getFullYear()} BuildUp. All rights reserved.
//         </div>
//       </div>
//     </footer>
//   );
// }
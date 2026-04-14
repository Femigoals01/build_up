



// "use client";

// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import BuildUpLogo from "@/components/brand/BuildUpLogo";

// export default function VerifyEmailSuccessPage() {
//   const searchParams = useSearchParams();
//   const email = searchParams.get("email") || "";

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-8">
//       <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center">
//         <section className="w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
//           <div className="relative px-6 py-10 md:px-10 md:py-12">
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_22%)]" />

//             <div className="relative z-10 text-center">
//               <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
//                 <BuildUpLogo
//                   href="/"
//                   showTagline={false}
//                   className="justify-center"
//                 />
//               </div>

//               <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
//                 ✅
//               </div>

//               <p className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
//                 Email Verified
//               </p>

//               <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
//                 Your BuildUp account is ready
//               </h1>

//               <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 md:text-base">
//                 You can now log in and start building real-world experience.
//               </p>

//               <div className="mt-8 grid gap-3 sm:grid-cols-2">
//                 <Link
//                   href={`/login?email=${encodeURIComponent(email)}`}
//                   className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
//                 >
//                   Continue to Login →
//                 </Link>

//                 <Link
//                   href="/"
//                   className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//                 >
//                   Return Home
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }





"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BuildUpLogo from "@/components/brand/BuildUpLogo";

export default function VerifyEmailSuccessPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-8">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center">
        <section className="w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <div className="relative px-6 py-10 md:px-10 md:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_22%)]" />

            <div className="relative z-10 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
                <BuildUpLogo
                  href="/"
                  showTagline={false}
                  className="justify-center"
                />
              </div>

              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
                ✅
              </div>

              <p className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
                Email Verified
              </p>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Your BuildUp account is ready
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 md:text-base">
                Your email has been verified successfully. You can now log in and
                access your dashboard, projects, mentors, and portfolio tools.
              </p>

              {email && (
                <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                    Verified Email
                  </p>
                  <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                    {email}
                  </p>
                </div>
              )}

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Link
                  href={
                    email
                      ? `/login?email=${encodeURIComponent(email)}`
                      : "/login"
                  }
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Continue to Login
                </Link>

                <Link
                  href="/"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Return Home
                </Link>
              </div>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left">
                <p className="text-sm font-semibold text-slate-900">
                  What happens next?
                </p>
                <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                  <li>• Log in to access your BuildUp dashboard</li>
                  <li>• Complete your profile for stronger visibility</li>
                  <li>• Start applying for live projects</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
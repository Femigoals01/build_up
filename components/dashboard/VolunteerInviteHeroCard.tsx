




// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import InviteResponseButtons from "@/components/projects/InviteResponseButtons";

// type Props = {
//   applicationId: string;
//   projectId: string;
//   projectTitle: string;
//   organizationName: string;
// };

// export default function VolunteerInviteHeroCard({
//   applicationId,
//   projectId,
//   projectTitle,
//   organizationName,
// }: Props) {
//   const [isVisible, setIsVisible] = useState(true);
//   const [isAnimatingOut, setIsAnimatingOut] = useState(false);
//   const [toast, setToast] = useState<string | null>(null);

//   const handleDone = (action: "accept" | "decline") => {
//     // 🔥 Trigger animation
//     setIsAnimatingOut(true);

//     // 🔥 After animation, remove card + show toast
//     setTimeout(() => {
//       setIsVisible(false);

//       if (action === "accept") {
//         setToast("Invite accepted 🚀");
//       } else {
//         setToast("Invite declined");
//       }

//       setTimeout(() => setToast(null), 3000);
//     }, 350);
//   };

//   if (!isVisible) {
//     return (
//       <>
//         {toast && (
//           <div className="fixed top-6 right-6 z-50">
//             <div className="bg-black text-white px-5 py-3 rounded-xl shadow-lg text-sm font-semibold animate-fade-in">
//               {toast}
//             </div>
//           </div>
//         )}
//       </>
//     );
//   }

//   return (
//     <>
//       {/* Toast */}
//       {toast && (
//         <div className="fixed top-6 right-6 z-50">
//           <div className="bg-black text-white px-5 py-3 rounded-xl shadow-lg text-sm font-semibold animate-fade-in">
//             {toast}
//           </div>
//         </div>
//       )}

//       {/* Card */}
//       <section
//         className={`rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-50 via-white to-blue-50 p-6 shadow-sm transition-all duration-300 ease-in-out
//         ${
//           isAnimatingOut
//             ? "opacity-0 translate-x-10 scale-95"
//             : "opacity-100 translate-x-0 scale-100"
//         }`}
//       >
//         <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
//           <div className="flex items-start gap-4">
//             <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-purple-100 text-2xl">
//               📩
//             </div>

//             <div>
//               <div className="text-xs font-bold text-purple-700 uppercase tracking-wider">
//                 Invitation received
//               </div>

//               <h2 className="mt-2 text-lg font-bold text-gray-900">
//                 {organizationName} invited you to join {projectTitle}
//               </h2>

//               <p className="text-sm text-gray-600 mt-1">
//                 Accept to start working or decline if it’s not a fit.
//               </p>

//               <InviteResponseButtons
//                 applicationId={applicationId}
//                 onDone={handleDone}
//               />
//             </div>
//           </div>

//           <div className="flex gap-3 flex-wrap">
//             <Link
//               href="/dashboard/projects?tab=PENDING"
//               className="px-5 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700"
//             >
//               Review Invite
//             </Link>

//             <Link
//               href={`/projects/${projectId}`}
//               className="px-5 py-2 border rounded-xl text-sm font-semibold hover:bg-gray-50"
//             >
//               View Project
//             </Link>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }




// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import InviteResponseButtons from "@/components/projects/InviteResponseButtons";

// type Props = {
//   applicationId: string;
//   projectId: string;
//   projectTitle: string;
//   organizationName: string;
// };

// export default function VolunteerInviteHeroCard({
//   applicationId,
//   projectId,
//   projectTitle,
//   organizationName,
// }: Props) {
//   const router = useRouter();

//   const [isVisible, setIsVisible] = useState(true);
//   const [isAnimatingOut, setIsAnimatingOut] = useState(false);
//   const [toast, setToast] = useState<string | null>(null);

//   useEffect(() => {
//     if (!toast) return;

//     const timer = setTimeout(() => {
//       setToast(null);
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [toast]);

//   const handleDone = (action: "accept" | "decline") => {
//     setIsAnimatingOut(true);

//     setTimeout(() => {
//       setIsVisible(false);
//       setToast(action === "accept" ? "Invite accepted 🚀" : "Invite declined");
//     }, 350);

//     setTimeout(() => {
//       router.refresh();
//     }, 650);
//   };

//   return (
//     <>
//       {toast && (
//         <div className="fixed right-6 top-6 z-50">
//           <div className="animate-fade-in rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg">
//             {toast}
//           </div>
//         </div>
//       )}

//       {isVisible && (
//         <section
//           className={`rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-50 via-white to-blue-50 p-6 shadow-sm transition-all duration-300 ease-in-out ${
//             isAnimatingOut
//               ? "translate-x-10 scale-95 opacity-0"
//               : "translate-x-0 scale-100 opacity-100"
//           }`}
//         >
//           <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
//             <div className="flex items-start gap-4">
//               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
//                 📩
//               </div>

//               <div>
//                 <div className="text-xs font-bold uppercase tracking-wider text-purple-700">
//                   Invitation received
//                 </div>

//                 <h2 className="mt-2 text-lg font-bold text-gray-900">
//                   {organizationName} invited you to join {projectTitle}
//                 </h2>

//                 <p className="mt-1 text-sm text-gray-600">
//                   Accept to start working or decline if it’s not a fit.
//                 </p>

//                 <InviteResponseButtons
//                   applicationId={applicationId}
//                   onDone={handleDone}
//                 />
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-3">
//               <Link
//                 href="/dashboard/projects?tab=PENDING"
//                 className="rounded-xl bg-purple-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
//               >
//                 Review Invite
//               </Link>

//               <Link
//                 href={`/projects/${projectId}`}
//                 className="rounded-xl border px-5 py-2 text-sm font-semibold transition hover:bg-gray-50"
//               >
//                 View Project
//               </Link>
//             </div>
//           </div>
//         </section>
//       )}
//     </>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InviteResponseButtons from "@/components/projects/InviteResponseButtons";

type Props = {
  applicationId: string;
  projectId: string;
  projectTitle: string;
  organizationName: string;
};

export default function VolunteerInviteHeroCard({
  applicationId,
  projectId,
  projectTitle,
  organizationName,
}: Props) {
  const router = useRouter();

  const [hidden, setHidden] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastClosing, setToastClosing] = useState(false);

  useEffect(() => {
    if (!toast) return;

    const startClose = setTimeout(() => {
      setToastClosing(true);
    }, 2400);

    const clear = setTimeout(() => {
      setToast(null);
      setToastClosing(false);
    }, 2800);

    return () => {
      clearTimeout(startClose);
      clearTimeout(clear);
    };
  }, [toast]);

  const handleDone = (action: "accept" | "decline") => {
    setIsClosing(true);

    setTimeout(() => {
      setHidden(true);
      setToast(action === "accept" ? "Invite accepted 🚀" : "Invite declined");
    }, 420);

    setTimeout(() => {
      router.refresh();
    }, 900);
  };

  if (hidden) {
    return (
      <>
        {toast && (
          <div className="fixed right-6 top-6 z-50">
            <div
              className={`rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-2xl ${
                toastClosing ? "animate-toast-out" : "animate-toast-in"
              }`}
            >
              {toast}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {toast && (
        <div className="fixed right-6 top-6 z-50">
          <div
            className={`rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-2xl ${
              toastClosing ? "animate-toast-out" : "animate-toast-in"
            }`}
          >
            {toast}
          </div>
        </div>
      )}

      <section
        className={`rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-50 via-white to-blue-50 p-6 shadow-sm ${
          isClosing ? "animate-invite-card-out" : "animate-invite-card-in"
        }`}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-2xl">
              📩
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-purple-700">
                Invitation received
              </div>

              <h2 className="mt-2 text-lg font-bold text-gray-900">
                {organizationName} invited you to join {projectTitle}
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Accept to start working or decline if it’s not a fit.
              </p>

              <InviteResponseButtons
                applicationId={applicationId}
                onDone={handleDone}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/projects?tab=PENDING"
              className="rounded-xl bg-purple-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Review Invite
            </Link>

            <Link
              href={`/projects/${projectId}`}
              className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-gray-50"
            >
              View Project
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
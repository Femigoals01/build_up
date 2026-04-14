// "use client";

// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";

// type OnboardingStep = {
//   label: string;
//   done: boolean;
//   href: string;
//   description: string;
//   icon: string;
// };

// type Props = {
//   userId: string;
//   show: boolean;
//   onboardingProgress: number;
//   completedOnboardingSteps: number;
//   totalOnboardingSteps: number;
//   nextOnboardingStep?: OnboardingStep;
//   onboardingSteps: OnboardingStep[];
// };

// export default function VolunteerOnboardingBanner({
//   userId,
//   show,
//   onboardingProgress,
//   completedOnboardingSteps,
//   totalOnboardingSteps,
//   nextOnboardingStep,
//   onboardingSteps,
// }: Props) {
//   const dismissalKey = useMemo(
//     () => `buildup:onboarding-dismissed:${userId}:${onboardingProgress}:${completedOnboardingSteps}`,
//     [userId, onboardingProgress, completedOnboardingSteps]
//   );

//   const [isDismissed, setIsDismissed] = useState(false);
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     try {
//       const dismissed = window.localStorage.getItem(dismissalKey) === "true";
//       setIsDismissed(dismissed);
//     } catch {
//       setIsDismissed(false);
//     } finally {
//       setIsReady(true);
//     }
//   }, [dismissalKey]);

//   const handleDismiss = () => {
//     try {
//       window.localStorage.setItem(dismissalKey, "true");
//     } catch {
//       // ignore storage errors
//     }
//     setIsDismissed(true);
//   };

//   if (!show || !isReady || isDismissed) {
//     return null;
//   }

//   return (
//     <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-blue-50 p-5 shadow-sm sm:p-8">
//       <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-indigo-100 blur-2xl" />
//       <div className="absolute bottom-0 left-1/4 h-24 w-24 rounded-full bg-blue-100 blur-2xl" />

//       <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
//         <div className="max-w-2xl">
//           <div className="flex flex-wrap items-center gap-3">
//             <div className="inline-flex items-center rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">
//               First-time onboarding
//             </div>

//             <button
//               type="button"
//               onClick={handleDismiss}
//               className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
//               aria-label="Dismiss onboarding banner"
//             >
//               Dismiss ✕
//             </button>
//           </div>

//           <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
//             Let’s get your BuildUp profile fully ready
//           </h2>

//           <p className="mt-2 text-sm leading-7 text-slate-600">
//             Complete a few key steps to improve your visibility, unlock better
//             matches, and start building real project experience faster.
//           </p>

//           <div className="mt-5">
//             <div className="mb-2 flex items-center justify-between">
//               <span className="text-sm font-medium text-slate-700">
//                 Onboarding progress
//               </span>
//               <span className="text-sm font-semibold text-indigo-700">
//                 {onboardingProgress}%
//               </span>
//             </div>

//             <div className="h-3 overflow-hidden rounded-full bg-slate-200">
//               <div
//                 className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"
//                 style={{ width: `${onboardingProgress}%` }}
//               />
//             </div>

//             <p className="mt-3 text-sm text-slate-600">
//               {completedOnboardingSteps} of {totalOnboardingSteps} onboarding
//               steps completed
//             </p>
//           </div>

//           {nextOnboardingStep && (
//             <div className="mt-5 rounded-2xl border border-indigo-100 bg-white px-4 py-4">
//               <p className="text-sm font-semibold text-indigo-900">
//                 Next best step
//               </p>
//               <p className="mt-1 text-sm text-slate-700">
//                 <span className="mr-1">{nextOnboardingStep.icon}</span>
//                 <strong>{nextOnboardingStep.label}</strong> —{" "}
//                 {nextOnboardingStep.description}
//               </p>
//             </div>
//           )}
//         </div>

//         <div className="grid gap-3 lg:min-w-[300px]">
//           {onboardingSteps.map((step) => (
//             <div
//               key={step.label}
//               className={`rounded-2xl border px-4 py-4 ${
//                 step.done
//                   ? "border-green-200 bg-green-50"
//                   : "border-slate-200 bg-white"
//               }`}
//             >
//               <div className="flex items-start gap-3">
//                 <span className="mt-0.5 text-lg">
//                   {step.done ? "✅" : step.icon}
//                 </span>

//                 <div className="min-w-0 flex-1">
//                   <p
//                     className={`text-sm font-semibold ${
//                       step.done ? "text-green-800" : "text-slate-900"
//                     }`}
//                   >
//                     {step.label}
//                   </p>
//                   <p className="mt-1 text-sm text-slate-600">
//                     {step.description}
//                   </p>

//                   {!step.done && (
//                     <Link
//                       href={step.href}
//                       className="mt-3 inline-flex text-sm font-semibold text-indigo-700 hover:underline"
//                     >
//                       Take action →
//                     </Link>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }



"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type OnboardingStep = {
  label: string;
  done: boolean;
  href: string;
  description: string;
  icon: string;
};

type Props = {
  userId: string;
  show: boolean;
  onboardingProgress: number;
  completedOnboardingSteps: number;
  totalOnboardingSteps: number;
  nextOnboardingStep?: OnboardingStep;
  onboardingSteps: OnboardingStep[];
  resetSignal?: number;
  onDismiss?: () => void;
};

export default function VolunteerOnboardingBanner({
  userId,
  show,
  onboardingProgress,
  completedOnboardingSteps,
  totalOnboardingSteps,
  nextOnboardingStep,
  onboardingSteps,
  resetSignal = 0,
  onDismiss,
}: Props) {
  const dismissalKey = useMemo(
    () =>
      `buildup:onboarding-dismissed:${userId}:${onboardingProgress}:${completedOnboardingSteps}`,
    [userId, onboardingProgress, completedOnboardingSteps]
  );

  const [isDismissed, setIsDismissed] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const dismissed = window.localStorage.getItem(dismissalKey) === "true";
      setIsDismissed(dismissed);
    } catch {
      setIsDismissed(false);
    } finally {
      setIsReady(true);
    }
  }, [dismissalKey]);

  useEffect(() => {
    if (!isReady) return;

    try {
      window.localStorage.removeItem(dismissalKey);
    } catch {
      // ignore storage errors
    }

    setIsDismissed(false);
  }, [resetSignal, dismissalKey, isReady]);

  const handleDismiss = () => {
    try {
      window.localStorage.setItem(dismissalKey, "true");
    } catch {
      // ignore storage errors
    }
    setIsDismissed(true);
    onDismiss?.();
  };

  if (!show || !isReady || isDismissed) {
    return null;
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-blue-50 p-5 shadow-sm sm:p-8">
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-indigo-100 blur-2xl" />
      <div className="absolute bottom-0 left-1/4 h-24 w-24 rounded-full bg-blue-100 blur-2xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">
              First-time onboarding
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
              aria-label="Hide onboarding for now"
            >
              Hide for now
            </button>
          </div>

          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Let’s get your BuildUp profile fully ready
          </h2>

          <p className="mt-2 text-sm leading-7 text-slate-600">
            Complete a few key steps to improve your visibility, unlock better
            matches, and start building real project experience faster.
          </p>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">
                Onboarding progress
              </span>
              <span className="text-sm font-semibold text-indigo-700">
                {onboardingProgress}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"
                style={{ width: `${onboardingProgress}%` }}
              />
            </div>

            <p className="mt-3 text-sm text-slate-600">
              {completedOnboardingSteps} of {totalOnboardingSteps} onboarding
              steps completed
            </p>
          </div>

        {nextOnboardingStep && (
  <div className="relative mt-5 rounded-2xl border border-indigo-200 bg-white px-4 py-4 shadow-md shadow-indigo-100/60 ring-1 ring-indigo-100 transition hover:shadow-lg hover:shadow-indigo-200/60">
    
    {/* 🔥 Glow background */}
    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-100/40 via-blue-100/30 to-transparent blur-xl" />

    {/* 🆕 Badge */}
    <div className="absolute -top-2 right-3">
      <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white shadow">
        NEW
      </span>
    </div>

    <div className="relative z-10">
      <p className="text-sm font-semibold text-indigo-900">
        🎯 Next best step
      </p>

      <p className="mt-1 text-sm text-slate-700">
        <span className="mr-1">{nextOnboardingStep.icon}</span>
        <strong>{nextOnboardingStep.label}</strong> —{" "}
        {nextOnboardingStep.description}
      </p>

      <Link
        href={nextOnboardingStep.href}
        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:underline"
      >
        Take action →
      </Link>
    </div>
  </div>
)}
        </div>

        <div className="grid gap-3 lg:min-w-[300px]">
          {onboardingSteps.map((step) => (
            <div
              key={step.label}
              className={`rounded-2xl border px-4 py-4 ${
                step.done
                  ? "border-green-200 bg-green-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-lg">
                  {step.done ? "✅" : step.icon}
                </span>

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-semibold ${
                      step.done ? "text-green-800" : "text-slate-900"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {step.description}
                  </p>

                  {!step.done && (
                    <Link
                      href={step.href}
                      className="mt-3 inline-flex text-sm font-semibold text-indigo-700 hover:underline"
                    >
                      Take action →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
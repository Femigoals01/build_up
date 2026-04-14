// "use client";

// import { useState } from "react";
// import VolunteerOnboardingBanner from "@/components/dashboard/VolunteerOnboardingBanner";

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

// export default function OnboardingBannerShell(props: Props) {
//   const [resetSignal, setResetSignal] = useState(0);
//   const [dismissed, setDismissed] = useState(false);

//   return (
//     <div className="space-y-3">
//       {dismissed && props.show && (
//         <div className="flex justify-end">
//           <button
//             type="button"
//             onClick={() => {
//               setDismissed(false);
//               setResetSignal((prev) => prev + 1);
//             }}
//             className="text-sm font-semibold text-indigo-700 hover:underline"
//           >
//             Show onboarding again
//           </button>
//         </div>
//       )}

//       <VolunteerOnboardingBanner
//         {...props}
//         resetSignal={resetSignal}
//         onDismiss={() => setDismissed(true)}
//       />
//     </div>
//   );
// }




"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import VolunteerOnboardingBanner from "@/components/dashboard/VolunteerOnboardingBanner";

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
};

const CONFETTI_COUNT = 22;

export default function OnboardingBannerShell(props: Props) {
  const [resetSignal, setResetSignal] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const celebrationKey = useMemo(
    () => `buildup:onboarding-celebrated:${props.userId}`,
    [props.userId]
  );

  useEffect(() => {
    if (props.onboardingProgress === 100) {
      const hasCelebrated =
        typeof window !== "undefined" &&
        window.localStorage.getItem(celebrationKey) === "true";

      if (!hasCelebrated) {
        setShowCelebration(true);
        try {
          window.localStorage.setItem(celebrationKey, "true");
        } catch {
          // ignore storage errors
        }

        const timer = setTimeout(() => {
          setShowCelebration(false);
        }, 5000);

        return () => clearTimeout(timer);
      }
    }
  }, [props.onboardingProgress, celebrationKey]);

  const confettiPieces = Array.from({ length: CONFETTI_COUNT }, (_, index) => {
    const left = (index * 97) % 100;
    const delay = (index % 8) * 0.08;
    const duration = 2.8 + (index % 5) * 0.2;
    const rotate = ((index * 47) % 60) - 30;
    const size = 8 + (index % 4) * 3;
    const colors = [
      "bg-blue-500",
      "bg-indigo-500",
      "bg-emerald-500",
      "bg-yellow-400",
      "bg-pink-500",
      "bg-purple-500",
    ];
    const color = colors[index % colors.length];

    return {
      left: `${left}%`,
      delay: `${delay}s`,
      duration: `${duration}s`,
      rotate: `rotate(${rotate}deg)`,
      size,
      color,
    };
  });

  return (
    <div className="space-y-4">
      {showCelebration && (
        <section className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-blue-50 px-5 py-6 shadow-sm sm:px-8">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confettiPieces.map((piece, index) => (
              <span
                key={index}
                className={`absolute top-0 rounded-sm opacity-90 ${piece.color}`}
                style={{
                  left: piece.left,
                  width: `${piece.size}px`,
                  height: `${piece.size * 1.6}px`,
                  transform: piece.rotate,
                  animationName: "buildup-confetti-fall",
                  animationDuration: piece.duration,
                  animationDelay: piece.delay,
                  animationTimingFunction: "ease-in",
                  animationFillMode: "forwards",
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Onboarding complete
              </div>

              <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                🎉 You completed your BuildUp onboarding
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                Your profile is now fully set up. You are in a stronger position
                to get noticed, apply confidently, and build trusted proof of
                experience.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Explore Projects
              </Link>

              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                View Portfolio
              </Link>
            </div>
          </div>

          <style>{`
            @keyframes buildup-confetti-fall {
              0% {
                transform: translateY(-10px) rotate(0deg);
                opacity: 0;
              }
              10% {
                opacity: 1;
              }
              100% {
                transform: translateY(220px) rotate(240deg);
                opacity: 0;
              }
            }
          `}</style>
        </section>
      )}

      {dismissed && props.show && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              setDismissed(false);
              setResetSignal((prev) => prev + 1);
            }}
            className="text-sm font-semibold text-indigo-700 hover:underline"
          >
            Show onboarding again
          </button>
        </div>
      )}

      <VolunteerOnboardingBanner
        {...props}
        resetSignal={resetSignal}
        onDismiss={() => setDismissed(true)}
      />
    </div>
  );
}
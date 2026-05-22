

// "use client";

// import Link from "next/link";
// import { useState } from "react";
// // import {
// //   Copy,
// //   ExternalLink,
// //   Linkedin,
// //   MessageCircle,
// //   Send,
// //   Share2,
// //   Twitter,
// //   Users,
// // } from "lucide-react";

// import {
//   Copy,
//   ExternalLink,
//   MessageCircle,
//   Send,
//   Share2,
//   Users,
// } from "lucide-react";

// type Props = {
//   referralCode: string;
//   referralCount?: number;
//   portfolioUrl: string;
//   referralUrl: string;
// };

// export default function VolunteerQuickShareCard({
//   referralCode,
//   referralCount = 0,
//   portfolioUrl,
//   referralUrl,
// }: Props) {
//   const [copied, setCopied] = useState<
//     "portfolio" | "referral" | null
//   >(null);

//   async function copyText(
//     text: string,
//     type: "portfolio" | "referral"
//   ) {
//     try {
//       await navigator.clipboard.writeText(text);

//       setCopied(type);

//       setTimeout(() => {
//         setCopied(null);
//       }, 2000);
//     } catch (error) {
//       console.error("Copy failed:", error);
//     }
//   }

//   async function nativeShare(url: string, title: string) {
//     try {
//       if (navigator.share) {
//         await navigator.share({
//           title,
//           url,
//         });
//       } else {
//         window.open(url, "_blank");
//       }
//     } catch (error) {
//       console.error("Share failed:", error);
//     }
//   }

//   const encodedPortfolio = encodeURIComponent(portfolioUrl);
//   const encodedReferral = encodeURIComponent(referralUrl);

//   return (
//     <section className="grid gap-5 xl:grid-cols-2">
//       {/* REFERRAL CARD */}
//       <div className="relative overflow-hidden rounded-[30px] border border-blue-100 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 p-6 text-white shadow-[0_20px_60px_rgba(37,99,235,0.25)]">
//         <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

//         <div className="relative z-10">
//           <div className="flex items-start justify-between gap-4">
//             <div>
//               <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-100 backdrop-blur">
//                 <Users className="h-3.5 w-3.5" />
//                 Referral Program
//               </div>

//               <h2 className="mt-4 text-2xl font-black tracking-tight">
//                 Invite & grow your network
//               </h2>

//               <p className="mt-2 max-w-md text-sm leading-6 text-blue-100">
//                 Share BuildUp with friends and professionals. Help more people
//                 build verified real-world experience.
//               </p>
//             </div>

//             <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-center backdrop-blur">
//               <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-100">
//                 Referrals
//               </p>

//               <p className="mt-1 text-3xl font-black">
//                 {referralCount}
//               </p>
//             </div>
//           </div>

//           <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
//             <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-100">
//               Your Referral Code
//             </p>

//             <div className="mt-3 flex items-center justify-between gap-3">
//               <p className="truncate text-2xl font-black tracking-[0.08em]">
//                 {referralCode}
//               </p>

//               <button
//                 type="button"
//                 onClick={() =>
//                   copyText(referralUrl, "referral")
//                 }
//                 className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
//               >
//                 <Copy className="h-4 w-4" />

//                 {copied === "referral"
//                   ? "Copied"
//                   : "Copy Link"}
//               </button>
//             </div>

//             <p className="mt-3 truncate text-xs text-blue-100">
//               {referralUrl}
//             </p>
//           </div>

//           <div className="mt-5 flex flex-wrap gap-3">
//             <a
//               href={`https://wa.me/?text=${encodedReferral}`}
//               target="_blank"
//               rel="noreferrer"
//               className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
//             >
//               <MessageCircle className="h-4 w-4" />
//               WhatsApp
//             </a>

//             <a
//               href={`https://twitter.com/intent/tweet?url=${encodedReferral}`}
//               target="_blank"
//               rel="noreferrer"
//               className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
//             >
//               {/* <Twitter className="h-4 w-4" /> */}

//               <svg
//   xmlns="http://www.w3.org/2000/svg"
//   viewBox="0 0 24 24"
//   fill="currentColor"
//   className="h-4 w-4"
// >
//   <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.9 1.153Zm-1.292 19.49h2.039L6.486 3.24H4.298L17.61 20.643Z" />
// </svg>
//               X
//             </a>

//             <button
//               type="button"
//               onClick={() =>
//                 nativeShare(referralUrl, "Join BuildUp")
//               }
//               className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
//             >
//               <Share2 className="h-4 w-4" />
//               Share
//             </button>
//           </div>

//           <Link
//             href="/dashboard/referrals"
//             className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
//           >
//             Open Referral Dashboard
//             <ExternalLink className="h-4 w-4" />
//           </Link>
//         </div>
//       </div>

//       {/* PORTFOLIO CARD */}
//       <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
//         <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-blue-100/50 blur-3xl" />

//         <div className="relative z-10">
//           <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700">
//             <Share2 className="h-3.5 w-3.5" />
//             Public Portfolio
//           </div>

//           <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900">
//             Share your verified experience
//           </h2>

//           <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
//             Your BuildUp portfolio showcases completed projects, practical
//             experience, and proof-of-work that employers can verify.
//           </p>

//           <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
//             <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
//               Portfolio Link
//             </p>

//             <div className="mt-3 flex items-center justify-between gap-3">
//               <p className="truncate text-sm font-medium text-slate-700">
//                 {portfolioUrl}
//               </p>

//               <button
//                 type="button"
//                 onClick={() =>
//                   copyText(portfolioUrl, "portfolio")
//                 }
//                 className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
//               >
//                 <Copy className="h-4 w-4" />

//                 {copied === "portfolio"
//                   ? "Copied"
//                   : "Copy"}
//               </button>
//             </div>
//           </div>

//           <div className="mt-5 flex flex-wrap gap-3">
//             <a
//               href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedPortfolio}`}
//               target="_blank"
//               rel="noreferrer"
//               className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//             >
//               {/* <Linkedin className="h-4 w-4" /> */}

//               <svg
//   xmlns="http://www.w3.org/2000/svg"
//   viewBox="0 0 24 24"
//   fill="currentColor"
//   className="h-4 w-4"
// >
//   <path d="M4.98 3.5C4.98 4.604 4.104 5.5 3 5.5S1.02 4.604 1.02 3.5 1.896 1.5 3 1.5s1.98.896 1.98 2ZM1.5 8h3V22h-3V8Zm7.5 0h2.878v1.91h.041C12.32 8.955 13.665 8 15.54 8 19.08 8 20 10.235 20 13.438V22h-3v-7.125c0-1.699-.03-3.883-2.365-3.883-2.368 0-2.73 1.85-2.73 3.76V22h-3V8Z" />
// </svg>
//               LinkedIn
//             </a>

//             <a
//               href={`https://wa.me/?text=${encodedPortfolio}`}
//               target="_blank"
//               rel="noreferrer"
//               className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//             >
//               <MessageCircle className="h-4 w-4" />
//               WhatsApp
//             </a>

//             <a
//               href={`https://t.me/share/url?url=${encodedPortfolio}`}
//               target="_blank"
//               rel="noreferrer"
//               className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//             >
//               <Send className="h-4 w-4" />
//               Telegram
//             </a>

//             <button
//               type="button"
//               onClick={() =>
//                 nativeShare(
//                   portfolioUrl,
//                   "My BuildUp Portfolio"
//                 )
//               }
//               className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//             >
//               <Share2 className="h-4 w-4" />
//               Share
//             </button>
//           </div>

//           <div className="mt-6 flex flex-wrap gap-3">
//             <a
//               href={portfolioUrl}
//               target="_blank"
//               rel="noreferrer"
//               className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
//             >
//               Open Portfolio
//               <ExternalLink className="h-4 w-4" />
//             </a>

//             <Link
//               href="/dashboard/portfolio"
//               className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//             >
//               Manage Portfolio
//             </Link>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }





"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Copy,
  ExternalLink,
  Share2,
  Users,
} from "lucide-react";

type Props = {
  referralCode: string;
  referralCount?: number;
  portfolioUrl: string;
  referralUrl: string;
};

export default function VolunteerQuickShareCard({
  referralCode,
  referralCount = 0,
  portfolioUrl,
  referralUrl,
}: Props) {
  const [copied, setCopied] = useState<
    "portfolio" | "referral" | null
  >(null);

  async function copyText(
    text: string,
    type: "portfolio" | "referral"
  ) {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(type);

      setTimeout(() => {
        setCopied(null);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }

  async function nativeShare(url: string, title: string) {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url,
        });
      } else {
        window.open(url, "_blank");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  }

  return (
    <section className="grid gap-5 xl:grid-cols-2">
      {/* REFERRAL CARD */}
      <div className="relative overflow-hidden rounded-[28px] border border-blue-100 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 p-5 text-white shadow-[0_20px_60px_rgba(37,99,235,0.18)]">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-100 backdrop-blur">
              <Users className="h-3.5 w-3.5" />
              Referral Program
            </div>

            <div className="rounded-xl bg-white/10 px-3 py-2 text-center backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.16em] text-blue-100">
                Referrals
              </p>

              <p className="text-lg font-black">
                {referralCount}
              </p>
            </div>
          </div>

          <h2 className="mt-5 text-xl font-black tracking-tight">
            Invite & Earn
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-blue-100">
            Share BuildUp with friends and professionals and earn ₦50
            per registered referral while you also help more people
            build verified real-world experience.
          </p>

          <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-100">
              Referral Link
            </p>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex-1 truncate rounded-xl bg-black/10 px-4 py-3 text-sm text-white/90">
                {referralUrl}
              </div>

              <button
                type="button"
                onClick={() =>
                  copyText(referralUrl, "referral")
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                <Copy className="h-4 w-4" />

                {copied === "referral"
                  ? "Copied"
                  : "Copy"}
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                nativeShare(referralUrl, "Join BuildUp")
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>

            <Link
              href="/dashboard/referrals"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
            >
              Referral Dashboard
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* PORTFOLIO CARD */}
      <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
        <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700">
            <Share2 className="h-3.5 w-3.5" />
            Portfolio
          </div>

          <h2 className="mt-5 text-xl font-black tracking-tight text-slate-900">
            Share your verified portfolio
          </h2>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Portfolio Link
            </p>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex-1 truncate rounded-xl bg-white px-4 py-3 text-sm text-slate-700 border border-slate-200">
                {portfolioUrl}
              </div>

              <button
                type="button"
                onClick={() =>
                  copyText(portfolioUrl, "portfolio")
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Copy className="h-4 w-4" />

                {copied === "portfolio"
                  ? "Copied"
                  : "Copy"}
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                nativeShare(
                  portfolioUrl,
                  "My BuildUp Portfolio"
                )
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>

            <a
              href={portfolioUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Open Portfolio
              <ExternalLink className="h-4 w-4" />
            </a>

            <Link
              href="/portfolio"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Manage Portfolio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
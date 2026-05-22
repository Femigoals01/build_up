// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { Copy, ExternalLink, Share2 } from "lucide-react";

// type Props = {
//   referralUrl: string;
//   portfolioUrl: string;
// };

// export default function VolunteerHeroQuickLinks({
//   referralUrl,
//   portfolioUrl,
// }: Props) {
//   const [copied, setCopied] = useState<"referral" | "portfolio" | null>(null);

//   async function copyText(text: string, type: "referral" | "portfolio") {
//     await navigator.clipboard.writeText(text);
//     setCopied(type);

//     setTimeout(() => {
//       setCopied(null);
//     }, 1800);
//   }

//   async function shareLink(url: string, title: string) {
//     if (navigator.share) {
//       await navigator.share({ title, url });
//       return;
//     }

//     await navigator.clipboard.writeText(url);
//     setCopied(title === "Join BuildUp" ? "referral" : "portfolio");
//   }

//   return (
//     <div className="w-full max-w-sm rounded-[24px] border border-white/15 bg-white/10 p-4 text-white shadow-lg backdrop-blur">
//       <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-100">
//         Quick Access
//       </p>

//       <div className="mt-4 space-y-4">
//         <div>
//           <div className="flex items-center justify-between gap-3">
//             <p className="text-sm font-bold">Referral Link</p>

//             <div className="flex gap-2">
//               <button
//                 type="button"
//                 onClick={() => copyText(referralUrl, "referral")}
//                 className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-white px-3 text-xs font-bold text-slate-900 hover:bg-slate-100"
//               >
//                 <Copy className="h-3.5 w-3.5" />
//                 {copied === "referral" ? "Copied" : "Copy"}
//               </button>

//               <button
//                 type="button"
//                 onClick={() => shareLink(referralUrl, "Join BuildUp")}
//                 className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 text-xs font-bold text-white hover:bg-white/20"
//               >
//                 <Share2 className="h-3.5 w-3.5" />
//                 Share
//               </button>
//             </div>
//           </div>

//           <p className="mt-2 truncate rounded-xl bg-black/10 px-3 py-2 text-xs text-blue-50">
//             {referralUrl}
//           </p>
//         </div>

//         <div className="border-t border-white/10 pt-4">
//           <div className="flex items-center justify-between gap-3">
//             <p className="text-sm font-bold">Portfolio Link</p>

//             <div className="flex gap-2">
//               <button
//                 type="button"
//                 onClick={() => copyText(portfolioUrl, "portfolio")}
//                 className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-white px-3 text-xs font-bold text-slate-900 hover:bg-slate-100"
//               >
//                 <Copy className="h-3.5 w-3.5" />
//                 {copied === "portfolio" ? "Copied" : "Copy"}
//               </button>

//               <Link
//                 href={portfolioUrl}
//                 target="_blank"
//                 className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 text-xs font-bold text-white hover:bg-white/20"
//               >
//                 <ExternalLink className="h-3.5 w-3.5" />
//                 Open
//               </Link>
//             </div>
//           </div>

//           <p className="mt-2 truncate rounded-xl bg-black/10 px-3 py-2 text-xs text-blue-50">
//             {portfolioUrl}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }





"use client";

import Link from "next/link";
import { useState } from "react";
import { Copy, ExternalLink, Share2, Sparkles } from "lucide-react";

type Props = {
  referralUrl: string;
  portfolioUrl: string;
};

export default function VolunteerHeroQuickLinks({
  referralUrl,
 portfolioUrl,
}: Props) {
  const [copied, setCopied] = useState<
    "referral" | "portfolio" | null
  >(null);

  async function copyText(
    text: string,
    type: "referral" | "portfolio"
  ) {
    await navigator.clipboard.writeText(text);

    setCopied(type);

    setTimeout(() => {
      setCopied(null);
    }, 1800);
  }

  async function shareLink(url: string, title: string) {
    if (navigator.share) {
      await navigator.share({
        title,
        url,
      });

      return;
    }

    await navigator.clipboard.writeText(url);

    setCopied(
      title === "Join BuildUp"
        ? "referral"
        : "portfolio"
    );
  }

  return (
    <div className="w-full max-w-sm rounded-[24px] border border-white/15 bg-white/10 p-4 text-white shadow-lg backdrop-blur">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-100">
        Quick Access
      </p>

      {/* REFERRAL */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-white">
              Referral Link
            </p>

            <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/20 bg-green-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-100">
              <Sparkles className="h-3 w-3" />
              Earn ₦50
            </span>
          </div>
        </div>

        <p className="mt-1 text-xs leading-5 text-blue-100">
          Invite others and earn ₦50 for every successful signup.
        </p>

        <p className="mt-3 truncate rounded-xl bg-white/5 px-3 py-2 text-xs text-blue-50">
          {referralUrl}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              copyText(referralUrl, "referral")
            }
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-white px-3 text-xs font-bold text-slate-900 transition hover:bg-slate-100"
          >
            <Copy className="h-3.5 w-3.5" />

            {copied === "referral"
              ? "Copied"
              : "Copy"}
          </button>

          <button
            type="button"
            onClick={() =>
              shareLink(referralUrl, "Join BuildUp")
            }
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 text-xs font-bold text-white transition hover:bg-white/20"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>

          <Link
            href="/dashboard/referrals"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 text-xs font-bold text-white transition hover:bg-white/20"
          >
            Dashboard
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* PORTFOLIO */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 p-3">
        <p className="text-sm font-bold text-white">
          Portfolio Link
        </p>

        <p className="mt-1 text-xs leading-5 text-blue-100">
          Share your verified BuildUp portfolio with employers.
        </p>

        <p className="mt-3 truncate rounded-xl bg-white/5 px-3 py-2 text-xs text-blue-50">
          {portfolioUrl}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              copyText(portfolioUrl, "portfolio")
            }
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-white px-3 text-xs font-bold text-slate-900 transition hover:bg-slate-100"
          >
            <Copy className="h-3.5 w-3.5" />

            {copied === "portfolio"
              ? "Copied"
              : "Copy"}
          </button>

          <button
            type="button"
            onClick={() =>
              shareLink(
                portfolioUrl,
                "My BuildUp Portfolio"
              )
            }
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 text-xs font-bold text-white transition hover:bg-white/20"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>

          <Link
            href={portfolioUrl}
            target="_blank"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 text-xs font-bold text-white transition hover:bg-white/20"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open
          </Link>
        </div>
      </div>
    </div>
  );
}
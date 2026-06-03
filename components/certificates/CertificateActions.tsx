


// "use client";

// import { useState } from "react";

// export default function CertificateActions({
//   verifyUrl,
// }: {
//   verifyUrl: string;
// }) {
//   const [copied, setCopied] = useState(false);

//   async function copyLink() {
//     await navigator.clipboard.writeText(verifyUrl);
//     setCopied(true);

//     setTimeout(() => {
//       setCopied(false);
//     }, 1800);
//   }

//   return (
//     <div className="flex flex-wrap gap-3 print:hidden">
//       <button
//         type="button"
//         onClick={() => window.print()}
//         className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
//       >
//         Print / Save as PDF
//       </button>

//       <button
//         type="button"
//         onClick={copyLink}
//         className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
//       >
//         {copied ? "Copied" : "Copy Verification Link"}
//       </button>
//     </div>
//   );
// }

"use client";

import { useState } from "react";

export default function CertificateActions({
  verifyUrl,
}: {
  verifyUrl: string;
}) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(verifyUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  async function downloadCertificate() {
    try {
      setDownloading(true);
      window.location.href = "/api/certificates/download";
    } finally {
      setTimeout(() => {
        setDownloading(false);
      }, 1200);
    }
  }

  return (
    <div className="flex flex-wrap gap-3 print:hidden">
      <button
        type="button"
        onClick={downloadCertificate}
        disabled={downloading}
        className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {downloading ? "Preparing..." : "Download PDF"}
      </button>

      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
      >
        Print / Save as PDF
      </button>

      <button
        type="button"
        onClick={copyLink}
        className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
      >
        {copied ? "Copied" : "Copy Verification Link"}
      </button>
    </div>
  );
}
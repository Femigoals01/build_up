// "use client";

// export default function PortfolioShare({ url }: { url: string }) {
//   const copy = async () => {
//     await navigator.clipboard.writeText(url);
//     alert("✅ Portfolio link copied!");
//   };

//   return (
//     <div className="mt-4 bg-white border rounded-xl p-4 flex items-center justify-between">
//       <div>
//         <p className="text-sm text-gray-500">Your public portfolio</p>
//         <p className="font-medium text-blue-600 break-all">
//           {url}
//         </p>
//       </div>

//       <div className="flex gap-2">
//         <a
//           href={url}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
//         >
//           View
//         </a>

//         <button
//           onClick={copy}
//           className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
//         >
//           Copy
//         </button>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState } from "react";

export default function PortfolioShare({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/90 backdrop-blur border border-white/40 rounded-2xl px-6 py-4 shadow-sm w-full max-w-xl">
      <p className="text-xs uppercase tracking-wide text-gray-500">
        Public Portfolio
      </p>

      <div className="mt-1 flex items-center justify-between gap-4">
        <p className="font-medium text-blue-600 truncate">
          {url}
        </p>

        <div className="flex gap-2 shrink-0">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
          >
            View
          </a>

          <button
            onClick={copy}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
              copied
                ? "bg-green-50 text-green-700 border-green-300"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}

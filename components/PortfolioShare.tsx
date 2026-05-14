




"use client";

import Link from "next/link";
import { useState } from "react";

export default function PortfolioShare({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      const absoluteUrl =
        typeof window !== "undefined" && url.startsWith("/")
          ? `${window.location.origin}${url}`
          : url;

      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const isInternal = url.startsWith("/");

  return (
    <div className="flex items-center gap-2 shrink-0">
      {isInternal ? (
        <Link
          href={url}
          prefetch={false}
          className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          View Portfolio
        </Link>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          View Portfolio
        </a>
      )}

      <button
        type="button"
        onClick={copy}
        className={`inline-flex items-center rounded-xl border px-4 py-2 text-sm font-semibold transition ${
          copied
            ? "bg-green-50 text-green-700 border-green-300"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
        }`}
      >
        {copied ? "Copied ✓" : "Copy Link"}
      </button>
    </div>
  );
}
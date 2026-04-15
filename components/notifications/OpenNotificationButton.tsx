"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  notificationId: string;
  href: string;
  label?: string;
};

export default function OpenNotificationButton({
  notificationId,
  href,
  label = "Open Notification",
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);

      await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }),
      });

      router.push(href);
      router.refresh();
    } catch (error) {
      console.error("Open notification error:", error);
      router.push(href);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Opening..." : label}
    </button>
  );
}
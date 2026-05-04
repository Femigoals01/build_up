

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

type Props = {
  notificationId: string;
  href: string | null;
  unreadCount: number;
};

export default function LatestNotificationActions({
  notificationId,
  href,
  unreadCount,
}: Props) {
  const router = useRouter();
  const [localUnreadCount, setLocalUnreadCount] = useState(unreadCount);
  const [loading, setLoading] = useState(false);

  const handleOpen = async () => {
    if (!href) return;

    try {
      setLoading(true);

      if (localUnreadCount > 0) {
        setLocalUnreadCount((prev) => Math.max(prev - 1, 0));
      }

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
      console.error("Open latest notification error:", error);
      router.push(href);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {localUnreadCount > 0 && (
        <span className="inline-flex h-11 items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700">
          {localUnreadCount} Unread
        </span>
      )}

      {href ? (
        <button
          type="button"
          onClick={handleOpen}
          disabled={loading}
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Opening..." : "Open Notification"}
        </button>
      ) : null}

      <Link
        href="/dashboard/organization/invites"
        className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        View Invite History
      </Link>
    </div>
  );
}
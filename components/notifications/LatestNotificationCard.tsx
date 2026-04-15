"use client";

import { useEffect, useMemo, useState } from "react";
import { getPusherClient } from "@/lib/pusher-client";
import LatestNotificationActions from "@/components/notifications/LatestNotificationActions";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  link: string | null;
  type: string;
  createdAt: string | Date;
};

type Props = {
  userId: string;
  notifications: NotificationItem[];
  unreadCount: number;
};

function getNotificationAccent(type: string) {
  switch (type) {
    case "APPLICATION":
      return {
        icon: "📩",
        badge: "bg-purple-100 text-purple-700 border-purple-200",
        card: "border-purple-200 bg-gradient-to-r from-purple-50 via-white to-blue-50",
      };
    case "PROJECT":
      return {
        icon: "📁",
        badge: "bg-blue-100 text-blue-700 border-blue-200",
        card: "border-blue-200 bg-gradient-to-r from-blue-50 via-white to-indigo-50",
      };
    case "REVIEW":
      return {
        icon: "⭐",
        badge: "bg-amber-100 text-amber-700 border-amber-200",
        card: "border-amber-200 bg-gradient-to-r from-amber-50 via-white to-yellow-50",
      };
    case "BADGE":
      return {
        icon: "🏆",
        badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
        card: "border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-teal-50",
      };
    default:
      return {
        icon: "🔔",
        badge: "bg-slate-100 text-slate-700 border-slate-200",
        card: "border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-100",
      };
  }
}

function buildNotificationLink(notification: NotificationItem) {
  if (!notification.link) return null;

  if (notification.title === "Invite accepted") {
    return `${notification.link}?focus=invite-accepted`;
  }

  if (notification.title === "Invite declined") {
    return `${notification.link}?focus=invite-declined`;
  }

  return notification.link;
}

export default function LatestNotificationCard({
  userId,
  notifications: initialNotifications,
  unreadCount: initialUnreadCount,
}: Props) {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

  useEffect(() => {
    setNotifications(initialNotifications);
    setUnreadCount(initialUnreadCount);
  }, [initialNotifications, initialUnreadCount]);

  useEffect(() => {
    if (!userId) return;

    const pusher = getPusherClient();
    const channelName = `private-user-notifications-${userId}`;
    const channel = pusher.subscribe(channelName);

    const refreshNotifications = async () => {
      try {
        const res = await fetch("/api/notifications", { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      } catch (error) {
        console.error("Failed to refresh latest notification card:", error);
      }
    };

    channel.bind("notification:new", refreshNotifications);

    return () => {
      channel.unbind("notification:new", refreshNotifications);
      pusher.unsubscribe(channelName);
    };
  }, [userId]);

  const latestUnreadNotification =
    notifications.find((n) => !n.isRead) ?? null;

  const latestNotification =
    latestUnreadNotification ?? notifications[0] ?? null;

  const accent = useMemo(
    () => (latestNotification ? getNotificationAccent(latestNotification.type) : null),
    [latestNotification]
  );

  const latestNotificationLink = latestNotification
    ? buildNotificationLink(latestNotification)
    : null;

  if (!latestNotification || !accent) {
    return null;
  }

  return (
    <section
      className={`rounded-[26px] border p-5 shadow-sm sm:p-6 ${accent.card}`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
            {accent.icon}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <div
                className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${accent.badge}`}
              >
                Latest notification
              </div>

              {!latestNotification.isRead && (
                <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-700">
                  Unread
                </span>
              )}
            </div>

            <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900">
              {latestNotification.title}
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              {latestNotification.message}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              {new Date(latestNotification.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <LatestNotificationActions
          notificationId={latestNotification.id}
          href={latestNotificationLink}
          unreadCount={unreadCount}
        />
      </div>
    </section>
  );
}
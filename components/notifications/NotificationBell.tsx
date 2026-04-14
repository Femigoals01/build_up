

// "use client";

// import { useEffect, useRef, useState } from "react";
// import Link from "next/link";
// import { getPusherClient } from "@/lib/pusher-client";

// type NotificationItem = {
//   id: string;
//   title: string;
//   message: string;
//   isRead: boolean;
//   link: string | null;
//   type: string;
//   createdAt: string;
// };

// type Props = {
//   userId: string;
//   notifications?: NotificationItem[];
//   unreadCount?: number;
// };

// export default function NotificationBell({
//   userId,
//   notifications: initialNotifications = [],
//   unreadCount: initialUnreadCount = 0,
// }: Props) {
//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] =
//     useState<NotificationItem[]>(initialNotifications);
//   const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

//   const containerRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const loadNotifications = async () => {
//       try {
//         const res = await fetch("/api/notifications", { cache: "no-store" });
//         if (!res.ok) return;

//         const data = await res.json();
//         setNotifications(data.notifications || []);
//         setUnreadCount(data.unreadCount || 0);
//       } catch (error) {
//         console.error("Failed to load notifications:", error);
//       }
//     };

//     loadNotifications();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (!containerRef.current) return;
//       if (!containerRef.current.contains(event.target as Node)) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     if (!userId) return;

//     const pusher = getPusherClient();
//     const channelName = `private-user-notifications-${userId}`;
//     const channel = pusher.subscribe(channelName);

//     const refreshNotifications = async () => {
//       try {
//         const res = await fetch("/api/notifications", { cache: "no-store" });
//         if (!res.ok) return;

//         const data = await res.json();
//         setNotifications(data.notifications || []);
//         setUnreadCount(data.unreadCount || 0);
//       } catch (error) {
//         console.error("Failed to refresh notifications:", error);
//       }
//     };

//     channel.bind("notification:new", refreshNotifications);

//     return () => {
//       channel.unbind("notification:new", refreshNotifications);
//       pusher.unsubscribe(channelName);
//     };
//   }, [userId]);

//   const handleNotificationClick = async (notificationId: string) => {
//     try {
//       await fetch("/api/notifications/mark-read", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ notificationId }),
//       });

//       setNotifications((prev) =>
//         prev.map((item) =>
//           item.id === notificationId ? { ...item, isRead: true } : item
//         )
//       );
//       setUnreadCount((prev) => Math.max(prev - 1, 0));
//     } catch (error) {
//       console.error("Failed to mark notification as read:", error);
//     }
//   };

//   return (
//     <div className="relative" ref={containerRef}>
//       <button
//         type="button"
//         onClick={() => setOpen((prev) => !prev)}
//         className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-xl shadow-sm transition hover:bg-slate-50"
//         aria-label="Open notifications"
//       >
//         🔔
//         {unreadCount > 0 && (
//           <span className="absolute -right-1 -top-1 inline-flex min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold text-white">
//             {unreadCount > 99 ? "99+" : unreadCount}
//           </span>
//         )}
//       </button>

//       {open && (
//         <div className="absolute right-0 top-14 z-50 w-[360px] max-w-[90vw] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
//           <div className="border-b border-slate-200 px-4 py-4">
//             <div className="flex items-center justify-between gap-3">
//               <div>
//                 <h3 className="text-sm font-bold text-slate-900">
//                   Notifications
//                 </h3>
//                 <p className="text-xs text-slate-500">
//                   {unreadCount} unread
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="max-h-[420px] overflow-y-auto">
//             {notifications.length === 0 ? (
//               <div className="px-4 py-10 text-center text-sm text-slate-500">
//                 No notifications yet.
//               </div>
//             ) : (
//               <div className="divide-y divide-slate-100">
//                 {notifications.map((notification) => {
//                   const content = (
//                     <div
//                       className={`px-4 py-4 transition hover:bg-slate-50 ${
//                         !notification.isRead ? "bg-blue-50/60" : "bg-white"
//                       }`}
//                     >
//                       <div className="flex items-start gap-3">
//                         <div className="mt-1 text-base">
//                           {notification.type === "APPLICATION"
//                             ? "📩"
//                             : notification.type === "PROJECT"
//                             ? "📁"
//                             : notification.type === "REVIEW"
//                             ? "⭐"
//                             : notification.type === "BADGE"
//                             ? "🏆"
//                             : "🔔"}
//                         </div>

//                         <div className="min-w-0 flex-1">
//                           <p className="text-sm font-semibold text-slate-900">
//                             {notification.title}
//                           </p>
//                           <p className="mt-1 text-sm leading-6 text-slate-600">
//                             {notification.message}
//                           </p>
//                           <p className="mt-2 text-xs text-slate-400">
//                             {new Date(notification.createdAt).toLocaleString()}
//                           </p>
//                         </div>

//                         {!notification.isRead && (
//                           <span className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-600" />
//                         )}
//                       </div>
//                     </div>
//                   );

//                   if (notification.link) {
//                     return (
//                       <Link
//                         key={notification.id}
//                         href={notification.link}
//                         onClick={() => {
//                           void handleNotificationClick(notification.id);
//                           setOpen(false);
//                         }}
//                       >
//                         {content}
//                       </Link>
//                     );
//                   }

//                   return (
//                     <button
//                       key={notification.id}
//                       type="button"
//                       className="block w-full text-left"
//                       onClick={() => void handleNotificationClick(notification.id)}
//                     >
//                       {content}
//                     </button>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getPusherClient } from "@/lib/pusher-client";

export type NotificationBellItem = {
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
  notifications?: NotificationBellItem[];
  unreadCount?: number;
};

export default function NotificationBell({
  userId,
  notifications: initialNotifications = [],
  unreadCount: initialUnreadCount = 0,
}: Props) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<NotificationBellItem[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await fetch("/api/notifications", { cache: "no-store" });
        if (!res.ok) return;

        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    };

    loadNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        console.error("Failed to refresh notifications:", error);
      }
    };

    channel.bind("notification:new", refreshNotifications);

    return () => {
      channel.unbind("notification:new", refreshNotifications);
      pusher.unsubscribe(channelName);
    };
  }, [userId]);

  const handleNotificationClick = async (notificationId: string) => {
    try {
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }),
      });

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notificationId ? { ...item, isRead: true } : item
        )
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-xl shadow-sm transition hover:bg-slate-50"
        aria-label="Open notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex min-h-[20px] min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-50 w-[360px] max-w-[90vw] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="border-b border-slate-200 px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Notifications
                </h3>
                <p className="text-xs text-slate-500">
                  {unreadCount} unread
                </p>
              </div>
            </div>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-slate-500">
                No notifications yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => {
                  const content = (
                    <div
                      className={`px-4 py-4 transition hover:bg-slate-50 ${
                        !notification.isRead ? "bg-blue-50/60" : "bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-base">
                          {notification.type === "APPLICATION"
                            ? "📩"
                            : notification.type === "PROJECT"
                            ? "📁"
                            : notification.type === "REVIEW"
                            ? "⭐"
                            : notification.type === "BADGE"
                            ? "🏆"
                            : "🔔"}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {notification.message}
                          </p>
                          <p className="mt-2 text-xs text-slate-400">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>

                        {!notification.isRead && (
                          <span className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-600" />
                        )}
                      </div>
                    </div>
                  );

                  if (notification.link) {
                    return (
                      <Link
                        key={notification.id}
                        href={notification.link}
                        onClick={() => {
                          void handleNotificationClick(notification.id);
                          setOpen(false);
                        }}
                      >
                        {content}
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={notification.id}
                      type="button"
                      className="block w-full text-left"
                      onClick={() => void handleNotificationClick(notification.id)}
                    >
                      {content}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
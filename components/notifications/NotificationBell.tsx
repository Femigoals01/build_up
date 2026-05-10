



// "use client";

// import { useEffect, useRef, useState } from "react";
// import { getPusherClient } from "@/lib/pusher-client";

// export type NotificationBellItem = {
//   id: string;
//   title?: string | null;
//   message?: string | null;
//   isRead: boolean;
//   link?: string | null;
//   type?: string | null;
//   createdAt: string | Date;
// };

// type NotificationBellProps = {
//   userId: string;
//   notifications: NotificationBellItem[];
//   unreadCount: number;
// };

// export default function NotificationBell({
//   userId,
//   notifications: initialNotifications = [],
//   unreadCount: initialUnreadCount = 0,
// }: NotificationBellProps) {
//   const [open, setOpen] = useState(false);

//   const [notifications, setNotifications] =
//     useState<NotificationBellItem[]>(initialNotifications);

//   const [unreadCount, setUnreadCount] =
//     useState(initialUnreadCount);

//   const containerRef = useRef<HTMLDivElement | null>(null);

//   async function refreshNotifications() {
//     try {
//       const res = await fetch("/api/notifications", {
//         cache: "no-store",
//       });

//       if (!res.ok) return;

//       const data = await res.json();

//       setNotifications(data.notifications || []);
//       setUnreadCount(data.unreadCount || 0);
//     } catch (error) {
//       console.error("Failed to load notifications:", error);
//     }
//   }

//   useEffect(() => {
//     refreshNotifications();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (!containerRef.current) return;

//       if (!containerRef.current.contains(event.target as Node)) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener(
//         "mousedown",
//         handleClickOutside
//       );
//     };
//   }, []);

//   useEffect(() => {
//     if (!userId) return;

//     const pusher = getPusherClient();

//     const channelName = `private-user-notifications-${userId}`;

//     const channel = pusher.subscribe(channelName);

//     channel.bind("notification:new", refreshNotifications);

//     return () => {
//       channel.unbind("notification:new", refreshNotifications);
//       pusher.unsubscribe(channelName);
//     };
//   }, [userId]);

//   async function markAsRead(notificationId: string) {
//     try {
//       await fetch("/api/notifications/mark-read", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           notificationId,
//         }),
//       });

//       setNotifications((prev) =>
//         prev.map((item) =>
//           item.id === notificationId
//             ? { ...item, isRead: true }
//             : item
//         )
//       );

//       setUnreadCount((prev) => Math.max(prev - 1, 0));
//     } catch (error) {
//       console.error(
//         "Failed to mark notification as read:",
//         error
//       );
//     }
//   }

//   function normalizeNotificationLink(link: string | null) {
//     if (!link) return null;

//     const submitMatch = link.match(
//       /^\/dashboard\/projects\/([^/]+)\/submit/
//     );

//     if (submitMatch?.[1]) {
//       return `/dashboard/volunteer/projects/${submitMatch[1]}`;
//     }

//     const projectFocusMatch = link.match(
//       /^\/dashboard\/projects\/([^/?]+)/
//     );

//     if (
//       projectFocusMatch?.[1] &&
//       link.includes("focus=invite")
//     ) {
//       return `/dashboard/organization/projects/${projectFocusMatch[1]}`;
//     }

//     return link;
//   }

//   const handleNotificationOpen = async (
//     notification: NotificationBellItem
//   ) => {
//     await markAsRead(notification.id);

//     setOpen(false);

//     const targetLink = normalizeNotificationLink(
//       notification.link ?? null
//     );

//     console.log("Notification clicked:", {
//       title: notification.title,
//       originalLink: notification.link,
//       targetLink,
//     });

//     if (targetLink) {
//       window.location.assign(targetLink);
//     }
//   };

//   function getNotificationIcon(type?: string | null) {
//     switch (type) {
//       case "APPLICATION":
//         return "📩";

//       case "PROJECT":
//         return "📁";

//       case "REVIEW":
//         return "⭐";

//       case "BADGE":
//         return "🏆";

//       default:
//         return "🔔";
//     }
//   }

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
//         <div className="absolute right-0 top-14 z-50 w-[380px] max-w-[90vw] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
//           <div className="border-b border-slate-200 px-4 py-4">
//             <h3 className="text-sm font-bold text-slate-900">
//               Notifications
//             </h3>

//             <p className="text-xs text-slate-500">
//               {unreadCount} unread
//             </p>
//           </div>

//           <div className="max-h-[440px] overflow-y-auto">
//             {notifications.length === 0 ? (
//               <div className="px-4 py-10 text-center text-sm text-slate-500">
//                 No notifications yet.
//               </div>
//             ) : (
//               <div className="divide-y divide-slate-100">
//                 {notifications.map((notification) => (
//                   <button
//                     key={notification.id}
//                     type="button"
//                     onClick={() =>
//                       void handleNotificationOpen(notification)
//                     }
//                     className="block w-full text-left"
//                   >
//                     <div
//                       className={`px-4 py-4 transition hover:bg-slate-50 ${
//                         !notification.isRead
//                           ? "bg-blue-50/70"
//                           : "bg-white"
//                       }`}
//                     >
//                       <div className="flex items-start gap-3">
//                         <div className="mt-1 text-base">
//                           {getNotificationIcon(
//                             notification.type
//                           )}
//                         </div>

//                         <div className="min-w-0 flex-1">
//                           <div className="flex items-start justify-between gap-3">
//                             <p className="text-sm font-semibold text-slate-900">
//                               {notification.title || "Notification"}
//                             </p>

//                             {!notification.isRead && (
//                               <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
//                             )}
//                           </div>

//                           <p className="mt-1 text-sm leading-6 text-slate-600">
//                             {notification.message ||
//                               "You have a new notification."}
//                           </p>

//                           <div className="mt-2 flex items-center justify-between gap-3">
//                             <p className="text-xs text-slate-400">
//                               {new Date(
//                                 notification.createdAt
//                               ).toLocaleString()}
//                             </p>

//                             {notification.link && (
//                               <span className="text-xs font-semibold text-blue-600">
//                                 Open →
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </button>
//                 ))}
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
import { getPusherClient } from "@/lib/pusher-client";

export type NotificationBellItem = {
  id: string;
  title?: string | null;
  message?: string | null;
  isRead: boolean;
  link?: string | null;
  type?: string | null;
  createdAt: string | Date;
};

type NotificationBellProps = {
  userId: string;
  notifications: NotificationBellItem[];
  unreadCount: number;
};

export default function NotificationBell({
  userId,
  notifications: initialNotifications = [],
  unreadCount: initialUnreadCount = 0,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);

  const [notifications, setNotifications] =
    useState<NotificationBellItem[]>(initialNotifications);

  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);

  const containerRef = useRef<HTMLDivElement | null>(null);

  async function refreshNotifications() {
    try {
      const res = await fetch("/api/notifications", {
        cache: "no-store",
      });

      if (!res.ok) return;

      const data = await res.json();

      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  }

  useEffect(() => {
    refreshNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;

      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!userId) return;

    const pusher = getPusherClient();
    const channelName = `private-user-notifications-${userId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("notification:new", refreshNotifications);

    return () => {
      channel.unbind("notification:new", refreshNotifications);
      pusher.unsubscribe(channelName);
    };
  }, [userId]);

  async function markAsRead(notificationId: string) {
    try {
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId,
        }),
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
  }

  function normalizeNotificationLink(link: string | null) {
    if (!link) return null;

    const submitMatch = link.match(/^\/dashboard\/projects\/([^/]+)\/submit/);

    if (submitMatch?.[1]) {
      return `/dashboard/volunteer/projects/${submitMatch[1]}`;
    }

    const projectFocusMatch = link.match(/^\/dashboard\/projects\/([^/?]+)/);

    if (projectFocusMatch?.[1] && link.includes("focus=invite")) {
      return `/dashboard/organization/projects/${projectFocusMatch[1]}`;
    }

    return link;
  }

  const handleNotificationOpen = async (
    notification: NotificationBellItem
  ) => {
    await markAsRead(notification.id);

    setOpen(false);

    const targetLink = normalizeNotificationLink(notification.link ?? null);

    if (targetLink) {
      window.location.assign(targetLink);
    }
  };

  function getNotificationIcon(type?: string | null) {
    switch (type) {
      case "APPLICATION":
        return "📩";
      case "PROJECT":
        return "📁";
      case "REVIEW":
        return "⭐";
      case "BADGE":
        return "🏆";
      default:
        return "🔔";
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-xl text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
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
        <div className="absolute right-0 top-14 z-50 w-[380px] max-w-[90vw] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="border-b border-slate-200 px-4 py-4">
            <h3 className="text-sm font-bold text-slate-900">
              Notifications
            </h3>

            <p className="text-xs text-slate-500">{unreadCount} unread</p>
          </div>

          <div className="max-h-[440px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-slate-500">
                No notifications yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => void handleNotificationOpen(notification)}
                    className="block w-full text-left"
                  >
                    <div
                      className={`px-4 py-4 transition hover:bg-slate-50 ${
                        !notification.isRead ? "bg-blue-50/70" : "bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-base">
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-900">
                              {notification.title || "Notification"}
                            </p>

                            {!notification.isRead && (
                              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
                            )}
                          </div>

                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {notification.message ||
                              "You have a new notification."}
                          </p>

                          <div className="mt-2 flex items-center justify-between gap-3">
                            <p className="text-xs text-slate-400">
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </p>

                            {notification.link && (
                              <span className="text-xs font-semibold text-blue-600">
                                Open →
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
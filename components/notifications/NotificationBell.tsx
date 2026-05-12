






// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
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

// type FilterType = "ALL" | "UNREAD" | "PAYMENT" | "PROJECT" | "SUBMISSION";

// function getNotificationIcon(type?: string | null) {
//   switch (type) {
//     case "APPLICATION":
//       return "📩";
//     case "PROJECT":
//       return "🚀";
//     case "REVIEW":
//       return "⭐";
//     case "BADGE":
//       return "🏆";
//     case "PAYMENT":
//       return "💳";
//     case "SUBMISSION":
//       return "📤";
//     case "MESSAGE":
//       return "💬";
//     case "SYSTEM":
//       return "🔔";
//     default:
//       return "🔔";
//   }
// }

// function getNotificationAccent(type?: string | null, isRead?: boolean) {
//   if (isRead) return "bg-white hover:bg-slate-50";

//   switch (type) {
//     case "PAYMENT":
//       return "bg-emerald-50/80 hover:bg-emerald-50";
//     case "SUBMISSION":
//       return "bg-amber-50/80 hover:bg-amber-50";
//     case "PROJECT":
//       return "bg-blue-50/80 hover:bg-blue-50";
//     case "APPLICATION":
//       return "bg-purple-50/80 hover:bg-purple-50";
//     case "REVIEW":
//       return "bg-yellow-50/80 hover:bg-yellow-50";
//     case "BADGE":
//       return "bg-teal-50/80 hover:bg-teal-50";
//     default:
//       return "bg-blue-50/70 hover:bg-blue-50";
//   }
// }

// function normalizeNotificationLink(link: string | null) {
//   if (!link) return null;

//   const submitMatch = link.match(/^\/dashboard\/projects\/([^/]+)\/submit/);

//   if (submitMatch?.[1]) {
//     return `/dashboard/volunteer/projects/${submitMatch[1]}`;
//   }

//   const projectFocusMatch = link.match(/^\/dashboard\/projects\/([^/?]+)/);

//   if (projectFocusMatch?.[1] && link.includes("focus=invite")) {
//     return `/dashboard/organization/projects/${projectFocusMatch[1]}`;
//   }

//   return link;
// }

// export default function NotificationBell({
//   userId,
//   notifications: initialNotifications = [],
//   unreadCount: initialUnreadCount = 0,
// }: NotificationBellProps) {
//   const [open, setOpen] = useState(false);
//   const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
//   const [notifications, setNotifications] =
//     useState<NotificationBellItem[]>(initialNotifications);
//   const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
//   const [toast, setToast] = useState<NotificationBellItem | null>(null);
//   const [markingAll, setMarkingAll] = useState(false);

//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   async function refreshNotifications(showToast = false) {
//     try {
//       const res = await fetch("/api/notifications", {
//         cache: "no-store",
//       });

//       if (!res.ok) return;

//       const data = await res.json();
//       const nextNotifications = data.notifications || [];

//       setNotifications((prev) => {
//         if (showToast && nextNotifications.length > 0) {
//           const newest = nextNotifications[0];
//           const alreadyHadNewest = prev.some(
//             (item) => item.id === newest.id
//           );

//           if (!alreadyHadNewest) {
//             setToast(newest);

//             if (toastTimerRef.current) {
//               clearTimeout(toastTimerRef.current);
//             }

//             toastTimerRef.current = setTimeout(() => {
//               setToast(null);
//             }, 4500);
//           }
//         }

//         return nextNotifications;
//       });

//       setUnreadCount(data.unreadCount || 0);
//     } catch (error) {
//       console.error("Failed to load notifications:", error);
//     }
//   }

//   useEffect(() => {
//     refreshNotifications();
//   }, []);

//   useEffect(() => {
//     setNotifications(initialNotifications);
//     setUnreadCount(initialUnreadCount);
//   }, [initialNotifications, initialUnreadCount]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (!containerRef.current) return;

//       if (!containerRef.current.contains(event.target as Node)) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   useEffect(() => {
//     if (!userId) return;

//     const pusher = getPusherClient();
//     const channelName = `private-user-notifications-${userId}`;
//     const channel = pusher.subscribe(channelName);

//     const handleNewNotification = () => {
//       refreshNotifications(true);
//     };

//     channel.bind("notification:new", handleNewNotification);

//     return () => {
//       channel.unbind("notification:new", handleNewNotification);
//       pusher.unsubscribe(channelName);

//       if (toastTimerRef.current) {
//         clearTimeout(toastTimerRef.current);
//       }
//     };
//   }, [userId]);

//   const filteredNotifications = useMemo(() => {
//     if (activeFilter === "ALL") return notifications;

//     if (activeFilter === "UNREAD") {
//       return notifications.filter((item) => !item.isRead);
//     }

//     return notifications.filter((item) => item.type === activeFilter);
//   }, [notifications, activeFilter]);

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
//           item.id === notificationId ? { ...item, isRead: true } : item
//         )
//       );

//       setUnreadCount((prev) => Math.max(prev - 1, 0));
//     } catch (error) {
//       console.error("Failed to mark notification as read:", error);
//     }
//   }

//   async function markAllAsRead() {
//     try {
//       setMarkingAll(true);

//       const res = await fetch("/api/notifications/mark-all-read", {
//         method: "POST",
//       });

//       if (!res.ok) return;

//       setNotifications((prev) =>
//         prev.map((item) => ({
//           ...item,
//           isRead: true,
//         }))
//       );

//       setUnreadCount(0);
//     } catch (error) {
//       console.error("Failed to mark all notifications as read:", error);
//     } finally {
//       setMarkingAll(false);
//     }
//   }

//   const handleNotificationOpen = async (
//     notification: NotificationBellItem
//   ) => {
//     await markAsRead(notification.id);

//     setOpen(false);

//     const targetLink = normalizeNotificationLink(notification.link ?? null);

//     if (targetLink) {
//       window.location.assign(targetLink);
//     }
//   };

//   const filters: { key: FilterType; label: string }[] = [
//     { key: "ALL", label: "All" },
//     { key: "UNREAD", label: "Unread" },
//     { key: "PAYMENT", label: "Payments" },
//     { key: "PROJECT", label: "Projects" },
//     { key: "SUBMISSION", label: "Submissions" },
//   ];

//   return (
//     <div className="relative" ref={containerRef}>
//       {toast && (
//         <button
//           type="button"
//           onClick={() => void handleNotificationOpen(toast)}
//           className="fixed right-4 top-20 z-[80] w-[340px] max-w-[calc(100vw-2rem)] rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-2xl"
//         >
//           <div className="flex items-start gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-lg">
//               {getNotificationIcon(toast.type)}
//             </div>

//             <div className="min-w-0 flex-1">
//               <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
//                 New notification
//               </p>
//               <p className="mt-1 line-clamp-1 text-sm font-bold text-slate-900">
//                 {toast.title || "Notification"}
//               </p>
//               <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
//                 {toast.message || "You have a new notification."}
//               </p>
//             </div>
//           </div>
//         </button>
//       )}

//       <button
//         type="button"
//         onClick={() => setOpen((prev) => !prev)}
//         className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-xl text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
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
//         <div className="absolute right-0 top-14 z-50 w-[420px] max-w-[92vw] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
//           <div className="border-b border-slate-200 px-4 py-4">
//             <div className="flex items-start justify-between gap-3">
//               <div>
//                 <h3 className="text-sm font-bold text-slate-900">
//                   Notifications
//                 </h3>

//                 <p className="text-xs text-slate-500">
//                   {unreadCount} unread
//                 </p>
//               </div>

//               {unreadCount > 0 && (
//                 <button
//                   type="button"
//                   onClick={markAllAsRead}
//                   disabled={markingAll}
//                   className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
//                 >
//                   {markingAll ? "Marking..." : "Mark all read"}
//                 </button>
//               )}
//             </div>

//             <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
//               {filters.map((filter) => (
//                 <button
//                   key={filter.key}
//                   type="button"
//                   onClick={() => setActiveFilter(filter.key)}
//                   className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${
//                     activeFilter === filter.key
//                       ? "bg-blue-600 text-white"
//                       : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
//                   }`}
//                 >
//                   {filter.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="max-h-[460px] overflow-y-auto">
//             {filteredNotifications.length === 0 ? (
//               <div className="px-4 py-10 text-center text-sm text-slate-500">
//                 No notifications in this category.
//               </div>
//             ) : (
//               <div className="divide-y divide-slate-100">
//                 {filteredNotifications.map((notification) => (
//                   <button
//                     key={notification.id}
//                     type="button"
//                     onClick={() => void handleNotificationOpen(notification)}
//                     className="block w-full text-left"
//                   >
//                     <div
//                       className={`px-4 py-4 transition ${getNotificationAccent(
//                         notification.type,
//                         notification.isRead
//                       )}`}
//                     >
//                       <div className="flex items-start gap-3">
//                         <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-base shadow-sm">
//                           {getNotificationIcon(notification.type)}
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

import { useEffect, useMemo, useRef, useState } from "react";
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

type FilterType =
  | "ALL"
  | "UNREAD"
  | "PAYMENT"
  | "PROJECT"
  | "SUBMISSION"
  | "DEADLINE";

function getNotificationIcon(type?: string | null) {
  switch (type) {
    case "APPLICATION":
      return "📩";
    case "PROJECT":
      return "🚀";
    case "REVIEW":
      return "⭐";
    case "BADGE":
      return "🏆";
    case "PAYMENT":
      return "💳";
    case "SUBMISSION":
      return "📤";
    case "MESSAGE":
      return "💬";
    case "DEADLINE":
      return "⏰";
    case "SYSTEM":
      return "🔔";
    default:
      return "🔔";
  }
}

function getNotificationAccent(type?: string | null, isRead?: boolean) {
  if (isRead) return "bg-white hover:bg-slate-50";

  switch (type) {
    case "DEADLINE":
      return "bg-red-50/90 hover:bg-red-50";
    case "PAYMENT":
      return "bg-emerald-50/80 hover:bg-emerald-50";
    case "SUBMISSION":
      return "bg-amber-50/80 hover:bg-amber-50";
    case "PROJECT":
      return "bg-blue-50/80 hover:bg-blue-50";
    case "APPLICATION":
      return "bg-purple-50/80 hover:bg-purple-50";
    case "REVIEW":
      return "bg-yellow-50/80 hover:bg-yellow-50";
    case "BADGE":
      return "bg-teal-50/80 hover:bg-teal-50";
    default:
      return "bg-blue-50/70 hover:bg-blue-50";
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

export default function NotificationBell({
  userId,
  notifications: initialNotifications = [],
  unreadCount: initialUnreadCount = 0,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [notifications, setNotifications] =
    useState<NotificationBellItem[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [toast, setToast] = useState<NotificationBellItem | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function refreshNotifications(showToast = false) {
    try {
      const res = await fetch("/api/notifications", {
        cache: "no-store",
      });

      if (!res.ok) return;

      const data = await res.json();
      const nextNotifications = data.notifications || [];

      setNotifications((prev) => {
        if (showToast && nextNotifications.length > 0) {
          const newest = nextNotifications[0];
          const alreadyHadNewest = prev.some((item) => item.id === newest.id);

          if (!alreadyHadNewest) {
            setToast(newest);

            if (toastTimerRef.current) {
              clearTimeout(toastTimerRef.current);
            }

            toastTimerRef.current = setTimeout(() => {
              setToast(null);
            }, 4500);
          }
        }

        return nextNotifications;
      });

      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  }

  useEffect(() => {
    refreshNotifications();
  }, []);

  useEffect(() => {
    setNotifications(initialNotifications);
    setUnreadCount(initialUnreadCount);
  }, [initialNotifications, initialUnreadCount]);

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

    const handleNewNotification = () => {
      refreshNotifications(true);
    };

    channel.bind("notification:new", handleNewNotification);

    return () => {
      channel.unbind("notification:new", handleNewNotification);
      pusher.unsubscribe(channelName);

      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, [userId]);

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "ALL") return notifications;

    if (activeFilter === "UNREAD") {
      return notifications.filter((item) => !item.isRead);
    }

    return notifications.filter((item) => item.type === activeFilter);
  }, [notifications, activeFilter]);

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

  async function markAllAsRead() {
    try {
      setMarkingAll(true);

      const res = await fetch("/api/notifications/mark-all-read", {
        method: "POST",
      });

      if (!res.ok) return;

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    } finally {
      setMarkingAll(false);
    }
  }

  const handleNotificationOpen = async (notification: NotificationBellItem) => {
    await markAsRead(notification.id);

    setOpen(false);

    const targetLink = normalizeNotificationLink(notification.link ?? null);

    if (targetLink) {
      window.location.assign(targetLink);
    }
  };

  const filters: { key: FilterType; label: string }[] = [
    { key: "ALL", label: "All" },
    { key: "UNREAD", label: "Unread" },
    { key: "PAYMENT", label: "Payments" },
    { key: "PROJECT", label: "Projects" },
    { key: "SUBMISSION", label: "Submissions" },
    { key: "DEADLINE", label: "Deadlines" },
  ];

  return (
    <div className="relative" ref={containerRef}>
      {toast && (
        <button
          type="button"
          onClick={() => void handleNotificationOpen(toast)}
          className={`fixed right-4 top-20 z-[80] w-[340px] max-w-[calc(100vw-2rem)] rounded-3xl border p-4 text-left shadow-2xl ${
            toast.type === "DEADLINE"
              ? "border-red-200 bg-red-50"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-2xl text-lg ${
                toast.type === "DEADLINE" ? "bg-white" : "bg-blue-50"
              }`}
            >
              {getNotificationIcon(toast.type)}
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`text-xs font-bold uppercase tracking-[0.16em] ${
                  toast.type === "DEADLINE" ? "text-red-600" : "text-blue-600"
                }`}
              >
                New notification
              </p>
              <p className="mt-1 line-clamp-1 text-sm font-bold text-slate-900">
                {toast.title || "Notification"}
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                {toast.message || "You have a new notification."}
              </p>
            </div>
          </div>
        </button>
      )}

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
        <div className="absolute right-0 top-14 z-50 w-[420px] max-w-[92vw] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="border-b border-slate-200 px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Notifications
                </h3>

                <p className="text-xs text-slate-500">{unreadCount} unread</p>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  disabled={markingAll}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
                >
                  {markingAll ? "Marking..." : "Mark all read"}
                </button>
              )}
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveFilter(filter.key)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${
                    activeFilter === filter.key
                      ? filter.key === "DEADLINE"
                        ? "bg-red-600 text-white"
                        : "bg-blue-600 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[460px] overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-slate-500">
                No notifications in this category.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredNotifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => void handleNotificationOpen(notification)}
                    className="block w-full text-left"
                  >
                    <div
                      className={`px-4 py-4 transition ${getNotificationAccent(
                        notification.type,
                        notification.isRead
                      )}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-base shadow-sm">
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-900">
                              {notification.title || "Notification"}
                            </p>

                            {!notification.isRead && (
                              <span
                                className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                                  notification.type === "DEADLINE"
                                    ? "bg-red-600"
                                    : "bg-blue-600"
                                }`}
                              />
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
                              <span
                                className={`text-xs font-semibold ${
                                  notification.type === "DEADLINE"
                                    ? "text-red-600"
                                    : "text-blue-600"
                                }`}
                              >
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
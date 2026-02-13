// "use client";

// import { useState } from "react";

// type Notification = {
//   id: string;
//   title: string;
//   message: string;
//   link?: string | null;
//   isRead: boolean;
//   createdAt: Date;
// };

// export default function NotificationBell({
//   notifications,
//   unreadCount,
// }: {
//   notifications: Notification[];
//   unreadCount: number;
// }) {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="relative">
//       {/* 🔔 Bell */}
//       <button
//         onClick={() => setOpen(!open)}
//         className="relative p-2 rounded-full hover:bg-white/20 transition"
//       >
//         🔔
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {/* 📦 Dropdown */}
//       {open && (
//         <div className="absolute right-0 mt-3 w-80 bg-white text-black rounded-xl shadow-xl border z-50">
//           <div className="px-4 py-3 border-b font-semibold">
//             Notifications
//           </div>

//           {notifications.length === 0 ? (
//             <p className="p-4 text-sm text-gray-500">
//               No notifications yet.
//             </p>
//           ) : (
//             <ul className="max-h-96 overflow-y-auto">
//               {notifications.map((n) => (
//                 <li
//                   key={n.id}
//                   className={`px-4 py-3 text-sm border-b last:border-b-0 ${
//                     n.isRead ? "bg-white" : "bg-blue-50"
//                   }`}
//                 >
//                   <p className="font-medium">{n.title}</p>
//                   <p className="text-gray-600">{n.message}</p>

//                   {n.link && (
//                     <a
//                       href={n.link}
//                       className="text-blue-600 text-xs mt-1 inline-block hover:underline"
//                     >
//                       View →
//                     </a>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }


// "use client";

// import { useState } from "react";

// type Notification = {
//   id: string;
//   title: string;
//   message: string;
//   link?: string | null;
//   isRead: boolean;
//   createdAt: Date;
// };

// export default function NotificationBell({
//   notifications,
//   unreadCount,
// }: {
//   notifications: Notification[];
//   unreadCount: number;
// }) {
//   const [open, setOpen] = useState(false);

//   async function markAsRead(notificationId?: string) {
//     await fetch("/api/notifications/read", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ notificationId }),
//     });
//   }

//   async function handleNotificationClick(n: Notification) {
//     if (!n.isRead) {
//       await markAsRead(n.id);
//     }

//     if (n.link) {
//       window.location.href = n.link;
//     }
//   }

//   async function markAllAsRead() {
//     await markAsRead();
//     window.location.reload();
//   }

//   return (
//     <div className="relative">
//       {/* 🔔 Bell */}
//       <button
//         onClick={() => setOpen(!open)}
//         className="relative p-2 rounded-full hover:bg-white/20 transition"
//       >
//         🔔
//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {/* 📦 Dropdown */}
//       {open && (
//         <div className="absolute right-0 mt-3 w-80 bg-white text-black rounded-xl shadow-xl border z-50">
//           <div className="flex items-center justify-between px-4 py-3 border-b font-semibold">
//             <span>Notifications</span>

//             {unreadCount > 0 && (
//               <button
//                 onClick={markAllAsRead}
//                 className="text-xs text-blue-600 hover:underline"
//               >
//                 Mark all as read
//               </button>
//             )}
//           </div>

//           {notifications.length === 0 ? (
//             <p className="p-4 text-sm text-gray-500">
//               No notifications yet.
//             </p>
//           ) : (
//             <ul className="max-h-96 overflow-y-auto">
//               {notifications.map((n) => (
//                 <li
//                   key={n.id}
//                   onClick={() => handleNotificationClick(n)}
//                   className={`px-4 py-3 text-sm border-b last:border-b-0 cursor-pointer transition ${
//                     n.isRead
//                       ? "bg-white hover:bg-gray-50"
//                       : "bg-blue-50 hover:bg-blue-100"
//                   }`}
//                 >
//                   <p className="font-medium">{n.title}</p>
//                   <p className="text-gray-600">{n.message}</p>

//                   {n.link && (
//                     <span className="text-blue-600 text-xs mt-1 inline-block">
//                       View →
//                     </span>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import { useState } from "react";

type Notification = {
  id: string;
  title: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: Date;
};

export default function NotificationBell({
  notifications,
  unreadCount,
}: {
  notifications: Notification[];
  unreadCount: number;
}) {
  const [open, setOpen] = useState(false);

  const markAsRead = async (id: string) => {
    await fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id }),
    });
  };

  return (
    <div className="relative">
      {/* 🔔 Bell */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-white/20 transition"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 📦 Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white text-black rounded-xl shadow-xl border z-50">
          <div className="px-4 py-3 border-b font-semibold">
            Notifications
          </div>

          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">
              No notifications yet.
            </p>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() => {
                    if (!n.isRead) markAsRead(n.id);
                  }}
                  className={`px-4 py-3 text-sm border-b last:border-b-0 cursor-pointer ${
                    n.isRead ? "bg-white" : "bg-blue-50"
                  }`}
                >
                  <p className="font-medium">{n.title}</p>
                  <p className="text-gray-600">{n.message}</p>

                  {n.link && (
                    <a
                      href={n.link}
                      className="text-blue-600 text-xs mt-1 inline-block hover:underline"
                    >
                      View →
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

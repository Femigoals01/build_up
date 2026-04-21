


// import Link from "next/link";

// export default function SidebarContent({
//   collapsed,
//   user,
// }: {
//   collapsed: boolean;
//   user: { name?: string; role?: string };
// }) {
//   return (
//     <>
//       {/* TOP */}
//       <div className={`${collapsed ? "px-3 py-6" : "px-6 py-8"}`}>
//         <div className={`mb-10 flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
//           <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 font-bold text-white shadow-sm">
//             B
//           </div>

//           {!collapsed && (
//             <div className="min-w-0">
//               <h2 className="truncate text-2xl font-bold tracking-tight text-blue-400">
//                 BuildUp
//               </h2>
//               <p className="truncate text-[11px] uppercase tracking-[0.16em] text-slate-500">
//                 Volunteer Space
//               </p>
//             </div>
//           )}
//         </div>

//         <nav className="space-y-2">
//           <Item
//             icon="📊"
//             label="Dashboard"
//             href="/dashboard/volunteer"
//             collapsed={collapsed}
//             active
//           />
//           <Item
//             icon="💼"
//             label="Projects"
//             href="/projects"
//             collapsed={collapsed}
//           />
//           <Item
//             icon="🌍"
//             label="Portfolio"
//             href="/portfolio"
//             collapsed={collapsed}
//           />
//           <Item
//             icon="💬"
//             label="Messages"
//             href="/dashboard/messages"
//             collapsed={collapsed}
//           />
//           <Item
//             icon="⚙️"
//             label="Settings"
//             href="/dashboard/settings"
//             collapsed={collapsed}
//           />
//         </nav>
//       </div>

//       {/* FOOTER */}
//       <div className="border-t border-slate-800 px-3 py-6">
//         <div
//           className={`flex items-center ${
//             collapsed ? "justify-center" : "gap-3 px-3"
//           }`}
//         >
//           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
//             {user.name?.charAt(0)?.toUpperCase() || "U"}
//           </div>

//           {!collapsed && (
//             <div className="min-w-0">
//               <p className="truncate text-sm font-semibold text-slate-100">
//                 {user.name || "User"}
//               </p>
//               <p className="truncate text-xs capitalize text-slate-400">
//                 {user.role?.toLowerCase() || "member"}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// function Item({
//   icon,
//   label,
//   href,
//   collapsed,
//   active = false,
// }: {
//   icon: string;
//   label: string;
//   href: string;
//   collapsed: boolean;
//   active?: boolean;
// }) {
//   return (
//     <Link
//       href={href}
//       title={label}
//       className={`flex items-center rounded-xl text-sm font-medium transition overflow-hidden ${
//         collapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"
//       } ${
//         active
//           ? "bg-slate-800 text-blue-400"
//           : "text-slate-300 hover:bg-slate-800 hover:text-white"
//       }`}
//     >
//       <span className="flex h-10 w-10 shrink-0 items-center justify-center text-lg">
//         {icon}
//       </span>

//       {!collapsed && <span className="truncate">{label}</span>}
//     </Link>
//   );
// }






// import Link from "next/link";

// type UserRole = "VOLUNTEER" | "ORGANIZATION" | "MENTOR" | "ADMIN" | string;

// export default function SidebarContent({
//   collapsed,
//   user,
// }: {
//   collapsed: boolean;
//   user: { name?: string; role?: string };
// }) {
//   const role = (user.role || "VOLUNTEER") as UserRole;

//   const topLabel = getWorkspaceLabel(role);
//   const navItems = getNavItems(role);

//   return (
//     <>
//       <div className={collapsed ? "px-3 py-6" : "px-4 py-6"}>
//         <div
//           className={`mb-8 flex items-center ${
//             collapsed ? "justify-center" : "gap-3"
//           }`}
//         >
//           <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 font-bold text-white shadow-lg">
//             B
//           </div>

//           {!collapsed && (
//             <div className="min-w-0">
//               <h2 className="truncate text-lg font-bold tracking-tight text-white">
//                 BuildUp
//               </h2>
//               <p className="truncate text-[10px] uppercase tracking-[0.18em] text-slate-400">
//                 {topLabel}
//               </p>
//             </div>
//           )}
//         </div>

//         <nav className="space-y-2">
//           {navItems.map((item, index) => (
//             <Item
//               key={item.href}
//               icon={item.icon}
//               label={item.label}
//               href={item.href}
//               collapsed={collapsed}
//               active={index === 0}
//             />
//           ))}
//         </nav>
//       </div>

//       <div className="mt-auto border-t border-white/10 px-3 py-5">
//         <div
//           className={`flex items-center ${
//             collapsed ? "justify-center" : "gap-3 px-2"
//           }`}
//         >
//           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
//             {user.name?.charAt(0)?.toUpperCase() || "U"}
//           </div>

//           {!collapsed && (
//             <div className="min-w-0">
//               <p className="truncate text-sm font-semibold text-slate-100">
//                 {user.name || "User"}
//               </p>
//               <p className="truncate text-xs text-slate-400">
//                 {formatRole(user.role)}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// function getWorkspaceLabel(role: UserRole) {
//   switch (role) {
//     case "MENTOR":
//       return "Mentor Space";
//     case "ORGANIZATION":
//       return "Organization Space";
//     case "ADMIN":
//       return "Admin Space";
//     case "VOLUNTEER":
//     default:
//       return "Volunteer Space";
//   }
// }

// function getNavItems(role: UserRole) {
//   switch (role) {
//     case "MENTOR":
//       return [
//         { icon: "📊", label: "Dashboard", href: "/dashboard/mentor" },
//         { icon: "🧑‍🏫", label: "Mentorship Requests", href: "/dashboard/mentor/requests" },
//         { icon: "💼", label: "Projects", href: "/projects" },
//         { icon: "💬", label: "Messages", href: "/dashboard/messages" },
//         { icon: "🌍", label: "Portfolio", href: "/portfolio" },
//         { icon: "⚙️", label: "Settings", href: "/dashboard/settings" },
//       ];

//     case "ORGANIZATION":
//       return [
//         { icon: "📊", label: "Dashboard", href: "/dashboard/organization" },
//         { icon: "📝", label: "Post Project", href: "/projects/new" },
//         { icon: "💼", label: "Projects", href: "/projects" },
//         { icon: "📨", label: "Inbox", href: "/dashboard/organization/inbox" },
//         { icon: "💬", label: "Messages", href: "/dashboard/messages" },
//         { icon: "⚙️", label: "Settings", href: "/dashboard/settings" },
//       ];

//     case "ADMIN":
//       return [
//         { icon: "📊", label: "Dashboard", href: "/dashboard/admin" },
//         { icon: "👥", label: "Users", href: "/dashboard/admin/users" },
//         { icon: "✅", label: "Approvals", href: "/dashboard/admin/approvals" },
//         { icon: "💼", label: "Projects", href: "/projects" },
//         { icon: "⚙️", label: "Settings", href: "/dashboard/settings" },
//       ];

//     case "VOLUNTEER":
//     default:
//       return [
//         { icon: "📊", label: "Dashboard", href: "/dashboard/volunteer" },
//         { icon: "💼", label: "Projects", href: "/projects" },
//         { icon: "🌍", label: "Portfolio", href: "/portfolio" },
//         { icon: "💬", label: "Messages", href: "/dashboard/messages" },
//         { icon: "⚙️", label: "Settings", href: "/dashboard/settings" },
//       ];
//   }
// }

// function formatRole(role?: string) {
//   if (!role) return "Member";
//   return role.charAt(0) + role.slice(1).toLowerCase();
// }

// function Item({
//   icon,
//   label,
//   href,
//   collapsed,
//   active = false,
// }: {
//   icon: string;
//   label: string;
//   href: string;
//   collapsed: boolean;
//   active?: boolean;
// }) {
//   return (
//     <Link
//       href={href}
//       title={label}
//       className={`group flex items-center overflow-hidden rounded-2xl text-sm font-medium transition-all duration-200 ${
//         collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-3"
//       } ${
//         active
//           ? "bg-white text-slate-900 shadow-[0_10px_25px_rgba(255,255,255,0.14)]"
//           : "text-slate-300 hover:bg-white/10 hover:text-white"
//       }`}
//     >
//       <span
//         className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-base transition ${
//           active
//             ? "bg-slate-100 text-slate-900"
//             : "bg-white/5 text-slate-200 group-hover:bg-white/10 group-hover:text-white"
//         }`}
//       >
//         {icon}
//       </span>

//       {!collapsed && (
//         <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
//           <span className="truncate">{label}</span>
//           {active && <span className="h-2 w-2 rounded-full bg-blue-600" />}
//         </span>
//       )}
//     </Link>
//   );
// }




// import Link from "next/link";

// type UserRole = "VOLUNTEER" | "ORGANIZATION" | "MENTOR" | "ADMIN" | string;

// export default function SidebarContent({
//   collapsed,
//   user,
// }: {
//   collapsed: boolean;
//   user: { name?: string; role?: string };
// }) {
//   const role = (user.role || "VOLUNTEER") as UserRole;
//   const navItems = getNavItems(role);

//   return (
//     <nav className="space-y-2">
//       {navItems.map((item, index) => (
//         <Item
//           key={item.href}
//           icon={item.icon}
//           label={item.label}
//           href={item.href}
//           collapsed={collapsed}
//           active={index === 0}
//         />
//       ))}
//     </nav>
//   );
// }

// function getNavItems(role: UserRole) {
//   switch (role) {
//     case "MENTOR":
//       return [
//         { icon: "📊", label: "Dashboard", href: "/dashboard/mentor" },
//         {
//           icon: "🧑‍🏫",
//           label: "Mentorship Requests",
//           href: "/dashboard/mentor/requests",
//         },
//         { icon: "💼", label: "Projects", href: "/projects" },
//         { icon: "💬", label: "Messages", href: "/dashboard/messages" },
//         { icon: "🌍", label: "Portfolio", href: "/portfolio" },
//         { icon: "⚙️", label: "Settings", href: "/dashboard/settings" },
//       ];

//     case "ORGANIZATION":
//       return [
//         { icon: "📊", label: "Dashboard", href: "/dashboard/organization" },
//         { icon: "📝", label: "Post Project", href: "/projects/new" },
//         { icon: "💼", label: "Projects", href: "/projects" },
//         {
//           icon: "📨",
//           label: "Inbox",
//           href: "/dashboard/organization/inbox",
//         },
//         { icon: "💬", label: "Messages", href: "/dashboard/messages" },
//         { icon: "⚙️", label: "Settings", href: "/dashboard/settings" },
//       ];

//     case "ADMIN":
//       return [
//         { icon: "📊", label: "Dashboard", href: "/dashboard/admin" },
//         { icon: "👥", label: "Users", href: "/dashboard/admin/users" },
//         { icon: "✅", label: "Approvals", href: "/dashboard/admin/approvals" },
//         { icon: "💼", label: "Projects", href: "/projects" },
//         { icon: "⚙️", label: "Settings", href: "/dashboard/settings" },
//       ];

//     case "VOLUNTEER":
//     default:
//       return [
//         { icon: "📊", label: "Dashboard", href: "/dashboard/volunteer" },
//         { icon: "💼", label: "Projects", href: "/projects" },
//         { icon: "🌍", label: "Portfolio", href: "/portfolio" },
//         { icon: "💬", label: "Messages", href: "/dashboard/messages" },
//         { icon: "⚙️", label: "Settings", href: "/dashboard/settings" },
//       ];
//   }
// }

// function Item({
//   icon,
//   label,
//   href,
//   collapsed,
//   active = false,
// }: {
//   icon: string;
//   label: string;
//   href: string;
//   collapsed: boolean;
//   active?: boolean;
// }) {
//   return (
//     <Link
//       href={href}
//       title={label}
//       className={`group flex items-center overflow-hidden rounded-2xl text-sm font-medium transition-all duration-200 ${
//         collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-3"
//       } ${
//         active
//           ? "bg-white text-slate-900 shadow-[0_10px_25px_rgba(255,255,255,0.14)]"
//           : "text-slate-300 hover:bg-white/10 hover:text-white"
//       }`}
//     >
//       <span
//         className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-base transition ${
//           active
//             ? "bg-slate-100 text-slate-900"
//             : "bg-white/5 text-slate-200 group-hover:bg-white/10 group-hover:text-white"
//         }`}
//       >
//         {icon}
//       </span>

//       {!collapsed && (
//         <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
//           <span className="truncate">{label}</span>
//           {active && <span className="h-2 w-2 rounded-full bg-blue-600" />}
//         </span>
//       )}
//     </Link>
//   );
// }



// import Link from "next/link";

// type UserRole = "VOLUNTEER" | "ORGANIZATION" | "MENTOR" | "ADMIN" | string;

// export default function SidebarContent({
//   collapsed,
//   user,
// }: {
//   collapsed: boolean;
//   user: { name?: string; role?: string };
// }) {
//   const role = (user.role || "VOLUNTEER") as UserRole;
//   const navItems = getNavItems(role);

//   return (
//     <nav className="space-y-2">
//       {navItems.map((item, index) => (
//         <SidebarItem
//           key={item.href}
//           icon={item.icon}
//           label={item.label}
//           href={item.href}
//           collapsed={collapsed}
//           active={index === 0}
//         />
//       ))}
//     </nav>
//   );
// }

// /* ================= NAV CONFIG ================= */

// function getNavItems(role: UserRole) {
//   switch (role) {
//     /* ===== MENTOR ===== */
//     case "MENTOR":
//       return [
//         { icon: "📊", label: "Dashboard", href: "/dashboard/mentor" },
//         {
//           icon: "🧑‍🏫",
//           label: "Mentorship Requests",
//           href: "/dashboard/mentor/requests",
//         },
//         {
//           icon: "💼",
//           label: "Assigned Projects",
//           href: "/projects",
//         },
//         { icon: "💬", label: "Messages", href: "/dashboard/messages" },
//         { icon: "⚙️", label: "Settings", href: "/dashboard/settings" },
//       ];

//     /* ===== ORGANIZATION ===== */
//     case "ORGANIZATION":
//       return [
//         { icon: "📊", label: "Dashboard", href: "/dashboard/organization" },
//         { icon: "📝", label: "Post Project", href: "/projects/new" },
//         { icon: "💼", label: "Projects", href: "/projects" },
//         {
//           icon: "📨",
//           label: "Inbox",
//           href: "/dashboard/organization/inbox",
//         },
//         { icon: "💬", label: "Messages", href: "/dashboard/messages" },
//         { icon: "⚙️", label: "Settings", href: "/dashboard/settings" },
//       ];

//     /* ===== ADMIN ===== */
//     case "ADMIN":
//       return [
//         { icon: "📊", label: "Dashboard", href: "/dashboard/admin" },
//         { icon: "👥", label: "Users", href: "/dashboard/admin/users" },
//         { icon: "✅", label: "Approvals", href: "/dashboard/admin/approvals" },
//         { icon: "💼", label: "Projects", href: "/projects" },
//         { icon: "⚙️", label: "Settings", href: "/dashboard/settings" },
//       ];

//     /* ===== VOLUNTEER (DEFAULT) ===== */
//     case "VOLUNTEER":
//     default:
//       return [
//         { icon: "📊", label: "Dashboard", href: "/dashboard/volunteer" },
//         { icon: "💼", label: "Projects", href: "/projects" },
//         { icon: "🌍", label: "Portfolio", href: "/portfolio" },
//         { icon: "💬", label: "Messages", href: "/dashboard/messages" },
//         { icon: "⚙️", label: "Settings", href: "/dashboard/settings" },
//       ];
//   }
// }

// /* ================= SIDEBAR ITEM ================= */

// function SidebarItem({
//   icon,
//   label,
//   href,
//   collapsed,
//   active = false,
// }: {
//   icon: string;
//   label: string;
//   href: string;
//   collapsed: boolean;
//   active?: boolean;
// }) {
//   return (
//     <Link
//       href={href}
//       title={label}
//       className={`group flex items-center overflow-hidden rounded-2xl text-sm font-medium transition-all duration-200 ${
//         collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-3"
//       } ${
//         active
//           ? "bg-white text-slate-900 shadow-[0_10px_25px_rgba(255,255,255,0.14)]"
//           : "text-slate-300 hover:bg-white/10 hover:text-white"
//       }`}
//     >
//       <span
//         className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-base transition ${
//           active
//             ? "bg-slate-100 text-slate-900"
//             : "bg-white/5 text-slate-200 group-hover:bg-white/10 group-hover:text-white"
//         }`}
//       >
//         {icon}
//       </span>

//       {!collapsed && (
//         <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
//           <span className="truncate">{label}</span>
//           {active && <span className="h-2 w-2 rounded-full bg-blue-600" />}
//         </span>
//       )}
//     </Link>
//   );
// }




// import Link from "next/link";

// type UserRole = "VOLUNTEER" | "ORGANIZATION" | "MENTOR" | "ADMIN" | string;

// export default function SidebarContent({
//   collapsed = false,
//   user,
// }: {
//   collapsed?: boolean;
//   user: { name?: string; role?: string };
// }) {
//   const role = (user.role || "VOLUNTEER") as UserRole;
//   const navItems = getNavItems(role);

//   return (
//     <nav className="space-y-2">
//       {navItems.map((item, index) => (
//         <SidebarItem
//           key={item.href}
//           icon={item.icon}
//           label={item.label}
//           href={item.href}
//           collapsed={collapsed}
//           active={index === 0}
//         />
//       ))}
//     </nav>
//   );
// }

// function getNavItems(role: UserRole) {
//   switch (role) {
//     case "MENTOR":
//       return [
//         { icon: "📊", label: "Dashboard", href: "/dashboard/mentor" },
//         {
//           icon: "🧑‍🏫",
//           label: "Mentorship Requests",
//           href: "/dashboard/mentor/requests",
//         },
//         {
//           icon: "💼",
//           label: "Assigned Projects",
//           href: "/projects",
//         },
//         { icon: "💬", label: "Messages", href: "/dashboard/messages" },
//         { icon: "⚙️", label: "Settings", href: "/dashboard/settings" },
//       ];

//     case "ORGANIZATION":
//       return [
//         { icon: "📊", label: "Dashboard", href: "/dashboard/organization" },
//         { icon: "📝", label: "Post Project", href: "/projects/new" },
//         { icon: "💼", label: "Projects", href: "/projects" },
//         {
//           icon: "📨",
//           label: "Inbox",
//           href: "/dashboard/organization/inbox",
//         },
//         { icon: "💬", label: "Messages", href: "/dashboard/messages" },
//         { icon: "⚙️", label: "Settings", href: "/dashboard/settings" },
//       ];

//     case "ADMIN":
//       return [
//         { icon: "📊", label: "Dashboard", href: "/dashboard/admin" },
//         { icon: "👥", label: "Users", href: "/dashboard/admin/users" },
//         { icon: "✅", label: "Approvals", href: "/dashboard/admin/approvals" },
//         { icon: "💼", label: "Projects", href: "/projects" },
//         { icon: "⚙️", label: "Settings", href: "/dashboard/settings" },
//       ];

//     case "VOLUNTEER":
//     default:
//       return [
//         { icon: "📊", label: "Dashboard", href: "/dashboard/volunteer" },
//         { icon: "💼", label: "Projects", href: "/projects" },
//         { icon: "🌍", label: "Portfolio", href: "/portfolio" },
//         { icon: "💬", label: "Messages", href: "/dashboard/messages" },
//         { icon: "⚙️", label: "Settings", href: "/dashboard/settings" },
//       ];
//   }
// }

// function SidebarItem({
//   icon,
//   label,
//   href,
//   collapsed,
//   active = false,
// }: {
//   icon: string;
//   label: string;
//   href: string;
//   collapsed: boolean;
//   active?: boolean;
// }) {
//   return (
//     <Link
//       href={href}
//       title={label}
//       className={`group flex items-center overflow-hidden rounded-2xl text-sm font-medium transition-all duration-200 ${
//         collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-3"
//       } ${
//         active
//           ? "bg-white text-slate-900 shadow-[0_10px_25px_rgba(255,255,255,0.14)]"
//           : "text-slate-300 hover:bg-white/10 hover:text-white"
//       }`}
//     >
//       <span
//         className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-base transition ${
//           active
//             ? "bg-slate-100 text-slate-900"
//             : "bg-white/5 text-slate-200 group-hover:bg-white/10 group-hover:text-white"
//         }`}
//       >
//         {icon}
//       </span>

//       {!collapsed && (
//         <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
//           <span className="truncate">{label}</span>
//           {active && <span className="h-2 w-2 rounded-full bg-blue-600" />}
//         </span>
//       )}
//     </Link>
//   );
// }




import Link from "next/link";
import { ReactNode } from "react";
import UnreadBadge from "@/components/chat/UnreadBadge";

type UserRole = "VOLUNTEER" | "ORGANIZATION" | "MENTOR" | "ADMIN" | string;

type NavItem = {
  icon: ReactNode;
  label: ReactNode;
  href: string;
  active?: boolean;
  trailing?: ReactNode;
};

export default function SidebarContent({
  collapsed = false,
  user,
}: {
  collapsed?: boolean;
  user: { name?: string; role?: string };
}) {
  const role = (user.role || "VOLUNTEER") as UserRole;
  const navItems = getNavItems(role);

  return (
    <nav className="space-y-2">
      {navItems.map((item) => (
        <SidebarItem
          key={item.href}
          icon={item.icon}
          label={item.label}
          href={item.href}
          collapsed={collapsed}
          active={item.active}
          trailing={item.trailing}
        />
      ))}
    </nav>
  );
}

function getNavItems(role: UserRole): NavItem[] {
  switch (role) {
    case "MENTOR":
      return [
        {
          icon: "📊",
          label: "Dashboard",
          href: "/dashboard/mentor",
          active: true,
        },
        {
          icon: "🧑‍🏫",
          label: "Mentorship Requests",
          href: "/dashboard/mentor/requests",
        },
        {
          icon: "💼",
          label: "Assigned Projects",
          href: "/projects",
        },
        {
          icon: "💬",
          label: "Messages",
          href: "/dashboard/messages",
        },
        {
          icon: "⚙️",
          label: "Settings",
          href: "/dashboard/settings",
        },
      ];

    case "ORGANIZATION":
      return [
        {
          icon: "📊",
          label: "Dashboard",
          href: "/dashboard/organization",
          active: true,
        },
        {
          icon: "📁",
          label: "My Projects",
          href: "/projects",
        },
        {
          icon: "💬",
          label: "Messages",
          href: "/dashboard/organization/inbox",
          trailing: <UnreadBadge />,
        },
        {
          icon: "📩",
          label: "Invite History",
          href: "/dashboard/organization/invites",
        },
        {
          icon: "➕",
          label: "Post a Project",
          href: "/projects/new",
        },
      ];

    case "ADMIN":
      return [
        {
          icon: "📊",
          label: "Dashboard",
          href: "/dashboard/admin",
          active: true,
        },
        {
          icon: "👥",
          label: "Users",
          href: "/dashboard/admin/users",
        },
        {
          icon: "✅",
          label: "Approvals",
          href: "/dashboard/admin/approvals",
        },
        {
          icon: "💼",
          label: "Projects",
          href: "/projects",
        },
        {
          icon: "⚙️",
          label: "Settings",
          href: "/dashboard/settings",
        },
      ];

    case "VOLUNTEER":
    default:
      return [
        {
          icon: "📊",
          label: "Dashboard",
          href: "/dashboard/volunteer",
          active: true,
        },
        {
          icon: "💼",
          label: "Projects",
          href: "/projects",
        },
        {
          icon: "🌍",
          label: "Portfolio",
          href: "/portfolio",
        },
        {
          icon: "💬",
          label: "Messages",
          href: "/dashboard/messages",
        },
        {
          icon: "⚙️",
          label: "Settings",
          href: "/dashboard/settings",
        },
      ];
  }
}

function SidebarItem({
  icon,
  label,
  href,
  collapsed,
  active = false,
  trailing,
}: {
  icon: ReactNode;
  label: ReactNode;
  href: string;
  collapsed: boolean;
  active?: boolean;
  trailing?: ReactNode;
}) {
  return (
    <Link
      href={href}
      title={typeof label === "string" ? label : undefined}
      className={`group flex items-center overflow-hidden rounded-2xl text-sm font-medium transition-all duration-200 ${
        collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-3"
      } ${
        active
          ? "bg-white text-slate-900 shadow-[0_10px_25px_rgba(255,255,255,0.14)]"
          : "text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-base transition ${
          active
            ? "bg-slate-100 text-slate-900"
            : "bg-white/5 text-slate-200 group-hover:bg-white/10 group-hover:text-white"
        }`}
      >
        {icon}
      </span>

      {!collapsed && (
        <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <span className="truncate">{label}</span>
          <span className="flex shrink-0 items-center gap-2">
            {trailing}
            {active && <span className="h-2 w-2 rounded-full bg-blue-600" />}
          </span>
        </span>
      )}
    </Link>
  );
}
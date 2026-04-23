




// import Link from "next/link";
// import { ReactNode } from "react";
// import UnreadBadge from "@/components/chat/UnreadBadge";

// type UserRole = "VOLUNTEER" | "ORGANIZATION" | "MENTOR" | "ADMIN" | string;

// type NavItem = {
//   icon: ReactNode;
//   label: ReactNode;
//   href: string;
//   active?: boolean;
//   trailing?: ReactNode;
// };

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
//       {navItems.map((item) => (
//         <SidebarItem
//           key={item.href}
//           icon={item.icon}
//           label={item.label}
//           href={item.href}
//           collapsed={collapsed}
//           active={item.active}
//           trailing={item.trailing}
//         />
//       ))}
//     </nav>
//   );
// }

// function getNavItems(role: UserRole): NavItem[] {
//   switch (role) {
//     case "MENTOR":
//       return [
//         {
//           icon: "📊",
//           label: "Dashboard",
//           href: "/dashboard/mentor",
//           active: true,
//         },
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
//         {
//           icon: "💬",
//           label: "Messages",
//           href: "/dashboard/messages",
//         },
//         {
//           icon: "⚙️",
//           label: "Settings",
//           href: "/dashboard/settings",
//         },
//       ];

//     case "ORGANIZATION":
//       return [
//         {
//           icon: "📊",
//           label: "Dashboard",
//           href: "/dashboard/organization",
//           active: true,
//         },
//         {
//           icon: "📁",
//           label: "My Projects",
//           href: "/projects",
//         },
//         {
//           icon: "💬",
//           label: "Messages",
//           href: "/dashboard/organization/inbox",
//           trailing: <UnreadBadge />,
//         },
//         {
//           icon: "📩",
//           label: "Invite History",
//           href: "/dashboard/organization/invites",
//         },
//         {
//           icon: "➕",
//           label: "Post a Project",
//           href: "/projects/new",
//         },
//       ];

//     case "ADMIN":
//       return [
//         {
//           icon: "📊",
//           label: "Dashboard",
//           href: "/dashboard/admin",
//           active: true,
//         },
//         {
//           icon: "👥",
//           label: "Users",
//           href: "/dashboard/admin/users",
//         },
//         {
//           icon: "✅",
//           label: "Approvals",
//           href: "/dashboard/admin/approvals",
//         },
//         {
//           icon: "💼",
//           label: "Projects",
//           href: "/projects",
//         },
//         {
//           icon: "⚙️",
//           label: "Settings",
//           href: "/dashboard/settings",
//         },
//       ];

//     case "VOLUNTEER":
//     default:
//       return [
//         {
//           icon: "📊",
//           label: "Dashboard",
//           href: "/dashboard/volunteer",
//           active: true,
//         },
//         {
//           icon: "💼",
//           label: "Projects",
//           href: "/projects",
//         },
//         {
//           icon: "🌍",
//           label: "Portfolio",
//           href: "/portfolio",
//         },
//         {
//           icon: "💬",
//           label: "Messages",
//           href: "/dashboard/messages",
//         },
//         {
//           icon: "⚙️",
//           label: "Settings",
//           href: "/dashboard/settings",
//         },
//       ];
//   }
// }

// function SidebarItem({
//   icon,
//   label,
//   href,
//   collapsed,
//   active = false,
//   trailing,
// }: {
//   icon: ReactNode;
//   label: ReactNode;
//   href: string;
//   collapsed: boolean;
//   active?: boolean;
//   trailing?: ReactNode;
// }) {
//   return (
//     <Link
//       href={href}
//       title={typeof label === "string" ? label : undefined}
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
//           <span className="flex shrink-0 items-center gap-2">
//             {trailing}
//             {active && <span className="h-2 w-2 rounded-full bg-blue-600" />}
//           </span>
//         </span>
//       )}
//     </Link>
//   );
// }



import { ReactNode } from "react";
import UnreadBadge from "@/components/chat/UnreadBadge";
import SidebarItem from "@/components/sidebar/SidebarItem";

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

        // ✅ NEW SETTINGS ITEM
        {
          icon: "⚙️",
          label: "Settings",
          href: "/dashboard/settings",
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
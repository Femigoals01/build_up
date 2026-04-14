
// import { ReactNode } from "react";

// export default function SidebarItem({
//   href,
//   label,
//   icon,
//   active = false,
// }: {
//   href: string;
//   label: ReactNode;
//   icon: string;
//   active?: boolean;
// }) {
//   return (
//     <a
//       href={href}
//       className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
//         active
//           ? "bg-slate-800 text-blue-400"
//           : "hover:bg-slate-800 hover:text-white"
//       }`}
//     >
//       <span className="text-lg">{icon}</span>
//       {label}
//     </a>
//   );
// }



// import Link from "next/link";
// import { ReactNode } from "react";

// export default function SidebarItem({
//   href,
//   label,
//   icon,
//   active = false,
//   collapsed = false,
// }: {
//   href: string;
//   label: ReactNode;
//   icon: string;
//   active?: boolean;
//   collapsed?: boolean;
// }) {
//   return (
//     <Link
//       href={href}
//       title={typeof label === "string" ? label : undefined}
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

//       {!collapsed && (
//         <span className="min-w-0 flex-1 truncate">
//           {label}
//         </span>
//       )}
//     </Link>
//   );
// }



// import Link from "next/link";
// import { ReactNode } from "react";

// export default function SidebarItem({
//   href,
//   label,
//   icon,
//   active = false,
//   collapsed = false,
// }: {
//   href: string;
//   label: ReactNode;
//   icon: string;
//   active?: boolean;
//   collapsed?: boolean;
// }) {
//   return (
//     <Link
//       href={href}
//       title={typeof label === "string" ? label : undefined}
//       className={`flex items-center rounded-xl text-sm font-medium transition overflow-hidden ${
//         collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
//       } ${
//         active
//           ? "bg-slate-800 text-blue-400"
//           : "text-slate-300 hover:bg-slate-800 hover:text-white"
//       }`}
//     >
//       <span className="flex h-9 w-9 shrink-0 items-center justify-center text-base">
//         {icon}
//       </span>

//       {!collapsed && (
//         <span className="min-w-0 flex-1 truncate">
//           {label}
//         </span>
//       )}
//     </Link>
//   );
// }




import Link from "next/link";
import { ReactNode } from "react";

type SidebarItemProps = {
  href: string;
  label: ReactNode;
  icon: string;
  active?: boolean;
  collapsed?: boolean;
};

export default function SidebarItem({
  href,
  label,
  icon,
  active = false,
  collapsed = false,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      title={typeof label === "string" ? label : undefined}
      className={`flex items-center overflow-hidden rounded-xl text-sm font-medium transition ${
        collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
      } ${
        active
          ? "bg-slate-800 text-blue-400"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center text-base">
        {icon}
      </span>

      {!collapsed && (
        <span className="min-w-0 flex-1 truncate">
          {label}
        </span>
      )}
    </Link>
  );
}
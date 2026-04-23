




// import Link from "next/link";
// import { ReactNode } from "react";

// type SidebarItemProps = {
//   href: string;
//   label: ReactNode;
//   icon: string;
//   active?: boolean;
//   collapsed?: boolean;
// };

// export default function SidebarItem({
//   href,
//   label,
//   icon,
//   active = false,
//   collapsed = false,
// }: SidebarItemProps) {
//   return (
//     <Link
//       href={href}
//       title={typeof label === "string" ? label : undefined}
//       className={`flex items-center overflow-hidden rounded-xl text-sm font-medium transition ${
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
  icon: ReactNode;
  active?: boolean;
  collapsed?: boolean;
  trailing?: ReactNode;
};

export default function SidebarItem({
  href,
  label,
  icon,
  active = false,
  collapsed = false,
  trailing,
}: SidebarItemProps) {
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
        {typeof icon === "string" ? <span>{icon}</span> : icon}
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
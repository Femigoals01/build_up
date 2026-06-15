



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
      className={`group relative flex items-center overflow-hidden rounded-xl text-sm font-medium transition-all duration-200 ${
        collapsed ? "justify-center px-2 py-2" : "gap-2.5 px-2.5 py-2"
      } ${
        active
          ? "text-white"
          : "text-slate-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-blue-400 to-indigo-500 shadow-[0_0_14px_rgba(59,130,246,0.7)]" />
      )}

      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm transition ${
          active
            ? "text-white"
            : "bg-white/5 text-slate-200 group-hover:bg-white/10 group-hover:text-white"
        }`}
      >
        {typeof icon === "string" ? <span>{icon}</span> : icon}
      </span>

      {!collapsed && (
        <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <span className="truncate">{label}</span>

          <span className="flex shrink-0 items-center gap-2">{trailing}</span>
        </span>
      )}
    </Link>
  );
}
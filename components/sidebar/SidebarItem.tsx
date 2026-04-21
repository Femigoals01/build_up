




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

import { ReactNode } from "react";

export default function SidebarItem({
  href,
  label,
  icon,
  active = false,
}: {
  href: string;
  label: ReactNode;
  icon: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
        active
          ? "bg-slate-800 text-blue-400"
          : "hover:bg-slate-800 hover:text-white"
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </a>
  );
}

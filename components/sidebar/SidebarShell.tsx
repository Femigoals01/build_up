

"use client";

import { useState } from "react";

export default function SidebarShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-72"
      } bg-slate-900 text-slate-200 min-h-screen border-r border-slate-800 transition-all duration-300 relative`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-6 bg-slate-800 text-slate-300 rounded-full w-8 h-8 flex items-center justify-center shadow"
      >
        {collapsed ? "➤" : "◀"}
      </button>

      <div className="px-6 py-8">
        <h2
          className={`text-xl font-bold text-blue-500 transition ${
            collapsed && "opacity-0"
          }`}
        >
          BuildUp
        </h2>
      </div>

      <nav className="px-4 space-y-2">{children}</nav>
    </aside>
  );
}

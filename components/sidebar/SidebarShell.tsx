

// "use client";

// import { useState } from "react";

// export default function SidebarShell({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <aside
//       className={`${
//         collapsed ? "w-20" : "w-72"
//       } bg-slate-900 text-slate-200 min-h-screen border-r border-slate-800 transition-all duration-300 relative`}
//     >
//       {/* Collapse Button */}
//       <button
//         onClick={() => setCollapsed(!collapsed)}
//         className="absolute -right-4 top-6 bg-slate-800 text-slate-300 rounded-full w-8 h-8 flex items-center justify-center shadow"
//       >
//         {collapsed ? "➤" : "◀"}
//       </button>

//       <div className="px-6 py-8">
//         <h2
//           className={`text-xl font-bold text-blue-500 transition ${
//             collapsed && "opacity-0"
//           }`}
//         >
//           BuildUp
//         </h2>
//       </div>

//       <nav className="px-4 space-y-2">{children}</nav>
//     </aside>
//   );
// }




"use client";

import { Children, cloneElement, isValidElement, useState } from "react";

export default function SidebarShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex h-screen flex-col overflow-hidden border-r border-slate-800 bg-slate-900 text-slate-200 transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Collapse Button */}
      <button
        type="button"
        onClick={() => setCollapsed((prev) => !prev)}
        className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xs text-slate-300 shadow transition hover:bg-slate-700"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? "➤" : "◀"}
      </button>

      {/* Brand */}
      <div
        className={`shrink-0 border-b border-slate-800 transition-all duration-300 ${
          collapsed ? "px-3 py-3" : "px-4 py-4"
        }`}
      >
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-sm">
            B
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <h2 className="truncate text-base font-bold tracking-tight text-blue-400">
                BuildUp
              </h2>
              <p className="truncate text-[9px] uppercase tracking-[0.16em] text-slate-500">
                Volunteer Space
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-2.5">
        <div className="space-y-1">
          {Children.map(children, (child) => {
            if (!isValidElement(child)) return child;

            return cloneElement(child as React.ReactElement<any>, {
              collapsed,
            });
          })}
        </div>
      </nav>

      {/* Bottom helper card */}
      <div className="shrink-0 border-t border-slate-800 px-2.5 py-2.5">
        <div
          className={`rounded-xl border border-slate-800 bg-slate-800/60 ${
            collapsed ? "p-2" : "p-2.5"
          }`}
        >
          {collapsed ? (
            <div className="text-center text-sm">🚀</div>
          ) : (
            <>
              <p className="text-xs font-semibold text-white">Keep growing</p>
              <p className="mt-1 text-[10px] leading-4 text-slate-400">
                Complete projects and grow your portfolio.
              </p>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
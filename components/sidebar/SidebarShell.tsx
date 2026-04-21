



// "use client";

// import { Children, cloneElement, isValidElement, useState } from "react";

// export default function SidebarShell({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <aside
//       className={`relative flex h-screen flex-col overflow-hidden border-r border-slate-800 bg-slate-900 text-slate-200 transition-all duration-300 ${
//         collapsed ? "w-20" : "w-72"
//       }`}
//     >
//       {/* Collapse Button */}
//       <button
//         type="button"
//         onClick={() => setCollapsed((prev) => !prev)}
//         className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xs text-slate-300 shadow transition hover:bg-slate-700"
//         aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//         title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//       >
//         {collapsed ? "➤" : "◀"}
//       </button>

//       {/* Brand */}
//       <div
//         className={`shrink-0 border-b border-slate-800 transition-all duration-300 ${
//           collapsed ? "px-3 py-3" : "px-4 py-4"
//         }`}
//       >
//         <div
//           className={`flex items-center ${
//             collapsed ? "justify-center" : "gap-3"
//           }`}
//         >
//           <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-sm">
//             B
//           </div>

//           {!collapsed && (
//             <div className="min-w-0">
//               <h2 className="truncate text-base font-bold tracking-tight text-blue-400">
//                 BuildUp
//               </h2>
//               <p className="truncate text-[9px] uppercase tracking-[0.16em] text-slate-500">
//                 Volunteer Space
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Nav */}
//       <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-2.5">
//         <div className="space-y-1">
//           {Children.map(children, (child) => {
//             if (!isValidElement(child)) return child;

//             return cloneElement(child as React.ReactElement<any>, {
//               collapsed,
//             });
//           })}
//         </div>
//       </nav>

//       {/* Bottom helper card */}
//       <div className="shrink-0 border-t border-slate-800 px-2.5 py-2.5">
//         <div
//           className={`rounded-xl border border-slate-800 bg-slate-800/60 ${
//             collapsed ? "p-2" : "p-2.5"
//           }`}
//         >
//           {collapsed ? (
//             <div className="text-center text-sm">🚀</div>
//           ) : (
//             <>
//               <p className="text-xs font-semibold text-white">Keep growing</p>
//               <p className="mt-1 text-[10px] leading-4 text-slate-400">
//                 Complete projects and grow your portfolio.
//               </p>
//             </>
//           )}
//         </div>
//       </div>
//     </aside>
//   );
// }




// "use client";

// import { Children, cloneElement, isValidElement, useState } from "react";

// export default function SidebarShell({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <aside
//       className={`relative hidden h-screen shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[linear-gradient(180deg,#0f172a_0%,#111827_50%,#172554_100%)] text-slate-200 shadow-[8px_0_30px_rgba(15,23,42,0.08)] transition-all duration-300 lg:flex ${
//         collapsed ? "w-24" : "w-72"
//       }`}
//     >
//       <button
//         type="button"
//         onClick={() => setCollapsed((prev) => !prev)}
//         className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xs text-slate-300 shadow-sm transition hover:bg-white/10 hover:text-white"
//         aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//         title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//       >
//         {collapsed ? "➜" : "◀"}
//       </button>

//       <div
//         className={`shrink-0 border-b border-white/10 transition-all duration-300 ${
//           collapsed ? "px-3 py-4" : "px-4 py-5"
//         }`}
//       >
//         <div
//           className={`flex items-center ${
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
//                 Premium Workspace
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
//         <div className="space-y-2">
//           {Children.map(children, (child) => {
//             if (!isValidElement(child)) return child;

//             return cloneElement(child as React.ReactElement<any>, {
//               collapsed,
//             });
//           })}
//         </div>
//       </nav>

//       <div className="shrink-0 border-t border-white/10 px-3 py-4">
//         <div
//           className={`rounded-2xl border border-white/10 bg-white/5 ${
//             collapsed ? "p-2.5" : "p-3.5"
//           }`}
//         >
//           {collapsed ? (
//             <div className="text-center text-base">🚀</div>
//           ) : (
//             <>
//               <p className="text-sm font-semibold text-white">Keep building</p>
//               <p className="mt-1 text-xs leading-5 text-slate-300">
//                 Clear navigation, premium layout, and better focus for everyday work.
//               </p>
//             </>
//           )}
//         </div>
//       </div>
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
      className={`sticky top-[84px] hidden h-[calc(100vh-84px)] shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[linear-gradient(180deg,#0f172a_0%,#111827_50%,#172554_100%)] text-slate-200 shadow-[8px_0_30px_rgba(15,23,42,0.08)] transition-all duration-300 lg:flex ${
        collapsed ? "w-24" : "w-72"
      }`}
    >
      <button
        type="button"
        onClick={() => setCollapsed((prev) => !prev)}
        className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xs text-slate-300 shadow-sm transition hover:bg-white/10 hover:text-white"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? "➜" : "◀"}
      </button>

      <div
        className={`shrink-0 border-b border-white/10 transition-all duration-300 ${
          collapsed ? "px-3 py-4" : "px-4 py-5"
        }`}
      >
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 font-bold text-white shadow-lg">
            B
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold tracking-tight text-white">
                BuildUp
              </h2>
              <p className="truncate text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Premium Workspace
              </p>
            </div>
          )}
        </div>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        <div className="space-y-2">
          {Children.map(children, (child) => {
            if (!isValidElement(child)) return child;

            return cloneElement(child as React.ReactElement<any>, {
              collapsed,
            });
          })}
        </div>
      </nav>

      <div className="shrink-0 border-t border-white/10 px-3 py-4">
        <div
          className={`rounded-2xl border border-white/10 bg-white/5 ${
            collapsed ? "p-2.5" : "p-3.5"
          }`}
        >
          {collapsed ? (
            <div className="text-center text-base">🚀</div>
          ) : (
            <>
              <p className="text-sm font-semibold text-white">Keep building</p>
              <p className="mt-1 text-xs leading-5 text-slate-300">
                Clear navigation, premium layout, and better focus for everyday
                work.
              </p>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
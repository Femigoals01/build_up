



// "use client";

// import { Children, cloneElement, isValidElement, useState } from "react";

// export default function SidebarShell({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     // <aside
//     //   className={`sticky top-[84px] hidden h-[calc(100vh-84px)] shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[linear-gradient(180deg,#0f172a_0%,#111827_50%,#172554_100%)] text-slate-200 shadow-[8px_0_30px_rgba(15,23,42,0.08)] transition-all duration-300 lg:flex ${
//     //     collapsed ? "w-20" : "w-72"
//     //   }`}
//     // >

//     <aside
//   className={`sticky top-[84px] hidden h-[calc(100vh-84px)] flex-shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[linear-gradient(180deg,#0f172a_0%,#111827_50%,#172554_100%)] text-slate-200 transition-all duration-300 lg:flex ${
//     collapsed ? "w-20" : "w-50"
//   }`}
// >
//       <button
//         type="button"
//         onClick={() => setCollapsed((prev) => !prev)}
//         className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xs text-slate-300 shadow-sm transition hover:bg-white/10 hover:text-white"
//         aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//         title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//       >
//         {collapsed ? "➜" : "◀"}
//       </button>

//       <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-4 pt-16">
//         <div className="space-y-2">
//           {Children.map(children, (child) => {
//             if (!isValidElement(child)) return child;

//             return cloneElement(child as React.ReactElement<any>, {
//               collapsed,
//             });
//           })}
//         </div>
//       </nav>
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
      className={`sticky top-[84px] hidden h-[calc(100vh-84px)] flex-shrink-0 flex-col border-r border-white/10 bg-[linear-gradient(180deg,#0f172a_0%,#111827_50%,#172554_100%)] text-slate-200 transition-all duration-300 lg:flex ${
        collapsed ? "w-20" : "w-56"
      }`}
    >
      {/* COLLAPSE BUTTON */}
      <button
        type="button"
        onClick={() => setCollapsed((prev) => !prev)}
        className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs text-slate-300 shadow-sm transition hover:bg-white/10 hover:text-white"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? "➜" : "◀"}
      </button>

      {/* NAV ITEMS */}
      <nav className="min-h-0 flex-1 overflow-hidden px-2 pb-3 pt-14">
        <div className="space-y-1">
          {Children.map(children, (child) => {
            if (!isValidElement(child)) return child;

            return cloneElement(child as React.ReactElement<any>, {
              collapsed,
            });
          })}
        </div>
      </nav>
    </aside>
  );
}
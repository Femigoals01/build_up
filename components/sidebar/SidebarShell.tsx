



// "use client";

// import { Children, cloneElement, isValidElement, useState } from "react";
// import BuildUpLogo from "@/components/brand/BuildUpLogo";

// export default function SidebarShell({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <aside
//       className={`sticky top-[84px] hidden h-[calc(100vh-84px)] shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[linear-gradient(180deg,#0f172a_0%,#111827_50%,#172554_100%)] text-slate-200 shadow-[8px_0_30px_rgba(15,23,42,0.08)] transition-all duration-300 lg:flex ${
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
//             collapsed ? "justify-center" : "gap-4"
//           }`}
//         >
//           <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_10px_25px_rgba(15,23,42,0.18)]">
//             <div className="flex h-8 w-8 items-center justify-center">
//               <BuildUpLogo
//                 href="/"
//                 showTagline={false}
//                 className="justify-center"
//                 imageClassName="h-8 w-8 object-contain"
//               />
//             </div>
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
//                 Clear navigation, premium layout, and better focus for everyday
//                 work.
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
    // <aside
    //   className={`sticky top-[84px] hidden h-[calc(100vh-84px)] shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[linear-gradient(180deg,#0f172a_0%,#111827_50%,#172554_100%)] text-slate-200 shadow-[8px_0_30px_rgba(15,23,42,0.08)] transition-all duration-300 lg:flex ${
    //     collapsed ? "w-20" : "w-72"
    //   }`}
    // >

    <aside
  className={`sticky top-[84px] hidden h-[calc(100vh-84px)] flex-shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[linear-gradient(180deg,#0f172a_0%,#111827_50%,#172554_100%)] text-slate-200 transition-all duration-300 lg:flex ${
    collapsed ? "w-20" : "w-72"
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

      <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-4 pt-16">
        <div className="space-y-2">
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
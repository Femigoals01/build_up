



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
//       className={`sticky top-[84px] hidden h-[calc(100vh-84px)] flex-shrink-0 flex-col border-r border-white/10 bg-[linear-gradient(180deg,#0f172a_0%,#111827_50%,#172554_100%)] text-slate-200 transition-all duration-300 lg:flex ${
//         collapsed ? "w-20" : "w-56"
//       }`}
//     >
//       <button
//         type="button"
//         onClick={() => setCollapsed((prev) => !prev)}
//         className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs text-slate-300 shadow-sm transition hover:bg-white/10 hover:text-white"
//         aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//         title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//       >
//         {collapsed ? "➜" : "◀"}
//       </button>

//       <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-3 pt-14">
//         <div className="space-y-0.5">
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
  const [mobileOpen, setMobileOpen] = useState(false);

  function renderChildren(isCollapsed: boolean) {
    return Children.map(children, (child) => {
      if (!isValidElement(child)) return child;

      return cloneElement(child as React.ReactElement<any>, {
        collapsed: isCollapsed,
      });
    });
  }

  return (
    <>
      {/* <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-5 left-5 z-[80] flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-xl text-white shadow-2xl shadow-slate-900/30 lg:hidden"
        aria-label="Open dashboard menu"
      >
        ☰
      </button> */}

      <button
  type="button"
  onClick={() => setMobileOpen(true)}
  className="fixed left-4 top-[96px] z-[9999] flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-xl text-white shadow-2xl shadow-slate-900/30 lg:hidden"
  aria-label="Open dashboard menu"
>
  ☰
</button>

      {mobileOpen && (
        // <div className="fixed inset-0 z-[90] lg:hidden">
        <div className="fixed inset-0 z-[99999] lg:hidden">
          <button
            type="button"
            aria-label="Close dashboard menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          <aside className="relative flex h-full w-[82vw] max-w-[320px] flex-col border-r border-white/10 bg-[linear-gradient(180deg,#0f172a_0%,#111827_50%,#172554_100%)] text-slate-200 shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-200">
                  BuildUp
                </p>
                <p className="text-sm font-bold text-white">Dashboard Menu</p>
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white"
                aria-label="Close sidebar"
              >
                ✕
              </button>
            </div>

            <nav
              className="min-h-0 flex-1 overflow-y-auto px-3 py-4"
              onClick={() => setMobileOpen(false)}
            >
              <div className="space-y-1">{renderChildren(false)}</div>
            </nav>
          </aside>
        </div>
      )}

      <aside
        className={`sticky top-[84px] hidden h-[calc(100vh-84px)] flex-shrink-0 flex-col border-r border-white/10 bg-[linear-gradient(180deg,#0f172a_0%,#111827_50%,#172554_100%)] text-slate-200 transition-all duration-300 lg:flex ${
          collapsed ? "w-20" : "w-56"
        }`}
      >
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs text-slate-300 shadow-sm transition hover:bg-white/10 hover:text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? "➜" : "◀"}
        </button>

        <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-3 pt-14">
          <div className="space-y-0.5">{renderChildren(collapsed)}</div>
        </nav>
      </aside>
    </>
  );
}
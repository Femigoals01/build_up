
// export default function SidebarContent({
//   collapsed,
//   user,
// }: {
//   collapsed: boolean;
//   user: { name?: string; role?: string };
// }) {
//   return (
//     <>
//       {/* TOP */}
//       <div className="px-6 py-8">
//         <h2
//           className={`text-2xl font-bold text-blue-400 mb-10 tracking-tight transition ${
//             collapsed ? "opacity-0" : "opacity-100"
//           }`}
//         >
//           BuildUp
//         </h2>

//         <nav className="space-y-2">
//           <Item icon="📊" label="Dashboard" href="/dashboard/volunteer" collapsed={collapsed} active />
//           <Item icon="💼" label="Projects" href="/projects" collapsed={collapsed} />
//           <Item icon="🌍" label="Portfolio" href="/portfolio" collapsed={collapsed} />
//           <Item icon="💬" label="Messages" href="/dashboard/messages" collapsed={collapsed} />
//           <Item icon="⚙️" label="Settings" href="/dashboard/settings" collapsed={collapsed} />
//         </nav>
//       </div>

//       {/* FOOTER */}
//       <div className="border-t border-slate-800 px-6 py-6">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-semibold text-white">
//             {user.name?.charAt(0)}
//           </div>

//           {!collapsed && (
//             <div>
//               <p className="text-sm font-semibold">{user.name}</p>
//               <p className="text-xs text-slate-400 capitalize">
//                 {user.role?.toLowerCase()}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// function Item({
//   icon,
//   label,
//   href,
//   collapsed,
//   active = false,
// }: {
//   icon: string;
//   label: string;
//   href: string;
//   collapsed: boolean;
//   active?: boolean;
// }) {
//   return (
//     <a
//       href={href}
//       className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
//         active
//           ? "bg-slate-800 text-blue-400"
//           : "hover:bg-slate-800 hover:text-white"
//       }`}
//     >
//       <span className="text-lg">{icon}</span>
//       {!collapsed && <span>{label}</span>}
//     </a>
//   );
// }



import Link from "next/link";

export default function SidebarContent({
  collapsed,
  user,
}: {
  collapsed: boolean;
  user: { name?: string; role?: string };
}) {
  return (
    <>
      {/* TOP */}
      <div className={`${collapsed ? "px-3 py-6" : "px-6 py-8"}`}>
        <div className={`mb-10 flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 font-bold text-white shadow-sm">
            B
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <h2 className="truncate text-2xl font-bold tracking-tight text-blue-400">
                BuildUp
              </h2>
              <p className="truncate text-[11px] uppercase tracking-[0.16em] text-slate-500">
                Volunteer Space
              </p>
            </div>
          )}
        </div>

        <nav className="space-y-2">
          <Item
            icon="📊"
            label="Dashboard"
            href="/dashboard/volunteer"
            collapsed={collapsed}
            active
          />
          <Item
            icon="💼"
            label="Projects"
            href="/projects"
            collapsed={collapsed}
          />
          <Item
            icon="🌍"
            label="Portfolio"
            href="/portfolio"
            collapsed={collapsed}
          />
          <Item
            icon="💬"
            label="Messages"
            href="/dashboard/messages"
            collapsed={collapsed}
          />
          <Item
            icon="⚙️"
            label="Settings"
            href="/dashboard/settings"
            collapsed={collapsed}
          />
        </nav>
      </div>

      {/* FOOTER */}
      <div className="border-t border-slate-800 px-3 py-6">
        <div
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-3 px-3"
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-100">
                {user.name || "User"}
              </p>
              <p className="truncate text-xs capitalize text-slate-400">
                {user.role?.toLowerCase() || "member"}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Item({
  icon,
  label,
  href,
  collapsed,
  active = false,
}: {
  icon: string;
  label: string;
  href: string;
  collapsed: boolean;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      title={label}
      className={`flex items-center rounded-xl text-sm font-medium transition overflow-hidden ${
        collapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-3"
      } ${
        active
          ? "bg-slate-800 text-blue-400"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center text-lg">
        {icon}
      </span>

      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}
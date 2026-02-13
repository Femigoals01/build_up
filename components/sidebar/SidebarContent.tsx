
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
      <div className="px-6 py-8">
        <h2
          className={`text-2xl font-bold text-blue-400 mb-10 tracking-tight transition ${
            collapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          BuildUp
        </h2>

        <nav className="space-y-2">
          <Item icon="📊" label="Dashboard" href="/dashboard/volunteer" collapsed={collapsed} active />
          <Item icon="💼" label="Projects" href="/projects" collapsed={collapsed} />
          <Item icon="🌍" label="Portfolio" href="/portfolio" collapsed={collapsed} />
          <Item icon="💬" label="Messages" href="/dashboard/messages" collapsed={collapsed} />
          <Item icon="⚙️" label="Settings" href="/dashboard/settings" collapsed={collapsed} />
        </nav>
      </div>

      {/* FOOTER */}
      <div className="border-t border-slate-800 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-semibold text-white">
            {user.name?.charAt(0)}
          </div>

          {!collapsed && (
            <div>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-slate-400 capitalize">
                {user.role?.toLowerCase()}
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
    <a
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
        active
          ? "bg-slate-800 text-blue-400"
          : "hover:bg-slate-800 hover:text-white"
      }`}
    >
      <span className="text-lg">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </a>
  );
}

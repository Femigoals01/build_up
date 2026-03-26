



// "use client";

// import { signOut } from "next-auth/react";

// type Props = {
//   name?: string | null;
//   role?: string | null;
// };

// export default function DashboardHeader({ name, role }: Props) {
//   return (
//     <header className="h-16 bg-white border-b px-8 flex items-center justify-between">
//       {/* LEFT */}
//       <h1 className="text-lg font-semibold text-gray-800">
//         Dashboard
//       </h1>

//       {/* RIGHT */}
//       <div className="flex items-center gap-4">
//         {/* ROLE BADGE */}
//         <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-semibold">
//           {role}
//         </span>

//         {/* USER */}
//         <div className="flex items-center gap-3">
//           {/* AVATAR */}
//           <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600">
//             {name?.charAt(0)}
//           </div>

//           <span className="text-sm font-medium text-gray-800">
//             {name}
//           </span>
//         </div>

//         {/* LOGOUT */}
//         <button
//           onClick={() => signOut({ callbackUrl: "/login" })}
//           className="text-sm text-gray-500 hover:text-red-600 transition"
//         >
//           Logout
//         </button>
//       </div>
//     </header>
//   );
// }



"use client";

import { signOut } from "next-auth/react";

type Props = {
  name?: string | null;
  role?: string | null;
};

function formatRole(role?: string | null) {
  if (!role) return "User";
  return role.charAt(0) + role.slice(1).toLowerCase();
}

function getRoleStyles(role?: string | null) {
  switch (role) {
    case "ADMIN":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "MENTOR":
      return "border-purple-200 bg-purple-50 text-purple-700";
    case "ORGANIZATION":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "VOLUNTEER":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function getInitial(name?: string | null) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "U";
}

export default function DashboardHeader({ name, role }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
        {/* LEFT */}
        <div className="min-w-0">
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
            Dashboard
          </h1>
          <p className="hidden text-sm text-slate-500 sm:block">
            Welcome back{ name ? `, ${name}` : "" }.
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* ROLE BADGE */}
          <span
            className={`hidden rounded-full border px-3 py-1 text-xs font-semibold md:inline-flex ${getRoleStyles(
              role
            )}`}
          >
            {formatRole(role)}
          </span>

          {/* USER */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-sm">
              {getInitial(name)}
            </div>

            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-semibold text-slate-900">
                {name || "User"}
              </p>
              <p className="truncate text-xs text-slate-500">
                {formatRole(role)}
              </p>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
"use client";

import { signOut } from "next-auth/react";

type Props = {
  name?: string | null;
  role?: string | null;
};

export default function DashboardHeader({ name, role }: Props) {
  return (
    <header className="h-16 bg-white border-b px-8 flex items-center justify-between">
      {/* LEFT */}
      <h1 className="text-lg font-semibold text-gray-800">
        Dashboard
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* ROLE BADGE */}
        <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-semibold">
          {role}
        </span>

        {/* USER */}
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600">
            {name?.charAt(0)}
          </div>

          <span className="text-sm font-medium text-gray-800">
            {name}
          </span>
        </div>

        {/* LOGOUT */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-sm text-gray-500 hover:text-red-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}





import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import SignOutButton from "@/components/auth/SignOutButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AppRole = "VOLUNTEER" | "ORGANIZATION" | "MENTOR" | "ADMIN";

type DashboardHeaderProps = {
  name?: string | null;
  role?: AppRole;
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

function getDashboardHref(role?: string | null) {
  switch (role) {
    case "VOLUNTEER":
      return "/dashboard/volunteer";
    case "ORGANIZATION":
      return "/dashboard/organization";
    case "MENTOR":
      return "/dashboard/mentor";
    case "ADMIN":
      return "/dashboard/admin";
    default:
      return "/dashboard";
  }
}

export default async function DashboardHeader({
  name: fallbackName,
  role: fallbackRole,
}: DashboardHeaderProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      role: true,
      profileImageUrl: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const name = user.name || fallbackName || session.user.name || "User";
  const role = user.role || fallbackRole || session.user.role || null;
  const profileImageUrl = user.profileImageUrl || null;
  const dashboardHref = getDashboardHref(role);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
            Dashboard
          </h1>
          <p className="hidden text-sm text-slate-500 sm:block">
            Welcome back{name ? `, ${name}` : ""}.
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href={dashboardHref}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 md:px-4"
          >
            <span className="md:hidden">Home</span>
            <span className="hidden md:inline">Dashboard Home</span>
          </Link>

          <span
            className={`hidden rounded-full border px-3 py-1 text-xs font-semibold md:inline-flex ${getRoleStyles(
              role
            )}`}
          >
            {formatRole(role)}
          </span>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/60 shadow-sm">
              {profileImageUrl ? (
                <Image
                  src={profileImageUrl}
                  alt={name || "User profile"}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
                  {getInitial(name)}
                </div>
              )}
            </div>

            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-semibold text-slate-900">
                {name}
              </p>
              <p className="truncate text-xs text-slate-500">
                {formatRole(role)}
              </p>
            </div>
          </div>

          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
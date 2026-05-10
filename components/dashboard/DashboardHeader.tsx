





// import Image from "next/image";
// import Link from "next/link";
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import SignOutButton from "@/components/auth/SignOutButton";
// import BuildUpLogo from "@/components/brand/BuildUpLogo";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// type AppRole = "VOLUNTEER" | "ORGANIZATION" | "MENTOR" | "ADMIN";

// type DashboardHeaderProps = {
//   name?: string | null;
//   role?: AppRole;
// };

// function formatRole(role?: string | null) {
//   if (!role) return "User";
//   return role.charAt(0) + role.slice(1).toLowerCase();
// }

// function getInitial(name?: string | null) {
//   return name?.trim()?.charAt(0)?.toUpperCase() || "U";
// }

// function getDashboardHref(role?: string | null) {
//   switch (role) {
//     case "VOLUNTEER":
//       return "/dashboard/volunteer";
//     case "ORGANIZATION":
//       return "/dashboard/organization";
//     case "MENTOR":
//       return "/dashboard/mentor";
//     case "ADMIN":
//       return "/dashboard/admin";
//     default:
//       return "/dashboard";
//   }
// }

// function getRoleLinks(role?: string | null) {
//   switch (role) {
//     case "VOLUNTEER":
//       return [
//         { label: "Projects", href: "/dashboard/volunteer/projects" },
//         { label: "Messages", href: "/dashboard/messages" },
//         { label: "Portfolio", href: "/portfolio" },
//       ];

//     case "ORGANIZATION":
//       return [
//         { label: "Projects", href: "/dashboard/organization" },
//         { label: "Applicants", href: "/dashboard/organization/applicants" },
//         { label: "Messages", href: "/dashboard/messages" },
//       ];

//     case "MENTOR":
//       return [
//         { label: "Requests", href: "/dashboard/mentor/requests" },
//         { label: "Projects", href: "/dashboard/mentor" },
//         { label: "Messages", href: "/dashboard/messages" },
//       ];

//     case "ADMIN":
//       return [
//         { label: "Mentors", href: "/dashboard/admin/mentors" },
//         { label: "Organizations", href: "/dashboard/admin/organizations" },
//         { label: "Support", href: "/dashboard/admin/support" },
//       ];

//     default:
//       return [];
//   }
// }

// export default async function DashboardHeader({
//   name: fallbackName,
//   role: fallbackRole,
// }: DashboardHeaderProps) {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) {
//     redirect("/login");
//   }

//   const user = await prisma.user.findUnique({
//     where: { id: session.user.id },
//     select: {
//       name: true,
//       role: true,
//       profileImageUrl: true,
//     },
//   });

//   if (!user) {
//     redirect("/login");
//   }

//   const name = user.name || fallbackName || session.user.name || "User";
//   const role = user.role || fallbackRole || session.user.role || null;
//   const profileImageUrl = user.profileImageUrl || null;
//   const dashboardHref = getDashboardHref(role);
//   const roleLinks = getRoleLinks(role);

//   return (
//     <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
//       <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
//         <BuildUpLogo href={dashboardHref} showTagline={false} textSize="md" />

//         <div className="flex items-center gap-4">
//           <nav className="hidden items-center gap-4 lg:flex">
//             <Link
//               href={dashboardHref}
//               className="text-sm font-semibold text-slate-700 transition hover:text-blue-600"
//             >
//               Home
//             </Link>

//             {roleLinks.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className="text-sm font-semibold text-slate-700 transition hover:text-blue-600"
//               >
//                 {item.label}
//               </Link>
//             ))}
//           </nav>

//           <span className="hidden text-sm font-medium text-slate-500 md:inline">
//             {formatRole(role)}
//           </span>

//           <div className="flex items-center gap-2">
//             <div className="relative h-9 w-9 overflow-hidden rounded-full border border-slate-200">
//               {profileImageUrl ? (
//                 <Image
//                   src={profileImageUrl}
//                   alt={name || "User"}
//                   fill
//                   className="object-cover"
//                   sizes="36px"
//                 />
//               ) : (
//                 <div className="flex h-full w-full items-center justify-center bg-blue-600 text-xs font-bold text-white">
//                   {getInitial(name)}
//                 </div>
//               )}
//             </div>

//             <span className="hidden max-w-[120px] truncate text-sm font-semibold text-slate-800 sm:inline">
//               {name}
//             </span>
//           </div>

//           <SignOutButton />
//         </div>
//       </div>
//     </header>
//   );
// }






import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import SignOutButton from "@/components/auth/SignOutButton";
import BuildUpLogo from "@/components/brand/BuildUpLogo";
import NotificationBell from "@/components/notifications/NotificationBell";

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

function getRoleLinks(role?: string | null) {
  switch (role) {
    case "VOLUNTEER":
      return [
        { label: "Projects", href: "/dashboard/volunteer/projects" },
        { label: "Messages", href: "/dashboard/messages" },
        { label: "Portfolio", href: "/portfolio" },
      ];

    case "ORGANIZATION":
      return [
        { label: "Projects", href: "/dashboard/organization" },
        { label: "Applicants", href: "/dashboard/organization/applicants" },
        { label: "Messages", href: "/dashboard/messages" },
      ];

    case "MENTOR":
      return [
        { label: "Requests", href: "/dashboard/mentor/requests" },
        { label: "Projects", href: "/dashboard/mentor" },
        { label: "Messages", href: "/dashboard/messages" },
      ];

    case "ADMIN":
      return [
        { label: "Mentors", href: "/dashboard/admin/mentors" },
        { label: "Organizations", href: "/dashboard/admin/organizations" },
        { label: "Support", href: "/dashboard/admin/support" },
      ];

    default:
      return [];
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

  const [user, notifications] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        role: true,
        profileImageUrl: true,
      },
    }),

    prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  if (!user) {
    redirect("/login");
  }

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const name = user.name || fallbackName || session.user.name || "User";
  const role = user.role || fallbackRole || session.user.role || null;
  const profileImageUrl = user.profileImageUrl || null;
  const dashboardHref = getDashboardHref(role);
  const roleLinks = getRoleLinks(role);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
        <BuildUpLogo href={dashboardHref} showTagline={false} textSize="md" />

        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-4 lg:flex">
            <Link
              href={dashboardHref}
              className="text-sm font-semibold text-slate-700 transition hover:text-blue-600"
            >
              Home
            </Link>

            {roleLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-slate-700 transition hover:text-blue-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <span className="hidden text-sm font-medium text-slate-500 md:inline">
            {formatRole(role)}
          </span>

          <NotificationBell
            userId={session.user.id}
            notifications={notifications}
            unreadCount={unreadCount}
          />

          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-2.5 py-2 transition hover:border-blue-200 hover:bg-blue-50"
          >
            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-slate-200 bg-white">
              {profileImageUrl ? (
                <Image
                  src={profileImageUrl}
                  alt={name || "User"}
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-blue-600 text-xs font-bold text-white">
                  {getInitial(name)}
                </div>
              )}
            </div>

            <span className="hidden max-w-[120px] truncate text-sm font-semibold text-slate-800 sm:inline">
              {name}
            </span>
          </Link>

          <SignOutButton />
        </div>
      </div>
    </header>
  );
}




// import Image from "next/image";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import SignOutButton from "@/components/auth/SignOutButton";

// function formatRole(role?: string | null) {
//   if (!role) return "User";
//   return role.charAt(0) + role.slice(1).toLowerCase();
// }

// function getRoleStyles(role?: string | null) {
//   switch (role) {
//     case "ADMIN":
//       return "border-amber-200 bg-amber-50 text-amber-700";
//     case "MENTOR":
//       return "border-purple-200 bg-purple-50 text-purple-700";
//     case "ORGANIZATION":
//       return "border-blue-200 bg-blue-50 text-blue-700";
//     case "VOLUNTEER":
//       return "border-emerald-200 bg-emerald-50 text-emerald-700";
//     default:
//       return "border-slate-200 bg-slate-50 text-slate-700";
//   }
// }

// function getInitial(name?: string | null) {
//   return name?.trim()?.charAt(0)?.toUpperCase() || "U";
// }

// export default async function DashboardHeader() {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) return null;

//   // 🔥 ALWAYS FRESH FROM DB
//   const user = await prisma.user.findUnique({
//     where: { id: session.user.id },
//     select: {
//       name: true,
//       role: true,
//       profileImageUrl: true,
//     },
//   });

//   const name = user?.name || session.user.name || "User";
//   const role = user?.role || session.user.role || null;
//   const profileImageUrl = user?.profileImageUrl || null;

//   return (
//     <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
//       <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
        
//         {/* LEFT */}
//         <div className="min-w-0">
//           <h1 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
//             Dashboard
//           </h1>
//           <p className="hidden text-sm text-slate-500 sm:block">
//             Welcome back{name ? `, ${name}` : ""}.
//           </p>
//         </div>

//         {/* RIGHT */}
//         <div className="flex items-center gap-3 md:gap-4">

//           {/* ROLE BADGE */}
//           <span
//             className={`hidden rounded-full border px-3 py-1 text-xs font-semibold md:inline-flex ${getRoleStyles(role)}`}
//           >
//             {formatRole(role)}
//           </span>

//           {/* USER */}
//           <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            
//             <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/60 shadow-sm">
//               {profileImageUrl ? (
//                 <Image
//                   src={profileImageUrl}
//                   alt={name || "User"}
//                   fill
//                   className="object-cover"
//                   sizes="40px"
//                 />
//               ) : (
//                 <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
//                   {getInitial(name)}
//                 </div>
//               )}
//             </div>

//             <div className="hidden min-w-0 sm:block">
//               <p className="truncate text-sm font-semibold text-slate-900">
//                 {name}
//               </p>
//               <p className="truncate text-xs text-slate-500">
//                 {formatRole(role)}
//               </p>
//             </div>
//           </div>

//           {/* LOGOUT */}
//           <SignOutButton />

//         </div>
//       </div>
//     </header>
//   );
// }



import Image from "next/image";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import SignOutButton from "@/components/auth/SignOutButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export default async function DashboardHeader() {
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

  const name = user.name || session.user.name || "User";
  const role = user.role || session.user.role || null;
  const profileImageUrl = user.profileImageUrl || null;

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

        <div className="flex items-center gap-3 md:gap-4">
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
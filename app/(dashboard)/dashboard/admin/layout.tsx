


// // import Link from "next/link";
// // import { getServerSession } from "next-auth";
// // import { redirect } from "next/navigation";
// // import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// // const adminNavItems = [
// //   {
// //     label: "Overview",
// //     href: "/dashboard/admin",
// //     icon: "📊",
// //   },
// //   {
// //     label: "Support Inbox",
// //     href: "/dashboard/admin/support",
// //     icon: "📩",
// //   },
// // ];

// // export default async function AdminLayout({
// //   children,
// // }: {
// //   children: React.ReactNode;
// // }) {
// //   const session = await getServerSession(authOptions);

// //   if (!session || session.user.role !== "ADMIN") {
// //     redirect("/login");
// //   }

// //   return (
// //     <div className="min-h-screen bg-slate-50">
// //       <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
// //         {/* Desktop Sidebar */}
// //         <aside className="hidden w-72 shrink-0 lg:block">
// //           <div className="sticky top-24 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
// //             <div className="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 px-5 py-6 text-white">
// //               <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">
// //                 BuildUp Admin
// //               </p>
// //               <h2 className="mt-2 text-xl font-bold tracking-tight">
// //                 Control Panel
// //               </h2>
// //               <p className="mt-2 text-sm leading-6 text-slate-200">
// //                 Manage platform users, support activity, and key admin tools.
// //               </p>
// //             </div>

// //             <nav className="space-y-2 p-4">
// //               {adminNavItems.map((item) => (
// //                 <Link
// //                   key={item.href}
// //                   href={item.href}
// //                   className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-700"
// //                 >
// //                   <span className="text-base">{item.icon}</span>
// //                   <span>{item.label}</span>
// //                 </Link>
// //               ))}
// //             </nav>
// //           </div>
// //         </aside>

// //         {/* Main Content */}
// //         <div className="min-w-0 flex-1">
// //           {/* Mobile Top Nav */}
// //           <div className="mb-6 lg:hidden">
// //             <div className="overflow-x-auto">
// //               <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
// //                 {adminNavItems.map((item) => (
// //                   <Link
// //                     key={item.href}
// //                     href={item.href}
// //                     className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
// //                   >
// //                     <span>{item.icon}</span>
// //                     <span>{item.label}</span>
// //                   </Link>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>

// //           {children}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }




// // import Link from "next/link";
// // import { getServerSession } from "next-auth";
// // import { redirect } from "next/navigation";
// // import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// // const adminNavItems = [
// //   {
// //     label: "Overview",
// //     href: "/dashboard/admin",
// //     icon: "◫",
// //     description: "Platform summary",
// //   },
// //   {
// //     label: "Support Inbox",
// //     href: "/dashboard/admin/support",
// //     icon: "✉",
// //     description: "User requests",
// //   },
// // ];

// // export default async function AdminLayout({
// //   children,
// // }: {
// //   children: React.ReactNode;
// // }) {
// //   const session = await getServerSession(authOptions);

// //   if (!session || session.user.role !== "ADMIN") {
// //     redirect("/login");
// //   }

// //   return (
// //     <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.10),_transparent_28%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_45%,#f1f5f9_100%)]">
// //       <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
// //         {/* Desktop Sidebar */}
// //         <aside className="hidden w-[310px] shrink-0 xl:block">
// //           <div className="sticky top-24 overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
// //             <div className="relative overflow-hidden border-b border-slate-200/80 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_45%,#1d4ed8_100%)] px-6 py-7 text-white">
// //               <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
// //               <div className="absolute bottom-0 right-0 h-24 w-24 rounded-full bg-blue-300/10 blur-2xl" />

// //               <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-100/90">
// //                 BuildUp Admin
// //               </p>
// //               <h2 className="mt-3 text-2xl font-bold tracking-tight">
// //                 Control Center
// //               </h2>
// //               <p className="mt-2 text-sm leading-6 text-slate-200">
// //                 Executive-level visibility across users, support, and platform operations.
// //               </p>
// //             </div>

// //             <div className="p-4">
// //               <div className="mb-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
// //                 <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
// //                   Admin Access
// //                 </p>
// //                 <p className="mt-1 text-sm font-semibold text-slate-900">
// //                   {session.user.name || "Administrator"}
// //                 </p>
// //                 <p className="mt-1 text-xs text-slate-500">
// //                   Role: {session.user.role}
// //                 </p>
// //               </div>

// //               <nav className="space-y-2">
// //                 {adminNavItems.map((item) => (
// //                   <Link
// //                     key={item.href}
// //                     href={item.href}
// //                     className="group flex items-start gap-4 rounded-2xl border border-transparent px-4 py-4 transition hover:border-slate-200 hover:bg-slate-50"
// //                   >
// //                     <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 text-sm font-bold text-slate-700 shadow-sm transition group-hover:from-blue-50 group-hover:to-indigo-50 group-hover:text-blue-700">
// //                       {item.icon}
// //                     </div>

// //                     <div className="min-w-0">
// //                       <p className="text-sm font-semibold text-slate-900 transition group-hover:text-blue-700">
// //                         {item.label}
// //                       </p>
// //                       <p className="mt-1 text-xs leading-5 text-slate-500">
// //                         {item.description}
// //                       </p>
// //                     </div>
// //                   </Link>
// //                 ))}
// //               </nav>
// //             </div>
// //           </div>
// //         </aside>

// //         {/* Main */}
// //         <div className="min-w-0 flex-1">
// //           {/* Mobile Nav */}
// //           <div className="mb-6 xl:hidden">
// //             <div className="overflow-x-auto">
// //               <div className="flex gap-3 rounded-[24px] border border-slate-200/80 bg-white/90 p-3 shadow-sm backdrop-blur">
// //                 {adminNavItems.map((item) => (
// //                   <Link
// //                     key={item.href}
// //                     href={item.href}
// //                     className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
// //                   >
// //                     <span>{item.icon}</span>
// //                     <span>{item.label}</span>
// //                   </Link>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>

// //           {children}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }




// // import Link from "next/link";
// // import { getServerSession } from "next-auth";
// // import { redirect } from "next/navigation";
// // import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// // const adminNavItems = [
// //   {
// //     label: "Volunteers",
// //     href: "/dashboard/admin/volunteers",
// //     icon: "👥",
// //     description: "Manage learners",
// //   },
// //   {
// //     label: "Mentors",
// //     href: "/dashboard/admin/mentors",
// //     icon: "🧑‍🏫",
// //     description: "Manage approved mentors",
// //   },
// //   {
// //     label: "Organizations",
// //     href: "/dashboard/admin/organizations",
// //     icon: "🏢",
// //     description: "Manage organizations",
// //   },
// //   {
// //     label: "Support",
// //     href: "/dashboard/admin/support",
// //     icon: "📩",
// //     description: "Support inbox",
// //   },
// // ];

// // export default async function AdminLayout({
// //   children,
// // }: {
// //   children: React.ReactNode;
// // }) {
// //   const session = await getServerSession(authOptions);

// //   if (!session || session.user.role !== "ADMIN") {
// //     redirect("/login");
// //   }

// //   return (
// //     <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.10),_transparent_28%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_45%,#f1f5f9_100%)]">
// //       <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
// //         <aside className="hidden w-[310px] shrink-0 xl:block">
// //           <div className="sticky top-24 overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
// //             <div className="relative overflow-hidden border-b border-slate-200/80 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_45%,#1d4ed8_100%)] px-6 py-7 text-white">
// //               <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
// //               <div className="absolute bottom-0 right-0 h-24 w-24 rounded-full bg-blue-300/10 blur-2xl" />

// //               <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-100/90">
// //                 BuildUp Admin
// //               </p>
// //               <h2 className="mt-3 text-2xl font-bold tracking-tight">
// //                 Control Center
// //               </h2>
// //               <p className="mt-2 text-sm leading-6 text-slate-200">
// //                 Premium oversight across volunteers, mentors, organizations, and support.
// //               </p>
// //             </div>

// //             <div className="p-4">
// //               <div className="mb-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
// //                 <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
// //                   Admin Access
// //                 </p>
// //                 <p className="mt-1 text-sm font-semibold text-slate-900">
// //                   {session.user.name || "Administrator"}
// //                 </p>
// //                 <p className="mt-1 text-xs text-slate-500">
// //                   Role: {session.user.role}
// //                 </p>
// //               </div>

// //               <nav className="space-y-2">
// //                 {adminNavItems.map((item) => (
// //                   <Link
// //                     key={item.href}
// //                     href={item.href}
// //                     className="group flex items-start gap-4 rounded-2xl border border-transparent px-4 py-4 transition hover:border-slate-200 hover:bg-slate-50"
// //                   >
// //                     <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 text-sm font-bold text-slate-700 shadow-sm transition group-hover:from-blue-50 group-hover:to-indigo-50 group-hover:text-blue-700">
// //                       {item.icon}
// //                     </div>

// //                     <div className="min-w-0">
// //                       <p className="text-sm font-semibold text-slate-900 transition group-hover:text-blue-700">
// //                         {item.label}
// //                       </p>
// //                       <p className="mt-1 text-xs leading-5 text-slate-500">
// //                         {item.description}
// //                       </p>
// //                     </div>
// //                   </Link>
// //                 ))}
// //               </nav>
// //             </div>
// //           </div>
// //         </aside>

// //         <div className="min-w-0 flex-1">
// //           <div className="mb-6">
// //             <div className="overflow-x-auto">
// //               <div className="flex gap-3 rounded-[24px] border border-slate-200/80 bg-white/90 p-3 shadow-sm backdrop-blur">
// //                 {adminNavItems.map((item) => (
// //                   <Link
// //                     key={item.href}
// //                     href={item.href}
// //                     className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
// //                   >
// //                     <span>{item.icon}</span>
// //                     <span>{item.label}</span>
// //                   </Link>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>

// //           {children}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }



// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { ReactNode } from "react";

// /* ================= NAV ITEMS ================= */

// const navItems = [
//   {
//     label: "Volunteers",
//     href: "/dashboard/admin/volunteers",
//     icon: "👥",
//   },
//   {
//     label: "Mentors",
//     href: "/dashboard/admin/mentors",
//     icon: "🧑‍🏫",
//   },
//   {
//     label: "Organizations",
//     href: "/dashboard/admin/organizations",
//     icon: "🏢",
//   },
//   {
//     label: "Support",
//     href: "/dashboard/admin/support",
//     icon: "📩",
//   },
// ];

// /* ================= LAYOUT ================= */

// export default function AdminLayout({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const pathname = usePathname();

//   return (
//     <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.10),_transparent_28%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_45%,#f1f5f9_100%)]">
//       <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
//         {/* ================= SIDEBAR ================= */}
//         <aside className="hidden w-[300px] shrink-0 xl:block">
//           <div className="sticky top-24 overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
//             {/* HEADER */}
//             <div className="relative overflow-hidden border-b border-slate-200/80 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_45%,#1d4ed8_100%)] px-6 py-7 text-white">
//               <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

//               <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-100/90">
//                 BuildUp Admin
//               </p>

//               <h2 className="mt-3 text-2xl font-bold tracking-tight">
//                 Control Center
//               </h2>

//               <p className="mt-2 text-sm text-slate-200">
//                 Manage platform users, mentors, organizations, and support.
//               </p>
//             </div>

//             {/* NAV */}
//             <nav className="p-4 space-y-2">
//               {navItems.map((item) => {
//                 const isActive = pathname.startsWith(item.href);

//                 return (
//                   <Link
//                     key={item.href}
//                     href={item.href}
//                     className={`group flex items-center gap-4 rounded-2xl px-4 py-3 transition ${
//                       isActive
//                         ? "bg-blue-50 border border-blue-100"
//                         : "hover:bg-slate-50"
//                     }`}
//                   >
//                     <div
//                       className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${
//                         isActive
//                           ? "bg-blue-600 text-white"
//                           : "bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600"
//                       }`}
//                     >
//                       {item.icon}
//                     </div>

//                     <span
//                       className={`text-sm font-semibold ${
//                         isActive
//                           ? "text-blue-700"
//                           : "text-slate-700 group-hover:text-blue-700"
//                       }`}
//                     >
//                       {item.label}
//                     </span>
//                   </Link>
//                 );
//               })}
//             </nav>
//           </div>
//         </aside>

//         {/* ================= MAIN ================= */}
//         <div className="flex-1 min-w-0">
//           {/* ================= TOP STRIP ================= */}
//           <div className="mb-6">
//             <div className="overflow-x-auto">
//               <div className="flex gap-3 rounded-[24px] border border-slate-200 bg-white/90 p-3 shadow-sm">
//                 {navItems.map((item) => {
//                   const isActive = pathname.startsWith(item.href);

//                   return (
//                     <Link
//                       key={item.href}
//                       href={item.href}
//                       className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
//                         isActive
//                           ? "bg-blue-600 text-white shadow-sm"
//                           : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
//                       }`}
//                     >
//                       <span>{item.icon}</span>
//                       <span>{item.label}</span>
//                     </Link>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           {/* ================= CONTENT ================= */}
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }




// import Link from "next/link";
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// const navItems = [
//   {
//     label: "Volunteers",
//     href: "/dashboard/admin/volunteers",
//     icon: "👥",
//   },
//   {
//     label: "Mentors",
//     href: "/dashboard/admin/mentors",
//     icon: "🧑‍🏫",
//   },
//   {
//     label: "Organizations",
//     href: "/dashboard/admin/organizations",
//     icon: "🏢",
//   },
//   {
//     label: "Support",
//     href: "/dashboard/admin/support",
//     icon: "📩",
//   },
// ];

// export default async function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   const openSupportCount = await prisma.supportMessage.count({
//     where: { status: "OPEN" },
//   });

//   return (
//     <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.10),_transparent_28%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_45%,#f1f5f9_100%)]">
//       <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
//         {/* SIDEBAR */}
//         <aside className="hidden w-[300px] shrink-0 xl:block">
//           <div className="sticky top-24 overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
//             <div className="relative overflow-hidden border-b border-slate-200/80 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_45%,#1d4ed8_100%)] px-6 py-7 text-white">
//               <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />

//               <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-100/90">
//                 BuildUp Admin
//               </p>

//               <h2 className="mt-3 text-2xl font-bold tracking-tight">
//                 Control Center
//               </h2>

//               <p className="mt-2 text-sm text-slate-200">
//                 Manage platform users, mentors, organizations, and support.
//               </p>
//             </div>

//             <nav className="space-y-2 p-4">
//               {navItems.map((item) => {
//                 const isActive = item.href === "/dashboard/admin/volunteers"
//                   ? false
//                   : false;
//                 return (
//                   <AdminNavLink
//                     key={item.href}
//                     href={item.href}
//                     icon={item.icon}
//                     label={item.label}
//                     badge={item.label === "Support" ? openSupportCount : undefined}
//                   />
//                 );
//               })}
//             </nav>
//           </div>
//         </aside>

//         {/* MAIN */}
//         <div className="min-w-0 flex-1">
//           {/* TOP STRIP */}
//           <div className="mb-6">
//             <div className="overflow-x-auto">
//               <div className="flex gap-3 rounded-[24px] border border-slate-200 bg-white/90 p-3 shadow-sm">
//                 {navItems.map((item) => (
//                   <TopTabLink
//                     key={item.href}
//                     href={item.href}
//                     icon={item.icon}
//                     label={item.label}
//                     badge={item.label === "Support" ? openSupportCount : undefined}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>

//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }

// async function AdminNavLink({
//   href,
//   icon,
//   label,
//   badge,
// }: {
//   href: string;
//   icon: string;
//   label: string;
//   badge?: number;
// }) {
//   return (
//     <LinkWrapper href={href}>
//       {(isActive) => (
//         <div
//           className={`group flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition ${
//             isActive ? "border border-blue-100 bg-blue-50" : "hover:bg-slate-50"
//           }`}
//         >
//           <div className="flex items-center gap-4">
//             <div
//               className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${
//                 isActive
//                   ? "bg-blue-600 text-white"
//                   : "bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600"
//               }`}
//             >
//               {icon}
//             </div>

//             <span
//               className={`text-sm font-semibold ${
//                 isActive
//                   ? "text-blue-700"
//                   : "text-slate-700 group-hover:text-blue-700"
//               }`}
//             >
//               {label}
//             </span>
//           </div>

//           {typeof badge === "number" && badge > 0 ? (
//             <span
//               className={`inline-flex min-w-[1.75rem] items-center justify-center rounded-full px-2 py-1 text-xs font-bold ${
//                 isActive
//                   ? "bg-blue-600 text-white"
//                   : "bg-rose-100 text-rose-700"
//               }`}
//             >
//               {badge > 99 ? "99+" : badge}
//             </span>
//           ) : null}
//         </div>
//       )}
//     </LinkWrapper>
//   );
// }

// async function TopTabLink({
//   href,
//   icon,
//   label,
//   badge,
// }: {
//   href: string;
//   icon: string;
//   label: string;
//   badge?: number;
// }) {
//   return (
//     <LinkWrapper href={href}>
//       {(isActive) => (
//         <div
//           className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition ${
//             isActive
//               ? "bg-blue-600 text-white shadow-sm"
//               : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
//           }`}
//         >
//           <span>{icon}</span>
//           <span>{label}</span>

//           {typeof badge === "number" && badge > 0 ? (
//             <span
//               className={`inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
//                 isActive
//                   ? "bg-white/20 text-white"
//                   : "bg-rose-100 text-rose-700"
//               }`}
//             >
//               {badge > 99 ? "99+" : badge}
//             </span>
//           ) : null}
//         </div>
//       )}
//     </LinkWrapper>
//   );
// }

// import { usePathname } from "next/navigation";

// function LinkWrapper({
//   href,
//   children,
// }: {
//   href: string;
//   children: (isActive: boolean) => React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const isActive = pathname.startsWith(href);

//   return <Link href={href}>{children(isActive)}</Link>;
// }



// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import AdminShell from "./AdminShell";

// export default async function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   const openSupportCount = await prisma.supportMessage.count({
//     where: { status: "OPEN" },
//   });

//   return (
//     <AdminShell openSupportCount={openSupportCount}>
//       {children}
//     </AdminShell>
//   );
// }


import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import AdminShell from "./AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const [volunteersCount, mentorsCount, organizationsCount, openSupportCount] =
    await Promise.all([
      prisma.user.count({
        where: { role: "VOLUNTEER" },
      }),
      prisma.user.count({
        where: { role: "MENTOR" },
      }),
      prisma.user.count({
        where: { role: "ORGANIZATION" },
      }),
      prisma.supportMessage.count({
        where: { status: "OPEN" },
      }),
    ]);

  return (
    <AdminShell
      volunteersCount={volunteersCount}
      mentorsCount={mentorsCount}
      organizationsCount={organizationsCount}
      openSupportCount={openSupportCount}
    >
      {children}
    </AdminShell>
  );
}
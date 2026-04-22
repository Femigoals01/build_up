


// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// type NavItem = {
//   label: "Volunteers" | "Mentors" | "Organizations" | "Support";
//   href: string;
//   icon: string;
// };

// const navItems: NavItem[] = [
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

// type AdminShellProps = {
//   children: React.ReactNode;
//   volunteersCount: number;
//   mentorsCount: number;
//   organizationsCount: number;
//   openSupportCount: number;
// };

// export default function AdminShell({
//   children,
//   volunteersCount,
//   mentorsCount,
//   organizationsCount,
//   openSupportCount,
// }: AdminShellProps) {
//   const pathname = usePathname();

//   function getBadgeCount(label: NavItem["label"]) {
//     switch (label) {
//       case "Volunteers":
//         return volunteersCount;
//       case "Mentors":
//         return mentorsCount;
//       case "Organizations":
//         return organizationsCount;
//       case "Support":
//         return openSupportCount;
//       default:
//         return 0;
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.10),_transparent_28%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_45%,#f1f5f9_100%)]">
//       <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
//         {/* Sidebar */}
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
//                 const isActive = pathname.startsWith(item.href);
//                 const badge = getBadgeCount(item.label);

//                 return (
//                   <Link
//                     key={item.href}
//                     href={item.href}
//                     className={`group flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition ${
//                       isActive ? "border border-blue-100 bg-blue-50" : "hover:bg-slate-50"
//                     }`}
//                   >
//                     <div className="flex items-center gap-4">
//                       <div
//                         className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${
//                           isActive
//                             ? "bg-blue-600 text-white"
//                             : "bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600"
//                         }`}
//                       >
//                         {item.icon}
//                       </div>

//                       <span
//                         className={`text-sm font-semibold ${
//                           isActive
//                             ? "text-blue-700"
//                             : "text-slate-700 group-hover:text-blue-700"
//                         }`}
//                       >
//                         {item.label}
//                       </span>
//                     </div>

//                     {badge > 0 ? (
//                       <span
//                         className={`inline-flex min-w-[1.9rem] items-center justify-center rounded-full px-2 py-1 text-xs font-bold ${
//                           isActive
//                             ? "bg-blue-600 text-white"
//                             : item.label === "Support"
//                             ? "bg-rose-100 text-rose-700"
//                             : "bg-slate-100 text-slate-700"
//                         }`}
//                       >
//                         {badge > 99 ? "99+" : badge}
//                       </span>
//                     ) : null}
//                   </Link>
//                 );
//               })}
//             </nav>
//           </div>
//         </aside>

//         {/* Main */}
//         <div className="min-w-0 flex-1">
//           {/* Top strip */}
//           <div className="mb-6">
//             <div className="overflow-x-auto">
//               <div className="flex gap-3 rounded-[24px] border border-slate-200 bg-white/90 p-3 shadow-sm">
//                 {navItems.map((item) => {
//                   const isActive = pathname.startsWith(item.href);
//                   const badge = getBadgeCount(item.label);

//                   return (
//                     <Link
//                       key={item.href}
//                       href={item.href}
//                       className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition ${
//                         isActive
//                           ? "bg-blue-600 text-white shadow-sm"
//                           : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
//                       }`}
//                     >
//                       <span>{item.icon}</span>
//                       <span>{item.label}</span>

//                       {badge > 0 ? (
//                         <span
//                           className={`inline-flex min-w-[1.6rem] items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
//                             isActive
//                               ? "bg-white/20 text-white"
//                               : item.label === "Support"
//                               ? "bg-rose-100 text-rose-700"
//                               : "bg-slate-200 text-slate-700"
//                           }`}
//                         >
//                           {badge > 99 ? "99+" : badge}
//                         </span>
//                       ) : null}
//                     </Link>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>

//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }





// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import BuildUpLogo from "@/components/brand/BuildUpLogo";

// type NavItem = {
//   label: "Volunteers" | "Mentors" | "Organizations" | "Support";
//   href: string;
//   icon: string;
// };

// const navItems: NavItem[] = [
//   { label: "Volunteers", href: "/dashboard/admin/volunteers", icon: "👥" },
//   { label: "Mentors", href: "/dashboard/admin/mentors", icon: "🧑‍🏫" },
//   { label: "Organizations", href: "/dashboard/admin/organizations", icon: "🏢" },
//   { label: "Support", href: "/dashboard/admin/support", icon: "📩" },
// ];

// type AdminShellProps = {
//   children: React.ReactNode;
//   volunteersCount: number;
//   mentorsCount: number;
//   organizationsCount: number;
//   openSupportCount: number;
// };

// const pageMeta: Record<
//   string,
//   {
//     eyebrow: string;
//     title: string;
//     description: string;
//   }
// > = {
//   "/dashboard/admin/volunteers": {
//     eyebrow: "Volunteer Oversight",
//     title: "Volunteers",
//     description:
//       "Review the full volunteer directory, profile readiness, skills, and contact completeness from one premium admin workspace.",
//   },
//   "/dashboard/admin/mentors": {
//     eyebrow: "Mentor Management",
//     title: "Mentors",
//     description:
//       "Evaluate approved mentors and applications with clear visibility into expertise, readiness, and profile strength.",
//   },
//   "/dashboard/admin/organizations": {
//     eyebrow: "Organization Oversight",
//     title: "Organizations",
//     description:
//       "Monitor registered organizations, profile completeness, and project activity with an executive-level admin experience.",
//   },
//   "/dashboard/admin/support": {
//     eyebrow: "Support System",
//     title: "Support Inbox",
//     description:
//       "Track open issues, manage incoming requests, and maintain premium support operations across the platform.",
//   },
// };

// export default function AdminShell({
//   children,
//   volunteersCount,
//   mentorsCount,
//   organizationsCount,
//   openSupportCount,
// }: AdminShellProps) {
//   const pathname = usePathname();

//   function getBadgeCount(label: NavItem["label"]) {
//     switch (label) {
//       case "Volunteers":
//         return volunteersCount;
//       case "Mentors":
//         return mentorsCount;
//       case "Organizations":
//         return organizationsCount;
//       case "Support":
//         return openSupportCount;
//       default:
//         return 0;
//     }
//   }

//   const activeKey =
//     Object.keys(pageMeta).find((key) => pathname.startsWith(key)) ??
//     "/dashboard/admin/volunteers";

//   const activeMeta = pageMeta[activeKey];

//   return (
//     <div className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_26%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_45%,#f1f5f9_100%)]">
//       <div className="mx-auto flex h-full max-w-[1600px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
//         {/* Sidebar */}
//         <aside className="hidden w-[292px] shrink-0 xl:block">
//           <div className="flex h-full flex-col rounded-[30px] border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
//             {/* Slim mature header */}
//             <div className="border-b border-slate-200/80 px-5 py-5">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
//                   <BuildUpLogo
//                     href="/"
//                     showTagline={false}
//                     className="justify-center"
//                   />
//                 </div>

//                 <div>
//                   <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
//                     BuildUp Admin
//                   </p>
//                   <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
//                     Control Center
//                   </h2>
//                 </div>
//               </div>
//             </div>

//             <div className="px-4 pt-4">
//               <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
//                 Workspace
//               </p>
//             </div>

//             <nav className="flex-1 space-y-2 px-4 py-4">
//               {navItems.map((item) => {
//                 const isActive = pathname.startsWith(item.href);
//                 const badge = getBadgeCount(item.label);

//                 return (
//                   <Link
//                     key={item.href}
//                     href={item.href}
//                     className={`group flex items-center justify-between gap-4 rounded-2xl px-4 py-3.5 transition ${
//                       isActive
//                         ? "border border-blue-100 bg-blue-50/90 shadow-sm"
//                         : "border border-transparent hover:border-slate-200 hover:bg-slate-50"
//                     }`}
//                   >
//                     <div className="flex items-center gap-4">
//                       <div
//                         className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold transition ${
//                           isActive
//                             ? "bg-blue-600 text-white"
//                             : "bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600"
//                         }`}
//                       >
//                         {item.icon}
//                       </div>

//                       <span
//                         className={`text-sm font-semibold ${
//                           isActive
//                             ? "text-blue-700"
//                             : "text-slate-700 group-hover:text-blue-700"
//                         }`}
//                       >
//                         {item.label}
//                       </span>
//                     </div>

//                     {badge > 0 ? (
//                       <span
//                         className={`inline-flex min-w-[1.9rem] items-center justify-center rounded-full px-2 py-1 text-xs font-bold ${
//                           isActive
//                             ? "bg-blue-600 text-white"
//                             : item.label === "Support"
//                             ? "bg-rose-100 text-rose-700"
//                             : "bg-slate-100 text-slate-700"
//                         }`}
//                       >
//                         {badge > 99 ? "99+" : badge}
//                       </span>
//                     ) : null}
//                   </Link>
//                 );
//               })}
//             </nav>

//             <div className="border-t border-slate-200/80 px-5 py-4">
//               <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
//                 <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
//                   Current View
//                 </p>
//                 <p className="mt-2 text-sm font-semibold text-slate-900">
//                   {activeMeta.title}
//                 </p>
//                 <p className="mt-1 text-xs leading-5 text-slate-500">
//                   {activeMeta.eyebrow}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* Main */}
//         <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
//           {/* Mobile compact brand */}
//           <div className="mb-4 xl:hidden">
//             <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
//               <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
//                 <BuildUpLogo
//                   href="/"
//                   showTagline={false}
//                   className="justify-center"
//                 />
//               </div>
//               <div>
//                 <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
//                   BuildUp Admin
//                 </p>
//                 <p className="text-sm font-semibold text-slate-900">
//                   {activeMeta.title}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Sticky top strip + sticky dynamic header */}
//           <div className="sticky top-0 z-30 space-y-4 bg-[linear-gradient(180deg,rgba(248,251,255,0.96)_0%,rgba(248,250,252,0.92)_70%,rgba(248,250,252,0)_100%)] pb-3 backdrop-blur">
//             <div className="overflow-x-auto">
//               <div className="flex gap-3 rounded-[24px] border border-slate-200 bg-white/90 p-3 shadow-sm">
//                 {navItems.map((item) => {
//                   const isActive = pathname.startsWith(item.href);
//                   const badge = getBadgeCount(item.label);

//                   return (
//                     <Link
//                       key={item.href}
//                       href={item.href}
//                       className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition ${
//                         isActive
//                           ? "bg-blue-600 text-white shadow-sm"
//                           : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
//                       }`}
//                     >
//                       <span>{item.icon}</span>
//                       <span>{item.label}</span>

//                       {badge > 0 ? (
//                         <span
//                           className={`inline-flex min-w-[1.6rem] items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
//                             isActive
//                               ? "bg-white/20 text-white"
//                               : item.label === "Support"
//                               ? "bg-rose-100 text-rose-700"
//                               : "bg-slate-200 text-slate-700"
//                           }`}
//                         >
//                           {badge > 99 ? "99+" : badge}
//                         </span>
//                       ) : null}
//                     </Link>
//                   );
//                 })}
//               </div>
//             </div>

//             <section className="rounded-[28px] border border-slate-200/80 bg-white/90 px-6 py-6 shadow-[0_10px_35px_rgba(15,23,42,0.06)] backdrop-blur sm:px-8">
//               <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
//                 {activeMeta.eyebrow}
//               </p>
//               <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
//                 {activeMeta.title}
//               </h1>
//               <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
//                 {activeMeta.description}
//               </p>
//             </section>
//           </div>

//           {/* Scrollable content area only */}
//           <div className="min-h-0 flex-1 overflow-y-auto pr-1">
//             {children}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import BuildUpLogo from "@/components/brand/BuildUpLogo";

// type NavItem = {
//   label: "Volunteers" | "Mentors" | "Organizations" | "Support";
//   href: string;
//   icon: string;
// };

// const navItems: NavItem[] = [
//   { label: "Volunteers", href: "/dashboard/admin/volunteers", icon: "👥" },
//   { label: "Mentors", href: "/dashboard/admin/mentors", icon: "🧑‍🏫" },
//   { label: "Organizations", href: "/dashboard/admin/organizations", icon: "🏢" },
//   { label: "Support", href: "/dashboard/admin/support", icon: "📩" },
// ];

// type AdminShellProps = {
//   children: React.ReactNode;
//   volunteersCount: number;
//   mentorsCount: number;
//   organizationsCount: number;
//   openSupportCount: number;
// };

// const pageMeta: Record<
//   string,
//   {
//     eyebrow: string;
//     title: string;
//     description: string;
//   }
// > = {
//   "/dashboard/admin/volunteers": {
//     eyebrow: "Volunteer Oversight",
//     title: "Volunteers",
//     description:
//       "Review the full volunteer directory, profile readiness, skills, and contact completeness from one premium admin workspace.",
//   },
//   "/dashboard/admin/mentors": {
//     eyebrow: "Mentor Management",
//     title: "Mentors",
//     description:
//       "Evaluate approved mentors and applications with clear visibility into expertise, readiness, and profile strength.",
//   },
//   "/dashboard/admin/organizations": {
//     eyebrow: "Organization Oversight",
//     title: "Organizations",
//     description:
//       "Monitor registered organizations, profile completeness, and project activity with an executive-level admin experience.",
//   },
//   "/dashboard/admin/support": {
//     eyebrow: "Support System",
//     title: "Support Inbox",
//     description:
//       "Track open issues, manage incoming requests, and maintain premium support operations across the platform.",
//   },
// };

// export default function AdminShell({
//   children,
//   volunteersCount,
//   mentorsCount,
//   organizationsCount,
//   openSupportCount,
// }: AdminShellProps) {
//   const pathname = usePathname();

//   function getBadgeCount(label: NavItem["label"]) {
//     switch (label) {
//       case "Volunteers":
//         return volunteersCount;
//       case "Mentors":
//         return mentorsCount;
//       case "Organizations":
//         return organizationsCount;
//       case "Support":
//         return openSupportCount;
//       default:
//         return 0;
//     }
//   }

//   const activeKey =
//     Object.keys(pageMeta).find((key) => pathname.startsWith(key)) ??
//     "/dashboard/admin/volunteers";

//   const activeMeta = pageMeta[activeKey];

//   return (
//     <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_26%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_45%,#f1f5f9_100%)]">
//       <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
//         <aside className="hidden w-[292px] shrink-0 xl:block">
//           <div className="sticky top-24 flex flex-col rounded-[30px] border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
//             <div className="border-b border-slate-200/80 px-5 py-5">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
//                   <BuildUpLogo
//                     href="/"
//                     showTagline={false}
//                     className="justify-center"
//                   />
//                 </div>

//                 <div>
//                   <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
//                     BuildUp Admin
//                   </p>
//                   <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
//                     Control Center
//                   </h2>
//                 </div>
//               </div>
//             </div>

//             <div className="px-4 pt-4">
//               <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
//                 Workspace
//               </p>
//             </div>

//             <nav className="flex-1 space-y-2 px-4 py-4">
//               {navItems.map((item) => {
//                 const isActive = pathname.startsWith(item.href);
//                 const badge = getBadgeCount(item.label);

//                 return (
//                   <Link
//                     key={item.href}
//                     href={item.href}
//                     className={`group flex items-center justify-between gap-4 rounded-2xl px-4 py-3.5 transition ${
//                       isActive
//                         ? "border border-blue-100 bg-blue-50/90 shadow-sm"
//                         : "border border-transparent hover:border-slate-200 hover:bg-slate-50"
//                     }`}
//                   >
//                     <div className="flex items-center gap-4">
//                       <div
//                         className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold transition ${
//                           isActive
//                             ? "bg-blue-600 text-white"
//                             : "bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600"
//                         }`}
//                       >
//                         {item.icon}
//                       </div>

//                       <span
//                         className={`text-sm font-semibold ${
//                           isActive
//                             ? "text-blue-700"
//                             : "text-slate-700 group-hover:text-blue-700"
//                         }`}
//                       >
//                         {item.label}
//                       </span>
//                     </div>

//                     {badge > 0 ? (
//                       <span
//                         className={`inline-flex min-w-[1.9rem] items-center justify-center rounded-full px-2 py-1 text-xs font-bold ${
//                           isActive
//                             ? "bg-blue-600 text-white"
//                             : item.label === "Support"
//                             ? "bg-rose-100 text-rose-700"
//                             : "bg-slate-100 text-slate-700"
//                         }`}
//                       >
//                         {badge > 99 ? "99+" : badge}
//                       </span>
//                     ) : null}
//                   </Link>
//                 );
//               })}
//             </nav>

//             <div className="border-t border-slate-200/80 px-5 py-4">
//               <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
//                 <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
//                   Current View
//                 </p>
//                 <p className="mt-2 text-sm font-semibold text-slate-900">
//                   {activeMeta.title}
//                 </p>
//                 <p className="mt-1 text-xs leading-5 text-slate-500">
//                   {activeMeta.eyebrow}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </aside>

//         <div className="flex min-w-0 flex-1 flex-col">
//           <div className="mb-4 xl:hidden">
//             <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
//               <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
//                 <BuildUpLogo
//                   href="/"
//                   showTagline={false}
//                   className="justify-center"
//                 />
//               </div>
//               <div>
//                 <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
//                   BuildUp Admin
//                 </p>
//                 <p className="text-sm font-semibold text-slate-900">
//                   {activeMeta.title}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="sticky top-20 z-30 mb-6 space-y-4 bg-[linear-gradient(180deg,rgba(248,251,255,0.96)_0%,rgba(248,250,252,0.92)_70%,rgba(248,250,252,0)_100%)] pb-3 backdrop-blur">
//             <div className="overflow-x-auto">
//               <div className="flex gap-3 rounded-[24px] border border-slate-200 bg-white/90 p-3 shadow-sm">
//                 {navItems.map((item) => {
//                   const isActive = pathname.startsWith(item.href);
//                   const badge = getBadgeCount(item.label);

//                   return (
//                     <Link
//                       key={item.href}
//                       href={item.href}
//                       className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition ${
//                         isActive
//                           ? "bg-blue-600 text-white shadow-sm"
//                           : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
//                       }`}
//                     >
//                       <span>{item.icon}</span>
//                       <span>{item.label}</span>

//                       {badge > 0 ? (
//                         <span
//                           className={`inline-flex min-w-[1.6rem] items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
//                             isActive
//                               ? "bg-white/20 text-white"
//                               : item.label === "Support"
//                               ? "bg-rose-100 text-rose-700"
//                               : "bg-slate-200 text-slate-700"
//                           }`}
//                         >
//                           {badge > 99 ? "99+" : badge}
//                         </span>
//                       ) : null}
//                     </Link>
//                   );
//                 })}
//               </div>
//             </div>

//             <section className="rounded-[28px] border border-slate-200/80 bg-white/90 px-6 py-6 shadow-[0_10px_35px_rgba(15,23,42,0.06)] backdrop-blur sm:px-8">
//               <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
//                 {activeMeta.eyebrow}
//               </p>
//               <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
//                 {activeMeta.title}
//               </h1>
//               <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
//                 {activeMeta.description}
//               </p>
//             </section>
//           </div>

//           <div className="flex-1">
//             {children}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import BuildUpLogo from "@/components/brand/BuildUpLogo";

// type NavItem = {
//   label: "Volunteers" | "Mentors" | "Organizations" | "Support";
//   href: string;
//   icon: string;
// };

// const navItems: NavItem[] = [
//   { label: "Volunteers", href: "/dashboard/admin/volunteers", icon: "👥" },
//   { label: "Mentors", href: "/dashboard/admin/mentors", icon: "🧑‍🏫" },
//   { label: "Organizations", href: "/dashboard/admin/organizations", icon: "🏢" },
//   { label: "Support", href: "/dashboard/admin/support", icon: "📩" },
// ];

// type AdminShellProps = {
//   children: React.ReactNode;
//   volunteersCount: number;
//   mentorsCount: number;
//   organizationsCount: number;
//   openSupportCount: number;
// };

// const pageMeta: Record<
//   string,
//   {
//     eyebrow: string;
//     title: string;
//     description: string;
//   }
// > = {
//   "/dashboard/admin/volunteers": {
//     eyebrow: "Volunteer Oversight",
//     title: "Volunteers",
//     description:
//       "Review the full volunteer directory, profile readiness, skills, and contact completeness from one premium admin workspace.",
//   },
//   "/dashboard/admin/mentors": {
//     eyebrow: "Mentor Management",
//     title: "Mentors",
//     description:
//       "Evaluate approved mentors and applications with clear visibility into expertise, readiness, and profile strength.",
//   },
//   "/dashboard/admin/organizations": {
//     eyebrow: "Organization Oversight",
//     title: "Organizations",
//     description:
//       "Monitor registered organizations, profile completeness, and project activity with an executive-level admin experience.",
//   },
//   "/dashboard/admin/support": {
//     eyebrow: "Support System",
//     title: "Support Inbox",
//     description:
//       "Track open issues, manage incoming requests, and maintain premium support operations across the platform.",
//   },
// };

// export default function AdminShell({
//   children,
//   volunteersCount,
//   mentorsCount,
//   organizationsCount,
//   openSupportCount,
// }: AdminShellProps) {
//   const pathname = usePathname();

//   function getBadgeCount(label: NavItem["label"]) {
//     switch (label) {
//       case "Volunteers":
//         return volunteersCount;
//       case "Mentors":
//         return mentorsCount;
//       case "Organizations":
//         return organizationsCount;
//       case "Support":
//         return openSupportCount;
//       default:
//         return 0;
//     }
//   }

//   const activeKey =
//     Object.keys(pageMeta).find((key) => pathname.startsWith(key)) ??
//     "/dashboard/admin/volunteers";

//   const activeMeta = pageMeta[activeKey];

//   return (
//     <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_26%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_45%,#f1f5f9_100%)]">
//       <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
//         <aside className="hidden w-[292px] shrink-0 xl:block">
//           <div className="sticky top-24 flex flex-col rounded-[30px] border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
//             <div className="border-b border-slate-200/80 px-5 py-5">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
//                   <BuildUpLogo
//                     href="/"
//                     showTagline={false}
//                     className="justify-center"
//                   />
//                 </div>

//                 <div>
//                   <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
//                     BuildUp Admin
//                   </p>
//                   <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
//                     Control Center
//                   </h2>
//                 </div>
//               </div>
//             </div>

//             <div className="px-4 pt-4">
//               <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
//                 Workspace
//               </p>
//             </div>

//             <nav className="flex-1 space-y-2 px-4 py-4">
//               {navItems.map((item) => {
//                 const isActive = pathname.startsWith(item.href);
//                 const badge = getBadgeCount(item.label);

//                 return (
//                   <Link
//                     key={item.href}
//                     href={item.href}
//                     className={`group flex items-center justify-between gap-4 rounded-2xl px-4 py-3.5 transition ${
//                       isActive
//                         ? "border border-blue-100 bg-blue-50/90 shadow-sm"
//                         : "border border-transparent hover:border-slate-200 hover:bg-slate-50"
//                     }`}
//                   >
//                     <div className="flex items-center gap-4">
//                       <div
//                         className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold transition ${
//                           isActive
//                             ? "bg-blue-600 text-white"
//                             : "bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600"
//                         }`}
//                       >
//                         {item.icon}
//                       </div>

//                       <span
//                         className={`text-sm font-semibold ${
//                           isActive
//                             ? "text-blue-700"
//                             : "text-slate-700 group-hover:text-blue-700"
//                         }`}
//                       >
//                         {item.label}
//                       </span>
//                     </div>

//                     {badge > 0 ? (
//                       <span
//                         className={`inline-flex min-w-[1.9rem] items-center justify-center rounded-full px-2 py-1 text-xs font-bold ${
//                           isActive
//                             ? "bg-blue-600 text-white"
//                             : item.label === "Support"
//                             ? "bg-rose-100 text-rose-700"
//                             : "bg-slate-100 text-slate-700"
//                         }`}
//                       >
//                         {badge > 99 ? "99+" : badge}
//                       </span>
//                     ) : null}
//                   </Link>
//                 );
//               })}
//             </nav>

//             <div className="border-t border-slate-200/80 px-5 py-4">
//               <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
//                 <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
//                   Current View
//                 </p>
//                 <p className="mt-2 text-sm font-semibold text-slate-900">
//                   {activeMeta.title}
//                 </p>
//                 <p className="mt-1 text-xs leading-5 text-slate-500">
//                   {activeMeta.eyebrow}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </aside>

//         <div className="flex min-w-0 flex-1 flex-col">
//           <div className="mb-4 xl:hidden">


//             <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
//               <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
//                 <BuildUpLogo
//                   href="/"
//                   showTagline={false}
//                   className="justify-center"
//                 />
//               </div>
//               <div>
//                 <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
//                   BuildUp Admin
//                 </p>
//                 <p className="text-sm font-semibold text-slate-900">
//                   {activeMeta.title}
//                 </p>
//               </div>
//             </div>


            
//           </div>

//           <div className="sticky top-20 z-30 mb-6 rounded-[28px] border border-slate-200 bg-white/90 px-4 py-4 shadow-[0_10px_35px_rgba(15,23,42,0.06)] backdrop-blur sm:px-5">
//             <div className="flex flex-col gap-4">
//               <div className="overflow-x-auto">
//                 <div className="flex gap-3">
//                   {navItems.map((item) => {
//                     const isActive = pathname.startsWith(item.href);
//                     const badge = getBadgeCount(item.label);

//                     return (
//                       <Link
//                         key={item.href}
//                         href={item.href}
//                         className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition ${
//                           isActive
//                             ? "bg-blue-600 text-white shadow-sm"
//                             : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
//                         }`}
//                       >
//                         <span>{item.icon}</span>
//                         <span>{item.label}</span>

//                         {badge > 0 ? (
//                           <span
//                             className={`inline-flex min-w-[1.6rem] items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
//                               isActive
//                                 ? "bg-white/20 text-white"
//                                 : item.label === "Support"
//                                 ? "bg-rose-100 text-rose-700"
//                                 : "bg-slate-200 text-slate-700"
//                             }`}
//                           >
//                             {badge > 99 ? "99+" : badge}
//                           </span>
//                         ) : null}
//                       </Link>
//                     );
//                   })}
//                 </div>
//               </div>

//               <div className="border-t border-slate-200 pt-4">
//                 <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
//                   {activeMeta.eyebrow}
//                 </p>
//                 <div className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
//                   <div>
//                     <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
//                       {activeMeta.title}
//                     </h1>
//                     <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
//                       {activeMeta.description}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex-1">
//             {children}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BuildUpLogo from "@/components/brand/BuildUpLogo";

type NavItem = {
  label: "Volunteers" | "Mentors" | "Organizations" | "Support";
  href: string;
  icon: string;
};

const navItems: NavItem[] = [
  { label: "Volunteers", href: "/dashboard/admin/volunteers", icon: "👥" },
  { label: "Mentors", href: "/dashboard/admin/mentors", icon: "🧑‍🏫" },
  { label: "Organizations", href: "/dashboard/admin/organizations", icon: "🏢" },
  { label: "Support", href: "/dashboard/admin/support", icon: "📩" },
];

type AdminShellProps = {
  children: React.ReactNode;
  volunteersCount: number;
  mentorsCount: number;
  organizationsCount: number;
  openSupportCount: number;
};

const pageMeta: Record<
  string,
  {
    eyebrow: string;
    title: string;
    description: string;
  }
> = {
  "/dashboard/admin/volunteers": {
    eyebrow: "Volunteer Oversight",
    title: "Volunteers",
    description:
      "Review the full volunteer directory, profile readiness, skills, and contact completeness from one premium admin workspace.",
  },
  "/dashboard/admin/mentors": {
    eyebrow: "Mentor Management",
    title: "Mentors",
    description:
      "Evaluate approved mentors and applications with clear visibility into expertise, readiness, and profile strength.",
  },
  "/dashboard/admin/organizations": {
    eyebrow: "Organization Oversight",
    title: "Organizations",
    description:
      "Monitor registered organizations, profile completeness, and project activity with an executive-level admin experience.",
  },
  "/dashboard/admin/support": {
    eyebrow: "Support System",
    title: "Support Inbox",
    description:
      "Track open issues, manage incoming requests, and maintain premium support operations across the platform.",
  },
};

export default function AdminShell({
  children,
  volunteersCount,
  mentorsCount,
  organizationsCount,
  openSupportCount,
}: AdminShellProps) {
  const pathname = usePathname();

  function getBadgeCount(label: NavItem["label"]) {
    switch (label) {
      case "Volunteers":
        return volunteersCount;
      case "Mentors":
        return mentorsCount;
      case "Organizations":
        return organizationsCount;
      case "Support":
        return openSupportCount;
      default:
        return 0;
    }
  }

  const activeKey =
    Object.keys(pageMeta).find((key) => pathname.startsWith(key)) ??
    "/dashboard/admin/volunteers";

  const activeMeta = pageMeta[activeKey];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_26%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_45%,#f1f5f9_100%)]">
      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="hidden w-[292px] shrink-0 xl:block">
          <div className="sticky top-24 flex flex-col rounded-[30px] border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="border-b border-slate-200/80 px-5 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-[0_6px_20px_rgba(15,23,42,0.08)]">
                  <div className="flex h-8 w-8 items-center justify-center">
                    <BuildUpLogo
                      href="/"
                      showTagline={false}
                      className="justify-center"
                      imageClassName="h-8 w-8 object-contain"
                    />
                  </div>
                </div>

                <div className="min-w-0 leading-tight">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    BuildUp Admin
                  </p>
                  <h2 className="text-base font-bold text-slate-900">
                    Control Center
                  </h2>
                </div>
              </div>
            </div>

            <div className="px-4 pt-4">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Workspace
              </p>
            </div>

            <nav className="flex-1 space-y-2 px-4 py-4">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const badge = getBadgeCount(item.label);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center justify-between gap-4 rounded-2xl px-4 py-3.5 transition ${
                      isActive
                        ? "border border-blue-100 bg-blue-50/90 shadow-sm"
                        : "border border-transparent hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold transition ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600"
                        }`}
                      >
                        {item.icon}
                      </div>

                      <span
                        className={`text-sm font-semibold ${
                          isActive
                            ? "text-blue-700"
                            : "text-slate-700 group-hover:text-blue-700"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>

                    {badge > 0 ? (
                      <span
                        className={`inline-flex min-w-[1.9rem] items-center justify-center rounded-full px-2 py-1 text-xs font-bold ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : item.label === "Support"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {badge > 99 ? "99+" : badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-slate-200/80 px-5 py-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Current View
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {activeMeta.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {activeMeta.eyebrow}
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="mb-4 xl:hidden">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm">
                <div className="flex h-7 w-7 items-center justify-center">
                  <BuildUpLogo
                    href="/"
                    showTagline={false}
                    className="justify-center"
                    imageClassName="h-7 w-7 object-contain"
                  />
                </div>
              </div>

              <div className="min-w-0 leading-tight">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  BuildUp Admin
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {activeMeta.title}
                </p>
              </div>
            </div>
          </div>

          <div className="sticky top-20 z-30 mb-6 rounded-[28px] border border-slate-200 bg-white/90 px-4 py-4 shadow-[0_10px_35px_rgba(15,23,42,0.06)] backdrop-blur sm:px-5">
            <div className="flex flex-col gap-4">
              <div className="overflow-x-auto">
                <div className="flex gap-3">
                  {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const badge = getBadgeCount(item.label);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition ${
                          isActive
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>

                        {badge > 0 ? (
                          <span
                            className={`inline-flex min-w-[1.6rem] items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
                              isActive
                                ? "bg-white/20 text-white"
                                : item.label === "Support"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {badge > 99 ? "99+" : badge}
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  {activeMeta.eyebrow}
                </p>
                <div className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      {activeMeta.title}
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                      {activeMeta.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
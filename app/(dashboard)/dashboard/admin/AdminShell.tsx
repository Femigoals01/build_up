


// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import BuildUpLogo from "@/components/brand/BuildUpLogo";

// type NavItem = {
//   label:
//     | "Volunteers"
//     | "Mentors"
//     | "Organizations"
//     | "Support"
//     | "Withdrawals";
//   href: string;
//   icon: string;
// };

// const navItems: NavItem[] = [
//   { label: "Volunteers", href: "/dashboard/admin/volunteers", icon: "👥" },
//   { label: "Mentors", href: "/dashboard/admin/mentors", icon: "🧑‍🏫" },
//   { label: "Organizations", href: "/dashboard/admin/organizations", icon: "🏢" },
//   { label: "Support", href: "/dashboard/admin/support", icon: "📩" },
//   { label: "Withdrawals", href: "/dashboard/admin/withdrawals", icon: "💸" },
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
//   "/dashboard/admin/withdrawals": {
//     eyebrow: "Payout System",
//     title: "Withdrawals",
//     description:
//       "Manage volunteer payout requests, process Paystack transfers, and monitor withdrawal operations across BuildUp.",
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
//       case "Withdrawals":
//         return 0;
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
     
//      <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
     
    

//         <div className="flex min-w-0 flex-1 flex-col">
//           <div className="mb-4 xl:hidden">
//             <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
//               <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm">
//                 <div className="flex h-7 w-7 items-center justify-center">
//                   <BuildUpLogo
//                     href="/"
//                     showTagline={false}
//                     className="justify-center"
//                     imageClassName="h-7 w-7 object-contain"
//                   />
//                 </div>
//               </div>

//               <div className="min-w-0 leading-tight">
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
//                         className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
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

//           <div className="flex-1">{children}</div>
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
  label:
    | "Volunteers"
    | "Mentors"
    | "Organizations"
    | "Support"
    | "Withdrawals";
  href: string;
  icon: string;
};

const navItems: NavItem[] = [
  {
    label: "Volunteers",
    href: "/dashboard/admin/volunteers",
    icon: "👥",
  },
  {
    label: "Mentors",
    href: "/dashboard/admin/mentors",
    icon: "🧑‍🏫",
  },
  {
    label: "Organizations",
    href: "/dashboard/admin/organizations",
    icon: "🏢",
  },
  {
    label: "Support",
    href: "/dashboard/admin/support",
    icon: "📩",
  },
  {
    label: "Withdrawals",
    href: "/dashboard/admin/withdrawals",
    icon: "💸",
  },
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

  "/dashboard/admin/withdrawals": {
    eyebrow: "Payout System",
    title: "Withdrawals",
    description:
      "Manage payout requests, process Paystack transfers, and monitor withdrawal operations across BuildUp.",
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

      case "Withdrawals":
        return 0;

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
      <div className="mx-auto max-w-[1600px] px-4 pb-4 pt-0 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 flex-col">
          {/* MOBILE HEADER */}
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

          {/* STICKY ADMIN BAR */}
          <div className="sticky top-0 z-50 mb-4">
            <div className="rounded-[28px] border border-white/60 bg-white/80 px-4 py-3 shadow-[0_18px_60px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:px-5">
              <div className="flex flex-col gap-4">
                {/* NAVIGATION */}
                <div className="overflow-x-auto">
                  <div className="flex items-center gap-3">
                    {navItems.map((item) => {
                      const isActive = pathname.startsWith(item.href);
                      const badge = getBadgeCount(item.label);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`inline-flex items-center gap-2 whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                            isActive
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                              : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                          }`}
                        >
                          <span>{item.icon}</span>

                          <span>{item.label}</span>

                          {badge > 0 ? (
                            <span
                              className={`inline-flex min-w-[22px] items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
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

                {/* PAGE META */}
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
          </div>

          {/* PAGE CONTENT */}
          <div className="flex-1 pt-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
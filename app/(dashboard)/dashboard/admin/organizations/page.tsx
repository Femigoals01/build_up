// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// type Organization = {
//   id: string;
//   name: string;
//   email: string;
//   country: string | null;
//   countryCode: string | null;
//   mobileNumber: string | null;
//   bio: string | null;
//   createdAt: Date;
//   _count: {
//     projects: number;
//   };
// };

// function formatPhone(countryCode?: string | null, mobileNumber?: string | null) {
//   if (!countryCode && !mobileNumber) return "Not added";
//   if (countryCode && mobileNumber) return `${countryCode} ${mobileNumber}`;
//   return mobileNumber || countryCode || "Not added";
// }

// export default async function AdminOrganizationsPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   const organizations: Organization[] = await prisma.user.findMany({
//     where: { role: "ORGANIZATION" },
//     orderBy: { createdAt: "desc" },
//     take: 24,
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       country: true,
//       countryCode: true,
//       mobileNumber: true,
//       bio: true,
//       createdAt: true,
//       _count: {
//         select: {
//           projects: true,
//         },
//       },
//     },
//   });

//   const organizationsCount = await prisma.user.count({
//     where: { role: "ORGANIZATION" },
//   });

//   const organizationsWithCountry = await prisma.user.count({
//     where: {
//       role: "ORGANIZATION",
//       country: { not: null },
//     },
//   });

//   const organizationsWithPhone = await prisma.user.count({
//     where: {
//       role: "ORGANIZATION",
//       mobileNumber: { not: null },
//     },
//   });

//   const organizationsWithProjects = await prisma.user.count({
//     where: {
//       role: "ORGANIZATION",
//       projects: {
//         some: {},
//       },
//     },
//   });

//   return (
//     <main className="space-y-8">
//       <section className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
//         <div className="bg-[linear-gradient(135deg,#0f172a_0%,#312e81_35%,#2563eb_100%)] px-6 py-8 text-white sm:px-8 lg:px-10">
//           <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-100/90">
//             Organization Oversight
//           </p>
//           <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
//             Organizations
//           </h1>
//           <p className="mt-3 max-w-2xl text-sm leading-7 text-indigo-50/90 sm:text-base">
//             Monitor registered organizations, profile completeness, and project activity
//             with a clean executive-level admin experience.
//           </p>
//         </div>

//         <div className="grid gap-4 px-6 py-6 sm:px-8 md:grid-cols-2 xl:grid-cols-4">
//           <MetricCard
//             title="Total Organizations"
//             value={organizationsCount}
//             subtitle="Registered organizations"
//             tone="violet"
//           />
//           <MetricCard
//             title="With Country"
//             value={organizationsWithCountry}
//             subtitle="Profile coverage"
//             tone="blue"
//           />
//           <MetricCard
//             title="With Phone"
//             value={organizationsWithPhone}
//             subtitle="Direct contact coverage"
//             tone="amber"
//           />
//           <MetricCard
//             title="With Projects"
//             value={organizationsWithProjects}
//             subtitle="Active project owners"
//             tone="emerald"
//           />
//         </div>
//       </section>

//       <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
//         <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
//               Organization Directory
//             </p>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//               Registered Organizations
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Premium overview of organizations, contacts, and publishing activity.
//             </p>
//           </div>

//           <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
//             Showing {organizations.length} organization{organizations.length === 1 ? "" : "s"}
//           </div>
//         </div>

//         {organizations.length === 0 ? (
//           <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//             <p className="text-slate-600">No organizations found yet.</p>
//           </div>
//         ) : (
//           <div className="overflow-hidden rounded-[24px] border border-slate-200">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-slate-200">
//                 <thead className="bg-slate-50/80">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Organization
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Country
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Phone
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Projects
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Overview
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Joined
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-200 bg-white">
//                   {organizations.map((organization) => (
//                     <tr key={organization.id} className="hover:bg-slate-50/70">
//                       <td className="px-4 py-4 align-top">
//                         <div>
//                           <p className="font-semibold text-slate-900">
//                             {organization.name}
//                           </p>
//                           <p className="mt-1 text-sm text-slate-500">
//                             {organization.email}
//                           </p>
//                         </div>
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {organization.country || "Not added"}
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {formatPhone(
//                           organization.countryCode,
//                           organization.mobileNumber
//                         )}
//                       </td>

//                       <td className="px-4 py-4 align-top">
//                         <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
//                           {organization._count.projects} project
//                           {organization._count.projects === 1 ? "" : "s"}
//                         </span>
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         <div className="max-w-[260px]">
//                           {organization.bio
//                             ? organization.bio.length > 90
//                               ? `${organization.bio.slice(0, 90)}...`
//                               : organization.bio
//                             : "No organization overview added"}
//                         </div>
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-500">
//                         {new Date(organization.createdAt).toLocaleDateString("en-GB", {
//                           day: "numeric",
//                           month: "short",
//                           year: "numeric",
//                         })}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }

// function MetricCard({
//   title,
//   value,
//   subtitle,
//   tone,
// }: {
//   title: string;
//   value: number;
//   subtitle: string;
//   tone: "violet" | "blue" | "amber" | "emerald";
// }) {
//   const toneMap = {
//     violet: "from-violet-50 to-white border-violet-100",
//     blue: "from-blue-50 to-white border-blue-100",
//     amber: "from-amber-50 to-white border-amber-100",
//     emerald: "from-emerald-50 to-white border-emerald-100",
//   };

//   return (
//     <div
//       className={`rounded-2xl border bg-gradient-to-br p-5 shadow-sm ${toneMap[tone]}`}
//     >
//       <p className="text-sm font-medium text-slate-500">{title}</p>
//       <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//         {value}
//       </p>
//       <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
//         {subtitle}
//       </p>
//     </div>
//   );
// }




// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// type Organization = {
//   id: string;
//   name: string;
//   email: string;
//   country: string | null;
//   countryCode: string | null;
//   mobileNumber: string | null;
//   bio: string | null;
//   createdAt: Date;
//   _count: {
//     projects: number;
//   };
// };

// function formatPhone(countryCode?: string | null, mobileNumber?: string | null) {
//   if (!countryCode && !mobileNumber) return "Not added";
//   if (countryCode && mobileNumber) return `${countryCode} ${mobileNumber}`;
//   return mobileNumber || countryCode || "Not added";
// }

// export default async function AdminOrganizationsPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   const organizations: Organization[] = await prisma.user.findMany({
//     where: { role: "ORGANIZATION" },
//     orderBy: { createdAt: "desc" },
//     take: 24,
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       country: true,
//       countryCode: true,
//       mobileNumber: true,
//       bio: true,
//       createdAt: true,
//       _count: {
//         select: {
//           projects: true,
//         },
//       },
//     },
//   });

//   const organizationsCount = await prisma.user.count({
//     where: { role: "ORGANIZATION" },
//   });

//   const organizationsWithCountry = await prisma.user.count({
//     where: {
//       role: "ORGANIZATION",
//       country: { not: null },
//     },
//   });

//   const organizationsWithPhone = await prisma.user.count({
//     where: {
//       role: "ORGANIZATION",
//       mobileNumber: { not: null },
//     },
//   });

//   const organizationsWithProjects = await prisma.user.count({
//     where: {
//       role: "ORGANIZATION",
//       projects: {
//         some: {},
//       },
//     },
//   });

//   return (
//     <main className="space-y-8">
//       <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         <MetricCard
//           title="Total Organizations"
//           value={organizationsCount}
//           subtitle="Registered organizations"
//         />
//         <MetricCard
//           title="With Country"
//           value={organizationsWithCountry}
//           subtitle="Profile coverage"
//         />
//         <MetricCard
//           title="With Phone"
//           value={organizationsWithPhone}
//           subtitle="Direct contact coverage"
//         />
//         <MetricCard
//           title="With Projects"
//           value={organizationsWithProjects}
//           subtitle="Active project owners"
//         />
//       </section>

//       <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
//         <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
//               Organization Directory
//             </p>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//               Registered Organizations
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Premium overview of organizations, contacts, and publishing activity.
//             </p>
//           </div>

//           <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
//             Showing {organizations.length} organization
//             {organizations.length === 1 ? "" : "s"}
//           </div>
//         </div>

//         {organizations.length === 0 ? (
//           <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//             <p className="text-slate-600">No organizations found yet.</p>
//           </div>
//         ) : (
//           <div className="overflow-hidden rounded-[24px] border border-slate-200">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-slate-200">
//                 <thead className="bg-slate-50/80">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Organization
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Country
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Phone
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Projects
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Overview
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Joined
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-200 bg-white">
//                   {organizations.map((organization) => (
//                     <tr key={organization.id} className="hover:bg-slate-50/70">
//                       <td className="px-4 py-4 align-top">
//                         <div>
//                           <p className="font-semibold text-slate-900">
//                             {organization.name}
//                           </p>
//                           <p className="mt-1 text-sm text-slate-500">
//                             {organization.email}
//                           </p>
//                         </div>
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {organization.country || "Not added"}
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {formatPhone(
//                           organization.countryCode,
//                           organization.mobileNumber
//                         )}
//                       </td>

//                       <td className="px-4 py-4 align-top">
//                         <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
//                           {organization._count.projects} project
//                           {organization._count.projects === 1 ? "" : "s"}
//                         </span>
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         <div className="max-w-[260px]">
//                           {organization.bio
//                             ? organization.bio.length > 90
//                               ? `${organization.bio.slice(0, 90)}...`
//                               : organization.bio
//                             : "No organization overview added"}
//                         </div>
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-500">
//                         {new Date(organization.createdAt).toLocaleDateString("en-GB", {
//                           day: "numeric",
//                           month: "short",
//                           year: "numeric",
//                         })}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }

// function MetricCard({
//   title,
//   value,
//   subtitle,
// }: {
//   title: string;
//   value: number;
//   subtitle: string;
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//       <p className="text-sm font-medium text-slate-500">{title}</p>
//       <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//         {value}
//       </p>
//       <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
//         {subtitle}
//       </p>
//     </div>
//   );
// }



// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// type Organization = {
//   id: string;
//   name: string;
//   email: string;
//   country: string | null;
//   countryCode: string | null;
//   mobileNumber: string | null;
//   bio: string | null;
//   createdAt: Date;
//   _count: {
//     projects: number;
//   };
// };

// function formatPhone(countryCode?: string | null, mobileNumber?: string | null) {
//   if (!countryCode && !mobileNumber) return "Not added";
//   if (countryCode && mobileNumber) return `${countryCode} ${mobileNumber}`;
//   return mobileNumber || countryCode || "Not added";
// }

// export default async function AdminOrganizationsPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   const organizations: Organization[] = await prisma.user.findMany({
//     where: { role: "ORGANIZATION" },
//     orderBy: { createdAt: "desc" },
//     take: 24,
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       country: true,
//       countryCode: true,
//       mobileNumber: true,
//       bio: true,
//       createdAt: true,
//       _count: {
//         select: {
//           projects: true,
//         },
//       },
//     },
//   });

//   const organizationsCount = await prisma.user.count({
//     where: { role: "ORGANIZATION" },
//   });

//   const organizationsWithCountry = await prisma.user.count({
//     where: {
//       role: "ORGANIZATION",
//       country: { not: null },
//     },
//   });

//   const organizationsWithPhone = await prisma.user.count({
//     where: {
//       role: "ORGANIZATION",
//       mobileNumber: { not: null },
//     },
//   });

//   const organizationsWithProjects = await prisma.user.count({
//     where: {
//       role: "ORGANIZATION",
//       projects: {
//         some: {},
//       },
//     },
//   });

//   return (
//     <main className="space-y-6 pb-8">
//       <section className="sticky top-0 z-10 -mx-1 bg-[linear-gradient(180deg,rgba(248,250,252,0.98)_0%,rgba(248,250,252,0.92)_70%,rgba(248,250,252,0)_100%)] px-1 pb-4">
//         <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//           <MetricCard
//             title="Total Organizations"
//             value={organizationsCount}
//             subtitle="Registered organizations"
//           />
//           <MetricCard
//             title="With Country"
//             value={organizationsWithCountry}
//             subtitle="Profile coverage"
//           />
//           <MetricCard
//             title="With Phone"
//             value={organizationsWithPhone}
//             subtitle="Direct contact coverage"
//           />
//           <MetricCard
//             title="With Projects"
//             value={organizationsWithProjects}
//             subtitle="Active project owners"
//           />
//         </div>
//       </section>

//       <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
//         <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
//               Organization Directory
//             </p>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//               Registered Organizations
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Premium overview of organizations, contacts, and publishing activity.
//             </p>
//           </div>

//           <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
//             Showing {organizations.length} organization
//             {organizations.length === 1 ? "" : "s"}
//           </div>
//         </div>

//         {organizations.length === 0 ? (
//           <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//             <p className="text-slate-600">No organizations found yet.</p>
//           </div>
//         ) : (
//           <div className="overflow-hidden rounded-[24px] border border-slate-200">
//             <div className="max-h-[calc(100vh-360px)] overflow-auto">
//               <table className="min-w-full divide-y divide-slate-200">
//                 <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Organization
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Country
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Phone
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Projects
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Overview
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Joined
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-200 bg-white">
//                   {organizations.map((organization) => (
//                     <tr key={organization.id} className="hover:bg-slate-50/70">
//                       <td className="px-4 py-4 align-top">
//                         <div>
//                           <p className="font-semibold text-slate-900">
//                             {organization.name}
//                           </p>
//                           <p className="mt-1 text-sm text-slate-500">
//                             {organization.email}
//                           </p>
//                         </div>
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {organization.country || "Not added"}
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {formatPhone(
//                           organization.countryCode,
//                           organization.mobileNumber
//                         )}
//                       </td>

//                       <td className="px-4 py-4 align-top">
//                         <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
//                           {organization._count.projects} project
//                           {organization._count.projects === 1 ? "" : "s"}
//                         </span>
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         <div className="max-w-[260px]">
//                           {organization.bio
//                             ? organization.bio.length > 90
//                               ? `${organization.bio.slice(0, 90)}...`
//                               : organization.bio
//                             : "No organization overview added"}
//                         </div>
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-500">
//                         {new Date(organization.createdAt).toLocaleDateString("en-GB", {
//                           day: "numeric",
//                           month: "short",
//                           year: "numeric",
//                         })}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }

// function MetricCard({
//   title,
//   value,
//   subtitle,
// }: {
//   title: string;
//   value: number;
//   subtitle: string;
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//       <p className="text-sm font-medium text-slate-500">{title}</p>
//       <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//         {value}
//       </p>
//       <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
//         {subtitle}
//       </p>
//     </div>
//   );
// }



import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type Organization = {
  id: string;
  name: string;
  email: string;
  country: string | null;
  countryCode: string | null;
  mobileNumber: string | null;
  bio: string | null;
  createdAt: Date;
  _count: {
    projects: number;
  };
};

function formatPhone(countryCode?: string | null, mobileNumber?: string | null) {
  if (!countryCode && !mobileNumber) return "Not added";
  if (countryCode && mobileNumber) return `${countryCode} ${mobileNumber}`;
  return mobileNumber || countryCode || "Not added";
}

export default async function AdminOrganizationsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const organizations: Organization[] = await prisma.user.findMany({
    where: { role: "ORGANIZATION" },
    orderBy: { createdAt: "desc" },
    take: 24,
    select: {
      id: true,
      name: true,
      email: true,
      country: true,
      countryCode: true,
      mobileNumber: true,
      bio: true,
      createdAt: true,
      _count: {
        select: {
          projects: true,
        },
      },
    },
  });

  const organizationsCount = await prisma.user.count({
    where: { role: "ORGANIZATION" },
  });

  const organizationsWithCountry = await prisma.user.count({
    where: {
      role: "ORGANIZATION",
      country: { not: null },
    },
  });

  const organizationsWithPhone = await prisma.user.count({
    where: {
      role: "ORGANIZATION",
      mobileNumber: { not: null },
    },
  });

  const organizationsWithProjects = await prisma.user.count({
    where: {
      role: "ORGANIZATION",
      projects: {
        some: {},
      },
    },
  });

  return (
    <main className="space-y-8 pb-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Organizations"
          value={organizationsCount}
          subtitle="Registered organizations"
        />
        <MetricCard
          title="With Country"
          value={organizationsWithCountry}
          subtitle="Profile coverage"
        />
        <MetricCard
          title="With Phone"
          value={organizationsWithPhone}
          subtitle="Direct contact coverage"
        />
        <MetricCard
          title="With Projects"
          value={organizationsWithProjects}
          subtitle="Active project owners"
        />
      </section>

      <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Organization Directory
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Registered Organizations
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Premium overview of organizations, contacts, and publishing activity.
            </p>
          </div>

          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
            Showing {organizations.length} organization
            {organizations.length === 1 ? "" : "s"}
          </div>
        </div>

        {organizations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <p className="text-slate-600">No organizations found yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[24px] border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Organization
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Country
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Projects
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Overview
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Joined
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {organizations.map((organization) => (
                    <tr key={organization.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-4 align-top">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {organization.name}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {organization.email}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-slate-700">
                        {organization.country || "Not added"}
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-slate-700">
                        {formatPhone(
                          organization.countryCode,
                          organization.mobileNumber
                        )}
                      </td>

                      <td className="px-4 py-4 align-top">
                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {organization._count.projects} project
                          {organization._count.projects === 1 ? "" : "s"}
                        </span>
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-slate-700">
                        <div className="max-w-[260px]">
                          {organization.bio
                            ? organization.bio.length > 90
                              ? `${organization.bio.slice(0, 90)}...`
                              : organization.bio
                            : "No organization overview added"}
                        </div>
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-slate-500">
                        {new Date(organization.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: number;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}



// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// type Volunteer = {
//   id: string;
//   name: string;
//   email: string;
//   country: string | null;
//   countryCode: string | null;
//   mobileNumber: string | null;
//   skills: string | null;
//   experience: string | null;
//   createdAt: Date;
// };

// function formatPhone(countryCode?: string | null, mobileNumber?: string | null) {
//   if (!countryCode && !mobileNumber) return "Not added";
//   if (countryCode && mobileNumber) return `${countryCode} ${mobileNumber}`;
//   return mobileNumber || countryCode || "Not added";
// }

// function parsePrimarySkill(skills: string | null) {
//   if (!skills) return "Not added";
//   const first = skills
//     .split(",")
//     .map((skill) => skill.trim())
//     .filter(Boolean)[0];

//   return first || "Not added";
// }

// export default async function AdminVolunteersPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   const volunteersList: Volunteer[] = await prisma.user.findMany({
//     where: { role: "VOLUNTEER" },
//     orderBy: { createdAt: "desc" },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       country: true,
//       countryCode: true,
//       mobileNumber: true,
//       skills: true,
//       experience: true,
//       createdAt: true,
//     },
//   });

//   const volunteers = await prisma.user.count({
//     where: { role: "VOLUNTEER" },
//   });

//   const volunteersWithPhone = await prisma.user.count({
//     where: {
//       role: "VOLUNTEER",
//       mobileNumber: { not: null },
//     },
//   });

//   const volunteersWithCountry = await prisma.user.count({
//     where: {
//       role: "VOLUNTEER",
//       country: { not: null },
//     },
//   });

//   return (
//     <main className="space-y-8">
//       <section className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
//         <div className="bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_45%,#2563eb_100%)] px-6 py-8 text-white sm:px-8 lg:px-10">
//           <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100/90">
//             Volunteer Oversight
//           </p>
//           <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
//             Volunteers
//           </h1>
//           <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
//             Review the full volunteer directory, contact completeness, skills,
//             and profile readiness from one premium admin workspace.
//           </p>
//         </div>

//         <div className="grid gap-4 px-6 py-6 sm:px-8 md:grid-cols-3">
//           <MetricCard title="Total Volunteers" value={volunteers} />
//           <MetricCard title="With Country" value={volunteersWithCountry} />
//           <MetricCard title="With Phone" value={volunteersWithPhone} />
//         </div>
//       </section>

//       <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
//         <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
//               User Oversight
//             </p>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//               All Volunteers
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Full volunteer directory with profile, contact, and experience visibility for admin review.
//             </p>
//           </div>

//           <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
//             Showing all {volunteersList.length} volunteer
//             {volunteersList.length === 1 ? "" : "s"}
//           </div>
//         </div>

//         {volunteersList.length === 0 ? (
//           <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//             <p className="text-slate-600">No volunteers found yet.</p>
//           </div>
//         ) : (
//           <div className="overflow-hidden rounded-[24px] border border-slate-200">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-slate-200">
//                 <thead className="bg-slate-50/80">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Volunteer
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Country
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Mobile Number
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Primary Skill
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Experience
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Joined
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-200 bg-white">
//                   {volunteersList.map((volunteer) => (
//                     <tr key={volunteer.id} className="hover:bg-slate-50/70">
//                       <td className="px-4 py-4 align-top">
//                         <div>
//                           <p className="font-semibold text-slate-900">
//                             {volunteer.name}
//                           </p>
//                           <p className="mt-1 text-sm text-slate-500">
//                             {volunteer.email}
//                           </p>
//                         </div>
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {volunteer.country || "Not added"}
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {formatPhone(volunteer.countryCode, volunteer.mobileNumber)}
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {parsePrimarySkill(volunteer.skills)}
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {volunteer.experience || "Not added"}
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-500">
//                         {new Date(volunteer.createdAt).toLocaleDateString("en-GB", {
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
// }: {
//   title: string;
//   value: number;
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//       <p className="text-sm font-medium text-slate-500">{title}</p>
//       <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//         {value}
//       </p>
//     </div>
//   );
// }



// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// type Volunteer = {
//   id: string;
//   name: string;
//   email: string;
//   country: string | null;
//   countryCode: string | null;
//   mobileNumber: string | null;
//   skills: string | null;
//   experience: string | null;
//   createdAt: Date;
// };

// function formatPhone(countryCode?: string | null, mobileNumber?: string | null) {
//   if (!countryCode && !mobileNumber) return "Not added";
//   if (countryCode && mobileNumber) return `${countryCode} ${mobileNumber}`;
//   return mobileNumber || countryCode || "Not added";
// }

// function parsePrimarySkill(skills: string | null) {
//   if (!skills) return "Not added";
//   const first = skills
//     .split(",")
//     .map((skill) => skill.trim())
//     .filter(Boolean)[0];

//   return first || "Not added";
// }

// export default async function AdminVolunteersPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   const volunteersList: Volunteer[] = await prisma.user.findMany({
//     where: { role: "VOLUNTEER" },
//     orderBy: { createdAt: "desc" },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       country: true,
//       countryCode: true,
//       mobileNumber: true,
//       skills: true,
//       experience: true,
//       createdAt: true,
//     },
//   });

//   const volunteers = await prisma.user.count({
//     where: { role: "VOLUNTEER" },
//   });

//   const volunteersWithPhone = await prisma.user.count({
//     where: {
//       role: "VOLUNTEER",
//       mobileNumber: { not: null },
//     },
//   });

//   const volunteersWithCountry = await prisma.user.count({
//     where: {
//       role: "VOLUNTEER",
//       country: { not: null },
//     },
//   });

//   return (
//     <main className="space-y-8">
//       <section className="grid gap-4 md:grid-cols-3">
//         <MetricCard title="Total Volunteers" value={volunteers} />
//         <MetricCard title="With Country" value={volunteersWithCountry} />
//         <MetricCard title="With Phone" value={volunteersWithPhone} />
//       </section>

//       <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
//         <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
//               User Oversight
//             </p>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//               All Volunteers
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Full volunteer directory with profile, contact, and experience visibility for admin review.
//             </p>
//           </div>

//           <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
//             Showing all {volunteersList.length} volunteer
//             {volunteersList.length === 1 ? "" : "s"}
//           </div>
//         </div>

//         {volunteersList.length === 0 ? (
//           <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//             <p className="text-slate-600">No volunteers found yet.</p>
//           </div>
//         ) : (
//           <div className="overflow-hidden rounded-[24px] border border-slate-200">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-slate-200">
//                 <thead className="bg-slate-50/80">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Volunteer
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Country
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Mobile Number
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Primary Skill
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Experience
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Joined
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-200 bg-white">
//                   {volunteersList.map((volunteer) => (
//                     <tr key={volunteer.id} className="hover:bg-slate-50/70">
//                       <td className="px-4 py-4 align-top">
//                         <div>
//                           <p className="font-semibold text-slate-900">
//                             {volunteer.name}
//                           </p>
//                           <p className="mt-1 text-sm text-slate-500">
//                             {volunteer.email}
//                           </p>
//                         </div>
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {volunteer.country || "Not added"}
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {formatPhone(volunteer.countryCode, volunteer.mobileNumber)}
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {parsePrimarySkill(volunteer.skills)}
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {volunteer.experience || "Not added"}
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-500">
//                         {new Date(volunteer.createdAt).toLocaleDateString("en-GB", {
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
// }: {
//   title: string;
//   value: number;
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//       <p className="text-sm font-medium text-slate-500">{title}</p>
//       <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//         {value}
//       </p>
//     </div>
//   );
// }




// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// type Volunteer = {
//   id: string;
//   name: string;
//   email: string;
//   country: string | null;
//   countryCode: string | null;
//   mobileNumber: string | null;
//   skills: string | null;
//   experience: string | null;
//   createdAt: Date;
// };

// function formatPhone(countryCode?: string | null, mobileNumber?: string | null) {
//   if (!countryCode && !mobileNumber) return "Not added";
//   if (countryCode && mobileNumber) return `${countryCode} ${mobileNumber}`;
//   return mobileNumber || countryCode || "Not added";
// }

// function parsePrimarySkill(skills: string | null) {
//   if (!skills) return "Not added";
//   const first = skills
//     .split(",")
//     .map((skill) => skill.trim())
//     .filter(Boolean)[0];

//   return first || "Not added";
// }

// export default async function AdminVolunteersPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   const volunteersList: Volunteer[] = await prisma.user.findMany({
//     where: { role: "VOLUNTEER" },
//     orderBy: { createdAt: "desc" },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       country: true,
//       countryCode: true,
//       mobileNumber: true,
//       skills: true,
//       experience: true,
//       createdAt: true,
//     },
//   });

//   const volunteers = await prisma.user.count({
//     where: { role: "VOLUNTEER" },
//   });

//   const volunteersWithPhone = await prisma.user.count({
//     where: {
//       role: "VOLUNTEER",
//       mobileNumber: { not: null },
//     },
//   });

//   const volunteersWithCountry = await prisma.user.count({
//     where: {
//       role: "VOLUNTEER",
//       country: { not: null },
//     },
//   });

//   return (
//     <main className="space-y-6 pb-8">
//       <section className="sticky top-0 z-10 -mx-1 bg-[linear-gradient(180deg,rgba(248,250,252,0.98)_0%,rgba(248,250,252,0.92)_70%,rgba(248,250,252,0)_100%)] px-1 pb-4">
//         <div className="grid gap-4 md:grid-cols-3">
//           <MetricCard title="Total Volunteers" value={volunteers} />
//           <MetricCard title="With Country" value={volunteersWithCountry} />
//           <MetricCard title="With Phone" value={volunteersWithPhone} />
//         </div>
//       </section>

//       <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
//         <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
//               User Oversight
//             </p>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//               All Volunteers
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Full volunteer directory with profile, contact, and experience visibility for admin review.
//             </p>
//           </div>

//           <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
//             Showing all {volunteersList.length} volunteer
//             {volunteersList.length === 1 ? "" : "s"}
//           </div>
//         </div>

//         {volunteersList.length === 0 ? (
//           <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//             <p className="text-slate-600">No volunteers found yet.</p>
//           </div>
//         ) : (
//           <div className="overflow-hidden rounded-[24px] border border-slate-200">
//             <div className="max-h-[calc(100vh-360px)] overflow-auto">
//               <table className="min-w-full divide-y divide-slate-200">
//                 <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Volunteer
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Country
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Mobile Number
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Primary Skill
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Experience
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Joined
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-200 bg-white">
//                   {volunteersList.map((volunteer) => (
//                     <tr key={volunteer.id} className="hover:bg-slate-50/70">
//                       <td className="px-4 py-4 align-top">
//                         <div>
//                           <p className="font-semibold text-slate-900">
//                             {volunteer.name}
//                           </p>
//                           <p className="mt-1 text-sm text-slate-500">
//                             {volunteer.email}
//                           </p>
//                         </div>
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {volunteer.country || "Not added"}
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {formatPhone(volunteer.countryCode, volunteer.mobileNumber)}
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {parsePrimarySkill(volunteer.skills)}
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {volunteer.experience || "Not added"}
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-500">
//                         {new Date(volunteer.createdAt).toLocaleDateString("en-GB", {
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
// }: {
//   title: string;
//   value: number;
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
//       <p className="text-sm font-medium text-slate-500">{title}</p>
//       <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//         {value}
//       </p>
//     </div>
//   );
// }



import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

type Volunteer = {
  id: string;
  name: string;
  email: string;
  country: string | null;
  countryCode: string | null;
  mobileNumber: string | null;
  skills: string | null;
  experience: string | null;
  createdAt: Date;
};

function formatPhone(countryCode?: string | null, mobileNumber?: string | null) {
  if (!countryCode && !mobileNumber) return "Not added";
  if (countryCode && mobileNumber) return `${countryCode} ${mobileNumber}`;
  return mobileNumber || countryCode || "Not added";
}

function parsePrimarySkill(skills: string | null) {
  if (!skills) return "Not added";
  const first = skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean)[0];

  return first || "Not added";
}

export default async function AdminVolunteersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const volunteersList: Volunteer[] = await prisma.user.findMany({
    where: { role: "VOLUNTEER" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      country: true,
      countryCode: true,
      mobileNumber: true,
      skills: true,
      experience: true,
      createdAt: true,
    },
  });

  const volunteers = await prisma.user.count({
    where: { role: "VOLUNTEER" },
  });

  const volunteersWithPhone = await prisma.user.count({
    where: {
      role: "VOLUNTEER",
      mobileNumber: { not: null },
    },
  });

  const volunteersWithCountry = await prisma.user.count({
    where: {
      role: "VOLUNTEER",
      country: { not: null },
    },
  });

  return (
    <main className="space-y-8 pb-8">
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Total Volunteers" value={volunteers} />
        <MetricCard title="With Country" value={volunteersWithCountry} />
        <MetricCard title="With Phone" value={volunteersWithPhone} />
      </section>

      <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              User Oversight
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              All Volunteers
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Full volunteer directory with profile, contact, and experience visibility for admin review.
            </p>
          </div>

          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
            Showing all {volunteersList.length} volunteer
            {volunteersList.length === 1 ? "" : "s"}
          </div>
        </div>

        {volunteersList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <p className="text-slate-600">No volunteers found yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[24px] border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Volunteer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Country
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Mobile Number
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Primary Skill
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Experience
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Joined
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {volunteersList.map((volunteer) => (
                    <tr key={volunteer.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-4 align-top">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {volunteer.name}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {volunteer.email}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-slate-700">
                        {volunteer.country || "Not added"}
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-slate-700">
                        {formatPhone(volunteer.countryCode, volunteer.mobileNumber)}
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-slate-700">
                        {parsePrimarySkill(volunteer.skills)}
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-slate-700">
                        {volunteer.experience || "Not added"}
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-slate-500">
                        {new Date(volunteer.createdAt).toLocaleDateString("en-GB", {
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
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}
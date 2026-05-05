


// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import Link from "next/link";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// function formatDifficulty(level: string) {
//   return level.charAt(0) + level.slice(1).toLowerCase();
// }

// function getDifficultyStyles(level: string) {
//   switch (level) {
//     case "BEGINNER":
//       return "bg-emerald-50 text-emerald-700 border-emerald-200";
//     case "INTERMEDIATE":
//       return "bg-amber-50 text-amber-700 border-amber-200";
//     case "ADVANCED":
//       return "bg-rose-50 text-rose-700 border-rose-200";
//     default:
//       return "bg-slate-50 text-slate-700 border-slate-200";
//   }
// }

// export default async function BrowseProjectsPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER") {
//     redirect("/login");
//   }

//   // const projects = await prisma.project.findMany({
//   //   where: {
//   //     status: "OPEN",
//   //   },
//   //   include: {
//   //     organization: {
//   //       select: { name: true },
//   //     },
//   //   },
//   //   orderBy: {
//   //     createdAt: "desc",
//   //   },
//   // });


//   const projects = await prisma.project.findMany({
//   where: {
//     status: "OPEN",
//     applications: {
//       none: {
//         status: {
//           in: ["ACCEPTED", "COMPLETED"],
//         },
//       },
//     },
//   },
//   include: {
//     organization: {
//       select: { name: true },
//     },
//   },
//   orderBy: {
//     createdAt: "desc",
//   },
// });

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 md:px-8 lg:px-10 lg:py-8">
//       <div className="mx-auto max-w-7xl space-y-8">
//         {/* ===== HERO / PAGE HEADER ===== */}
//         <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
//           <div className="relative px-6 py-8 md:px-8 md:py-10">
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_24%)]" />
//             <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
//               <div className="max-w-3xl">
//                 <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
//                   <span className="h-2 w-2 rounded-full bg-blue-600" />
//                   BuildUp Opportunities
//                 </div>

//                 <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
//                   Browse Projects
//                 </h1>

//                 <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
//                   Explore real projects from organizations and start building
//                   practical experience that strengthens your portfolio, skills,
//                   and proof of work.
//                 </p>
//               </div>

//               <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row">
//                 <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center sm:min-w-[130px]">
//                   <p className="text-2xl font-bold text-slate-900">
//                     {projects.length}
//                   </p>
//                   <p className="text-xs font-medium text-slate-500">
//                     Open Projects
//                   </p>
//                 </div>

//                 <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center sm:min-w-[130px]">
//                   <p className="text-2xl font-bold text-slate-900">
//                     {
//                       new Set(
//                         projects.flatMap((project) => project.skills || [])
//                       ).size
//                     }
//                   </p>
//                   <p className="text-xs font-medium text-slate-500">
//                     Skill Areas
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ===== SEARCH + FILTERS (UI READY, LOGIC LATER) ===== */}
//         <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
//           <div className="flex flex-col gap-4">
//             <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
//               <div className="max-w-xl">
//                 <h2 className="text-lg font-semibold text-slate-900">
//                   Discover your next project
//                 </h2>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Use the filters below to narrow down opportunities that match
//                   your interests and skill level.
//                 </p>
//               </div>

//               <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
//                 Live opportunities available now
//               </div>
//             </div>

//             <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
//               <input
//                 type="text"
//                 placeholder="Search projects..."
//                 className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//               />

//               <select className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100">
//                 <option>All Skills</option>
//               </select>

//               <select className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100">
//                 <option>All Levels</option>
//                 <option>Beginner</option>
//                 <option>Intermediate</option>
//                 <option>Advanced</option>
//               </select>

//               <select className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100">
//                 <option>Open Projects</option>
//               </select>
//             </div>
//           </div>
//         </section>

//         {/* ===== PROJECT LIST ===== */}
//         <section className="space-y-5">
//           {projects.length === 0 ? (
//             <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
//               <div className="mx-auto max-w-md">
//                 <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
//                   💼
//                 </div>
//                 <h2 className="text-xl font-semibold text-slate-900">
//                   No projects available right now
//                 </h2>
//                 <p className="mt-2 text-sm leading-6 text-slate-500">
//                   Check back soon. Organizations are posting new opportunities
//                   that you can apply to and use to grow your portfolio.
//                 </p>
//               </div>
//             </div>
//           ) : (
//             projects.map((project) => (
//               <article
//                 key={project.id}
//                 className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] md:p-7"
//               >
//                 <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
//                   {/* LEFT */}
//                   <div className="min-w-0 flex-1">
//                     <div className="mb-4 flex flex-wrap items-start gap-3">
//                       <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg text-white shadow-sm">
//                         💼
//                       </div>

//                       <div className="min-w-0 flex-1">
//                         <div className="flex flex-wrap items-center gap-3">
//                           <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
//                             {project.title}
//                           </h2>

//                           <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
//                             OPEN
//                           </span>
//                         </div>

//                         <p className="mt-1 text-sm font-medium text-slate-500">
//                           {project.organization.name}
//                         </p>
//                       </div>
//                     </div>

//                     <p className="max-w-4xl text-sm leading-7 text-slate-600 md:text-[15px]">
//                       {project.description}
//                     </p>

//                     <div className="mt-6 flex flex-col gap-4">
//                       <div>
//                         <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
//                           Skills Needed
//                         </p>

//                         <div className="flex flex-wrap gap-2">
//                           {project.skills.map((skill) => (
//                             <span
//                               key={skill}
//                               className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
//                             >
//                               {skill}
//                             </span>
//                           ))}
//                         </div>
//                       </div>

//                       <div className="flex flex-wrap items-center gap-3">
//                         <div
//                           className={`rounded-full border px-3 py-1 text-xs font-semibold ${getDifficultyStyles(
//                             project.difficulty
//                           )}`}
//                         >
//                           Level: {formatDifficulty(project.difficulty)}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* RIGHT CTA PANEL */}
//                   <div className="w-full lg:w-auto lg:min-w-[220px]">
//                     <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
//                       <p className="text-sm font-semibold text-slate-900">
//                         Ready to explore?
//                       </p>
//                       <p className="mt-1 text-sm leading-6 text-slate-500">
//                         View the full details, expectations, and next steps for
//                         this opportunity.
//                       </p>

//                       <div className="mt-4">
//                         <Link
//                           href={`/projects/${project.id}`}
//                           className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
//                         >
//                           View Project
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </article>
//             ))
//           )}
//         </section>
//       </div>
//     </main>
//   );
// }




// import type { Prisma } from "@prisma/client";
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import Link from "next/link";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// const SKILL_OPTIONS = [
//   "UI/UX Design",
//   "Graphic Design",
//   "Branding & Identity Design",
//   "Product Design",
//   "Book Design",
//   "AI Art & Design",
//   "AI Artists",
//   "Photography",
//   "Photo Editing",
//   "Frontend Development",
//   "Backend Development",
//   "Fullstack Development",
//   "Website Development",
//   "Create Your Website",
//   "Mobile App Development",
//   "AI Mobile Development",
//   "Artificial Intelligence (AI)",
//   "Machine Learning",
//   "Data Analysis",
//   "Data Analytics",
//   "Data Analyst",
//   "Data Science",
//   "Business Intelligence",
//   "Research & Reporting",
//   "Social Media Management",
//   "Digital Marketing",
//   "SEO & Content Marketing",
//   "Video Marketing",
//   "Podcast Marketing",
//   "Music Promotion",
//   "Sales & Lead Generation",
//   "Video Editing",
//   "Video & Animation",
//   "Motion Graphics",
//   "AI Video Creation",
//   "Music & Audio Production",
//   "Jingles & Intros",
//   "Podcast Production",
//   "Business Planning",
//   "Project Management",
//   "Virtual Assistance",
//   "Career Counseling",
//   "Legal Services",
//   "Book Editing",
//   "Content Writing",
//   "Copywriting",
//   "Customer Support",
//   "Product Management",
//   "Other",
// ];

// const projectInclude = {
//   organization: {
//     select: {
//       name: true,
//     },
//   },
// } satisfies Prisma.ProjectInclude;

// type ProjectWithOrganization = Prisma.ProjectGetPayload<{
//   include: typeof projectInclude;
// }>;

// type SearchParams = {
//   q?: string;
//   skill?: string;
//   difficulty?: string;
//   status?: string;
// };

// function formatDifficulty(level: string) {
//   return level.charAt(0) + level.slice(1).toLowerCase();
// }

// function getDifficultyStyles(level: string) {
//   switch (level) {
//     case "BEGINNER":
//       return "bg-emerald-50 text-emerald-700 border-emerald-200";
//     case "INTERMEDIATE":
//       return "bg-amber-50 text-amber-700 border-amber-200";
//     case "ADVANCED":
//       return "bg-rose-50 text-rose-700 border-rose-200";
//     default:
//       return "bg-slate-50 text-slate-700 border-slate-200";
//   }
// }

// export default async function BrowseProjectsPage({
//   searchParams,
// }: {
//   searchParams: Promise<SearchParams>;
// }) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER") {
//     redirect("/login");
//   }

//   const params = await searchParams;

//   const q = params.q?.trim() || "";
//   const skill = params.skill?.trim() || "ALL";
//   const difficulty = params.difficulty?.trim() || "ALL";
//   const status = params.status?.trim() || "OPEN";

//   const where: Prisma.ProjectWhereInput = {
//     applications: {
//       none: {
//         status: {
//           in: ["ACCEPTED", "COMPLETED"],
//         },
//       },
//     },
//   };

//   if (status !== "ALL") {
//     where.status = status as Prisma.EnumProjectStatusFilter["equals"];
//   }

//   if (difficulty !== "ALL") {
//     where.difficulty = difficulty as Prisma.EnumDifficultyFilter["equals"];
//   }

//   if (skill !== "ALL") {
//     where.skills = {
//       has: skill,
//     };
//   }

//   if (q) {
//     where.OR = [
//       {
//         title: {
//           contains: q,
//           mode: "insensitive",
//         },
//       },
//       {
//         description: {
//           contains: q,
//           mode: "insensitive",
//         },
//       },
//       {
//         organization: {
//           name: {
//             contains: q,
//             mode: "insensitive",
//           },
//         },
//       },
//     ];
//   }

//   const projects: ProjectWithOrganization[] = await prisma.project.findMany({
//     where,
//     include: projectInclude,
//     orderBy: {
//       createdAt: "desc",
//     },
//   });

//   const activeFilterCount = [
//     q,
//     skill !== "ALL",
//     difficulty !== "ALL",
//     status !== "OPEN",
//   ].filter(Boolean).length;

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 md:px-8 lg:px-10 lg:py-8">
//       <div className="mx-auto max-w-7xl space-y-8">
//         {/* ===== HERO / PAGE HEADER ===== */}
//         <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
//           <div className="relative px-6 py-8 md:px-8 md:py-10">
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_24%)]" />

//             <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
//               <div className="max-w-3xl">
//                 <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
//                   <span className="h-2 w-2 rounded-full bg-blue-600" />
//                   BuildUp Opportunities
//                 </div>

//                 <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
//                   Browse Projects
//                 </h1>

//                 <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
//                   Explore real projects from organizations and start building
//                   practical experience that strengthens your portfolio, skills,
//                   and proof of work.
//                 </p>
//               </div>

//               <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row">
//                 <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center sm:min-w-[130px]">
//                   <p className="text-2xl font-bold text-slate-900">
//                     {projects.length}
//                   </p>
//                   <p className="text-xs font-medium text-slate-500">Results</p>
//                 </div>

//                 <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center sm:min-w-[130px]">
//                   <p className="text-2xl font-bold text-slate-900">
//                     {
//                       new Set(projects.flatMap((project) => project.skills || []))
//                         .size
//                     }
//                   </p>
//                   <p className="text-xs font-medium text-slate-500">
//                     Skill Areas
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ===== SEARCH + FILTERS ===== */}
//         <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
//           <div className="flex flex-col gap-4">
//             <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
//               <div className="max-w-xl">
//                 <h2 className="text-lg font-semibold text-slate-900">
//                   Discover your next project
//                 </h2>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Search by project title, organization, required skill, or
//                   difficulty level.
//                 </p>
//               </div>

//               <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
//                 {activeFilterCount > 0
//                   ? `${activeFilterCount} filter${
//                       activeFilterCount === 1 ? "" : "s"
//                     } active`
//                   : "Live opportunities available now"}
//               </div>
//             </div>

//             <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
//               <input
//                 type="text"
//                 name="q"
//                 defaultValue={q}
//                 placeholder="Search projects..."
//                 className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 xl:col-span-2"
//               />

//               <select
//                 name="skill"
//                 defaultValue={skill}
//                 className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//               >
//                 <option value="ALL">All Skills</option>
//                 {SKILL_OPTIONS.map((item) => (
//                   <option key={item} value={item}>
//                     {item}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 name="difficulty"
//                 defaultValue={difficulty}
//                 className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//               >
//                 <option value="ALL">All Levels</option>
//                 <option value="BEGINNER">Beginner</option>
//                 <option value="INTERMEDIATE">Intermediate</option>
//                 <option value="ADVANCED">Advanced</option>
//               </select>

//               <select
//                 name="status"
//                 defaultValue={status}
//                 className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//               >
//                 <option value="OPEN">Open Projects</option>
//                 <option value="IN_PROGRESS">In Progress</option>
//                 <option value="COMPLETED">Completed</option>
//                 <option value="ALL">All Projects</option>
//               </select>

//               <div className="flex flex-col gap-3 md:flex-row xl:col-span-5">
//                 <button
//                   type="submit"
//                   className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
//                 >
//                   Apply Filters
//                 </button>

//                 <Link
//                   href="/projects"
//                   className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//                 >
//                   Reset
//                 </Link>
//               </div>
//             </form>
//           </div>
//         </section>

//         {/* ===== PROJECT LIST ===== */}
//         <section className="space-y-5">
//           {projects.length === 0 ? (
//             <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
//               <div className="mx-auto max-w-md">
//                 <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
//                   🔎
//                 </div>

//                 <h2 className="text-xl font-semibold text-slate-900">
//                   No matching projects found
//                 </h2>

//                 <p className="mt-2 text-sm leading-6 text-slate-500">
//                   Try changing your search term, skill, status, or difficulty
//                   level to see more available opportunities.
//                 </p>

//                 <Link
//                   href="/projects"
//                   className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
//                 >
//                   Clear Filters
//                 </Link>
//               </div>
//             </div>
//           ) : (
//             projects.map((project) => (
//               <article
//                 key={project.id}
//                 className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] md:p-7"
//               >
//                 <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
//                   <div className="min-w-0 flex-1">
//                     <div className="mb-4 flex flex-wrap items-start gap-3">
//                       <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg text-white shadow-sm">
//                         💼
//                       </div>

//                       <div className="min-w-0 flex-1">
//                         <div className="flex flex-wrap items-center gap-3">
//                           <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
//                             {project.title}
//                           </h2>

//                           <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
//                             {project.status}
//                           </span>
//                         </div>

//                         <p className="mt-1 text-sm font-medium text-slate-500">
//                           {project.organization.name}
//                         </p>
//                       </div>
//                     </div>

//                     <p className="max-w-4xl text-sm leading-7 text-slate-600 md:text-[15px]">
//                       {project.description}
//                     </p>

//                     <div className="mt-6 flex flex-col gap-4">
//                       <div>
//                         <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
//                           Skills Needed
//                         </p>

//                         <div className="flex flex-wrap gap-2">
//                           {project.skills.map((item) => (
//                             <span
//                               key={item}
//                               className={`rounded-full border px-3 py-1 text-xs font-medium ${
//                                 item === skill
//                                   ? "border-blue-200 bg-blue-50 text-blue-700"
//                                   : "border-slate-200 bg-slate-50 text-slate-700"
//                               }`}
//                             >
//                               {item}
//                             </span>
//                           ))}
//                         </div>
//                       </div>

//                       <div className="flex flex-wrap items-center gap-3">
//                         <div
//                           className={`rounded-full border px-3 py-1 text-xs font-semibold ${getDifficultyStyles(
//                             project.difficulty
//                           )}`}
//                         >
//                           Level: {formatDifficulty(project.difficulty)}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="w-full lg:w-auto lg:min-w-[220px]">
//                     <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
//                       <p className="text-sm font-semibold text-slate-900">
//                         Ready to explore?
//                       </p>

//                       <p className="mt-1 text-sm leading-6 text-slate-500">
//                         View the full details, expectations, and next steps for
//                         this opportunity.
//                       </p>

//                       <div className="mt-4">
//                         <Link
//                           href={`/projects/${project.id}`}
//                           className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
//                         >
//                           View Project
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </article>
//             ))
//           )}
//         </section>
//       </div>
//     </main>
//   );
// }





import type { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const SKILL_OPTIONS = [
  "UI/UX Design",
  "Graphic Design",
  "Branding & Identity Design",
  "Product Design",
  "Book Design",
  "AI Art & Design",
  "AI Artists",
  "Photography",
  "Photo Editing",
  "Frontend Development",
  "Backend Development",
  "Fullstack Development",
  "Website Development",
  "Create Your Website",
  "Mobile App Development",
  "AI Mobile Development",
  "Artificial Intelligence (AI)",
  "Machine Learning",
  "Data Analysis",
  "Data Analytics",
  "Data Analyst",
  "Data Science",
  "Business Intelligence",
  "Research & Reporting",
  "Social Media",
  "Social Media Management",
  "Digital Marketing",
  "SEO & Content Marketing",
  "Video Marketing",
  "Podcast Marketing",
  "Music Promotion",
  "Sales & Lead Generation",
  "Video Editing",
  "Video & Animation",
  "Motion Graphics",
  "AI Video Creation",
  "Music & Audio Production",
  "Jingles & Intros",
  "Podcast Production",
  "Business Planning",
  "Project Management",
  "Virtual Assistance",
  "Career Counseling",
  "Legal Services",
  "Book Editing",
  "Content Writing",
  "Copywriting",
  "Customer Support",
  "Product Management",
  "Other",
];

const projectInclude = {
  organization: {
    select: {
      name: true,
    },
  },
} satisfies Prisma.ProjectInclude;

type ProjectWithOrganization = Prisma.ProjectGetPayload<{
  include: typeof projectInclude;
}>;

type SearchParams = {
  q?: string;
  skill?: string;
  difficulty?: string;
};

function normalize(value: string) {
  return value.toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ").trim();
}

function formatDifficulty(level: string) {
  return level.charAt(0) + level.slice(1).toLowerCase();
}

function getDifficultyStyles(level: string) {
  switch (level) {
    case "BEGINNER":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "INTERMEDIATE":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "ADVANCED":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

function projectMatchesSearch(project: ProjectWithOrganization, query: string) {
  const cleanQuery = normalize(query);

  if (!cleanQuery) return true;

  const words = cleanQuery.split(" ").filter(Boolean);

  const searchableText = normalize(
    [
      project.title,
      project.description,
      project.organization.name,
      project.difficulty,
      project.status,
      ...(project.skills || []),
    ].join(" ")
  );

  return words.every((word) => searchableText.includes(word));
}

function projectMatchesSkill(project: ProjectWithOrganization, selectedSkill: string) {
  const cleanSkill = normalize(selectedSkill);

  if (!cleanSkill || cleanSkill === "all") return true;

  return project.skills.some((projectSkill) => {
    const cleanProjectSkill = normalize(projectSkill);

    return (
      cleanProjectSkill.includes(cleanSkill) ||
      cleanSkill.includes(cleanProjectSkill)
    );
  });
}

export default async function BrowseProjectsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VOLUNTEER") {
    redirect("/login");
  }

  const params = await searchParams;

  const q = params.q?.trim() || "";
  const skill = params.skill?.trim() || "ALL";
  const difficulty = params.difficulty?.trim() || "ALL";

  const baseWhere: Prisma.ProjectWhereInput = {
    status: "OPEN",
    applications: {
      none: {
        status: {
          in: ["ACCEPTED", "COMPLETED"],
        },
      },
    },
  };

  if (difficulty !== "ALL") {
    baseWhere.difficulty = difficulty as Prisma.EnumDifficultyFilter["equals"];
  }

  const allOpenProjects: ProjectWithOrganization[] =
    await prisma.project.findMany({
      where: baseWhere,
      include: projectInclude,
      orderBy: {
        createdAt: "desc",
      },
    });

  const projects = allOpenProjects.filter((project) => {
    return projectMatchesSearch(project, q) && projectMatchesSkill(project, skill);
  });

  const availableSkillOptions = Array.from(
    new Set([
      ...SKILL_OPTIONS,
      ...allOpenProjects.flatMap((project) => project.skills || []),
    ])
  ).sort((a, b) => a.localeCompare(b));

  const suggestions = Array.from(
    new Set([
      ...availableSkillOptions,
      ...allOpenProjects.map((project) => project.title),
      ...allOpenProjects.map((project) => project.organization.name),
    ])
  )
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  const activeFilterCount = [q, skill !== "ALL", difficulty !== "ALL"].filter(
    Boolean
  ).length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 md:px-8 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="relative px-6 py-8 md:px-8 md:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_24%)]" />

            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  BuildUp Opportunities
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  Browse Projects
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                  Explore open, unassigned projects from organizations and start
                  building practical experience that strengthens your portfolio,
                  skills, and proof of work.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center sm:min-w-[130px]">
                  <p className="text-2xl font-bold text-slate-900">
                    {projects.length}
                  </p>
                  <p className="text-xs font-medium text-slate-500">Results</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center sm:min-w-[130px]">
                  <p className="text-2xl font-bold text-slate-900">
                    {
                      new Set(
                        allOpenProjects.flatMap((project) => project.skills || [])
                      ).size
                    }
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    Skill Areas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="max-w-xl">
                <h2 className="text-lg font-semibold text-slate-900">
                  Discover your next project
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Search by project title, organization, or skill. Typing
                  “social” will match projects with “Social Media”.
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                {activeFilterCount > 0
                  ? `${activeFilterCount} filter${
                      activeFilterCount === 1 ? "" : "s"
                    } active`
                  : "Open unassigned opportunities"}
              </div>
            </div>

            <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="xl:col-span-2">
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  list="project-search-suggestions"
                  placeholder="Search project, organization, or skill..."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

                <datalist id="project-search-suggestions">
                  {suggestions.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </div>

              <select
                name="skill"
                defaultValue={skill}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              >
                <option value="ALL">All Skills</option>
                {availableSkillOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                name="difficulty"
                defaultValue={difficulty}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              >
                <option value="ALL">All Levels</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>

              <div className="flex flex-col gap-3 md:flex-row xl:col-span-4">
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Apply Filters
                </button>

                <Link
                  href="/projects"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Reset
                </Link>
              </div>
            </form>
          </div>
        </section>

        <section className="space-y-5">
          {projects.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto max-w-md">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
                  🔎
                </div>

                <h2 className="text-xl font-semibold text-slate-900">
                  No matching projects found
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Try a shorter word like “social”, “data”, “video”, or
                  “marketing”. Search now checks project titles, organizations,
                  and partial skill matches.
                </p>

                <Link
                  href="/projects"
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Clear Filters
                </Link>
              </div>
            </div>
          ) : (
            projects.map((project) => (
              <article
                key={project.id}
                className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] md:p-7"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-4 flex flex-wrap items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg text-white shadow-sm">
                        💼
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                            {project.title}
                          </h2>

                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                            OPEN
                          </span>
                        </div>

                        <p className="mt-1 text-sm font-medium text-slate-500">
                          {project.organization.name}
                        </p>
                      </div>
                    </div>

                    <p className="max-w-4xl text-sm leading-7 text-slate-600 md:text-[15px]">
                      {project.description}
                    </p>

                    <div className="mt-6 flex flex-col gap-4">
                      <div>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Skills Needed
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {project.skills.map((item) => {
                            const selectedMatch =
                              skill !== "ALL" &&
                              projectMatchesSkill(project, skill) &&
                              (normalize(item).includes(normalize(skill)) ||
                                normalize(skill).includes(normalize(item)));

                            const searchMatch =
                              q && normalize(item).includes(normalize(q));

                            return (
                              <span
                                key={item}
                                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                                  selectedMatch || searchMatch
                                    ? "border-blue-200 bg-blue-50 text-blue-700"
                                    : "border-slate-200 bg-slate-50 text-slate-700"
                                }`}
                              >
                                {item}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getDifficultyStyles(
                            project.difficulty
                          )}`}
                        >
                          Level: {formatDifficulty(project.difficulty)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-auto lg:min-w-[220px]">
                    <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-900">
                        Ready to explore?
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        View the full details, expectations, and next steps for
                        this opportunity.
                      </p>

                      <div className="mt-4">
                        <Link
                          href={`/projects/${project.id}`}
                          className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                          View Project
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
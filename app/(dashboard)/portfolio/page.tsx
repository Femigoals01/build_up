


// import Image from "next/image";
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// async function movePortfolioItem(formData: FormData) {
//   "use server";

//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
//     redirect("/login");
//   }

//   const portfolioItemId = String(formData.get("portfolioItemId") || "");
//   const direction = String(formData.get("direction") || "");

//   if (!portfolioItemId || !["up", "down"].includes(direction)) return;

//   const items = await prisma.portfolioItem.findMany({
//     where: { volunteerId: session.user.id },
//     orderBy: [{ order: "asc" }, { createdAt: "asc" }],
//   });

//   const currentIndex = items.findIndex((item) => item.id === portfolioItemId);
//   if (currentIndex === -1) return;

//   const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
//   if (swapIndex < 0 || swapIndex >= items.length) return;

//   const currentItem = items[currentIndex];
//   const swapItem = items[swapIndex];

//   await prisma.$transaction([
//     prisma.portfolioItem.update({
//       where: { id: currentItem.id },
//       data: { order: swapItem.order },
//     }),
//     prisma.portfolioItem.update({
//       where: { id: swapItem.id },
//       data: { order: currentItem.order },
//     }),
//   ]);
// }

// async function savePortfolioDetails(formData: FormData) {
//   "use server";

//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
//     redirect("/login");
//   }

//   const portfolioItemId = String(formData.get("portfolioItemId") || "");
//   const contribution = String(formData.get("contribution") || "").trim();
//   const imageUrl = String(formData.get("imageUrl") || "").trim();
//   const proofUrl = String(formData.get("proofUrl") || "").trim();

//   if (!portfolioItemId) return;

//   const item = await prisma.portfolioItem.findFirst({
//     where: {
//       id: portfolioItemId,
//       volunteerId: session.user.id,
//     },
//   });

//   if (!item) return;

//   await prisma.portfolioItem.update({
//     where: { id: portfolioItemId },
//     data: {
//       contribution: contribution || null,
//       imageUrl: imageUrl || null,
//       proofUrl: proofUrl || null,
//     },
//   });
// }

// function getInitials(name?: string | null, username?: string | null) {
//   const source = name || username || "U";

//   return source
//     .split(" ")
//     .map((part) => part[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();
// }

// function getProofConfidence({
//   hasReview,
//   hasProofUrl,
//   hasImageUrl,
//   hasContribution,
// }: {
//   hasReview: boolean;
//   hasProofUrl: boolean;
//   hasImageUrl: boolean;
//   hasContribution: boolean;
// }) {
//   const score = [hasReview, hasProofUrl, hasImageUrl, hasContribution].filter(
//     Boolean
//   ).length;

//   if (score >= 4) return { label: "Very High", value: 100 };
//   if (score === 3) return { label: "High", value: 80 };
//   if (score === 2) return { label: "Good", value: 60 };
//   if (score === 1) return { label: "Basic", value: 35 };

//   return { label: "Growing", value: 20 };
// }

// function getOutcomeLabel(rating?: number | null) {
//   if (!rating) return "Awaiting Review";
//   if (rating >= 5) return "Excellent Delivery";
//   if (rating >= 4) return "Strong Delivery";
//   if (rating >= 3) return "Good Delivery";
//   return "Needs Growth";
// }

// function getOutcomeClass(rating?: number | null) {
//   if (!rating) return "border-slate-200 bg-slate-50 text-slate-600";
//   if (rating >= 5) return "border-emerald-200 bg-emerald-50 text-emerald-700";
//   if (rating >= 4) return "border-blue-200 bg-blue-50 text-blue-700";
//   if (rating >= 3) return "border-amber-200 bg-amber-50 text-amber-700";
//   return "border-rose-200 bg-rose-50 text-rose-700";
// }

// export default async function PortfolioPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
//     redirect("/login");
//   }

//   const user = await prisma.user.findUnique({
//     where: { id: session.user.id },
//     include: {
//       badges: true,
//     },
//   });

//   if (!user) {
//     redirect("/login");
//   }

//   const portfolio = await prisma.portfolioItem.findMany({
//     where: { volunteerId: session.user.id },
//     include: {
//       project: true,
//       review: true,
//     },
//     orderBy: [{ order: "asc" }, { createdAt: "asc" }],
//   });

//   const completedApplications = await prisma.application.findMany({
//     where: {
//       volunteerId: session.user.id,
//       status: "COMPLETED",
//       project: {
//         status: "COMPLETED",
//       },
//     },
//     include: {
//       project: true,
//     },
//   });

//   const completedCount = completedApplications.length;
//   const portfolioCount = portfolio.length;
//   const badgesCount = user.badges.length;
//   const averageRating = Number(user.rating ?? 0).toFixed(1);

//   return (
//     <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.10),_transparent_30%),linear-gradient(to_bottom,_#f8fbff,_#f8fafc_35%,_#f8fafc_100%)]">
//       <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10 lg:px-10">
//         <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/80 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur">
//           <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.08),rgba(15,23,42,0.02),rgba(16,185,129,0.05))]" />

//           <div className="relative grid gap-8 px-6 py-8 md:px-8 md:py-10 lg:grid-cols-[1.35fr_0.65fr] lg:px-10">
//             <div className="space-y-6">
//               <div className="flex flex-wrap items-center gap-3">
//                 <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700">
//                   VERIFIED CAREER LEDGER
//                 </span>

//                 <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
//                   Auto-added completed projects
//                 </span>
//               </div>

//               <div className="flex items-start gap-4">
//                 <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-900/10">
//                   {user.profileImageUrl ? (
//                     <Image
//                       src={user.profileImageUrl}
//                       alt={user.name || "Profile image"}
//                       fill
//                       className="object-cover"
//                       sizes="64px"
//                     />
//                   ) : (
//                     <div className="flex h-full w-full items-center justify-center bg-slate-900 text-lg font-bold text-white">
//                       {getInitials(user.name, user.username)}
//                     </div>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
//                     My Verified Portfolio
//                   </h1>

//                   <p className="max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
//                     Every completed BuildUp project is automatically added here.
//                     You can enrich each project with contribution notes,
//                     screenshots, and proof links, but completed work cannot be
//                     hidden or removed from your verified history.
//                   </p>
//                 </div>
//               </div>

//               <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//                 <StatCard title="Rating" value={`⭐ ${averageRating}`} note="/ 5" />
//                 <StatCard title="Reviews" value={String(user.ratingCount)} />
//                 <StatCard title="Portfolio Items" value={String(portfolioCount)} />
//                 <StatCard title="Completed Projects" value={String(completedCount)} />
//               </div>

//               {badgesCount > 0 && (
//                 <div className="rounded-2xl border border-slate-200 bg-white/90 p-4">
//                   <div className="flex items-center justify-between gap-4">
//                     <div>
//                       <h2 className="text-sm font-semibold text-slate-900">
//                         Earned Badges
//                       </h2>

//                       <p className="mt-1 text-sm text-slate-500">
//                         Your credibility markers visible on your public profile.
//                       </p>
//                     </div>

//                     <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
//                       {badgesCount} total
//                     </span>
//                   </div>

//                   <div className="mt-4 flex flex-wrap gap-3">
//                     {user.badges.map((badge) => (
//                       <div
//                         key={badge.id}
//                         title={`${badge.name} — ${badge.description}`}
//                         className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-blue-300 hover:bg-blue-50"
//                       >
//                         <span className="text-2xl">{badge.icon}</span>

//                         <div className="min-w-0">
//                           <p className="truncate text-sm font-semibold text-slate-900">
//                             {badge.name}
//                           </p>

//                           <p className="truncate text-xs text-slate-500">
//                             {badge.description}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="flex flex-col justify-between gap-5 rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
//               <div>
//                 <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-200/80">
//                   Accountability System
//                 </p>

//                 <h2 className="mt-3 text-2xl font-bold leading-tight">
//                   Your portfolio reflects real responsibility, not only selected
//                   wins.
//                 </h2>

//                 <p className="mt-3 text-sm leading-6 text-slate-300">
//                   BuildUp automatically records completed project outcomes to
//                   create a credible history of growth, delivery, and trust.
//                 </p>
//               </div>

//               <div className="space-y-3">
//                 <a
//                   href={`/portfolio/${user.username}`}
//                   className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
//                 >
//                   View Public Portfolio
//                 </a>

//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
//                     <p className="text-xs uppercase tracking-wide text-slate-400">
//                       Verified Items
//                     </p>
//                     <p className="mt-1 text-2xl font-bold">{portfolioCount}</p>
//                   </div>

//                   <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
//                     <p className="text-xs uppercase tracking-wide text-slate-400">
//                       Badges
//                     </p>
//                     <p className="mt-1 text-2xl font-bold">{badgesCount}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="mt-8 rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 shadow-sm md:p-8">
//           <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
//             Portfolio Policy
//           </p>

//           <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//             Completed projects are added automatically
//           </h2>

//           <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
//             To protect trust and accountability, volunteers cannot manually add
//             or remove completed BuildUp projects from this portfolio. This helps
//             organizations evaluate real growth, consistency, performance, and
//             proof of work. You can still improve each project entry by adding
//             your contribution statement, screenshot, live demo, repository, or
//             proof link.
//           </p>
//         </section>

//         <section className="mt-8">
//           <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//             <div>
//               <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
//                 Verified Project History
//               </p>

//               <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//                 Portfolio Items
//               </h2>

//               <p className="mt-2 text-sm leading-6 text-slate-500">
//                 These entries are automatically created from completed BuildUp
//                 projects and represent your verified project journey.
//               </p>
//             </div>

//             <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
//               {portfolio.length} item{portfolio.length === 1 ? "" : "s"}
//             </div>
//           </div>

//           {portfolio.length === 0 ? (
//             <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
//               <div className="mx-auto max-w-lg">
//                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white shadow-lg shadow-blue-600/20">
//                   ✨
//                 </div>

//                 <h3 className="mt-5 text-xl font-semibold text-slate-900">
//                   No verified portfolio items yet
//                 </h3>

//                 <p className="mt-2 text-sm leading-6 text-slate-500">
//                   Once an organization marks your project as completed and
//                   submits a review, it will automatically appear here.
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {portfolio.map((item, index) => {
//                 const proofConfidence = getProofConfidence({
//                   hasReview: Boolean(item.review),
//                   hasProofUrl: Boolean(item.proofUrl),
//                   hasImageUrl: Boolean(item.imageUrl),
//                   hasContribution: Boolean(item.contribution),
//                 });

//                 return (
//                   <div
//                     key={item.id}
//                     className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.05)]"
//                   >
//                     <div className="grid gap-0 xl:grid-cols-[1.15fr_0.85fr]">
//                       <div className="p-6 md:p-8">
//                         <div className="flex flex-wrap items-start justify-between gap-4">
//                           <div>
//                             <div className="flex flex-wrap gap-2">
//                               <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
//                                 Verified #{index + 1}
//                               </span>

//                               <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
//                                 ✅ Auto-added
//                               </span>

//                               <span
//                                 className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getOutcomeClass(
//                                   item.review?.rating
//                                 )}`}
//                               >
//                                 {getOutcomeLabel(item.review?.rating)}
//                               </span>
//                             </div>

//                             <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
//                               {item.project.title}
//                             </h3>
//                           </div>

//                           {item.review ? (
//                             <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-right">
//                               <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
//                                 Latest Review
//                               </p>

//                               <p className="mt-1 text-lg font-bold text-slate-900">
//                                 ⭐ {item.review.rating} / 5
//                               </p>
//                             </div>
//                           ) : (
//                             <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
//                               <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
//                                 Review
//                               </p>

//                               <p className="mt-1 text-sm font-medium text-slate-600">
//                                 Awaiting review
//                               </p>
//                             </div>
//                           )}
//                         </div>

//                         {item.review?.comment && (
//                           <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
//                             <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
//                               Organization Feedback
//                             </p>

//                             <p className="mt-2 text-sm italic leading-6 text-slate-600">
//                               “{item.review.comment}”
//                             </p>
//                           </div>
//                         )}

//                         <form
//                           action={savePortfolioDetails}
//                           className="mt-6 space-y-5"
//                         >
//                           <input
//                             type="hidden"
//                             name="portfolioItemId"
//                             value={item.id}
//                           />

//                           <div>
//                             <label className="mb-2 block text-sm font-semibold text-slate-800">
//                               My contribution
//                             </label>

//                             <textarea
//                               name="contribution"
//                               defaultValue={item.contribution ?? ""}
//                               rows={5}
//                               placeholder="Explain exactly what you worked on in this project."
//                               className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
//                             />
//                           </div>

//                           <div className="grid gap-4 md:grid-cols-2">
//                             <div>
//                               <label className="mb-2 block text-sm font-semibold text-slate-800">
//                                 Project image / screenshot URL
//                               </label>

//                               <input
//                                 type="url"
//                                 name="imageUrl"
//                                 defaultValue={item.imageUrl ?? ""}
//                                 placeholder="https://..."
//                                 className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
//                               />
//                             </div>

//                             <div>
//                               <label className="mb-2 block text-sm font-semibold text-slate-800">
//                                 Proof link / live demo / repo
//                               </label>

//                               <input
//                                 type="url"
//                                 name="proofUrl"
//                                 defaultValue={item.proofUrl ?? ""}
//                                 placeholder="https://..."
//                                 className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
//                               />
//                             </div>
//                           </div>

//                           <button
//                             type="submit"
//                             className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
//                           >
//                             Save Proof Details
//                           </button>
//                         </form>
//                       </div>

//                       <div className="border-t border-slate-200 bg-slate-50 p-6 md:p-8 xl:border-l xl:border-t-0">
//                         <div className="flex h-full flex-col justify-between gap-6">
//                           <div>
//                             <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
//                               Proof Strength
//                             </p>

//                             <h4 className="mt-2 text-xl font-bold text-slate-900">
//                               {proofConfidence.label} confidence
//                             </h4>

//                             <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
//                               <div
//                                 className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
//                                 style={{ width: `${proofConfidence.value}%` }}
//                               />
//                             </div>

//                             <p className="mt-3 text-sm leading-6 text-slate-500">
//                               Add a clear contribution, project screenshot, and
//                               proof link to strengthen this item.
//                             </p>
//                           </div>

//                           <div className="grid gap-3">
//                             <form action={movePortfolioItem}>
//                               <input
//                                 type="hidden"
//                                 name="portfolioItemId"
//                                 value={item.id}
//                               />
//                               <input type="hidden" name="direction" value="up" />
//                               <button
//                                 type="submit"
//                                 disabled={index === 0}
//                                 className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
//                               >
//                                 Move Up
//                               </button>
//                             </form>

//                             <form action={movePortfolioItem}>
//                               <input
//                                 type="hidden"
//                                 name="portfolioItemId"
//                                 value={item.id}
//                               />
//                               <input
//                                 type="hidden"
//                                 name="direction"
//                                 value="down"
//                               />
//                               <button
//                                 type="submit"
//                                 disabled={index === portfolio.length - 1}
//                                 className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
//                               >
//                                 Move Down
//                               </button>
//                             </form>
//                           </div>

//                           <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
//                             <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
//                               Accountability note
//                             </p>

//                             <p className="mt-2 text-sm leading-6 text-blue-700">
//                               This item cannot be removed because it is part of
//                               your verified BuildUp project history.
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </section>
//       </div>
//     </main>
//   );
// }

// function StatCard({
//   title,
//   value,
//   note,
// }: {
//   title: string;
//   value: string;
//   note?: string;
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
//       <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
//         {title}
//       </p>

//       <p className="mt-1 text-lg font-bold text-slate-900">
//         {value}
//         {note ? (
//           <span className="ml-2 text-sm font-medium text-slate-500">
//             {note}
//           </span>
//         ) : null}
//       </p>
//     </div>
//   );
// }





import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function movePortfolioItem(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
    redirect("/login");
  }

  const portfolioItemId = String(formData.get("portfolioItemId") || "");
  const direction = String(formData.get("direction") || "");

  if (!portfolioItemId || !["up", "down"].includes(direction)) return;

  const items = await prisma.portfolioItem.findMany({
    where: { volunteerId: session.user.id },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  const currentIndex = items.findIndex((item) => item.id === portfolioItemId);
  if (currentIndex === -1) return;

  const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (swapIndex < 0 || swapIndex >= items.length) return;

  const currentItem = items[currentIndex];
  const swapItem = items[swapIndex];

  await prisma.$transaction([
    prisma.portfolioItem.update({
      where: { id: currentItem.id },
      data: { order: swapItem.order },
    }),
    prisma.portfolioItem.update({
      where: { id: swapItem.id },
      data: { order: currentItem.order },
    }),
  ]);
}

async function savePortfolioDetails(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
    redirect("/login");
  }

  const portfolioItemId = String(formData.get("portfolioItemId") || "");
  const contribution = String(formData.get("contribution") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const proofUrl = String(formData.get("proofUrl") || "").trim();

  if (!portfolioItemId) return;

  const item = await prisma.portfolioItem.findFirst({
    where: {
      id: portfolioItemId,
      volunteerId: session.user.id,
    },
  });

  if (!item) return;

  await prisma.portfolioItem.update({
    where: { id: portfolioItemId },
    data: {
      contribution: contribution || null,
      imageUrl: imageUrl || null,
      proofUrl: proofUrl || null,
    },
  });
}

function getInitials(name?: string | null, username?: string | null) {
  const source = name || username || "U";

  return source
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getProofConfidence({
  hasReview,
  hasProofUrl,
  hasImageUrl,
  hasContribution,
}: {
  hasReview: boolean;
  hasProofUrl: boolean;
  hasImageUrl: boolean;
  hasContribution: boolean;
}) {
  const score = [hasReview, hasProofUrl, hasImageUrl, hasContribution].filter(
    Boolean
  ).length;

  if (score >= 4) return { label: "Very High", value: 100 };
  if (score === 3) return { label: "High", value: 80 };
  if (score === 2) return { label: "Good", value: 60 };
  if (score === 1) return { label: "Basic", value: 35 };

  return { label: "Growing", value: 20 };
}

function getOutcomeLabel(rating?: number | null) {
  if (!rating) return "Awaiting Review";
  if (rating >= 5) return "Excellent Delivery";
  if (rating >= 4) return "Strong Delivery";
  if (rating >= 3) return "Good Delivery";
  return "Needs Growth";
}

function getOutcomeClass(rating?: number | null) {
  if (!rating) return "border-slate-200 bg-slate-50 text-slate-600";
  if (rating >= 5) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (rating >= 4) return "border-blue-200 bg-blue-50 text-blue-700";
  if (rating >= 3) return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-rose-200 bg-rose-50 text-rose-700";
}

export default async function PortfolioPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      badges: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const certificate = await prisma.certificate.findFirst({
    where: { volunteerId: session.user.id },
    orderBy: { issuedAt: "desc" },
  });

  const portfolio = await prisma.portfolioItem.findMany({
    where: { volunteerId: session.user.id },
    include: {
      project: true,
      review: true,
    },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  const completedApplications = await prisma.application.findMany({
    where: {
      volunteerId: session.user.id,
      status: "COMPLETED",
      project: {
        status: "COMPLETED",
      },
    },
    include: {
      project: true,
    },
  });

  const completedCount = completedApplications.length;
  const portfolioCount = portfolio.length;
  const badgesCount = user.badges.length;
  const certificateCount = certificate ? 1 : 0;
  const averageRating = Number(user.rating ?? 0).toFixed(1);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.10),_transparent_30%),linear-gradient(to_bottom,_#f8fbff,_#f8fafc_35%,_#f8fafc_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10 lg:px-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/80 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.08),rgba(15,23,42,0.02),rgba(16,185,129,0.05))]" />

          <div className="relative grid gap-8 px-6 py-8 md:px-8 md:py-10 lg:grid-cols-[1.35fr_0.65fr] lg:px-10">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700">
                  VERIFIED CAREER LEDGER
                </span>

                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  Auto-added completed projects
                </span>
              </div>

              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-900/10">
                  {user.profileImageUrl ? (
                    <Image
                      src={user.profileImageUrl}
                      alt={user.name || "Profile image"}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-900 text-lg font-bold text-white">
                      {getInitials(user.name, user.username)}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                    My Verified Portfolio
                  </h1>

                  <p className="max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                    Every completed BuildUp project is automatically added here.
                    You can enrich each project with contribution notes,
                    screenshots, and proof links, but completed work cannot be
                    hidden or removed from your verified history.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <StatCard title="Rating" value={`⭐ ${averageRating}`} note="/ 5" />
                <StatCard title="Reviews" value={String(user.ratingCount)} />
                <StatCard title="Portfolio Items" value={String(portfolioCount)} />
                <StatCard title="Completed Projects" value={String(completedCount)} />
                <Link href="/dashboard/certificates">
                  <StatCard
                    title="Certificate"
                    value={certificate ? "🎓 Verified" : "Not Yet"}
                  />
                </Link>
              </div>

              {badgesCount > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white/90 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-900">
                        Earned Badges
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Your credibility markers visible on your public profile.
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {badgesCount} total
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {user.badges.map((badge) => (
                      <div
                        key={badge.id}
                        title={`${badge.name} — ${badge.description}`}
                        className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-blue-300 hover:bg-blue-50"
                      >
                        <span className="text-2xl">{badge.icon}</span>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {badge.name}
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            {badge.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between gap-5 rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-200/80">
                  Accountability System
                </p>

                <h2 className="mt-3 text-2xl font-bold leading-tight">
                  Your portfolio reflects real responsibility, not only selected
                  wins.
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  BuildUp automatically records completed project outcomes to
                  create a credible history of growth, delivery, and trust.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={`/portfolio/${user.username}`}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  View Public Portfolio
                </a>

                <Link
                  href="/dashboard/certificates"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  🎓 View Certificate
                </Link>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Verified Items
                    </p>
                    <p className="mt-1 text-2xl font-bold">{portfolioCount}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Certificates
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      {certificateCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 shadow-sm md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
            Portfolio Policy
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Completed projects are added automatically
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
            To protect trust and accountability, volunteers cannot manually add
            or remove completed BuildUp projects from this portfolio. This helps
            organizations evaluate real growth, consistency, performance, and
            proof of work. You can still improve each project entry by adding
            your contribution statement, screenshot, live demo, repository, or
            proof link.
          </p>
        </section>

        <section className="mt-8">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Verified Project History
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                Portfolio Items
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                These entries are automatically created from completed BuildUp
                projects and represent your verified project journey.
              </p>
            </div>

            <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
              {portfolio.length} item{portfolio.length === 1 ? "" : "s"}
            </div>
          </div>

          {portfolio.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto max-w-lg">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white shadow-lg shadow-blue-600/20">
                  ✨
                </div>

                <h3 className="mt-5 text-xl font-semibold text-slate-900">
                  No verified portfolio items yet
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Once an organization marks your project as completed and
                  submits a review, it will automatically appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {portfolio.map((item, index) => {
                const proofConfidence = getProofConfidence({
                  hasReview: Boolean(item.review),
                  hasProofUrl: Boolean(item.proofUrl),
                  hasImageUrl: Boolean(item.imageUrl),
                  hasContribution: Boolean(item.contribution),
                });

                return (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.05)]"
                  >
                    <div className="grid gap-0 xl:grid-cols-[1.15fr_0.85fr]">
                      <div className="p-6 md:p-8">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap gap-2">
                              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                                Verified #{index + 1}
                              </span>

                              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                ✅ Auto-added
                              </span>

                              <span
                                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getOutcomeClass(
                                  item.review?.rating
                                )}`}
                              >
                                {getOutcomeLabel(item.review?.rating)}
                              </span>
                            </div>

                            <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                              {item.project.title}
                            </h3>
                          </div>

                          {item.review ? (
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-right">
                              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                                Latest Review
                              </p>

                              <p className="mt-1 text-lg font-bold text-slate-900">
                                ⭐ {item.review.rating} / 5
                              </p>
                            </div>
                          ) : (
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Review
                              </p>

                              <p className="mt-1 text-sm font-medium text-slate-600">
                                Awaiting review
                              </p>
                            </div>
                          )}
                        </div>

                        {item.review?.comment && (
                          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Organization Feedback
                            </p>

                            <p className="mt-2 text-sm italic leading-6 text-slate-600">
                              “{item.review.comment}”
                            </p>
                          </div>
                        )}

                        <form
                          action={savePortfolioDetails}
                          className="mt-6 space-y-5"
                        >
                          <input
                            type="hidden"
                            name="portfolioItemId"
                            value={item.id}
                          />

                          <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-800">
                              My contribution
                            </label>

                            <textarea
                              name="contribution"
                              defaultValue={item.contribution ?? ""}
                              rows={5}
                              placeholder="Explain exactly what you worked on in this project."
                              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label className="mb-2 block text-sm font-semibold text-slate-800">
                                Project image / screenshot URL
                              </label>

                              <input
                                type="url"
                                name="imageUrl"
                                defaultValue={item.imageUrl ?? ""}
                                placeholder="https://..."
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                              />
                            </div>

                            <div>
                              <label className="mb-2 block text-sm font-semibold text-slate-800">
                                Proof link / live demo / repo
                              </label>

                              <input
                                type="url"
                                name="proofUrl"
                                defaultValue={item.proofUrl ?? ""}
                                placeholder="https://..."
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                          >
                            Save Proof Details
                          </button>
                        </form>
                      </div>

                      <div className="border-t border-slate-200 bg-slate-50 p-6 md:p-8 xl:border-l xl:border-t-0">
                        <div className="flex h-full flex-col justify-between gap-6">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                              Proof Strength
                            </p>

                            <h4 className="mt-2 text-xl font-bold text-slate-900">
                              {proofConfidence.label} confidence
                            </h4>

                            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
                                style={{ width: `${proofConfidence.value}%` }}
                              />
                            </div>

                            <p className="mt-3 text-sm leading-6 text-slate-500">
                              Add a clear contribution, project screenshot, and
                              proof link to strengthen this item.
                            </p>
                          </div>

                          <div className="grid gap-3">
                            <form action={movePortfolioItem}>
                              <input
                                type="hidden"
                                name="portfolioItemId"
                                value={item.id}
                              />
                              <input type="hidden" name="direction" value="up" />
                              <button
                                type="submit"
                                disabled={index === 0}
                                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                Move Up
                              </button>
                            </form>

                            <form action={movePortfolioItem}>
                              <input
                                type="hidden"
                                name="portfolioItemId"
                                value={item.id}
                              />
                              <input
                                type="hidden"
                                name="direction"
                                value="down"
                              />
                              <button
                                type="submit"
                                disabled={index === portfolio.length - 1}
                                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                Move Down
                              </button>
                            </form>
                          </div>

                          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                              Accountability note
                            </p>

                            <p className="mt-2 text-sm leading-6 text-blue-700">
                              This item cannot be removed because it is part of
                              your verified BuildUp project history.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  note,
}: {
  title: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50/40">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-lg font-bold text-slate-900">
        {value}
        {note ? (
          <span className="ml-2 text-sm font-medium text-slate-500">
            {note}
          </span>
        ) : null}
      </p>
    </div>
  );
}
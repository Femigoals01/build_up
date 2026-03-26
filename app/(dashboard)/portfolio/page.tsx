



// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// async function addToPortfolio(formData: FormData) {
//   "use server";

//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
//     redirect("/login");
//   }

//   const projectId = String(formData.get("projectId") || "");
//   if (!projectId) return;

//   const application = await prisma.application.findFirst({
//     where: {
//       volunteerId: session.user.id,
//       projectId,
//       status: "COMPLETED",
//       project: {
//         status: "COMPLETED",
//       },
//     },
//   });

//   if (!application) return;

//   const existingPortfolioItem = await prisma.portfolioItem.findFirst({
//     where: {
//       volunteerId: session.user.id,
//       projectId,
//     },
//   });

//   if (existingPortfolioItem) return;

//   const review = await prisma.review.findFirst({
//     where: {
//       volunteerId: session.user.id,
//       projectId,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });

//   const lastItem = await prisma.portfolioItem.findFirst({
//     where: { volunteerId: session.user.id },
//     orderBy: { order: "desc" },
//   });

//   await prisma.portfolioItem.create({
//     data: {
//       volunteerId: session.user.id,
//       projectId,
//       reviewId: review?.id,
//       order: (lastItem?.order ?? -1) + 1,
//     },
//   });
// }

// async function removeFromPortfolio(formData: FormData) {
//   "use server";

//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
//     redirect("/login");
//   }

//   const portfolioItemId = String(formData.get("portfolioItemId") || "");
//   if (!portfolioItemId) return;

//   const item = await prisma.portfolioItem.findFirst({
//     where: {
//       id: portfolioItemId,
//       volunteerId: session.user.id,
//     },
//   });

//   if (!item) return;

//   await prisma.portfolioItem.delete({
//     where: { id: portfolioItemId },
//   });
// }

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
//     orderBy: {
//       createdAt: "desc",
//     },
//   });

//   const portfolioProjectIds = new Set(portfolio.map((item) => item.projectId));

//   const eligibleProjects = completedApplications.filter(
//     (app) => !portfolioProjectIds.has(app.projectId)
//   );

//   return (
//     <main className="px-6 md:px-10 py-10 bg-gray-50 min-h-screen space-y-10">
//       <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
//         <div>
//           <h1 className="text-3xl font-bold">My Portfolio</h1>

//           <p className="mt-2 text-gray-700">
//             ⭐ <span className="font-semibold">{user.rating.toFixed(1)}</span> / 5
//             <span className="ml-2 text-sm text-gray-500">
//               ({user.ratingCount} reviews)
//             </span>
//           </p>

//           {user.badges.length > 0 && (
//             <div className="flex gap-3 mt-4 flex-wrap">
//               {user.badges.map((badge) => (
//                 <span
//                   key={badge.id}
//                   title={`${badge.name} — ${badge.description}`}
//                   className="text-2xl"
//                 >
//                   {badge.icon}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>

//         <a
//           href={`/portfolio/${user.username}`}
//           className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
//         >
//           View Public Portfolio
//         </a>
//       </section>

//       <section className="bg-white border rounded-2xl p-6 shadow-sm">
//         <div className="mb-5">
//           <h2 className="text-xl font-semibold">Add Completed Work</h2>
//           <p className="text-sm text-gray-500 mt-1">
//             Add completed projects to strengthen your public portfolio.
//           </p>
//         </div>

//         {eligibleProjects.length === 0 ? (
//           <p className="text-gray-600 text-sm">
//             No completed projects available to add right now.
//           </p>
//         ) : (
//           <div className="grid gap-4">
//             {eligibleProjects.map((app) => (
//               <div
//                 key={app.id}
//                 className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl border bg-gray-50 p-4"
//               >
//                 <div>
//                   <h3 className="font-semibold text-gray-900">
//                     {app.project.title}
//                   </h3>
//                   <p className="text-sm text-gray-500">
//                     Completed project ready for your portfolio
//                   </p>
//                 </div>

//                 <form action={addToPortfolio}>
//                   <input type="hidden" name="projectId" value={app.projectId} />
//                   <button
//                     type="submit"
//                     className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
//                   >
//                     Add to Portfolio
//                   </button>
//                 </form>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       <section className="space-y-6">
//         <div>
//           <h2 className="text-xl font-semibold">Portfolio Items</h2>
//           <p className="text-sm text-gray-500 mt-1">
//             These are the projects currently displayed in your portfolio.
//           </p>
//         </div>

//         {portfolio.length === 0 ? (
//           <div className="bg-white p-10 rounded-2xl text-center text-gray-600 border shadow-sm">
//             You haven’t added any portfolio items yet.
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {portfolio.map((item, index) => (
//               <div
//                 key={item.id}
//                 className="bg-white border rounded-2xl p-6 shadow-sm"
//               >
//                 <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
//                       Position {index + 1}
//                     </p>
//                     <h2 className="text-xl font-semibold mt-1">
//                       {item.project.title}
//                     </h2>

//                     {item.review ? (
//                       <div className="mt-3">
//                         <p className="font-semibold text-yellow-600">
//                           ⭐ {item.review.rating} / 5
//                         </p>
//                         <p className="text-gray-600 italic mt-1">
//                           “{item.review.comment}”
//                         </p>
//                       </div>
//                     ) : (
//                       <p className="mt-3 text-sm text-gray-500">No review yet.</p>
//                     )}
//                   </div>

//                   <div className="flex flex-wrap gap-3">
//                     <form action={movePortfolioItem}>
//                       <input type="hidden" name="portfolioItemId" value={item.id} />
//                       <input type="hidden" name="direction" value="up" />
//                       <button
//                         type="submit"
//                         disabled={index === 0}
//                         className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//                       >
//                         Move Up
//                       </button>
//                     </form>

//                     <form action={movePortfolioItem}>
//                       <input type="hidden" name="portfolioItemId" value={item.id} />
//                       <input type="hidden" name="direction" value="down" />
//                       <button
//                         type="submit"
//                         disabled={index === portfolio.length - 1}
//                         className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//                       >
//                         Move Down
//                       </button>
//                     </form>

//                     <form action={removeFromPortfolio}>
//                       <input type="hidden" name="portfolioItemId" value={item.id} />
//                       <button
//                         type="submit"
//                         className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
//                       >
//                         Remove
//                       </button>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }






// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// async function addToPortfolio(formData: FormData) {
//   "use server";

//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
//     redirect("/login");
//   }

//   const projectId = String(formData.get("projectId") || "");
//   if (!projectId) return;

//   const application = await prisma.application.findFirst({
//     where: {
//       volunteerId: session.user.id,
//       projectId,
//       status: "COMPLETED",
//       project: {
//         status: "COMPLETED",
//       },
//     },
//   });

//   if (!application) return;

//   const existingPortfolioItem = await prisma.portfolioItem.findFirst({
//     where: {
//       volunteerId: session.user.id,
//       projectId,
//     },
//   });

//   if (existingPortfolioItem) return;

//   const review = await prisma.review.findFirst({
//     where: {
//       volunteerId: session.user.id,
//       projectId,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });

//   const lastItem = await prisma.portfolioItem.findFirst({
//     where: { volunteerId: session.user.id },
//     orderBy: { order: "desc" },
//   });

//   await prisma.portfolioItem.create({
//     data: {
//       volunteerId: session.user.id,
//       projectId,
//       reviewId: review?.id,
//       order: (lastItem?.order ?? -1) + 1,
//     },
//   });
// }

// async function removeFromPortfolio(formData: FormData) {
//   "use server";

//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
//     redirect("/login");
//   }

//   const portfolioItemId = String(formData.get("portfolioItemId") || "");
//   if (!portfolioItemId) return;

//   const item = await prisma.portfolioItem.findFirst({
//     where: {
//       id: portfolioItemId,
//       volunteerId: session.user.id,
//     },
//   });

//   if (!item) return;

//   await prisma.portfolioItem.delete({
//     where: { id: portfolioItemId },
//   });
// }

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
//     orderBy: {
//       createdAt: "desc",
//     },
//   });

//   const portfolioProjectIds = new Set(portfolio.map((item) => item.projectId));

//   const eligibleProjects = completedApplications.filter(
//     (app) => !portfolioProjectIds.has(app.projectId)
//   );

//   return (
//     <main className="px-6 md:px-10 py-10 bg-gray-50 min-h-screen space-y-10">
//       <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
//         <div>
//           <h1 className="text-3xl font-bold">My Portfolio</h1>

//           <p className="mt-2 text-gray-700">
//             ⭐ <span className="font-semibold">{user.rating.toFixed(1)}</span> / 5
//             <span className="ml-2 text-sm text-gray-500">
//               ({user.ratingCount} reviews)
//             </span>
//           </p>

//           {user.badges.length > 0 && (
//             <div className="flex gap-3 mt-4 flex-wrap">
//               {user.badges.map((badge) => (
//                 <span
//                   key={badge.id}
//                   title={`${badge.name} — ${badge.description}`}
//                   className="text-2xl"
//                 >
//                   {badge.icon}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>

//         <a
//           href={`/portfolio/${user.username}`}
//           className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
//         >
//           View Public Portfolio
//         </a>
//       </section>

//       <section className="bg-white border rounded-2xl p-6 shadow-sm">
//         <div className="mb-5">
//           <h2 className="text-xl font-semibold">Add Completed Work</h2>
//           <p className="text-sm text-gray-500 mt-1">
//             Add completed projects to strengthen your public portfolio.
//           </p>
//         </div>

//         {eligibleProjects.length === 0 ? (
//           <p className="text-gray-600 text-sm">
//             No completed projects available to add right now.
//           </p>
//         ) : (
//           <div className="grid gap-4">
//             {eligibleProjects.map((app) => (
//               <div
//                 key={app.id}
//                 className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl border bg-gray-50 p-4"
//               >
//                 <div>
//                   <h3 className="font-semibold text-gray-900">
//                     {app.project.title}
//                   </h3>
//                   <p className="text-sm text-gray-500">
//                     Completed project ready for your portfolio
//                   </p>
//                 </div>

//                 <form action={addToPortfolio}>
//                   <input type="hidden" name="projectId" value={app.projectId} />
//                   <button
//                     type="submit"
//                     className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
//                   >
//                     Add to Portfolio
//                   </button>
//                 </form>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       <section className="space-y-6">
//         <div>
//           <h2 className="text-xl font-semibold">Portfolio Items</h2>
//           <p className="text-sm text-gray-500 mt-1">
//             These are the projects currently displayed in your portfolio.
//           </p>
//         </div>

//         {portfolio.length === 0 ? (
//           <div className="bg-white p-10 rounded-2xl text-center text-gray-600 border shadow-sm">
//             You haven’t added any portfolio items yet.
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {portfolio.map((item, index) => (
//               <div
//                 key={item.id}
//                 className="bg-white border rounded-2xl p-6 shadow-sm"
//               >
//                 <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
//                   <div className="flex-1">
//                     <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
//                       Position {index + 1}
//                     </p>
//                     <h2 className="text-xl font-semibold mt-1">
//                       {item.project.title}
//                     </h2>

//                     {item.review ? (
//                       <div className="mt-3">
//                         <p className="font-semibold text-yellow-600">
//                           ⭐ {item.review.rating} / 5
//                         </p>
//                         <p className="text-gray-600 italic mt-1">
//                           “{item.review.comment}”
//                         </p>
//                       </div>
//                     ) : (
//                       <p className="mt-3 text-sm text-gray-500">No review yet.</p>
//                     )}

//                     <form action={savePortfolioDetails} className="mt-5 space-y-4">
//                       <input
//                         type="hidden"
//                         name="portfolioItemId"
//                         value={item.id}
//                       />

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           My contribution
//                         </label>
//                         <textarea
//                           name="contribution"
//                           defaultValue={item.contribution ?? ""}
//                           rows={4}
//                           placeholder="Explain exactly what you worked on in this project."
//                           className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>

//                       <div className="grid md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-semibold text-gray-700 mb-2">
//                             Project image / screenshot URL
//                           </label>
//                           <input
//                             type="url"
//                             name="imageUrl"
//                             defaultValue={item.imageUrl ?? ""}
//                             placeholder="https://..."
//                             className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           />
//                         </div>

//                         <div>
//                           <label className="block text-sm font-semibold text-gray-700 mb-2">
//                             Proof link / live demo / repo
//                           </label>
//                           <input
//                             type="url"
//                             name="proofUrl"
//                             defaultValue={item.proofUrl ?? ""}
//                             placeholder="https://..."
//                             className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           />
//                         </div>
//                       </div>

//                       <button
//                         type="submit"
//                         className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
//                       >
//                         Save Details
//                       </button>
//                     </form>
//                   </div>

//                   <div className="flex flex-wrap gap-3">
//                     <form action={movePortfolioItem}>
//                       <input type="hidden" name="portfolioItemId" value={item.id} />
//                       <input type="hidden" name="direction" value="up" />
//                       <button
//                         type="submit"
//                         disabled={index === 0}
//                         className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//                       >
//                         Move Up
//                       </button>
//                     </form>

//                     <form action={movePortfolioItem}>
//                       <input type="hidden" name="portfolioItemId" value={item.id} />
//                       <input type="hidden" name="direction" value="down" />
//                       <button
//                         type="submit"
//                         disabled={index === portfolio.length - 1}
//                         className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
//                       >
//                         Move Down
//                       </button>
//                     </form>

//                     <form action={removeFromPortfolio}>
//                       <input type="hidden" name="portfolioItemId" value={item.id} />
//                       <button
//                         type="submit"
//                         className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
//                       >
//                         Remove
//                       </button>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }




// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import PortfolioShare from "@/components/PortfolioShare";

// /* ================= ADD ================= */
// async function addToPortfolio(formData: FormData) {
//   "use server";

//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
//     redirect("/login");
//   }

//   const projectId = String(formData.get("projectId") || "");
//   if (!projectId) return;

//   const application = await prisma.application.findFirst({
//     where: {
//       volunteerId: session.user.id,
//       projectId,
//       status: "COMPLETED",
//       project: { status: "COMPLETED" },
//     },
//   });

//   if (!application) return;

//   const existing = await prisma.portfolioItem.findFirst({
//     where: {
//       volunteerId: session.user.id,
//       projectId,
//     },
//   });

//   if (existing) return;

//   const review = await prisma.review.findFirst({
//     where: {
//       volunteerId: session.user.id,
//       projectId,
//     },
//     orderBy: { createdAt: "desc" },
//   });

//   const lastItem = await prisma.portfolioItem.findFirst({
//     where: { volunteerId: session.user.id },
//     orderBy: { order: "desc" },
//   });

//   await prisma.portfolioItem.create({
//     data: {
//       volunteerId: session.user.id,
//       projectId,
//       reviewId: review?.id,
//       order: (lastItem?.order ?? -1) + 1,
//     },
//   });
// }

// /* ================= REMOVE ================= */
// async function removeFromPortfolio(formData: FormData) {
//   "use server";

//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
//     redirect("/login");
//   }

//   const portfolioItemId = String(formData.get("portfolioItemId") || "");
//   if (!portfolioItemId) return;

//   await prisma.portfolioItem.delete({
//     where: { id: portfolioItemId },
//   });
// }

// /* ================= REORDER ================= */
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

//   const currentIndex = items.findIndex((i) => i.id === portfolioItemId);
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

// /* ================= SAVE DETAILS ================= */
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

//   await prisma.portfolioItem.update({
//     where: { id: portfolioItemId },
//     data: {
//       contribution: contribution || null,
//       imageUrl: imageUrl || null,
//       proofUrl: proofUrl || null,
//     },
//   });
// }

// /* ================= PAGE ================= */
// export default async function PortfolioPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
//     redirect("/login");
//   }

//   const user = await prisma.user.findUnique({
//     where: { id: session.user.id },
//     select: {
//       id: true,
//       username: true,
//       rating: true,
//       ratingCount: true,
//       badges: true,
//     },
//   });

//   if (!user || !user.username) {
//     redirect("/dashboard/settings");
//   }

//   const publicPortfolioHref = `/portfolio/${encodeURIComponent(user.username)}`;

//   const portfolio = await prisma.portfolioItem.findMany({
//     where: { volunteerId: session.user.id },
//     include: {
//       project: true,
//       review: true,
//     },
//     orderBy: [{ order: "asc" }, { createdAt: "asc" }],
//   });

//   const completedApps = await prisma.application.findMany({
//     where: {
//       volunteerId: session.user.id,
//       status: "COMPLETED",
//       project: { status: "COMPLETED" },
//     },
//     include: { project: true },
//   });

//   const portfolioIds = new Set(portfolio.map((p) => p.projectId));

//   const eligibleProjects = completedApps.filter(
//     (app) => !portfolioIds.has(app.projectId)
//   );

//   return (
//     <main className="px-6 md:px-10 py-10 bg-gray-50 min-h-screen space-y-10">
//       <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
//         <div>
//           <h1 className="text-3xl font-bold">My Portfolio</h1>

//           <p className="mt-2 text-gray-700">
//             ⭐ <span className="font-semibold">{user.rating.toFixed(1)}</span> / 5
//             <span className="ml-2 text-sm text-gray-500">
//               ({user.ratingCount} reviews)
//             </span>
//           </p>
//         </div>

//         <PortfolioShare url={publicPortfolioHref} />
//       </section>

//       <section className="bg-white border rounded-2xl p-6 shadow-sm">
//         <h2 className="text-xl font-semibold mb-4">Add Completed Work</h2>

//         {eligibleProjects.length === 0 ? (
//           <p className="text-gray-600 text-sm">
//             No completed projects available.
//           </p>
//         ) : (
//           <div className="grid gap-4">
//             {eligibleProjects.map((app) => (
//               <div
//                 key={app.id}
//                 className="flex justify-between items-center border rounded-xl p-4"
//               >
//                 <p className="font-medium">{app.project.title}</p>

//                 <form action={addToPortfolio}>
//                   <input type="hidden" name="projectId" value={app.projectId} />
//                   <button className="bg-green-600 text-white px-4 py-2 rounded">
//                     Add
//                   </button>
//                 </form>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       <section className="space-y-6">
//         <h2 className="text-xl font-semibold">Portfolio Items</h2>

//         {portfolio.length === 0 ? (
//           <div className="bg-white p-10 rounded-2xl text-center text-gray-600 border shadow-sm">
//             You haven’t added any portfolio items yet.
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {portfolio.map((item, index) => (
//               <div
//                 key={item.id}
//                 className="bg-white border rounded-2xl p-6 shadow-sm"
//               >
//                 <h3 className="text-lg font-semibold">{item.project.title}</h3>

//                 <form action={savePortfolioDetails} className="mt-4 space-y-4">
//                   <input type="hidden" name="portfolioItemId" value={item.id} />

//                   <textarea
//                     name="contribution"
//                     defaultValue={item.contribution ?? ""}
//                     placeholder="Your contribution..."
//                     className="w-full border p-3 rounded"
//                   />

//                   <input
//                     name="imageUrl"
//                     defaultValue={item.imageUrl ?? ""}
//                     placeholder="Image URL"
//                     className="w-full border p-3 rounded"
//                   />

//                   <input
//                     name="proofUrl"
//                     defaultValue={item.proofUrl ?? ""}
//                     placeholder="Proof link"
//                     className="w-full border p-3 rounded"
//                   />

//                   <button className="bg-black text-white px-4 py-2 rounded">
//                     Save
//                   </button>
//                 </form>

//                 <div className="flex gap-3 mt-4">
//                   <form action={movePortfolioItem}>
//                     <input type="hidden" name="portfolioItemId" value={item.id} />
//                     <input type="hidden" name="direction" value="up" />
//                     <button disabled={index === 0}>⬆</button>
//                   </form>

//                   <form action={movePortfolioItem}>
//                     <input type="hidden" name="portfolioItemId" value={item.id} />
//                     <input type="hidden" name="direction" value="down" />
//                     <button disabled={index === portfolio.length - 1}>⬇</button>
//                   </form>

//                   <form action={removeFromPortfolio}>
//                     <input type="hidden" name="portfolioItemId" value={item.id} />
//                     <button className="text-red-600">Remove</button>
//                   </form>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }



import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

/* ================= ADD ================= */
async function addToPortfolio(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
    redirect("/login");
  }

  const projectId = String(formData.get("projectId") || "");
  if (!projectId) return;

  const application = await prisma.application.findFirst({
    where: {
      volunteerId: session.user.id,
      projectId,
      status: "COMPLETED",
      project: { status: "COMPLETED" },
    },
  });

  if (!application) return;

  const existing = await prisma.portfolioItem.findFirst({
    where: {
      volunteerId: session.user.id,
      projectId,
    },
  });

  if (existing) return;

  const review = await prisma.review.findFirst({
    where: {
      volunteerId: session.user.id,
      projectId,
    },
    orderBy: { createdAt: "desc" },
  });

  const lastItem = await prisma.portfolioItem.findFirst({
    where: { volunteerId: session.user.id },
    orderBy: { order: "desc" },
  });

  await prisma.portfolioItem.create({
    data: {
      volunteerId: session.user.id,
      projectId,
      reviewId: review?.id,
      order: (lastItem?.order ?? -1) + 1,
    },
  });
}

/* ================= REMOVE ================= */
async function removeFromPortfolio(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
    redirect("/login");
  }

  const portfolioItemId = String(formData.get("portfolioItemId") || "");
  if (!portfolioItemId) return;

  await prisma.portfolioItem.delete({
    where: { id: portfolioItemId },
  });
}

/* ================= REORDER ================= */
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

  const currentIndex = items.findIndex((i) => i.id === portfolioItemId);
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

/* ================= SAVE DETAILS ================= */
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

  await prisma.portfolioItem.update({
    where: { id: portfolioItemId },
    data: {
      contribution: contribution || null,
      imageUrl: imageUrl || null,
      proofUrl: proofUrl || null,
    },
  });
}

/* ================= PAGE ================= */
export default async function PortfolioPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      username: true,
      rating: true,
      ratingCount: true,
      badges: true,
    },
  });

  if (!user || !user.username) {
    redirect("/dashboard/settings");
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

  const publicPortfolioHref = `${baseUrl}/portfolio/${encodeURIComponent(
    user.username
  )}`;

  const portfolio = await prisma.portfolioItem.findMany({
    where: { volunteerId: session.user.id },
    include: {
      project: true,
      review: true,
    },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  const completedApps = await prisma.application.findMany({
    where: {
      volunteerId: session.user.id,
      status: "COMPLETED",
      project: { status: "COMPLETED" },
    },
    include: { project: true },
  });

  const portfolioIds = new Set(portfolio.map((p) => p.projectId));

  const eligibleProjects = completedApps.filter(
    (app) => !portfolioIds.has(app.projectId)
  );

  return (
    <main className="px-6 md:px-10 py-10 bg-gray-50 min-h-screen space-y-10">
      <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">My Portfolio</h1>

          <p className="mt-2 text-gray-700">
            ⭐ <span className="font-semibold">{user.rating.toFixed(1)}</span> / 5
            <span className="ml-2 text-sm text-gray-500">
              ({user.ratingCount} reviews)
            </span>
          </p>
        </div>

        {/* <a
          href={publicPortfolioHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          View Public Portfolio
        </a> */}

        <a
  href={publicPortfolioHref}
  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
>
  View Public Portfolio
</a>
      </section>

      <section className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Add Completed Work</h2>

        {eligibleProjects.length === 0 ? (
          <p className="text-gray-600 text-sm">
            No completed projects available.
          </p>
        ) : (
          <div className="grid gap-4">
            {eligibleProjects.map((app) => (
              <div
                key={app.id}
                className="flex justify-between items-center border rounded-xl p-4"
              >
                <p className="font-medium">{app.project.title}</p>

                <form action={addToPortfolio}>
                  <input type="hidden" name="projectId" value={app.projectId} />
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Add
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Portfolio Items</h2>

        {portfolio.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl text-center text-gray-600 border shadow-sm">
            You haven’t added any portfolio items yet.
          </div>
        ) : (
          <div className="space-y-6">
            {portfolio.map((item, index) => (
              <div
                key={item.id}
                className="bg-white border rounded-2xl p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold">{item.project.title}</h3>

                <form action={savePortfolioDetails} className="mt-4 space-y-4">
                  <input type="hidden" name="portfolioItemId" value={item.id} />

                  <textarea
                    name="contribution"
                    defaultValue={item.contribution ?? ""}
                    placeholder="Your contribution..."
                    className="w-full border p-3 rounded"
                  />

                  <input
                    name="imageUrl"
                    defaultValue={item.imageUrl ?? ""}
                    placeholder="Image URL"
                    className="w-full border p-3 rounded"
                  />

                  <input
                    name="proofUrl"
                    defaultValue={item.proofUrl ?? ""}
                    placeholder="Proof link"
                    className="w-full border p-3 rounded"
                  />

                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </form>

                <div className="flex gap-3 mt-4">
                  <form action={movePortfolioItem}>
                    <input type="hidden" name="portfolioItemId" value={item.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button type="submit" disabled={index === 0}>
                      ⬆
                    </button>
                  </form>

                  <form action={movePortfolioItem}>
                    <input type="hidden" name="portfolioItemId" value={item.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button
                      type="submit"
                      disabled={index === portfolio.length - 1}
                    >
                      ⬇
                    </button>
                  </form>

                  <form action={removeFromPortfolio}>
                    <input type="hidden" name="portfolioItemId" value={item.id} />
                    <button type="submit" className="text-red-600">
                      Remove
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
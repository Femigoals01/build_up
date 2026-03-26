



// import { notFound } from "next/navigation";
// import { prisma } from "@/lib/prisma";
// import StarRating from "@/components/StarRating";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// export default async function PublicPortfolioPage({
//   params,
// }: {
//   params: Promise<{ username: string }>;
// }) {
//   const { username } = await params;

//   if (!username) {
//     notFound();
//   }

//   const user = await prisma.user.findUnique({
//     where: { username },
//     select: {
//       id: true,
//       name: true,
//       username: true,
//     },
//   });

//   if (!user) {
//     notFound();
//   }

//   const portfolioItems = await prisma.portfolioItem.findMany({
//     where: { volunteerId: user.id },
//     include: {
//       project: {
//         include: {
//           organization: { select: { name: true } },
//         },
//       },
//       review: true,
//     },
//     orderBy: [{ order: "asc" }, { createdAt: "asc" }],
//   });

//   const reviews = await prisma.review.findMany({
//     where: { volunteerId: user.id },
//     orderBy: { createdAt: "desc" },
//   });

//   const completedProjectsCount = portfolioItems.length;

//   const averageRating =
//     reviews.length === 0
//       ? 0
//       : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
//         <div className="max-w-6xl mx-auto px-8 py-14">
//           <h1 className="text-4xl font-bold">{user.name}</h1>

//           <p className="text-blue-100 mt-2 max-w-2xl">
//             Verified volunteer with real-world project experience.
//           </p>

//           <div className="mt-6 flex items-center gap-4">
//             <StarRating rating={averageRating} />
//             <span className="text-lg font-semibold">
//               {averageRating.toFixed(1)} / 5
//             </span>
//             <span className="text-blue-200 text-sm">
//               ({reviews.length} reviews)
//             </span>
//           </div>
//         </div>
//       </section>

//       <main className="max-w-6xl mx-auto px-8 py-12 space-y-14">
//         <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <Stat label="Portfolio Projects" value={completedProjectsCount} />
//           <Stat label="Total Reviews" value={reviews.length} />
//           <Stat label="Average Rating" value={averageRating.toFixed(1)} />
//         </section>

//         <section>
//           <h2 className="text-2xl font-semibold mb-6">Featured Work</h2>

//           {portfolioItems.length === 0 ? (
//             <p className="text-gray-600">No portfolio projects added yet.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//               {portfolioItems.map((item) => (
//                 <div
//                   key={item.id}
//                   className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
//                 >
//                   <h3 className="text-lg font-semibold">{item.project.title}</h3>

//                   <p className="text-sm text-gray-500 mt-1">
//                     {item.project.organization.name}
//                   </p>

//                   {item.review && (
//                     <div className="mt-4 flex items-center gap-2">
//                       <StarRating rating={item.review.rating} />
//                       <span className="text-sm text-gray-600">
//                         {item.review.rating}/5
//                       </span>
//                     </div>
//                   )}

//                   {item.review?.comment && (
//                     <p className="mt-4 text-sm italic text-gray-600 leading-relaxed">
//                       “{item.review.comment}”
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>

//         <section>
//           <h2 className="text-2xl font-semibold mb-6">What Clients Say</h2>

//           {reviews.length === 0 ? (
//             <p className="text-gray-600">No reviews yet.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {reviews.slice(0, 6).map((review) => (
//                 <div key={review.id} className="space-y-3">
//                   <StarRating rating={review.rating} />
//                   <p className="italic text-gray-800 leading-relaxed">
//                     “{review.comment}”
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }

// function Stat({ label, value }: { label: string; value: string | number }) {
//   return (
//     <div className="bg-white border rounded-2xl p-6 text-center">
//       <p className="text-sm text-gray-500">{label}</p>
//       <p className="text-3xl font-bold mt-2">{value}</p>
//     </div>
//   );
// }




import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

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
      project: {
        status: "COMPLETED",
      },
    },
  });

  if (!application) return;

  const existingPortfolioItem = await prisma.portfolioItem.findFirst({
    where: {
      volunteerId: session.user.id,
      projectId,
    },
  });

  if (existingPortfolioItem) return;

  const review = await prisma.review.findFirst({
    where: {
      volunteerId: session.user.id,
      projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
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

async function removeFromPortfolio(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
    redirect("/login");
  }

  const portfolioItemId = String(formData.get("portfolioItemId") || "");
  if (!portfolioItemId) return;

  const item = await prisma.portfolioItem.findFirst({
    where: {
      id: portfolioItemId,
      volunteerId: session.user.id,
    },
  });

  if (!item) return;

  await prisma.portfolioItem.delete({
    where: { id: portfolioItemId },
  });
}

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
    orderBy: {
      createdAt: "desc",
    },
  });

  const portfolioProjectIds = new Set(portfolio.map((item) => item.projectId));

  const eligibleProjects = completedApplications.filter(
    (app) => !portfolioProjectIds.has(app.projectId)
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

          {user.badges.length > 0 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {user.badges.map((badge) => (
                <span
                  key={badge.id}
                  title={`${badge.name} — ${badge.description}`}
                  className="text-2xl"
                >
                  {badge.icon}
                </span>
              ))}
            </div>
          )}
        </div>

        <a
          href={`/portfolio/${user.username}`}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          View Public Portfolio
        </a>
      </section>

      <section className="bg-white border rounded-2xl p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-semibold">Add Completed Work</h2>
          <p className="text-sm text-gray-500 mt-1">
            Add completed projects to strengthen your public portfolio.
          </p>
        </div>

        {eligibleProjects.length === 0 ? (
          <p className="text-gray-600 text-sm">
            No completed projects available to add right now.
          </p>
        ) : (
          <div className="grid gap-4">
            {eligibleProjects.map((app) => (
              <div
                key={app.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl border bg-gray-50 p-4"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {app.project.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Completed project ready for your portfolio
                  </p>
                </div>

                <form action={addToPortfolio}>
                  <input type="hidden" name="projectId" value={app.projectId} />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
                  >
                    Add to Portfolio
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Portfolio Items</h2>
          <p className="text-sm text-gray-500 mt-1">
            These are the projects currently displayed in your portfolio.
          </p>
        </div>

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
                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Position {index + 1}
                    </p>
                    <h2 className="text-xl font-semibold mt-1">
                      {item.project.title}
                    </h2>

                    {item.review ? (
                      <div className="mt-3">
                        <p className="font-semibold text-yellow-600">
                          ⭐ {item.review.rating} / 5
                        </p>
                        <p className="text-gray-600 italic mt-1">
                          “{item.review.comment}”
                        </p>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-gray-500">No review yet.</p>
                    )}

                    <form action={savePortfolioDetails} className="mt-5 space-y-4">
                      <input
                        type="hidden"
                        name="portfolioItemId"
                        value={item.id}
                      />

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          My contribution
                        </label>
                        <textarea
                          name="contribution"
                          defaultValue={item.contribution ?? ""}
                          rows={4}
                          placeholder="Explain exactly what you worked on in this project."
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Project image / screenshot URL
                          </label>
                          <input
                            type="url"
                            name="imageUrl"
                            defaultValue={item.imageUrl ?? ""}
                            placeholder="https://..."
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Proof link / live demo / repo
                          </label>
                          <input
                            type="url"
                            name="proofUrl"
                            defaultValue={item.proofUrl ?? ""}
                            placeholder="https://..."
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
                      >
                        Save Details
                      </button>
                    </form>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <form action={movePortfolioItem}>
                      <input type="hidden" name="portfolioItemId" value={item.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button
                        type="submit"
                        disabled={index === 0}
                        className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Move Up
                      </button>
                    </form>

                    <form action={movePortfolioItem}>
                      <input type="hidden" name="portfolioItemId" value={item.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button
                        type="submit"
                        disabled={index === portfolio.length - 1}
                        className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Move Down
                      </button>
                    </form>

                    <form action={removeFromPortfolio}>
                      <input type="hidden" name="portfolioItemId" value={item.id} />
                      <button
                        type="submit"
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
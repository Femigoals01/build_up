import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StarRating from "@/components/StarRating";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  // ✅ REQUIRED IN NEXT 15/16
  const { username } = await params;

  if (!username) {
    notFound();
  }

  /* ================= USER ================= */

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
    },
  });

  if (!user) {
    notFound();
  }

  /* ================= COMPLETED APPLICATIONS ================= */

  const completedApplications = await prisma.application.findMany({
    where: {
      volunteerId: user.id,
      status: "COMPLETED", // ✅ source of truth
    },
    include: {
      project: {
        include: {
          organization: { select: { name: true } },
          reviews: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  /* ================= REVIEWS ================= */

  const reviews = await prisma.review.findMany({
    where: { volunteerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  /* ================= DERIVED ================= */

  const completedProjectsCount = completedApplications.length;

  const averageRating =
    reviews.length === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-8 py-14">
          <h1 className="text-4xl font-bold">{user.name}</h1>

          <p className="text-blue-100 mt-2 max-w-2xl">
            Verified volunteer with real-world project experience.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <StarRating rating={averageRating} />
            <span className="text-lg font-semibold">
              {averageRating.toFixed(1)} / 5
            </span>
            <span className="text-blue-200 text-sm">
              ({reviews.length} reviews)
            </span>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <main className="max-w-6xl mx-auto px-8 py-12 space-y-14">

        {/* SUMMARY */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Stat label="Completed Projects" value={completedProjectsCount} />
          <Stat label="Total Reviews" value={reviews.length} />
          <Stat label="Average Rating" value={averageRating.toFixed(1)} />
        </section>

        {/* PROJECTS */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">
            Completed Projects
          </h2>

          {completedApplications.length === 0 ? (
            <p className="text-gray-600">
              No completed projects yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {completedApplications.map((app) => {
                const project = app.project;
                const myReview = project.reviews.find(
                  (r) => r.volunteerId === user.id
                );

                return (
                  <div
                    key={project.id}
                    className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-semibold">
                      {project.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {project.organization.name}
                    </p>

                    {myReview && (
                      <div className="mt-4 flex items-center gap-2">
                        <StarRating rating={myReview.rating} />
                        <span className="text-sm text-gray-600">
                          {myReview.rating}/5
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* REVIEWS */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">
            What Clients Say
          </h2>

          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {reviews.slice(0, 6).map((review) => (
                <div key={review.id} className="space-y-3">
                  <StarRating rating={review.rating} />
                  <p className="italic text-gray-800 leading-relaxed">
                    “{review.comment}”
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

/* ================= HELPERS ================= */

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border rounded-2xl p-6 text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

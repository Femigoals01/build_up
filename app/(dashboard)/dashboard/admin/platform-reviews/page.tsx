

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PlatformReviewsAdminPage() {
  const reviews = await prisma.platformReview.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="space-y-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
          Admin
        </p>

        <h1 className="mt-2 text-3xl font-black text-slate-900">
          Platform Reviews
        </h1>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-black uppercase text-slate-500">
                User
              </th>

              <th className="px-5 py-4 text-left text-xs font-black uppercase text-slate-500">
                Overall
              </th>

              <th className="px-5 py-4 text-left text-xs font-black uppercase text-slate-500">
                Status
              </th>

              <th className="px-5 py-4 text-left text-xs font-black uppercase text-slate-500">
                Date
              </th>

              <th className="px-5 py-4 text-right text-xs font-black uppercase text-slate-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {reviews.map((review) => (
              <tr
                key={review.id}
                className="border-t border-slate-100"
              >
                <td className="px-5 py-5">
                  <p className="font-black text-slate-900">
                    {review.user.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {review.user.role}
                  </p>
                </td>

                <td className="px-5 py-5">
                  ⭐ {review.overallRating}/5
                </td>

                <td className="px-5 py-5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      review.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-700"
                        : review.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {review.status}
                  </span>
                </td>

                <td className="px-5 py-5 text-sm text-slate-500">
                  {new Date(
                    review.createdAt
                  ).toLocaleDateString()}
                </td>

                <td className="px-5 py-5 text-right">
                  <a
                    href={`/dashboard/admin/platform-reviews/${review.id}`}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-black text-white"
                  >
                    Review
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
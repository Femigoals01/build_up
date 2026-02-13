
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import StarRating from "@/components/StarRating";

// export default async function ReviewsPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER") {
//     redirect("/login");
//   }

//   const reviews = await prisma.review.findMany({
//     where: { volunteerId: session.user.id },
//     include: {
//       project: {
//         include: {
//           organization: { select: { name: true } },
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   });

//   return (
//     <div className="min-h-screen bg-gray-50 px-10 py-10">
//       <div className="max-w-4xl mx-auto space-y-6">
//         <h1 className="text-3xl font-bold">All Reviews</h1>

//         {reviews.length === 0 ? (
//           <p className="text-gray-600">No reviews yet.</p>
//         ) : (
//           reviews.map((review) => (
//             <div
//               key={review.id}
//               className="bg-white border rounded-xl p-6"
//             >
//               <div className="flex items-center justify-between mb-2">
//                 <StarRating rating={review.rating} />
//                 <span className="text-sm text-gray-500">
//                   {new Date(review.createdAt).toLocaleDateString()}
//                 </span>
//               </div>

//               <p className="text-gray-700 italic mb-2">
//                 “{review.comment}”
//               </p>

//               <p className="text-sm text-gray-500">
//                 — {review.project.organization.name}
//               </p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }



import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import StarRating from "@/components/StarRating";
import SidebarShell from "@/components/sidebar/SidebarShell";
import SidebarItem from "@/components/sidebar/SidebarItem";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ReviewsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VOLUNTEER") {
    redirect("/login");
  }

  const reviews = await prisma.review.findMany({
    where: { volunteerId: session.user.id },
    include: {
      project: {
        include: {
          organization: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <SidebarShell>
        <SidebarItem href="/dashboard" label="Dashboard" icon="🏠" />
        <SidebarItem href="/dashboard/projects" label="Projects" icon="💼" />
        <SidebarItem
          href="/dashboard/reviews"
          label="Reviews"
          icon="⭐"
          active
        />
        <SidebarItem href="/portfolio" label="Portfolio" icon="🌍" />
        <SidebarItem href="/dashboard/messages" label="Messages" icon="💬" />
        <SidebarItem href="/dashboard/settings" label="Settings" icon="⚙️" />
      </SidebarShell>

      {/* MAIN */}
      <main className="flex-1 px-10 py-10 space-y-12">

        {/* HEADER */}
        <section>
          <h1 className="text-3xl font-bold">All Reviews</h1>
          <p className="text-gray-600 mt-1">
            Honest feedback from organizations you’ve worked with.
          </p>
        </section>

        {/* SUMMARY */}
        <section className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Average Rating</p>
            <div className="flex items-center gap-3 mt-1">
              <StarRating rating={averageRating} />
              <span className="text-xl font-semibold">
                {averageRating.toFixed(1)} / 5
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">Total Reviews</p>
            <p className="text-2xl font-bold">{totalReviews}</p>
          </div>
        </section>

        {/* FREE-FLOATING REVIEWS */}
        <section className="space-y-10 max-w-4xl">

          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="space-y-3">

                <div className="flex items-center gap-3">
                  <StarRating rating={review.rating} />
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-lg text-gray-800 italic leading-relaxed">
                  “{review.comment}”
                </p>

                <p className="text-sm text-gray-500">
                  — {review.project.organization.name}
                </p>

              </div>
            ))
          )}

        </section>

      </main>
    </div>
  );
}

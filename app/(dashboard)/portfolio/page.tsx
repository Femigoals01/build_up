
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export default async function PortfolioPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER") {
//     redirect("/login");
//   }

//   const portfolio = await prisma.portfolioItem.findMany({
//     where: { volunteerId: session.user.id },
//     include: {
//       project: true,
//       review: true,
//     },
//   });

//   return (
//     <main className="px-10 py-10 bg-gray-50 min-h-screen space-y-10">
//       <h1 className="text-3xl font-bold">My Portfolio</h1>

//       {portfolio.length === 0 ? (
//         <div className="bg-white p-10 rounded-xl text-center text-gray-600">
//           You haven’t completed any projects yet.
//         </div>
//       ) : (
//         portfolio.map((item) => (
//           <div
//             key={item.id}
//             className="bg-white border rounded-xl p-6 shadow-sm"
//           >
//             <h2 className="text-xl font-semibold">
//               {item.project.title}
//             </h2>

//             {item.review && (
//               <div className="mt-3">
//                 <p className="font-semibold">
//                   ⭐ {item.review.rating}/5
//                 </p>
//                 <p className="text-gray-600">
//                   “{item.review.comment}”
//                 </p>
//               </div>
//             )}
//           </div>
//         ))
//       )}
//     </main>
//   );
// }


import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function PortfolioPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VOLUNTEER") {
    redirect("/login");
  }

  /* ================= FETCH DATA ================= */

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      badges: true,
    },
  });

  const portfolio = await prisma.portfolioItem.findMany({
    where: { volunteerId: session.user.id },
    include: {
      project: true,
      review: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!user) {
    redirect("/login");
  }

  /* ================= UI ================= */

  return (
    <main className="px-10 py-10 bg-gray-50 min-h-screen space-y-10">

      {/* ================= HEADER ================= */}
      <section>
        <h1 className="text-3xl font-bold">My Portfolio</h1>

        {/* ⭐ RATING */}
        <p className="mt-2 text-gray-700">
          ⭐ <span className="font-semibold">
            {user.rating.toFixed(1)}
          </span>{" "}
          / 5
          <span className="ml-2 text-sm text-gray-500">
            ({user.ratingCount} reviews)
          </span>
        </p>

        {/* 🏅 BADGES */}
        {user.badges.length > 0 && (
          <div className="flex gap-3 mt-4">
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
      </section>

      {/* ================= PORTFOLIO ITEMS ================= */}
      {portfolio.length === 0 ? (
        <div className="bg-white p-10 rounded-xl text-center text-gray-600">
          You haven’t completed any projects yet.
        </div>
      ) : (
        <div className="space-y-6">
          {portfolio.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold">
                {item.project.title}
              </h2>

              {item.review ? (
                <div className="mt-3">
                  <p className="font-semibold text-yellow-600">
                    ⭐ {item.review.rating} / 5
                  </p>
                  <p className="text-gray-600 italic">
                    “{item.review.comment}”
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-gray-500">
                  No review yet.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

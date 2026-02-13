// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export default async function AdminDashboard() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   /* ================= DATA ================= */

//   const mentors = await prisma.user.findMany({
//     where: { role: "MENTOR" },
//     orderBy: { createdAt: "desc" },
//   });

//   const volunteers = await prisma.user.count({
//     where: { role: "VOLUNTEER" },
//   });

//   const organizations = await prisma.user.count({
//     where: { role: "ORGANIZATION" },
//   });

//   /* ================= UI ================= */

//   return (
//     <main className="p-10 space-y-10 bg-gray-50 min-h-screen">
//       <header>
//         <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//         <p className="text-gray-600 mt-1">
//           Manage mentors, users, and platform activity
//         </p>
//       </header>

//       {/* STATS */}
//       <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Stat title="Volunteers" value={volunteers} />
//         <Stat title="Organizations" value={organizations} />
//         <Stat title="Mentors" value={mentors.length} />
//       </section>

//       {/* MENTORS */}
//       <section className="bg-white rounded-xl border p-6">
//         <h2 className="text-xl font-semibold mb-4">
//           Mentors
//         </h2>

//         {mentors.length === 0 ? (
//           <p className="text-gray-600">No mentors yet.</p>
//         ) : (
//           <div className="space-y-4">
//             {mentors.map((mentor) => (
//               <div
//                 key={mentor.id}
//                 className="flex justify-between items-center border rounded-lg p-4"
//               >
//                 <div>
//                   <p className="font-semibold">{mentor.name}</p>
//                   <p className="text-sm text-gray-600">{mentor.email}</p>
//                 </div>

//                 <form
//                   action={`/api/admin/approve-mentor`}
//                   method="POST"
//                 >
//                   <input
//                     type="hidden"
//                     name="mentorId"
//                     value={mentor.id}
//                   />
//                   <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
//                     Approve
//                   </button>
//                 </form>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }

// /* SIMPLE STAT CARD */
// function Stat({ title, value }: { title: string; value: number }) {
//   return (
//     <div className="bg-white border rounded-xl p-6">
//       <p className="text-sm text-gray-500">{title}</p>
//       <p className="text-3xl font-bold mt-2">{value}</p>
//     </div>
//   );
// }



import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const mentors = await prisma.user.findMany({
    where: { role: "MENTOR" },
    orderBy: { createdAt: "desc" },
  });

  const volunteers = await prisma.user.count({
    where: { role: "VOLUNTEER" },
  });

  const organizations = await prisma.user.count({
    where: { role: "ORGANIZATION" },
  });

  return (
    <main className="p-10 space-y-10 bg-gray-50 min-h-screen">
      <header>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Manage mentors, users, and platform activity
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat title="Volunteers" value={volunteers} />
        <Stat title="Organizations" value={organizations} />
        <Stat title="Mentors" value={mentors.length} />
      </section>

      <section className="bg-white rounded-xl border p-6">
        <h2 className="text-xl font-semibold mb-4">Approved Mentors</h2>

        {mentors.length === 0 ? (
          <p className="text-gray-600">No mentors yet.</p>
        ) : (
          <div className="space-y-4">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="flex justify-between items-center border rounded-lg p-4"
              >
                <div>
                  <p className="font-semibold">{mentor.name}</p>
                  <p className="text-sm text-gray-600">{mentor.email}</p>
                </div>

                <span className="text-sm font-medium text-green-600">
                  Approved
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white border rounded-xl p-6">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

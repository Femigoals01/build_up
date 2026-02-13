


// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";



// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// export default async function AdminMentorsPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   // 🔎 Pending mentors = users who applied but are NOT mentors yet
//   const pendingMentors = await prisma.user.findMany({
//     where: {
//       role: { not: "MENTOR" },
//       experience: { not: null },
//       bio: { not: null },
//     },
//     orderBy: { createdAt: "desc" },
//   });

//   async function approveMentor(mentorId: string) {
//     "use server";

//     await prisma.user.update({
//       where: { id: mentorId },
//       data: { role: "MENTOR" },
//     });

//     await prisma.notification.create({
//       data: {
//         userId: mentorId,
//         title: "Mentor Approved 🎉",
//         message:
//           "Your mentor account has been approved! You can now access your mentor dashboard.",
//         type: "SYSTEM",
//       },
//     });
//   }

//   return (
//     <main className="p-10 space-y-8">
//       <header>
//         <h1 className="text-3xl font-bold">Mentor Applications</h1>
//         <p className="text-gray-600 mt-1">
//           Review and approve mentor applications
//         </p>
//       </header>

//       {pendingMentors.length === 0 ? (
//         <div className="bg-white border rounded-xl p-10 text-center text-gray-600">
//           No pending mentor applications.
//         </div>
//       ) : (
//         <div className="grid gap-6">
//           {pendingMentors.map((mentor) => (
//             <div
//               key={mentor.id}
//               className="bg-white border rounded-2xl p-6 shadow-sm flex justify-between items-start gap-6"
//             >
//               <div className="space-y-2">
//                 <h3 className="text-xl font-semibold">{mentor.name}</h3>
//                 <p className="text-sm text-gray-500">{mentor.email}</p>

//                 {mentor.experience && (
//                   <p className="text-sm">
//                     <strong>Experience:</strong> {mentor.experience} years
//                   </p>
//                 )}

//                 {mentor.bio && (
//                   <p className="text-sm text-gray-700">{mentor.bio}</p>
//                 )}
//               </div>

//               <form action={approveMentor.bind(null, mentor.id)}>
//                 <button
//                   type="submit"
//                   className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
//                 >
//                   Approve Mentor
//                 </button>
//               </form>
//             </div>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }



import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/* ✅ ADD PROPER TYPE */
type PendingMentor = {
  id: string;
  name: string;
  email: string;
  experience: string | null;
  bio: string | null;
};

export default async function AdminMentorsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  /* ✅ TYPE SAFE QUERY */
  const pendingMentors: PendingMentor[] = await prisma.user.findMany({
    where: {
      role: { not: "MENTOR" },
      experience: { not: null },
      bio: { not: null },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      experience: true,
      bio: true,
    },
  });

  async function approveMentor(mentorId: string) {
    "use server";

    await prisma.user.update({
      where: { id: mentorId },
      data: { role: "MENTOR" },
    });

    await prisma.notification.create({
      data: {
        userId: mentorId,
        title: "Mentor Approved 🎉",
        message:
          "Your mentor account has been approved! You can now access your mentor dashboard.",
        type: "SYSTEM",
      },
    });
  }

  return (
    <main className="p-10 space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Mentor Applications</h1>
        <p className="text-gray-600 mt-1">
          Review and approve mentor applications
        </p>
      </header>

      {pendingMentors.length === 0 ? (
        <div className="bg-white border rounded-xl p-10 text-center text-gray-600">
          No pending mentor applications.
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingMentors.map((mentor: PendingMentor) => (
            <div
              key={mentor.id}
              className="bg-white border rounded-2xl p-6 shadow-sm flex justify-between items-start gap-6"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{mentor.name}</h3>
                <p className="text-sm text-gray-500">{mentor.email}</p>

                {mentor.experience && (
                  <p className="text-sm">
                    <strong>Experience:</strong> {mentor.experience} years
                  </p>
                )}

                {mentor.bio && (
                  <p className="text-sm text-gray-700">{mentor.bio}</p>
                )}
              </div>

              <form action={approveMentor.bind(null, mentor.id)}>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
                >
                  Approve Mentor
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

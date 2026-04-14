



// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// type Mentor = {
//   id: string;
//   name: string;
//   email: string;
// };

// export default async function AdminDashboard() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   const mentors: Mentor[] = await prisma.user.findMany({
//     where: { role: "MENTOR" },
//     orderBy: { createdAt: "desc" },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//     },
//   });

//   const volunteers = await prisma.user.count({
//     where: { role: "VOLUNTEER" },
//   });

//   const organizations = await prisma.user.count({
//     where: { role: "ORGANIZATION" },
//   });

//   return (
//     <main className="p-10 space-y-10 bg-gray-50 min-h-screen">
//       <header>
//         <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//         <p className="text-gray-600 mt-1">
//           Manage mentors, users, and platform activity
//         </p>
//       </header>

//       <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Stat title="Volunteers" value={volunteers} />
//         <Stat title="Organizations" value={organizations} />
//         <Stat title="Mentors" value={mentors.length} />
//       </section>

//       <section className="bg-white rounded-xl border p-6">
//         <h2 className="text-xl font-semibold mb-4">Approved Mentors</h2>

//         {mentors.length === 0 ? (
//           <p className="text-gray-600">No mentors yet.</p>
//         ) : (
//           <div className="space-y-4">
//             {mentors.map((mentor: Mentor) => (
//               <div
//                 key={mentor.id}
//                 className="flex justify-between items-center border rounded-lg p-4"
//               >
//                 <div>
//                   <p className="font-semibold">{mentor.name}</p>
//                   <p className="text-sm text-gray-600">{mentor.email}</p>
//                 </div>

//                 <span className="text-sm font-medium text-green-600">
//                   Approved
//                 </span>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }

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

type Mentor = {
  id: string;
  name: string;
  email: string;
  country: string | null;
  countryCode: string | null;
  mobileNumber: string | null;
};

type Volunteer = {
  id: string;
  name: string;
  email: string;
  country: string | null;
  countryCode: string | null;
  mobileNumber: string | null;
  skills: string | null;
  experience: string | null;
  createdAt: Date;
};

function formatPhone(countryCode?: string | null, mobileNumber?: string | null) {
  if (!countryCode && !mobileNumber) return "Not added";
  if (countryCode && mobileNumber) return `${countryCode} ${mobileNumber}`;
  return mobileNumber || countryCode || "Not added";
}

function parsePrimarySkill(skills: string | null) {
  if (!skills) return "Not added";
  const first = skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean)[0];

  return first || "Not added";
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const mentors: Mentor[] = await prisma.user.findMany({
    where: { role: "MENTOR" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      country: true,
      countryCode: true,
      mobileNumber: true,
    },
  });

  const recentVolunteers: Volunteer[] = await prisma.user.findMany({
    where: { role: "VOLUNTEER" },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      name: true,
      email: true,
      country: true,
      countryCode: true,
      mobileNumber: true,
      skills: true,
      experience: true,
      createdAt: true,
    },
  });

  const volunteers = await prisma.user.count({
    where: { role: "VOLUNTEER" },
  });

  const organizations = await prisma.user.count({
    where: { role: "ORGANIZATION" },
  });

  const mentorsCount = await prisma.user.count({
    where: { role: "MENTOR" },
  });

  const volunteersWithPhone = await prisma.user.count({
    where: {
      role: "VOLUNTEER",
      mobileNumber: { not: null },
    },
  });

  const volunteersWithCountry = await prisma.user.count({
    where: {
      role: "VOLUNTEER",
      country: { not: null },
    },
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* HERO */}
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 px-6 py-8 text-white sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">
              Platform Control Center
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">
              Manage mentors, monitor volunteer profile completion, and keep
              visibility across key BuildUp users and platform activity.
            </p>
          </div>

          <div className="grid gap-4 px-6 py-6 sm:px-8 md:grid-cols-2 xl:grid-cols-5">
            <Stat title="Volunteers" value={volunteers} />
            <Stat title="Organizations" value={organizations} />
            <Stat title="Mentors" value={mentorsCount} />
            <Stat title="Volunteers with Country" value={volunteersWithCountry} />
            <Stat title="Volunteers with Phone" value={volunteersWithPhone} />
          </div>
        </section>

        {/* RECENT VOLUNTEERS */}
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                User Oversight
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                Recent Volunteers
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest volunteer accounts with profile and contact visibility for admin review.
              </p>
            </div>

            <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
              Showing {recentVolunteers.length} recent volunteer
              {recentVolunteers.length === 1 ? "" : "s"}
            </div>
          </div>

          {recentVolunteers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <p className="text-slate-600">No volunteers found yet.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Volunteer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Country
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Mobile Number
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Primary Skill
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Experience
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Joined
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 bg-white">
                    {recentVolunteers.map((volunteer) => (
                      <tr key={volunteer.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-4 align-top">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {volunteer.name}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {volunteer.email}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-4 align-top text-sm text-slate-700">
                          {volunteer.country || "Not added"}
                        </td>

                        <td className="px-4 py-4 align-top text-sm text-slate-700">
                          {formatPhone(
                            volunteer.countryCode,
                            volunteer.mobileNumber
                          )}
                        </td>

                        <td className="px-4 py-4 align-top text-sm text-slate-700">
                          {parsePrimarySkill(volunteer.skills)}
                        </td>

                        <td className="px-4 py-4 align-top text-sm text-slate-700">
                          {volunteer.experience || "Not added"}
                        </td>

                        <td className="px-4 py-4 align-top text-sm text-slate-500">
                          {new Date(volunteer.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* APPROVED MENTORS */}
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
              Mentor Management
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Approved Mentors
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Mentors already approved and active on the platform.
            </p>
          </div>

          {mentors.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <p className="text-slate-600">No mentors yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {mentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">
                        {mentor.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">{mentor.email}</p>
                    </div>

                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Approved
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-medium text-slate-800">Country:</span>{" "}
                      {mentor.country || "Not added"}
                    </p>
                    <p>
                      <span className="font-medium text-slate-800">Phone:</span>{" "}
                      {formatPhone(mentor.countryCode, mentor.mobileNumber)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}





// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import StarRating from "@/components/StarRating";
// import SidebarShell from "@/components/sidebar/SidebarShell";
// import SidebarItem from "@/components/sidebar/SidebarItem";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// type Tab = "ACTIVE" | "PENDING" | "COMPLETED";

// export default async function DashboardProjectsPage({
//   searchParams,
// }: {
//   searchParams?: Promise<{ tab?: string }>;
// }) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER") {
//     redirect("/login");
//   }

//   /* ✅ FIX: await searchParams */
//   const params = await searchParams;

//   const activeTab: Tab =
//     params?.tab === "COMPLETED"
//       ? "COMPLETED"
//       : params?.tab === "PENDING"
//       ? "PENDING"
//       : "ACTIVE";

//   /* ================= APPLICATIONS ================= */

//   const applications = await prisma.application.findMany({
//   where: { volunteerId: session.user.id },
//   include: {
//     project: {
//       include: {
//         organization: { select: { name: true } },
//         reviews: true,
//         mentor: {
//           select: {
//             id: true,
//             name: true,
//             username: true,
//           },
//         },
//       },
//     },
//   },
//   orderBy: { createdAt: "desc" },
// });


//   const activeApps = applications.filter(
//     (a) => a.status === "ACCEPTED" && a.project.status === "OPEN"
//   );

//   const pendingApps = applications.filter(
//     (a) => a.status === "PENDING"
//   );

//   const completedApps = applications.filter(
//     (a) => a.status === "COMPLETED" && a.project.status === "COMPLETED"
//   );

//   const visibleApps =
//     activeTab === "ACTIVE"
//       ? activeApps
//       : activeTab === "PENDING"
//       ? pendingApps
//       : completedApps;

//   /* ================= UI ================= */

//   return (
//     <div className="flex min-h-screen bg-gray-50">

//       {/* SIDEBAR */}
//       <SidebarShell>
//         <SidebarItem href="/dashboard" label="Dashboard" icon="🏠" />
//         <SidebarItem href="/dashboard/projects" label="Projects" icon="💼" active />
//         <SidebarItem href="/portfolio" label="Portfolio" icon="🌍" />
//         <SidebarItem href="/dashboard/messages" label="Messages" icon="💬" />
//         <SidebarItem href="/dashboard/settings" label="Settings" icon="⚙️" />
//       </SidebarShell>

//       {/* MAIN */}
//       <main className="flex-1 px-10 py-10 space-y-10">

//         {/* HEADER */}
//         <section>
//           <h1 className="text-3xl font-bold">My Projects</h1>
//           <p className="text-gray-600 mt-1">
//             Track all your volunteer work in one place.
//           </p>
//         </section>

//         {/* TABS */}
//         <section className="flex gap-4 border-b pb-3">
//           <TabButton label="Active" tab="ACTIVE" activeTab={activeTab} />
//           <TabButton label="Pending" tab="PENDING" activeTab={activeTab} />
//           <TabButton label="Completed" tab="COMPLETED" activeTab={activeTab} />
//         </section>

//         {/* PROJECT LIST */}
//         <section>
//           {visibleApps.length === 0 ? (
//             <p className="text-gray-600">
//               No {activeTab.toLowerCase()} projects found.
//             </p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//               {visibleApps.map((app) => {
//                 const project = app.project;
//                 const myReview = project.reviews.find(
//                   (r) => r.volunteerId === session.user.id
//                 );

//                 const isActive =
//                   app.status === "ACCEPTED" && project.status === "OPEN";

//                 return (
//                   <div
//                     key={app.id}
//                     className="relative bg-white border rounded-2xl p-6 hover:shadow-lg transition"
//                   >
//                     <div
//                       className={`absolute left-0 top-0 h-full w-1 ${
//                         activeTab === "COMPLETED"
//                           ? "bg-green-500"
//                           : isActive
//                           ? "bg-blue-500"
//                           : "bg-yellow-500"
//                       }`}
//                     />

//                     <h3 className="text-lg font-semibold">
//                       {project.title}
//                     </h3>

//                     <p className="text-sm text-gray-500 mt-1">
//                       {project.organization.name}
//                     </p>

//                     {activeTab === "COMPLETED" && (
//                       <div className="mt-4">
//                         {myReview ? (
//                           <div className="flex items-center gap-2">
//                             <StarRating rating={myReview.rating} />
//                             <span className="text-sm text-gray-600">
//                               {myReview.rating}/5
//                             </span>
//                           </div>
//                         ) : (
//                           <span className="text-xs text-orange-600 font-medium">
//                             Awaiting review
//                           </span>
//                         )}
//                       </div>
//                     )}

//                     <div className="mt-6">
//                       <a
//                         href={`/projects/${project.id}`}
//                         className="text-sm font-medium text-blue-600 hover:underline"
//                       >
//                         View project →
//                       </a>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </section>

//       </main>
//     </div>
//   );
// }

// /* ================= HELPERS ================= */

// function TabButton({
//   label,
//   tab,
//   activeTab,
// }: {
//   label: string;
//   tab: Tab;
//   activeTab: Tab;
// }) {
//   const isActive = tab === activeTab;

//   return (
//     <a
//       href={`/dashboard/projects?tab=${tab}`}
//       className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//         isActive
//           ? "bg-blue-600 text-white"
//           : "text-gray-600 hover:bg-gray-100"
//       }`}
//     >
//       {label}
//     </a>
//   );
// }




// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import StarRating from "@/components/StarRating";
// import SidebarShell from "@/components/sidebar/SidebarShell";
// import SidebarItem from "@/components/sidebar/SidebarItem";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// type Tab = "ACTIVE" | "PENDING" | "COMPLETED";

// export default async function DashboardProjectsPage({
//   searchParams,
// }: {
//   searchParams?: Promise<{ tab?: string }>;
// }) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER") {
//     redirect("/login");
//   }

//   const params = await searchParams;

//   const activeTab: Tab =
//     params?.tab === "COMPLETED"
//       ? "COMPLETED"
//       : params?.tab === "PENDING"
//       ? "PENDING"
//       : "ACTIVE";

//   const applications = await prisma.application.findMany({
//     where: { volunteerId: session.user.id },
//     include: {
//       project: {
//         include: {
//           organization: { select: { name: true } },
//           reviews: true,
//           mentor: {
//             select: {
//               id: true,
//               name: true,
//               username: true,
//             },
//           },
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   });

//   const activeApps = applications.filter(
//     (a) => a.status === "ACCEPTED" && a.project.status === "OPEN"
//   );

//   const pendingApps = applications.filter((a) => a.status === "PENDING");

//   const completedApps = applications.filter(
//     (a) => a.status === "COMPLETED" && a.project.status === "COMPLETED"
//   );

//   const visibleApps =
//     activeTab === "ACTIVE"
//       ? activeApps
//       : activeTab === "PENDING"
//       ? pendingApps
//       : completedApps;

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <SidebarShell>
//         <SidebarItem href="/dashboard" label="Dashboard" icon="🏠" />
//         <SidebarItem href="/dashboard/projects" label="Projects" icon="💼" active />
//         <SidebarItem href="/portfolio" label="Portfolio" icon="🌍" />
//         <SidebarItem href="/dashboard/messages" label="Messages" icon="💬" />
//         <SidebarItem href="/dashboard/settings" label="Settings" icon="⚙️" />
//       </SidebarShell>

//       <main className="flex-1 px-10 py-10 space-y-10">
//         <section>
//           <h1 className="text-3xl font-bold">My Projects</h1>
//           <p className="text-gray-600 mt-1">
//             Track all your volunteer work in one place.
//           </p>
//         </section>

//         <section className="flex gap-4 border-b pb-3">
//           <TabButton label="Active" tab="ACTIVE" activeTab={activeTab} />
//           <TabButton label="Pending" tab="PENDING" activeTab={activeTab} />
//           <TabButton label="Completed" tab="COMPLETED" activeTab={activeTab} />
//         </section>

//         <section>
//           {visibleApps.length === 0 ? (
//             <p className="text-gray-600">
//               No {activeTab.toLowerCase()} projects found.
//             </p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//               {visibleApps.map((app) => {
//                 const project = app.project;
//                 const myReview = project.reviews.find(
//                   (r) => r.volunteerId === session.user.id
//                 );

//                 const isActive =
//                   app.status === "ACCEPTED" && project.status === "OPEN";

//                 const isInvited = app.source === "ORGANIZATION";

//                 return (
//                   <div
//                     key={app.id}
//                     className="relative bg-white border rounded-2xl p-6 hover:shadow-lg transition"
//                   >
//                     <div
//                       className={`absolute left-0 top-0 h-full w-1 ${
//                         activeTab === "COMPLETED"
//                           ? "bg-green-500"
//                           : isActive
//                           ? "bg-blue-500"
//                           : "bg-yellow-500"
//                       }`}
//                     />

//                     <h3 className="text-lg font-semibold">{project.title}</h3>

//                     <div className="mt-1 flex flex-wrap items-center gap-2">
//                       <p className="text-sm text-gray-500">
//                         {project.organization.name}
//                       </p>

//                       {isInvited && (
//                         <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-1 text-[11px] font-semibold text-purple-700">
//                           Invited by organization
//                         </span>
//                       )}

//                       {!isInvited && app.status === "PENDING" && (
//                         <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
//                           Applied by you
//                         </span>
//                       )}
//                     </div>

//                     {activeTab === "COMPLETED" && (
//                       <div className="mt-4">
//                         {myReview ? (
//                           <div className="flex items-center gap-2">
//                             <StarRating rating={myReview.rating} />
//                             <span className="text-sm text-gray-600">
//                               {myReview.rating}/5
//                             </span>
//                           </div>
//                         ) : (
//                           <span className="text-xs text-orange-600 font-medium">
//                             Awaiting review
//                           </span>
//                         )}
//                       </div>
//                     )}

//                     <div className="mt-6">
//                       <a
//                         href={`/projects/${project.id}`}
//                         className="text-sm font-medium text-blue-600 hover:underline"
//                       >
//                         View project →
//                       </a>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }

// function TabButton({
//   label,
//   tab,
//   activeTab,
// }: {
//   label: string;
//   tab: Tab;
//   activeTab: Tab;
// }) {
//   const isActive = tab === activeTab;

//   return (
//     <a
//       href={`/dashboard/projects?tab=${tab}`}
//       className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
//         isActive
//           ? "bg-blue-600 text-white"
//           : "text-gray-600 hover:bg-gray-100"
//       }`}
//     >
//       {label}
//     </a>
//   );
// }



import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import StarRating from "@/components/StarRating";
import SidebarShell from "@/components/sidebar/SidebarShell";
import SidebarItem from "@/components/sidebar/SidebarItem";
import InviteResponseButtons from "@/components/projects/InviteResponseButtons";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Tab = "ACTIVE" | "PENDING" | "COMPLETED";

export default async function DashboardProjectsPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VOLUNTEER") {
    redirect("/login");
  }

  const params = await searchParams;

  const activeTab: Tab =
    params?.tab === "COMPLETED"
      ? "COMPLETED"
      : params?.tab === "PENDING"
      ? "PENDING"
      : "ACTIVE";

  const applications = await prisma.application.findMany({
    where: { volunteerId: session.user.id },
    include: {
      project: {
        include: {
          organization: { select: { name: true } },
          reviews: true,
          mentor: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const activeApps = applications.filter(
    (a) => a.status === "ACCEPTED" && a.project.status === "OPEN"
  );

  const pendingApps = applications.filter((a) => a.status === "PENDING");

  const completedApps = applications.filter(
    (a) => a.status === "COMPLETED" && a.project.status === "COMPLETED"
  );

  const visibleApps =
    activeTab === "ACTIVE"
      ? activeApps
      : activeTab === "PENDING"
      ? pendingApps
      : completedApps;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarShell>
        <SidebarItem href="/dashboard" label="Dashboard" icon="🏠" />
        <SidebarItem href="/dashboard/projects" label="Projects" icon="💼" active />
        <SidebarItem href="/portfolio" label="Portfolio" icon="🌍" />
        <SidebarItem href="/dashboard/messages" label="Messages" icon="💬" />
        <SidebarItem href="/dashboard/settings" label="Settings" icon="⚙️" />
      </SidebarShell>

      <main className="flex-1 px-10 py-10 space-y-10">
        <section>
          <h1 className="text-3xl font-bold">My Projects</h1>
          <p className="text-gray-600 mt-1">
            Track all your volunteer work in one place.
          </p>
        </section>

        <section className="flex gap-4 border-b pb-3">
          <TabButton label="Active" tab="ACTIVE" activeTab={activeTab} />
          <TabButton label="Pending" tab="PENDING" activeTab={activeTab} />
          <TabButton label="Completed" tab="COMPLETED" activeTab={activeTab} />
        </section>

        <section>
          {visibleApps.length === 0 ? (
            <p className="text-gray-600">
              No {activeTab.toLowerCase()} projects found.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {visibleApps.map((app) => {
                const project = app.project;
                const myReview = project.reviews.find(
                  (r) => r.volunteerId === session.user.id
                );

                const isActive =
                  app.status === "ACCEPTED" && project.status === "OPEN";

                const isInvited = app.source === "ORGANIZATION";
                const canRespondToInvite =
                  isInvited && app.status === "PENDING";

                return (
                  <div
                    key={app.id}
                    className="relative bg-white border rounded-2xl p-6 hover:shadow-lg transition"
                  >
                    <div
                      className={`absolute left-0 top-0 h-full w-1 ${
                        activeTab === "COMPLETED"
                          ? "bg-green-500"
                          : isActive
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                      }`}
                    />

                    <h3 className="text-lg font-semibold">{project.title}</h3>

                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <p className="text-sm text-gray-500">
                        {project.organization.name}
                      </p>

                      {isInvited && (
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-1 text-[11px] font-semibold text-purple-700">
                          Invited by organization
                        </span>
                      )}

                      {!isInvited && app.status === "PENDING" && (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                          Applied by you
                        </span>
                      )}
                    </div>

                    {canRespondToInvite && (
                      <InviteResponseButtons applicationId={app.id} />
                    )}

                    {activeTab === "COMPLETED" && (
                      <div className="mt-4">
                        {myReview ? (
                          <div className="flex items-center gap-2">
                            <StarRating rating={myReview.rating} />
                            <span className="text-sm text-gray-600">
                              {myReview.rating}/5
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-orange-600 font-medium">
                            Awaiting review
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-6">
                      <a
                        href={`/projects/${project.id}`}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        View project →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function TabButton({
  label,
  tab,
  activeTab,
}: {
  label: string;
  tab: Tab;
  activeTab: Tab;
}) {
  const isActive = tab === activeTab;

  return (
    <a
      href={`/dashboard/projects?tab=${tab}`}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {label}
    </a>
  );
}
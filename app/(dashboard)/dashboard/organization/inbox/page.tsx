



// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export default async function OrganizationInbox() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
//     redirect("/login");
//   }

//   const applications = await prisma.application.findMany({
//     where: {
//       project: {
//         organizationId: session.user.id,
//       },
//     },
//     include: {
//       volunteer: { select: { name: true, email: true } },
//       project: {
//         include: {
//           chat: {
//             include: {
//               messages: {
//                 where: {
//                   senderId: { not: session.user.id },
//                   isSystem: false,
//                   reads: {
//                     none: {
//                       userId: session.user.id,
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   });

//   const appsWithUnread = applications.map((app) => ({
//     ...app,
//     unreadCount: app.project.chat?.messages.length ?? 0,
//   }));

//   const count = appsWithUnread.reduce((sum, app) => sum + app.unreadCount, 0);

//   return (
//     <main className="p-10 space-y-6">
//       <h1 className="text-3xl font-bold flex items-center gap-3">
//         Inbox
//         {count > 0 && (
//           <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
//             {count}
//           </span>
//         )}
//       </h1>

//       <p className="text-gray-600">
//         Volunteer applications and project chats
//       </p>

//       {applications.length === 0 ? (
//         <p className="text-gray-600">No applications yet.</p>
//       ) : (
//         <div className="space-y-4">
//           {appsWithUnread.map((app) => (
//             <div
//               key={app.id}
//               className="bg-white border rounded-xl p-6 flex justify-between items-center"
//             >
//               <div>
//                 <h3 className="font-semibold text-lg">
//                   {app.project.title}
//                 </h3>

//                 <p className="text-sm text-gray-500">
//                   Volunteer: {app.volunteer.name}
//                 </p>

//                 <span
//                   className={`inline-block mt-2 text-xs px-3 py-1 rounded-full ${
//                     app.status === "ACCEPTED"
//                       ? "bg-green-100 text-green-700"
//                       : app.status === "REJECTED"
//                       ? "bg-red-100 text-red-700"
//                       : "bg-yellow-100 text-yellow-700"
//                   }`}
//                 >
//                   {app.status}
//                 </span>
//               </div>

//               <div className="flex gap-3">
//                 {app.status === "PENDING" && (
//                   <>
//                     <form
//                       action="/api/projects/applications/accept"
//                       method="POST"
//                     >
//                       <input
//                         type="hidden"
//                         name="applicationId"
//                         value={app.id}
//                       />
//                       <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
//                         Accept
//                       </button>
//                     </form>

//                     <form
//                       action="/api/projects/applications/reject"
//                       method="POST"
//                     >
//                       <input
//                         type="hidden"
//                         name="applicationId"
//                         value={app.id}
//                       />
//                       <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
//                         Reject
//                       </button>
//                     </form>
//                   </>
//                 )}

//                 {app.project.chat && (
//                   <a
//                     href={`/dashboard/projects/${app.project.id}/chat`}
//                     className="relative bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
//                   >
//                     Open Chat

//                     {app.unreadCount > 0 && (
//                       <span className="ml-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
//                         {app.unreadCount}
//                       </span>
//                     )}
//                   </a>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }





import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

function getStatusStyles(status: string) {
  switch (status) {
    case "ACCEPTED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "REJECTED":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export default async function OrganizationInbox() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
    redirect("/login");
  }

  const applications = await prisma.application.findMany({
    where: {
      project: {
        organizationId: session.user.id,
      },
    },
    include: {
      volunteer: { select: { name: true, email: true } },
      project: {
        include: {
          chat: {
            include: {
              messages: {
                where: {
                  senderId: { not: session.user.id },
                  isSystem: false,
                  reads: {
                    none: {
                      userId: session.user.id,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const appsWithUnread = applications.map((app) => ({
    ...app,
    unreadCount: app.project.chat?.messages.length ?? 0,
  }));

  const count = appsWithUnread.reduce((sum, app) => sum + app.unreadCount, 0);
  const pendingCount = applications.filter((app) => app.status === "PENDING").length;
  const acceptedCount = applications.filter((app) => app.status === "ACCEPTED").length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 md:px-8 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* HERO / HEADER */}
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="relative px-6 py-8 md:px-8 md:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_24%)]" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  Organization Inbox
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                    Inbox
                  </h1>

                  {count > 0 && (
                    <span className="inline-flex items-center rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                      {count} unread
                    </span>
                  )}
                </div>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                  Review volunteer applications, manage decisions, and jump into
                  project conversations with unread messages highlighted clearly.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center sm:min-w-[130px]">
                  <p className="text-2xl font-bold text-slate-900">
                    {applications.length}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    Applications
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center sm:min-w-[130px]">
                  <p className="text-2xl font-bold text-slate-900">
                    {pendingCount}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    Pending
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center sm:min-w-[130px]">
                  <p className="text-2xl font-bold text-slate-900">{count}</p>
                  <p className="text-xs font-medium text-slate-500">
                    Unread Chats
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK INSIGHTS */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">
              Total Unread Messages
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {count}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Messages sent by volunteers that still need your attention.
            </p>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">
              Pending Decisions
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {pendingCount}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Volunteer applications waiting for acceptance or rejection.
            </p>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">
              Accepted Volunteers
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {acceptedCount}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Applicants currently approved to work on your projects.
            </p>
          </div>
        </section>

        {/* LIST */}
        {applications.length === 0 ? (
          <section className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
                📥
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                No applications yet
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Once volunteers apply to your projects, their applications and
                conversations will appear here.
              </p>
            </div>
          </section>
        ) : (
          <section className="space-y-5">
            {appsWithUnread.map((app) => (
              <article
                key={app.id}
                className="overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] md:p-7"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  {/* LEFT CONTENT */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-4 flex flex-wrap items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg text-white shadow-sm">
                        💬
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                            {app.project.title}
                          </h3>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(
                              app.status
                            )}`}
                          >
                            {formatStatus(app.status)}
                          </span>

                          {app.unreadCount > 0 && (
                            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                              {app.unreadCount} unread
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                          Volunteer application and conversation thread
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Volunteer Name
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {app.volunteer.name}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Volunteer Email
                        </p>
                        <p className="mt-2 break-all text-sm font-medium text-slate-700">
                          {app.volunteer.email}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Chat Status
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {app.project.chat
                            ? app.unreadCount > 0
                              ? "Unread messages waiting"
                              : "No unread messages"
                            : "Chat not available"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT ACTION PANEL */}
                  <div className="w-full lg:w-auto lg:min-w-[280px]">
                    <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-900">
                        Actions
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Review the application, respond to the volunteer, and
                        continue the project conversation.
                      </p>

                      <div className="mt-4 space-y-3">
                        {app.status === "PENDING" && (
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                            <form
                              action="/api/projects/applications/accept"
                              method="POST"
                            >
                              <input
                                type="hidden"
                                name="applicationId"
                                value={app.id}
                              />
                              <button className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                                Accept
                              </button>
                            </form>

                            <form
                              action="/api/projects/applications/reject"
                              method="POST"
                            >
                              <input
                                type="hidden"
                                name="applicationId"
                                value={app.id}
                              />
                              <button className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-rose-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700">
                                Reject
                              </button>
                            </form>
                          </div>
                        )}

                        {app.project.chat && (
                          <Link
                            href={`/dashboard/projects/${app.project.id}/chat`}
                            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                          >
                            Open Chat
                            {app.unreadCount > 0 && (
                              <span className="rounded-full bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white">
                                {app.unreadCount}
                              </span>
                            )}
                          </Link>
                        )}

                        {!app.project.chat && (
                          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                            Chat will appear when a conversation is available for
                            this project.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
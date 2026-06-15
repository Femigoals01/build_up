


// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import Link from "next/link";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export const dynamic = "force-dynamic";

// function getStatusStyles(status: string) {
//   switch (status) {
//     case "OPEN":
//       return "border-blue-200 bg-blue-50 text-blue-700";
//     case "IN_PROGRESS":
//       return "border-amber-200 bg-amber-50 text-amber-700";
//     case "RESOLVED":
//       return "border-emerald-200 bg-emerald-50 text-emerald-700";
//     case "CLOSED":
//       return "border-slate-200 bg-slate-100 text-slate-700";
//     default:
//       return "border-slate-200 bg-slate-50 text-slate-700";
//   }
// }

// export default async function SupportTicketsPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || !session.user.id) {
//     redirect("/login");
//   }

//   const tickets = await prisma.supportMessage.findMany({
//     where: {
//       userId: session.user.id,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });

//   return (
//     <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8 lg:px-10">
//       <div className="mx-auto max-w-6xl space-y-6">
//         <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
//           <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
//             <div>
//               <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
//                 Support Center
//               </p>

//               <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
//                 My Support Tickets
//               </h1>

//               <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
//                 Track your submitted support requests using your BuildUp ticket
//                 reference number.
//               </p>
//             </div>

//             <Link
//               href="/support"
//               className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
//             >
//               Submit New Request
//             </Link>
//           </div>
//         </section>

//         {tickets.length === 0 ? (
//           <section className="rounded-[30px] border border-dashed border-slate-300 bg-white p-10 text-center">
//             <h2 className="text-xl font-black text-slate-900">
//               No support tickets yet
//             </h2>

//             <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
//               When you submit a support request, your ticket reference number
//               and status will appear here.
//             </p>

//             <Link
//               href="/support"
//               className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
//             >
//               Contact Support
//             </Link>
//           </section>
//         ) : (
//           <section className="space-y-4">
//             {tickets.map((ticket) => (
//               <div
//                 key={ticket.id}
//                 className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md md:p-6"
//               >
//                 <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
//                   <div>
//                     <div className="flex flex-wrap items-center gap-2">
//                       <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 font-mono text-xs font-bold text-blue-700">
//                         {ticket.ticketNo || "No Ticket No"}
//                       </span>

//                       <span
//                         className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyles(
//                           ticket.status
//                         )}`}
//                       >
//                         {ticket.status.replaceAll("_", " ")}
//                       </span>

//                       <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
//                         {ticket.category || "General"}
//                       </span>
//                     </div>

//                     <h2 className="mt-4 text-xl font-black tracking-tight text-slate-900">
//                       {ticket.subject}
//                     </h2>

//                     <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
//                       {ticket.message}
//                     </p>
//                   </div>

//                   <div className="shrink-0 text-left md:text-right">
//                     <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
//                       Submitted
//                     </p>

//                     <p className="mt-2 text-sm font-semibold text-slate-700">
//                       {new Date(ticket.createdAt).toLocaleDateString("en-GB", {
//                         day: "numeric",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </section>
//         )}
//       </div>
//     </main>
//   );
// }


import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function getStatusStyles(status: string) {
  switch (status) {
    case "OPEN":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "IN_PROGRESS":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "RESOLVED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "CLOSED":
      return "border-slate-200 bg-slate-100 text-slate-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

export default async function SupportTicketsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.id) {
    redirect("/login");
  }

  const tickets = await prisma.supportMessage.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                Support Center
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                My Support Tickets
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Track your submitted support requests using your BuildUp ticket
                reference number.
              </p>
            </div>

            <Link
              href="/support"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Submit New Request
            </Link>
          </div>
        </section>

        {tickets.length === 0 ? (
          <section className="rounded-[30px] border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-xl font-black text-slate-900">
              No support tickets yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              When you submit a support request, your ticket reference number
              and status will appear here.
            </p>

            <Link
              href="/support"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Contact Support
            </Link>
          </section>
        ) : (
          <section className="space-y-5">
            {tickets.map((ticket) => {
              const hasReply = Boolean(ticket.adminReply?.trim());

              return (
                <div
                  key={ticket.id}
                  className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="p-5 md:p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 font-mono text-xs font-bold text-blue-700">
                            {ticket.ticketNo || "No Ticket No"}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyles(
                              ticket.status
                            )}`}
                          >
                            {formatStatus(ticket.status)}
                          </span>

                          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                            {ticket.category || "General"}
                          </span>

                          {hasReply ? (
                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                              Replied
                            </span>
                          ) : (
                            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                              Awaiting Response
                            </span>
                          )}
                        </div>

                        <h2 className="mt-4 text-xl font-black tracking-tight text-slate-900">
                          {ticket.subject}
                        </h2>

                        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                            Your Message
                          </p>

                          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">
                            {ticket.message}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 text-left md:text-right">
                        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                          Submitted
                        </p>

                        <p className="mt-2 text-sm font-semibold text-slate-700">
                          {new Date(ticket.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>

                        {ticket.repliedAt ? (
                          <>
                            <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                              Last Reply
                            </p>

                            <p className="mt-2 text-sm font-semibold text-slate-700">
                              {new Date(ticket.repliedAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {hasReply ? (
                    <div className="border-t border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-5 md:p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-black text-white shadow-sm">
                          B
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                            BuildUp Support Reply
                          </p>

                          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
                            {ticket.adminReply}
                          </p>

                          {ticket.repliedAt ? (
                            <p className="mt-4 text-xs font-semibold text-emerald-700">
                              Replied{" "}
                              {new Date(ticket.repliedAt).toLocaleString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border-t border-amber-100 bg-amber-50/50 p-5 md:p-6">
                      <p className="text-sm font-semibold text-amber-800">
                        BuildUp Support has not replied yet. Please keep your
                        ticket number for follow-up.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
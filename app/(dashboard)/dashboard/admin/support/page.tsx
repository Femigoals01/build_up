







// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import type { SupportMessage } from "@prisma/client";
// import Link from "next/link";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// type SupportStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

// export default async function AdminSupportPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   const messages: SupportMessage[] = await prisma.supportMessage.findMany({
//     orderBy: { createdAt: "desc" },
//   });

//   const openCount = messages.filter((m) => m.status === "OPEN").length;
//   const progressCount = messages.filter((m) => m.status === "IN_PROGRESS").length;
//   const resolvedCount = messages.filter((m) => m.status === "RESOLVED").length;
//   const closedCount = messages.filter((m) => m.status === "CLOSED").length;

//   async function updateStatus(id: string, status: SupportStatus) {
//     "use server";

//     await prisma.supportMessage.update({
//       where: { id },
//       data: { status },
//     });
//   }

//   return (
//     <main className="space-y-8 pb-8">
//       <section className="grid gap-4 md:grid-cols-4">
//         <MetricCard title="Open" value={openCount} tone="blue" />
//         <MetricCard title="In Progress" value={progressCount} tone="amber" />
//         <MetricCard title="Resolved" value={resolvedCount} tone="emerald" />
//         <MetricCard title="Closed" value={closedCount} tone="slate" />
//       </section>

//       <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
//         <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
//               Support Ticket Queue
//             </p>

//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//               All Support Requests
//             </h2>

//             <p className="mt-1 text-sm text-slate-500">
//               Track support requests using ticket references like BUP-SUP-2026-000001.
//             </p>
//           </div>

//           <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
//             {messages.length} total
//           </div>
//         </div>

//         {messages.length === 0 ? (
//           <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
//             <p className="text-slate-600">No support tickets yet.</p>
//           </div>
//         ) : (
//           <div className="overflow-hidden rounded-[24px] border border-slate-200">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-slate-200">
//                 <thead className="bg-slate-50/80">
//                   <tr>
//                     <TableHead>Ticket</TableHead>
//                     <TableHead>Subject</TableHead>
//                     <TableHead>User</TableHead>
//                     <TableHead>Category</TableHead>
//                     <TableHead>Priority</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Date</TableHead>
//                     <TableHead>Action</TableHead>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-200 bg-white">
//                   {messages.map((msg) => (
//                     <tr key={msg.id} className="hover:bg-slate-50/70">
//                       <td className="px-4 py-4 align-top">
//                         <p className="font-mono text-xs font-black text-blue-700">
//                           {msg.ticketNo || "No ticket"}
//                         </p>

//                         {msg.projectId ? (
//                           <p className="mt-2 font-mono text-[11px] font-semibold text-slate-500">
//                             Project: {msg.projectId}
//                           </p>
//                         ) : (
//                           <p className="mt-2 text-[11px] text-slate-400">
//                             No project linked
//                           </p>
//                         )}
//                       </td>

//                       <td className="max-w-[320px] px-4 py-4 align-top">
//                         <p className="font-semibold text-slate-900">
//                           {msg.subject}
//                         </p>

//                         <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
//                           {msg.message}
//                         </p>
//                       </td>

//                       <td className="px-4 py-4 align-top">
//                         <p className="text-sm font-medium text-slate-800">
//                           {msg.name}
//                         </p>

//                         <p className="mt-1 text-sm text-slate-500">
//                           {msg.email}
//                         </p>
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-700">
//                         {msg.category || "General"}
//                       </td>

//                       <td className="px-4 py-4 align-top">
//                         <PriorityBadge priority={msg.priority || "NORMAL"} />
//                       </td>

//                       <td className="px-4 py-4 align-top">
//                         <StatusBadge status={msg.status} />
//                       </td>

//                       <td className="px-4 py-4 align-top text-sm text-slate-500">
//                         {new Date(msg.createdAt).toLocaleDateString("en-GB", {
//                           day: "numeric",
//                           month: "short",
//                           year: "numeric",
//                         })}
//                       </td>

//                       <td className="px-4 py-4 align-top">


//                         <Link
//   href={`/dashboard/admin/support/${msg.id}`}
//   className="text-xs font-semibold text-blue-600 hover:underline"
// >
//   Open Ticket
// </Link>


//                         <div className="flex flex-col gap-2">
//                           <form action={updateStatus.bind(null, msg.id, "IN_PROGRESS")}>
//                             <button
//                               className="text-xs font-semibold text-amber-600 hover:underline disabled:opacity-40"
//                               type="submit"
//                               disabled={msg.status === "IN_PROGRESS"}
//                             >
//                               Mark In Progress
//                             </button>
//                           </form>

//                           <form action={updateStatus.bind(null, msg.id, "RESOLVED")}>
//                             <button
//                               className="text-xs font-semibold text-emerald-600 hover:underline disabled:opacity-40"
//                               type="submit"
//                               disabled={msg.status === "RESOLVED"}
//                             >
//                               Mark Resolved
//                             </button>
//                           </form>

//                           <form action={updateStatus.bind(null, msg.id, "CLOSED")}>
//                             <button
//                               className="text-xs font-semibold text-slate-600 hover:underline disabled:opacity-40"
//                               type="submit"
//                               disabled={msg.status === "CLOSED"}
//                             >
//                               Close Ticket
//                             </button>
//                           </form>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }

// function TableHead({ children }: { children: React.ReactNode }) {
//   return (
//     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//       {children}
//     </th>
//   );
// }

// function StatusBadge({ status }: { status: string }) {
//   const style =
//     status === "OPEN"
//       ? "bg-blue-50 text-blue-700"
//       : status === "IN_PROGRESS"
//       ? "bg-amber-50 text-amber-700"
//       : status === "RESOLVED"
//       ? "bg-emerald-50 text-emerald-700"
//       : "bg-slate-100 text-slate-700";

//   return (
//     <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
//       {status.replaceAll("_", " ")}
//     </span>
//   );
// }

// function PriorityBadge({ priority }: { priority: string }) {
//   const style =
//     priority === "URGENT"
//       ? "border-rose-200 bg-rose-50 text-rose-700"
//       : priority === "HIGH"
//       ? "border-orange-200 bg-orange-50 text-orange-700"
//       : priority === "LOW"
//       ? "border-slate-200 bg-slate-50 text-slate-600"
//       : "border-blue-200 bg-blue-50 text-blue-700";

//   return (
//     <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${style}`}>
//       {priority}
//     </span>
//   );
// }

// function MetricCard({
//   title,
//   value,
//   tone,
// }: {
//   title: string;
//   value: number;
//   tone: "blue" | "amber" | "emerald" | "slate";
// }) {
//   const toneMap = {
//     blue: "from-blue-50 to-white border-blue-100",
//     amber: "from-amber-50 to-white border-amber-100",
//     emerald: "from-emerald-50 to-white border-emerald-100",
//     slate: "from-slate-50 to-white border-slate-200",
//   };

//   return (
//     <div className={`rounded-2xl border bg-gradient-to-br p-5 shadow-sm ${toneMap[tone]}`}>
//       <p className="text-sm font-medium text-slate-500">{title}</p>
//       <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//         {value}
//       </p>
//     </div>
//   );
// }








import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import type { SupportMessage } from "@prisma/client";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SupportStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export default async function AdminSupportPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const messages: SupportMessage[] = await prisma.supportMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const openCount = messages.filter((m) => m.status === "OPEN").length;
  const progressCount = messages.filter((m) => m.status === "IN_PROGRESS").length;
  const resolvedCount = messages.filter((m) => m.status === "RESOLVED").length;
  const closedCount = messages.filter((m) => m.status === "CLOSED").length;

  async function updateStatus(id: string, status: SupportStatus) {
    "use server";

    await prisma.supportMessage.update({
      where: { id },
      data: { status },
    });
  }

  return (
    <main className="space-y-8 pb-8">
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Open" value={openCount} tone="blue" />
        <MetricCard title="In Progress" value={progressCount} tone="amber" />
        <MetricCard title="Resolved" value={resolvedCount} tone="emerald" />
        <MetricCard title="Closed" value={closedCount} tone="slate" />
      </section>

      <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
              Support Ticket Queue
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              All Support Requests
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Track support requests using ticket references like BUP-SUP-2026-000001.
            </p>
          </div>

          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
            {messages.length} total
          </div>
        </div>

        {messages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <p className="text-slate-600">No support tickets yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[24px] border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50/80">
                  <tr>
                    <TableHead>Ticket</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {messages.map((msg) => (
                    <tr key={msg.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-4 align-top">
                        <p className="font-mono text-xs font-black text-blue-700">
                          {msg.ticketNo || "No ticket"}
                        </p>

                        {msg.projectId ? (
                          <p className="mt-2 font-mono text-[11px] font-semibold text-slate-500">
                            Project: {msg.projectId}
                          </p>
                        ) : (
                          <p className="mt-2 text-[11px] text-slate-400">
                            No project linked
                          </p>
                        )}
                      </td>

                      <td className="max-w-[320px] px-4 py-4 align-top">
                        <p className="font-semibold text-slate-900">
                          {msg.subject}
                        </p>

                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                          {msg.message}
                        </p>
                      </td>

                      <td className="px-4 py-4 align-top">
                        <p className="text-sm font-medium text-slate-800">
                          {msg.name}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {msg.email}
                        </p>
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-slate-700">
                        {msg.category || "General"}
                      </td>

                      <td className="px-4 py-4 align-top">
                        <PriorityBadge priority={msg.priority || "NORMAL"} />
                      </td>

                      <td className="px-4 py-4 align-top">
                        <StatusBadge status={msg.status} />
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-slate-500">
                        {new Date(msg.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-4 py-4 align-top">
                        {/* <div className="flex flex-col gap-2"> */}

                        <div className="flex flex-col gap-2">
  <Link
    href={`/dashboard/admin/support/${msg.id}`}
    className="text-xs font-semibold text-blue-600 hover:underline"
  >
    Open Ticket
  </Link>
                          <form action={updateStatus.bind(null, msg.id, "IN_PROGRESS")}>
                            <button
                              className="text-xs font-semibold text-amber-600 hover:underline disabled:opacity-40"
                              type="submit"
                              disabled={msg.status === "IN_PROGRESS"}
                            >
                              Mark In Progress
                            </button>
                          </form>

                          <form action={updateStatus.bind(null, msg.id, "RESOLVED")}>
                            <button
                              className="text-xs font-semibold text-emerald-600 hover:underline disabled:opacity-40"
                              type="submit"
                              disabled={msg.status === "RESOLVED"}
                            >
                              Mark Resolved
                            </button>
                          </form>

                          <form action={updateStatus.bind(null, msg.id, "CLOSED")}>
                            <button
                              className="text-xs font-semibold text-slate-600 hover:underline disabled:opacity-40"
                              type="submit"
                              disabled={msg.status === "CLOSED"}
                            >
                              Close Ticket
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </th>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style =
    status === "OPEN"
      ? "bg-blue-50 text-blue-700"
      : status === "IN_PROGRESS"
      ? "bg-amber-50 text-amber-700"
      : status === "RESOLVED"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-slate-100 text-slate-700";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const style =
    priority === "URGENT"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : priority === "HIGH"
      ? "border-orange-200 bg-orange-50 text-orange-700"
      : priority === "LOW"
      ? "border-slate-200 bg-slate-50 text-slate-600"
      : "border-blue-200 bg-blue-50 text-blue-700";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${style}`}>
      {priority}
    </span>
  );
}

function MetricCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: number;
  tone: "blue" | "amber" | "emerald" | "slate";
}) {
  const toneMap = {
    blue: "from-blue-50 to-white border-blue-100",
    amber: "from-amber-50 to-white border-amber-100",
    emerald: "from-emerald-50 to-white border-emerald-100",
    slate: "from-slate-50 to-white border-slate-200",
  };

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-5 shadow-sm ${toneMap[tone]}`}>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}
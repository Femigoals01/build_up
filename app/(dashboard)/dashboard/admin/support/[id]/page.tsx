import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getStatusStyles(status: string) {
  if (status === "OPEN") return "border-blue-200 bg-blue-50 text-blue-700";
  if (status === "IN_PROGRESS")
    return "border-amber-200 bg-amber-50 text-amber-700";
  if (status === "RESOLVED")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";

  return "border-slate-200 bg-slate-100 text-slate-700";
}

function getPriorityStyles(priority: string) {
  if (priority === "URGENT") return "border-rose-200 bg-rose-50 text-rose-700";
  if (priority === "HIGH")
    return "border-orange-200 bg-orange-50 text-orange-700";
  if (priority === "LOW")
    return "border-slate-200 bg-slate-50 text-slate-600";

  return "border-blue-200 bg-blue-50 text-blue-700";
}

async function saveReply(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  const adminReply = String(formData.get("adminReply") || "").trim();

  if (!id || !adminReply) return;

  const ticket = await prisma.supportMessage.findUnique({
    where: { id },
  });

  if (!ticket) return;

  await prisma.supportMessage.update({
    where: { id },
    data: {
      adminReply,
      repliedAt: new Date(),
      status: ticket.status === "RESOLVED" || ticket.status === "CLOSED"
        ? ticket.status
        : "IN_PROGRESS",
    },
  });

  if (ticket.userId) {
    await prisma.notification.create({
      data: {
        userId: ticket.userId,
        title: "Support Ticket Updated",
        message: `Your support ticket ${
          ticket.ticketNo || "request"
        } has received a response from BuildUp Support.`,
        type: "SYSTEM",
        link: "/dashboard/support",
      },
    });
  }
}

async function updateStatus(formData: FormData) {
  "use server";

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");

  if (!id || !["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].includes(status)) {
    return;
  }

  await prisma.supportMessage.update({
    where: { id },
    data: { status },
  });
}

export default async function AdminSupportTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const { id } = await params;

  const ticket = await prisma.supportMessage.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          username: true,
        },
      },
      project: {
        select: {
          id: true,
          title: true,
          referenceNo: true,
          status: true,
        },
      },
    },
  });

  if (!ticket) {
    notFound();
  }

  return (
    <main className="space-y-8 pb-8">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Link
              href="/dashboard/admin/support"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              ← Back to support queue
            </Link>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Support Ticket
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              {ticket.subject}
            </h1>

            <p className="mt-3 font-mono text-sm font-bold text-blue-700">
              {ticket.ticketNo || "No ticket number"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyles(
                ticket.status
              )}`}
            >
              {ticket.status.replaceAll("_", " ")}
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold ${getPriorityStyles(
                ticket.priority || "NORMAL"
              )}`}
            >
              {ticket.priority || "NORMAL"}
            </span>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
              {ticket.category || "General"}
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Original Message
            </p>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                {ticket.message}
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-blue-100 bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/40 p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Admin Reply
            </p>

            {ticket.adminReply ? (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="whitespace-pre-line text-sm leading-7 text-emerald-900">
                  {ticket.adminReply}
                </p>

                {ticket.repliedAt ? (
                  <p className="mt-4 text-xs font-semibold text-emerald-700">
                    Replied{" "}
                    {new Date(ticket.repliedAt).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                No reply has been sent yet.
              </p>
            )}

            <form action={saveReply} className="mt-5 space-y-4">
              <input type="hidden" name="id" value={ticket.id} />

              <textarea
                name="adminReply"
                defaultValue={ticket.adminReply || ""}
                rows={8}
                placeholder="Type your response to the user..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Save Reply
              </button>
            </form>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              User Details
            </p>

            <div className="mt-4 space-y-4">
              <InfoRow label="Name" value={ticket.name} />
              <InfoRow label="Email" value={ticket.email} />

              {ticket.user ? (
                <>
                  <InfoRow label="Account Role" value={ticket.user.role} />
                  <InfoRow
                    label="Username"
                    value={
                      ticket.user.username ? `@${ticket.user.username}` : "N/A"
                    }
                  />
                </>
              ) : (
                <InfoRow label="Account" value="Guest / not linked" />
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Linked Project
            </p>

            <div className="mt-4 space-y-4">
              {ticket.project ? (
                <>
                  <InfoRow
                    label="Project Ref"
                    value={ticket.project.referenceNo || ticket.project.id}
                  />
                  <InfoRow label="Project Title" value={ticket.project.title} />
                  <InfoRow label="Project Status" value={ticket.project.status} />

                  <Link
                    href={`/dashboard/projects/${ticket.project.id}`}
                    className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
                  >
                    Open Project
                  </Link>
                </>
              ) : (
                <p className="text-sm text-slate-500">No project linked.</p>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Update Status
            </p>

            <div className="mt-4 grid gap-2">
              {(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const).map(
                (status) => (
                  <form key={status} action={updateStatus}>
                    <input type="hidden" name="id" value={ticket.id} />
                    <input type="hidden" name="status" value={status} />

                    <button
                      type="submit"
                      disabled={ticket.status === status}
                      className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Mark {status.replaceAll("_", " ")}
                    </button>
                  </form>
                )
              )}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}
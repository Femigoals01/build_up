import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import OpenNotificationButton from "@/components/notifications/OpenNotificationButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getIcon(type?: string | null) {
  switch (type) {
    case "APPLICATION":
      return "📩";
    case "PAYMENT":
      return "💳";
    case "SUBMISSION":
      return "📤";
    case "DEADLINE":
      return "⏰";
    case "PROJECT":
      return "🚀";
    case "REVIEW":
      return "⭐";
    case "BADGE":
      return "🏆";
    case "MESSAGE":
      return "💬";
    default:
      return "🔔";
  }
}

function getCardStyle(type?: string | null, isRead?: boolean) {
  if (isRead) return "border-slate-200 bg-white";

  switch (type) {
    case "DEADLINE":
      return "border-red-200 bg-red-50";
    case "PAYMENT":
      return "border-emerald-200 bg-emerald-50";
    case "SUBMISSION":
      return "border-amber-200 bg-amber-50";
    case "APPLICATION":
      return "border-purple-200 bg-purple-50";
    default:
      return "border-blue-200 bg-blue-50";
  }
}

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                Notification Center
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                Your updates
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Track project alerts, payments, deadlines, submissions, reviews,
                and account updates.
              </p>
            </div>

            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {unreadCount} unread
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          {notifications.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-2xl shadow-sm">
                🔔
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                No notifications yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Your important BuildUp updates will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-[24px] border p-5 shadow-sm ${getCardStyle(
                    notification.type,
                    notification.isRead
                  )}`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
                        {getIcon(notification.type)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base font-bold text-slate-950">
                            {notification.title || "Notification"}
                          </h2>

                          {!notification.isRead && (
                            <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                              New
                            </span>
                          )}

                          {notification.type && (
                            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                              {notification.type}
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {notification.message ||
                            "You have a new notification."}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {notification.link ? (
                      <OpenNotificationButton
                        notificationId={notification.id}
                        href={notification.link}
                        label={notification.isRead ? "Open" : "Open & mark read"}
                      />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <Link
          href="/dashboard"
          className="inline-flex rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          ← Back to dashboard
        </Link>
      </div>
    </main>
  );
}
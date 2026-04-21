


import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function getStatusStyles(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "ACCEPTED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "COMPLETED":
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

export default async function OrganizationInviteHistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
    redirect("/login");
  }

  const invites = await prisma.application.findMany({
    where: {
      source: "ORGANIZATION",
      project: {
        organizationId: session.user.id,
      },
    },
    include: {
      volunteer: {
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
        },
      },
      project: {
        select: {
          id: true,
          title: true,
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 md:px-8 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="px-6 py-8 md:px-8 md:py-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  Invite History
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  Organization invites
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                  Track volunteers you invited, what project they were invited to,
                  and whether they accepted or are still pending.
                </p>
              </div>

              <Link
                href="/dashboard/organization"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          {invites.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
              <div className="mx-auto max-w-md">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  📩
                </div>
                <h2 className="mt-4 text-xl font-semibold text-slate-900">
                  No invites yet
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Once you invite volunteers from their public portfolios, they
                  will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    <th className="px-4 py-2">Volunteer</th>
                    <th className="px-4 py-2">Project</th>
                    <th className="px-4 py-2">Invite Status</th>
                    <th className="px-4 py-2">Project Status</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {invites.map((invite) => (
                    <tr
                      key={invite.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50"
                    >
                      <td className="rounded-l-2xl px-4 py-4">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {invite.volunteer.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            @{invite.volunteer.username}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-900">
                          {invite.project.title}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(
                            invite.status
                          )}`}
                        >
                          {formatStatus(invite.status)}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                          {formatStatus(invite.project.status)}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600">
                        {new Date(invite.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="rounded-r-2xl px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/portfolio/${invite.volunteer.username}`}
                            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            View Portfolio
                          </Link>

                          <Link
                            href={`/dashboard/projects/${invite.project.id}`}
                            className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                          >
                            View Project
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
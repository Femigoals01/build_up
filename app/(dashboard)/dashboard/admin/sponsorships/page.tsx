import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatNaira(kobo: number) {
  return `₦${(kobo / 100).toLocaleString("en-NG", {
    maximumFractionDigits: 0,
  })}`;
}

function formatDate(date?: Date | null) {
  if (!date) return "Not set";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function statusStyle(status: string) {
  if (status === "PAID") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "DISPUTED") return "border-red-200 bg-red-50 text-red-700";
  if (status === "FAILED") return "border-slate-200 bg-slate-50 text-slate-600";
  return "border-amber-200 bg-amber-50 text-amber-700";
}

function isActive(expiresAt?: Date | null) {
  if (!expiresAt) return false;
  return expiresAt.getTime() > Date.now();
}

export default async function AdminSponsorshipsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const sponsorships = await prisma.opportunitySponsorship.findMany({
    include: {
      opportunity: {
        select: {
          id: true,
          title: true,
          type: true,
          featured: true,
          featuredUntil: true,
          organization: {
            select: {
              id: true,
              name: true,
              email: true,
              organizationVerified: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  const paidSponsorships = sponsorships.filter((item) => item.status === "PAID");
  const totalRevenue = paidSponsorships.reduce((sum, item) => sum + item.amount, 0);
  const activeSponsorships = paidSponsorships.filter((item) => isActive(item.expiresAt));
  const pendingSponsorships = sponsorships.filter((item) => item.status === "UNPAID");
  const disputedSponsorships = sponsorships.filter((item) => item.status === "DISPUTED");

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-purple-700 px-6 py-10 text-white sm:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-100">
              Admin Revenue
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Sponsorship Revenue Dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-purple-100 sm:text-base">
              Track promoted opportunities, sponsorship revenue, active campaigns,
              payment status, and organization advertising performance.
            </p>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-5 lg:p-8">
            <SummaryCard label="Total Revenue" value={formatNaira(totalRevenue)} purple />
            <SummaryCard label="Paid Sponsors" value={paidSponsorships.length} />
            <SummaryCard label="Active Campaigns" value={activeSponsorships.length} />
            <SummaryCard label="Pending Payments" value={pendingSponsorships.length} />
            <SummaryCard label="Disputed" value={disputedSponsorships.length} danger />
          </div>
        </section>

        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-600">
              Sponsorship Records
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900">
              Recent Sponsorship Payments
            </h2>
          </div>

          {sponsorships.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
                📢
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-900">
                No sponsorships yet
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Paid opportunity promotions will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Opportunity</th>
                    <th className="px-6 py-4">Organization</th>
                    <th className="px-6 py-4">Tier</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Active</th>
                    <th className="px-6 py-4">Paid At</th>
                    <th className="px-6 py-4">Expires</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {sponsorships.map((item) => {
                    const active = item.status === "PAID" && isActive(item.expiresAt);

                    return (
                      <tr key={item.id} className="hover:bg-purple-50/40">
                        <td className="px-6 py-4">
                          <p className="font-black text-slate-900">
                            {item.opportunity.title}
                          </p>

                          <p className="mt-1 text-xs font-bold text-slate-500">
                            {item.opportunity.type}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-black text-slate-900">
                            {item.opportunity.organization.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {item.opportunity.organization.email}
                          </p>
                        </td>

                        <td className="px-6 py-4 font-black text-purple-700">
                          {item.tier}
                        </td>

                        <td className="px-6 py-4 font-black text-slate-900">
                          {formatNaira(item.amount)}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-black ${statusStyle(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {active ? (
                            <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-black text-purple-700">
                              Active
                            </span>
                          ) : (
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">
                              No
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 font-bold text-slate-600">
                          {formatDate(item.paidAt)}
                        </td>

                        <td className="px-6 py-4 font-bold text-slate-600">
                          {formatDate(item.expiresAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <Link
          href="/dashboard/admin"
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50"
        >
          ← Back to Admin Dashboard
        </Link>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  purple = false,
  danger = false,
}: {
  label: string;
  value: string | number;
  purple?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <p
        className={`mt-3 text-2xl font-black ${
          purple
            ? "text-purple-600"
            : danger
              ? "text-red-600"
              : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
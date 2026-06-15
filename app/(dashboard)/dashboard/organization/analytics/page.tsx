

import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function getConversionRate(leads: number, views: number) {
  if (views === 0) return 0;
  return Math.round((leads / views) * 100);
}

function typeStyle(type: string) {
  if (type === "JOB") return "border-blue-200 bg-blue-50 text-blue-700";
  if (type === "PROMOTION") return "border-purple-200 bg-purple-50 text-purple-700";
  if (type === "EVENT") return "border-amber-200 bg-amber-50 text-amber-700";
  if (type === "COURSE") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

export default async function OrganizationAnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ORGANIZATION") {
    redirect("/login");
  }

  const opportunities = await prisma.opportunity.findMany({
    where: {
      organizationId: session.user.id,
    },
    include: {
      _count: {
        select: {
          leads: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalOpportunities = opportunities.length;
  const publishedOpportunities = opportunities.filter(
    (item) => item.status === "PUBLISHED"
  ).length;

  const sponsoredOpportunities = opportunities.filter(
    (item) => item.featured
  ).length;

  const totalViews = opportunities.reduce(
    (sum, item) => sum + item.views,
    0
  );

  const totalLeads = opportunities.reduce(
    (sum, item) => sum + item._count.leads,
    0
  );

  const overallConversionRate = getConversionRate(totalLeads, totalViews);

  const mostViewed = [...opportunities].sort(
    (a, b) => b.views - a.views
  )[0];

  const mostLeads = [...opportunities].sort(
    (a, b) => b._count.leads - a._count.leads
  )[0];

  const bestConversion = [...opportunities]
    .filter((item) => item.views > 0)
    .sort(
      (a, b) =>
        getConversionRate(b._count.leads, b.views) -
        getConversionRate(a._count.leads, a.views)
    )[0];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 px-6 py-10 text-white sm:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
              Organization Analytics
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Opportunity Performance
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
              Track views, leads, conversion rates, sponsored listings, and top
              performing opportunities from your organization.
            </p>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-5 lg:p-8">
            <StatCard label="Total Opportunities" value={totalOpportunities} />
            <StatCard label="Published" value={publishedOpportunities} />
            <StatCard label="Sponsored" value={sponsoredOpportunities} />
            <StatCard label="Total Views" value={totalViews} />
            <StatCard
              label="Total Leads"
              value={totalLeads}
              blue
            />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <PerformanceCard
            title="Most Viewed"
            opportunity={mostViewed}
            metric={mostViewed ? `${mostViewed.views} views` : "No data yet"}
          />

          <PerformanceCard
            title="Most Leads"
            opportunity={mostLeads}
            metric={mostLeads ? `${mostLeads._count.leads} leads` : "No data yet"}
          />

          <PerformanceCard
            title="Best Conversion"
            opportunity={bestConversion}
            metric={
              bestConversion
                ? `${getConversionRate(
                    bestConversion._count.leads,
                    bestConversion.views
                  )}% conversion`
                : "No data yet"
            }
          />
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                Conversion Overview
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-900">
                {overallConversionRate}% Overall Conversion
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Conversion is calculated as total leads divided by total views.
              </p>
            </div>

            <Link
              href="/dashboard/organization/opportunities/new"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700"
            >
              Post New Opportunity
            </Link>
          </div>

          <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{ width: `${Math.min(overallConversionRate, 100)}%` }}
            />
          </div>
        </section>

        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
              Opportunity Table
            </p>

            <h2 className="mt-2 text-2xl font-black text-slate-900">
              All Opportunity Performance
            </h2>
          </div>

          {opportunities.length === 0 ? (
            <div className="p-10 text-center text-sm font-semibold text-slate-500">
              No opportunities yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Opportunity</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Views</th>
                    <th className="px-6 py-4">Leads</th>
                    <th className="px-6 py-4">Conversion</th>
                    <th className="px-6 py-4">Sponsored</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {opportunities.map((item) => {
                    const conversion = getConversionRate(
                      item._count.leads,
                      item.views
                    );

                    return (
                      <tr key={item.id} className="hover:bg-blue-50/40">
                        <td className="px-6 py-4">
                          <p className="font-black text-slate-900">
                            {item.title}
                          </p>

                          <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                            {item.description}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-black ${typeStyle(
                              item.type
                            )}`}
                          >
                            {item.type}
                          </span>
                        </td>

                        <td className="px-6 py-4 font-bold text-slate-600">
                          {item.status}
                        </td>

                        <td className="px-6 py-4 font-black text-slate-900">
                          {item.views}
                        </td>

                        <td className="px-6 py-4 font-black text-slate-900">
                          {item._count.leads}
                        </td>

                        <td className="px-6 py-4 font-black text-blue-700">
                          {conversion}%
                        </td>

                        <td className="px-6 py-4">
                          {item.featured ? (
                            <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-black text-purple-700">
                              Active
                            </span>
                          ) : (
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">
                              No
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <Link
                            href={`/dashboard/organization/opportunities/${item.id}/leads`}
                            className="font-black text-blue-600 hover:text-blue-700"
                          >
                            View Leads →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  blue = false,
}: {
  label: string;
  value: number;
  blue?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <p
        className={`mt-3 text-3xl font-black ${
          blue ? "text-blue-600" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function PerformanceCard({
  title,
  opportunity,
  metric,
}: {
  title: string;
  opportunity: any;
  metric: string;
}) {
  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
        {title}
      </p>

      <h3 className="mt-3 text-xl font-black text-slate-900">
        {opportunity?.title || "No opportunity yet"}
      </h3>

      <p className="mt-2 text-sm font-bold text-slate-500">
        {metric}
      </p>
    </div>
  );
}
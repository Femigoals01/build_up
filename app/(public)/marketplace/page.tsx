



import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MarketplaceOpportunityCard from "@/components/marketplace/MarketplaceOpportunityCard";

export const dynamic = "force-dynamic";

type MarketplaceType =
  | "all"
  | "PROJECT"
  | "JOB"
  | "PROMOTION"
  | "EVENT"
  | "COURSE";

function getTypeTitle(type: MarketplaceType) {
  if (type === "PROJECT") return "Project Opportunities";
  if (type === "JOB") return "Job Opportunities";
  if (type === "PROMOTION") return "Business Promotions";
  if (type === "EVENT") return "Events";
  if (type === "COURSE") return "Courses";

  return "All Opportunities";
}

function isSponsoredActive(
  featured: boolean,
  featuredUntil?: Date | string | null
) {
  if (!featured || !featuredUntil) return false;
  return new Date(featuredUntil).getTime() > Date.now();
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams?: Promise<{ type?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const rawType = resolvedSearchParams.type || "all";

  const activeType: MarketplaceType = [
    "all",
    "PROJECT",
    "JOB",
    "PROMOTION",
    "EVENT",
    "COURSE",
  ].includes(rawType)
    ? (rawType as MarketplaceType)
    : "all";

  const opportunitiesRaw = await prisma.opportunity.findMany({
    where: {
      status: "PUBLISHED",
      ...(activeType !== "all" ? { type: activeType } : {}),
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          username: true,
          headline: true,
          country: true,
          profileImageUrl: true,
          organizationVerified: true,
        },
      },
      _count: {
        select: {
          leads: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  const opportunities = opportunitiesRaw
    .map((opportunity) => ({
      id: opportunity.id,
      title: opportunity.title,
      description: opportunity.description,
      type: opportunity.type,
      workMode: opportunity.workMode,
      location: opportunity.location,
      compensation: opportunity.compensation,
      applicationUrl: opportunity.applicationUrl,
      imageUrl: opportunity.imageUrl,
      featured: opportunity.featured,
      featuredUntil: opportunity.featuredUntil
        ? opportunity.featuredUntil.toISOString()
        : null,
      createdAt: opportunity.createdAt.toISOString(),
      sponsoredActive: isSponsoredActive(
        opportunity.featured,
        opportunity.featuredUntil
      ),
      organization: opportunity.organization,
      _count: opportunity._count,
    }))
    .sort((a, b) => {
      if (a.sponsoredActive !== b.sponsoredActive) {
        return a.sponsoredActive ? -1 : 1;
      }

      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });

  const allCounts = await prisma.opportunity.groupBy({
    by: ["type"],
    where: {
      status: "PUBLISHED",
    },
    _count: {
      type: true,
    },
  });

  const totalPublished = await prisma.opportunity.count({
    where: {
      status: "PUBLISHED",
    },
  });

  const featuredCount = await prisma.opportunity.count({
    where: {
      status: "PUBLISHED",
      featured: true,
      featuredUntil: {
        gt: new Date(),
      },
    },
  });

  const countMap = allCounts.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = item._count.type;
    return acc;
  }, {});

  const filters = [
    { label: "All", value: "all", href: "/marketplace", count: totalPublished },
    {
      label: "Projects",
      value: "PROJECT",
      href: "/marketplace?type=PROJECT",
      count: countMap.PROJECT || 0,
    },
    {
      label: "Jobs",
      value: "JOB",
      href: "/marketplace?type=JOB",
      count: countMap.JOB || 0,
    },
    {
      label: "Promotions",
      value: "PROMOTION",
      href: "/marketplace?type=PROMOTION",
      count: countMap.PROMOTION || 0,
    },
    {
      label: "Events",
      value: "EVENT",
      href: "/marketplace?type=EVENT",
      count: countMap.EVENT || 0,
    },
    {
      label: "Courses",
      value: "COURSE",
      href: "/marketplace?type=COURSE",
      count: countMap.COURSE || 0,
    },
  ] as const;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 px-4 pb-32 pt-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_32%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-slate-50" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur">
              🚀 BuildUp Marketplace
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight md:text-6xl">
              Opportunities Marketplace
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-blue-100">
              Discover projects, jobs, promotions, events, and courses from
              organizations building with the BuildUp community.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register/organization"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-6 text-sm font-black text-blue-700 transition hover:bg-blue-50"
              >
                Post an Opportunity
              </Link>

              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 text-sm font-black text-white transition hover:bg-white/15"
              >
                Join BuildUp
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Published Opportunities"
            value={String(totalPublished)}
          />
          <StatCard
            label="Active Sponsored Listings"
            value={String(featuredCount)}
          />
          <StatCard label="Organizations" value="BuildUp Network" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
              Explore Opportunities
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              {getTypeTitle(activeType)}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Find organization-backed opportunities and express interest
              directly through BuildUp.
            </p>
          </div>

          <Link
            href="/dashboard/organization/opportunities/new"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Post Opportunity
          </Link>
        </div>

        <div className="mb-8 flex flex-wrap gap-2 rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm">
          {filters.map((filter) => {
            const active = activeType === filter.value;

            return (
              <Link
                key={filter.value}
                href={filter.href}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-black transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <span>{filter.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    active ? "bg-white/20 text-white" : "bg-white text-slate-500"
                  }`}
                >
                  {filter.count}
                </span>
              </Link>
            );
          })}
        </div>

        {opportunities.length === 0 ? (
          <section className="rounded-[32px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
                📢
              </div>

              <h3 className="text-xl font-black text-slate-950">
                No opportunities yet
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Published opportunities will appear here once organizations
                start posting them.
              </p>
            </div>
          </section>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {opportunities.map((opportunity) => (
              <MarketplaceOpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}
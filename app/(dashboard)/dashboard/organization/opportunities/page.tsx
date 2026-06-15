





"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Opportunity = {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  workMode?: string | null;
  location?: string | null;
  compensation?: string | null;
  applicationUrl?: string | null;
  contactEmail?: string | null;
  imageUrl?: string | null;
  featured: boolean;
  sponsoredTier?: string | null;
  sponsoredAt?: string | null;
  featuredUntil?: string | null;
  views: number;
  leads: number;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  analytics?: {
    sponsoredViews: number;
    viewDetailsClicks: number;
    marketplaceClicks: number;
  };
  _count?: {
    leads: number;
  };
};

function typeStyle(type: string) {
  if (type === "JOB") return "border-blue-200 bg-blue-50 text-blue-700";
  if (type === "PROMOTION")
    return "border-purple-200 bg-purple-50 text-purple-700";
  if (type === "EVENT") return "border-amber-200 bg-amber-50 text-amber-700";
  if (type === "COURSE")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function statusStyle(status: string) {
  if (status === "PUBLISHED")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "PAUSED")
    return "border-amber-200 bg-amber-50 text-amber-700";
  if (status === "CLOSED") return "border-red-200 bg-red-50 text-red-700";

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function formatType(type: string) {
  return type
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(date?: string | null) {
  if (!date) return "Not set";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function getLeadCount(opportunity: Opportunity) {
  return opportunity._count?.leads ?? opportunity.leads ?? 0;
}

function getAnalyticsValue(
  opportunity: Opportunity,
  key: "sponsoredViews" | "viewDetailsClicks" | "marketplaceClicks"
) {
  return opportunity.analytics?.[key] ?? 0;
}

function getPaymentAlert(paymentStatus: string | null) {
  if (paymentStatus === "sponsor-success") {
    return {
      type: "success",
      title: "Sponsorship activated",
      message:
        "Your opportunity has been promoted successfully and is now featured on BuildUp.",
    };
  }

  if (paymentStatus === "failed") {
    return {
      type: "error",
      title: "Payment failed",
      message:
        "Your sponsorship payment was not completed. Please try again or choose another payment method.",
    };
  }

  if (paymentStatus === "amount-mismatch") {
    return {
      type: "error",
      title: "Payment amount mismatch",
      message:
        "The amount paid does not match the selected sponsorship plan. Please contact support.",
    };
  }

  if (paymentStatus === "error") {
    return {
      type: "error",
      title: "Payment verification error",
      message:
        "We could not verify the sponsorship payment. Please refresh or contact support if payment was deducted.",
    };
  }

  if (paymentStatus === "missing-reference") {
    return {
      type: "error",
      title: "Missing payment reference",
      message:
        "The payment reference was missing. Please try the sponsorship process again.",
    };
  }

  if (paymentStatus === "already-confirmed") {
    return {
      type: "success",
      title: "Payment already confirmed",
      message: "This sponsorship payment has already been confirmed.",
    };
  }

  if (paymentStatus === "sponsorship-not-found") {
    return {
      type: "error",
      title: "Sponsorship not found",
      message:
        "We could not find the sponsorship record for this payment. Please contact support.",
    };
  }

  return null;
}

function isSponsoredActive(opportunity: Opportunity) {
  if (!opportunity.featured) return false;
  if (!opportunity.featuredUntil) return true;

  return new Date(opportunity.featuredUntil).getTime() > Date.now();
}

export default function OrganizationOpportunitiesPage() {
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment");
  const paymentAlert = getPaymentAlert(paymentStatus);

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadOpportunities() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/opportunities?status=");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load opportunities.");
      }

      setOpportunities(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOpportunities();
  }, []);

  async function updateStatus(opportunityId: string, status: string) {
    try {
      setUpdatingId(opportunityId);
      setError("");
      setMessage("");

      const res = await fetch("/api/opportunities", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          opportunityId,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update opportunity.");
      }

      setMessage(`Opportunity ${status.toLowerCase()} successfully.`);
      await loadOpportunities();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setUpdatingId("");
    }
  }

  async function deleteOpportunity(opportunityId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this opportunity? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setUpdatingId(opportunityId);
      setError("");
      setMessage("");

      const res = await fetch("/api/opportunities", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          opportunityId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete opportunity.");
      }

      setMessage("Opportunity deleted successfully.");
      await loadOpportunities();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setUpdatingId("");
    }
  }

  const filteredOpportunities = useMemo(() => {
    if (filter === "ALL") return opportunities;

    return opportunities.filter((item) => item.type === filter);
  }, [opportunities, filter]);

  const totalLeads = useMemo(
    () => opportunities.reduce((sum, item) => sum + getLeadCount(item), 0),
    [opportunities]
  );

  const publishedCount = useMemo(
    () => opportunities.filter((item) => item.status === "PUBLISHED").length,
    [opportunities]
  );

  const promotionCount = useMemo(
    () => opportunities.filter((item) => item.type === "PROMOTION").length,
    [opportunities]
  );

  const sponsoredCount = useMemo(
    () => opportunities.filter((item) => isSponsoredActive(item)).length,
    [opportunities]
  );

  const sponsoredViewsCount = useMemo(
    () =>
      opportunities.reduce(
        (sum, item) => sum + getAnalyticsValue(item, "sponsoredViews"),
        0
      ),
    [opportunities]
  );

  const filters = [
    { label: "All", value: "ALL" },
    { label: "Projects", value: "PROJECT" },
    { label: "Jobs", value: "JOB" },
    { label: "Promotions", value: "PROMOTION" },
    { label: "Events", value: "EVENT" },
    { label: "Courses", value: "COURSE" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 px-6 py-10 text-white sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
                  Organization Opportunities
                </p>

                <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                  Manage Opportunities
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
                  Post jobs, promotions, courses, events, and other
                  organization opportunities that BuildUp users can discover and
                  respond to.
                </p>
              </div>

              <Link
                href="/dashboard/organization/opportunities/new"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-6 text-sm font-black text-blue-700 transition hover:bg-blue-50"
              >
                + Post Opportunity
              </Link>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-6 lg:p-8">
            <SummaryCard
              label="Total Opportunities"
              value={opportunities.length}
            />
            <SummaryCard label="Published" value={publishedCount} />
            <SummaryCard label="Promotions" value={promotionCount} />
            <SummaryCard label="Sponsored" value={sponsoredCount} purple />
            <SummaryCard label="Ad Views" value={sponsoredViewsCount} purple />
            <SummaryCard label="Leads Received" value={totalLeads} blue />
          </div>
        </section>

        {paymentAlert && (
          <div
            className={`rounded-2xl border px-4 py-4 text-sm font-bold ${
              paymentAlert.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <p className="font-black">{paymentAlert.title}</p>
            <p className="mt-1 font-semibold">{paymentAlert.message}</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
            {message}
          </div>
        )}

        <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => {
              const active = filter === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={`rounded-2xl px-4 py-2 text-sm font-black transition ${
                    active
                      ? "bg-blue-600 text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </section>

        {loading ? (
          <section className="rounded-[32px] border border-slate-200 bg-white p-8 text-sm font-bold text-slate-500 shadow-sm">
            Loading opportunities...
          </section>
        ) : filteredOpportunities.length === 0 ? (
          <section className="rounded-[32px] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
              📢
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-900">
              No opportunities yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your first opportunity to post a job, promote your
              business, announce a course, or publish an event.
            </p>

            <Link
              href="/dashboard/organization/opportunities/new"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-6 text-sm font-black text-white transition hover:bg-blue-700"
            >
              Post Opportunity
            </Link>
          </section>
        ) : (
          <section className="grid gap-5">
            {filteredOpportunities.map((opportunity) => {
              const sponsoredActive = isSponsoredActive(opportunity);

              return (
                <article
                  key={opportunity.id}
                  className={`rounded-[32px] border bg-white p-6 shadow-sm ${
                    sponsoredActive
                      ? "border-purple-200 ring-4 ring-purple-50"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-black ${typeStyle(
                            opportunity.type
                          )}`}
                        >
                          {formatType(opportunity.type)}
                        </span>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-black ${statusStyle(
                            opportunity.status
                          )}`}
                        >
                          {opportunity.status}
                        </span>

                        {sponsoredActive && (
                          <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-black text-purple-700">
                            🟣 Sponsored
                          </span>
                        )}

                        {opportunity.featured && !sponsoredActive && (
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">
                            Featured expired
                          </span>
                        )}
                      </div>

                      <h2 className="mt-3 text-xl font-black text-slate-900">
                        {opportunity.title}
                      </h2>

                      {sponsoredActive && (
                        <>
                          <div className="mt-4 rounded-3xl border border-purple-200 bg-purple-50 p-4">
                            <div className="grid gap-3 text-sm sm:grid-cols-3">
                              <div>
                                <p className="text-xs font-black uppercase tracking-[0.16em] text-purple-400">
                                  Plan
                                </p>
                                <p className="mt-1 font-black text-purple-900">
                                  {opportunity.sponsoredTier || "Sponsored"}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs font-black uppercase tracking-[0.16em] text-purple-400">
                                  Sponsored Since
                                </p>
                                <p className="mt-1 font-black text-purple-900">
                                  {formatDate(opportunity.sponsoredAt)}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs font-black uppercase tracking-[0.16em] text-purple-400">
                                  Expires
                                </p>
                                <p className="mt-1 font-black text-purple-900">
                                  {formatDate(opportunity.featuredUntil)}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                              Sponsored Performance
                            </p>

                            <div className="mt-3 grid gap-3 sm:grid-cols-3">
                              <AnalyticsCard
                                label="Sponsored Views"
                                value={getAnalyticsValue(
                                  opportunity,
                                  "sponsoredViews"
                                )}
                              />

                              <AnalyticsCard
                                label="View Details Clicks"
                                value={getAnalyticsValue(
                                  opportunity,
                                  "viewDetailsClicks"
                                )}
                              />

                              <AnalyticsCard
                                label="Marketplace Clicks"
                                value={getAnalyticsValue(
                                  opportunity,
                                  "marketplaceClicks"
                                )}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                        {opportunity.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                        {opportunity.workMode && (
                          <span className="rounded-full bg-slate-100 px-3 py-1">
                            {opportunity.workMode}
                          </span>
                        )}

                        {opportunity.location && (
                          <span className="rounded-full bg-slate-100 px-3 py-1">
                            📍 {opportunity.location}
                          </span>
                        )}

                        {opportunity.compensation && (
                          <span className="rounded-full bg-slate-100 px-3 py-1">
                            💰 {opportunity.compensation}
                          </span>
                        )}

                       


                        <span className="rounded-full bg-slate-100 px-3 py-1">
  👁️ {opportunity.views} views
</span>

<span className="rounded-full bg-slate-100 px-3 py-1">
  🖱️{" "}
  {getAnalyticsValue(opportunity, "viewDetailsClicks") +
    getAnalyticsValue(opportunity, "marketplaceClicks")}{" "}
  clicks
</span>

<span className="rounded-full bg-slate-100 px-3 py-1">
  📩 {getLeadCount(opportunity)} leads
</span>
                      </div>
                    </div>

                    <div className="grid gap-2 sm:min-w-[260px]">
                      <Link
                        href={`/dashboard/organization/opportunities/${opportunity.id}/leads`}
                        className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700"
                      >
                        View Leads
                      </Link>

                      <Link
                        href={`/dashboard/organization/opportunities/${opportunity.id}/sponsor`}
                        className={`inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-black text-white transition ${
                          sponsoredActive
                            ? "bg-purple-600 hover:bg-purple-700"
                            : "bg-slate-900 hover:bg-slate-800"
                        }`}
                      >
                        {sponsoredActive ? "Extend Sponsorship" : "Promote"}
                      </Link>

                      {opportunity.status !== "PUBLISHED" ? (
                        <button
                          type="button"
                          disabled={updatingId === opportunity.id}
                          onClick={() =>
                            updateStatus(opportunity.id, "PUBLISHED")
                          }
                          className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:opacity-60"
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={updatingId === opportunity.id}
                          onClick={() => updateStatus(opportunity.id, "PAUSED")}
                          className="inline-flex h-11 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 px-5 text-sm font-black text-amber-700 transition hover:bg-amber-100 disabled:opacity-60"
                        >
                          Pause
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={updatingId === opportunity.id}
                        onClick={() => updateStatus(opportunity.id, "CLOSED")}
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                      >
                        Close
                      </button>

                      <button
                        type="button"
                        disabled={updatingId === opportunity.id}
                        onClick={() => deleteOpportunity(opportunity.id)}
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-5 text-sm font-black text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  blue = false,
  purple = false,
}: {
  label: string;
  value: string | number;
  blue?: boolean;
  purple?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <p
        className={`mt-3 text-3xl font-black ${
          blue
            ? "text-blue-600"
            : purple
              ? "text-purple-600"
              : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function AnalyticsCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
}
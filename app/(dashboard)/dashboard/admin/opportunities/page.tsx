

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Opportunity = {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  featured: boolean;
  sponsoredTier?: string | null;
  sponsoredAt?: string | null;
  featuredUntil?: string | null;
  views: number;
  createdAt: string;
  organization: {
    id: string;
    name: string;
    email: string;
    organizationVerified?: boolean;
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

function formatDate(date?: string | null) {
  if (!date) return "Not set";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function isSponsoredActive(opportunity: Opportunity) {
  if (!opportunity.featured) return false;
  if (!opportunity.featuredUntil) return true;

  return new Date(opportunity.featuredUntil).getTime() > Date.now();
}

function getLeadCount(opportunity: Opportunity) {
  return opportunity._count?.leads ?? 0;
}

export default function AdminOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadOpportunities() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/admin/opportunities");
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

      const res = await fetch("/api/admin/opportunities", {
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
      "Are you sure you want to delete this opportunity? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      setUpdatingId(opportunityId);
      setError("");
      setMessage("");

      const res = await fetch("/api/admin/opportunities", {
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
    return opportunities.filter((item) => {
      const typeMatches = filter === "ALL" || item.type === filter;
      const statusMatches = statusFilter === "ALL" || item.status === statusFilter;

      return typeMatches && statusMatches;
    });
  }, [opportunities, filter, statusFilter]);

  const totalLeads = useMemo(
    () => opportunities.reduce((sum, item) => sum + getLeadCount(item), 0),
    [opportunities]
  );

  const totalViews = useMemo(
    () => opportunities.reduce((sum, item) => sum + item.views, 0),
    [opportunities]
  );

  const activeSponsoredCount = useMemo(
    () => opportunities.filter((item) => isSponsoredActive(item)).length,
    [opportunities]
  );

  const publishedCount = useMemo(
    () => opportunities.filter((item) => item.status === "PUBLISHED").length,
    [opportunities]
  );

  const typeFilters = [
    { label: "All", value: "ALL" },
    { label: "Projects", value: "PROJECT" },
    { label: "Jobs", value: "JOB" },
    { label: "Promotions", value: "PROMOTION" },
    { label: "Events", value: "EVENT" },
    { label: "Courses", value: "COURSE" },
  ];

  const statusFilters = [
    { label: "All Status", value: "ALL" },
    { label: "Published", value: "PUBLISHED" },
    { label: "Draft", value: "DRAFT" },
    { label: "Paused", value: "PAUSED" },
    { label: "Closed", value: "CLOSED" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 px-6 py-10 text-white sm:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
              Admin Marketplace
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Manage All Opportunities
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
              Review, publish, pause, close, delete, and monitor all marketplace
              opportunities across BuildUp.
            </p>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-5 lg:p-8">
            <SummaryCard label="Total" value={opportunities.length} />
            <SummaryCard label="Published" value={publishedCount} />
            <SummaryCard label="Sponsored" value={activeSponsoredCount} purple />
            <SummaryCard label="Views" value={totalViews} />
            <SummaryCard label="Leads" value={totalLeads} blue />
          </div>
        </section>

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

        <section className="grid gap-4 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-2">
          <div className="flex flex-wrap gap-2">
            {typeFilters.map((item) => {
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

          <div className="flex flex-wrap gap-2 lg:justify-end">
            {statusFilters.map((item) => {
              const active = statusFilter === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setStatusFilter(item.value)}
                  className={`rounded-2xl px-4 py-2 text-sm font-black transition ${
                    active
                      ? "bg-slate-900 text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
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
              No opportunities found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Try changing your filters or check back when organizations post new
              opportunities.
            </p>
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
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-black ${typeStyle(
                            opportunity.type
                          )}`}
                        >
                          {opportunity.type}
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

                        {opportunity.organization.organizationVerified && (
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                            ✅ Verified Org
                          </span>
                        )}
                      </div>

                      <h2 className="mt-3 text-xl font-black text-slate-900">
                        {opportunity.title}
                      </h2>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                        {opportunity.description}
                      </p>

                      <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <div className="grid gap-3 text-sm md:grid-cols-4">
                          <Detail label="Organization" value={opportunity.organization.name} />
                          <Detail label="Email" value={opportunity.organization.email} />
                          <Detail label="Views" value={String(opportunity.views)} />
                          <Detail label="Leads" value={String(getLeadCount(opportunity))} />
                        </div>
                      </div>

                      {sponsoredActive && (
                        <div className="mt-4 rounded-3xl border border-purple-200 bg-purple-50 p-4">
                          <div className="grid gap-3 text-sm md:grid-cols-3">
                            <Detail
                              label="Plan"
                              value={opportunity.sponsoredTier || "Sponsored"}
                              purple
                            />
                            <Detail
                              label="Sponsored Since"
                              value={formatDate(opportunity.sponsoredAt)}
                              purple
                            />
                            <Detail
                              label="Expires"
                              value={formatDate(opportunity.featuredUntil)}
                              purple
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-2 sm:min-w-[280px]">
                      <Link
                        href={`/marketplace/${opportunity.id}`}
                        target="_blank"
                        className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700"
                      >
                        View Public Page
                      </Link>

                      <Link
                        href={`/dashboard/organization/opportunities/${opportunity.id}/leads`}
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 px-5 text-sm font-black text-blue-700 transition hover:bg-blue-100"
                      >
                        View Leads
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

function Detail({
  label,
  value,
  purple = false,
}: {
  label: string;
  value: string;
  purple?: boolean;
}) {
  return (
    <div>
      <p
        className={`text-xs font-black uppercase tracking-[0.16em] ${
          purple ? "text-purple-400" : "text-slate-400"
        }`}
      >
        {label}
      </p>

      <p
        className={`mt-1 font-black ${
          purple ? "text-purple-900" : "text-slate-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
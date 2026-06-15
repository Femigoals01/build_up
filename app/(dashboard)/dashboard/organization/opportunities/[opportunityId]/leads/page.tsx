


"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Lead = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  source: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    username?: string | null;
    profileImageUrl?: string | null;
  } | null;
  opportunity: {
    id: string;
    title: string;
    type: string;
    status: string;
  };
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function getDisplayName(lead: Lead) {
  return lead.user?.name || lead.name || "Unknown lead";
}

function getDisplayEmail(lead: Lead) {
  return lead.user?.email || lead.email || "No email provided";
}

export default function OpportunityLeadsPage() {
  const params = useParams();
  const opportunityId = String(params.opportunityId);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLeads() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `/api/opportunity-leads?opportunityId=${opportunityId}`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load leads.");
      }

      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (opportunityId) {
      loadLeads();
    }
  }, [opportunityId]);

  const opportunity = leads[0]?.opportunity;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <Link
          href="/dashboard/organization/opportunities"
          className="text-sm font-black text-blue-600 hover:text-blue-700"
        >
          ← Back to opportunities
        </Link>

        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 px-6 py-10 text-white sm:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
              Opportunity Leads
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {opportunity?.title || "Leads Received"}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
              View people who showed interest in this opportunity through
              BuildUp.
            </p>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-3 lg:p-8">
            <SummaryCard label="Total Leads" value={leads.length} />
            <SummaryCard
              label="Registered Users"
              value={leads.filter((lead) => lead.user).length}
            />
            <SummaryCard
              label="Guest Leads"
              value={leads.filter((lead) => !lead.user).length}
              blue
            />
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <section className="rounded-[32px] border border-slate-200 bg-white p-8 text-sm font-bold text-slate-500 shadow-sm">
            Loading leads...
          </section>
        ) : leads.length === 0 ? (
          <section className="rounded-[32px] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
              📩
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-900">
              No leads yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              When people show interest in this opportunity, their details will
              appear here.
            </p>
          </section>
        ) : (
          <section className="grid gap-5">
            {leads.map((lead) => (
              <article
                key={lead.id}
                className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black text-slate-900">
                        {getDisplayName(lead)}
                      </h2>

                      {lead.user && (
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                          Registered {lead.user.role}
                        </span>
                      )}

                      {!lead.user && (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black text-slate-600">
                          Guest Lead
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      {getDisplayEmail(lead)}
                    </p>

                    {lead.phone && (
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        {lead.phone}
                      </p>
                    )}

                    {lead.message && (
                      <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                          Message
                        </p>

                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                          {lead.message}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 lg:min-w-[250px]">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Submitted
                    </p>

                    <p className="mt-2 text-sm font-bold text-slate-700">
                      {formatDate(lead.createdAt)}
                    </p>

                    <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Source
                    </p>

                    <p className="mt-2 text-sm font-bold text-slate-700">
                      {lead.source}
                    </p>

                    {lead.user?.username && (
                      <Link
                        href={
                          lead.user.role === "VOLUNTEER"
                            ? `/portfolio/${lead.user.username}`
                            : "#"
                        }
                        className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-black text-white transition hover:bg-blue-700"
                      >
                        View Profile
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
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



"use client";

import { useEffect, useState } from "react";

type Verification = {
  id: string;
  businessName: string;
  registrationNumber?: string | null;
  websiteUrl?: string | null;
  linkedinUrl?: string | null;
  businessAddress?: string | null;
  certificateUrl?: string | null;
  status: string;
  adminNotes?: string | null;
  submittedAt: string;
  reviewedAt?: string | null;
  organization: {
    id: string;
    name: string;
    email: string;
    username?: string | null;
    country?: string | null;
    profileImageUrl?: string | null;
    organizationVerified: boolean;
    organizationVerificationStatus: string;
  };
};

function statusStyle(status: string) {
  if (status === "APPROVED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "REJECTED") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

export default function AdminOrganizationVerificationsPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadVerifications() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/organization-verification");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load verification requests.");
      }

      const items = Array.isArray(data) ? data : [];
      setVerifications(items);

      const noteMap: Record<string, string> = {};
      items.forEach((item: Verification) => {
        noteMap[item.id] = item.adminNotes || "";
      });

      setNotes(noteMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVerifications();
  }, []);

  async function updateVerification(
    verificationId: string,
    status: "APPROVED" | "REJECTED" | "PENDING"
  ) {
    try {
      setUpdatingId(verificationId);
      setMessage("");
      setError("");

      const res = await fetch("/api/organization-verification", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          verificationId,
          status,
          adminNotes: notes[verificationId] || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update verification.");
      }

      setMessage(`Verification ${status.toLowerCase()} successfully.`);
      await loadVerifications();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setUpdatingId("");
    }
  }

  const filteredVerifications =
    filter === "ALL"
      ? verifications
      : verifications.filter((item) => item.status === filter);

  const pendingCount = verifications.filter(
    (item) => item.status === "PENDING"
  ).length;

  const approvedCount = verifications.filter(
    (item) => item.status === "APPROVED"
  ).length;

  const rejectedCount = verifications.filter(
    (item) => item.status === "REJECTED"
  ).length;

  const filters = [
    { label: "All", value: "ALL", count: verifications.length },
    { label: "Pending", value: "PENDING", count: pendingCount },
    { label: "Approved", value: "APPROVED", count: approvedCount },
    { label: "Rejected", value: "REJECTED", count: rejectedCount },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 px-6 py-10 text-white sm:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
              Admin Verification
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Organization Verification Requests
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
              Review organization documents, approve trusted businesses, and
              manage verification status across BuildUp.
            </p>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-4 lg:p-8">
            <SummaryCard label="All Requests" value={verifications.length} />
            <SummaryCard label="Pending" value={pendingCount} />
            <SummaryCard label="Approved" value={approvedCount} blue />
            <SummaryCard label="Rejected" value={rejectedCount} />
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

        <section className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {filters.map((item) => {
              const active = filter === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-black transition ${
                    active
                      ? "bg-blue-600 text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-white text-slate-500"
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {loading ? (
          <section className="rounded-[32px] border border-slate-200 bg-white p-8 text-sm font-bold text-slate-500 shadow-sm">
            Loading verification requests...
          </section>
        ) : filteredVerifications.length === 0 ? (
          <section className="rounded-[32px] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
              🏢
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-900">
              No verification requests found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Organization verification requests will appear here once
              businesses submit their details.
            </p>
          </section>
        ) : (
          <section className="grid gap-5">
            {filteredVerifications.map((verification) => (
              <article
                key={verification.id}
                className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black text-slate-900">
                        {verification.businessName}
                      </h2>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-black ${statusStyle(
                          verification.status
                        )}`}
                      >
                        {verification.status}
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      Organization: {verification.organization.name}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      Email: {verification.organization.email}
                    </p>

                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      <Detail label="Registration No." value={verification.registrationNumber} />
                      <Detail label="Country" value={verification.organization.country} />
                      <Detail label="Business Address" value={verification.businessAddress} />
                      <Detail label="Submitted" value={new Date(verification.submittedAt).toLocaleDateString()} />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {verification.websiteUrl && (
                        <a
                          href={verification.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-black text-blue-700 hover:bg-blue-100"
                        >
                          Website
                        </a>
                      )}

                      {verification.linkedinUrl && (
                        <a
                          href={verification.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-black text-blue-700 hover:bg-blue-100"
                        >
                          LinkedIn
                        </a>
                      )}

                      {verification.certificateUrl && (
                        <a
                          href={verification.certificateUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 hover:bg-emerald-100"
                        >
                          View Certificate
                        </a>
                      )}
                    </div>

                    <div className="mt-5">
                      <label className="mb-2 block text-sm font-black text-slate-700">
                        Admin Notes
                      </label>

                      <textarea
                        value={notes[verification.id] || ""}
                        onChange={(e) =>
                          setNotes((prev) => ({
                            ...prev,
                            [verification.id]: e.target.value,
                          }))
                        }
                        rows={4}
                        placeholder="Add approval/rejection notes..."
                        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2 lg:min-w-[240px]">
                    <button
                      type="button"
                      disabled={updatingId === verification.id}
                      onClick={() =>
                        updateVerification(verification.id, "APPROVED")
                      }
                      className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                      Approve
                    </button>

                    <button
                      type="button"
                      disabled={updatingId === verification.id}
                      onClick={() =>
                        updateVerification(verification.id, "REJECTED")
                      }
                      className="inline-flex h-11 items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-5 text-sm font-black text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                    >
                      Reject
                    </button>

                    <button
                      type="button"
                      disabled={updatingId === verification.id}
                      onClick={() =>
                        updateVerification(verification.id, "PENDING")
                      }
                      className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                    >
                      Mark Pending
                    </button>
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

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold text-slate-800">
        {value || "Not provided"}
      </p>
    </div>
  );
}
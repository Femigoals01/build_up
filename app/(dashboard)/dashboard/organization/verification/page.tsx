


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

export default function OrganizationVerificationPage() {
  const [verification, setVerification] = useState<Verification | null>(null);

  const [businessName, setBusinessName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadVerification() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/organization-verification");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load verification.");
      }

      setVerification(data);

      if (data) {
        setBusinessName(data.businessName || "");
        setRegistrationNumber(data.registrationNumber || "");
        setWebsiteUrl(data.websiteUrl || "");
        setLinkedinUrl(data.linkedinUrl || "");
        setBusinessAddress(data.businessAddress || "");
        setCertificateUrl(data.certificateUrl || "");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVerification();
  }, []);

  async function submitVerification(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setSubmitting(true);
      setMessage("");
      setError("");

      const res = await fetch("/api/organization-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName,
          registrationNumber,
          websiteUrl,
          linkedinUrl,
          businessAddress,
          certificateUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit verification.");
      }

      setMessage("Verification request submitted successfully.");
      await loadVerification();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 px-6 py-10 text-white sm:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
              Organization Verification
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Build Trust With a Verified Badge
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
              Submit your business details for review. Verified organizations
              receive a trust badge across BuildUp opportunities and profiles.
            </p>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-3 lg:p-8">
            <InfoCard label="Trust Signal" value="Verified Badge" />
            <InfoCard label="Review Type" value="Admin Review" />
            <InfoCard
              label="Current Status"
              value={verification?.status || "Not Submitted"}
              highlight
            />
          </div>
        </section>

        {loading ? (
          <section className="rounded-[32px] border border-slate-200 bg-white p-8 text-sm font-bold text-slate-500 shadow-sm">
            Loading verification details...
          </section>
        ) : (
          <>
            {verification && (
              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                      Submitted Verification
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-slate-900">
                      {verification.businessName}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Submitted:{" "}
                      {new Date(verification.submittedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`rounded-full border px-4 py-2 text-xs font-black ${statusStyle(
                      verification.status
                    )}`}
                  >
                    {verification.status}
                  </span>
                </div>

                {verification.adminNotes && (
                  <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-700">
                      Admin Notes
                    </p>

                    <p className="mt-2 text-sm leading-6 text-amber-800">
                      {verification.adminNotes}
                    </p>
                  </div>
                )}
              </section>
            )}

            {message && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                {message}
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            <form
              onSubmit={submitVerification}
              className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                  Verification Form
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  Submit Business Details
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  You can resubmit your details if your previous application was
                  rejected or needs correction.
                </p>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <Field label="Business Name">
                  <input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Registered business name"
                    className="input"
                  />
                </Field>

                <Field label="Registration Number">
                  <input
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="CAC / company registration number"
                    className="input"
                  />
                </Field>

                <Field label="Website URL">
                  <input
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourcompany.com"
                    className="input"
                  />
                </Field>

                <Field label="LinkedIn URL">
                  <input
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/company/..."
                    className="input"
                  />
                </Field>

                <Field label="Certificate URL">
                  <input
                    value={certificateUrl}
                    onChange={(e) => setCertificateUrl(e.target.value)}
                    placeholder="Paste uploaded certificate/document URL"
                    className="input"
                  />
                </Field>

                <Field label="Business Address">
                  <textarea
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    rows={4}
                    placeholder="Business address"
                    className="input resize-none"
                  />
                </Field>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-7 inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-6 text-sm font-black text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Verification"}
              </button>
            </form>
          </>
        )}
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgb(226 232 240);
          background: white;
          padding: 0.85rem 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: rgb(30 41 59);
          outline: none;
        }

        .input:focus {
          border-color: rgb(59 130 246);
          box-shadow: 0 0 0 4px rgb(219 234 254);
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </span>

      {children}
    </label>
  );
}

function InfoCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <p
        className={`mt-2 text-lg font-black ${
          highlight ? "text-blue-600" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
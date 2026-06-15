

"use client";

import { useEffect, useState } from "react";

type Certification = {
  id: string;
  status: string;
  notes?: string | null;
  appliedAt: string;
  reviewedAt?: string | null;
  mentor: {
    id: string;
    name: string;
    email: string;
    username?: string | null;
    mentorRating: number;
    mentorRatingCount: number;
    mentorLevel: number;
    mentorshipPoints: number;
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

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadCertifications() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/mentor-certifications");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load certifications.");
      }

      setCertifications(Array.isArray(data) ? data : []);

      const noteMap: Record<string, string> = {};
      data.forEach((item: Certification) => {
        noteMap[item.id] = item.notes || "";
      });

      setNotes(noteMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCertifications();
  }, []);

  async function updateCertification(
    certificationId: string,
    status: "APPROVED" | "REJECTED"
  ) {
    try {
      setUpdatingId(certificationId);
      setError("");
      setMessage("");

      const res = await fetch("/api/mentor-certifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          certificationId,
          status,
          notes: notes[certificationId] || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update certification.");
      }

      setMessage(`Certification ${status.toLowerCase()} successfully.`);
      await loadCertifications();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setUpdatingId("");
    }
  }

  const pendingCount = certifications.filter(
    (item) => item.status === "PENDING"
  ).length;

  const approvedCount = certifications.filter(
    (item) => item.status === "APPROVED"
  ).length;

  const rejectedCount = certifications.filter(
    (item) => item.status === "REJECTED"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
            Admin Review
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-900">
            Mentor Certification Applications
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Review mentor certification applications, approve qualified mentors,
            or reject applications with notes.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard label="Pending" value={pendingCount} />
            <StatCard label="Approved" value={approvedCount} />
            <StatCard label="Rejected" value={rejectedCount} />
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

        {loading ? (
          <section className="rounded-[32px] border border-slate-200 bg-white p-8 text-sm font-bold text-slate-500 shadow-sm">
            Loading certification applications...
          </section>
        ) : certifications.length === 0 ? (
          <section className="rounded-[32px] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
              🎓
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-900">
              No applications yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Mentor certification applications will appear here.
            </p>
          </section>
        ) : (
          <section className="grid gap-5">
            {certifications.map((certification) => (
              <article
                key={certification.id}
                className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-black text-slate-900">
                        {certification.mentor.name}
                      </h2>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-black ${statusStyle(
                          certification.status
                        )}`}
                      >
                        {certification.status}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {certification.mentor.email}
                    </p>

                    {certification.mentor.username && (
                      <p className="mt-1 text-sm font-bold text-blue-600">
                        @{certification.mentor.username}
                      </p>
                    )}

                    <div className="mt-5 grid gap-3 sm:grid-cols-4">
                      <MiniStat
                        label="Rating"
                        value={Number(
                          certification.mentor.mentorRating || 0
                        ).toFixed(1)}
                      />

                      <MiniStat
                        label="Reviews"
                        value={String(certification.mentor.mentorRatingCount)}
                      />

                      <MiniStat
                        label="Level"
                        value={String(certification.mentor.mentorLevel)}
                      />

                      <MiniStat
                        label="Points"
                        value={String(certification.mentor.mentorshipPoints)}
                      />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 lg:min-w-[260px]">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Applied
                    </p>

                    <p className="mt-2 text-sm font-bold text-slate-700">
                      {new Date(certification.appliedAt).toLocaleDateString()}
                    </p>

                    {certification.reviewedAt && (
                      <p className="mt-2 text-sm font-semibold text-slate-500">
                        Reviewed:{" "}
                        {new Date(certification.reviewedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Admin Note
                  </label>

                  <textarea
                    value={notes[certification.id] || ""}
                    onChange={(e) =>
                      setNotes((prev) => ({
                        ...prev,
                        [certification.id]: e.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="Add review note..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {certification.status === "PENDING" && (
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      disabled={updatingId === certification.id}
                      onClick={() =>
                        updateCertification(certification.id, "APPROVED")
                      }
                      className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {updatingId === certification.id
                        ? "Updating..."
                        : "Approve"}
                    </button>

                    <button
                      type="button"
                      disabled={updatingId === certification.id}
                      onClick={() =>
                        updateCertification(certification.id, "REJECTED")
                      }
                      className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-black text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}
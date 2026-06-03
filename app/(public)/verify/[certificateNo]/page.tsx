

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ certificateNo: string }>;
}) {
  const { certificateNo } = await params;

  const certificate = await prisma.certificate.findUnique({
    where: { certificateNo },
    include: {
      volunteer: {
        select: {
          name: true,
          username: true,
        },
      },
    },
  });

  if (!certificate) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-10">
      <section className="mx-auto max-w-4xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white md:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
            BuildUp Certificate Verification
          </p>

          <h1 className="mt-4 text-3xl font-black md:text-5xl">
            Certificate Verified
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
            This certificate was issued by BuildUp as proof of verified
            real-world project experience.
          </p>
        </div>

        <div className="p-6 md:p-10">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-sm font-bold text-emerald-800">
              ✅ Valid BuildUp Certificate
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Info label="Certificate Holder" value={certificate.volunteer.name || "Unnamed Volunteer"} />
            <Info label="Certificate No." value={certificate.certificateNo} />
            <Info
              label="Completed Projects"
              value={String(certificate.completedProjectsCount)}
            />
            <Info
              label="Issued Date"
              value={new Date(certificate.issuedAt).toLocaleDateString(
                "en-GB",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            />
          </div>

          {certificate.skillsSummary ? (
            <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">
                Skills Demonstrated
              </p>

              <p className="mt-3 text-sm leading-7 text-blue-900">
                {certificate.skillsSummary}
              </p>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            {certificate.volunteer.username ? (
              <Link
                href={`/portfolio/${certificate.volunteer.username}`}
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                View Public Portfolio
              </Link>
            ) : null}

            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Visit BuildUp
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 break-words text-lg font-black text-slate-900">
        {value}
      </p>
    </div>
  );
}
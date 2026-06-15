

// import Link from "next/link";
// import { notFound } from "next/navigation";
// import { prisma } from "@/lib/prisma";

// export const dynamic = "force-dynamic";

// export default async function VerifyCertificatePage({
//   params,
// }: {
//   params: Promise<{ certificateNo: string }>;
// }) {
//   const { certificateNo } = await params;

//   const certificate = await prisma.certificate.findUnique({
//     where: { certificateNo },
//     include: {
//       volunteer: {
//         select: {
//           name: true,
//           username: true,
//         },
//       },
//     },
//   });

//   if (!certificate) {
//     notFound();
//   }

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-10">
//       <section className="mx-auto max-w-4xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white md:px-10">
//           <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
//             BuildUp Certificate Verification
//           </p>

//           <h1 className="mt-4 text-3xl font-black md:text-5xl">
//             Certificate Verified
//           </h1>

//           <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
//             This certificate was issued by BuildUp as proof of verified
//             real-world project experience.
//           </p>
//         </div>

//         <div className="p-6 md:p-10">
//           <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
//             <p className="text-sm font-bold text-emerald-800">
//               ✅ Valid BuildUp Certificate
//             </p>
//           </div>

//           <div className="mt-8 grid gap-4 md:grid-cols-2">
//             <Info label="Certificate Holder" value={certificate.volunteer.name || "Unnamed Volunteer"} />
//             <Info label="Certificate No." value={certificate.certificateNo} />
//             <Info
//               label="Completed Projects"
//               value={String(certificate.completedProjectsCount)}
//             />
//             <Info
//               label="Issued Date"
//               value={new Date(certificate.issuedAt).toLocaleDateString(
//                 "en-GB",
//                 {
//                   day: "numeric",
//                   month: "long",
//                   year: "numeric",
//                 }
//               )}
//             />
//           </div>

//           {certificate.skillsSummary ? (
//             <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-5">
//               <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">
//                 Skills Demonstrated
//               </p>

//               <p className="mt-3 text-sm leading-7 text-blue-900">
//                 {certificate.skillsSummary}
//               </p>
//             </div>
//           ) : null}

//           <div className="mt-8 flex flex-wrap gap-3">
//             {certificate.volunteer.username ? (
//               <Link
//                 href={`/portfolio/${certificate.volunteer.username}`}
//                 className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
//               >
//                 View Public Portfolio
//               </Link>
//             ) : null}

//             <Link
//               href="/"
//               className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
//             >
//               Visit BuildUp
//             </Link>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

// function Info({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
//       <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
//         {label}
//       </p>

//       <p className="mt-2 break-words text-lg font-black text-slate-900">
//         {value}
//       </p>
//     </div>
//   );
// }







import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatCertificateSkills(skillsSummary?: string | null) {
  if (!skillsSummary) return "";

  const skills = skillsSummary
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  const topSkills = skills.slice(0, 6);
  const remaining = skills.length - topSkills.length;

  return remaining > 0
    ? `${topSkills.join(" • ")} • +${remaining} more`
    : topSkills.join(" • ");
}

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
    profileImageUrl: true,
    rating: true,
    ratingCount: true,
    country: true,
    headline: true,

    level: true,
    points: true,

    reviewsReceived: {
      select: {
        technicalSkill: true,
        communication: true,
        professionalism: true,
        timeliness: true,
      },
    },
  },
},
    },
  });

  if (!certificate) {
    notFound();
  }

  const reviews = certificate.volunteer.reviewsReceived;

const technicalSkill =
  reviews.length > 0
    ? (
        reviews.reduce(
          (sum, review) => sum + (review.technicalSkill || 0),
          0
        ) / reviews.length
      ).toFixed(1)
    : "0.0";

const communication =
  reviews.length > 0
    ? (
        reviews.reduce(
          (sum, review) => sum + (review.communication || 0),
          0
        ) / reviews.length
      ).toFixed(1)
    : "0.0";

const professionalism =
  reviews.length > 0
    ? (
        reviews.reduce(
          (sum, review) => sum + (review.professionalism || 0),
          0
        ) / reviews.length
      ).toFixed(1)
    : "0.0";

const timeliness =
  reviews.length > 0
    ? (
        reviews.reduce(
          (sum, review) => sum + (review.timeliness || 0),
          0
        ) / reviews.length
      ).toFixed(1)
    : "0.0";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-10 text-slate-900">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-white shadow-2xl">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-950 px-6 py-10 text-white md:px-10 md:py-12">
          <div className="absolute right-[-80px] top-[-80px] h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-[-80px] left-[-80px] h-64 w-64 rounded-full bg-blue-300/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-100 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                BuildUp Verification Portal
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
                Certificate Verified
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100 md:text-base">
                This certificate is valid and was issued by BuildUp as proof of
                verified real-world project experience.
              </p>
            </div>

            <div className="rounded-[28px] border border-emerald-300/30 bg-emerald-400/15 p-5 text-center backdrop-blur">
              <p className="text-5xl">✅</p>
              <p className="mt-3 text-sm font-black uppercase tracking-[0.18em] text-emerald-100">
                Valid Credential
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-6">
              <section className="rounded-[30px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-blue-50 p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  {certificate.volunteer.profileImageUrl ? (
                    <img
                      src={certificate.volunteer.profileImageUrl}
                      alt={certificate.volunteer.name || "Certificate holder"}
                      className="h-20 w-20 rounded-3xl border border-blue-100 object-cover shadow-sm"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 text-3xl font-black text-white shadow-sm">
                      {(certificate.volunteer.name || "B")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                      Certificate Holder
                    </p>

                    <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                      {certificate.volunteer.name || "Unnamed Volunteer"}
                    </h2>

                    {certificate.volunteer.headline ? (
                      <p className="mt-2 text-sm font-medium text-slate-600">
                        {certificate.volunteer.headline}
                      </p>
                    ) : null}

                    {certificate.volunteer.username ? (
                      <p className="mt-1 text-sm font-semibold text-blue-600">
                        @{certificate.volunteer.username}
                      </p>
                    ) : null}
                  </div>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-2">
                <Info
                  label="Certificate No."
                  value={certificate.certificateNo}
                  accent
                />

                <Info
                  label="Verified Projects Completed"
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

                <Info
                  label="Credential Status"
                  value="VALID"
                  success
                />
              </section>

              {certificate.skillsSummary ? (
                <section className="rounded-[30px] border border-blue-100 bg-blue-50 p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">
                    Primary Skills
                  </p>

                  <p className="mt-3 text-sm font-medium leading-7 text-blue-950">
                    {formatCertificateSkills(certificate.skillsSummary)}
                  </p>
                </section>
              ) : null}


              <section className="rounded-[30px] border border-slate-200 bg-white p-6">
  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
    Reputation Profile
  </p>

  <h3 className="mt-2 text-2xl font-black text-slate-950">
    Verified Performance Metrics
  </h3>

  <div className="mt-6 grid gap-4 md:grid-cols-3">
    <Info
      label="Overall Rating"
      value={`${Number(
        certificate.volunteer.rating || 0
      ).toFixed(1)} ⭐`}
      accent
    />

    <Info
      label="Volunteer Level"
      value={`Level ${certificate.volunteer.level || 1}`}
    />

    <Info
      label="Points"
      value={String(certificate.volunteer.points || 0)}
    />
  </div>

  <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Info
      label="Technical Skill"
      value={technicalSkill}
    />

    <Info
      label="Communication"
      value={communication}
    />

    <Info
      label="Professionalism"
      value={professionalism}
    />

    <Info
      label="Timeliness"
      value={timeliness}
    />
  </div>
</section>
            </div>

            <aside className="space-y-5">
              <section className="rounded-[30px] border border-slate-200 bg-slate-50 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Verification Summary
                </p>

                <div className="mt-5 space-y-4">
                  <CheckItem text="Certificate record found" />
                  <CheckItem text="Certificate number is valid" />
                  <CheckItem text="Credential issued by BuildUp" />
                  <CheckItem text="Linked to a verified volunteer account" />
                </div>
              </section>

              <section className="rounded-[30px] border border-slate-900 bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                  BuildUp Trust Badge
                </p>

                <h3 className="mt-3 text-2xl font-black">
                  Verified by BuildUp
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  BuildUp helps learners and professionals prove practical
                  experience through real projects, public portfolios, reviews,
                  and verified certificates.
                </p>
              </section>

              <div className="grid gap-3">
                {certificate.volunteer.username ? (
                  <Link
                    href={`/portfolio/${certificate.volunteer.username}`}
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    View Public Portfolio
                  </Link>
                ) : null}

                <Link
                  href="/"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Visit BuildUp
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function Info({
  label,
  value,
  accent = false,
  success = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
  success?: boolean;
}) {
  const styles = success
    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
    : accent
    ? "border-blue-200 bg-blue-50 text-blue-950"
    : "border-slate-200 bg-slate-50 text-slate-900";

  return (
    <div className={`rounded-3xl border p-5 ${styles}`}>
      <p className="text-xs font-bold uppercase tracking-[0.18em] opacity-60">
        {label}
      </p>

      <p className="mt-2 break-words text-lg font-black">{value}</p>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-700">
        ✓
      </span>

      <p className="text-sm font-semibold text-slate-700">{text}</p>
    </div>
  );
}
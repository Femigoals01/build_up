



import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import SubmissionActions from "./SubmissionActions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function statusStyle(status: string) {
  if (status === "PENDING") return "border-amber-200 bg-amber-50 text-amber-700";
  if (status === "APPROVED")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  return "border-rose-200 bg-rose-50 text-rose-700";
}

function statusLabel(status: string) {
  if (status === "PENDING") return "Pending review";
  if (status === "APPROVED") return "Approved";
  return "Revision requested";
}

export default async function ProjectSubmissionPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZATION") {
    redirect("/login");
  }

  const { projectId } = await params;

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      organizationId: session.user.id,
    },
    include: {
      submissions: {
        include: {
          volunteer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: [{ version: "desc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!project) {
    redirect("/dashboard/organization");
  }

  const latestSubmission = project.submissions[0];

  const pendingSubmission = project.submissions.find(
    (submission) => submission.status === "PENDING"
  );

  const displaySubmission = pendingSubmission ?? latestSubmission;

  const olderSubmissions = project.submissions.filter(
    (submission) => submission.id !== displaySubmission?.id
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-8 md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/dashboard/organization"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              ← Back to organization dashboard
            </Link>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Review Submission
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Review the volunteer’s delivery, open attached files, check version
              history, then approve or request revision.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Project
            </p>
            <p className="mt-1 max-w-sm truncate text-base font-bold text-slate-900">
              {project.title}
            </p>
          </div>
        </div>

        {project.submissions.length === 0 ? (
          <section className="rounded-[32px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-50 text-3xl">
              📭
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No submissions yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Once the volunteer submits their work, it will appear here for
              review.
            </p>
          </section>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* MAIN REVIEW CARD */}
            {displaySubmission && (
              <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
                <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 px-6 py-8 text-white md:px-8">
                  <div className="absolute right-[-4rem] top-[-4rem] h-44 w-44 rounded-full bg-white/10 blur-3xl" />
                  <div className="absolute bottom-[-4rem] left-1/3 h-44 w-44 rounded-full bg-blue-300/20 blur-3xl" />

                  <div className="relative flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">
                        {displaySubmission.status === "PENDING"
                          ? "Pending Review"
                          : "Latest Submission"}
                      </p>

                      <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
                        Version {displaySubmission.version}
                      </h2>

                      <p className="mt-2 text-sm text-blue-100">
                        Submitted by{" "}
                        <span className="font-semibold text-white">
                          {displaySubmission.volunteer.name ?? "Unnamed volunteer"}
                        </span>
                      </p>

                      <p className="mt-1 text-xs text-blue-100">
                        {displaySubmission.volunteer.email}
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit rounded-full border px-4 py-2 text-xs font-bold ${statusStyle(
                        displaySubmission.status
                      )}`}
                    >
                      {statusLabel(displaySubmission.status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-8 p-6 md:p-8">
                  <section>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Submission Message
                    </p>

                    {displaySubmission.message ? (
                      <p className="mt-3 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-700">
                        {displaySubmission.message}
                      </p>
                    ) : (
                      <p className="mt-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-4 text-sm text-slate-500">
                        No message was attached to this submission.
                      </p>
                    )}
                  </section>

                  {displaySubmission.feedback && (
                    <section className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
                        Previous Feedback
                      </p>
                      <p className="mt-2 text-sm leading-7 text-amber-800">
                        {displaySubmission.feedback}
                      </p>
                    </section>
                  )}

                  <section>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Submitted Assets
                    </p>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {displaySubmission.workUrl ? (
                        <a
                          href={displaySubmission.workUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group rounded-3xl border border-blue-200 bg-blue-50 p-5 transition hover:-translate-y-0.5 hover:bg-blue-100"
                        >
                          <p className="text-sm font-bold text-blue-800">
                            🔗 Work Link
                          </p>
                          <p className="mt-2 text-xs leading-5 text-blue-700">
                            Open the submitted project link, demo, repo, or
                            document.
                          </p>
                          <p className="mt-4 text-sm font-semibold text-blue-700 group-hover:underline">
                            View submitted work →
                          </p>
                        </a>
                      ) : null}

                      {displaySubmission.fileUrl ? (
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                          <p className="text-sm font-bold text-slate-900">
                            📎 Attached File
                          </p>

                          {displaySubmission.fileUrl
                            .toLowerCase()
                            .includes(".pdf") ? (
                            <div className="mt-4 flex flex-wrap gap-3">
                              <a
                                href={displaySubmission.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                              >
                                Open PDF
                              </a>

                              <a
                                href={displaySubmission.fileUrl}
                                download
                                className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                              >
                                Download
                              </a>
                            </div>
                          ) : (
                            <div className="mt-4 space-y-4">
                              <img
                                src={displaySubmission.fileUrl}
                                alt="Submitted file"
                                className="max-h-72 w-full rounded-2xl border border-slate-200 object-cover"
                              />

                              <div className="flex flex-wrap gap-3">
                                <a
                                  href={displaySubmission.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                  View Full
                                </a>

                                <a
                                  href={displaySubmission.fileUrl}
                                  download
                                  className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                  Download
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : null}

                      {!displaySubmission.workUrl &&
                        !displaySubmission.fileUrl && (
                          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500 md:col-span-2">
                            No work link or file was attached.
                          </div>
                        )}
                    </div>
                  </section>

                  {pendingSubmission ? (
                    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        Review Decision
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Approve this delivery if the work is complete, or request
                        revision with clear feedback.
                      </p>

                      <div className="mt-4">
                        <SubmissionActions
                          submissionId={pendingSubmission.id}
                          projectId={projectId}
                          volunteerId={pendingSubmission.volunteer.id}
                        />
                      </div>
                    </section>
                  ) : (
                    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-sm font-semibold text-slate-700">
                        This submission has already been reviewed.
                      </p>
                    </section>
                  )}
                </div>
              </section>
            )}

            {/* SIDE TIMELINE */}
            <aside className="space-y-5">
              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Review Summary
                </p>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Total Versions</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">
                      {project.submissions.length}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Current Status</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                      {displaySubmission
                        ? statusLabel(displaySubmission.status)
                        : "No submission"}
                    </p>
                  </div>
                </div>
              </section>

              {olderSubmissions.length > 0 && (
                <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Version History
                  </p>

                  <div className="mt-5 space-y-4 border-l-2 border-slate-200 pl-5">
                    {olderSubmissions.map((submission) => (
                      <div key={submission.id} className="relative">
                        <div className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full bg-slate-400" />

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-bold text-slate-900">
                              Version {submission.version}
                            </p>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusStyle(
                                submission.status
                              )}`}
                            >
                              {statusLabel(submission.status)}
                            </span>
                          </div>

                          <p className="mt-2 text-xs text-slate-500">
                            {new Date(submission.createdAt).toLocaleString()}
                          </p>

                          {submission.feedback ? (
                            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
                              <p className="text-xs font-bold text-amber-700">
                                Feedback
                              </p>
                              <p className="mt-1 text-xs leading-5 text-amber-800">
                                {submission.feedback}
                              </p>
                            </div>
                          ) : null}

                          {submission.fileUrl ? (
                            <a
                              href={submission.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3 inline-block text-xs font-semibold text-blue-600 hover:underline"
                            >
                              View file →
                            </a>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
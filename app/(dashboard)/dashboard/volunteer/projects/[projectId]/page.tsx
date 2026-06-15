





import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import SubmissionCommentsThread from "@/components/submissions/SubmissionCommentsThread";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function submissionLabel(status: string) {
  if (status === "APPROVED") return "🟢 Approved";
  if (status === "REJECTED") return "🔴 Revision Requested";
  return "🟡 Pending Review";
}

function submissionStyle(status: string) {
  if (status === "APPROVED") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "REJECTED") return "bg-rose-50 text-rose-700 border-rose-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
}


function formatNairaFromKobo(amount?: number | null) {
  if (!amount) return "₦0";

  return `₦${(amount / 100).toLocaleString("en-NG", {
    maximumFractionDigits: 0,
  })}`;
}



export default async function VolunteerProjectDetailsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "VOLUNTEER") {
    redirect("/login");
  }

  const { projectId } = await params;

  const application = await prisma.application.findFirst({
    where: {
      projectId,
      volunteerId: session.user.id,
    },
    include: {
      project: {
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          mentor: {
            select: {
              id: true,
              name: true,
              username: true,
              skills: true,
              experience: true,
              rating: true,
              ratingCount: true,
            },
          },
          submissions: {
            where: {
              volunteerId: session.user.id,
            },
            orderBy: {
              createdAt: "desc",
            },
            include: {
              comments: {
                include: {
                  user: {
                    select: { name: true },
                  },
                },
                orderBy: { createdAt: "asc" },
              },
            },
          },
          reviews: true,
        },
      },
    },
  });

  if (!application) {
    redirect("/dashboard/volunteer/projects");
  }

  const project = application.project;
  const latestSubmission = project.submissions[0] ?? null;
  const mentorSkills =
    project.mentor?.skills
      ?.split(",")
      .map((skill) => skill.trim())
      .filter(Boolean) ?? [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <Link
            href="/dashboard/volunteer/projects"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            ← Back to my projects
          </Link>

          <div className="mt-5 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    {application.status}
                  </span>

                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
                    {project.status}
                  </span>

                  {latestSubmission && (
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${submissionStyle(
                        latestSubmission.status
                      )}`}
                    >
                      {submissionLabel(latestSubmission.status)}
                    </span>
                  )}
                </div>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                  {project.title}
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Organization:{" "}
                  <span className="font-semibold text-slate-800">
                    {project.organization.name}
                  </span>
                </p>

<p className="mt-2 text-sm text-emerald-700">
  Project Amount:{" "}
  <span className="font-bold">
    {formatNairaFromKobo(project.stipendAmount)}
  </span>
</p>


                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/dashboard/messages/start?userId=${project.organization.id}`}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  💬 Message Organization
                </Link>

                <Link
                  href={`/dashboard/projects/${project.id}/submit`}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {latestSubmission ? "View / Resubmit" : "Submit Work"}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <section className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Submission History
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track your submitted versions, organization feedback, files, and comments.
              </p>

              {project.submissions.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500">
                  No work submitted yet.
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {project.submissions.map((submission, index) => (
                    <div
                    //   key={submission.id}
                    //   className={`rounded-2xl border p-5 ${

                      id={`submission-${submission.id}`}
  key={submission.id}
  className={`scroll-mt-28 rounded-2xl border p-5 ${
                        index === 0
                          ? "border-blue-200 bg-blue-50/30 ring-2 ring-blue-100"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-slate-900">
                            Version {submission.version}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {new Date(submission.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${submissionStyle(
                            submission.status
                          )}`}
                        >
                          {submissionLabel(submission.status)}
                        </span>
                      </div>

                      {submission.message && (
                        <p className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700">
                          {submission.message}
                        </p>
                      )}

                      {submission.feedback && (
                        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                          <p className="text-xs font-bold text-amber-700">
                            Organization Feedback
                          </p>
                          <p className="mt-1 text-sm leading-6 text-amber-800">
                            {submission.feedback}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap gap-2">
                        {submission.workUrl && (
                          <a
                            href={submission.workUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                          >
                            🔗 Open Work Link
                          </a>
                        )}

                        {submission.fileUrl && (
                          <a
                            href={submission.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            📎 View File
                          </a>
                        )}
                      </div>

                      <SubmissionCommentsThread
                        submissionId={submission.id}
                        initialComments={submission.comments || []}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Project Summary
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Organization
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {project.organization.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Application Status
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {application.status}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Project Status
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {project.status}
                  </p>
                </div>

<div>
  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
    Project Amount
  </p>
  <p className="mt-1 text-sm font-semibold text-emerald-700">
    {formatNairaFromKobo(project.stipendAmount)}
  </p>
</div>

              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Assigned Mentor
              </h2>

              {!project.mentor ? (
                <p className="mt-3 text-sm italic text-slate-500">
                  No mentor assigned yet.
                </p>
              ) : (
                <div className="mt-4">
                  <p className="font-bold text-slate-900">
                    {project.mentor.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Experience: {project.mentor.experience ?? "N/A"} years
                  </p>

                  {mentorSkills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {mentorSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="mt-3 text-sm font-medium text-yellow-600">
                    ⭐ {project.mentor.rating.toFixed(1)} ({project.mentor.ratingCount})
                  </p>

                  {/* <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/portfolio/${project.mentor.username}`}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View Profile
                    </Link>

                    <Link
                      href={`/dashboard/messages/start?userId=${project.mentor.id}`}
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                      Message
                    </Link>
                  </div> */}


                  <div className="mt-4 flex flex-wrap gap-2">
  <Link
    href={`/mentor/${project.mentor.username}`}
    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
  >
    View Profile
  </Link>

  <Link
    href={`/dashboard/messages/start?userId=${project.mentor.id}`}
    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
  >
    Message
  </Link>

  {project.status === "COMPLETED" && (
    <Link
      href={`/dashboard/volunteer/mentor-reviews/${project.id}`}
      className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
    >
      ⭐ Review Mentor
    </Link>
  )}
</div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
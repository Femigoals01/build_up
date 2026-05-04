


import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import SubmitWorkForm from "./SubmitWorkForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SubmitProjectWorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
    redirect("/login");
  }

  const { id } = await params;
   const projectId = id;

  const application = await prisma.application.findFirst({
    where: {
      projectId,
      volunteerId: session.user.id,
      status: "ACCEPTED",
    },
    include: {
      project: {
        include: {
          organization: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!application) {
    redirect("/dashboard/volunteer");
  }

  const latestSubmission = await prisma.projectSubmission.findFirst({
    where: {
      projectId,
      volunteerId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-8 md:px-8 lg:px-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <Link
          href="/dashboard/volunteer"
          className="inline-flex text-sm font-semibold text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 px-6 py-8 text-white md:px-8">
            <div className="absolute right-[-3rem] top-[-3rem] h-40 w-40 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">
                Submit Work
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Deliver your completed project work
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100 md:text-base">
                Submit your completed work for organization review. Once
                approved, the project can be completed and added to your proof of
                work.
              </p>
            </div>
          </div>

          <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="space-y-5">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Project
                </p>

                <h2 className="mt-3 text-xl font-bold text-slate-900">
                  {application.project.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {application.project.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {application.project.status.replaceAll("_", " ")}
                  </span>

                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                    {application.project.organization.name}
                  </span>
                </div>
              </div>

              {latestSubmission ? (
                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Latest Submission
                  </p>

                  <div className="mt-3">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                        latestSubmission.status === "PENDING"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : latestSubmission.status === "APPROVED"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-rose-200 bg-rose-50 text-rose-700"
                      }`}
                    >
                      {latestSubmission.status === "PENDING"
                        ? "Submitted — waiting review"
                        : latestSubmission.status === "APPROVED"
                        ? "Approved"
                        : "Rejected — needs revision"}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-500">
                    Submitted on{" "}
                    {new Date(latestSubmission.createdAt).toLocaleString()}
                  </p>
                </div>
              ) : null}
            </aside>

            <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              {latestSubmission?.status === "PENDING" ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-6 text-center">
                  <h3 className="text-lg font-bold text-amber-800">
                    Submission already sent
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-amber-700">
                    Your work is currently waiting for organization review.
                  </p>
                </div>
              ) : latestSubmission?.status === "APPROVED" ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-6 text-center">
                  <h3 className="text-lg font-bold text-emerald-800">
                    Work approved
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-emerald-700">
                    This submission has already been approved.
                  </p>
                </div>
              ) : (
                <SubmitWorkForm
                  projectId={projectId}
                  previousRejected={latestSubmission?.status === "REJECTED"}
                />
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
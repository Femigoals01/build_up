




import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import ProjectReviewForm from "./ProjectReviewForm";

export const dynamic = "force-dynamic";

function getInitials(name?: string | null) {
  if (!name) return "BU";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZATION") {
    redirect("/login");
  }

  const { projectId } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: session.user.id,
    },
    include: {
      applications: {
        where: {
          status: {
            in: ["ACCEPTED", "COMPLETED"],
          },
        },
        include: {
          volunteer: true,
        },
      },

      reviews: {
        where: {
          organizationId: session.user.id,
        },
      },
    },
  });

  if (!project) {
    redirect("/dashboard/organization");
  }

  const volunteer = project.applications[0]?.volunteer;

  const alreadyReviewed = project.reviews.length > 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          href="/dashboard/organization"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          <span>←</span>
          Back to Dashboard
        </Link>

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[36px] border border-white/40 bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 px-6 py-8 text-white shadow-[0_25px_80px_rgba(15,23,42,0.28)] md:px-8 md:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%)]" />

          <div className="absolute -right-20 top-0 h-60 w-60 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-100 backdrop-blur">
                ⭐ Review & Evaluation
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
                Evaluate project contribution
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100 md:text-base">
                Your review strengthens trust, validates real-world experience,
                and contributes to the volunteer’s public proof-of-work
                reputation across BuildUp.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
                    Project Status
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    Successfully Delivered
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
                    Proof System
                  </p>

                  <p className="mt-1 text-sm font-bold text-white">
                    Portfolio Verification Enabled
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full max-w-sm rounded-[30px] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 text-xl font-black text-white">
                  {getInitials(volunteer?.name)}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
                    Volunteer
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-white">
                    {volunteer?.name || "No Volunteer"}
                  </h3>

                  <p className="mt-1 text-sm text-blue-100">
                    {volunteer?.email || "No email"}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-100">
                    Reputation
                  </p>

                  <p className="mt-2 text-2xl font-black text-white">
                    Trust
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-100">
                    Outcome
                  </p>

                  <p className="mt-2 text-2xl font-black text-white">
                    Verified
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECT */}
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                Project Summary
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
                {project.title}
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
                {project.description}
              </p>
            </div>

            <div className="grid w-full max-w-sm grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Applicants
                </p>

                <p className="mt-2 text-3xl font-black text-slate-900">
                  {project.applications.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Reviews
                </p>

                <p className="mt-2 text-3xl font-black text-slate-900">
                  {project.reviews.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FORM */}
        <section className="space-y-6">
          {alreadyReviewed ? (
            <div className="rounded-[32px] border border-emerald-200 bg-emerald-50 px-6 py-8 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl">
                🎉
              </div>

              <h3 className="mt-5 text-3xl font-black text-emerald-900">
                Review already submitted
              </h3>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-emerald-700">
                Thank you for contributing to BuildUp’s trust and proof-of-work
                ecosystem. Your review has already been recorded successfully.
              </p>
            </div>
          ) : volunteer ? (
            <ProjectReviewForm projectId={projectId} />
          ) : (
            <div className="rounded-[32px] border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-4xl">
                📭
              </div>

              <h3 className="mt-5 text-2xl font-black text-slate-900">
                No volunteer found
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                There is currently no volunteer assigned to this project review.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import CompleteProjectConfirmButton from "./CompleteProjectConfirmButton";

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

export default async function CompleteProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
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
  const alreadyCompleted = project.status === "COMPLETED";
  const alreadyReviewed = project.reviews.length > 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link
          href="/dashboard/organization"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          <span>←</span>
          Back to Dashboard
        </Link>

        <section className="relative overflow-hidden rounded-[36px] border border-white/40 bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 px-6 py-8 text-white shadow-[0_25px_80px_rgba(15,23,42,0.25)] md:px-8 md:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%)]" />
          <div className="absolute -right-20 top-0 h-60 w-60 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-100 backdrop-blur">
                ✅ Project Completion
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
                Confirm project completion
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100 md:text-base">
                This action marks the project as completed, updates the
                volunteer’s verified portfolio history, and prepares the next
                step for review and proof-of-work validation.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
                    Completion Impact
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    Portfolio proof will be created
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
                    Next Step
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    Review volunteer contribution
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">
                Assigned Volunteer
              </p>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 text-xl font-black text-white">
                  {getInitials(volunteer?.name)}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">
                    {volunteer?.name || "No volunteer assigned"}
                  </h3>
                  <p className="mt-1 text-sm text-blue-100">
                    {volunteer?.email || "No email available"}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-100">
                    Status
                  </p>
                  <p className="mt-2 text-xl font-black text-white">
                    {project.status}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-100">
                    Reviews
                  </p>
                  <p className="mt-2 text-xl font-black text-white">
                    {project.reviews.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Project Summary
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
              {project.title}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              {project.description}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <InfoCard title="Difficulty" value={project.difficulty} />
              <InfoCard title="Applications" value={String(project.applications.length)} />
              <InfoCard title="Current Status" value={project.status} />
            </div>
          </section>

          <section className="rounded-[32px] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 shadow-sm md:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Completion Checklist
            </p>

            <h3 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
              Before you complete this project
            </h3>

            <div className="mt-6 space-y-3">
              <ChecklistItem text="The volunteer has submitted or delivered the expected work." />
              <ChecklistItem text="You have reviewed the project output and contribution." />
              <ChecklistItem text="You understand this will update the volunteer’s verified portfolio." />
              <ChecklistItem text="After completion, you should submit a fair review." />
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
              <p className="text-sm font-semibold text-amber-900">
                Important accountability note
              </p>
              <p className="mt-2 text-sm leading-6 text-amber-800">
                BuildUp uses completed projects as verified proof of work.
                Please only complete this project if the work has truly reached a
                final delivery stage.
              </p>
            </div>
          </section>
        </div>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
          {alreadyCompleted ? (
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
                  Already Completed
                </p>

                <h3 className="mt-2 text-2xl font-black text-slate-900">
                  This project has already been marked completed.
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  The project completion has been recorded. You can now submit
                  or view the volunteer review.
                </p>
              </div>

              <Link
                href={`/dashboard/organization/projects/${projectId}/review`}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
              >
                {alreadyReviewed ? "View Review Status" : "Review Volunteer"}
              </Link>
            </div>
          ) : volunteer ? (
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                  Ready to Complete
                </p>

                <h3 className="mt-2 text-2xl font-black text-slate-900">
                  Confirm completion and unlock verified proof.
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Once confirmed, this project will be marked completed and added
                  to the volunteer’s verified BuildUp portfolio history.
                </p>
              </div>

              <CompleteProjectConfirmButton projectId={projectId} />
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-8 text-center">
              <h3 className="text-xl font-black text-slate-900">
                No accepted volunteer found
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                You need an accepted volunteer before this project can be
                completed.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

function ChecklistItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">
        ✓
      </span>

      <p className="text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}
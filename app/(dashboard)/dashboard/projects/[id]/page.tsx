






import Image from "next/image";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import ApplyButton from "@/components/projects/ApplyButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getFocusBanner(focus?: string) {
  switch (focus) {
    case "invite-accepted":
      return {
        title: "Invite accepted",
        message:
          "A volunteer accepted your invitation for this project. Review the project activity and continue the workflow from here.",
        className: "border-emerald-200 bg-emerald-50 text-emerald-800",
        icon: "✅",
      };
    case "invite-declined":
      return {
        title: "Invite declined",
        message:
          "A volunteer declined your invitation for this project. You can review other candidates or send a new invitation.",
        className: "border-amber-200 bg-amber-50 text-amber-800",
        icon: "⚠️",
      };
    default:
      return null;
  }
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function getStatusStyles(status: string) {
  switch (status) {
    case "OPEN":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "IN_PROGRESS":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "COMPLETED":
      return "border-slate-200 bg-slate-100 text-slate-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function getInitial(name?: string | null) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "U";
}

function splitSkills(skills?: string | null) {
  if (!skills?.trim()) return [];
  return skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

export default async function ProjectDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ focus?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.id) {
    redirect("/login");
  }

  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const focus = resolvedSearchParams?.focus;
  const focusBanner = getFocusBanner(focus);

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
        },
      },
      applications: {
        include: {
          volunteer: {
            select: {
              id: true,
              name: true,
              email: true,
              username: true,
              bio: true,
              skills: true,
              experience: true,
              country: true,
              profileImageUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!project) return notFound();

  const isOrganizationViewer = session.user.role === "ORGANIZATION";
  const isVolunteerViewer = session.user.role === "VOLUNTEER";
  const isProjectOwner = project.organization.id === session.user.id;

  const acceptedVolunteers = project.applications.filter(
    (app) => app.status === "ACCEPTED"
  );
  const pendingApplications = project.applications.filter(
    (app) => app.status === "PENDING"
  );
  const pendingVolunteerApplications = pendingApplications.filter(
    (app) => app.source === "VOLUNTEER"
  );
  const pendingInvites = pendingApplications.filter(
    (app) => app.source === "ORGANIZATION"
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 md:px-8 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {focusBanner && (
          <section
            className={`rounded-[26px] border px-5 py-5 shadow-sm sm:px-6 ${focusBanner.className}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-xl shadow-sm">
                {focusBanner.icon}
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em]">
                  Project Update
                </p>
                <h2 className="mt-2 text-lg font-bold">{focusBanner.title}</h2>
                <p className="mt-2 text-sm leading-6">{focusBanner.message}</p>
              </div>
            </div>
          </section>
        )}

        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="relative px-6 py-8 md:px-8 md:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.06),transparent_24%)]" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  Project Details
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  {project.title}
                </h1>

                {/* <p className="mt-3 text-sm leading-6 text-slate-500 md:text-base">
                  Posted by {project.organization.name}
                </p> */}

                <p className="mt-3 text-sm leading-6 text-slate-500 md:text-base">
  Posted by {project.organization.name}
</p>

<div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2">
  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
    Project Ref
  </span>

  <span className="font-mono text-sm font-bold text-blue-800">
    {project.referenceNo || "Not Assigned"}
  </span>
</div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(
                      project.status
                    )}`}
                  >
                    {formatStatus(project.status)}
                  </span>

                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                    {project.applications.length} applicant
                    {project.applications.length === 1 ? "" : "s"}
                  </span>

                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                    {acceptedVolunteers.length} active volunteer
                    {acceptedVolunteers.length === 1 ? "" : "s"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {isOrganizationViewer ? (
                  <>
                    <Link
                      href="/dashboard/organization"
                      className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Back to Dashboard
                    </Link>

                    <Link
                      href="/dashboard/organization/invites"
                      className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                      Invite History
                    </Link>
                  </>
                ) : isVolunteerViewer ? (
                  <ApplyButton projectId={project.id} />
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                Project Description
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-700 md:text-base">
                {project.description}
              </p>
            </section>

            {project.requirements && (
              <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                  Requirements
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-700 md:text-base">
                  {project.requirements}
                </p>
              </section>
            )}

            <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                Skills Needed
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.skills.map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {isOrganizationViewer && isProjectOwner && (
              <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                    Pending Applicants
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Review volunteer applications with quick profile context and
                    portfolio access.
                  </p>
                </div>

                {pendingVolunteerApplications.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                    <p className="text-sm font-medium text-slate-700">
                      No pending volunteer applications yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingVolunteerApplications.map((app) => {
                      const volunteerSkills = splitSkills(app.volunteer.skills);

                      return (
                        <div
                          key={app.id}
                          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="flex items-start gap-4">
                              <div className="relative h-14 w-14 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                                {app.volunteer.profileImageUrl ? (
                                  <Image
                                    src={app.volunteer.profileImageUrl}
                                    alt={app.volunteer.name || "Volunteer"}
                                    fill
                                    className="object-cover"
                                    sizes="56px"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
                                    {getInitial(app.volunteer.name)}
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-base font-bold text-slate-900">
                                    {app.volunteer.name || "Volunteer"}
                                  </h3>

                                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                    Pending
                                  </span>
                                </div>

                                <p className="mt-1 text-sm text-slate-500">
                                  {app.volunteer.username
                                    ? `@${app.volunteer.username}`
                                    : "Username not added yet"}
                                  {app.volunteer.country
                                    ? ` • ${app.volunteer.country}`
                                    : ""}
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                  {app.volunteer.email}
                                </p>

                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                                  {app.volunteer.bio?.trim()
                                    ? app.volunteer.bio
                                    : "This volunteer has not added a bio yet."}
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                  {volunteerSkills.length > 0 ? (
                                    volunteerSkills.slice(0, 4).map((skill) => (
                                      <span
                                        key={skill}
                                        className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                                      >
                                        {skill}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                      No skills added yet
                                    </span>
                                  )}
                                </div>

                                <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                                  Experience:{" "}
                                  <span className="text-slate-600 normal-case tracking-normal">
                                    {app.volunteer.experience?.trim()
                                      ? app.volunteer.experience
                                      : "Not added yet"}
                                  </span>
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                              {app.volunteer.username ? (
                                <Link
                                  href={`/portfolio/${app.volunteer.username}`}
                                  className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                                >
                                  View Portfolio
                                </Link>
                              ) : (
                                <span className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-500">
                                  No Portfolio Yet
                                </span>
                              )}

                              <Link
                                href={`/dashboard/messages?user=${app.volunteer.id}`}
                                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                              >
                                Message
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {isOrganizationViewer && isProjectOwner && pendingInvites.length > 0 && (
              <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                    Invitations Awaiting Response
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Volunteers you invited who have not responded yet.
                  </p>
                </div>

                <div className="space-y-4">
                  {pendingInvites.map((app) => (
                    <div
                      key={app.id}
                      className="rounded-2xl border border-purple-200 bg-purple-50/60 p-5"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="relative h-14 w-14 overflow-hidden rounded-full border border-purple-200 bg-white">
                            {app.volunteer.profileImageUrl ? (
                              <Image
                                src={app.volunteer.profileImageUrl}
                                alt={app.volunteer.name || "Volunteer"}
                                fill
                                className="object-cover"
                                sizes="56px"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 text-sm font-bold text-white">
                                {getInitial(app.volunteer.name)}
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-base font-semibold text-slate-900">
                                {app.volunteer.name || "Volunteer"}
                              </p>
                              <span className="rounded-full border border-purple-200 bg-white px-2.5 py-1 text-xs font-semibold text-purple-700">
                                Invited by organization
                              </span>
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                              {app.volunteer.username
                                ? `@${app.volunteer.username}`
                                : "Username not added yet"}
                              {app.volunteer.country
                                ? ` • ${app.volunteer.country}`
                                : ""}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {app.volunteer.email}
                            </p>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                              {app.volunteer.bio?.trim()
                                ? app.volunteer.bio
                                : "This volunteer has not added a bio yet."}
                            </p>
                          </div>
                        </div>

                        {app.volunteer.username ? (
                          <Link
                            href={`/portfolio/${app.volunteer.username}`}
                            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            View Portfolio
                          </Link>
                        ) : (
                          <span className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-500">
                            No Portfolio Yet
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-6">
            <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
              <h2 className="text-lg font-semibold text-slate-900">
                Project Snapshot
              </h2>

              <div className="mt-5 grid gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Status
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {formatStatus(project.status)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Organization
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {project.organization.name}
                  </p>
                </div>


<div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
    Reference Number
  </p>

  <p className="mt-2 font-mono text-sm font-bold text-blue-900">
    {project.referenceNo || "Not Assigned"}
  </p>
</div>



                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Applicants
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {project.applications.length}
                  </p>
                </div>
              </div>
            </section>

            {isOrganizationViewer && isProjectOwner && (
              <section className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm md:p-7">
                <h2 className="text-lg font-semibold text-slate-900">
                  Organization View
                </h2>

                <div className="mt-5 grid gap-4">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                      Accepted Volunteers
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {acceptedVolunteers.length}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                      Pending Applications
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {pendingVolunteerApplications.length}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-purple-700">
                      Pending Invites
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {pendingInvites.length}
                    </p>
                  </div>
                </div>

                {acceptedVolunteers.length > 0 && (
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Active Volunteers
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {acceptedVolunteers.map((app) =>
                        app.volunteer.username ? (
                          <Link
                            key={app.id}
                            href={`/portfolio/${app.volunteer.username}`}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                          >
                            {app.volunteer.name}
                          </Link>
                        ) : (
                          <span
                            key={app.id}
                            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700"
                          >
                            {app.volunteer.name}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}





import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getInitial(name?: string | null) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "U";
}

function parseSkills(skills: string | null) {
  if (!skills) return [];
  return skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function getProfileSummaryStrength(input: {
  bio?: string | null;
  skills?: string | null;
  experience?: string | null;
  profileImageUrl?: string | null;
  portfolioCount: number;
}) {
  const checks = [
    Boolean(input.bio?.trim()),
    Boolean(input.skills?.trim()),
    Boolean(input.experience?.trim()),
    Boolean(input.profileImageUrl?.trim()),
    input.portfolioCount > 0,
  ];

  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

function getStatusStyles(status: string) {
  switch (status) {
    case "OPEN":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "COMPLETED":
      return "bg-slate-100 text-slate-700 border-slate-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

export default async function OrganizationInvitePage({
  searchParams,
}: {
  searchParams?: Promise<{
    username?: string;
    success?: string;
    error?: string;
  }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZATION" || !session.user.id) {
    redirect("/login");
  }

  const params = await searchParams;
  const username = params?.username?.trim();

  if (!username) {
    redirect("/dashboard/organization");
  }

  const volunteer = await prisma.user.findFirst({
  where: {
    username,
    role: "VOLUNTEER",
    isPortfolioPublic: true,
  },
  select: {
    id: true,
    name: true,
    username: true,
    bio: true,
    skills: true,
    experience: true,
    country: true,
    profileImageUrl: true,
    rating: true,
    ratingCount: true,
  },
});

  if (!volunteer) {
    redirect("/dashboard/organization");
  }


  const portfolioCount = await prisma.portfolioItem.count({
  where: {
    volunteerId: volunteer.id,
  },
});

  const volunteerBadges = await prisma.badge.findMany({
    where: { userId: volunteer.id },
    select: {
      id: true,
      name: true,
      icon: true,
    },
    take: 6,
    orderBy: { createdAt: "asc" },
  });

  const projects = await prisma.project.findMany({
    where: {
      organizationId: session.user.id,
      status: {
        in: ["OPEN", "IN_PROGRESS"],
      },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      skills: true,
      applications: {
        where: {
          volunteerId: volunteer.id,
        },
        select: {
          id: true,
          status: true,
        },
        take: 1,
      },
    },
  });

  const volunteerSkills = parseSkills(volunteer.skills);
//   const strength = getProfileSummaryStrength({
//     bio: volunteer.bio,
//     skills: volunteer.skills,
//     experience: volunteer.experience,
//     profileImageUrl: volunteer.profileImageUrl,
//     portfolioCount: volunteer.portfolioItems.length,
//   });


const strength = getProfileSummaryStrength({
  bio: volunteer.bio,
  skills: volunteer.skills,
  experience: volunteer.experience,
  profileImageUrl: volunteer.profileImageUrl,
  portfolioCount,
});

  const successMessage =
    params?.success === "invite-sent"
      ? "Invitation sent successfully."
      : null;

  const errorMessage =
    params?.error === "already-linked"
      ? "This volunteer is already linked to that project."
      : params?.error === "missing-data"
      ? "Missing invite data."
      : params?.error === "project-not-found"
      ? "Project not found or not available for invites."
      : params?.error === "volunteer-not-found"
      ? "Volunteer not found."
      : params?.error === "failed"
      ? "Failed to send invite."
      : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 md:px-8 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="relative px-6 py-8 md:px-8 md:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_24%)]" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  Invite Volunteer
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  Choose a project for this volunteer
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                  Select one of your active projects and send a direct invitation
                  to this volunteer from your organization workspace.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/portfolio/${volunteer.username}`}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  View Portfolio
                </Link>

                <Link
                  href="/dashboard/organization"
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>

        {successMessage && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {errorMessage}
          </div>
        )}

        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-start gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                {volunteer.profileImageUrl ? (
                  <Image
                    src={volunteer.profileImageUrl}
                    alt={volunteer.name || "Volunteer profile image"}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl font-bold text-white">
                    {getInitial(volunteer.name)}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  {volunteer.name}
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  @{volunteer.username}
                </p>

                <div className="mt-3 flex flex-wrap gap-3">
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    ⭐ {volunteer.rating.toFixed(1)} / 5
                  </span>

                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                    {volunteer.ratingCount} review
                    {volunteer.ratingCount === 1 ? "" : "s"}
                  </span>

                  <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    Profile strength {strength}%
                  </span>
                </div>
              </div>
            </div>

            {volunteer.bio && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Bio
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {volunteer.bio}
                </p>
              </div>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Experience
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {volunteer.experience || "N/A"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Country
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {volunteer.country || "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Skills
              </p>

              {volunteerSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {volunteerSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No skills listed yet.</p>
              )}
            </div>

            <div className="mt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Badges
              </p>

              {volunteerBadges.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {volunteerBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
                    >
                      <span className="text-lg">{badge.icon}</span>
                      <span className="text-xs font-medium text-slate-700">
                        {badge.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No badges yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex flex-col gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Select a project
              </h2>
              <p className="text-sm leading-6 text-slate-500">
                Only your active projects are shown here. After sending the invite,
                the volunteer gets a pending project record and you can continue
                from your normal dashboard workflow.
              </p>
            </div>

            {projects.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                <div className="mx-auto max-w-md">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    📁
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    No active projects available
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Create a new project first, or reopen an existing one before
                    sending an invite.
                  </p>
                  <Link
                    href="/projects/new"
                    className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Post a New Project
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => {
                  const existingApplication = project.applications[0];
                  const matchedSkills = project.skills.filter((skill) =>
                    volunteerSkills.includes(skill)
                  );

                  return (
                    <div
                      key={project.id}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {project.title}
                            </h3>

                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(
                                project.status
                              )}`}
                            >
                              {project.status.replaceAll("_", " ")}
                            </span>

                            <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                              {matchedSkills.length} skill match
                            </span>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {project.skills.map((skill) => (
                              <span
                                key={skill}
                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                  matchedSkills.includes(skill)
                                    ? "border border-blue-200 bg-blue-100 text-blue-700"
                                    : "border border-slate-200 bg-white text-slate-600"
                                }`}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>

                          {existingApplication && (
                            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                              This volunteer already has an application on this
                              project with status:{" "}
                              <span className="font-semibold">
                                {existingApplication.status}
                              </span>
                              .
                            </div>
                          )}
                        </div>

                        <div className="w-full lg:w-auto lg:min-w-[220px]">
                          {existingApplication ? (
                            <button
                              disabled
                              className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-200 px-5 text-sm font-semibold text-slate-500"
                            >
                              Already Linked
                            </button>
                          ) : (
                            <form
                              action="/api/organizations/invite-volunteer"
                              method="POST"
                              className="space-y-3"
                            >
                              <input
                                type="hidden"
                                name="projectId"
                                value={project.id}
                              />
                              <input
                                type="hidden"
                                name="volunteerId"
                                value={volunteer.id}
                              />
                              <input
                                type="hidden"
                                name="username"
                                value={volunteer.username}
                              />

                              <button className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                                Send Invite
                              </button>
                            </form>
                          )}

                          <Link
                            href={`/dashboard/projects/${project.id}`}
                            className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            View Project
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}





import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { calculateProfileStrength } from "@/lib/profileStrength";
import { getProfileLevel, getNextProfileLevel } from "@/lib/profileLevel";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getRatingLabel(rating: number) {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4) return "Strong";
  if (rating >= 3) return "Good";
  if (rating > 0) return "Growing";
  return "No ratings yet";
}

function parseSkills(skills: string | null) {
  if (!skills) return [];
  return skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function getInitial(name?: string | null) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "U";
}

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findFirst({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      skills: true,
      experience: true,
      country: true,
      countryCode: true,
      mobileNumber: true,
      profileImageUrl: true,
      rating: true,
      ratingCount: true,
      isPortfolioPublic: true,
      showCountryPublicly: true,
      showBioPublicly: true,
      showSkillsPublicly: true,
      showReviewsPublicly: true,
      showBadgesPublicly: true,
    },
  });

  if (!user || !user.isPortfolioPublic) {
    notFound();
  }

  const [badges, portfolioItems] = await Promise.all([
    user.showBadgesPublicly
      ? prisma.badge.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "asc" },
        })
      : Promise.resolve([]),

    prisma.portfolioItem.findMany({
      where: { volunteerId: user.id },
      include: {
        project: {
          include: {
            organization: {
              select: { name: true },
            },
          },
        },
        review: true,
      },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  const skills = user.showSkillsPublicly ? parseSkills(user.skills) : [];

  const profileStrength = calculateProfileStrength({
    username: user.username,
    bio: user.bio,
    skills: user.skills,
    experience: user.experience,
    country: user.country,
    countryCode: user.countryCode,
    mobileNumber: user.mobileNumber,
    profileImageUrl: user.profileImageUrl,
    portfolioCount: portfolioItems.length,
  });

  const profileLevel = getProfileLevel(profileStrength.score);
  const nextProfileLevel = getNextProfileLevel(profileStrength.score);

  const totalProjects = portfolioItems.length;
  const totalReviews = user.ratingCount;
  const totalBadges = badges.length;

  const isSignedIn = Boolean(session?.user);
  const isOrganization = session?.user?.role === "ORGANIZATION";
  const isOwner = session?.user?.username === user.username;

  

  const inviteHref = isSignedIn
  ? `/dashboard/organization/invite?username=${encodeURIComponent(user.username)}`
  : `/login?next=${encodeURIComponent(`/portfolio/${user.username}`)}`;

  const messageHref = isSignedIn
    ? `/dashboard/messages?username=${encodeURIComponent(user.username)}`
    : `/login?next=${encodeURIComponent(`/portfolio/${user.username}`)}`;

  const contactHref = isSignedIn
    ? `/dashboard/messages?username=${encodeURIComponent(user.username)}&intent=contact`
    : `/login?next=${encodeURIComponent(`/portfolio/${user.username}`)}`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
      <section className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                Public Portfolio
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative h-16 w-16 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  {user.profileImageUrl ? (
                    <Image
                      src={user.profileImageUrl}
                      alt={user.name || "Profile image"}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl font-bold text-white">
                      {getInitial(user.name)}
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                    {user.name}
                  </h1>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    @{user.username}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${profileLevel.borderClass} ${profileLevel.bgClass} ${profileLevel.colorClass}`}
                    >
                      <span>{profileLevel.icon}</span>
                      {profileLevel.name}
                    </span>

                    <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      Profile Strength {profileStrength.score}%
                    </span>
                  </div>
                </div>
              </div>

              {user.showBioPublicly && user.bio && (
                <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
                  {user.bio}
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                    Rating
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    ⭐ {user.rating.toFixed(1)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {user.ratingCount} review{user.ratingCount === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Portfolio Items
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {portfolioItems.length}
                  </p>
                  <p className="text-xs text-slate-500">Published work</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Experience
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {user.experience || "N/A"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {getRatingLabel(user.rating)}
                  </p>
                </div>
              </div>

              {!isOwner && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {isOrganization ? (
                    <>
                      <Link
                        href={inviteHref}
                        className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                      >
                        Invite to Project
                      </Link>

                      <Link
                        href={messageHref}
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Message
                      </Link>

                      <Link
                        href={contactHref}
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 px-5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        Contact
                      </Link>
                    </>
                  ) : isSignedIn ? (
                    <>
                      <Link
                        href={messageHref}
                        className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                      >
                        Message
                      </Link>

                      <Link
                        href={contactHref}
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 px-5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        Contact
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href={inviteHref}
                        className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                      >
                        Login to Invite
                      </Link>

                      <Link
                        href={messageHref}
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Login to Message
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Profile Snapshot
              </h2>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  BuildUp Profile Level
                </p>
                <p className="mt-2 text-xl font-bold text-slate-900">
                  {profileLevel.icon} {profileLevel.name}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  This level reflects how complete and presentation-ready this
                  BuildUp profile is.
                </p>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-600">Profile strength</span>
                    <span className="font-semibold text-blue-600">
                      {profileStrength.score}%
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      style={{ width: `${profileStrength.score}%` }}
                    />
                  </div>

                  {nextProfileLevel ? (
                    <p className="mt-3 text-sm text-slate-500">
                      Next milestone:{" "}
                      <span className="font-semibold text-slate-700">
                        {nextProfileLevel.name}
                      </span>{" "}
                      at{" "}
                      <span className="font-semibold text-slate-700">
                        {nextProfileLevel.min}%
                      </span>
                      .
                    </p>
                  ) : (
                    <p className="mt-3 text-sm font-semibold text-emerald-600">
                      Highest level reached.
                    </p>
                  )}
                </div>
              </div>

              {user.showSkillsPublicly && (
                <div className="mt-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Skills
                  </p>

                  {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No skills added yet.</p>
                  )}
                </div>
              )}

              {user.showCountryPublicly && (
                <div className="mt-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Country
                  </p>

                  {user.country ? (
                    <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                      🌍 {user.country}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No country added yet.</p>
                  )}
                </div>
              )}

              {user.showBadgesPublicly && (
                <div className="mt-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Badges
                  </p>

                  {badges.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {badges.map((badge) => (
                        <div
                          key={badge.id}
                          title={`${badge.name} — ${badge.description}`}
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
              )}

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Portfolio Signal
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  This page showcases real completed work, contributions, review
                  feedback, and public proof where available.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Profile Level
              </p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {profileLevel.icon} {profileLevel.name}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Projects
              </p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {totalProjects}
              </p>
              <p className="text-xs text-slate-500">Completed</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Reviews
              </p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                ⭐ {totalReviews}
              </p>
              <p className="text-xs text-slate-500">Feedback received</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Badges
              </p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                🎖 {totalBadges}
              </p>
              <p className="text-xs text-slate-500">Achievements</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Featured Work
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Completed projects, contributions, and proof of work.
          </p>
        </div>

        {portfolioItems.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
                🌍
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                No portfolio items yet
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                This volunteer has not published any completed work to their
                public portfolio yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {portfolioItems.map((item, index) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
              >
                <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="p-6 md:p-7">
                    <div className="mb-5 flex flex-wrap items-start gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg text-white shadow-sm">
                        📁
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                            Featured #{index + 1}
                          </span>

                          {user.showReviewsPublicly && item.review && (
                            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                              ⭐ {item.review.rating}/5
                            </span>
                          )}
                        </div>

                        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                          {item.project.title}
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                          Organization: {item.project.organization?.name || "Unknown"}
                        </p>
                      </div>
                    </div>

                    {item.contribution ? (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Contribution
                        </p>
                        <p className="text-sm leading-7 text-slate-700">
                          {item.contribution}
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                        <p className="text-sm text-slate-500">
                          No contribution summary added yet.
                        </p>
                      </div>
                    )}

                    {user.showReviewsPublicly && item.review && (
                      <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-5">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                          Review Feedback
                        </p>
                        <p className="text-sm italic leading-7 text-slate-700">
                          “{item.review.comment}”
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-200 bg-slate-50/70 p-6 md:p-7 lg:border-l lg:border-t-0">
                    <div className="space-y-5">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Project Status
                        </p>
                        <p className="mt-2 text-sm font-semibold text-emerald-700">
                          Completed
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Public Proof
                        </p>

                        <div className="mt-3 space-y-2">
                          {item.proofUrl ? (
                            <a
                              href={item.proofUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-sm font-semibold text-blue-600 hover:underline"
                            >
                              View Proof Link →
                            </a>
                          ) : (
                            <p className="text-sm text-slate-500">
                              No proof link added.
                            </p>
                          )}

                          {item.imageUrl ? (
                            <a
                              href={item.imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-sm font-semibold text-blue-600 hover:underline"
                            >
                              View Project Image →
                            </a>
                          ) : (
                            <p className="text-sm text-slate-500">
                              No project image added.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Showcase Value
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          This project is part of a public, proof-based portfolio
                          showing real completed work and contribution.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <section className="mt-10 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                Looking for proof-based talent?
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                BuildUp helps organizations discover volunteers with visible,
                real-world project experience.
              </p>
            </div>

            <Link
              href="/register/organization"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Join BuildUp
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
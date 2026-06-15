




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
  if (rating >= 4.5) return "Elite Talent";
  if (rating >= 4) return "Strong Performer";
  if (rating >= 3) return "Reliable Contributor";
  if (rating > 0) return "Growing Talent";
  return "New Talent";
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

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function getProofConfidence({
  hasReview,
  hasProofUrl,
  hasImageUrl,
  hasContribution,
}: {
  hasReview: boolean;
  hasProofUrl: boolean;
  hasImageUrl: boolean;
  hasContribution: boolean;
}) {
  const score = [hasReview, hasProofUrl, hasImageUrl, hasContribution].filter(
    Boolean
  ).length;

  if (score >= 4) return { label: "Very High", value: 100 };
  if (score === 3) return { label: "High", value: 80 };
  if (score === 2) return { label: "Good", value: 60 };
  if (score === 1) return { label: "Basic", value: 35 };

  return { label: "Growing", value: 20 };
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
      level: true,
      points: true,
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

  const reviewItems = portfolioItems.filter(
  (item) => item.review
);

const technicalAverage =
  reviewItems.length > 0
    ? (
        reviewItems.reduce(
          (sum, item) =>
            sum + (item.review?.technicalSkill || 0),
          0
        ) / reviewItems.length
      ).toFixed(1)
    : "0.0";

const communicationAverage =
  reviewItems.length > 0
    ? (
        reviewItems.reduce(
          (sum, item) =>
            sum + (item.review?.communication || 0),
          0
        ) / reviewItems.length
      ).toFixed(1)
    : "0.0";

const professionalismAverage =
  reviewItems.length > 0
    ? (
        reviewItems.reduce(
          (sum, item) =>
            sum + (item.review?.professionalism || 0),
          0
        ) / reviewItems.length
      ).toFixed(1)
    : "0.0";

const timelinessAverage =
  reviewItems.length > 0
    ? (
        reviewItems.reduce(
          (sum, item) =>
            sum + (item.review?.timeliness || 0),
          0
        ) / reviewItems.length
      ).toFixed(1)
    : "0.0";

  const totalReviews = user.ratingCount;
  const totalBadges = badges.length;

  const isSignedIn = Boolean(session?.user);
  const isOrganization = session?.user?.role === "ORGANIZATION";
  const isOwner = session?.user?.username === user.username;

  const inviteHref = isSignedIn
    ? `/dashboard/organization/invite?username=${encodeURIComponent(
        user.username
      )}`
    : `/login?next=${encodeURIComponent(`/portfolio/${user.username}`)}`;

  const messageHref = isSignedIn
    ? `/dashboard/messages?username=${encodeURIComponent(user.username)}`
    : `/login?next=${encodeURIComponent(`/portfolio/${user.username}`)}`;

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-start">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[26px] border border-slate-200 bg-slate-100 shadow-sm">
                  {user.profileImageUrl ? (
                    <Image
                      src={user.profileImageUrl}
                      alt={user.name || "Profile image"}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-950 text-4xl font-black text-white">
                      {getInitial(user.name)}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      Verified BuildUp Portfolio
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${profileLevel.borderClass} ${profileLevel.bgClass} ${profileLevel.colorClass}`}
                    >
                      {profileLevel.icon} {profileLevel.name}
                    </span>
                  </div>

                  <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
                    {user.name}
                  </h1>

                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    @{user.username}
                  </p>

                  {user.showBioPublicly && user.bio ? (
                    <p className="mt-5 max-w-3xl text-[15px] leading-8 text-slate-600">
                      {user.bio}
                    </p>
                  ) : (
                    <p className="mt-5 max-w-3xl text-[15px] leading-8 text-slate-500">
                      A proof-based BuildUp profile showing verified work,
                      completed projects, and organization-backed experience.
                    </p>
                  )}

                  <div className="mt-6 flex flex-wrap gap-2">
                    <ProfilePill label="Rating" value={`⭐ ${user.rating.toFixed(1)}`} />
                    <ProfilePill label="Projects" value={`${totalProjects}`} />
                    <ProfilePill label="Reviews" value={`${totalReviews}`} />
                    <ProfilePill label="Badges" value={`${totalBadges}`} />
                    {user.showCountryPublicly && user.country ? (
                      <ProfilePill label="Location" value={`🌍 ${user.country}`} />
                    ) : null}
                  </div>

                  {!isOwner ? (
                    <div className="mt-7 flex flex-wrap gap-3">
                      {isOrganization ? (
                        <>
                          <Link
                            href={inviteHref}
                            className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
                          >
                            Invite to Project
                          </Link>

                          <Link
                            href={messageHref}
                            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                          >
                            Message
                          </Link>
                        </>
                      ) : (
                        <Link
                          href={messageHref}
                          className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
                        >
                          Message
                        </Link>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <aside className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Profile Readiness
                  </p>
                  <p className="mt-2 text-4xl font-black">
                    {profileStrength.score}%
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl">
                  ⚡
                </div>
              </div>

              <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 to-emerald-400"
                  style={{ width: `${profileStrength.score}%` }}
                />
              </div>

              <div className="mt-6 space-y-3">
                <SnapshotRow label="Level" value={`${profileLevel.icon} ${profileLevel.name}`} />
                <SnapshotRow label="Signal" value={getRatingLabel(user.rating)} />
                <SnapshotRow label="Verified Work" value={`${totalProjects}`} />
              </div>

              {nextProfileLevel ? (
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Next Milestone
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Reach {nextProfileLevel.min}% to unlock{" "}
                    <span className="font-bold text-white">
                      {nextProfileLevel.name}
                    </span>
                    .
                  </p>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                  <p className="text-sm font-bold text-emerald-200">
                    Highest level achieved.
                  </p>
                </div>
              )}

              {user.showSkillsPublicly ? (
                <div className="mt-6">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Core Skills
                  </p>

                  {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {skills.slice(0, 10).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">No skills added yet.</p>
                  )}
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
  <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
          Reputation Dashboard
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-950">
          Verified Performance Metrics
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Generated from verified BuildUp reviews.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-950 px-5 py-4 text-white">
        <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
          Volunteer Level
        </p>

        <p className="mt-1 text-2xl font-black">
          Level {user.level}
        </p>

        <p className="text-sm text-slate-300">
          {user.points} Points
        </p>
      </div>
    </div>

    <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <MetricCard
        label="Overall Rating"
        value={`${user.rating.toFixed(1)} ⭐`}
      />

      <MetricCard
        label="Technical Skill"
        value={technicalAverage}
      />

      <MetricCard
        label="Communication"
        value={communicationAverage}
      />

      <MetricCard
        label="Professionalism"
        value={professionalismAverage}
      />

      <MetricCard
        label="Timeliness"
        value={timelinessAverage}
      />
    </div>
  </div>
</section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
              Verified Work
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              Featured Project Evidence
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Compact proof cards showing contribution, review, public proof,
              skills, and verification quality.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
            {totalProjects} verified project{totalProjects === 1 ? "" : "s"}
          </div>
        </div>

        {portfolioItems.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                🌍
              </div>
              <h3 className="text-xl font-bold text-slate-950">
                No portfolio items yet
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                This volunteer has not published completed BuildUp work yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {portfolioItems.map((item, index) => {
              const projectSkills = item.project.skills || [];
              const proofConfidence = getProofConfidence({
                hasReview: Boolean(item.review),
                hasProofUrl: Boolean(item.proofUrl),
                hasImageUrl: Boolean(item.imageUrl),
                hasContribution: Boolean(item.contribution),
              });

              return (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="grid gap-0 lg:grid-cols-[190px_1fr_280px]">
                    <div className="relative min-h-[190px] border-b border-slate-200 bg-slate-100 lg:border-b-0 lg:border-r">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.project.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="190px"
                        />
                      ) : (
                        <div className="flex h-full min-h-[190px] items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-4xl">
                          📁
                        </div>
                      )}

                      <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-slate-700 shadow-sm backdrop-blur">
                        #{index + 1}
                      </div>
                    </div>

                    <div className="p-5 md:p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                          Verified
                        </span>

                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                          {formatDate(item.createdAt)}
                        </span>

                        {user.showReviewsPublicly && item.review ? (
                          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                            ⭐ {item.review.rating}/5
                          </span>
                        ) : null}
                      </div>

                      <h3 className="mt-3 line-clamp-2 text-xl font-black tracking-tight text-slate-950">
                        {item.project.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Organization:{" "}
                        <span className="font-bold text-slate-700">
                          {item.project.organization?.name || "Unknown"}
                        </span>
                      </p>

                      <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                          Contribution
                        </p>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-700">
                          {item.contribution ||
                            "No contribution summary has been added yet."}
                        </p>
                      </div>

                      {projectSkills.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {projectSkills.slice(0, 6).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      {user.showReviewsPublicly && item.review ? (
                        <div className="mt-4 border-l-4 border-amber-300 pl-4">
                          <p className="line-clamp-2 text-sm italic leading-6 text-slate-600">
                            “{item.review.comment}”
                          </p>
                        </div>
                      ) : null}
                    </div>

                    <div className="border-t border-slate-200 bg-slate-50 p-5 lg:border-l lg:border-t-0">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                              Proof
                            </p>
                            <p className="mt-1 text-lg font-black text-slate-950">
                              {proofConfidence.label}
                            </p>
                          </div>

                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                            {proofConfidence.value}%
                          </span>
                        </div>

                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
                            style={{ width: `${proofConfidence.value}%` }}
                          />
                        </div>

                        <div className="mt-4 space-y-2">
                          <ProofMini active={Boolean(item.review)} label="Review" />
                          <ProofMini
                            active={Boolean(item.contribution)}
                            label="Contribution"
                          />
                          <ProofMini active={Boolean(item.proofUrl)} label="Proof link" />
                          <ProofMini active={Boolean(item.imageUrl)} label="Image" />
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        {item.proofUrl ? (
                          <a
                            href={item.proofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 items-center justify-between rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800"
                          >
                            <span>View Proof</span>
                            <span>→</span>
                          </a>
                        ) : (
                          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-500">
                            No proof link
                          </div>
                        )}

                        {item.imageUrl ? (
                          <a
                            href={item.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                          >
                            <span>View Image</span>
                            <span>→</span>
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {user.showBadgesPublicly && badges.length > 0 ? (
          <section className="mt-8 rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                Recognition
              </p>
              <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                Badges & Achievements
              </h3>
            </div>

            <div className="flex flex-wrap gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  title={`${badge.name} — ${badge.description}`}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <span className="text-lg">{badge.icon}</span>
                  <span className="text-sm font-bold text-slate-700">
                    {badge.name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 p-7 text-white shadow-sm md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">
                BuildUp Talent Network
              </p>
              <h3 className="mt-2 text-2xl font-black tracking-tight">
                Hire through proof, not promises.
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                BuildUp helps organizations discover contributors through
                verified delivery, real project evidence, reviews, and portfolio
                proof.
              </p>
            </div>

            <Link
              href="/register/organization"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-white px-5 text-sm font-black text-slate-950 transition hover:bg-slate-100"
            >
              Join BuildUp
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}

function ProfilePill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-black text-white">{value}</span>
    </div>
  );
}

function ProofMini({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-slate-500">{label}</span>
      <span
        className={`rounded-full px-2 py-0.5 text-[11px] font-black ${
          active
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {active ? "Yes" : "No"}
      </span>
    </div>
  );
}




function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}
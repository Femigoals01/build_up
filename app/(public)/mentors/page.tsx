



import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type MentorFilter = "all" | "certified" | "available" | "top-rated";

function parseSkills(skills?: string | null) {
  if (!skills) return [];

  return skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function getInitial(name?: string | null) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "M";
}

function getMentorLevelTitle(level: number) {
  if (level >= 5) return "Mentor Master";
  if (level >= 4) return "Elite Mentor";
  if (level >= 3) return "Experienced Guide";
  if (level >= 2) return "Rising Mentor";

  return "New Mentor";
}

function getRankBadge(index: number) {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";

  return `#${index + 1}`;
}

function getRankStyle(index: number) {
  if (index === 0) return "border-amber-200 shadow-amber-100/80";
  if (index === 1) return "border-slate-300 shadow-slate-200/80";
  if (index === 2) return "border-orange-200 shadow-orange-100/80";

  return "border-slate-200 shadow-slate-200/60";
}

function getLevelStyle(level: number) {
  if (level >= 5) return "border-emerald-100 bg-emerald-50 text-emerald-700";
  if (level >= 4) return "border-amber-100 bg-amber-50 text-amber-700";
  if (level >= 3) return "border-purple-100 bg-purple-50 text-purple-700";
  if (level >= 2) return "border-blue-100 bg-blue-50 text-blue-700";

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function getFilterLabel(filter: MentorFilter) {
  if (filter === "certified") return "Certified Mentors";
  if (filter === "available") return "Available Mentors";
  if (filter === "top-rated") return "Top Rated";

  return "All Mentors";
}

export default async function PublicMentorsPage({
  searchParams,
}: {
  searchParams?: Promise<{ filter?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const rawFilter = resolvedSearchParams.filter || "all";

  const activeFilter: MentorFilter = [
    "all",
    "certified",
    "available",
    "top-rated",
  ].includes(rawFilter)
    ? (rawFilter as MentorFilter)
    : "all";

  const mentors = await prisma.user.findMany({
    where: {
      role: "MENTOR",
      mentorStatus: "APPROVED",
      accountStatus: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      username: true,
      headline: true,
      bio: true,
      skills: true,
      experience: true,
      profileImageUrl: true,
      mentorRating: true,
      mentorRatingCount: true,
      mentorLevel: true,
      mentorshipPoints: true,
      badges: true,
      mentorCertifications: {
        where: {
          status: "APPROVED",
        },
        select: {
          id: true,
        },
        take: 1,
      },
      mentorReviewsReceived: {
        select: {
          guidance: true,
          communication: true,
          availability: true,
          professionalism: true,
        },
      },
      mentorAvailabilities: {
        where: {
          isActive: true,
        },
        select: {
          id: true,
        },
      },
      mentoredProjects: {
        where: {
          status: "COMPLETED",
        },
        select: {
          id: true,
        },
      },
    },
    orderBy: [
      {
        mentorshipPoints: "desc",
      },
      {
        mentorRating: "desc",
      },
      {
        mentorRatingCount: "desc",
      },
    ],
  });

  const totalMentors = mentors.length;

  const totalGuidedProjects = mentors.reduce(
    (sum, mentor) => sum + mentor.mentoredProjects.length,
    0
  );

  const totalReviews = mentors.reduce(
    (sum, mentor) => sum + mentor.mentorRatingCount,
    0
  );

  const certifiedCount = mentors.filter(
    (mentor) => mentor.mentorCertifications.length > 0
  ).length;

  const availableCount = mentors.filter(
    (mentor) => mentor.mentorAvailabilities.length > 0
  ).length;

  const topRatedCount = mentors.filter(
    (mentor) => mentor.mentorRating >= 4.5 && mentor.mentorRatingCount > 0
  ).length;

  const filteredMentors = mentors.filter((mentor) => {
    if (activeFilter === "certified") {
      return mentor.mentorCertifications.length > 0;
    }

    if (activeFilter === "available") {
      return mentor.mentorAvailabilities.length > 0;
    }

    if (activeFilter === "top-rated") {
      return mentor.mentorRating >= 4.5 && mentor.mentorRatingCount > 0;
    }

    return true;
  });

  const filters: {
    label: string;
    href: string;
    value: MentorFilter;
    count: number;
  }[] = [
    {
      label: "All Mentors",
      href: "/mentors",
      value: "all",
      count: totalMentors,
    },
    {
      label: "Certified Mentors",
      href: "/mentors?filter=certified",
      value: "certified",
      count: certifiedCount,
    },
    {
      label: "Available Mentors",
      href: "/mentors?filter=available",
      value: "available",
      count: availableCount,
    },
    {
      label: "Top Rated",
      href: "/mentors?filter=top-rated",
      value: "top-rated",
      count: topRatedCount,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 px-4 pb-32 pt-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_30%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-slate-50" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur">
              🧑‍🏫 BuildUp Mentor Network
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight md:text-6xl">
              Mentor Directory
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-blue-100">
              Discover approved BuildUp mentors with verified mentorship impact,
              skills, reputation signals, certification status, and project
              guidance history.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Approved Mentors" value={String(totalMentors)} />
          <StatCard
            label="Projects Guided"
            value={String(totalGuidedProjects)}
          />
          <StatCard label="Mentor Reviews" value={String(totalReviews)} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
              Public Mentor Rankings
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              {getFilterLabel(activeFilter)}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Ranked by mentorship points, mentor rating, certification, and
              verified projects guided to completion.
            </p>
          </div>

          <Link
            href="/register/mentor"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Become a Mentor
          </Link>
        </div>

        <div className="mb-8 flex flex-wrap gap-2 rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm">
          {filters.map((filter) => {
            const active = activeFilter === filter.value;

            return (
              <Link
                key={filter.value}
                href={filter.href}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-black transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <span>{filter.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-white text-slate-500"
                  }`}
                >
                  {filter.count}
                </span>
              </Link>
            );
          })}
        </div>

        {filteredMentors.length === 0 ? (
          <section className="rounded-[32px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
                🧑‍🏫
              </div>

              <h3 className="text-xl font-black text-slate-950">
                No mentors found
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                No mentors match this filter yet.
              </p>
            </div>
          </section>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredMentors.map((mentor, index) => {
              const skills = parseSkills(mentor.skills);
              const topBadges = mentor.badges.slice(0, 3);
              const projectsGuided = mentor.mentoredProjects.length;
              const reviewCount = mentor.mentorReviewsReceived.length;
              const hasAvailability = mentor.mentorAvailabilities.length > 0;
              const isCertified = mentor.mentorCertifications.length > 0;

              const guidanceAverage =
                reviewCount > 0
                  ? (
                      mentor.mentorReviewsReceived.reduce(
                        (sum, review) => sum + review.guidance,
                        0
                      ) / reviewCount
                    ).toFixed(1)
                  : "0.0";

              const communicationAverage =
                reviewCount > 0
                  ? (
                      mentor.mentorReviewsReceived.reduce(
                        (sum, review) => sum + review.communication,
                        0
                      ) / reviewCount
                    ).toFixed(1)
                  : "0.0";

              const availabilityAverage =
                reviewCount > 0
                  ? (
                      mentor.mentorReviewsReceived.reduce(
                        (sum, review) => sum + review.availability,
                        0
                      ) / reviewCount
                    ).toFixed(1)
                  : "0.0";

              const professionalismAverage =
                reviewCount > 0
                  ? (
                      mentor.mentorReviewsReceived.reduce(
                        (sum, review) => sum + review.professionalism,
                        0
                      ) / reviewCount
                    ).toFixed(1)
                  : "0.0";

              return (
                <article
                  key={mentor.id}
                  className={`group overflow-hidden rounded-[30px] border bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl ${getRankStyle(
                    index
                  )}`}
                >
                  <div
                    className={`h-2 ${
                      isCertified
                        ? "bg-gradient-to-r from-emerald-500 via-blue-600 to-indigo-600"
                        : "bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500"
                    }`}
                  />

                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-slate-950 text-white">
                        <span className="text-lg font-black">
                          {getRankBadge(index)}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-300">
                          Rank
                        </span>
                      </div>

                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
                        {mentor.profileImageUrl ? (
                          <Image
                            src={mentor.profileImageUrl}
                            alt={mentor.name || "Mentor"}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-xl font-black text-white">
                            {getInitial(mentor.name)}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-xl font-black text-slate-950">
                          {mentor.name}
                        </h3>

                        {mentor.username ? (
                          <p className="mt-1 text-sm font-semibold text-blue-600">
                            @{mentor.username}
                          </p>
                        ) : null}

                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                          {getMentorLevelTitle(mentor.mentorLevel)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {isCertified && (
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                          🎓 BuildUp Certified Mentor
                        </span>
                      )}

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${getLevelStyle(
                          mentor.mentorLevel
                        )}`}
                      >
                        Level {mentor.mentorLevel}
                      </span>

                      <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        {projectsGuided} projects guided
                      </span>

                      <span className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                        {mentor.mentorRatingCount > 0
                          ? `⭐ ${Number(mentor.mentorRating || 0).toFixed(
                              1
                            )} (${mentor.mentorRatingCount} review${
                              mentor.mentorRatingCount === 1 ? "" : "s"
                            })`
                          : "⭐ No reviews yet"}
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${
                          hasAvailability
                            ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-50 text-slate-500"
                        }`}
                      >
                        {hasAvailability
                          ? "🟢 Available for booking"
                          : "⚪ No office hours yet"}
                      </span>
                    </div>

                    {mentor.headline ? (
                      <p className="mt-5 text-sm font-semibold text-slate-800">
                        {mentor.headline}
                      </p>
                    ) : null}

                    <p className="mt-3 line-clamp-3 min-h-[72px] text-sm leading-6 text-slate-600">
                      {mentor.bio ||
                        "Approved BuildUp mentor available to guide volunteers through real-world project execution."}
                    </p>

                    <div className="mt-5 grid grid-cols-3 gap-3">
                      <MiniStat
                        label="Points"
                        value={String(mentor.mentorshipPoints)}
                      />

                      <MiniStat
                        label="Reviews"
                        value={String(mentor.mentorRatingCount)}
                      />

                      <MiniStat
                        label="Years"
                        value={mentor.experience || "N/A"}
                      />
                    </div>

                    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                        Mentor Performance
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-xl bg-white p-2 font-semibold text-slate-700">
                          🎯 {guidanceAverage} Guidance
                        </div>

                        <div className="rounded-xl bg-white p-2 font-semibold text-slate-700">
                          📢 {communicationAverage} Communication
                        </div>

                        <div className="rounded-xl bg-white p-2 font-semibold text-slate-700">
                          🟢 {availabilityAverage} Availability
                        </div>

                        <div className="rounded-xl bg-white p-2 font-semibold text-slate-700">
                          💼 {professionalismAverage} Professionalism
                        </div>
                      </div>
                    </div>

                    {skills.length > 0 ? (
                      <div className="mt-5">
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                          Skills
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {skills.slice(0, 6).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                            >
                              {skill}
                            </span>
                          ))}

                          {skills.length > 6 ? (
                            <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                              +{skills.length - 6} more
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ) : null}

                    {topBadges.length > 0 ? (
                      <div className="mt-5">
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                          Badges
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {topBadges.map((badge) => (
                            <span
                              key={badge.id}
                              title={`${badge.name} — ${badge.description}`}
                              className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700"
                            >
                              {badge.icon} {badge.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-6 grid gap-3">
                      {mentor.username ? (
                        <Link
                          href={`/mentor/${mentor.username}`}
                          className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
                        >
                          View Mentor Profile
                        </Link>
                      ) : null}

                      <Link
                        href={`/dashboard/volunteer/mentors/${mentor.id}/book`}
                        className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-bold text-white transition hover:bg-emerald-700"
                      >
                        Book Session
                      </Link>

                      <Link
                        href="/dashboard/volunteer/mentors"
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                      >
                        Request Mentorship
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-4xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}
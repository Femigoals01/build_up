

import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import ApplyCertificationButton from "@/components/mentorship/ApplyCertificationButton";

export const dynamic = "force-dynamic";

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export default async function MentorCertificationPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "MENTOR") {
    redirect("/login");
  }

  const [mentor, bookings, reviews] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        mentorRating: true,
        mentorRatingCount: true,
        mentorLevel: true,
        mentorshipPoints: true,
      },
    }),

    prisma.mentorBooking.findMany({
      where: {
        mentorId: session.user.id,
      },
      select: {
        id: true,
        status: true,
      },
    }),

    prisma.mentorReview.findMany({
      where: {
        mentorId: session.user.id,
      },
      select: {
        id: true,
        rating: true,
        professionalism: true,
      },
    }),
  ]);

  if (!mentor) {
    redirect("/login");
  }

  const totalBookings = bookings.length;

  const completedSessions = bookings.filter(
    (booking) => booking.status === "COMPLETED"
  ).length;

  const completionRate =
    totalBookings > 0 ? (completedSessions / totalBookings) * 100 : 0;

  const averageRating = mentor.mentorRating || average(reviews.map((r) => r.rating));

  const professionalismAverage = average(
    reviews.map((review) => review.professionalism)
  );

  const checklist = [
    {
      label: "Complete at least 10 mentorship sessions",
      value: `${completedSessions}/10 completed`,
      passed: completedSessions >= 10,
    },
    {
      label: "Receive at least 5 verified mentor reviews",
      value: `${mentor.mentorRatingCount}/5 reviews`,
      passed: mentor.mentorRatingCount >= 5,
    },
    {
      label: "Maintain a 4.5+ average mentor rating",
      value: `${averageRating.toFixed(1)}/5 rating`,
      passed: averageRating >= 4.5,
    },
    {
      label: "Reach Mentor Level 2 or higher",
      value: `Level ${mentor.mentorLevel}`,
      passed: mentor.mentorLevel >= 2,
    },
    {
      label: "Maintain at least 80% session completion rate",
      value: formatPercent(completionRate),
      passed: completionRate >= 80,
    },
    {
      label: "Maintain 4.5+ professionalism score",
      value: `${professionalismAverage.toFixed(1)}/5 professionalism`,
      passed: professionalismAverage >= 4.5,
    },
  ];

  const passedCount = checklist.filter((item) => item.passed).length;
  const progress = Math.round((passedCount / checklist.length) * 100);
  const isEligible = passedCount === checklist.length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 px-6 py-10 text-white sm:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
              Mentor Certification
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Become a BuildUp Certified Mentor
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
              Certification is awarded to mentors who consistently complete
              sessions, receive strong reviews, and demonstrate professional
              mentorship standards.
            </p>
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
            <StatCard
              label="Completed Sessions"
              value={String(completedSessions)}
              helper="Target: 10"
              icon="✅"
            />

            <StatCard
              label="Reviews"
              value={String(mentor.mentorRatingCount)}
              helper="Target: 5"
              icon="💬"
            />

            <StatCard
              label="Average Rating"
              value={averageRating.toFixed(1)}
              helper="Target: 4.5+"
              icon="⭐"
            />

            <StatCard
              label="Eligibility"
              value={`${progress}%`}
              helper={`${passedCount}/${checklist.length} requirements met`}
              icon="🎓"
            />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                Eligibility Checklist
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-900">
                Certification Requirements
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Complete all requirements below to qualify for BuildUp Mentor
                Certification.
              </p>
            </div>

            <div className="space-y-4">
              {checklist.map((item) => (
                <div
                  key={item.label}
                  className={`rounded-3xl border p-5 ${
                    item.passed
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-lg font-black ${
                        item.passed
                          ? "bg-emerald-600 text-white"
                          : "bg-white text-slate-400"
                      }`}
                    >
                      {item.passed ? "✓" : "•"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`font-black ${
                          item.passed ? "text-emerald-900" : "text-slate-900"
                        }`}
                      >
                        {item.label}
                      </p>

                      <p
                        className={`mt-1 text-sm font-semibold ${
                          item.passed ? "text-emerald-700" : "text-slate-500"
                        }`}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                Certification Progress
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-900">
                {progress}% Complete
              </h2>

              <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                {isEligible
                  ? "You are eligible to apply for BuildUp Mentor Certification."
                  : "Keep completing sessions and collecting reviews to unlock certification eligibility."}
              </p>

              {/* <button
                type="button"
                disabled={!isEligible}
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isEligible ? "Apply for Certification" : "Not Eligible Yet"}
              </button> */}

              <ApplyCertificationButton eligible={isEligible} />
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Certification Benefits
              </p>

              <div className="mt-5 space-y-3">
                {[
                  "Certified mentor badge",
                  "Higher trust on mentor profile",
                  "Priority visibility in rankings",
                  "Stronger booking credibility",
                  "Eligibility for future mentor rewards",
                ].map((benefit) => (
                  <div
                    key={benefit}
                    className="flex gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700"
                  >
                    <span className="text-emerald-600">✓</span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/dashboard/mentor/analytics"
              className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              Back to Analytics
            </Link>
          </aside>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  helper,
  icon,
}: {
  label: string;
  value: string;
  helper: string;
  icon: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>

          <p className="mt-1 text-sm font-semibold text-slate-500">{helper}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
}
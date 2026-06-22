

import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import PlatformReviewActions from "./PlatformReviewActions";

export const dynamic = "force-dynamic";

function Stars({ value }: { value: number }) {
  return (
    <div className="flex text-2xl text-amber-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index}>{index < value ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export default async function PlatformReviewDetailPage({
  params,
}: {
  params: Promise<{ reviewId: string }>;
}) {
  const { reviewId } = await params;

  const review = await prisma.platformReview.findUnique({
    where: {
      id: reviewId,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!review) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/dashboard/admin/platform-reviews"
        className="inline-flex rounded-2xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-200"
      >
        ← Back to Reviews
      </Link>

      <section className="overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 px-6 py-8 text-white">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-100">
            Platform Review
          </p>

          <h1 className="mt-3 text-3xl font-black">
            Review from {review.user.name}
          </h1>

          <p className="mt-2 text-sm text-blue-100">
            {review.user.email} · {review.user.role}
          </p>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <RatingCard label="Ease of Use" value={review.easeOfUse} />
            <RatingCard label="Opportunities" value={review.opportunities} />
            <RatingCard
              label="Community Experience"
              value={review.communityExperience}
            />
            <RatingCard label="Overall Rating" value={review.overallRating} />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Feedback
            </p>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
              {review.review || "No written feedback provided."}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
              Current Status
            </p>

            <span
              className={`mt-3 inline-flex rounded-full px-4 py-2 text-xs font-black ${
                review.status === "APPROVED"
                  ? "bg-emerald-100 text-emerald-700"
                  : review.status === "REJECTED"
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {review.status}
            </span>
          </div>

          <PlatformReviewActions reviewId={review.id} />
        </div>
      </section>
    </main>
  );
}

function RatingCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-black text-slate-900">{label}</p>

      <div className="mt-3">
        <Stars value={value} />
      </div>

      <p className="mt-2 text-xs font-bold text-slate-500">{value}/5</p>
    </div>
  );
}
"use client";

import { useState } from "react";
import StarRating from "@/components/StarRating";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  organization: string;
};

export default function VolunteerReviews({
  reviews,
  initialCount = 3,
}: {
  reviews: Review[];
  initialCount?: number;
}) {
  const [showAll, setShowAll] = useState(false);

  const visibleReviews = showAll
    ? reviews
    : reviews.slice(0, initialCount);

  return (
    <div className="space-y-6">
      {/* Review list */}
      {visibleReviews.map((review) => (
        <div key={review.id} className="space-y-2">
          <div className="flex items-center gap-3">
            <StarRating rating={review.rating} />
            <span className="text-sm text-gray-600">
              {review.rating} / 5
            </span>
          </div>

          {review.comment && (
            <p className="text-gray-700 leading-relaxed">
              “{review.comment}”
            </p>
          )}

          <p className="text-xs text-gray-400">
            — {review.organization}
          </p>

          {/* subtle divider */}
          <div className="pt-4 border-b border-gray-100" />
        </div>
      ))}

      {/* View all button */}
      {reviews.length > initialCount && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View all reviews →
        </button>
      )}
    </div>
  );
}

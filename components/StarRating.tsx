type StarRatingProps = {
  rating: number; // e.g. 4.3
  size?: number;
};

export default function StarRating({
  rating,
  size = 20,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} filled size={size} />
      ))}

      {/* Half star */}
      {hasHalfStar && <Star half size={size} />}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} size={size} />
      ))}
    </div>
  );
}

function Star({
  filled,
  half,
  size,
}: {
  filled?: boolean;
  half?: boolean;
  size: number;
}) {
  if (half) {
    return (
      <span
        style={{ fontSize: size }}
        className="text-yellow-400"
      >
        ⯨
      </span>
    );
  }

  return (
    <span
      style={{ fontSize: size }}
      className={filled ? "text-yellow-400" : "text-gray-300"}
    >
      ★
    </span>
  );
}

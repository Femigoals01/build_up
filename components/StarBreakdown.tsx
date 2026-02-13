type Props = {
  breakdown: Record<number, number>;
  total: number;
};

export default function StarBreakdown({ breakdown, total }: Props) {
  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = breakdown[star] || 0;
        const percentage = total
          ? Math.round((count / total) * 100)
          : 0;

        return (
          <div key={star} className="flex items-center gap-3 text-sm">
            {/* Stars */}
            <span className="w-14 text-yellow-500 font-medium">
              {"★".repeat(star)}
              {"☆".repeat(5 - star)}
            </span>

            {/* Bar */}
            <div className="flex-1 h-3 bg-gray-200 rounded">
              <div
                className="h-3 bg-yellow-400 rounded"
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Count */}
            <span className="w-6 text-gray-600 text-right">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}


"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type RatingPoint = {
  date: string;
  rating: number;
};

export default function RatingTrendChart({
  data,
}: {
  data: RatingPoint[];
}) {
  if (data.length === 0) {
    return (
      <p className="text-gray-600 text-sm">
        No rating data yet.
      </p>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis domain={[1, 5]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="rating"
            stroke="#facc15"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

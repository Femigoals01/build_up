

"use client";

import { useEffect, useState } from "react";

export default function AnimatedStat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;

    const duration = 1500;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="group rounded-2xl border border-slate-200/70 bg-white px-5 py-6 text-center shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <h3 className="text-3xl font-extrabold text-slate-900">
        {count.toLocaleString()}+
      </h3>

      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
    </div>
  );
}
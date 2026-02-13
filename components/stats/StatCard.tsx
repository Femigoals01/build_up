

import clsx from "clsx";

export default function StatCard({
  title,
  value,
  icon,
  gradient,
  subtitle,
}: {
  title: string;
  value: number | string;
  icon: string;
  gradient: string;
  subtitle?: string;
}) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition",
        "hover:-translate-y-1 hover:shadow-lg"
      )}
    >
      {/* Gradient accent */}
      <div
        className={`absolute inset-x-0 top-0 h-1 ${gradient}`}
      />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </p>

          {subtitle && (
            <p className="mt-1 text-xs text-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={clsx(
            "flex h-12 w-12 items-center justify-center rounded-xl text-xl",
            gradient,
            "text-white"
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

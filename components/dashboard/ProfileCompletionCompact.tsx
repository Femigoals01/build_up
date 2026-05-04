"use client";

import { useState } from "react";
import Link from "next/link";

type ChecklistItem = {
  label: string;
  done: boolean;
  href: string;
};

type Props = {
  score: number;
  levelName: string;
  levelIcon: string;
  profileCompletion: number;
  completedSteps: number;
  totalSteps: number;
  checklist: ChecklistItem[];
};

export default function ProfileCompletionCompact({
  score,
  levelName,
  levelIcon,
  profileCompletion,
  completedSteps,
  totalSteps,
  checklist,
}: Props) {
  const [open, setOpen] = useState(false);

  const missingItems = checklist.filter((item) => !item.done);

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
            {levelIcon}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Profile Strength
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {score}% • {levelName}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {completedSteps} of {totalSteps} profile steps completed.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:min-w-[280px]">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-600">Completion</span>
              <span className="font-semibold text-blue-600">
                {profileCompletion}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              {open ? "Hide Profile Status" : "Complete Profile"}
            </button>

            <Link
              href="/dashboard/settings"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {open && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          {missingItems.length === 0 ? (
            <p className="text-sm font-semibold text-emerald-700">
              ✅ Your profile is complete.
            </p>
          ) : (
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Things left to complete
              </p>

              <div className="mt-3 grid gap-3">
                {missingItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span>⭕</span>
                      <span className="text-sm font-medium text-slate-700">
                        {item.label}
                      </span>
                    </div>

                    <Link
                      href={item.href}
                      className="text-sm font-semibold text-blue-600 hover:underline"
                    >
                      Complete →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
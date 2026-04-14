

"use client";

import { useState } from "react";

type EligibleProject = {
  id: string;
  projectId: string;
  project: {
    title: string;
  };
};

export default function EligibleProjectsList({
  projects,
  addToPortfolio,
}: {
  projects: EligibleProject[];
  addToPortfolio: (formData: FormData) => Promise<void>;
}) {
  const [showAll, setShowAll] = useState(false);

  const visibleProjects = showAll ? projects : projects.slice(0, 2);
  const hiddenCount = Math.max(projects.length - 2, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-2">
        {visibleProjects.map((app) => (
          <div
            key={app.id}
            className="group rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#f8fafc)] p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_40px_rgba(37,99,235,0.08)]"
          >
            <div className="flex h-full flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Completed Project
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {app.project.title}
                </h3>
                <p className="text-sm leading-6 text-slate-500">
                  Ready to be converted into a public-facing portfolio case study
                  on your profile.
                </p>
              </div>

              <form action={addToPortfolio}>
                <input type="hidden" name="projectId" value={app.projectId} />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Add to Portfolio
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {projects.length > 2 && !showAll && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
          >
            See all completed projects to add
            <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              +{hiddenCount}
            </span>
          </button>
        </div>
      )}

      {projects.length > 2 && showAll && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAll(false)}
            className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Show fewer projects
          </button>
        </div>
      )}
    </div>
  );
}
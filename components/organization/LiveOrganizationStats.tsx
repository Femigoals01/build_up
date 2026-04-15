
"use client";

import { useEffect, useState } from "react";
import { getPusherClient } from "@/lib/pusher-client";

type Summary = {
  projectsPosted: number;
  activeProjects: number;
  completedProjects: number;
  totalApplicants: number;
  pendingReviews: number;
  activeVolunteers: number;
  acceptedPlacements: number;
};

type Props = {
  userId: string;
  initialSummary: Summary;
};

function Stat({
  title,
  value,
  icon,
  tone,
}: {
  title: string;
  value: number;
  icon: string;
  tone: "blue" | "emerald" | "slate" | "amber";
}) {
  const toneStyles = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-slate-500">{title}</h3>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-lg ${toneStyles[tone]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function LiveOrganizationStats({
  userId,
  initialSummary,
}: Props) {
  const [summary, setSummary] = useState(initialSummary);

  useEffect(() => {
    setSummary(initialSummary);
  }, [initialSummary]);

  useEffect(() => {
    if (!userId) return;

    const refreshSummary = async () => {
      try {
        const res = await fetch("/api/organization/dashboard-summary", {
          cache: "no-store",
        });

        if (!res.ok) return;

        const data = await res.json();
        setSummary(data);
      } catch (error) {
        console.error("Failed to refresh organization summary:", error);
      }
    };

    const pusher = getPusherClient();
    const channelName = `private-user-notifications-${userId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("notification:new", refreshSummary);

    return () => {
      channel.unbind("notification:new", refreshSummary);
      pusher.unsubscribe(channelName);
    };
  }, [userId]);

  return (
    <>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Stat
          title="Projects Posted"
          value={summary.projectsPosted}
          icon="📁"
          tone="blue"
        />
        <Stat
          title="Active Projects"
          value={summary.activeProjects}
          icon="🚀"
          tone="emerald"
        />
        <Stat
          title="Completed Projects"
          value={summary.completedProjects}
          icon="✅"
          tone="slate"
        />
        <Stat
          title="Active Volunteers"
          value={summary.activeVolunteers}
          icon="👥"
          tone="amber"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">
            Total Applicants
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {summary.totalApplicants}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Across all your posted projects.
          </p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">
            Pending Reviews
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {summary.pendingReviews}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Applications waiting for your decision.
          </p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">
            Accepted Placements
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {summary.acceptedPlacements}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Volunteers currently engaged on your projects.
          </p>
        </div>
      </section>
    </>
  );
}
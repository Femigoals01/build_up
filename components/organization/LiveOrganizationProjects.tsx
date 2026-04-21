





"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ApplicantCard from "@/components/organization/ApplicantCard";
import CompleteProjectButton from "@/components/organization/CompleteProjectButton";
import { getPusherClient } from "@/lib/pusher-client";

type Volunteer = {
  id: string;
  name: string;
  email: string;
  username: string;
};

type Application = {
  id: string;
  status: string;
  source: string;
  createdAt: string | Date;
  volunteer: Volunteer;
};

type Project = {
  id: string;
  title: string;
  status: string;
  applications: Application[];
};

type Props = {
  userId: string;
  initialProjects: Project[];
};

function getStatusStyles(status: string) {
  switch (status) {
    case "OPEN":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "COMPLETED":
      return "bg-slate-100 text-slate-700 border-slate-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function getProjectCounts(project: Project) {
  const pendingVolunteerApps = project.applications.filter(
    (a) => a.status === "PENDING" && a.source === "VOLUNTEER"
  );

  const pendingInvites = project.applications.filter(
    (a) => a.status === "PENDING" && a.source === "ORGANIZATION"
  );

  const acceptedApps = project.applications.filter(
    (a) => a.status === "ACCEPTED"
  );

  return {
    pendingVolunteerApps,
    pendingInvites,
    acceptedApps,
    totalRecords: project.applications.length,
  };
}

function AnimatedMiniStat({
  label,
  value,
  animate,
}: {
  label: string;
  value: number;
  animate: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 transition-all duration-500 ${
        animate
          ? "scale-[1.03] shadow-lg ring-2 ring-blue-100 bg-blue-50/70"
          : "scale-100 shadow-none ring-0"
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p
        className={`mt-2 text-2xl font-bold text-slate-900 transition-transform duration-500 ${
          animate ? "scale-110" : "scale-100"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default function LiveOrganizationProjects({
  userId,
  initialProjects,
}: Props) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [animatedProjectIds, setAnimatedProjectIds] = useState<string[]>([]);
  const previousProjectsRef = useRef<Project[]>(initialProjects);

  useEffect(() => {
    setProjects(initialProjects);
    previousProjectsRef.current = initialProjects;
  }, [initialProjects]);

  const triggerProjectAnimations = (nextProjects: Project[]) => {
    const previousProjects = previousProjectsRef.current;

    const changedProjectIds = nextProjects
      .filter((nextProject) => {
        const prevProject = previousProjects.find((p) => p.id === nextProject.id);
        if (!prevProject) return false;

        const prevCounts = getProjectCounts(prevProject);
        const nextCounts = getProjectCounts(nextProject);

        return (
          prevCounts.pendingVolunteerApps.length !==
            nextCounts.pendingVolunteerApps.length ||
          prevCounts.pendingInvites.length !== nextCounts.pendingInvites.length ||
          prevCounts.acceptedApps.length !== nextCounts.acceptedApps.length ||
          prevCounts.totalRecords !== nextCounts.totalRecords
        );
      })
      .map((project) => project.id);

    if (changedProjectIds.length > 0) {
      setAnimatedProjectIds(changedProjectIds);

      window.setTimeout(() => {
        setAnimatedProjectIds([]);
      }, 900);
    }

    previousProjectsRef.current = nextProjects;
  };

  useEffect(() => {
    if (!userId) return;

    const refreshProjects = async () => {
      try {
        const res = await fetch("/api/organizations/project-live", {
          cache: "no-store",
        });

        if (!res.ok) return;

        const data = await res.json();
        const nextProjects: Project[] = data.projects || [];

        triggerProjectAnimations(nextProjects);
        setProjects(nextProjects);
      } catch (error) {
        console.error("Failed to refresh organization projects:", error);
      }
    };

    const pusher = getPusherClient();
    const channelName = `private-user-notifications-${userId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("notification:new", refreshProjects);

    return () => {
      channel.unbind("notification:new", refreshProjects);
      pusher.unsubscribe(channelName);
    };
  }, [userId]);

  const renderedProjects = useMemo(() => projects, [projects]);

  return (
    <section className="space-y-5">
      {renderedProjects.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto max-w-md">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
              📂
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              No projects posted yet
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Start by posting your first project so volunteers can discover it and apply.
            </p>
            <Link
              href="/projects/new"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Post Your First Project
            </Link>
          </div>
        </div>
      ) : (
        renderedProjects.map((project) => {
          const pendingVolunteerApps = project.applications.filter(
            (a) => a.status === "PENDING" && a.source === "VOLUNTEER"
          );

          const pendingInvites = project.applications.filter(
            (a) => a.status === "PENDING" && a.source === "ORGANIZATION"
          );

          const acceptedApps = project.applications.filter(
            (a) => a.status === "ACCEPTED"
          );

          const shouldAnimate = animatedProjectIds.includes(project.id);

          return (
            <section
              key={project.id}
              className={`overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 md:p-7 ${
                shouldAnimate ? "shadow-[0_18px_45px_rgba(59,130,246,0.12)]" : ""
              }`}
            >
              <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg text-white shadow-sm transition-transform duration-500 ${
                        shouldAnimate ? "scale-110" : "scale-100"
                      }`}
                    >
                      📁
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                        {project.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Manage applicants, invited volunteers, and accepted collaborators from here.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(
                        project.status
                      )}`}
                    >
                      {formatStatus(project.status)}
                    </span>

                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                      {project.applications.length} total record
                      {project.applications.length === 1 ? "" : "s"}
                    </span>

                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                      {acceptedApps.length} accepted volunteer
                      {acceptedApps.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>

                <div className="w-full lg:w-auto lg:min-w-[240px]">
                  <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      Project actions
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Complete this project when the work is done, or leave a review after completion.
                    </p>

                    <div className="mt-4">
                      {project.status !== "COMPLETED" ? (
                        <CompleteProjectButton projectId={project.id} />
                      ) : (
                        <Link
                          href={`/project/${project.id}/review`}
                          className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                          Leave Review
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-4">
                <AnimatedMiniStat
                  label="Pending Applications"
                  value={pendingVolunteerApps.length}
                  animate={shouldAnimate}
                />
                <AnimatedMiniStat
                  label="Pending Invites"
                  value={pendingInvites.length}
                  animate={shouldAnimate}
                />
                <AnimatedMiniStat
                  label="Accepted Volunteers"
                  value={acceptedApps.length}
                  animate={shouldAnimate}
                />
                <AnimatedMiniStat
                  label="Total Records"
                  value={project.applications.length}
                  animate={shouldAnimate}
                />
              </div>

              <div className="space-y-8 border-t border-slate-100 pt-6">
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Pending Applicants
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Volunteers who applied themselves and are waiting for your decision.
                    </p>
                  </div>

                  {pendingVolunteerApps.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                      <p className="text-sm font-medium text-slate-700">
                        No pending volunteer applications right now.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingVolunteerApps.map((app) => (
                        <ApplicantCard
                          key={app.id}
                          applicationId={app.id}
                          name={app.volunteer.name}
                          email={app.volunteer.email}
                          status={app.status}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Invitations Awaiting Response
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Volunteers you invited who have not responded yet.
                    </p>
                  </div>

                  {pendingInvites.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                      <p className="text-sm font-medium text-slate-700">
                        No outstanding invitations right now.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingInvites.map((app) => (
                        <div
                          key={app.id}
                          className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4"
                        >
                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                              <p className="text-base font-semibold text-slate-900">
                                {app.volunteer.name}
                              </p>
                              <p className="text-sm text-slate-500">
                                {app.volunteer.email}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                                Invited by organization
                              </span>
                              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                Waiting for response
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Accepted Volunteers
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Volunteers currently active on this project.
                    </p>
                  </div>

                  {acceptedApps.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                      <p className="text-sm font-medium text-slate-700">
                        No accepted volunteers yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {acceptedApps.map((app) => (
                        <div
                          key={app.id}
                          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4"
                        >
                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                              <p className="text-base font-semibold text-slate-900">
                                {app.volunteer.name}
                              </p>
                              <p className="text-sm text-slate-500">
                                {app.volunteer.email}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {app.source === "ORGANIZATION" && (
                                <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                                  Accepted invite
                                </span>
                              )}

                              <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
                                Active on project
                              </span>

                              <Link
                                href={`/portfolio/${app.volunteer.username}`}
                                className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                              >
                                View Profile
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })
      )}
    </section>
  );
}
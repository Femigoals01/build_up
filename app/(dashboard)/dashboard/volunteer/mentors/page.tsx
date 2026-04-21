



"use client";

import { useEffect, useMemo, useState } from "react";
import ProjectMentorRequestModal from "@/components/mentorship/ProjectMentorRequestModal";

/* ================= TYPES ================= */

type Mentor = {
  id: string;
  name: string;
  bio: string | null;
  skills: string | null;
  experience: string | null;
  rating: number;
  ratingCount: number;
};

type Project = {
  id: string;
  title: string;
};

/* ================= HELPERS ================= */

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function parseSkills(skills: string | null) {
  if (!skills) return [];
  return skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

/* ================= PAGE ================= */

export default function MentorSearchPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skill, setSkill] = useState("");

  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);

  const [loadingMentors, setLoadingMentors] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);

  /* ================= FETCH MENTORS ================= */

  async function fetchMentors() {
    setLoadingMentors(true);
    try {
      const res = await fetch(`/api/mentors/search?skill=${encodeURIComponent(skill)}`);
      const data = await res.json();
      setMentors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load mentors", error);
      setMentors([]);
    } finally {
      setLoadingMentors(false);
    }
  }

  /* ================= FETCH VOLUNTEER PROJECTS ================= */

  async function fetchProjects() {
    setLoadingProjects(true);
    try {
      const res = await fetch("/api/volunteer/projects");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load projects", error);
      setProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  }

  /* ================= INIT ================= */

  useEffect(() => {
    fetchMentors();
    fetchProjects();
  }, []);

  /* ================= MEMOS ================= */

  const hasProjects = useMemo(() => projects.length > 0, [projects.length]);

  /* ================= UI ================= */

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 md:px-8 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* HERO / HEADER */}
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="relative px-6 py-8 md:px-8 md:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.10),transparent_28%)]" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  BuildUp Mentorship
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  Find a Mentor
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 md:text-base">
                  Discover approved mentors, explore their strengths, and request
                  mentorship for the project you are actively building.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center sm:min-w-[120px]">
                  <p className="text-2xl font-bold text-slate-900">{mentors.length}</p>
                  <p className="text-xs font-medium text-slate-500">Mentors</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center sm:min-w-[120px]">
                  <p className="text-2xl font-bold text-slate-900">{projects.length}</p>
                  <p className="text-xs font-medium text-slate-500">Projects</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH + INFO BAR */}
        <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <input
                  placeholder="Search by skill (e.g. React, UI Design, Product Management)"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") fetchMentors();
                  }}
                />
              </div>

              <button
                onClick={fetchMentors}
                disabled={loadingMentors}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingMentors ? "Searching..." : "Search Mentors"}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                {hasProjects
                  ? "You can request mentorship"
                  : "No active project yet"}
              </div>

              {loadingProjects && (
                <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                  Loading projects...
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CONTENT STATES */}
        {loadingMentors ? (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="animate-pulse space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 rounded bg-slate-200" />
                      <div className="h-3 w-24 rounded bg-slate-100" />
                    </div>
                  </div>
                  <div className="h-4 w-full rounded bg-slate-100" />
                  <div className="h-4 w-5/6 rounded bg-slate-100" />
                  <div className="flex gap-2">
                    <div className="h-7 w-16 rounded-full bg-slate-100" />
                    <div className="h-7 w-20 rounded-full bg-slate-100" />
                    <div className="h-7 w-14 rounded-full bg-slate-100" />
                  </div>
                  <div className="h-11 w-full rounded-2xl bg-slate-200" />
                </div>
              </div>
            ))}
          </section>
        ) : mentors.length === 0 ? (
          <section className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
                🧑‍🏫
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                No mentors found
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Try a different skill keyword or broaden your search to discover
                more mentors.
              </p>
            </div>
          </section>
        ) : (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {mentors.map((mentor) => {
              const mentorSkills = parseSkills(mentor.skills);

              return (
                <article
                  key={mentor.id}
                  className="group relative overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 opacity-80" />

                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-sm">
                      {getInitials(mentor.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {mentor.name}
                          </h3>
                          <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                            Approved Mentor
                          </p>
                        </div>

                        <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                          ⭐ {mentor.rating.toFixed(1)} · {mentor.ratingCount} review
                          {mentor.ratingCount === 1 ? "" : "s"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <p className="min-h-[72px] text-sm leading-6 text-slate-600">
                      {mentor.bio?.trim()
                        ? mentor.bio
                        : "This mentor has not added a bio yet, but is available for mentorship requests."}
                    </p>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Experience
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {mentor.experience ?? "N/A"} years
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Availability
                        </p>
                        <p className="mt-1 text-sm font-semibold text-emerald-700">
                          Open to requests
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Skills
                      </p>

                      {mentorSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {mentorSkills.map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">No skills listed yet.</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <button
                      onClick={() => {
                        if (projects.length === 0) {
                          alert("You need an active project to request mentorship");
                          return;
                        }
                        setSelectedMentor(mentor.id);
                      }}
                      disabled={loadingProjects}
                      className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loadingProjects ? "Checking projects..." : "Request Mentorship"}
                    </button>

                    {!hasProjects && !loadingProjects && (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
                        You need an active project before you can send a mentorship
                        request.
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {/* REQUEST MODAL */}
        {selectedMentor && (
          <ProjectMentorRequestModal
            mentorId={selectedMentor}
            projects={projects}
            onClose={() => setSelectedMentor(null)}
          />
        )}
      </div>
    </main>
  );
}
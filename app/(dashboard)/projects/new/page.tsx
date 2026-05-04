


"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

function difficultyCardStyles(level: Difficulty, active: boolean) {
  if (!active) {
    return "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/40";
  }

  switch (level) {
    case "BEGINNER":
      return "border-emerald-300 bg-emerald-50 text-emerald-800 ring-4 ring-emerald-100";
    case "INTERMEDIATE":
      return "border-amber-300 bg-amber-50 text-amber-800 ring-4 ring-amber-100";
    case "ADVANCED":
      return "border-rose-300 bg-rose-50 text-rose-800 ring-4 ring-rose-100";
    default:
      return "border-blue-300 bg-blue-50 text-blue-800 ring-4 ring-blue-100";
  }
}

export default function CreateProjectPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("BEGINNER");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= ROLE GUARD ================= */
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (session.user.role !== "ORGANIZATION") {
      router.push("/dashboard/volunteer");
    }
  }, [session, status, router]);

  /* ================= DERIVED ================= */
  const parsedSkills = useMemo(
    () =>
      skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [skills]
  );

  /* ================= SUBMIT ================= */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          difficulty,
          skills: parsedSkills,
        }),
      });

      let data: any = null;
      const contentType = res.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to create project");
      }

      router.push("/dashboard/organization");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  if (status === "loading") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="animate-pulse space-y-5">
              <div className="h-5 w-40 rounded bg-slate-200" />
              <div className="h-10 w-64 rounded bg-slate-200" />
              <div className="h-24 w-full rounded-2xl bg-slate-100" />
              <div className="h-14 w-full rounded-2xl bg-slate-100" />
              <div className="h-36 w-full rounded-2xl bg-slate-100" />
              <div className="h-12 w-full rounded-2xl bg-slate-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 md:px-8 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* HERO */}
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="relative px-6 py-8 md:px-8 md:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_24%)]" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  BuildUp Project Creation
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  Post a New Project
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                  Create a clear, attractive project that helps volunteers
                  understand the opportunity, required skills, and level of
                  challenge.
                </p>
              </div>

              <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-4">
                <p className="text-sm font-semibold text-slate-900">
                  Quick tip
                </p>
                <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
                  Projects with clear titles, practical descriptions, and
                  specific skills usually attract better applicants.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FORM */}
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-8">
          <form onSubmit={submit} className="space-y-8">
            {/* BASIC DETAILS */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Project Details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Give volunteers a strong overview of what the project is about.
                </p>
              </div>

              <div className="grid gap-6">
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Project Title
                  </label>
                  <input
                    id="title"
                    placeholder="e.g. Build a landing page for a nonprofit organization"
                    className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Make the title specific and outcome-focused.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Project Description
                  </label>
                  <textarea
                    id="description"
                    placeholder="Describe the goal of the project, what needs to be done, expected deliverables, and how a volunteer will contribute."
                    className="min-h-[180px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    A strong description improves application quality.
                  </p>
                </div>
              </div>
            </div>

            {/* DIFFICULTY */}
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Difficulty Level
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Choose the level that best matches the complexity of this
                  project.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setDifficulty("BEGINNER")}
                  className={`rounded-[24px] border p-5 text-left transition ${difficultyCardStyles(
                    "BEGINNER",
                    difficulty === "BEGINNER"
                  )}`}
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-lg shadow-sm">
                    🌱
                  </div>
                  <h3 className="text-base font-semibold">Beginner</h3>
                  <p className="mt-2 text-sm leading-6 opacity-90">
                    Suitable for entry-level contributors with foundational
                    skills.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDifficulty("INTERMEDIATE")}
                  className={`rounded-[24px] border p-5 text-left transition ${difficultyCardStyles(
                    "INTERMEDIATE",
                    difficulty === "INTERMEDIATE"
                  )}`}
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-lg shadow-sm">
                    ⚡
                  </div>
                  <h3 className="text-base font-semibold">Intermediate</h3>
                  <p className="mt-2 text-sm leading-6 opacity-90">
                    Best for volunteers with some practical experience and
                    confidence.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDifficulty("ADVANCED")}
                  className={`rounded-[24px] border p-5 text-left transition ${difficultyCardStyles(
                    "ADVANCED",
                    difficulty === "ADVANCED"
                  )}`}
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-lg shadow-sm">
                    🚀
                  </div>
                  <h3 className="text-base font-semibold">Advanced</h3>
                  <p className="mt-2 text-sm leading-6 opacity-90">
                    For more complex projects requiring stronger technical or
                    strategic ability.
                  </p>
                </button>
              </div>
            </div>

            {/* SKILLS */}
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Required Skills
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add the skills volunteers should have. Separate each one with a
                  comma.
                </p>
              </div>

              <div>
                <label
                  htmlFor="skills"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Skills
                </label>
                <input
                  id="skills"
                  placeholder="e.g. React, UI Design, Project Management, Copywriting"
                  className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
                <p className="mt-2 text-xs text-slate-500">
                  Separate each skill with a comma for best results.
                </p>
              </div>

              {parsedSkills.length > 0 && (
                <div>
                  <p className="mb-3 text-sm font-semibold text-slate-800">
                    Skills Preview
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {parsedSkills.map((skillItem) => (
                      <span
                        key={skillItem}
                        className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                      >
                        {skillItem}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Your project will become visible to volunteers after publishing.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/organization")}
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Publishing..." : "Publish Project"}
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
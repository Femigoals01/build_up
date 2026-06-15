


"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type Mentor = {
  id: string;
  name: string;
  username: string | null;
  headline: string | null;
  bio: string | null;
  skills: string | null;
  experience: string | null;
  profileImageUrl: string | null;
  mentorRating: number;
  mentorRatingCount: number;
  mentorLevel: number;
  mentorshipPoints: number;
};

function parseSkills(skills: string | null) {
  if (!skills) return [];

  return skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function calculateMatchScore({
  mentor,
  skillNeeded,
  projectType,
  careerGoal,
}: {
  mentor: Mentor;
  skillNeeded: string;
  projectType: string;
  careerGoal: string;
}) {
  const mentorText = [
    mentor.name,
    mentor.headline,
    mentor.bio,
    mentor.skills,
    mentor.experience,
  ]
    .join(" ")
    .toLowerCase();

  const skill = skillNeeded.toLowerCase().trim();
  const type = projectType.toLowerCase().trim();
  const goal = careerGoal.toLowerCase().trim();

  let score = 0;

  if (skill && mentorText.includes(skill)) score += 40;
  if (type && mentorText.includes(type)) score += 20;
  if (goal && mentorText.includes(goal)) score += 15;

  score += Math.min(mentor.mentorRating * 5, 25);
  score += Math.min(mentor.mentorLevel * 4, 20);
  score += Math.min(mentor.mentorRatingCount * 2, 20);
  score += Math.min(mentor.mentorshipPoints / 100, 20);

  return Math.min(Math.round(score), 100);
}

export default function MentorMatchPage() {
  const [skillNeeded, setSkillNeeded] = useState("");
  const [projectType, setProjectType] = useState("");
  const [careerGoal, setCareerGoal] = useState("");
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  async function findMatches(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSearched(false);

    try {
    //   const res = await fetch("/api/mentors/search?skill=");

    const res = await fetch("/api/mentor-match", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    skillNeeded,
    projectType,
    careerGoal,
  }),
});
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load mentors.");
      }

    //   setMentors(Array.isArray(data) ? data : []);
    setMentors(Array.isArray(data.matches) ? data.matches : []);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const matchedMentors = useMemo(() => {
    return mentors
      .map((mentor) => ({
        mentor,
        score: calculateMatchScore({
          mentor,
          skillNeeded,
          projectType,
          careerGoal,
        }),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [mentors, skillNeeded, projectType, careerGoal]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 px-6 py-10 text-white sm:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
              AI Mentor Match
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Find the best mentor for your goal
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
              Tell BuildUp what you need, and we’ll recommend mentors based on
              skills, experience, rating, level, reviews, and mentorship points.
            </p>
          </div>

          <form onSubmit={findMatches} className="grid gap-5 p-6 sm:p-8">
            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Skill Needed
                </label>

                <input
                  value={skillNeeded}
                  onChange={(e) => setSkillNeeded(e.target.value)}
                  placeholder="React, UI Design, Marketing..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Project Type
                </label>

                <input
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  placeholder="SaaS, nonprofit, ecommerce..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Career Goal
                </label>

                <input
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  placeholder="Frontend developer, founder..."
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Finding matches..." : "Find Mentor Matches"}
              </button>
            </div>
          </form>
        </section>

        {searched && matchedMentors.length === 0 && (
          <section className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
              🤖
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-900">
              No strong matches found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try broader keywords like React, design, marketing, leadership, or
              product.
            </p>
          </section>
        )}

        {matchedMentors.length > 0 && (
          <section className="space-y-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                Recommended Matches
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-900">
                Top mentor matches for you
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {matchedMentors.map(({ mentor, score }, index) => {
                const skills = parseSkills(mentor.skills);

                return (
                  <article
                    key={mentor.id}
                    className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500" />

                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-black text-white">
                          #{index + 1}
                        </div>

                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
                          {mentor.profileImageUrl ? (
                            <Image
                              src={mentor.profileImageUrl}
                              alt={mentor.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-blue-600 text-lg font-black text-white">
                              {getInitials(mentor.name)}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-lg font-black text-slate-900">
                            {mentor.name}
                          </h3>

                          <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                            {score}% Match
                          </p>
                        </div>
                      </div>

                      {mentor.headline && (
                        <p className="mt-5 text-sm font-semibold text-slate-800">
                          {mentor.headline}
                        </p>
                      )}

                      <div className="mt-5 grid grid-cols-3 gap-3">
                        <MiniStat
                          label="Rating"
                          value={Number(mentor.mentorRating || 0).toFixed(1)}
                        />
                        <MiniStat
                          label="Level"
                          value={String(mentor.mentorLevel)}
                        />
                        <MiniStat
                          label="Points"
                          value={String(mentor.mentorshipPoints)}
                        />
                      </div>

                      {skills.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {skills.slice(0, 6).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-6 grid gap-3">
                        <Link
                          href={`/dashboard/volunteer/mentors/${mentor.id}`}
                          className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700"
                        >
                          View Mentor
                        </Link>

                        <Link
                          href={`/dashboard/volunteer/mentors/${mentor.id}/book`}
                          className="inline-flex h-11 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 px-5 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
                        >
                          Book Session
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}
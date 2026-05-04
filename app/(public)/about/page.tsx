

import type { Metadata } from "next";
import Link from "next/link";
import BuildUpLogo from "@/components/brand/BuildUpLogo";

export const metadata: Metadata = {
  title: "About BuildUp | Real Experience, Real Projects, Real Growth",
  description:
    "Learn how BuildUp connects volunteers, organizations, and mentors through real projects, portfolio proof, and mentor-backed growth.",
};

const audiences = [
  {
    icon: "🙋",
    title: "For Volunteers",
    text: "Build real experience by contributing to live projects, earning reviews, badges, and portfolio-ready proof of work.",
  },
  {
    icon: "🏢",
    title: "For Organizations",
    text: "Post real projects, discover motivated talent, and get meaningful support while helping people grow.",
  },
  {
    icon: "🧑‍🏫",
    title: "For Mentors",
    text: "Guide emerging talent, review progress, and help volunteers build practical confidence through real work.",
  },
];

const values = [
  "Real experience over empty certificates",
  "Proof of work that can be shown publicly",
  "Mentor-backed growth and accountability",
  "Practical contribution that creates impact",
];

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-white text-slate-900">
      {/* HERO */}
      <section className="relative isolate bg-[#f5f7fb] px-6 py-20 lg:px-8 lg:py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.18),transparent_35%)]" />
        <div className="absolute left-[-10rem] top-20 -z-10 h-80 w-80 rounded-full bg-blue-100 blur-3xl" />

        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8 flex justify-center">
            <BuildUpLogo href="/" showTagline={false} />
          </div>

          <span className="inline-flex rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-700 shadow-sm">
            About BuildUp
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            We are turning learning into{" "}
            <span className="text-blue-600">real-world experience.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            BuildUp connects volunteers, organizations, and mentors in one
            practical ecosystem where people build skills through real projects,
            real guidance, and real proof of work.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/register/volunteer"
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-blue-600 px-7 text-base font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            >
              Join as Volunteer
            </Link>

            <Link
              href="/register/organization"
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-slate-300 bg-white px-7 text-base font-semibold text-slate-800 transition hover:bg-blue-50"
            >
              Post a Project
            </Link>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
              Why BuildUp exists
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Many people learn skills, but struggle to prove experience.
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
              BuildUp was created to close that gap. Instead of leaving people
              with only courses or certificates, we help them work on real
              projects, receive mentor guidance, and build visible evidence of
              what they can do.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-blue-50 to-indigo-50 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-400">
              Our belief
            </p>

            <blockquote className="mt-4 text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">
              “Experience should not be impossible to get just because you have
              not yet been given a chance.”
            </blockquote>

            <p className="mt-5 text-base leading-7 text-slate-600">
              BuildUp gives people that chance through structured contribution,
              mentorship, and practical outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* AUDIENCE CARDS */}
      <section className="bg-slate-50 px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
              Who BuildUp serves
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              One platform. Three important roles.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {audiences.map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                  {item.icon}
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-base leading-7 text-slate-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.22em] text-blue-600">
              What makes us different
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              BuildUp is built around proof, not promises.
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
              The goal is simple: help people show what they can actually do.
              Completed projects, reviews, badges, and portfolios become the
              evidence that supports their next opportunity.
            </p>
          </div>

          <div className="grid gap-4">
            {values.map((value) => (
              <div
                key={value}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  ✓
                </span>
                <p className="text-base font-semibold text-slate-800">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-blue-600 px-6 py-20 text-white lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to build real experience?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Join BuildUp and become part of a practical ecosystem where learning
            becomes contribution, and contribution becomes proof.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
            <Link
              href="/register/volunteer"
              className="inline-flex h-14 items-center justify-center rounded-2xl bg-white px-7 text-base font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Join as Volunteer
            </Link>

            <Link
              href="/register/organization"
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/70 px-7 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Post a Project
            </Link>

            <Link
              href="/register/mentor"
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/70 px-7 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Become a Mentor
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
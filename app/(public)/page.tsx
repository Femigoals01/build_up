





import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BuildUpLogo from "@/components/brand/BuildUpLogo";
import SponsoredOpportunitySlider from "@/components/home/SponsoredOpportunitySlider";
import AnimatedStat from "@/components/home/AnimatedStat";

export const revalidate = 300;

export const metadata: Metadata = {
  title:
    "BuildUp | Real-World Experience Platform for Volunteers, Mentors, and Organizations",
  description:
    "BuildUp helps volunteers gain real-world experience through live projects, mentor guidance, and portfolio-ready proof of work. Organizations post real projects, mentors guide delivery, and talent grows through practical experience.",
  keywords: [
    "BuildUp",
    "real-world experience",
    "live projects",
    "volunteer platform",
    "mentorship platform",
    "project-based learning",
    "portfolio building",
    "experience platform",
    "organizations",
    "mentors",
    "volunteers",
    "internship platform",
    "real work experience",
    "skill development",
    "career growth",
    "professional development",
    "volunteer projects",
    "real experience",
  ],
  alternates: {
    canonical: "https://www.buildup.com",
  },
  openGraph: {
    title:
      "BuildUp | Real-World Experience Platform for Volunteers, Mentors, and Organizations",
    description:
      "Gain real-world experience through live projects, mentor guidance, and portfolio-ready proof of work.",
    url: "https://www.buildup.com",
    siteName: "BuildUp",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "BuildUp | Real-World Experience Platform for Volunteers, Mentors, and Organizations",
    description:
      "Gain real-world experience through live projects, mentor guidance, and portfolio-ready proof of work.",
  },
};

function formatNairaFromKobo(amount?: number | null) {
  if (!amount) return "₦0";

  return `₦${(amount / 100).toLocaleString("en-NG", {
    maximumFractionDigits: 0,
  })}`;
}

function formatOpportunityType(type: string) {
  return type
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getOpportunityIcon(type: string) {
  if (type === "JOB") return "💼";
  if (type === "PROMOTION") return "📢";
  if (type === "EVENT") return "🎟️";
  if (type === "COURSE") return "🎓";
  return "🛠️";
}

function isSponsoredActive(
  featured: boolean,
  featuredUntil?: Date | string | null
) {
  if (!featured || !featuredUntil) return false;
  return new Date(featuredUntil).getTime() > Date.now();
}

export default async function HomePage() {
  const projects = await prisma.project.findMany({
    where: {
      status: "OPEN",
      applications: {
        none: {
          status: {
            in: ["ACCEPTED", "COMPLETED"],
          },
        },
      },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      difficulty: true,
      skills: true,
      stipendAmount: true,
      deliveryDays: true,
      organization: {
        select: { name: true },
      },
    },
  });

  const opportunitiesRaw = await prisma.opportunity.findMany({
    where: {
      status: "PUBLISHED",
    },
    include: {
      organization: {
        select: {
          name: true,
          organizationVerified: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  const opportunities = opportunitiesRaw.map((item) => ({
    ...item,
    sponsoredActive: isSponsoredActive(item.featured, item.featuredUntil),
  }));

  const promotedJobs = opportunities.filter(
    (item) => item.type === "JOB" && item.sponsoredActive
  );

  const freeJobs = opportunities
    .filter((item) => item.type === "JOB" && !item.sponsoredActive)
    .sort(() => Math.random() - 0.5);

  const latestJobs = [...promotedJobs, ...freeJobs].slice(0, 8);

  const sponsoredOpportunities = opportunities
    .filter(
      (item) =>
        item.sponsoredActive &&
        ["PROJECT", "PROMOTION", "EVENT", "COURSE"].includes(item.type)
    )
    .slice(0, 8)
    .map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      type: item.type,
      workMode: item.workMode,
      location: item.location,
      compensation: item.compensation,
      imageUrl: item.imageUrl,
      organization: {
        name: item.organization.name,
        organizationVerified: item.organization.organizationVerified,
      },
    }));

  const featuredStats = [
    { value: 50, label: "Volunteers" },
    { value: 70, label: "Projects" },
    { value: 20, label: "Organizations" },
    { value: 5, label: "Mentors" },
  ];

  const workflowSteps = [
    {
      step: "01",
      icon: "🏢",
      title: "Organization posts a project",
      text: "An organization publishes real work with clear requirements, timeline, and stipend where applicable.",
    },
    {
      step: "02",
      icon: "🙋",
      title: "Volunteer applies and contributes",
      text: "A volunteer works on a live project, gains confidence, and builds practical experience.",
    },
    {
      step: "03",
      icon: "🧑‍🏫",
      title: "Mentor guides quality",
      text: "A mentor supports delivery with feedback, structure, and real-world expectations.",
    },
    {
      step: "04",
      icon: "🏆",
      title: "Proof of work is unlocked",
      text: "Completed work becomes portfolio evidence with reviews, badges, and public credibility.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BuildUp",
    url: "https://www.buildup.com",
    description:
      "BuildUp helps volunteers gain real-world experience through live projects, mentor guidance, and portfolio-ready proof of work.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.buildup.com/projects?query={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="overflow-x-hidden bg-white text-slate-900">
        <section
          className="relative isolate overflow-hidden bg-[#f5f7fb]"
          aria-labelledby="hero-heading"
        >
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#f5f7fb_0%,#f5f7fb_56%,#d7e7ff_78%,#0b57dd_100%)]" />
          <div className="absolute right-[-12rem] top-[-8rem] -z-10 h-[36rem] w-[36rem] rounded-full bg-blue-300/30 blur-3xl" />
          <div className="absolute left-[-8rem] top-16 -z-10 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />

          <div className="mx-auto max-w-[1400px] px-4 py- sm:px-6 lg:px-0.5 ps-2 lg:ps-3">
            <div className="grid items-center gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-4">
              <div className="max-w-3xl text-center lg:text-left">
                <h1
                  id="hero-heading"
                  className="mt-1 text-[2rem] font-extrabold leading-[0.95] tracking-tight text-slate-950 sm:text-[2.8rem] md:text-[3.5rem] lg:mt- lg:text-[5.2rem]"
                >
                  Build real experience.
                  <br />
                  <span className="text-blue-600">Not just certificates.</span>
                </h1>

                <div className="mx-auto mt-4 h-2 w-40 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 sm:w-56 lg:mx-0 lg:w-72" />

                <div className="mx-auto mt-4 max-w-2xl border-l-4 border-blue-500 pl-4 text-left sm:pl-5 lg:mx-0">
                  <p className="text-base leading-7 text-slate-700 sm:text-lg sm:leading-8 lg:text-[1.15rem]">
                    Live projects, mentor guidance, and proof of work that
                    builds your future.
                  </p>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
                  <Link
                    href="/register/volunteer"
                    className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-blue-600 px-6 text-base font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 sm:w-auto sm:px-8"
                  >
                    Join as Volunteer
                  </Link>

                  <Link
                    href="/register/organization"
                    className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-blue-500 bg-white px-6 text-base font-semibold text-slate-800 transition hover:bg-blue-50 sm:w-auto sm:px-8"
                  >
                    Post a Project
                  </Link>

                  <Link
                    href="/register/mentor"
                    className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-violet-600 px-6 text-base font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 sm:w-auto sm:px-8"
                  >
                    Become a Mentor
                  </Link>
                </div>

                <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
                  <div className="flex -space-x-2">
                    {["A", "B", "C", "D", "E"].map((item, index) => (
                      <div
                        key={item}
                        className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-slate-200 to-slate-300 text-sm font-bold text-slate-700 shadow-sm"
                        style={{ zIndex: 10 - index }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 text-center sm:text-left">
                    <div className="flex text-xl leading-none text-amber-400">
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                    </div>
                    <p className="text-sm font-medium text-slate-700 sm:text-base">
                      Trusted by 50+ volunteers and organizations
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative order-first lg:order-none">
                <div className="relative -mx-4 sm:-mx-6 lg:mx-0">
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-200/30 via-indigo-200/20 to-cyan-100/10 blur-3xl lg:rounded-[2.25rem]" />

                  <div className="relative h-[260px] sm:h-[320px] md:h-[390px] lg:h-[550px]">
                    <Image
                      src="/hero-right.png"
                      alt="BuildUp hero visual showing volunteers, mentors, and organizations"
                      fill
                      priority
                      className="object-cover object-center lg:object-contain lg:object-right-bottom"
                      sizes="100vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="border-y border-slate-100 bg-slate-50/70 py-5"
          aria-labelledby="stats-heading"
        >
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <h2 id="stats-heading" className="sr-only">
              BuildUp platform statistics
            </h2>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
              {featuredStats.map((item) => (
                <AnimatedStat
                  key={item.label}
                  value={item.value}
                  label={item.label}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-6 py-8 lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_38%)]" />

          <div className="relative mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
              {/* <div className="flex flex-col justify-between rounded-[32px] border border-blue-100 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8"> */}
                
                
                <div className="flex flex-col justify-between rounded-[24px] border border-blue-100 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-8">
                <div>
                  <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-blue-700">
                    Why BuildUp exists
                  </span>

                  {/* <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-4xl"> */}
                    
                    <h2 className="mt-4 text-[1.8rem] leading-tight font-black tracking-tight text-slate-950 sm:text-4xl lg:text-4xl">
                    Courses teach skills. Real projects build confidence.
                  </h2>

                  {/* <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg"> */}

                    <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-lg">



                    Many people finish courses but still struggle to prove real
                    ability. BuildUp closes that gap by connecting learning to
                    live work, mentors, organizations, stipends, and visible
                    proof.
                  </p>
                </div>

                {/* <div className="mt-6 grid gap-4 sm:grid-cols-3"> */}

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    ["🎯", "The Problem", "People learn, but lack real experience."],
                    ["🌉", "The Bridge", "Organizations post real projects at low cost."],
                    [
                      "🚀",
                      "The Outcome",
                      "Volunteers build proof, confidence, and credibility.",
                    ],
                  ].map(([icon, title, text]) => (
                    <div
                      key={title}
                      className="rounded-[20px] border border-blue-100 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                        {icon}
                      </div>

                      <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-blue-600">
                        {title}
                      </p>

                      <p className="mt-2 text-sm font-black leading-snug text-slate-900">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">
                      Sponsored space
                    </p>
                    <h3 className="mt-1 text-xl font-black text-slate-950">
                      Featured opportunities
                    </h3>
                  </div>


                  <Link
  href="/marketplace"
  className="hidden h-10 items-center justify-center rounded-2xl bg-blue-600 px-4 text-xs font-black text-white transition hover:bg-blue-700 sm:inline-flex"
>
  Explore Marketplace →
</Link>
                </div>

                <SponsoredOpportunitySlider
                  opportunities={sponsoredOpportunities}
                  compact
                />



<Link
  href="/register/organization"
  className="block rounded-[24px] border border-blue-100 bg-white/80 p-4 sm:p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
>
  <p className="text-sm font-black text-slate-900">
    Grow Your Visibility on BuildUp
  </p>

  {/* <p className="mt-1 text-xs font-semibold text-slate-500"> */}

  <p className="mx-auto mt-1 max-w-md text-xs font-semibold text-slate-500">
    Showcase your brand, services, projects, courses, events, products, and
    opportunities to a growing community of learners, volunteers, mentors,
    and organizations.
  </p>

  <span className="mt-3 inline-flex h-9 items-center justify-center rounded-2xl bg-blue-600 px-4 text-xs font-black text-white">
    Promote on BuildUp →
  </span>
</Link>
              </div>
            </div>

            <div className="mt-6 rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Free Job Board
                  </p>
                  <h3 className="mt-1 text-xl font-black text-slate-900">
                    Latest Jobs
                  </h3>
                </div>

               


<div className="flex flex-wrap justify-end gap-2">
  <Link
    href="/post-opportunity"
    className="inline-flex h-10 items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-black text-white transition hover:bg-blue-700"
  >
    + Post Job Free
  </Link>

  <Link
    href="/marketplace?type=JOB"
    className="inline-flex h-10 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 px-4 text-sm font-black text-blue-700 transition hover:bg-blue-100"
  >
    View All Jobs →
  </Link>
</div>


              </div>

              {latestJobs.length === 0 ? (
                <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <p className="text-sm font-bold text-slate-500">
                    No jobs posted yet.
                  </p>
                </div>
              ) : (
                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {latestJobs.slice(0, 4).map((item) => (
                    <Link
                      key={item.id}
                      href={`/marketplace/${item.id}`}
                      className="group rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-lg">
                          {getOpportunityIcon(item.type)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-700">
                              {formatOpportunityType(item.type)}
                            </span>

                            {item.sponsoredActive && (
                              <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-black text-purple-700">
                                Sponsored
                              </span>
                            )}
                          </div>

                          <h4 className="mt-2 line-clamp-1 text-sm font-black leading-5 text-slate-900 group-hover:text-blue-700">
                            {item.title}
                          </h4>

                          <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                            {item.organization.name}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-500">
                            {item.workMode && (
                              <span className="rounded-full bg-slate-100 px-2 py-0.5">
                                {item.workMode}
                              </span>
                            )}

                            {item.location && (
                              <span className="rounded-full bg-slate-100 px-2 py-0.5">
                                📍 {item.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section
          id="about"
          className="relative overflow-hidden bg-slate-950 px-6 py-8 text-white lg:px-8"
          aria-labelledby="about-heading"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.28),transparent_40%)]" />
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-200">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  About BuildUp
                </div>

                <h2
                  id="about-heading"
                  className="mt-3 max-w-xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-3xl"
                >
                  Bridging the gap between learning and real work
                </h2>

                <div className="mt-6 h-1.5 w-24 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300" />

                <div className="mt-4 space-y-4">
                  <p className="text-base leading-8 text-slate-300 sm:text-lg">
                    <span className="font-bold text-white">BuildUp</span>{" "}
                    connects volunteers, organizations, and mentors to work on
                    real projects and build proven experience.
                  </p>

                  <p className="text-base leading-8 text-slate-300 sm:text-lg">
                    Instead of just certificates, users gain real work,
                    portfolio proof, mentor feedback, and practical visibility.
                  </p>

                  <Link
                    href="/about"
                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-white px-5 text-sm font-black text-blue-700 transition hover:bg-blue-50"
                  >
                    View full story →
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-3 rounded-[2.25rem] bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-cyan-400/20 blur-2xl" />

                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur sm:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-500 text-2xl">
                      🚀
                    </div>

                    <div>
                      <p className="text-lg font-black text-white">
                        Our Mission
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-300">
                        Turn learning into real-world impact
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-4 text-sm leading-7 text-slate-300 sm:text-base">
                    <p>
                      BuildUp exists to help people move beyond theory by
                      creating opportunities to learn through real contribution.
                    </p>

                    <p>
                      We empower volunteers to grow, support organizations with
                      project execution, and give mentors a platform to guide
                      practical talent.
                    </p>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {[
                      ["Learn", "Through live work"],
                      ["Build", "Portfolio proof"],
                      ["Grow", "With guidance"],
                    ].map(([title, text]) => (
                      <div
                        key={title}
                        className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-center"
                      >
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-200">
                          {title}
                        </p>

                        <p className="mt-2 text-sm font-bold text-white">
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 rounded-2xl bg-white px-5 py-4 text-center text-sm font-black text-slate-950">
                    Real Skills → Real Projects → Real Growth
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-slate-100 px-6 py-8 lg:px-8">
          <div className="absolute inset-x-6 top-10 -z-10 h-48 rounded-[3rem] bg-gradient-to-r from-blue-100 via-indigo-100 to-cyan-100 opacity-80 blur-3xl lg:inset-x-20" />

          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <span className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-blue-600 shadow-sm">
                  Live opportunities
                </span>

                <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                  Explore live projects and practical learning opportunities
                </h2>

                <p className="mt-4 text-base leading-7 text-slate-600">
                  Discover real projects from organizations looking for emerging
                  talent to contribute and grow through actual work.
                </p>
              </div>

              <Link
                href="/projects"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white shadow-lg transition hover:bg-blue-700"
              >
                View all projects →
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600 shadow-sm">
                No projects available right now.
              </div>
            ) : (
              <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href="/register/volunteer"
                    className="group block h-full overflow-hidden rounded-3xl border border-blue-100 bg-white p-6 shadow-[0_12px_35px_rgba(37,99,235,0.08)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_45px_rgba(37,99,235,0.14)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 shadow-sm">
                        {project.difficulty}
                      </span>

                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-sm text-slate-400 group-hover:text-blue-600">
                        ↗
                      </span>
                    </div>

                    <div className="mt-5">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                        Organization
                      </p>

                      <p className="mt-2 text-sm font-bold text-slate-700">
                        {project.organization.name}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                          Stipend: {formatNairaFromKobo(project.stipendAmount)}
                        </span>

                        <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                          Delivery: {project.deliveryDays ?? 7}{" "}
                          {(project.deliveryDays ?? 7) === 1 ? "day" : "days"}
                        </span>
                      </div>
                    </div>

                    <h3 className="mt-5 text-lg font-black leading-snug text-slate-900 group-hover:text-blue-700">
                      {project.title}
                    </h3>

                    {project.skills && project.skills.length > 0 && (
                      <div className="mt-5">
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                          Skills Required
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {project.skills.slice(0, 4).map((skill: string) => (
                            <span
                              key={skill}
                              className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                            >
                              {skill}
                            </span>
                          ))}

                          {project.skills.length > 4 && (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                              +{project.skills.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-4">
                      <span className="text-sm font-bold text-slate-800">
                        Apply to gain real experience
                      </span>

                      <span className="text-sm font-black text-blue-600 group-hover:translate-x-0.5">
                        Explore →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section
          className="mx-auto max-w-6xl px-6 py-6 lg:px-8"
          aria-label="Testimonial"
        >
          <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-r from-white via-blue-50 to-indigo-50 p-10 shadow-sm md:p-10">
            <blockquote className="max-w-4xl text-xl italic leading-relaxed text-slate-700 md:text-2xl">
              “BuildUp helped me transition from learning to real work. I now
              apply for jobs with confidence and proof.”
            </blockquote>
            <p className="mt-5 text-base font-semibold text-slate-900">
              — Temi A., Frontend Volunteer
            </p>
          </div>
        </section>

        <section
          id="how-it-works"
          className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-8"
          aria-labelledby="how-it-works-heading"
        >
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
              Process
            </span>

            <h2
              id="how-it-works-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-3xl"
            >
              How BuildUp works
            </h2>

            <p className="mt-2 text-base leading-7 text-slate-600 sm:text-lg">
              A simple, structured ecosystem that turns real projects into real
              experience, guided delivery, and portfolio proof.
            </p>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="relative rounded-[36px] border border-slate-200 bg-gradient-to-br from-white via-blue-50/50 to-indigo-50 p-6 shadow-[0_24px_80px_rgba(37,99,235,0.10)] sm:p-6">
              <div className="absolute left-1/2 top-10 hidden h-[78%] w-[2px] -translate-x-1/2 bg-gradient-to-b from-blue-200 via-indigo-300 to-emerald-200 lg:block" />

              <div className="relative grid gap-5">
                {workflowSteps.map((item, index) => (
                  <div
                    key={item.title}
                    className={`relative flex items-start gap-4 rounded-[28px] border border-white/80 bg-white/90 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl ${
                      index % 2 === 0 ? "lg:mr-16" : "lg:ml-16"
                    }`}
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white shadow-lg shadow-blue-200">
                      {item.icon}
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                        Step {item.step}
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[36px] border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-300">
                Ecosystem map
              </p>

              <h3 className="mt-3 text-3xl font-bold">
                Organization → Project → Mentor → Portfolio
              </h3>

              <div className="mt-8 space-y-4">
                {[
                  ["🏢", "Low-cost project support for organizations"],
                  ["🙋", "Real experience and stipends for volunteers"],
                  ["🧑‍🏫", "Meaningful impact for mentors"],
                  ["🏆", "Proof-of-work portfolios for career growth"],
                ].map(([icon, text]) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4"
                  >
                    <span className="text-2xl">{icon}</span>
                    <p className="text-sm font-medium leading-6 text-slate-200">
                      {text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl bg-white px-5 py-4 text-center text-sm font-bold text-slate-950">
                The outcome: real work, real reviews, real growth.
              </div>
            </div>
          </div>
        </section>

        <section
          className="relative overflow-hidden bg-blue-600 py-6 text-white"
          aria-labelledby="cta-heading"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%)]" />
          <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-indigo-300/20 blur-3xl" />

          <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-8">
            <div className="mb-4 flex justify-center">
              <div className="rounded-[24px] border border-white/20 bg-white/10 px-5 py-4 backdrop-blur">
                <BuildUpLogo
                  href="/"
                  showTagline={true}
                  dark={true}
                  className="justify-center"
                  imageClassName="shadow-sm"
                />
              </div>
            </div>

            <h2
              id="cta-heading"
              className="text-4xl font-bold tracking-tight md:text-3xl"
            >
              Where learning meets real impact.
            </h2>

            <p className="mx-auto mt-2 max-w-2xl text-lg leading-8 text-blue-100">
              Join a platform designed to move people from theory to practical
              experience, guided growth, and measurable outcomes.
            </p>

            <div className="mt-5 flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href="/register/volunteer"
                className="inline-flex h-10 items-center justify-center rounded-2xl bg-white px-6 text-base font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Join as Volunteer
              </Link>

              <Link
                href="/register/organization"
                className="inline-flex h-10 items-center justify-center rounded-2xl border border-white/70 px-6 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Post a Project
              </Link>

              <Link
                href="/register/mentor"
                className="inline-flex h-10 items-center justify-center rounded-2xl border border-white/70 px-6 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Become a Mentor
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

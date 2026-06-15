



// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";
// import ProjectMentorRequestModal from "@/components/mentorship/ProjectMentorRequestModal";

// /* ================= TYPES ================= */

// type MentorBadge = {
//   id: string;
//   name: string;
//   description: string;
//   icon: string;
//   category: string | null;
// };

// type Mentor = {
//   id: string;
//   name: string;
//   username: string | null;
//   bio: string | null;
//   headline: string | null;
//   skills: string | null;
//   experience: string | null;
//   profileImageUrl: string | null;
//   rating: number;
//   ratingCount: number;
//   projectsGuided: number;
//   mentorLevel: number;
//   mentorshipPoints: number;
//   badges: MentorBadge[];
// };

// type Project = {
//   id: string;
//   title: string;
// };

// /* ================= HELPERS ================= */

// function getInitials(name: string) {
//   return name
//     .split(" ")
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((part) => part[0]?.toUpperCase())
//     .join("");
// }

// function parseSkills(skills: string | null) {
//   if (!skills) return [];
//   return skills
//     .split(",")
//     .map((skill) => skill.trim())
//     .filter(Boolean);
// }

// function getMentorLevelTitle(level: number) {
//   if (level >= 5) return "Mentor Master";
//   if (level >= 4) return "Elite Mentor";
//   if (level >= 3) return "Experienced Guide";
//   if (level >= 2) return "Rising Mentor";

//   return "New Mentor";
// }

// /* ================= PAGE ================= */

// export default function MentorSearchPage() {
//   const [mentors, setMentors] = useState<Mentor[]>([]);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [skill, setSkill] = useState("");

//   const [selectedMentor, setSelectedMentor] = useState<string | null>(null);

//   const [loadingMentors, setLoadingMentors] = useState(false);
//   const [loadingProjects, setLoadingProjects] = useState(false);

//   async function fetchMentors() {
//     setLoadingMentors(true);

//     try {
//       const res = await fetch(
//         `/api/mentors/search?skill=${encodeURIComponent(skill)}`
//       );

//       const data = await res.json();
//       setMentors(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Failed to load mentors", error);
//       setMentors([]);
//     } finally {
//       setLoadingMentors(false);
//     }
//   }

//   async function fetchProjects() {
//     setLoadingProjects(true);

//     try {
//       const res = await fetch("/api/volunteer/projects");
//       const data = await res.json();
//       setProjects(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Failed to load projects", error);
//       setProjects([]);
//     } finally {
//       setLoadingProjects(false);
//     }
//   }

//   useEffect(() => {
//     fetchMentors();
//     fetchProjects();
//   }, []);

//   const hasProjects = useMemo(() => projects.length > 0, [projects.length]);

//   const totalGuidedProjects = useMemo(
//     () => mentors.reduce((sum, mentor) => sum + mentor.projectsGuided, 0),
//     [mentors]
//   );

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 md:px-8 lg:px-10 lg:py-8">
//       <div className="mx-auto max-w-7xl space-y-8">
//         <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
//           <div className="relative px-6 py-8 md:px-8 md:py-10">
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.10),transparent_28%)]" />

//             <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
//               <div className="max-w-2xl">
//                 <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
//                   <span className="h-2 w-2 rounded-full bg-blue-600" />
//                   BuildUp Mentorship
//                 </div>

//                 <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
//                   Find a Mentor
//                 </h1>

//                 <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 md:text-base">
//                   Discover approved mentors, compare reputation signals, and
//                   request guidance for the project you are actively building.
//                 </p>
//               </div>

//               <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
//                 <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center sm:min-w-[120px]">
//                   <p className="text-2xl font-bold text-slate-900">
//                     {mentors.length}
//                   </p>
//                   <p className="text-xs font-medium text-slate-500">Mentors</p>
//                 </div>

//                 <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center sm:min-w-[120px]">
//                   <p className="text-2xl font-bold text-slate-900">
//                     {projects.length}
//                   </p>
//                   <p className="text-xs font-medium text-slate-500">Projects</p>
//                 </div>

//                 <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-center sm:min-w-[120px]">
//                   <p className="text-2xl font-bold text-blue-700">
//                     {totalGuidedProjects}
//                   </p>
//                   <p className="text-xs font-medium text-blue-600">Guided</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
//           <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//             <div className="flex flex-1 flex-col gap-3 sm:flex-row">
//               <div className="relative flex-1">
//                 <input
//                   placeholder="Search by skill e.g. React, UI Design, Product Management"
//                   className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                   value={skill}
//                   onChange={(e) => setSkill(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") fetchMentors();
//                   }}
//                 />
//               </div>

//               <button
//                 onClick={fetchMentors}
//                 disabled={loadingMentors}
//                 className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {loadingMentors ? "Searching..." : "Search Mentors"}
//               </button>
//             </div>

//             <div className="flex flex-wrap items-center gap-2">
//               <div className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
//                 {hasProjects
//                   ? "You can request mentorship"
//                   : "No active project yet"}
//               </div>

//               {loadingProjects ? (
//                 <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
//                   Loading projects...
//                 </div>
//               ) : null}
//             </div>
//           </div>
//         </section>

//         {loadingMentors ? (
//           <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
//             {Array.from({ length: 6 }).map((_, index) => (
//               <div
//                 key={index}
//                 className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
//               >
//                 <div className="animate-pulse space-y-4">
//                   <div className="flex items-center gap-4">
//                     <div className="h-14 w-14 rounded-2xl bg-slate-200" />
//                     <div className="flex-1 space-y-2">
//                       <div className="h-4 w-32 rounded bg-slate-200" />
//                       <div className="h-3 w-24 rounded bg-slate-100" />
//                     </div>
//                   </div>
//                   <div className="h-4 w-full rounded bg-slate-100" />
//                   <div className="h-4 w-5/6 rounded bg-slate-100" />
//                   <div className="h-11 w-full rounded-2xl bg-slate-200" />
//                 </div>
//               </div>
//             ))}
//           </section>
//         ) : mentors.length === 0 ? (
//           <section className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
//             <div className="mx-auto max-w-md">
//               <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
//                 🧑‍🏫
//               </div>

//               <h2 className="text-xl font-semibold text-slate-900">
//                 No mentors found
//               </h2>

//               <p className="mt-2 text-sm leading-6 text-slate-500">
//                 Try a different skill keyword or broaden your search to discover
//                 more mentors.
//               </p>
//             </div>
//           </section>
//         ) : (
//           <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
//             {mentors.map((mentor) => {
//               const mentorSkills = parseSkills(mentor.skills);
//               const topBadges = mentor.badges.slice(0, 3);

//               return (
//                 <article
//                   key={mentor.id}
//                   className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
//                 >
//                   <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 opacity-80" />

//                   <div className="flex items-start gap-4">
//                     <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
//                       {mentor.profileImageUrl ? (
//                         <Image
//                           src={mentor.profileImageUrl}
//                           alt={mentor.name}
//                           fill
//                           className="object-cover"
//                           sizes="64px"
//                         />
//                       ) : (
//                         <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
//                           {getInitials(mentor.name)}
//                         </div>
//                       )}
//                     </div>

//                     <div className="min-w-0 flex-1">
//                       <div className="flex flex-wrap items-start justify-between gap-3">
//                         <div className="min-w-0">
//                           <h3 className="truncate text-lg font-bold text-slate-900">
//                             {mentor.name}
//                           </h3>

//                           <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
//                             {getMentorLevelTitle(mentor.mentorLevel)}
//                           </p>

//                           {mentor.username ? (
//                             <p className="mt-1 text-xs font-semibold text-blue-600">
//                               @{mentor.username}
//                             </p>
//                           ) : null}
//                         </div>

//                         <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
//                           ⭐ {Number(mentor.rating || 0).toFixed(1)} ·{" "}
//                           {mentor.ratingCount} review
//                           {mentor.ratingCount === 1 ? "" : "s"}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mt-5 flex flex-wrap gap-2">
//                     <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
//                       Level {mentor.mentorLevel}
//                     </span>

//                     <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
//                       {mentor.projectsGuided} guided
//                     </span>

//                     <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
//                       {mentor.mentorshipPoints} pts
//                     </span>
//                   </div>

//                   <div className="mt-5 space-y-4">
//                     {mentor.headline ? (
//                       <p className="text-sm font-semibold text-slate-800">
//                         {mentor.headline}
//                       </p>
//                     ) : null}

//                     <p className="min-h-[72px] text-sm leading-6 text-slate-600">
//                       {mentor.bio?.trim()
//                         ? mentor.bio
//                         : "This mentor has not added a bio yet, but is available for mentorship requests."}
//                     </p>

//                     <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//                       <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
//                         <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
//                           Experience
//                         </p>
//                         <p className="mt-1 text-sm font-semibold text-slate-800">
//                           {mentor.experience ?? "N/A"} years
//                         </p>
//                       </div>

//                       <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
//                         <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
//                           Availability
//                         </p>
//                         <p className="mt-1 text-sm font-semibold text-emerald-700">
//                           Open to requests
//                         </p>
//                       </div>
//                     </div>

//                     <div>
//                       <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
//                         Skills
//                       </p>

//                       {mentorSkills.length > 0 ? (
//                         <div className="flex flex-wrap gap-2">
//                           {mentorSkills.slice(0, 8).map((item) => (
//                             <span
//                               key={item}
//                               className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
//                             >
//                               {item}
//                             </span>
//                           ))}

//                           {mentorSkills.length > 8 ? (
//                             <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
//                               +{mentorSkills.length - 8} more
//                             </span>
//                           ) : null}
//                         </div>
//                       ) : (
//                         <p className="text-sm text-slate-500">
//                           No skills listed yet.
//                         </p>
//                       )}
//                     </div>

//                     {topBadges.length > 0 ? (
//                       <div>
//                         <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
//                           Mentor Badges
//                         </p>

//                         <div className="flex flex-wrap gap-2">
//                           {topBadges.map((badge) => (
//                             <span
//                               key={badge.id}
//                               title={`${badge.name} — ${badge.description}`}
//                               className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700"
//                             >
//                               {badge.icon} {badge.name}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     ) : null}
//                   </div>

//                   <div className="mt-6 grid gap-3">
//                     <button
//                       onClick={() => {
//                         if (projects.length === 0) {
//                           alert(
//                             "You need an active project to request mentorship"
//                           );
//                           return;
//                         }

//                         setSelectedMentor(mentor.id);
//                       }}
//                       disabled={loadingProjects}
//                       className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
//                     >
//                       {loadingProjects
//                         ? "Checking projects..."
//                         : "Request Mentorship"}
//                     </button>

//                     <Link
//                       href={`/dashboard/volunteer/mentors/${mentor.id}/book`}
//                       className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
//                     >
//                       Book Session
//                     </Link>

//                     {mentor.username ? (
//                       <Link
//                         // href={`/mentor/${mentor.username}`}
//                         href={`/dashboard/volunteer/mentors/${mentor.id}`}
//                         className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
//                       >
//                         View Mentor Profile
//                       </Link>
//                     ) : null}

//                     {!hasProjects && !loadingProjects ? (
//                       <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
//                         You need an active project before you can send a
//                         mentorship request.
//                       </div>
//                     ) : null}
//                   </div>
//                 </article>
//               );
//             })}
//           </section>
//         )}

//         {selectedMentor ? (
//           <ProjectMentorRequestModal
//             mentorId={selectedMentor}
//             projects={projects}
//             onClose={() => setSelectedMentor(null)}
//           />
//         ) : null}
//       </div>
//     </main>
//   );
// }




"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ProjectMentorRequestModal from "@/components/mentorship/ProjectMentorRequestModal";

/* ================= TYPES ================= */

type MentorBadge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string | null;
};

type Mentor = {
  id: string;
  name: string;
  username: string | null;
  bio: string | null;
  headline: string | null;
  skills: string | null;
  experience: string | null;
  profileImageUrl: string | null;
  rating: number;
  ratingCount: number;
  projectsGuided: number;
  mentorLevel: number;
  mentorshipPoints: number;
  badges: MentorBadge[];
  isCertified?: boolean;
  hasAvailability?: boolean;
};

type Project = {
  id: string;
  title: string;
};

type FilterType = "all" | "certified" | "available" | "top-rated";

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

function getMentorLevelTitle(level: number) {
  if (level >= 5) return "Mentor Master";
  if (level >= 4) return "Elite Mentor";
  if (level >= 3) return "Experienced Guide";
  if (level >= 2) return "Rising Mentor";

  return "New Mentor";
}

function mentorIsCertified(mentor: Mentor) {
  return (
    mentor.isCertified ||
    mentor.badges.some(
      (badge) =>
        badge.name.toLowerCase() === "buildup certified mentor" ||
        badge.category?.toLowerCase() === "certification"
    )
  );
}

function mentorIsTopRated(mentor: Mentor) {
  return Number(mentor.rating || 0) >= 4.5 && mentor.ratingCount > 0;
}

/* ================= PAGE ================= */

export default function MentorSearchPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skill, setSkill] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);

  const [loadingMentors, setLoadingMentors] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);

  async function fetchMentors() {
    setLoadingMentors(true);

    try {
      const res = await fetch(
        `/api/mentors/search?skill=${encodeURIComponent(skill)}`
      );

      const data = await res.json();
      setMentors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load mentors", error);
      setMentors([]);
    } finally {
      setLoadingMentors(false);
    }
  }

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

  useEffect(() => {
    fetchMentors();
    fetchProjects();
  }, []);

  const hasProjects = useMemo(() => projects.length > 0, [projects.length]);

  const totalGuidedProjects = useMemo(
    () => mentors.reduce((sum, mentor) => sum + mentor.projectsGuided, 0),
    [mentors]
  );

  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor) => {
      if (filter === "certified") {
        return mentorIsCertified(mentor);
      }

      if (filter === "available") {
        return Boolean(mentor.hasAvailability);
      }

      if (filter === "top-rated") {
        return mentorIsTopRated(mentor);
      }

      return true;
    });
  }, [mentors, filter]);

  const certifiedCount = useMemo(
    () => mentors.filter((mentor) => mentorIsCertified(mentor)).length,
    [mentors]
  );

  const availableCount = useMemo(
    () => mentors.filter((mentor) => mentor.hasAvailability).length,
    [mentors]
  );

  const topRatedCount = useMemo(
    () => mentors.filter((mentor) => mentorIsTopRated(mentor)).length,
    [mentors]
  );

  const filters: { label: string; value: FilterType; count: number }[] = [
    {
      label: "All Mentors",
      value: "all",
      count: mentors.length,
    },
    {
      label: "Certified",
      value: "certified",
      count: certifiedCount,
    },
    {
      label: "Available",
      value: "available",
      count: availableCount,
    },
    {
      label: "Top Rated",
      value: "top-rated",
      count: topRatedCount,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 md:px-8 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-8">
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
                  Discover approved mentors, compare reputation signals, and
                  request guidance for the project you are actively building.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <SummaryCard label="Mentors" value={mentors.length} />
                <SummaryCard label="Projects" value={projects.length} />
                <SummaryCard
                  label="Guided"
                  value={totalGuidedProjects}
                  highlighted
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <input
                  placeholder="Search by skill e.g. React, UI Design, Product Management"
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

              {loadingProjects ? (
                <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                  Loading projects...
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            {filters.map((item) => {
              const active = filter === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-black transition ${
                    active
                      ? "bg-blue-600 text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-white text-slate-500"
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

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
                  <div className="h-11 w-full rounded-2xl bg-slate-200" />
                </div>
              </div>
            ))}
          </section>
        ) : filteredMentors.length === 0 ? (
          <section className="rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
                🧑‍🏫
              </div>

              <h2 className="text-xl font-semibold text-slate-900">
                No mentors found
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Try another filter or search keyword.
              </p>
            </div>
          </section>
        ) : (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredMentors.map((mentor) => {
              const mentorSkills = parseSkills(mentor.skills);
              const topBadges = mentor.badges.slice(0, 3);
              const isCertified = mentorIsCertified(mentor);

              return (
                <article
                  key={mentor.id}
                  className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1 opacity-80 ${
                      isCertified
                        ? "bg-gradient-to-r from-emerald-500 via-blue-600 to-indigo-600"
                        : "bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500"
                    }`}
                  />

                  <div className="flex items-start gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
                      {mentor.profileImageUrl ? (
                        <Image
                          src={mentor.profileImageUrl}
                          alt={mentor.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
                          {getInitials(mentor.name)}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold text-slate-900">
                            {mentor.name}
                          </h3>

                          <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                            {getMentorLevelTitle(mentor.mentorLevel)}
                          </p>

                          {mentor.username ? (
                            <p className="mt-1 text-xs font-semibold text-blue-600">
                              @{mentor.username}
                            </p>
                          ) : null}
                        </div>

                        <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                          ⭐ {Number(mentor.rating || 0).toFixed(1)} ·{" "}
                          {mentor.ratingCount} review
                          {mentor.ratingCount === 1 ? "" : "s"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {isCertified && (
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                        🎓 Certified
                      </span>
                    )}

                    <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                      Level {mentor.mentorLevel}
                    </span>

                    <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      {mentor.projectsGuided} guided
                    </span>

                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
                      {mentor.mentorshipPoints} pts
                    </span>

                    {mentor.hasAvailability && (
                      <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        🟢 Available
                      </span>
                    )}
                  </div>

                  <div className="mt-5 space-y-4">
                    {mentor.headline ? (
                      <p className="text-sm font-semibold text-slate-800">
                        {mentor.headline}
                      </p>
                    ) : null}

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
                        <p
                          className={`mt-1 text-sm font-semibold ${
                            mentor.hasAvailability
                              ? "text-emerald-700"
                              : "text-slate-500"
                          }`}
                        >
                          {mentor.hasAvailability
                            ? "Open office hours"
                            : "Open to requests"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Skills
                      </p>

                      {mentorSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {mentorSkills.slice(0, 8).map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                            >
                              {item}
                            </span>
                          ))}

                          {mentorSkills.length > 8 ? (
                            <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                              +{mentorSkills.length - 8} more
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500">
                          No skills listed yet.
                        </p>
                      )}
                    </div>

                    {topBadges.length > 0 ? (
                      <div>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Mentor Badges
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {topBadges.map((badge) => (
                            <span
                              key={badge.id}
                              title={`${badge.name} — ${badge.description}`}
                              className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700"
                            >
                              {badge.icon} {badge.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-6 grid gap-3">
                    <button
                      onClick={() => {
                        if (projects.length === 0) {
                          alert(
                            "You need an active project to request mentorship"
                          );
                          return;
                        }

                        setSelectedMentor(mentor.id);
                      }}
                      disabled={loadingProjects}
                      className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loadingProjects
                        ? "Checking projects..."
                        : "Request Mentorship"}
                    </button>

                    <Link
                      href={`/dashboard/volunteer/mentors/${mentor.id}/book`}
                      className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                      Book Session
                    </Link>

                    {mentor.username ? (
                      <Link
                        href={`/dashboard/volunteer/mentors/${mentor.id}`}
                        className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        View Mentor Profile
                      </Link>
                    ) : null}

                    {!hasProjects && !loadingProjects ? (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">
                        You need an active project before you can send a
                        mentorship request.
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {selectedMentor ? (
          <ProjectMentorRequestModal
            mentorId={selectedMentor}
            projects={projects}
            onClose={() => setSelectedMentor(null)}
          />
        ) : null}
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  highlighted = false,
}: {
  label: string;
  value: number;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-center sm:min-w-[120px] ${
        highlighted
          ? "border-blue-100 bg-blue-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <p
        className={`text-2xl font-bold ${
          highlighted ? "text-blue-700" : "text-slate-900"
        }`}
      >
        {value}
      </p>

      <p
        className={`text-xs font-medium ${
          highlighted ? "text-blue-600" : "text-slate-500"
        }`}
      >
        {label}
      </p>
    </div>
  );
}
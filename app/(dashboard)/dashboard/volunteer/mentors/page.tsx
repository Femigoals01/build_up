

// "use client";

// import { useEffect, useState } from "react";
// import ProjectMentorRequestModal from "@/components/mentorship/ProjectMentorRequestModal";

// type Mentor = {
//   id: string;
//   name: string;
//   bio: string | null;
//   skills: string | null;
//   experience: string | null;
//   rating: number;
//   ratingCount: number;
// };

// type Project = {
//   id: string;
//   title: string;
// };

// export default function MentorSearchPage() {
//   const [mentors, setMentors] = useState<Mentor[]>([]);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [skill, setSkill] = useState("");
//   const [selectedMentor, setSelectedMentor] = useState<string | null>(null);

//   async function fetchMentors() {
//     const res = await fetch(`/api/mentors/search?skill=${skill}`);
//     setMentors(await res.json());
//   }

//   async function fetchProjects() {
//     const res = await fetch("/api/volunteer/projects");
//     setProjects(await res.json());
//   }

//   useEffect(() => {
//     fetchMentors();
//     fetchProjects();
//   }, []);

//   return (
//     <main className="p-10 space-y-8">
//       <h1 className="text-3xl font-bold">Find a Mentor</h1>

//       <div className="flex gap-4">
//         <input
//           placeholder="Search by skill"
//           className="border px-4 py-2 rounded-lg"
//           value={skill}
//           onChange={(e) => setSkill(e.target.value)}
//         />
//         <button
//           onClick={fetchMentors}
//           className="bg-blue-600 text-white px-6 py-2 rounded-lg"
//         >
//           Search
//         </button>
//       </div>

//       <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
//         {mentors.map((mentor) => (
//           <div key={mentor.id} className="bg-white border rounded-xl p-6">
//             <h3 className="font-semibold text-lg">{mentor.name}</h3>
//             <p className="text-sm text-gray-600">{mentor.bio}</p>

//             <button
//               onClick={() => setSelectedMentor(mentor.id)}
//               className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
//             >
//               Request Mentorship
//             </button>
//           </div>
//         ))}
//       </div>

//       {selectedMentor && (
//         <ProjectMentorRequestModal
//           mentorId={selectedMentor}
//           projects={projects}
//           onClose={() => setSelectedMentor(null)}
//         />
//       )}
//     </main>
//   );
// }




// "use client";

// import { useEffect, useState } from "react";
// import ProjectMentorRequestModal from "@/components/mentorship/ProjectMentorRequestModal";

// type Mentor = {
//   id: string;
//   name: string;
//   bio: string | null;
//   skills: string | null;
//   experience: string | null;
//   rating: number;
//   ratingCount: number;
// };

// type Project = {
//   id: string;
//   title: string;
// };

// export default function MentorSearchPage() {
//   const [mentors, setMentors] = useState<Mentor[]>([]);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [skill, setSkill] = useState("");
//   const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
//   const [loadingMentors, setLoadingMentors] = useState(false);
//   const [loadingProjects, setLoadingProjects] = useState(false);

//   /* ================= FETCH MENTORS ================= */

//   async function fetchMentors() {
//     setLoadingMentors(true);
//     try {
//       const res = await fetch(`/api/mentors/search?skill=${skill}`);
//       const data = await res.json();
//       setMentors(data);
//     } catch (error) {
//       console.error("Failed to load mentors", error);
//     } finally {
//       setLoadingMentors(false);
//     }
//   }

//   /* ================= FETCH VOLUNTEER PROJECTS ================= */

//   async function fetchProjects() {
//     setLoadingProjects(true);
//     try {
//       const res = await fetch("/api/volunteer/projects");
//       const data = await res.json();
//       setProjects(data);
//     } catch (error) {
//       console.error("Failed to load projects", error);
//     } finally {
//       setLoadingProjects(false);
//     }
//   }

//   useEffect(() => {
//     fetchMentors();
//     fetchProjects();
//   }, []);

//   return (
//     <main className="p-10 space-y-8">
//       {/* HEADER */}
//       <div>
//         <h1 className="text-3xl font-bold">Find a Mentor</h1>
//         <p className="text-gray-600">
//           Search approved mentors and request mentorship for your project
//         </p>
//       </div>

//       {/* SEARCH */}
//       <div className="flex gap-4">
//         <input
//           placeholder="Search by skill (e.g. React)"
//           className="border px-4 py-2 rounded-lg w-72"
//           value={skill}
//           onChange={(e) => setSkill(e.target.value)}
//         />
//         <button
//           onClick={fetchMentors}
//           className="bg-blue-600 text-white px-6 py-2 rounded-lg"
//         >
//           Search
//         </button>
//       </div>

//       {/* LOADING */}
//       {loadingMentors ? (
//         <p className="text-gray-600">Loading mentors…</p>
//       ) : mentors.length === 0 ? (
//         <p className="text-gray-600">No mentors found.</p>
//       ) : (
//         <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
//           {mentors.map((mentor) => (
//             <div
//               key={mentor.id}
//               className="bg-white border rounded-xl p-6 space-y-3"
//             >
//               <h3 className="font-semibold text-lg">{mentor.name}</h3>

//               {mentor.bio && (
//                 <p className="text-sm text-gray-600">{mentor.bio}</p>
//               )}

//               {mentor.skills && (
//                 <div className="flex flex-wrap gap-2">
//                   {mentor.skills.split(",").map((skill) => (
//                     <span
//                       key={skill}
//                       className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
//                     >
//                       {skill.trim()}
//                     </span>
//                   ))}
//                 </div>
//               )}

//               <div className="text-sm text-gray-600">
//                 Experience: {mentor.experience ?? "N/A"} years
//               </div>

//               <div className="text-sm text-yellow-500">
//                 ⭐ {mentor.rating.toFixed(1)} ({mentor.ratingCount})
//               </div>

//               <button
//                 onClick={() => setSelectedMentor(mentor.id)}
//                 disabled={loadingProjects || projects.length === 0}
//                 className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
//               >
//                 Request Mentorship
//               </button>

//               {projects.length === 0 && (
//                 <p className="text-xs text-gray-500">
//                   You need an active project to request mentorship
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* MODAL */}
//       {selectedMentor && (
//         <ProjectMentorRequestModal
//           mentorId={selectedMentor}
//           projects={projects}
//           onClose={() => setSelectedMentor(null)}
//         />
//       )}
//     </main>
//   );
// }


"use client";

import { useEffect, useState } from "react";
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
      const res = await fetch(`/api/mentors/search?skill=${skill}`);
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

  /* ================= UI ================= */

  return (
    <main className="p-10 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Find a Mentor</h1>
        <p className="text-gray-600">
          Search approved mentors and request mentorship for your project
        </p>
      </div>

      {/* SEARCH */}
      <div className="flex gap-4">
        <input
          placeholder="Search by skill (e.g. React)"
          className="border px-4 py-2 rounded-lg w-72"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />
        <button
          onClick={fetchMentors}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Search
        </button>
      </div>

      {/* STATES */}
      {loadingMentors ? (
        <p className="text-gray-600">Loading mentors…</p>
      ) : mentors.length === 0 ? (
        <p className="text-gray-600">No mentors found.</p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-white border rounded-xl p-6 space-y-3"
            >
              <h3 className="font-semibold text-lg">{mentor.name}</h3>

              {mentor.bio && (
                <p className="text-sm text-gray-600">{mentor.bio}</p>
              )}

              {mentor.skills && (
                <div className="flex flex-wrap gap-2">
                  {mentor.skills.split(",").map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-sm text-gray-600">
                Experience: {mentor.experience ?? "N/A"} years
              </div>

              <div className="text-sm text-yellow-500">
                ⭐ {mentor.rating.toFixed(1)} ({mentor.ratingCount})
              </div>

              <button
                onClick={() => {
                  if (projects.length === 0) {
                    alert("You need an active project to request mentorship");
                    return;
                  }
                  setSelectedMentor(mentor.id);
                }}
                disabled={loadingProjects}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
              >
                Request Mentorship
              </button>

              {projects.length === 0 && !loadingProjects && (
                <p className="text-xs text-gray-500">
                  You need an active project to request mentorship
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* REQUEST MODAL */}
      {selectedMentor && (
        <ProjectMentorRequestModal
          mentorId={selectedMentor}
          projects={projects}
          onClose={() => setSelectedMentor(null)}
        />
      )}
    </main>
  );
}

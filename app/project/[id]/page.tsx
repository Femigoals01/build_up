


// "use client";

// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";

// type Project = {
//   id: string;
//   title: string;
//   description: string;
//   status: "OPEN" | "COMPLETED";
//   organization: { name: string };
//   skills: string[];
// };

// export default function ProjectWorkspace() {
//   const { id } = useParams<{ id: string }>();
//   const [activeTab, setActiveTab] = useState("overview");
//   const [project, setProject] = useState<Project | null>(null);
//   const [submitting, setSubmitting] = useState(false);

//   /* ================= LOAD PROJECT ================= */
//   useEffect(() => {
//     const load = async () => {
//       const res = await fetch(`/api/projects/${id}`);
//       const data = await res.json();
//       setProject(data);
//     };
//     load();
//   }, [id]);

//   if (!project) {
//     return <p className="p-10">Loading project...</p>;
//   }

//   const isCompleted = project.status === "COMPLETED";

//   /* ================= SUBMIT FINAL WORK ================= */
//   const submitFinalWork = async () => {
//     setSubmitting(true);
//     await fetch(`/api/projects/${project.id}/submit`, {
//       method: "POST",
//     });
//     setSubmitting(false);
//     alert("Final work submitted. Waiting for organization review.");
//   };

  

//   return (
//     <main className="min-h-screen px-8 py-10">

//       {/* ================= HEADER ================= */}
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold">{project.title}</h2>
//         <p className="text-gray-600">
//           Organization: {project.organization.name}
//         </p>

//         <span
//           className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold ${
//             isCompleted
//               ? "bg-green-100 text-green-700"
//               : "bg-blue-100 text-blue-700"
//           }`}
//         >
//           {isCompleted ? "Completed" : "In Progress"}
//         </span>
//       </div>

//       {/* ================= TABS ================= */}
//       <div className="flex space-x-6 border-b pb-2 mb-8">
//         {["overview", "tasks", "files", "chat", "team"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`pb-2 text-lg capitalize ${
//               activeTab === tab
//                 ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
//                 : "text-gray-600 hover:text-blue-600"
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* ================= TAB CONTENT ================= */}
//       <div>

//         {/* ===== OVERVIEW ===== */}
//         {activeTab === "overview" && (
//           <section>
//             <h3 className="text-2xl font-bold mb-4">Project Overview</h3>

//             <p className="text-gray-700 leading-relaxed mb-6">
//               {project.description}
//             </p>

//             <h4 className="font-bold mb-2">Required Skills</h4>
//             <div className="flex flex-wrap gap-3 mb-6">
//               {project.skills.map((skill) => (
//                 <span
//                   key={skill}
//                   className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg"
//                 >
//                   {skill}
//                 </span>
//               ))}
//             </div>

//             {!isCompleted && (
//               <button
//                 onClick={submitFinalWork}
//                 disabled={submitting}
//                 className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
//               >
//                 {submitting ? "Submitting..." : "Submit Final Work"}
//               </button>
//             )}
//           </section>
//         )}

//         {/* ===== TASKS ===== */}
//         {activeTab === "tasks" && (
//           <section>
//             <h3 className="text-2xl font-bold mb-6">Tasks</h3>
//             <p className="text-gray-600">
//               Task board coming next (drag & drop).
//             </p>
//           </section>
//         )}

//         {/* ===== FILES ===== */}
//         {activeTab === "files" && (
//           <section>
//             <h3 className="text-2xl font-bold mb-6">Project Files</h3>
//             <p className="text-gray-600">
//               File uploads will be enabled next.
//             </p>
//           </section>
//         )}

//         {/* ===== CHAT ===== */}
//         {activeTab === "chat" && (
//           <section>
//             <h3 className="text-2xl font-bold mb-6">Team Chat</h3>
//             <p className="text-gray-600">
//               Real-time chat will be added later.
//             </p>
//           </section>
//         )}

//         {/* ===== TEAM ===== */}
//         {activeTab === "team" && (
//           <section>
//             <h3 className="text-2xl font-bold mb-6">Team Members</h3>
//             <p className="text-gray-600">
//               Team members loaded dynamically next.
//             </p>
//           </section>
//         )}
//       </div>
//     </main>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

type Project = {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "COMPLETED";
  organization: { name: string };
  skills: string[];
};

export default function ProjectWorkspace() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("overview");
  const [project, setProject] = useState<Project | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  /* ================= PROFILE COMPLETION CHECK ================= */
  useEffect(() => {
    const checkProfile = async () => {
      const res = await fetch("/api/profile/completion");
      const data = await res.json();

      if (!data.complete) {
        router.replace("/dashboard/settings?completeProfile=true");
      } else {
        setCheckingProfile(false);
      }
    };

    checkProfile();
  }, [router]);

  /* ================= LOAD PROJECT ================= */
  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();
      setProject(data);
    };
    load();
  }, [id]);

  if (checkingProfile || !project) {
    return <p className="p-10">Loading project...</p>;
  }

  const isCompleted = project.status === "COMPLETED";

  /* ================= SUBMIT FINAL WORK ================= */
  const submitFinalWork = async () => {
    setSubmitting(true);

    await fetch(`/api/projects/${project.id}/submit`, {
      method: "POST",
    });

    setSubmitting(false);
    alert("Final work submitted. Waiting for organization review.");
  };

  return (
    <main className="min-h-screen px-8 py-10">

      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold">{project.title}</h2>
        <p className="text-gray-600">
          Organization: {project.organization.name}
        </p>

        <span
          className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-semibold ${
            isCompleted
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {isCompleted ? "Completed" : "In Progress"}
        </span>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex space-x-6 border-b pb-2 mb-8">
        {["overview", "tasks", "files", "chat", "team"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-lg capitalize ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ================= TAB CONTENT ================= */}
      <div>
        {activeTab === "overview" && (
          <section>
            <h3 className="text-2xl font-bold mb-4">Project Overview</h3>

            <p className="text-gray-700 leading-relaxed mb-6">
              {project.description}
            </p>

            <h4 className="font-bold mb-2">Required Skills</h4>
            <div className="flex flex-wrap gap-3 mb-6">
              {project.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>

            {!isCompleted && (
              <button
                onClick={submitFinalWork}
                disabled={submitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Final Work"}
              </button>
            )}
          </section>
        )}

        {activeTab === "tasks" && (
          <section>
            <h3 className="text-2xl font-bold mb-6">Tasks</h3>
            <p className="text-gray-600">
              Task board coming next (drag & drop).
            </p>
          </section>
        )}

        {activeTab === "files" && (
          <section>
            <h3 className="text-2xl font-bold mb-6">Project Files</h3>
            <p className="text-gray-600">
              File uploads will be enabled next.
            </p>
          </section>
        )}

        {activeTab === "chat" && (
          <section>
            <h3 className="text-2xl font-bold mb-6">Team Chat</h3>
            <p className="text-gray-600">
              Real-time chat will be added later.
            </p>
          </section>
        )}

        {activeTab === "team" && (
          <section>
            <h3 className="text-2xl font-bold mb-6">Team Members</h3>
            <p className="text-gray-600">
              Team members loaded dynamically next.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}


// "use client";

// import { useEffect, useState } from "react";

// type Request = {
//   id: string;
//   volunteer: {
//     id: string;
//     name: string;
//     email: string;
//   } | null;
//   project: {
//     id: string;
//     title: string;
//   } | null;
// };

// export default function MentorRequestsPage() {
//   const [requests, setRequests] = useState<Request[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   async function load() {
//     try {
//       setLoading(true);
//       setError("");

//       // ✅ CORRECT ENDPOINT
//       const res = await fetch("/api/mentorship/request");

//       if (!res.ok) {
//         throw new Error("Failed to load requests");
//       }

//       const data = await res.json();
//       setRequests(data);
//     } catch (err) {
//       setError("Unable to load mentorship requests.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function act(id: string, action: "accept" | "reject") {
//     try {
//       await fetch(`/api/mentorship/${action}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ requestId: id }),
//       });

//       // refresh list
//       await load();
//     } catch (err) {
//       console.error(err);
//       alert("Action failed. Please try again.");
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   return (
//     <main className="p-10 space-y-6">
//       <h1 className="text-3xl font-bold">Mentorship Requests</h1>

//       {loading ? (
//         <p className="text-gray-600">Loading...</p>
//       ) : error ? (
//         <p className="text-red-600">{error}</p>
//       ) : requests.length === 0 ? (
//         <p className="text-gray-600">No pending requests.</p>
//       ) : (
//         <div className="space-y-4">
//           {requests.map((r) => (
//             <div
//               key={r.id}
//               className="bg-white border rounded-xl p-6 flex justify-between items-center"
//             >
//               <div className="space-y-1">
//                 <p className="font-semibold">
//                   {r.project?.title ?? "General Mentorship"}
//                 </p>

//                 {r.volunteer && (
//                   <p className="text-sm text-gray-600">
//                     Requested by {r.volunteer.name} ({r.volunteer.email})
//                   </p>
//                 )}
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={() => act(r.id, "accept")}
//                   className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
//                 >
//                   Accept
//                 </button>

//                 <button
//                   onClick={() => act(r.id, "reject")}
//                   className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
//                 >
//                   Reject
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }



// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";

// export const dynamic = "force-dynamic";

// export default async function MentorRequestsPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "MENTOR") {
//     redirect("/login");
//   }

//   const requests = await prisma.mentorshipRequest.findMany({
//     where: {
//       mentorId: session.user.id,
//     },
//     include: {
//       volunteer: {
//         select: { id: true, name: true, email: true },
//       },
//       project: {
//         include: {
//           chat: true,
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   });

//   return (
//     <main className="p-10 space-y-8">
//       <header>
//         <h1 className="text-3xl font-bold">Mentorship Requests</h1>
//         <p className="text-gray-600 mt-1">
//           Review mentorship requests from volunteers
//         </p>
//       </header>

//       {requests.length === 0 ? (
//         <div className="bg-white border rounded-xl p-10 text-center text-gray-600">
//           No mentorship requests yet.
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {requests.map((req) => (
//             <div
//               key={req.id}
//               className="bg-white border rounded-xl p-6 flex justify-between items-center"
//             >
//               {/* INFO */}
//               <div className="space-y-1">
//                 <h3 className="text-lg font-semibold">
//                   {req.project.title}
//                 </h3>

//                 {req.volunteer && (
//                   <p className="text-sm text-gray-500">
//                     Volunteer: {req.volunteer.name}
//                   </p>
//                 )}

//                 <span
//                   className={`inline-block mt-2 text-xs px-3 py-1 rounded-full ${
//                     req.status === "ACCEPTED"
//                       ? "bg-green-100 text-green-700"
//                       : req.status === "REJECTED"
//                       ? "bg-red-100 text-red-700"
//                       : "bg-yellow-100 text-yellow-700"
//                   }`}
//                 >
//                   {req.status}
//                 </span>
//               </div>

//               {/* ACTIONS */}
//               <div className="flex gap-3">
//                 {/* Chat always available */}
//                 {req.project.chat && (
//                   <a
//                     href={`/dashboard/projects/${req.project.id}/chat`}
//                     className="border px-4 py-2 rounded-lg text-sm"
//                   >
//                     Open Chat
//                   </a>
//                 )}

//                 {req.status === "PENDING" && (
//                   <>
//                     <form
//                       action="/api/mentorship/accept"
//                       method="POST"
//                     >
//                       <input
//                         type="hidden"
//                         name="requestId"
//                         value={req.id}
//                       />
//                       <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
//                         Accept
//                       </button>
//                     </form>

//                     <form
//                       action="/api/mentorship/reject"
//                       method="POST"
//                     >
//                       <input
//                         type="hidden"
//                         name="requestId"
//                         value={req.id}
//                       />
//                       <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
//                         Reject
//                       </button>
//                     </form>
//                   </>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }


import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import MentorRequestCard from "./MentorRequestCard";

export const dynamic = "force-dynamic";

export default async function MentorRequestsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "MENTOR") {
    redirect("/login");
  }

  const requests = await prisma.mentorshipRequest.findMany({
    where: { mentorId: session.user.id },
    include: {
      volunteer: {
        select: { id: true, name: true, email: true },
      },
      project: {
        include: { chat: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-10 space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Mentorship Requests</h1>
        <p className="text-gray-600 mt-1">
          Review mentorship requests from volunteers
        </p>
      </header>

      {requests.length === 0 ? (
        <div className="bg-white border rounded-xl p-10 text-center text-gray-600">
          No mentorship requests yet.
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <MentorRequestCard key={req.id} req={req} />
          ))}
        </div>
      )}
    </main>
  );
}

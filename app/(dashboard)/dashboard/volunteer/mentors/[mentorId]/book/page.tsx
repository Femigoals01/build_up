


// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// type Availability = {
//   id: string;
//   dayOfWeek: string;
//   startTime: string;
//   endTime: string;
// };

// export default function BookMentorPage() {
//   const params = useParams();
//   const mentorId = String(params.mentorId);

//   const [availability, setAvailability] = useState<Availability[]>([]);
//   const [selectedSlot, setSelectedSlot] = useState<Availability | null>(null);
//   const [date, setDate] = useState("");
//   const [note, setNote] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [booking, setBooking] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   async function loadAvailability() {
//     try {
//       setLoading(true);
//       setError("");

//       const res = await fetch(`/api/mentor-availability?mentorId=${mentorId}`);
//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Failed to load mentor availability.");
//       }

//       setAvailability(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     if (mentorId) {
//       loadAvailability();
//     }
//   }, [mentorId]);

//   async function handleBooking(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();

//     setMessage("");
//     setError("");

//     if (!selectedSlot) {
//       setError("Please select an available time slot.");
//       return;
//     }

//     if (!date) {
//       setError("Please select a date for your session.");
//       return;
//     }

//     try {
//       setBooking(true);

//       const res = await fetch("/api/mentor-bookings", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           mentorId,
//           date,
//           startTime: selectedSlot.startTime,
//           endTime: selectedSlot.endTime,
//           note,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Failed to book mentor.");
//       }

//       setMessage("Mentorship session booked successfully.");
//       setSelectedSlot(null);
//       setDate("");
//       setNote("");
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Something went wrong.");
//     } finally {
//       setBooking(false);
//     }
//   }

//   return (
//     <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-4xl">
//         <div className="mb-8">
//           <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
//             Mentor Booking
//           </p>

//           <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//             Book a Mentorship Session
//           </h1>

//           <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
//             Select an available office hour slot and choose the date you want to
//             meet with this mentor.
//           </p>
//         </div>

//         <form
//           onSubmit={handleBooking}
//           className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
//         >
//           <div>
//             <h2 className="text-lg font-bold text-slate-900">
//               Available Time Slots
//             </h2>

//             <p className="mt-1 text-sm text-slate-500">
//               Choose one of the mentor’s available office hours.
//             </p>
//           </div>

//           <div className="mt-6">
//             {loading ? (
//               <div className="rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500">
//                 Loading availability...
//               </div>
//             ) : availability.length === 0 ? (
//               <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
//                 <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
//                   🗓️
//                 </div>

//                 <h3 className="mt-4 text-base font-bold text-slate-900">
//                   No availability yet
//                 </h3>

//                 <p className="mt-2 text-sm text-slate-500">
//                   This mentor has not added office hours yet.
//                 </p>
//               </div>
//             ) : (
//               <div className="grid gap-3 sm:grid-cols-2">
//                 {availability.map((slot) => {
//                   const active = selectedSlot?.id === slot.id;

//                   return (
//                     <button
//                       key={slot.id}
//                       type="button"
//                       onClick={() => setSelectedSlot(slot)}
//                       className={`rounded-2xl border p-4 text-left transition ${
//                         active
//                           ? "border-blue-500 bg-blue-50 ring-4 ring-blue-100"
//                           : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-white"
//                       }`}
//                     >
//                       <p className="text-sm font-bold text-slate-900">
//                         {slot.dayOfWeek}
//                       </p>

//                       <p className="mt-1 text-sm font-semibold text-slate-600">
//                         {slot.startTime} - {slot.endTime}
//                       </p>
//                     </button>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           <div className="mt-6 grid gap-5 sm:grid-cols-2">
//             <div>
//               <label className="mb-2 block text-sm font-semibold text-slate-700">
//                 Session Date
//               </label>

//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
//               />
//             </div>

//             <div>
//               <label className="mb-2 block text-sm font-semibold text-slate-700">
//                 Selected Slot
//               </label>

//               <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
//                 {selectedSlot
//                   ? `${selectedSlot.dayOfWeek}, ${selectedSlot.startTime} - ${selectedSlot.endTime}`
//                   : "No slot selected"}
//               </div>
//             </div>
//           </div>

//           <div className="mt-5">
//             <label className="mb-2 block text-sm font-semibold text-slate-700">
//               Note to Mentor
//             </label>

//             <textarea
//               value={note}
//               onChange={(e) => setNote(e.target.value)}
//               rows={5}
//               placeholder="Briefly describe what you need help with..."
//               className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
//             />
//           </div>

//           {error && (
//             <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
//               {error}
//             </div>
//           )}

//           {message && (
//             <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
//               {message}
//             </div>
//           )}

//           <div className="mt-6 flex justify-end">
//             <button
//               type="submit"
//               disabled={booking || availability.length === 0}
//               className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//             >
//               {booking ? "Booking..." : "Book Session"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </main>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Availability = {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
};

type Project = {
  id: string;
  title: string;
};

export default function BookMentorPage() {
  const params = useParams();
  const mentorId = String(params.mentorId);

  const [availability, setAvailability] = useState<Availability[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Availability | null>(null);
  const [projectId, setProjectId] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadAvailability() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/mentor-availability?mentorId=${mentorId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load mentor availability.");
      }

      setAvailability(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function loadProjects() {
    try {
      setLoadingProjects(true);

      const res = await fetch("/api/volunteer/projects");
      const data = await res.json();

      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load volunteer projects:", err);
      setProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  }

  useEffect(() => {
    if (mentorId) {
      loadAvailability();
      loadProjects();
    }
  }, [mentorId]);

  async function handleBooking(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!projectId) {
      setError("Please select the project this mentorship session is for.");
      return;
    }

    if (!selectedSlot) {
      setError("Please select an available time slot.");
      return;
    }

    if (!date) {
      setError("Please select a date for your session.");
      return;
    }

    try {
      setBooking(true);

      const res = await fetch("/api/mentor-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mentorId,
          projectId,
          date,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          note,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to book mentor.");
      }

      setMessage("Mentorship session booked successfully.");
      setSelectedSlot(null);
      setProjectId("");
      setDate("");
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBooking(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Mentor Booking
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Book a Mentorship Session
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Select a project, choose an available slot, and book your session
            with this mentor.
          </p>
        </div>

        <form
          onSubmit={handleBooking}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Booking Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Link this session to a project so you can review the mentor after
              completion.
            </p>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Select Project
            </label>

            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              disabled={loadingProjects}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {loadingProjects ? "Loading projects..." : "Select a project"}
              </option>

              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>

            {!loadingProjects && projects.length === 0 && (
              <p className="mt-2 text-sm font-semibold text-amber-700">
                You need an active project before booking a mentor session.
              </p>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-bold text-slate-900">
              Available Time Slots
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose one of the mentor’s available office hours.
            </p>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500">
                Loading availability...
              </div>
            ) : availability.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                  🗓️
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-900">
                  No availability yet
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  This mentor has not added office hours yet.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {availability.map((slot) => {
                  const active = selectedSlot?.id === slot.id;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-blue-500 bg-blue-50 ring-4 ring-blue-100"
                          : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-white"
                      }`}
                    >
                      <p className="text-sm font-bold text-slate-900">
                        {slot.dayOfWeek}
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-600">
                        {slot.startTime} - {slot.endTime}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Session Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Selected Slot
              </label>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
                {selectedSlot
                  ? `${selectedSlot.dayOfWeek}, ${selectedSlot.startTime} - ${selectedSlot.endTime}`
                  : "No slot selected"}
              </div>
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Note to Mentor
            </label>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={5}
              placeholder="Briefly describe what you need help with..."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {message}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={booking || availability.length === 0 || projects.length === 0}
              className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {booking ? "Booking..." : "Book Session"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
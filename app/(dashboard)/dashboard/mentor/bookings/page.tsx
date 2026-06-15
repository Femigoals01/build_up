





// "use client";

// import { useEffect, useState } from "react";

// type Booking = {
//   id: string;
//   date: string;
//   startTime: string;
//   endTime: string;
//   status: string;
//   meetingLink?: string | null;
//   note?: string | null;
//   createdAt: string;
//   volunteer: {
//     id: string;
//     name: string;
//     email: string;
//     headline?: string | null;
//     profileImageUrl?: string | null;
//   };
//   project?: {
//     id: string;
//     title: string;
//   } | null;
// };

// function formatDate(date: string) {
//   return new Intl.DateTimeFormat("en", {
//     weekday: "long",
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   }).format(new Date(date));
// }

// function statusStyle(status: string) {
//   if (status === "CONFIRMED") {
//     return "bg-emerald-50 text-emerald-700 border-emerald-200";
//   }

//   if (status === "CANCELLED") {
//     return "bg-red-50 text-red-700 border-red-200";
//   }

//   return "bg-amber-50 text-amber-700 border-amber-200";
// }

// export default function MentorBookingsPage() {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [updatingId, setUpdatingId] = useState("");
//   const [meetingLinks, setMeetingLinks] = useState<Record<string, string>>({});
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   async function loadBookings() {
//     try {
//       setLoading(true);
//       setError("");

//       const res = await fetch("/api/mentor-bookings");
//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Failed to load bookings.");
//       }

//       setBookings(data);

//       const links: Record<string, string> = {};

//       data.forEach((booking: Booking) => {
//         links[booking.id] = booking.meetingLink || "";
//       });

//       setMeetingLinks(links);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadBookings();
//   }, []);

//   async function updateBooking(
//     bookingId: string,
//     status: "PENDING" | "CONFIRMED" | "CANCELLED"
//   ) {
//     try {
//       setUpdatingId(bookingId);
//       setError("");
//       setMessage("");

//       const res = await fetch("/api/mentor-bookings", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           bookingId,
//           status,
//           meetingLink: meetingLinks[bookingId] || null,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Failed to update booking.");
//       }

//       setMessage("Booking updated successfully.");
//       await loadBookings();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Something went wrong.");
//     } finally {
//       setUpdatingId("");
//     }
//   }

//   return (
//     <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-6xl">
//         <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
//           <div>
//             <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
//               Mentor Bookings
//             </p>

//             <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//               Session Requests
//             </h1>

//             <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
//               Confirm, cancel, and manage mentorship sessions booked by
//               volunteers.
//             </p>
//           </div>

//           <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
//             <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
//               Total Bookings
//             </p>

//             <p className="mt-1 text-2xl font-bold text-slate-900">
//               {bookings.length}
//             </p>
//           </div>
//         </div>

//         {error && (
//           <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
//             {error}
//           </div>
//         )}

//         {message && (
//           <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
//             {message}
//           </div>
//         )}

//         {loading ? (
//           <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm font-semibold text-slate-500 shadow-sm">
//             Loading mentor bookings...
//           </div>
//         ) : bookings.length === 0 ? (
//           <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
//             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-3xl">
//               📅
//             </div>

//             <h2 className="mt-5 text-lg font-bold text-slate-900">
//               No bookings yet
//             </h2>

//             <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
//               When volunteers book mentorship sessions with you, their requests
//               will appear here.
//             </p>
//           </div>
//         ) : (
//           <div className="grid gap-4">
//             {bookings.map((booking) => (
//               <article
//                 key={booking.id}
//                 className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
//               >
//                 <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
//                   <div className="flex gap-4">
//                     <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-lg font-bold text-blue-700">
//                       {booking.volunteer.name.charAt(0).toUpperCase()}
//                     </div>

//                     <div>
//                       <div className="flex flex-wrap items-center gap-2">
//                         <h2 className="text-lg font-bold text-slate-900">
//                           {booking.volunteer.name}
//                         </h2>

//                         <span
//                           className={`rounded-full border px-3 py-1 text-xs font-bold ${statusStyle(
//                             booking.status
//                           )}`}
//                         >
//                           {booking.status}
//                         </span>
//                       </div>

//                       <p className="mt-1 text-sm text-slate-500">
//                         {booking.volunteer.email}
//                       </p>

//                       {booking.volunteer.headline && (
//                         <p className="mt-1 text-sm font-medium text-slate-600">
//                           {booking.volunteer.headline}
//                         </p>
//                       )}

//                       {booking.project && (
//                         <p className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
//                           Project: {booking.project.title}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="rounded-2xl bg-slate-50 p-4 lg:min-w-[260px]">
//                     <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
//                       Session Time
//                     </p>

//                     <p className="mt-2 text-sm font-bold text-slate-900">
//                       {formatDate(booking.date)}
//                     </p>

//                     <p className="mt-1 text-sm font-semibold text-slate-600">
//                       {booking.startTime} - {booking.endTime}
//                     </p>
//                   </div>
//                 </div>

//                 {booking.note && (
//                   <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
//                     <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
//                       Volunteer Note
//                     </p>

//                     <p className="mt-2 text-sm leading-6 text-slate-700">
//                       {booking.note}
//                     </p>
//                   </div>
//                 )}

//                 <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
//                   <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
//                     Meeting Link
//                   </label>

//                   <input
//                     type="url"
//                     value={meetingLinks[booking.id] || ""}
//                     onChange={(e) =>
//                       setMeetingLinks((prev) => ({
//                         ...prev,
//                         [booking.id]: e.target.value,
//                       }))
//                     }
//                     placeholder="https://meet.google.com/..."
//                     className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
//                   />

//                   {booking.meetingLink && (
//                     <a
//                       href={booking.meetingLink}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="mt-3 inline-flex text-sm font-bold text-blue-600 hover:text-blue-700"
//                     >
//                       Open current meeting link
//                     </a>
//                   )}
//                 </div>

//                 <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
//                   <button
//                     type="button"
//                     disabled={updatingId === booking.id}
//                     onClick={() => updateBooking(booking.id, "CONFIRMED")}
//                     className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
//                   >
//                     {updatingId === booking.id ? "Updating..." : "Confirm"}
//                   </button>

//                   <button
//                     type="button"
//                     disabled={updatingId === booking.id}
//                     onClick={() => updateBooking(booking.id, "PENDING")}
//                     className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
//                   >
//                     Mark Pending
//                   </button>

//                   <button
//                     type="button"
//                     disabled={updatingId === booking.id}
//                     onClick={() => updateBooking(booking.id, "CANCELLED")}
//                     className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </article>
//             ))}
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }




"use client";

import { useEffect, useState } from "react";

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

type Booking = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  meetingLink?: string | null;
  note?: string | null;
  createdAt: string;
  volunteer: {
    id: string;
    name: string;
    email: string;
    headline?: string | null;
    profileImageUrl?: string | null;
  };
  project?: {
    id: string;
    title: string;
  } | null;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}


function normalizeUrl(url?: string | null) {
  if (!url) return "#";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `https://${url}`;
}

function statusStyle(status: string) {
  if (status === "CONFIRMED") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (status === "COMPLETED") {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  if (status === "CANCELLED") {
    return "bg-red-50 text-red-700 border-red-200";
  }

  return "bg-amber-50 text-amber-700 border-amber-200";
}

export default function MentorBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [meetingLinks, setMeetingLinks] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadBookings() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/mentor-bookings");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load bookings.");
      }

      setBookings(data);

      const links: Record<string, string> = {};

      data.forEach((booking: Booking) => {
        links[booking.id] = booking.meetingLink || "";
      });

      setMeetingLinks(links);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function updateBooking(bookingId: string, status: BookingStatus) {
    try {
      setUpdatingId(bookingId);
      setError("");
      setMessage("");

      const res = await fetch("/api/mentor-bookings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          status,
          meetingLink: meetingLinks[bookingId] || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update booking.");
      }

      setMessage("Booking updated successfully.");
      await loadBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Mentor Bookings
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Session Requests
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Confirm, complete, cancel, and manage mentorship sessions booked
              by volunteers.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Total Bookings
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {bookings.length}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {message}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm font-semibold text-slate-500 shadow-sm">
            Loading mentor bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-3xl">
              📅
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              No bookings yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              When volunteers book mentorship sessions with you, their requests
              will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-lg font-bold text-blue-700">
                      {booking.volunteer.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900">
                          {booking.volunteer.name}
                        </h2>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${statusStyle(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {booking.volunteer.email}
                      </p>

                      {booking.volunteer.headline && (
                        <p className="mt-1 text-sm font-medium text-slate-600">
                          {booking.volunteer.headline}
                        </p>
                      )}

                      {booking.project && (
                        <p className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                          Project: {booking.project.title}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 lg:min-w-[260px]">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      Session Time
                    </p>

                    <p className="mt-2 text-sm font-bold text-slate-900">
                      {formatDate(booking.date)}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-600">
                      {booking.startTime} - {booking.endTime}
                    </p>
                  </div>
                </div>

                {booking.note && (
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      Volunteer Note
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {booking.note}
                    </p>
                  </div>
                )}

                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Meeting Link
                  </label>

                  <input
                    type="url"
                    value={meetingLinks[booking.id] || ""}
                    onChange={(e) =>
                      setMeetingLinks((prev) => ({
                        ...prev,
                        [booking.id]: e.target.value,
                      }))
                    }
                    placeholder="https://meet.google.com/..."
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  {booking.meetingLink && (
                    <a
                    //   href={booking.meetingLink}
                    href={normalizeUrl(booking.meetingLink)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex text-sm font-bold text-blue-600 hover:text-blue-700"
                    >
                      Open current meeting link
                    </a>
                  )}
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <button
                    type="button"
                    disabled={updatingId === booking.id}
                    onClick={() => updateBooking(booking.id, "CONFIRMED")}
                    className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updatingId === booking.id ? "Updating..." : "Confirm"}
                  </button>

                  <button
                    type="button"
                    disabled={updatingId === booking.id}
                    onClick={() => updateBooking(booking.id, "COMPLETED")}
                    className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updatingId === booking.id
                      ? "Updating..."
                      : "Mark Completed"}
                  </button>

                  <button
                    type="button"
                    disabled={updatingId === booking.id}
                    onClick={() => updateBooking(booking.id, "PENDING")}
                    className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Mark Pending
                  </button>

                  <button
                    type="button"
                    disabled={updatingId === booking.id}
                    onClick={() => updateBooking(booking.id, "CANCELLED")}
                    className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
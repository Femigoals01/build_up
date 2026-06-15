


// "use client";

// import Link from "next/link";
// import { useSession } from "next-auth/react";
// import { useState } from "react";

// export default function OpportunityLeadForm({
//   opportunityId,
//   applicationUrl,
// }: {
//   opportunityId: string;
//   applicationUrl?: string | null;
// }) {
//   const { data: session, status } = useSession();

//   const [phone, setPhone] = useState("");
//   const [message, setMessage] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

//   const isLoggedIn = Boolean(session?.user?.id);

//   async function submitLead(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();

//     if (!isLoggedIn) {
//       setError("Please login or create a BuildUp account to send interest.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setSuccess("");
//       setError("");

//       const res = await fetch("/api/opportunity-leads", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           opportunityId,
//           phone,
//           message,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Failed to submit interest.");
//       }

//       setSuccess("Your interest has been sent successfully.");
//       setPhone("");
//       setMessage("");
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
//       <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
//         Interested?
//       </p>

//       <h2 className="mt-2 text-xl font-black text-slate-900">
//         Contact Organization
//       </h2>

//       {status === "loading" ? (
//         <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm font-bold text-slate-500">
//           Checking your BuildUp account...
//         </div>
//       ) : !isLoggedIn ? (
//         <div className="mt-5 rounded-[24px] border border-blue-100 bg-blue-50 p-5">
//           <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
//             🔐
//           </div>

//           <h3 className="mt-4 text-lg font-black text-blue-950">
//             Login required
//           </h3>

//           <p className="mt-2 text-sm leading-6 text-blue-700">
//             To send interest to this organization, you need to login or create a
//             free BuildUp account. This helps organizations know they are
//             receiving genuine leads from real BuildUp users.
//           </p>

//           <div className="mt-5 grid gap-3">
//             <Link
//               href={`/login?callbackUrl=/marketplace/${opportunityId}`}
//               className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700"
//             >
//               Login to Send Interest
//             </Link>

//             <Link
//               href={`/register?callbackUrl=/marketplace/${opportunityId}`}
//               className="inline-flex h-11 items-center justify-center rounded-2xl border border-blue-200 bg-white px-5 text-sm font-black text-blue-700 transition hover:bg-blue-50"
//             >
//               Create BuildUp Account
//             </Link>
//           </div>
//         </div>
//       ) : (
//         <form onSubmit={submitLead} className="mt-5 space-y-3">
//           <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
//             <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-600">
//               Sending as
//             </p>

//             <p className="mt-1 text-sm font-black text-emerald-800">
//               {session?.user?.name || session?.user?.email || "BuildUp User"}
//             </p>
//           </div>

//           <input
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             placeholder="Phone number optional"
//             className="input"
//           />

//           <textarea
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             rows={4}
//             placeholder="Write a short message..."
//             className="input resize-none"
//           />

//           {success && (
//             <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
//               {success}
//             </div>
//           )}

//           {error && (
//             <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
//               {error}
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="h-11 w-full rounded-2xl bg-blue-600 text-sm font-black text-white transition hover:bg-blue-700 disabled:opacity-60"
//           >
//             {loading ? "Sending..." : "Send Interest"}
//           </button>

//           {applicationUrl && (
//             <a
//               href={applicationUrl}
//               target="_blank"
//               rel="noreferrer"
//               className="flex h-11 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:bg-slate-50"
//             >
//               Visit External Link
//             </a>
//           )}
//         </form>
//       )}

//       <style jsx>{`
//         .input {
//           width: 100%;
//           border-radius: 1rem;
//           border: 1px solid rgb(226 232 240);
//           padding: 0.8rem 1rem;
//           font-size: 0.875rem;
//           font-weight: 600;
//           outline: none;
//         }

//         .input:focus {
//           border-color: rgb(59 130 246);
//           box-shadow: 0 0 0 4px rgb(219 234 254);
//         }
//       `}</style>
//     </section>
//   );
// }




"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function OpportunityLeadForm({
  opportunityId,
  opportunityType,
  applicationUrl,
}: {
  opportunityId: string;
  opportunityType: string;
  applicationUrl?: string | null;
}) {
  const { data: session, status } = useSession();

  const isJob = opportunityType === "JOB";
  const isLoggedIn = Boolean(session?.user?.id);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function submitLead(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isJob && !isLoggedIn) {
      setError("Please login or create a BuildUp account to apply for this job.");
      return;
    }

    try {
      setLoading(true);
      setSuccess("");
      setError("");

      const res = await fetch("/api/opportunity-leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          opportunityId,
          name,
          email,
          phone,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setSuccess(
        isJob
          ? "Your job application has been sent successfully."
          : "Your request has been sent successfully."
      );

      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
        {isJob ? "Apply Now" : "Interested?"}
      </p>

      <h2 className="mt-2 text-xl font-black text-slate-900">
        {isJob ? "Apply for this Job" : "Contact Organization"}
      </h2>

      {status === "loading" ? (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm font-bold text-slate-500">
          Checking your BuildUp account...
        </div>
      ) : isJob && !isLoggedIn ? (
        <div className="mt-5 rounded-[24px] border border-blue-100 bg-blue-50 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
            🔐
          </div>

          <h3 className="mt-4 text-lg font-black text-blue-950">
            Login required
          </h3>

          <p className="mt-2 text-sm leading-6 text-blue-700">
            To apply for this job, you need to login or create a free BuildUp
            account. This helps organizations receive traceable and genuine job
            applications.
          </p>

          <div className="mt-5 grid gap-3">
            <Link
              href={`/login?callbackUrl=/marketplace/${opportunityId}`}
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700"
            >
              Login to Apply
            </Link>

            <Link
              href={`/register?callbackUrl=/marketplace/${opportunityId}`}
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-blue-200 bg-white px-5 text-sm font-black text-blue-700 transition hover:bg-blue-50"
            >
              Create BuildUp Account
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={submitLead} className="mt-5 space-y-3">
          {isLoggedIn ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-600">
                Sending as
              </p>

              <p className="mt-1 text-sm font-black text-emerald-800">
                {session?.user?.name || session?.user?.email || "BuildUp User"}
              </p>
            </div>
          ) : (
            <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="input"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="input"
              />
            </>
          )}

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number optional"
            className="input"
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder={
              isJob
                ? "Write a short application message..."
                : "Write a short request..."
            }
            className="input resize-none"
          />

          {success && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              {success}
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-2xl bg-blue-600 text-sm font-black text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Sending..." : isJob ? "Apply Now" : "Send Request"}
          </button>

          {applicationUrl && (
            <a
              href={applicationUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-11 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              Visit External Link
            </a>
          )}
        </form>
      )}

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgb(226 232 240);
          padding: 0.8rem 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          outline: none;
        }

        .input:focus {
          border-color: rgb(59 130 246);
          box-shadow: 0 0 0 4px rgb(219 234 254);
        }
      `}</style>
    </section>
  );
}
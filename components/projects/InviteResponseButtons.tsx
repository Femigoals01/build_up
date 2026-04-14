



// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// type Props = {
//   applicationId: string;
//   onDone?: (action: "accept" | "decline") => void;
// };

// export default function InviteResponseButtons({
//   applicationId,
//   onDone,
// }: Props) {
//   const router = useRouter();

//   const [loadingAction, setLoadingAction] = useState<"accept" | "decline" | null>(null);
//   const [error, setError] = useState("");

//   const respond = async (action: "accept" | "decline") => {
//     try {
//       setError("");
//       setLoadingAction(action);

//       const res = await fetch(
//         `/api/applications/${applicationId}/respond-invite`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ action }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data?.error || "Unable to process invite.");
//         setLoadingAction(null);
//         return;
//       }

//       onDone?.(action);
//       router.refresh();
//     } catch (err) {
//       console.error("Invite response error:", err);
//       setError("Something went wrong.");
//     } finally {
//       setLoadingAction(null);
//     }
//   };

//   return (
//     <div className="mt-4 space-y-3">
//       {error && (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       <div className="flex flex-wrap gap-3">
//         <button
//           type="button"
//           onClick={() => respond("accept")}
//           disabled={loadingAction !== null}
//           className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
//         >
//           {loadingAction === "accept" ? "Accepting..." : "Accept Invite"}
//         </button>

//         <button
//           type="button"
//           onClick={() => respond("decline")}
//           disabled={loadingAction !== null}
//           className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
//         >
//           {loadingAction === "decline" ? "Declining..." : "Decline Invite"}
//         </button>
//       </div>
//     </div>
//   );
// }




// "use client";

// import { useState } from "react";

// type Props = {
//   applicationId: string;
//   onDone?: (action: "accept" | "decline") => void;
// };

// export default function InviteResponseButtons({
//   applicationId,
//   onDone,
// }: Props) {
//   const [loadingAction, setLoadingAction] = useState<"accept" | "decline" | null>(null);
//   const [error, setError] = useState("");

//   const respond = async (action: "accept" | "decline") => {
//     try {
//       setError("");
//       setLoadingAction(action);

//       const res = await fetch(
//         `/api/applications/${applicationId}/respond-invite`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ action }),
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data?.error || "Unable to process invite.");
//         setLoadingAction(null);
//         return;
//       }

//       onDone?.(action);
//     } catch (err) {
//       console.error("Invite response error:", err);
//       setError("Something went wrong.");
//     } finally {
//       setLoadingAction(null);
//     }
//   };

//   return (
//     <div className="mt-4 space-y-3">
//       {error && (
//         <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
//           {error}
//         </div>
//       )}

//       <div className="flex flex-wrap gap-3">
//         <button
//           type="button"
//           onClick={() => respond("accept")}
//           disabled={loadingAction !== null}
//           className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
//         >
//           {loadingAction === "accept" ? "Accepting..." : "Accept Invite"}
//         </button>

//         <button
//           type="button"
//           onClick={() => respond("decline")}
//           disabled={loadingAction !== null}
//           className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
//         >
//           {loadingAction === "decline" ? "Declining..." : "Decline Invite"}
//         </button>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";

type Props = {
  applicationId: string;
  onDone?: (action: "accept" | "decline") => void;
};

export default function InviteResponseButtons({
  applicationId,
  onDone,
}: Props) {
  const [loadingAction, setLoadingAction] = useState<"accept" | "decline" | null>(null);
  const [error, setError] = useState("");

  const respond = async (action: "accept" | "decline") => {
    try {
      setError("");
      setLoadingAction(action);

      const res = await fetch(
        `/api/applications/${applicationId}/respond-invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Unable to process invite.");
        return;
      }

      onDone?.(action);
    } catch (err) {
      console.error("Invite response error:", err);
      setError("Something went wrong.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => respond("accept")}
          disabled={loadingAction !== null}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingAction === "accept" ? "Accepting..." : "Accept Invite"}
        </button>

        <button
          type="button"
          onClick={() => respond("decline")}
          disabled={loadingAction !== null}
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingAction === "decline" ? "Declining..." : "Decline Invite"}
        </button>
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";

// type Props = {
//   applicationId: string;
//   name: string;
//   email: string;
//   status: string;
// };

// export default function ApplicantCard({
//   applicationId,
//   name,
//   email,
//   status,
// }: Props) {
//   const [currentStatus, setCurrentStatus] = useState(status);
//   const [loading, setLoading] = useState(false);

//   const updateStatus = async (newStatus: "ACCEPTED" | "REJECTED") => {
//     setLoading(true);

//     await fetch(`/api/applications/${applicationId}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ status: newStatus }),
//     });

//     setCurrentStatus(newStatus);
//     setLoading(false);
//   };

//   return (
//     <div className="border rounded-lg p-4 flex justify-between items-center">
//       <div>
//         <p className="font-semibold">{name}</p>
//         <p className="text-sm text-gray-500">{email}</p>
//       </div>

//       <div className="flex items-center gap-3">
//         <span className="text-sm font-semibold text-gray-600">
//           {currentStatus}
//         </span>

//         {currentStatus === "PENDING" && (
//           <>
//             <button
//               onClick={() => updateStatus("ACCEPTED")}
//               disabled={loading}
//               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//             >
//               Accept
//             </button>

//             <button
//               onClick={() => updateStatus("REJECTED")}
//               disabled={loading}
//               className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//             >
//               Reject
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";

type Props = {
  applicationId: string;
  name: string;
  email: string;
  status: string;
};

export default function ApplicantCard({
  applicationId,
  name,
  email,
  status,
}: Props) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: "ACCEPTED" | "REJECTED") => {
    setLoading(true);

    const res = await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      // Let the server refresh handle the state
      window.location.reload(); // Temporary reload to see changes immediately
    } else {
      alert("Failed to update status");
    }

    setLoading(false);
  };

  return (
    <div className="border rounded-lg p-4 flex justify-between items-center">
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-500">{email}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-600">
          {currentStatus}
        </span>

        {currentStatus === "PENDING" && (
          <>
            <button
              onClick={() => updateStatus("ACCEPTED")}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Accept
            </button>

            <button
              onClick={() => updateStatus("REJECTED")}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
}

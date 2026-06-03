



// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import CertificateActions from "@/components/certificates/CertificateActions";
// import QRCode from "react-qr-code";

// export const dynamic = "force-dynamic";

// function formatCertificateSkills(skillsSummary?: string | null) {
//   if (!skillsSummary) return "";

//   const skills = skillsSummary
//     .split(",")
//     .map((skill) => skill.trim())
//     .filter(Boolean);

//   const topSkills = skills.slice(0, 6);
//   const remaining = skills.length - topSkills.length;

//   return remaining > 0
//     ? `${topSkills.join(" • ")} • +${remaining} more`
//     : topSkills.join(" • ");
// }

// export default async function CertificatesPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
//     redirect("/login");
//   }

//   const certificate = await prisma.certificate.findFirst({
//     where: {
//       volunteerId: session.user.id,
//     },
//     include: {
//       volunteer: {
//         select: {
//           name: true,
//           username: true,
//             profileImageUrl: true,
//         },
//       },
//     },
//     orderBy: {
//       issuedAt: "desc",
//     },
//   });

//   const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

//   if (!certificate) {
//     return (
//       <main className="min-h-screen bg-slate-50 px-4 py-8">
//         <div className="mx-auto max-w-4xl rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
//           <h1 className="text-2xl font-black text-slate-900">
//             No certificate yet
//           </h1>

//           <p className="mt-3 text-sm leading-6 text-slate-500">
//             Your BuildUp certificate will appear here after your first completed
//             and approved project.
//           </p>
//         </div>
//       </main>
//     );
//   }

//   const verifyUrl = `${appUrl}/verify/${certificate.certificateNo}`;

//   return (
//     // <main className="min-h-screen bg-slate-100 px-4 py-8 print:bg-white">
//     // <main className="min-h-screen bg-slate-100 px-4 py-8 print:bg-white print:p-0">
//     <main className="min-h-screen bg-slate-100 px-4 py-8 print:bg-white print:p-0">
//       <div className="mx-auto max-w-6xl space-y-6">
//         <div className="flex flex-col gap-4 print:hidden md:flex-row md:items-center md:justify-between">
//           <div>
//             <h1 className="text-2xl font-black text-slate-900">
//               My Certificate
//             </h1>

//             <p className="mt-1 text-sm text-slate-500">
//               Print, save as PDF, or share your verification link.
//             </p>
//           </div>

//           <CertificateActions verifyUrl={verifyUrl} />
//         </div>

//         {/* <section className="relative overflow-hidden rounded-[34px] border-[10px] border-blue-900 bg-white px-10 py-12 shadow-2xl print:shadow-none"> */}
//             {/* <section className="certificate-wrapper relative overflow-hidden rounded-[34px] border-[10px] border-blue-900 bg-white px-10 py-12 shadow-2xl print:rounded-none print:border-[8px] print:shadow-none"> */}
          
//           {/* <section className="relative overflow-hidden rounded-[34px] border-[8px] border-blue-900 bg-white px-8 py-8 shadow-2xl print:min-h-screen print:rounded-none print:border-[6px] print:px-8 print:py-6 print:shadow-none"> */}
          
//           <section className="certificate-wrapper relative overflow-hidden rounded-[34px] border-[8px] border-blue-900 bg-white px-8 py-8 shadow-2xl print:min-h-screen print:rounded-none print:border-[6px] print:px-8 print:py-6 print:shadow-none">
//           <div className="absolute inset-4 rounded-[24px] border-2 border-yellow-400" />

//           <div className="relative z-10 text-center">
//             {/* <div className="mx-auto mb-8 flex justify-center">
//               <img
//                 src="/brand/buildup-logo.png"
//                 alt="BuildUp Logo"
//                 className="h-10 w-auto object-contain"
//               />
//             </div> */}

//             <div className="mx-auto mb-4 flex flex-col items-center justify-center">
//   <img
//     src="/brand/buildup-logo.png"
//     alt="BuildUp Logo"
//     className="h-10 w-auto object-contain"
//   />

//   <p className="mt-2 text-sm font-black text-slate-900">
//     BuildUp
//   </p>
// </div>


// {certificate.volunteer.profileImageUrl ? (
//   <img
//     src={certificate.volunteer.profileImageUrl}
//     alt={certificate.volunteer.name || "Volunteer"}
//     className="mx-auto mb-4 h-16 w-16 rounded-full border-4 border-blue-100 object-cover shadow-md"
//   />
// ) : null}

//             {/* <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-700"> */}
//             <p className="text-xs font-black uppercase tracking-[0.35em] text-blue-700">
//               Certificate of Verified Experience
//             </p>

//             {/* <h2 className="mt-8 text-5xl font-black tracking-tight text-slate-950"> */}
//             {/* <h2 className="mt-8 text-6xl font-black tracking-tight text-slate-950"> */}
//             <h2 className="mt-4 text-5xl font-black tracking-tight text-slate-950 print:text-4xl">
//               {certificate.volunteer.name}
//             </h2>

//             {/* <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-600"> */}
//             <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-slate-600 print:text-sm print:leading-6">
//               This certificate is proudly awarded in recognition of verified
//               real-world project experience completed through the BuildUp
//               platform.
//             </p>

//             {/* <div className="mx-auto mt-10 grid max-w-3xl gap-4 md:grid-cols-2"> */}
//             <div className="mx-auto mt-5 grid max-w-3xl gap-4 md:grid-cols-2">
//               <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
//                 {/* <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
//                   Completed Projects
//                 </p> */}

//                 <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
//   Verified Projects Completed
// </p>
//                 <p className="mt-2 text-3xl font-black text-blue-700">
//                   {certificate.completedProjectsCount}
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
//                 <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
//                   Certificate No.
//                 </p>
//                 <p className="mt-2 text-lg font-black text-slate-900">
//                   {certificate.certificateNo}
//                 </p>
//               </div>
//             </div>

//             {/* {certificate.skillsSummary ? (
//               <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-blue-100 bg-blue-50 p-5">
//                 <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">
//                   Skills Demonstrated
//                 </p>

//                 <p className="mt-3 text-sm leading-7 text-blue-900">
//                   {certificate.skillsSummary}
//                 </p>
//               </div>
//             ) : null} */}

//             {certificate.skillsSummary ? (
//   <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-blue-100 bg-blue-50 p-5">
//     <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">
//       Primary Skills
//     </p>

//     <p className="mt-3 text-base font-medium text-blue-900">
//       {certificate.skillsSummary
//         .split(",")
//         .map((s) => s.trim())
//         .filter(Boolean)
//         .slice(0, 6)
//         .join(" • ")}
//     </p>
//   </div>
// ) : null}

// {/* {certificate.skillsSummary ? (
//   <div className="mx-auto mt-5 max-w-4xl rounded-2xl border border-blue-100 bg-blue-50 p-4">
//     <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">
//       Primary Skills
//     </p>

//     <p className="mt-2 text-sm font-medium leading-6 text-blue-900">
//       {formatCertificateSkills(certificate.skillsSummary)}
//     </p>
//   </div>
// ) : null} */}

//             {/* <div className="mt-12 flex flex-col items-center justify-between gap-8 md:flex-row"> */}
//             <div className="mt-6 grid grid-cols-3 items-end gap-4">
//               <div className="text-left">
//                 <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
//                   Issued Date
//                 </p>
//                 <p className="mt-2 font-bold text-slate-900">
//                   {new Date(certificate.issuedAt).toLocaleDateString("en-GB", {
//                     day: "numeric",
//                     month: "long",
//                     year: "numeric",
//                   })}
//                 </p>
//               </div>

//               {/* <div className="text-center">
//                 <div className="mx-auto h-px w-48 bg-slate-900" />
//                 <p className="mt-3 text-sm font-bold text-slate-900">
//                   BuildUp Verification
//                 </p>
//               </div> */}

//               {/* <div className="text-center">
//   <div className="rounded-xl bg-white p-2 shadow-sm">
//     <QRCode
//       value={verifyUrl}
//       size={90}
//     />
//   </div>

//   <p className="mt-3 text-sm font-bold text-slate-900">
//     Scan to Verify
//   </p>
// </div> */}

// <div className="flex flex-col items-center text-center">
//   <div className="rounded-xl bg-white p-2 shadow-sm">
//     <QRCode value={verifyUrl} size={76} />
//   </div>

//   <p className="mt-2 text-xs font-bold text-slate-900">
//     Scan to Verify
//   </p>
// </div>

//               <div className="text-right">
//                 <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
//                   Verify
//                 </p>
//                 {/* <p className="mt-2 max-w-xs break-all text-sm font-semibold text-blue-700">
//                   {verifyUrl}
//                 </p> */}

//      <p className="mt-2 text-xs font-bold text-slate-900">
//   Scan QR or visit verification page
// </p>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }





import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import CertificateActions from "@/components/certificates/CertificateActions";
import QRCode from "react-qr-code";

export const dynamic = "force-dynamic";

function formatCertificateSkills(skillsSummary?: string | null) {
  if (!skillsSummary) return "";

  const skills = skillsSummary
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  const topSkills = skills.slice(0, 6);
  const remaining = skills.length - topSkills.length;

  return remaining > 0
    ? `${topSkills.join(" • ")} • +${remaining} more`
    : topSkills.join(" • ");
}

export default async function CertificatesPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
    redirect("/login");
  }

  const certificate = await prisma.certificate.findFirst({
    where: { volunteerId: session.user.id },
    include: {
      volunteer: {
        select: {
          name: true,
          username: true,
          profileImageUrl: true,
        },
      },
    },
    orderBy: { issuedAt: "desc" },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!certificate) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h1 className="text-2xl font-black text-slate-900">
            No certificate yet
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Your BuildUp certificate will appear here after your first completed
            and approved project.
          </p>
        </div>
      </main>
    );
  }

  const verifyUrl = `${appUrl}/verify/${certificate.certificateNo}`;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-6xl space-y-6 print:max-w-full print:space-y-0">
        <div className="flex flex-col gap-4 print:hidden md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              My Certificate
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Print, save as PDF, or share your verification link.
            </p>
          </div>

          <CertificateActions verifyUrl={verifyUrl} />
        </div>

        <section className="certificate-wrapper relative overflow-hidden rounded-[34px] border-[8px] border-blue-900 bg-gradient-to-br from-white via-white to-blue-50 px-8 py-7 shadow-2xl print:min-h-screen print:rounded-none print:border-[6px] print:px-8 print:py-6 print:shadow-none">
          <div className="absolute inset-4 rounded-[24px] border-2 border-yellow-400" />

          <div className="relative z-10 text-center">
            <div className="mx-auto flex items-center justify-center gap-5">
              <div className="flex items-center gap-2">
                <img
                  src="/brand/buildup-logo.png"
                  alt="BuildUp Logo"
                  className="h-14 w-auto object-contain print:h-12"
                />

                <p className="text-lg font-black text-slate-900">BuildUp</p>
              </div>

              <span className="text-2xl font-light text-slate-300">|</span>

              <p className="text-xs font-black uppercase tracking-[0.35em] text-blue-700">
                Certificate of Verified Experience
              </p>
            </div>

            {certificate.volunteer.profileImageUrl ? (
              <img
                src={certificate.volunteer.profileImageUrl}
                alt={certificate.volunteer.name || "Volunteer"}
                className="mx-auto mt-5 h-20 w-20 rounded-full border-4 border-blue-100 object-cover shadow-md print:h-16 print:w-16"
              />
            ) : null}

            <h2 className="mt-4 text-5xl font-black tracking-tight text-slate-950 print:text-4xl">
              {certificate.volunteer.name}
            </h2>

            <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-slate-600 print:text-sm print:leading-6">
              This certificate is proudly awarded in recognition of verified
              real-world project experience completed through the BuildUp
              platform.
            </p>

            <div className="mx-auto mt-5 grid max-w-3xl gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Verified Projects Completed
                </p>

                <p className="mt-2 text-3xl font-black text-blue-700">
                  {certificate.completedProjectsCount}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Certificate No.
                </p>

                <p className="mt-2 text-lg font-black text-slate-900">
                  {certificate.certificateNo}
                </p>
              </div>
            </div>

            {certificate.skillsSummary ? (
              <div className="mx-auto mt-5 max-w-4xl rounded-2xl border border-blue-100 bg-blue-50/90 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">
                  Primary Skills
                </p>

                <p className="mt-2 text-sm font-medium leading-6 text-blue-900">
                  {formatCertificateSkills(certificate.skillsSummary)}
                </p>
              </div>
            ) : null}

            <div className="mt-6 grid grid-cols-3 items-end gap-4">
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Issued Date
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  {new Date(certificate.issuedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="rounded-xl bg-white p-2 shadow-sm">
                  <QRCode value={verifyUrl} size={74} />
                </div>

                <p className="mt-2 text-xs font-bold text-slate-900">
                  Scan to Verify
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Verify
                </p>

                <p className="mt-2 text-xs font-bold text-slate-900">
                  Scan QR or visit verification page
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs font-bold text-slate-500">
              BuildUp | Build real experience. Not just certificates.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
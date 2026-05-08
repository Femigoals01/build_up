




// "use client";

// import Link from "next/link";
// import { useMemo, useState } from "react";
// import ApplicantCard from "@/components/organization/ApplicantCard";

// type ProjectTab = "active" | "pending" | "completed";

// type Volunteer = {
//   id: string;
//   name: string | null;
//   email: string;
//   username?: string | null;
//   skills?: string | null;
//   bio?: string | null;
//   country?: string | null;
//   profileImageUrl?: string | null;
//   headline?: string | null;
//   experience?: string | null;
// };

// type ProjectApplication = {
//   id: string;
//   status: string;
//   source?: string | null;
//   volunteer: Volunteer;
// };

// type Submission = {
//   id: string;
//   status: string;
//   message?: string | null;
//   workUrl?: string | null;
//   fileUrl?: string | null;
//   version?: number | null;
//   createdAt: string | Date;
//   volunteer?: {
//     id: string;
//     name: string | null;
//     email?: string | null;
//     profileImageUrl?: string | null;
//   };
// };

// type ProjectFunding = {
//   status: string;
//   stipendAmount: number;
//   platformFee?: number | null;
//   volunteerAmount?: number | null;
// } | null;

// type OrganizationProject = {
//   id: string;
//   title: string;
//   description?: string | null;
//   location?: string | null;
//   status: string;
//   stipendAmount?: number | null;
//   funding?: ProjectFunding;
//   applications: ProjectApplication[];
//   submissions?: Submission[];
// };

// type OrganizationProjectsTabsProps = {
//   userId: string;
//   activeProjects: OrganizationProject[];
//   pendingProjects: OrganizationProject[];
//   completedProjects: OrganizationProject[];
// };

// function formatNairaFromKobo(amount?: number | null) {
//   if (!amount) return "₦0";
//   return `₦${(amount / 100).toLocaleString("en-NG", {
//     maximumFractionDigits: 0,
//   })}`;
// }

// function getFundingStatus(project: OrganizationProject) {
//   return project.funding?.status || "UNPAID";
// }

// function getFundingAmount(project: OrganizationProject) {
//   return project.funding?.stipendAmount ?? project.stipendAmount ?? 0;
// }

// function hasAwaitingPaymentApplication(project: OrganizationProject) {
//   return project.applications.some(
//     (application) => application.status === "AWAITING_PAYMENT"
//   );
// }

// function getFundingStyles(status: string) {
//   switch (status) {
//     case "HELD":
//       return "bg-emerald-50 text-emerald-700 border-emerald-200";
//     case "RELEASED":
//       return "bg-blue-50 text-blue-700 border-blue-200";
//     case "DISPUTED":
//       return "bg-rose-50 text-rose-700 border-rose-200";
//     case "REFUNDED":
//       return "bg-slate-100 text-slate-700 border-slate-200";
//     case "UNPAID":
//     default:
//       return "bg-amber-50 text-amber-700 border-amber-200";
//   }
// }

// function getStatusStyles(status: string) {
//   switch (status) {
//     case "OPEN":
//       return "bg-emerald-50 text-emerald-700 border-emerald-200";
//     case "IN_PROGRESS":
//       return "bg-blue-50 text-blue-700 border-blue-200";
//     case "COMPLETED":
//       return "bg-slate-100 text-slate-700 border-slate-200";
//     default:
//       return "bg-slate-50 text-slate-700 border-slate-200";
//   }
// }

// function formatStatus(status: string) {
//   return status.replaceAll("_", " ");
// }

// function getSkillsArray(skills?: string | null) {
//   return skills
//     ? skills
//         .split(",")
//         .map((s) => s.trim())
//         .filter(Boolean)
//         .slice(0, 4)
//     : [];
// }

// function getSubmissionStatusStyles(status: string) {
//   switch (status) {
//     case "PENDING":
//       return "border-amber-200 bg-amber-50 text-amber-700";
//     case "APPROVED":
//       return "border-emerald-200 bg-emerald-50 text-emerald-700";
//     case "REJECTED":
//       return "border-rose-200 bg-rose-50 text-rose-700";
//     default:
//       return "border-slate-200 bg-slate-50 text-slate-700";
//   }
// }

// function getSubmissionLabel(status: string) {
//   switch (status) {
//     case "PENDING":
//       return "Awaiting review";
//     case "APPROVED":
//       return "Approved";
//     case "REJECTED":
//       return "Revision requested";
//     default:
//       return status;
//   }
// }

// function FundProjectButton({ projectId }: { projectId: string }) {
//   const [loading, setLoading] = useState(false);

//   async function handleFundProject() {
//     try {
//       setLoading(true);

//       const res = await fetch("/api/payments/project/initiate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ projectId }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data?.error || "Payment failed");
//       }

//       if (data.authorizationUrl) {
//         window.location.href = data.authorizationUrl;
//         return;
//       }

//       throw new Error("Payment link was not returned.");
//     } catch (error: any) {
//       alert(error?.message || "Unable to start payment.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <button
//       type="button"
//       onClick={handleFundProject}
//       disabled={loading}
//       className="inline-flex h-10 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
//     >
//       {loading ? "Starting..." : "Fund Project"}
//     </button>
//   );
// }

// function FundingSummary({ project }: { project: OrganizationProject }) {
//   const fundingStatus = getFundingStatus(project);
//   const stipendAmount = getFundingAmount(project);
//   const awaitingPayment = hasAwaitingPaymentApplication(project);

//   const canFundProject = fundingStatus === "UNPAID" && awaitingPayment;

//   return (
//     <div className="mt-5 rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
//       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <div>
//           <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
//             Project Funding
//           </p>

//           <div className="mt-2 flex flex-wrap items-center gap-2">
//             <span
//               className={`rounded-full border px-3 py-1 text-xs font-semibold ${getFundingStyles(
//                 fundingStatus
//               )}`}
//             >
//               {fundingStatus}
//             </span>

//             {awaitingPayment ? (
//               <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
//                 Payment Required
//               </span>
//             ) : null}

//             <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
//               Stipend: {formatNairaFromKobo(stipendAmount)}
//             </span>
//           </div>

//           <p className="mt-2 text-xs leading-5 text-slate-500">
//             Select a volunteer first. After funding succeeds, the project moves
//             to in progress and the volunteer is notified.
//           </p>
//         </div>

//         {canFundProject ? (
//           <FundProjectButton projectId={project.id} />
//         ) : fundingStatus === "UNPAID" ? (
//           <span className="inline-flex h-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 px-4 text-sm font-semibold text-amber-700">
//             Select volunteer before funding
//           </span>
//         ) : (
//           <span className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600">
//             {fundingStatus === "HELD"
//               ? "Funds Held"
//               : fundingStatus === "RELEASED"
//               ? "Funds Released"
//               : fundingStatus}
//           </span>
//         )}
//       </div>
//     </div>
//   );
// }

// function VolunteerInfoCard({
//   volunteer,
//   projectId,
//   projectStatus,
// }: {
//   volunteer: Volunteer;
//   projectId: string;
//   projectStatus: string;
// }) {
//   const skills = getSkillsArray(volunteer.skills);

//   return (
//     <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
//       <div className="flex items-start gap-4">
//         {volunteer.profileImageUrl ? (
//           <img
//             src={volunteer.profileImageUrl}
//             alt={volunteer.name ?? "Volunteer"}
//             className="h-12 w-12 rounded-2xl object-cover"
//           />
//         ) : (
//           <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-lg font-semibold text-blue-700">
//             {(volunteer.name ?? "U").charAt(0).toUpperCase()}
//           </div>
//         )}

//         <div className="min-w-0 flex-1">
//           <div className="flex flex-wrap items-start justify-between gap-3">
//             <div className="min-w-0">
//               <p className="truncate text-base font-semibold text-slate-900">
//                 {volunteer.name ?? "Unnamed volunteer"}
//               </p>
//               <p className="truncate text-sm text-slate-500">
//                 {volunteer.email}
//               </p>

//               {volunteer.headline ? (
//                 <p className="mt-1 text-sm text-slate-600">
//                   {volunteer.headline}
//                 </p>
//               ) : null}
//             </div>

//             <span
//               className={`rounded-full border px-3 py-1 text-xs font-semibold ${
//                 projectStatus === "COMPLETED"
//                   ? "border-slate-200 bg-slate-100 text-slate-700"
//                   : "border-emerald-200 bg-emerald-50 text-emerald-700"
//               }`}
//             >
//               {projectStatus === "COMPLETED"
//                 ? "Worked on project"
//                 : "Active on project"}
//             </span>
//           </div>

//           {volunteer.bio ? (
//             <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
//               {volunteer.bio}
//             </p>
//           ) : null}

//           <div className="mt-4 flex flex-wrap items-center gap-2">
//             {volunteer.country ? (
//               <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
//                 {volunteer.country}
//               </span>
//             ) : null}

//             {skills.map((skill) => (
//               <span
//                 key={skill}
//                 className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
//               >
//                 {skill}
//               </span>
//             ))}
//           </div>

//           <div className="mt-4 flex flex-wrap gap-2">
//             {volunteer.username ? (
//               <Link
//                 href={`/portfolio/${volunteer.username}`}
//                 className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//               >
//                 View Profile
//               </Link>
//             ) : null}

//             <Link
//               href={`/dashboard/projects/${projectId}`}
//               className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
//             >
//               View Project
//             </Link>

//             <Link
//               href={`/dashboard/messages/start?userId=${volunteer.id}`}
//               className="inline-flex h-10 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
//             >
//               💬 Message Volunteer
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function PendingVolunteerCard({
//   app,
// }: {
//   app: ProjectApplication;
//   projectId: string;
// }) {
//   const volunteer = app.volunteer;

//   return (
//     <ApplicantCard
//       applicationId={app.id}
//       name={volunteer.name ?? "Unnamed volunteer"}
//       email={volunteer.email}
//       status={app.status}
//       username={volunteer.username}
//       bio={volunteer.bio}
//       skills={volunteer.skills}
//       country={volunteer.country}
//       profileImageUrl={volunteer.profileImageUrl}
//       experience={volunteer.experience}
//     />
//   );
// }

// function LatestSubmissionCard({
//   projectId,
//   submission,
// }: {
//   projectId: string;
//   submission: Submission;
// }) {
//   return (
//     <div className="mb-5 overflow-hidden rounded-[24px] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-blue-50 p-5 shadow-sm">
//       <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
//         <div className="min-w-0">
//           <div className="flex flex-wrap items-center gap-2">
//             <span className="rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
//               🟡 New submission
//             </span>

//             <span
//               className={`rounded-full border px-3 py-1 text-xs font-semibold ${getSubmissionStatusStyles(
//                 submission.status
//               )}`}
//             >
//               {getSubmissionLabel(submission.status)}
//             </span>

//             <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
//               Version {submission.version ?? 1}
//             </span>
//           </div>

//           <p className="mt-3 text-sm leading-6 text-slate-600">
//             {submission.message ||
//               "A volunteer submitted work for this project. Review the delivery, files, and links before approving or requesting revision."}
//           </p>

//           <p className="mt-2 text-xs text-slate-400">
//             Submitted {new Date(submission.createdAt).toLocaleString()}
//           </p>
//         </div>

//         <div className="flex shrink-0 flex-wrap gap-2">
//           {submission.workUrl ? (
//             <a
//               href={submission.workUrl}
//               target="_blank"
//               rel="noreferrer"
//               className="inline-flex h-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
//             >
//               View Work
//             </a>
//           ) : null}

//           <Link
//             href={`/dashboard/organization/projects/${projectId}/submission`}
//             className="inline-flex h-10 items-center justify-center rounded-xl bg-amber-500 px-4 text-sm font-semibold text-white transition hover:bg-amber-600"
//           >
//             Review Submission
//           </Link>
//         </div>
//       </div>

//       {submission.fileUrl ? (
//         <div className="mt-4">
//           {submission.fileUrl.toLowerCase().includes(".pdf") ? (
//             <a
//               href={submission.fileUrl}
//               target="_blank"
//               rel="noreferrer"
//               className="inline-flex items-center gap-2 rounded-xl text-sm font-semibold text-blue-600 hover:underline"
//             >
//               📄 View submitted PDF
//             </a>
//           ) : (
//             <img
//               src={submission.fileUrl}
//               alt="Submitted proof"
//               className="w-40 rounded-xl border border-slate-200 shadow-sm"
//             />
//           )}
//         </div>
//       ) : null}
//     </div>
//   );
// }

// function AwaitingPaymentProjectCard({
//   project,
//   awaitingPaymentApp,
// }: {
//   project: OrganizationProject;
//   awaitingPaymentApp: ProjectApplication;
// }) {
//   const paymentMessage =
//     awaitingPaymentApp.source === "ORGANIZATION"
//       ? "Invitation accepted — fund to get started"
//       : "Volunteer selected — fund to get started";

//   const helperText =
//     awaitingPaymentApp.source === "ORGANIZATION"
//       ? "The volunteer accepted your direct invite. Fund this project now so work can officially start."
//       : "You selected this volunteer from the applications. Fund this project now so work can officially start.";

//   return (
//     <section
//       key={project.id}
//       className="overflow-hidden rounded-[26px] border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-white to-blue-50 p-6 shadow-sm md:p-7"
//     >
//       <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
//         <div className="min-w-0">
//           <span className="inline-flex rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-amber-800">
//             Payment Required
//           </span>

//           <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
//             {paymentMessage}
//           </h3>

//           <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
//             {helperText}
//           </p>

//           <div className="mt-5 flex flex-wrap gap-2">
//             <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
//               Project: {project.title}
//             </span>

//             <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
//               Volunteer:{" "}
//               {awaitingPaymentApp.volunteer?.name ?? "Selected volunteer"}
//             </span>

//             <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
//               Stipend: {formatNairaFromKobo(getFundingAmount(project))}
//             </span>

//             <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
//               Awaiting payment
//             </span>
//           </div>
//         </div>

//         <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
//           <FundProjectButton projectId={project.id} />

//           <Link
//             href={`/dashboard/projects/${project.id}`}
//             className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//           >
//             View Project
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default function OrganizationProjectsTabs({
//   activeProjects,
//   pendingProjects,
//   completedProjects,
// }: OrganizationProjectsTabsProps) {
//   const [currentTab, setCurrentTab] = useState<ProjectTab>("active");

//   const visibleProjects = useMemo(() => {
//     if (currentTab === "pending") return pendingProjects;
//     if (currentTab === "completed") return completedProjects;
//     return activeProjects;
//   }, [currentTab, activeProjects, pendingProjects, completedProjects]);

//   const currentTabLabel =
//     currentTab === "pending"
//       ? "Pending Projects"
//       : currentTab === "completed"
//       ? "Completed Projects"
//       : "Active Projects";

//   const handleTabChange = (nextTab: ProjectTab) => {
//     if (nextTab === currentTab) return;

//     const currentScrollY = window.scrollY;
//     setCurrentTab(nextTab);

//     requestAnimationFrame(() => {
//       window.scrollTo({
//         top: currentScrollY,
//         behavior: "auto",
//       });
//     });
//   };

//   return (
//     <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
//       <div className="border-b border-slate-200 px-6 py-5 md:px-8">
//         <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
//               Project Workstream
//             </p>
//             <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
//               Applicants and active projects
//             </h2>
//             <p className="mt-2 text-sm text-slate-500">
//               Switch categories without refreshing or jumping down the page.
//             </p>
//           </div>

//           <div className="inline-flex w-full flex-wrap gap-2 md:w-auto md:flex-nowrap">
//             {(["active", "pending", "completed"] as ProjectTab[]).map((tab) => (
//               <button
//                 key={tab}
//                 type="button"
//                 onClick={() => handleTabChange(tab)}
//                 className={`inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
//                   currentTab === tab
//                     ? "bg-blue-600 text-white shadow-sm"
//                     : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
//                 }`}
//               >
//                 {tab === "active"
//                   ? "Active Projects"
//                   : tab === "pending"
//                   ? "Pending Projects"
//                   : "Completed Projects"}

//                 <span
//                   className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
//                     currentTab === tab
//                       ? "bg-white/20 text-white"
//                       : "bg-slate-100 text-slate-600"
//                   }`}
//                 >
//                   {tab === "active"
//                     ? activeProjects.length
//                     : tab === "pending"
//                     ? pendingProjects.length
//                     : completedProjects.length}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="px-6 py-6 md:px-8">
//         <div className="mb-5 flex flex-wrap items-center gap-3">
//           <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
//             Currently viewing: {currentTabLabel}
//           </span>

//           <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
//             {visibleProjects.length} project
//             {visibleProjects.length === 1 ? "" : "s"}
//           </span>
//         </div>

//         {visibleProjects.length === 0 ? (
//           <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
//             <div className="mx-auto max-w-md">
//               <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-2xl shadow-sm">
//                 📂
//               </div>

//               <h3 className="text-lg font-semibold text-slate-900">
//                 No {currentTabLabel.toLowerCase()} yet
//               </h3>

//               <p className="mt-2 text-sm leading-6 text-slate-500">
//                 Projects in this category will appear here once they are
//                 available.
//               </p>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-0">
//             {visibleProjects.map((project, index) => {
//               const latestSubmission = project.submissions?.[0] ?? null;

//               const realApplications = project.applications.filter(
//                 (application) => application.source !== "ORGANIZATION"
//               );

//               const pendingApps = project.applications.filter(
//                 (application) =>
//                   application.status === "PENDING" &&
//                   application.source !== "ORGANIZATION"
//               );

//               const acceptedApps = project.applications.filter((application) => {
//                 if (project.status === "COMPLETED") {
//                   return (
//                     application.status === "ACCEPTED" ||
//                     application.status === "COMPLETED"
//                   );
//                 }

//                 return application.status === "ACCEPTED";
//               });

//               const awaitingPaymentApp = project.applications.find(
//                 (application) => application.status === "AWAITING_PAYMENT"
//               );

//               const awaitingPaymentApps = project.applications.filter(
//                 (application) => application.status === "AWAITING_PAYMENT"
//               );

//               const assignedOrSelectedApps = project.applications.filter(
//                 (application) =>
//                   application.status === "AWAITING_PAYMENT" ||
//                   application.status === "ACCEPTED" ||
//                   application.status === "COMPLETED"
//               );

//               const hasAssignedVolunteer = assignedOrSelectedApps.length > 0;

//               if (awaitingPaymentApp) {
//                 return (
//                   <div key={project.id}>
//                     <AwaitingPaymentProjectCard
//                       project={project}
//                       awaitingPaymentApp={awaitingPaymentApp}
//                     />

//                     {index < visibleProjects.length - 1 ? (
//                       <div className="flex justify-center py-5">
//                         <div className="h-px w-[92%] bg-slate-200" />
//                       </div>
//                     ) : null}
//                   </div>
//                 );
//               }

//               return (
//                 <div key={project.id}>
//                   <section
//                     className={`overflow-hidden rounded-[26px] border p-6 shadow-sm transition-all md:p-7 ${
//                       currentTab === "pending"
//                         ? "border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"
//                         : currentTab === "active"
//                         ? "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50"
//                         : "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50"
//                     }`}
//                   >
//                     <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 lg:flex-row lg:items-start lg:justify-between">
//                       <div className="min-w-0 flex-1">
//                         <div className="mb-3 flex flex-wrap items-start gap-3">
//                           <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg text-white shadow-sm">
//                             📁
//                           </div>

//                           <div className="min-w-0">
//                             <h3 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
//                               {project.title}
//                             </h3>

//                             <p className="mt-1 text-sm text-slate-500">
//                               {project.description ||
//                                 "Manage applicants, accepted volunteers, and project activity."}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="flex flex-wrap items-center gap-3">
//                           <span
//                             className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(
//                               project.status
//                             )}`}
//                           >
//                             {formatStatus(project.status)}
//                           </span>

//                           <span
//                             className={`rounded-full border px-3 py-1 text-xs font-semibold ${getFundingStyles(
//                               getFundingStatus(project)
//                             )}`}
//                           >
//                             {getFundingStatus(project)}
//                           </span>

//                           {awaitingPaymentApps.length > 0 ? (
//                             <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
//                               Awaiting Payment
//                             </span>
//                           ) : null}

//                           <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
//                             💰 {formatNairaFromKobo(getFundingAmount(project))}
//                           </span>

//                           <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
//                             {realApplications.length} applicant
//                             {realApplications.length === 1 ? "" : "s"}
//                           </span>

//                           <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
//                             {acceptedApps.length} accepted volunteer
//                             {acceptedApps.length === 1 ? "" : "s"}
//                           </span>
//                         </div>

//                         <FundingSummary project={project} />
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3">
//                       <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
//                         <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
//                           Pending Applications
//                         </p>
//                         <p className="mt-2 text-2xl font-bold text-slate-900">
//                           {pendingApps.length}
//                         </p>
//                       </div>

//                       <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
//                         <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
//                           Selected / Active
//                         </p>
//                         <p className="mt-2 text-2xl font-bold text-slate-900">
//                           {assignedOrSelectedApps.length}
//                         </p>
//                       </div>

//                       <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
//                         <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
//                           Total Applicants
//                         </p>
//                         <p className="mt-2 text-2xl font-bold text-slate-900">
//                           {realApplications.length}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="border-t border-slate-100 pt-6">
//                       {currentTab === "pending" ? (
//                         <>
//                           <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//                             <div>
//                               <h4 className="text-lg font-semibold text-slate-900">
//                                 Pending Applicants
//                               </h4>
//                               <p className="mt-1 text-sm text-slate-500">
//                                 Review candidates who applied to this project.
//                               </p>
//                             </div>

//                             <div className="flex flex-wrap gap-2">
//                               {hasAssignedVolunteer ? (
//                                 <span className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm font-semibold text-slate-500">
//                                   Volunteer Selected
//                                 </span>
//                               ) : (
//                                 <Link
//                                   href={`/dashboard/organization/projects/${project.id}/invite`}
//                                   className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//                                 >
//                                   Invite Volunteers
//                                 </Link>
//                               )}

//                               <Link
//                                 href={`/dashboard/projects/${project.id}`}
//                                 className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//                               >
//                                 View Project
//                               </Link>
//                             </div>
//                           </div>

//                           {pendingApps.length === 0 ? (
//                             <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
//                               <p className="text-sm font-medium text-slate-700">
//                                 No volunteer applications for this project right
//                                 now.
//                               </p>
//                               <p className="mt-1 text-sm text-slate-500">
//                                 Organization-sent invites are tracked separately
//                                 in Invite History.
//                               </p>
//                             </div>
//                           ) : (
//                             <div className="space-y-4">
//                               {pendingApps.map((app) => (
//                                 <PendingVolunteerCard
//                                   key={app.id}
//                                   app={app}
//                                   projectId={project.id}
//                                 />
//                               ))}
//                             </div>
//                           )}
//                         </>
//                       ) : (
//                         <>
//                           {currentTab === "active" && latestSubmission ? (
//                             <LatestSubmissionCard
//                               projectId={project.id}
//                               submission={latestSubmission}
//                             />
//                           ) : null}

//                           <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
//                             <div>
//                               <h4 className="text-lg font-semibold text-slate-900">
//                                 {currentTab === "completed"
//                                   ? "Volunteers who worked on this project"
//                                   : "Current active volunteers"}
//                               </h4>
//                               <p className="mt-1 text-sm text-slate-500">
//                                 {currentTab === "completed"
//                                   ? "Accepted and completed contributors attached to this project."
//                                   : "Accepted volunteers currently engaged on this project."}
//                               </p>
//                             </div>

//                             <div className="flex flex-wrap gap-2">
//                               {hasAssignedVolunteer ? (
//                                 <span className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm font-semibold text-slate-500">
//                                   Volunteer Selected
//                                 </span>
//                               ) : (
//                                 <Link
//                                   href={`/dashboard/organization/projects/${project.id}/invite`}
//                                   className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//                                 >
//                                   Invite Volunteers
//                                 </Link>
//                               )}

//                               {latestSubmission?.workUrl ? (
//                                 <a
//                                   href={latestSubmission.workUrl}
//                                   target="_blank"
//                                   rel="noreferrer"
//                                   className="inline-flex h-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
//                                 >
//                                   View Submitted Work
//                                 </a>
//                               ) : null}

//                               <Link
//                                 href={`/dashboard/projects/${project.id}`}
//                                 className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//                               >
//                                 View Project
//                               </Link>
//                             </div>
//                           </div>

//                           {acceptedApps.length === 0 ? (
//                             <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
//                               <p className="text-sm font-medium text-slate-700">
//                                 {currentTab === "completed"
//                                   ? "No contributors have been recorded for this completed project yet."
//                                   : "No accepted volunteers for this project yet."}
//                               </p>
//                             </div>
//                           ) : (
//                             <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
//                               {acceptedApps.map((app) => (
//                                 <VolunteerInfoCard
//                                   key={app.id}
//                                   volunteer={app.volunteer}
//                                   projectId={project.id}
//                                   projectStatus={project.status}
//                                 />
//                               ))}
//                             </div>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   </section>

//                   {index < visibleProjects.length - 1 ? (
//                     <div className="flex justify-center py-5">
//                       <div className="h-px w-[92%] bg-slate-200" />
//                     </div>
//                   ) : null}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }




"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ApplicantCard from "@/components/organization/ApplicantCard";

type ProjectTab = "active" | "pending" | "completed";

type Volunteer = {
  id: string;
  name: string | null;
  email: string;
  username?: string | null;
  skills?: string | null;
  bio?: string | null;
  country?: string | null;
  profileImageUrl?: string | null;
  headline?: string | null;
  experience?: string | null;
};

type ProjectApplication = {
  id: string;
  status: string;
  source?: string | null;
  volunteer: Volunteer;
};

type Submission = {
  id: string;
  status: string;
  message?: string | null;
  workUrl?: string | null;
  fileUrl?: string | null;
  version?: number | null;
  createdAt: string | Date;
  volunteer?: {
    id: string;
    name: string | null;
    email?: string | null;
    profileImageUrl?: string | null;
  };
};

type ProjectFunding = {
  status: string;
  stipendAmount: number;
  platformFee?: number | null;
  volunteerAmount?: number | null;
} | null;

type OrganizationProject = {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  status: string;
  stipendAmount?: number | null;
  deliveryDays?: number | null;
  deliveryStartedAt?: string | Date | null;
  deliveryDueAt?: string | Date | null;
  funding?: ProjectFunding;
  applications: ProjectApplication[];
  submissions?: Submission[];
};

type OrganizationProjectsTabsProps = {
  userId: string;
  activeProjects: OrganizationProject[];
  pendingProjects: OrganizationProject[];
  completedProjects: OrganizationProject[];
};

function formatNairaFromKobo(amount?: number | null) {
  if (!amount) return "₦0";

  return `₦${(amount / 100).toLocaleString("en-NG", {
    maximumFractionDigits: 0,
  })}`;
}

function formatDeliveryDuration(days?: number | null) {
  const safeDays = days && days > 0 ? days : 7;

  return `${safeDays} ${safeDays === 1 ? "day" : "days"}`;
}

function getDeliveryCountdown(project: OrganizationProject) {
  if (!project.deliveryDueAt) {
    return `Delivery: ${formatDeliveryDuration(project.deliveryDays)} after funding`;
  }

  const dueAt = new Date(project.deliveryDueAt).getTime();
  const now = Date.now();
  const difference = dueAt - now;

  if (difference <= 0) {
    return "Delivery overdue";
  }

  const totalMinutes = Math.floor(difference / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m remaining`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  }

  return `${minutes}m remaining`;
}

function getDeliveryStyles(project: OrganizationProject) {
  if (!project.deliveryDueAt) {
    return "border-slate-200 bg-slate-50 text-slate-700";
  }

  const dueAt = new Date(project.deliveryDueAt).getTime();
  const now = Date.now();

  if (dueAt <= now) {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  return "border-indigo-200 bg-indigo-50 text-indigo-700";
}

function getFundingStatus(project: OrganizationProject) {
  return project.funding?.status || "UNPAID";
}

function getFundingAmount(project: OrganizationProject) {
  return project.funding?.stipendAmount ?? project.stipendAmount ?? 0;
}

function hasAwaitingPaymentApplication(project: OrganizationProject) {
  return project.applications.some(
    (application) => application.status === "AWAITING_PAYMENT"
  );
}

function getFundingStyles(status: string) {
  switch (status) {
    case "HELD":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "RELEASED":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "DISPUTED":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "REFUNDED":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "UNPAID":
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

function getStatusStyles(status: string) {
  switch (status) {
    case "OPEN":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "COMPLETED":
      return "bg-slate-100 text-slate-700 border-slate-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function getSkillsArray(skills?: string | null) {
  return skills
    ? skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 4)
    : [];
}

function getSubmissionStatusStyles(status: string) {
  switch (status) {
    case "PENDING":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "APPROVED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "REJECTED":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function getSubmissionLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "Awaiting review";
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Revision requested";
    default:
      return status;
  }
}

function FundProjectButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleFundProject() {
    try {
      setLoading(true);

      const res = await fetch("/api/payments/project/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Payment failed");
      }

      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
        return;
      }

      throw new Error("Payment link was not returned.");
    } catch (error: any) {
      alert(error?.message || "Unable to start payment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleFundProject}
      disabled={loading}
      className="inline-flex h-10 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Starting..." : "Fund Project"}
    </button>
  );
}

function FundingSummary({ project }: { project: OrganizationProject }) {
  const fundingStatus = getFundingStatus(project);
  const stipendAmount = getFundingAmount(project);
  const awaitingPayment = hasAwaitingPaymentApplication(project);

  const canFundProject = fundingStatus === "UNPAID" && awaitingPayment;

  return (
    <div className="mt-5 rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Project Funding
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getFundingStyles(
                fundingStatus
              )}`}
            >
              {fundingStatus}
            </span>

            {awaitingPayment ? (
              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Payment Required
              </span>
            ) : null}

            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Stipend: {formatNairaFromKobo(stipendAmount)}
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getDeliveryStyles(
                project
              )}`}
            >
              ⏱ {getDeliveryCountdown(project)}
            </span>
          </div>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Select a volunteer first. After funding succeeds, the project moves
            to in progress and the delivery countdown starts.
          </p>
        </div>

        {canFundProject ? (
          <FundProjectButton projectId={project.id} />
        ) : fundingStatus === "UNPAID" ? (
          <span className="inline-flex h-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 px-4 text-sm font-semibold text-amber-700">
            Select volunteer before funding
          </span>
        ) : (
          <span className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600">
            {fundingStatus === "HELD"
              ? "Funds Held"
              : fundingStatus === "RELEASED"
              ? "Funds Released"
              : fundingStatus}
          </span>
        )}
      </div>
    </div>
  );
}

function VolunteerInfoCard({
  volunteer,
  projectId,
  projectStatus,
}: {
  volunteer: Volunteer;
  projectId: string;
  projectStatus: string;
}) {
  const skills = getSkillsArray(volunteer.skills);

  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        {volunteer.profileImageUrl ? (
          <img
            src={volunteer.profileImageUrl}
            alt={volunteer.name ?? "Volunteer"}
            className="h-12 w-12 rounded-2xl object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-lg font-semibold text-blue-700">
            {(volunteer.name ?? "U").charAt(0).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-slate-900">
                {volunteer.name ?? "Unnamed volunteer"}
              </p>
              <p className="truncate text-sm text-slate-500">
                {volunteer.email}
              </p>

              {volunteer.headline ? (
                <p className="mt-1 text-sm text-slate-600">
                  {volunteer.headline}
                </p>
              ) : null}
            </div>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                projectStatus === "COMPLETED"
                  ? "border-slate-200 bg-slate-100 text-slate-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              {projectStatus === "COMPLETED"
                ? "Worked on project"
                : "Active on project"}
            </span>
          </div>

          {volunteer.bio ? (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
              {volunteer.bio}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {volunteer.country ? (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                {volunteer.country}
              </span>
            ) : null}

            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {volunteer.username ? (
              <Link
                href={`/portfolio/${volunteer.username}`}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                View Profile
              </Link>
            ) : null}

            <Link
              href={`/dashboard/projects/${projectId}`}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              View Project
            </Link>

            <Link
              href={`/dashboard/messages/start?userId=${volunteer.id}`}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              💬 Message Volunteer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function PendingVolunteerCard({
  app,
}: {
  app: ProjectApplication;
  projectId: string;
}) {
  const volunteer = app.volunteer;

  return (
    <ApplicantCard
      applicationId={app.id}
      name={volunteer.name ?? "Unnamed volunteer"}
      email={volunteer.email}
      status={app.status}
      username={volunteer.username}
      bio={volunteer.bio}
      skills={volunteer.skills}
      country={volunteer.country}
      profileImageUrl={volunteer.profileImageUrl}
      experience={volunteer.experience}
    />
  );
}

function LatestSubmissionCard({
  projectId,
  submission,
}: {
  projectId: string;
  submission: Submission;
}) {
  return (
    <div className="mb-5 overflow-hidden rounded-[24px] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-blue-50 p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
              🟡 New submission
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getSubmissionStatusStyles(
                submission.status
              )}`}
            >
              {getSubmissionLabel(submission.status)}
            </span>

            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
              Version {submission.version ?? 1}
            </span>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {submission.message ||
              "A volunteer submitted work for this project. Review the delivery, files, and links before approving or requesting revision."}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Submitted {new Date(submission.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {submission.workUrl ? (
            <a
              href={submission.workUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              View Work
            </a>
          ) : null}

          <Link
            href={`/dashboard/organization/projects/${projectId}/submission`}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-amber-500 px-4 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            Review Submission
          </Link>
        </div>
      </div>

      {submission.fileUrl ? (
        <div className="mt-4">
          {submission.fileUrl.toLowerCase().includes(".pdf") ? (
            <a
              href={submission.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl text-sm font-semibold text-blue-600 hover:underline"
            >
              📄 View submitted PDF
            </a>
          ) : (
            <img
              src={submission.fileUrl}
              alt="Submitted proof"
              className="w-40 rounded-xl border border-slate-200 shadow-sm"
            />
          )}
        </div>
      ) : null}
    </div>
  );
}

function AwaitingPaymentProjectCard({
  project,
  awaitingPaymentApp,
}: {
  project: OrganizationProject;
  awaitingPaymentApp: ProjectApplication;
}) {
  const paymentMessage =
    awaitingPaymentApp.source === "ORGANIZATION"
      ? "Invitation accepted — fund to get started"
      : "Volunteer selected — fund to get started";

  const helperText =
    awaitingPaymentApp.source === "ORGANIZATION"
      ? "The volunteer accepted your direct invite. Fund this project now so work can officially start."
      : "You selected this volunteer from the applications. Fund this project now so work can officially start.";

  return (
    <section
      key={project.id}
      className="overflow-hidden rounded-[26px] border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-white to-blue-50 p-6 shadow-sm md:p-7"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <span className="inline-flex rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-amber-800">
            Payment Required
          </span>

          <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">
            {paymentMessage}
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {helperText}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Project: {project.title}
            </span>

            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              Volunteer:{" "}
              {awaitingPaymentApp.volunteer?.name ?? "Selected volunteer"}
            </span>

            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              Stipend: {formatNairaFromKobo(getFundingAmount(project))}
            </span>

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getDeliveryStyles(
                project
              )}`}
            >
              ⏱ {getDeliveryCountdown(project)}
            </span>

            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              Awaiting payment
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
          <FundProjectButton projectId={project.id} />

          <Link
            href={`/dashboard/projects/${project.id}`}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View Project
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function OrganizationProjectsTabs({
  activeProjects,
  pendingProjects,
  completedProjects,
}: OrganizationProjectsTabsProps) {
  const [currentTab, setCurrentTab] = useState<ProjectTab>("active");

  const visibleProjects = useMemo(() => {
    if (currentTab === "pending") return pendingProjects;
    if (currentTab === "completed") return completedProjects;
    return activeProjects;
  }, [currentTab, activeProjects, pendingProjects, completedProjects]);

  const currentTabLabel =
    currentTab === "pending"
      ? "Pending Projects"
      : currentTab === "completed"
      ? "Completed Projects"
      : "Active Projects";

  const handleTabChange = (nextTab: ProjectTab) => {
    if (nextTab === currentTab) return;

    const currentScrollY = window.scrollY;
    setCurrentTab(nextTab);

    requestAnimationFrame(() => {
      window.scrollTo({
        top: currentScrollY,
        behavior: "auto",
      });
    });
  };

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Project Workstream
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Applicants and active projects
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Switch categories without refreshing or jumping down the page.
            </p>
          </div>

          <div className="inline-flex w-full flex-wrap gap-2 md:w-auto md:flex-nowrap">
            {(["active", "pending", "completed"] as ProjectTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabChange(tab)}
                className={`inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                  currentTab === tab
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tab === "active"
                  ? "Active Projects"
                  : tab === "pending"
                  ? "Pending Projects"
                  : "Completed Projects"}

                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                    currentTab === tab
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab === "active"
                    ? activeProjects.length
                    : tab === "pending"
                    ? pendingProjects.length
                    : completedProjects.length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 md:px-8">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            Currently viewing: {currentTabLabel}
          </span>

          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            {visibleProjects.length} project
            {visibleProjects.length === 1 ? "" : "s"}
          </span>
        </div>

        {visibleProjects.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
            <div className="mx-auto max-w-md">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-2xl shadow-sm">
                📂
              </div>

              <h3 className="text-lg font-semibold text-slate-900">
                No {currentTabLabel.toLowerCase()} yet
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Projects in this category will appear here once they are
                available.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {visibleProjects.map((project, index) => {
              const latestSubmission = project.submissions?.[0] ?? null;

              const realApplications = project.applications.filter(
                (application) => application.source !== "ORGANIZATION"
              );

              const pendingApps = project.applications.filter(
                (application) =>
                  application.status === "PENDING" &&
                  application.source !== "ORGANIZATION"
              );

              const acceptedApps = project.applications.filter((application) => {
                if (project.status === "COMPLETED") {
                  return (
                    application.status === "ACCEPTED" ||
                    application.status === "COMPLETED"
                  );
                }

                return application.status === "ACCEPTED";
              });

              const awaitingPaymentApp = project.applications.find(
                (application) => application.status === "AWAITING_PAYMENT"
              );

              const awaitingPaymentApps = project.applications.filter(
                (application) => application.status === "AWAITING_PAYMENT"
              );

              const assignedOrSelectedApps = project.applications.filter(
                (application) =>
                  application.status === "AWAITING_PAYMENT" ||
                  application.status === "ACCEPTED" ||
                  application.status === "COMPLETED"
              );

              const hasAssignedVolunteer = assignedOrSelectedApps.length > 0;

              if (awaitingPaymentApp) {
                return (
                  <div key={project.id}>
                    <AwaitingPaymentProjectCard
                      project={project}
                      awaitingPaymentApp={awaitingPaymentApp}
                    />

                    {index < visibleProjects.length - 1 ? (
                      <div className="flex justify-center py-5">
                        <div className="h-px w-[92%] bg-slate-200" />
                      </div>
                    ) : null}
                  </div>
                );
              }

              return (
                <div key={project.id}>
                  <section
                    className={`overflow-hidden rounded-[26px] border p-6 shadow-sm transition-all md:p-7 ${
                      currentTab === "pending"
                        ? "border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"
                        : currentTab === "active"
                          ? "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50"
                          : "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50"
                    }`}
                  >
                    <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap items-start gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg text-white shadow-sm">
                            📁
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                              {project.title}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              {project.description ||
                                "Manage applicants, accepted volunteers, and project activity."}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(
                              project.status
                            )}`}
                          >
                            {formatStatus(project.status)}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getFundingStyles(
                              getFundingStatus(project)
                            )}`}
                          >
                            {getFundingStatus(project)}
                          </span>

                          {awaitingPaymentApps.length > 0 ? (
                            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                              Awaiting Payment
                            </span>
                          ) : null}

                          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                            💰 {formatNairaFromKobo(getFundingAmount(project))}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getDeliveryStyles(
                              project
                            )}`}
                          >
                            ⏱ {getDeliveryCountdown(project)}
                          </span>

                          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                            {realApplications.length} applicant
                            {realApplications.length === 1 ? "" : "s"}
                          </span>

                          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                            {acceptedApps.length} accepted volunteer
                            {acceptedApps.length === 1 ? "" : "s"}
                          </span>
                        </div>

                        <FundingSummary project={project} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Pending Applications
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">
                          {pendingApps.length}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Selected / Active
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">
                          {assignedOrSelectedApps.length}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Total Applicants
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">
                          {realApplications.length}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                      {currentTab === "pending" ? (
                        <>
                          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div>
                              <h4 className="text-lg font-semibold text-slate-900">
                                Pending Applicants
                              </h4>
                              <p className="mt-1 text-sm text-slate-500">
                                Review candidates who applied to this project.
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {hasAssignedVolunteer ? (
                                <span className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm font-semibold text-slate-500">
                                  Volunteer Selected
                                </span>
                              ) : (
                                <Link
                                  href={`/dashboard/organization/projects/${project.id}/invite`}
                                  className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                  Invite Volunteers
                                </Link>
                              )}

                              <Link
                                href={`/dashboard/projects/${project.id}`}
                                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                              >
                                View Project
                              </Link>
                            </div>
                          </div>

                          {pendingApps.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                              <p className="text-sm font-medium text-slate-700">
                                No volunteer applications for this project right
                                now.
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                Organization-sent invites are tracked separately
                                in Invite History.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {pendingApps.map((app) => (
                                <PendingVolunteerCard
                                  key={app.id}
                                  app={app}
                                  projectId={project.id}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {currentTab === "active" && latestSubmission ? (
                            <LatestSubmissionCard
                              projectId={project.id}
                              submission={latestSubmission}
                            />
                          ) : null}

                          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div>
                              <h4 className="text-lg font-semibold text-slate-900">
                                {currentTab === "completed"
                                  ? "Volunteers who worked on this project"
                                  : "Current active volunteers"}
                              </h4>
                              <p className="mt-1 text-sm text-slate-500">
                                {currentTab === "completed"
                                  ? "Accepted and completed contributors attached to this project."
                                  : "Accepted volunteers currently engaged on this project."}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {hasAssignedVolunteer ? (
                                <span className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm font-semibold text-slate-500">
                                  Volunteer Selected
                                </span>
                              ) : (
                                <Link
                                  href={`/dashboard/organization/projects/${project.id}/invite`}
                                  className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                  Invite Volunteers
                                </Link>
                              )}

                              {latestSubmission?.workUrl ? (
                                <a
                                  href={latestSubmission.workUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex h-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                                >
                                  View Submitted Work
                                </a>
                              ) : null}

                              <Link
                                href={`/dashboard/projects/${project.id}`}
                                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                              >
                                View Project
                              </Link>
                            </div>
                          </div>

                          {acceptedApps.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                              <p className="text-sm font-medium text-slate-700">
                                {currentTab === "completed"
                                  ? "No contributors have been recorded for this completed project yet."
                                  : "No accepted volunteers for this project yet."}
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                              {acceptedApps.map((app) => (
                                <VolunteerInfoCard
                                  key={app.id}
                                  volunteer={app.volunteer}
                                  projectId={project.id}
                                  projectStatus={project.status}
                                />
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </section>

                  {index < visibleProjects.length - 1 ? (
                    <div className="flex justify-center py-5">
                      <div className="h-px w-[92%] bg-slate-200" />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
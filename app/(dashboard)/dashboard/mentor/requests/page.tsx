



// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import MentorRequestCard from "./MentorRequestCard";

// export const dynamic = "force-dynamic";

// export default async function MentorRequestsPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "MENTOR") {
//     redirect("/login");
//   }

//   const requests = await prisma.mentorshipRequest.findMany({
//     where: { mentorId: session.user.id },
//     include: {
//       volunteer: {
//         select: { id: true, name: true, email: true },
//       },
//       project: {
//         include: { chat: true },
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
//             <MentorRequestCard key={req.id} req={req} />
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

  const pendingCount = requests.filter((req) => req.status === "PENDING").length;
  const acceptedCount = requests.filter((req) => req.status === "ACCEPTED").length;
  const rejectedCount = requests.filter((req) => req.status === "REJECTED").length;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_26%),linear-gradient(180deg,#f8fbff_0%,#f8fafc_50%,#f1f5f9_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="relative overflow-hidden bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_45%,#2563eb_100%)] px-6 py-8 text-white sm:px-8 lg:px-10">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 right-8 h-24 w-24 rounded-full bg-blue-300/10 blur-3xl" />

            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100/90">
              Mentor Workspace
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Mentorship Requests
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
              Review volunteer mentorship requests, make decisions quickly, and
              move active conversations into project chat with confidence.
            </p>
          </div>

          <div className="grid gap-4 px-6 py-6 sm:px-8 md:grid-cols-3">
            <MetricCard
              title="Pending Requests"
              value={pendingCount}
              subtitle="Awaiting your response"
              tone="amber"
            />
            <MetricCard
              title="Accepted"
              value={acceptedCount}
              subtitle="Active mentorship matches"
              tone="emerald"
            />
            <MetricCard
              title="Rejected"
              value={rejectedCount}
              subtitle="Closed requests"
              tone="rose"
            />
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur sm:p-8">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                Request Queue
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                All Requests
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                See every request sent to you and take action where needed.
              </p>
            </div>

            <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
              {requests.length} total request{requests.length === 1 ? "" : "s"}
            </div>
          </div>

          {requests.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
              <div className="mx-auto max-w-md">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                  📩
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">
                  No mentorship requests yet
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  When volunteers request your support on projects, they will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {requests.map((req) => (
                <MentorRequestCard key={req.id} req={req} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  tone,
}: {
  title: string;
  value: number;
  subtitle: string;
  tone: "amber" | "emerald" | "rose";
}) {
  const toneMap = {
    amber: "from-amber-50 to-white border-amber-100",
    emerald: "from-emerald-50 to-white border-emerald-100",
    rose: "from-rose-50 to-white border-rose-100",
  };

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-5 shadow-sm ${toneMap[tone]}`}
    >
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}
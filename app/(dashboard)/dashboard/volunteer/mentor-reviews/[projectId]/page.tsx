


// import { getServerSession } from "next-auth";
// import { redirect, notFound } from "next/navigation";
// import Link from "next/link";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import MentorReviewForm from "./MentorReviewForm";

// export const dynamic = "force-dynamic";

// export default async function MentorReviewPage({
//   params,
// }: {
//   params: Promise<{ projectId: string }>;
// }) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
//     redirect("/login");
//   }

//   const { projectId } = await params;

//   const project = await prisma.project.findFirst({
//     where: {
//       id: projectId,
//       status: "COMPLETED",
//       mentorId: {
//         not: null,
//       },
//       applications: {
//         some: {
//           volunteerId: session.user.id,
//           status: "COMPLETED",
//         },
//       },
//     },
//     include: {
//       mentor: {
//         select: {
//           id: true,
//           name: true,
//           username: true,
//           headline: true,
//           profileImageUrl: true,
//           mentorRating: true,
//           mentorRatingCount: true,
//         },
//       },
//       mentorReviews: {
//         where: {
//           volunteerId: session.user.id,
//         },
//       },
//     },
//   });

//   if (!project || !project.mentor) {
//     notFound();
//   }

//   const alreadyReviewed = project.mentorReviews.length > 0;

//   return (
//     <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8 lg:px-10">
//       <div className="mx-auto max-w-4xl space-y-6">
//         <Link
//           href="/dashboard/volunteer/mentors"
//           className="text-sm font-bold text-blue-600 hover:underline"
//         >
//           ← Back to mentors
//         </Link>

//         <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
//           <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
//             Mentor Review
//           </p>

//           <h1 className="mt-3 text-3xl font-black text-slate-900">
//             Review your mentor
//           </h1>

//           <p className="mt-2 text-sm leading-6 text-slate-500">
//             Your feedback helps BuildUp identify trusted mentors and improve the
//             mentorship experience.
//           </p>

//           <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-5">
//             <p className="text-sm font-bold text-blue-900">
//               Project: {project.title}
//             </p>

//             <p className="mt-2 text-sm text-blue-700">
//               Mentor: {project.mentor.name}
//             </p>
//           </div>
//         </section>

//         {alreadyReviewed ? (
//           <section className="rounded-[32px] border border-emerald-200 bg-emerald-50 p-8 text-center">
//             <h2 className="text-2xl font-black text-emerald-900">
//               Review already submitted
//             </h2>

//             <p className="mt-2 text-sm text-emerald-700">
//               You have already reviewed this mentor for this project.
//             </p>
//           </section>
//         ) : (
//           <MentorReviewForm
//             projectId={project.id}
//             mentorId={project.mentor.id}
//             mentorName={project.mentor.name}
//           />
//         )}
//       </div>
//     </main>
//   );
// }










import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import MentorReviewForm from "./MentorReviewForm";

export const dynamic = "force-dynamic";

export default async function MentorReviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
    redirect("/login");
  }

  const { projectId } = await params;

  const completedBooking = await prisma.mentorBooking.findFirst({
    // where: {
    //   projectId,
    //   volunteerId: session.user.id,
    //   status: "COMPLETED",
    //   projectId: {
    //     not: null,
    //   },
    // },


    where: {
  volunteerId: session.user.id,
  status: "COMPLETED",
  projectId,
},
    include: {
      mentor: {
        select: {
          id: true,
          name: true,
          username: true,
          headline: true,
          profileImageUrl: true,
          mentorRating: true,
          mentorRatingCount: true,
        },
      },
      project: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });


  
  if (!completedBooking || !completedBooking.project) {
    notFound();
  }

  const existingReview = await prisma.mentorReview.findFirst({
    where: {
      mentorId: completedBooking.mentorId,
      volunteerId: session.user.id,
      projectId: completedBooking.project.id,
    },
  });

  const alreadyReviewed = Boolean(existingReview);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8 lg:px-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link
          href="/dashboard/volunteer/bookings"
          className="text-sm font-bold text-blue-600 hover:underline"
        >
          ← Back to bookings
        </Link>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            Mentor Review
          </p>

          <h1 className="mt-3 text-3xl font-black text-slate-900">
            Review your mentor
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your feedback helps BuildUp identify trusted mentors and improve the
            mentorship experience.
          </p>

          <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-5">
            <p className="text-sm font-bold text-blue-900">
              Project: {completedBooking.project.title}
            </p>

            <p className="mt-2 text-sm text-blue-700">
              Mentor: {completedBooking.mentor.name}
            </p>
          </div>
        </section>

        {alreadyReviewed ? (
          <section className="rounded-[32px] border border-emerald-200 bg-emerald-50 p-8 text-center">
            <h2 className="text-2xl font-black text-emerald-900">
              Review already submitted
            </h2>

            <p className="mt-2 text-sm text-emerald-700">
              You have already reviewed this mentor for this project.
            </p>
          </section>
        ) : (
          <MentorReviewForm
            projectId={completedBooking.project.id}
            mentorId={completedBooking.mentor.id}
            mentorName={completedBooking.mentor.name}
          />
        )}
      </div>
    </main>
  );
}
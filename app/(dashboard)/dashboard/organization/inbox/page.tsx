
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function OrganizationInbox() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZATION") {
    redirect("/login");
  }

  const unreadRes = await fetch(
  `${process.env.NEXTAUTH_URL}/api/chat/unread-count`,
  { cache: "no-store" }
);
const { count } = await unreadRes.json();


  // const applications = await prisma.application.findMany({
  //   where: {
  //     project: {
  //       organizationId: session.user.id,
  //     },
  //   },
  //   include: {
  //     volunteer: { select: { name: true, email: true } },
  //     project: { include: { chat: true } },
  //   },
  //   orderBy: { createdAt: "desc" },
  // });

  const applications = await prisma.application.findMany({
  where: {
    project: {
      organizationId: session.user.id,
    },
  },
  include: {
    volunteer: { select: { name: true, email: true } },
    project: {
      include: {
        chat: {
          include: {
            messages: {
              where: {
                senderId: { not: session.user.id }, // not me
                isSystem: false,
                reads: {
                  none: {
                    userId: session.user.id, // unread by me
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  orderBy: { createdAt: "desc" },
});


const appsWithUnread = applications.map((app) => ({
  ...app,
  unreadCount: app.project.chat?.messages.length ?? 0,
}));


  return (
    <main className="p-10 space-y-6">
      {/* <h1 className="text-3xl font-bold">Inbox</h1> */}

      <h1 className="text-3xl font-bold flex items-center gap-3">
  Inbox
  {count > 0 && (
    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
      {count}
    </span>
  )}
</h1>

      <p className="text-gray-600">
        Volunteer applications and project chats
      </p>

      {applications.length === 0 ? (
        <p className="text-gray-600">No applications yet.</p>
      ) : (
        <div className="space-y-4">
          {appsWithUnread.map((app) => (
            <div
              key={app.id}
              className="bg-white border rounded-xl p-6 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">
                  {app.project.title}
                </h3>

                <p className="text-sm text-gray-500">
                  Volunteer: {app.volunteer.name}
                </p>

                <span
                  className={`inline-block mt-2 text-xs px-3 py-1 rounded-full ${
                    app.status === "ACCEPTED"
                      ? "bg-green-100 text-green-700"
                      : app.status === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {app.status}
                </span>
              </div>

              <div className="flex gap-3">
                {app.status === "PENDING" && (
                  <>
                    <form
                      action="/api/projects/applications/accept"
                      method="POST"
                    >
                      <input
                        type="hidden"
                        name="applicationId"
                        value={app.id}
                      />
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                        Accept
                      </button>
                    </form>

                    <form
                      action="/api/projects/applications/reject"
                      method="POST"
                    >
                      <input
                        type="hidden"
                        name="applicationId"
                        value={app.id}
                      />
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
                        Reject
                      </button>
                    </form>
                  </>
                )}

              {app.project.chat && (
  <a
    href={`/dashboard/projects/${app.project.id}/chat`}
    className="relative bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
  >
    Open Chat

    {app.unreadCount > 0 && (
      <span className="ml-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
        {app.unreadCount}
      </span>
    )}
  </a>
)}

              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}




import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import AdminShell from "./AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const [volunteersCount, mentorsCount, organizationsCount, openSupportCount] =
    await Promise.all([
      prisma.user.count({
        where: { role: "VOLUNTEER" },
      }),
      prisma.user.count({
        where: { role: "MENTOR" },
      }),
      prisma.user.count({
        where: { role: "ORGANIZATION" },
      }),
      prisma.supportMessage.count({
        where: { status: "OPEN" },
      }),
    ]);

  return (
    <AdminShell
      volunteersCount={volunteersCount}
      mentorsCount={mentorsCount}
      organizationsCount={organizationsCount}
      openSupportCount={openSupportCount}
    >
      {children}
    </AdminShell>
  );
}
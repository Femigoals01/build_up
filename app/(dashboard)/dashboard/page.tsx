
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function DashboardRouter() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user?.role;

  if (role === "VOLUNTEER") {
    redirect("/dashboard/volunteer");
  }

  if (role === "ORGANIZATION") {
    redirect("/dashboard/organization");
  }

  if (role === "MENTOR") {
    redirect("/dashboard/mentor");
  }

  // fallback safety
  redirect("/login");
}

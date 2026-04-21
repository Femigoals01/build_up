




import "../globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardProviders from "./DashboardProviders";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <DashboardProviders>
      <div className="min-h-screen flex flex-col">
        <DashboardHeader
          name={session?.user?.name}
          role={session?.user?.role}
        />
        <div className="flex-1">{children}</div>
      </div>
    </DashboardProviders>
  );
}
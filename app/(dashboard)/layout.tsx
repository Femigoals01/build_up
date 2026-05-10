




import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardProviders from "./DashboardProviders";
import SidebarShell from "@/components/sidebar/SidebarShell";
import SidebarContent from "@/components/sidebar/SidebarContent";
import Footer from "@/components/Footer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <DashboardProviders>
      <div className="flex h-screen w-full max-w-full flex-col overflow-hidden bg-slate-50">
        {/* HEADER - stays at top */}
        <DashboardHeader
          name={session?.user?.name}
          role={session?.user?.role}
        />

        {/* BODY - fixed height area */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* SIDEBAR - does not move when content scrolls */}
          <aside className="hidden h-full shrink-0 overflow-y-auto xl:block">
            <SidebarShell>
              <SidebarContent user={session?.user || {}} />
            </SidebarShell>
          </aside>

          {/* MAIN CONTENT - only this scrolls */}
          <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
            {children}

            <Footer />
          </main>
        </div>
      </div>
    </DashboardProviders>
  );
}
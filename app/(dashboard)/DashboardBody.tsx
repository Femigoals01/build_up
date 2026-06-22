




"use client";

import { usePathname } from "next/navigation";
import SidebarShell from "@/components/sidebar/SidebarShell";
import SidebarContent from "@/components/sidebar/SidebarContent";
import Footer from "@/components/Footer";
import PlatformReviewPrompt from "@/components/reviews/PlatformReviewPrompt";

export default function DashboardBody({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) {
  const pathname = usePathname();

  const isCommunityPage = pathname.startsWith("/dashboard/community");

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {!isCommunityPage && (
        <SidebarShell>
          <SidebarContent user={user || {}} />
        </SidebarShell>
      )}

      <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
        {children}

        {!isCommunityPage && <Footer />}
        {!isCommunityPage && <PlatformReviewPrompt />}
      </main>
    </div>
  );
}





// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import DashboardHeader from "@/components/dashboard/DashboardHeader";
// import DashboardProviders from "./DashboardProviders";
// import SidebarShell from "@/components/sidebar/SidebarShell";
// import SidebarContent from "@/components/sidebar/SidebarContent";
// import Footer from "@/components/Footer";

// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const session = await getServerSession(authOptions);

//   return (
//     <DashboardProviders>
//       <div className="min-h-screen flex flex-col bg-slate-50">

//         {/* HEADER */}
//         <DashboardHeader
//           name={session?.user?.name}
//           role={session?.user?.role}
//         />

//         {/* BODY */}
//         <div className="flex flex-1">

//           {/* 🔥 SIDEBAR (NOW GLOBAL) */}
//           <SidebarShell>
//             <SidebarContent user={session?.user || {}} />
//           </SidebarShell>

//           {/* 🔥 MAIN CONTENT (AUTO EXPANDS) */}
//           <main className="flex-1 transition-all duration-300 px-4 py-6 md:px-6 lg:px-8">
//             {children}
//           </main>
//         </div>

//         {/* FOOTER */}
//         <Footer />
//       </div>
//     </DashboardProviders>
//   );
// }




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
      <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-hidden bg-slate-50">
        <DashboardHeader
          name={session?.user?.name}
          role={session?.user?.role}
        />

        <div className="flex min-w-0 flex-1">
          <aside className="hidden shrink-0 xl:block">
            <SidebarShell>
              <SidebarContent user={session?.user || {}} />
            </SidebarShell>
          </aside>

          <main className="min-w-0 flex-1 overflow-x-hidden px-0 py-0 transition-all duration-300">
            {children}
          </main>
        </div>

        <Footer />
      </div>
    </DashboardProviders>
  );
}
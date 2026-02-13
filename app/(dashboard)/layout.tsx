
// import "../globals.css";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import DashboardHeader from "@/components/dashboard/DashboardHeader";

// export default async function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const session = await getServerSession(authOptions);

//   return (
//     <html lang="en">
//       <body className="bg-gray-50 text-gray-900">
//         <div className="min-h-screen flex flex-col">

//           {/* TOP HEADER */}
//           <DashboardHeader
//             name={session?.user?.name}
//             role={session?.user?.role}
//           />

//           {/* PAGE CONTENT */}
//           <div className="flex-1">
//             {children}
//           </div>

//         </div>
//       </body>
//     </html>
//   );
// }


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
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <DashboardProviders>
          <div className="min-h-screen flex flex-col">

            {/* TOP HEADER */}
            <DashboardHeader
              name={session?.user?.name}
              role={session?.user?.role}
            />

            {/* PAGE CONTENT */}
            <div className="flex-1">
              {children}
            </div>

          </div>
        </DashboardProviders>
      </body>
    </html>
  );
}

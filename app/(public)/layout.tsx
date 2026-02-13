import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "BuildUp - Volunteer & Portfolio Builder",
  description: "A platform connecting volunteers, organizations, and mentors.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">

        {/* NAVBAR - appears on EVERY page */}
        <Navbar />

        {/* MAIN CONTENT */}
        <div className="min-h-screen">
          {children}
        </div>

        {/* FOOTER - appears on EVERY page */}
        <Footer />

      </body>
    </html>
  );
}







import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DiscoveryBar from "@/components/landing/DiscoveryBar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
 {/* 🔥 DISCOVERY BAR */}
        <DiscoveryBar />
      <div className="min-h-screen">{children}</div>

      <Footer />
    </>
  );
}
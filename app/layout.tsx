



import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
        <Analytics /> 
      </body>
    </html>
  );
}




// import "./globals.css";
// import SessionProviderWrapper from "@/components/SessionProviderWrapper";
// import { Analytics } from "@vercel/analytics/next";
// import { SpeedInsights } from "@vercel/speed-insights/next"

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className="bg-gray-50 text-gray-900">
//         <SessionProviderWrapper>
//           {children}
//         </SessionProviderWrapper>
//         <Analytics /> 
//         <SpeedInsights />
//       </body>
//     </html>
//   );
// }






// import type { Metadata } from "next";
// import "./globals.css";
// import SessionProviderWrapper from "@/components/SessionProviderWrapper";
// import { Analytics } from "@vercel/analytics/next";
// import { SpeedInsights } from "@vercel/speed-insights/next";

// export const metadata: Metadata = {
//   metadataBase: new URL("https://www.buildup.com"),
//   title: {
//     default: "BuildUp | Build real experience. Not just certificates.",
//     template: "%s | BuildUp",
//   },
//   description:
//     "BuildUp connects volunteers, mentors, and organizations through live projects, real-world experience, and portfolio-ready proof of work.",
//   keywords: [
//     "BuildUp",
//     "real-world experience",
//     "live projects",
//     "volunteer platform",
//     "mentorship platform",
//     "project-based learning",
//     "portfolio building",
//     "organizations",
//     "mentors",
//     "volunteers",
//     "internship platform",
//     "real work experience",
//     "skill development",
//     "career growth",
//     "professional development",
//     "volunteer projects",
//     "real experience",
//   ],
//   applicationName: "BuildUp",
//   authors: [{ name: "BuildUp" }],
//   creator: "BuildUp",
//   publisher: "BuildUp",
//   alternates: {
//     canonical: "/",
//   },
//   openGraph: {
//     type: "website",
//     url: "https://www.buildup.com",
//     siteName: "BuildUp",
//     title: "BuildUp | Build real experience. Not just certificates.",
//     description:
//       "Gain real-world experience through live projects, mentor guidance, and portfolio-ready proof of work.",
//     images: [
//       {
//         url: "/og-image.png",
//         width: 1200,
//         height: 630,
//         alt: "BuildUp - Build real experience. Not just certificates.",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "BuildUp | Build real experience. Not just certificates.",
//     description:
//       "Gain real-world experience through live projects, mentor guidance, and portfolio-ready proof of work.",
//     images: ["/og-image.png"],
//   },
//   robots: {
//     index: true,
//     follow: true,
//   },
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className="bg-gray-50 text-gray-900">
//         <SessionProviderWrapper>{children}</SessionProviderWrapper>
//         <Analytics />
//         <SpeedInsights />
//       </body>
//     </html>
//   );
// }



import type { Metadata, Viewport } from "next";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.buildup.com"),

  title: {
    default: "BuildUp | Build real experience. Not just certificates.",
    template: "%s | BuildUp",
  },

  description:
    "BuildUp connects volunteers, mentors, and organizations through live projects, real-world experience, and portfolio-ready proof of work.",

  keywords: [
    "BuildUp",
    "real-world experience",
    "live projects",
    "volunteer platform",
    "mentorship platform",
    "project-based learning",
    "portfolio building",
    "organizations",
    "mentors",
    "volunteers",
    "internship platform",
    "real work experience",
    "skill development",
    "career growth",
    "professional development",
    "volunteer projects",
    "real experience",
    "proof of work",
    "mentor guidance",
    "career readiness",
    "project-based mentorship",
    "hands-on learning",
  ],

  applicationName: "BuildUp",
  authors: [{ name: "BuildUp" }],
  creator: "BuildUp",
  publisher: "BuildUp",
  category: "education",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "https://www.buildup.com",
    siteName: "BuildUp",
    title: "BuildUp | Build real experience. Not just certificates.",
    description:
      "Gain real-world experience through live projects, mentor guidance, and portfolio-ready proof of work.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BuildUp - Build real experience. Not just certificates.",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "BuildUp | Build real experience. Not just certificates.",
    description:
      "Gain real-world experience through live projects, mentor guidance, and portfolio-ready proof of work.",
    images: ["/og-image.png"],
    creator: "@BuildUp",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  appleWebApp: {
    capable: true,
    title: "BuildUp",
    statusBarStyle: "default",
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
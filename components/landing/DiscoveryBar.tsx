



// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// const items = [
//   { label: "🔥 Trending", href: "/projects" },
//   { label: "💼 Live Projects", href: "/projects" },
//   { label: "👨‍💻 Volunteers", href: "/volunteers" },
//   { label: "🏢 Organizations", href: "/organizations" },
//   { label: "🧠 Mentors", href: "/mentors" },
//   { label: "💰 Stipend Projects", href: "/projects?stipend=true" },
//   { label: "🌍 Remote Projects", href: "/projects?remote=true" },
//   { label: "🏆 Proof of Work", href: "/proof-of-work" },
//   { label: "✨ Success Stories", href: "/success-stories" },
//   { label: "⚙️ How It Works", href: "/how-it-works" },
// ];

// export default function DiscoveryBar() {
//   const pathname = usePathname();

//   return (
//     <div className="sticky top-[72px] z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
//       <div className="mx-auto max-w-[1600px]">
//         <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto px-4 py-3 lg:px-8">
//           {items.map((item) => {
//             const active =
//               pathname === item.href ||
//               (item.href !== "/" && pathname.startsWith(item.href));

//             return (
//               <Link
//                 key={item.label}
//                 href={item.href}
//                 className={`group relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
//                   active
//                     ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
//                     : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700"
//                 }`}
//               >
//                 <span className="relative z-10">{item.label}</span>

//                 {!active && (
//                   <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-indigo-500/0 opacity-0 transition group-hover:opacity-100" />
//                 )}
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }





"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";

const items = [
  { label: "Trending", href: "/projects" },
  { label: "Live Projects", href: "/projects" },
  { label: "Volunteers", href: "/volunteers" },
  { label: "Organizations", href: "/organizations" },
  { label: "Mentors", href: "/mentors" },
  { label: "Stipend Projects", href: "/projects?stipend=true" },
  { label: "Remote Projects", href: "/projects?remote=true" },
  { label: "Proof of Work", href: "/proof-of-work" },
  { label: "Success Stories", href: "/success-stories" },
  { label: "How It Works", href: "/how-it-works" },
];

export default function DiscoveryBar() {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  return (
    <div className="sticky top-[72px] z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto max-w-[1600px] px-3 lg:px-6">
        <div className="relative flex items-center py-3">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll discovery navigation left"
            className="z-20 mr-2 hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 md:flex"
          >
            ‹
          </button>

          <div className="pointer-events-none absolute left-12 top-0 z-10 hidden h-full w-12 bg-gradient-to-r from-white to-transparent md:block" />

          <div
            ref={scrollRef}
            className="scrollbar-hide flex flex-1 items-center gap-2 overflow-x-auto scroll-smooth px-1"
          >
            {items.map((item) => {
              const cleanHref = item.href.split("?")[0];

              const active =
                pathname === cleanHref ||
                (cleanHref !== "/" && pathname.startsWith(cleanHref));

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                      : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>

                  {!active && (
                    <span className="absolute inset-0 rounded-full opacity-0 ring-1 ring-blue-200 transition group-hover:opacity-100" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pointer-events-none absolute right-12 top-0 z-10 hidden h-full w-12 bg-gradient-to-l from-white to-transparent md:block" />

          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll discovery navigation right"
            className="z-20 ml-2 hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 md:flex"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}







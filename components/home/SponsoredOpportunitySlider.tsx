



// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useMemo, useRef, useState } from "react";

// type SponsoredOpportunity = {
//   id: string;
//   title: string;
//   description: string;
//   type: string;
//   workMode?: string | null;
//   location?: string | null;
//   compensation?: string | null;
//   imageUrl?: string | null;
//   organization: {
//     name: string;
//     organizationVerified?: boolean;
//   };
// };

// function getOpportunityIcon(type: string) {
//   if (type === "JOB") return "💼";
//   if (type === "PROMOTION") return "📢";
//   if (type === "EVENT") return "🎟️";
//   if (type === "COURSE") return "🎓";
//   return "🛠️";
// }

// function formatType(type: string) {
//   return type
//     .toLowerCase()
//     .replace(/_/g, " ")
//     .replace(/\b\w/g, (char) => char.toUpperCase());
// }

// async function trackOpportunityEvent({
//   opportunityId,
//   eventType,
// }: {
//   opportunityId: string;
//   eventType: "SPONSORED_VIEW" | "VIEW_DETAILS_CLICK";
// }) {
//   try {
//     await fetch("/api/opportunity-analytics", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       keepalive: true,
//       body: JSON.stringify({
//         opportunityId,
//         eventType,
//         source: "HOME_SPONSORED_SLIDER",
//       }),
//     });
//   } catch {
//     // Analytics should never break the homepage.
//   }
// }

// export default function SponsoredOpportunitySlider({
//   opportunities,
//   compact = false,
// }: {
//   opportunities: SponsoredOpportunity[];
//   compact?: boolean;
// }) {
//   const items = useMemo(() => opportunities || [], [opportunities]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const viewedItemsRef = useRef<Set<string>>(new Set());

//   const active = items[activeIndex];
//   // const sliderHeight = compact ? "h-[320px] md:h-[320px]" : "h-[420px]";
//   const sliderHeight = compact ? "h-[430px] md:h-[320px]" : "h-[460px]";

//   useEffect(() => {
//     if (!active?.id) return;
//     if (viewedItemsRef.current.has(active.id)) return;

//     viewedItemsRef.current.add(active.id);

//     trackOpportunityEvent({
//       opportunityId: active.id,
//       eventType: "SPONSORED_VIEW",
//     });
//   }, [active?.id]);

//   useEffect(() => {
//     if (items.length <= 1) return;

//     const timer = setInterval(() => {
//       setActiveIndex((prev) => (prev + 1) % items.length);
//     }, 5000);

//     return () => clearInterval(timer);
//   }, [items.length]);

//   function goNext() {
//     if (items.length === 0) return;
//     setActiveIndex((prev) => (prev + 1) % items.length);
//   }

//   function goPrev() {
//     if (items.length === 0) return;
//     setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
//   }

//   if (!active) {
//     return (
//       <section
//         className={`flex ${
//           compact ? "min-h-[320px]" : "min-h-[420px]"
//         } items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm`}
//       >
//         <div>
//           <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
//             📢
//           </div>

//           <h3 className="mt-4 text-lg font-black text-slate-900">
//             Sponsored spotlight is open
//           </h3>

//           <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
//             Promoted opportunities will appear here when organizations sponsor
//             their listings.
//           </p>

//           <Link
//             href="/register/organization"
//             className="relative z-30 mt-5 inline-flex h-10 items-center justify-center rounded-2xl bg-blue-600 px-5 text-xs font-black text-white transition hover:bg-blue-700"
//           >
//             Promote Your Opportunity
//           </Link>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="overflow-hidden rounded-[28px] border border-purple-200 bg-white shadow-xl shadow-purple-100/60">
//       <div className={`relative ${sliderHeight} overflow-hidden bg-slate-100`}>
//         <div
//           className="flex h-full transition-transform duration-700 ease-in-out"
//           style={{ transform: `translateX(-${activeIndex * 100}%)` }}
//         >
//           {items.map((item) => (
//             <Link
//               key={item.id}
//               href={`/marketplace/${item.id}`}
//               onClick={() =>
//                 trackOpportunityEvent({
//                   opportunityId: item.id,
//                   eventType: "VIEW_DETAILS_CLICK",
//                 })
//               }
//               // className="grid h-full w-full shrink-0 md:grid-cols-[35%_65%]"
//               className="grid h-full w-full shrink-0 grid-rows-[1fr_135px] md:grid-rows-none md:grid-cols-[35%_65%]"
//             >
//               <div className="relative flex min-h-0 flex-col justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4 py-4 text-white sm:px-5">
//                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,.25),transparent_45%)]" />

//                 <div className="relative z-30">
//                   <div className="flex flex-wrap gap-1.5">
//                     <span className="rounded-full bg-purple-600 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-white">
//                       Sponsored
//                     </span>

//                     <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-black text-blue-700">
//                       {getOpportunityIcon(item.type)} {formatType(item.type)}
//                     </span>
//                   </div>

//                   <div className="mt-4 flex flex-wrap items-center gap-2">
//                     <p className="line-clamp-1 text-xs font-black text-white sm:text-sm">
//                       {item.organization.name}
//                     </p>

//                     {item.organization.organizationVerified && (
//                       <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-700">
//                         ✅ Verified
//                       </span>
//                     )}
//                   </div>

//                   <h2 className="mt-2 line-clamp-3 text-xl font-black leading-tight text-white sm:text-2xl">
//                     {item.title}
//                   </h2>

//                   <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-300">
//                     {item.description}
//                   </p>

//                   <div className="mt-2 flex flex-wrap gap-1.5">
//                     {item.workMode && (
//                       <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-black backdrop-blur">
//                         {item.workMode}
//                       </span>
//                     )}

//                     {item.location && (
//                       <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-black backdrop-blur">
//                         📍 {item.location}
//                       </span>
//                     )}

//                     {item.compensation && (
//                       <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-black backdrop-blur">
//                         💰 {item.compensation}
//                       </span>
//                     )}
//                   </div>

//                   <div className="mt-4 inline-flex h-9 items-center justify-center rounded-xl bg-white px-4 text-xs font-black text-blue-700 shadow-lg transition group-hover:bg-blue-50">
//                     Click to view details →
//                   </div>
//                 </div>
//               </div>

//               <div className="relative min-h-0 overflow-hidden bg-slate-950">
//                 {item.imageUrl ? (
//                   <>
//                     <Image
//                       src={item.imageUrl}
//                       alt=""
//                       fill
//                       className="scale-110 object-cover opacity-30 blur-2xl"
//                       sizes="(min-width:1024px) 65vw, 100vw"
//                     />

//                     <Image
//                       src={item.imageUrl}
//                       alt={item.title}
//                       fill
//                       className="object-cover md:object-contain"
//                       sizes="(min-width:1024px) 65vw, 100vw"
//                       priority={item.id === active.id}
//                     />
//                   </>
//                 ) : (
//                   <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-white">
//                     <div className="text-center">
//                       <div className="text-7xl">
//                         {getOpportunityIcon(item.type)}
//                       </div>

//                       <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-slate-400">
//                         Sponsored Opportunity
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </Link>
//           ))}
//         </div>

//         {items.length > 1 && (
//           <>
//             <button
//               type="button"
//               onClick={goPrev}
//               className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg font-black text-slate-900 shadow-lg transition hover:bg-white"
//               aria-label="Previous sponsored opportunity"
//             >
//               ←
//             </button>

//             <button
//               type="button"
//               onClick={goNext}
//               className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg font-black text-slate-900 shadow-lg transition hover:bg-white"
//               aria-label="Next sponsored opportunity"
//             >
//               →
//             </button>
//           </>
//         )}
//       </div>

//       {items.length > 1 && (
//         <div className="flex items-center justify-between gap-4 border-t border-slate-200 bg-white px-4 py-3">
//           <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 sm:text-xs">
//             {activeIndex + 1} of {items.length} sponsored listings
//           </p>

//           <div className="flex gap-2">
//             {items.map((item, index) => (
//               <button
//                 key={item.id}
//                 type="button"
//                 onClick={() => setActiveIndex(index)}
//                 className={`h-2.5 rounded-full transition-all duration-500 ${
//                   activeIndex === index
//                     ? "w-7 bg-purple-600"
//                     : "w-2.5 bg-slate-300 hover:bg-slate-400"
//                 }`}
//                 aria-label={`Go to sponsored opportunity ${index + 1}`}
//               />
//             ))}
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }




"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type SponsoredOpportunity = {
  id: string;
  title: string;
  description: string;
  type: string;
  workMode?: string | null;
  location?: string | null;
  compensation?: string | null;
  imageUrl?: string | null;
  organization: {
    name: string;
    organizationVerified?: boolean;
  };
};

function getOpportunityIcon(type: string) {
  if (type === "JOB") return "💼";
  if (type === "PROMOTION") return "📢";
  if (type === "EVENT") return "🎟️";
  if (type === "COURSE") return "🎓";
  return "🛠️";
}

function formatType(type: string) {
  return type
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function trackOpportunityEvent({
  opportunityId,
  eventType,
}: {
  opportunityId: string;
  eventType: "SPONSORED_VIEW" | "VIEW_DETAILS_CLICK";
}) {
  try {
    await fetch("/api/opportunity-analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        opportunityId,
        eventType,
        source: "HOME_SPONSORED_SLIDER",
      }),
    });
  } catch {}
}

export default function SponsoredOpportunitySlider({
  opportunities,
  compact = false,
}: {
  opportunities: SponsoredOpportunity[];
  compact?: boolean;
}) {
  const items = useMemo(() => opportunities || [], [opportunities]);
  const [activeIndex, setActiveIndex] = useState(0);
  const viewedItemsRef = useRef<Set<string>>(new Set());

  const active = items[activeIndex];
  const sliderHeight = compact ? "h-[430px] md:h-[320px]" : "h-[460px]";

  useEffect(() => {
    if (!active?.id) return;
    if (viewedItemsRef.current.has(active.id)) return;

    viewedItemsRef.current.add(active.id);

    trackOpportunityEvent({
      opportunityId: active.id,
      eventType: "SPONSORED_VIEW",
    });
  }, [active?.id]);

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [items.length]);

  function goNext() {
    if (items.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % items.length);
  }

  function goPrev() {
    if (items.length === 0) return;
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  }

  if (!active) {
    return (
      <section
        className={`flex ${
          compact ? "min-h-[320px]" : "min-h-[420px]"
        } items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm`}
      >
        <div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
            📢
          </div>

          <h3 className="mt-4 text-lg font-black text-slate-900">
            Sponsored spotlight is open
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Promoted opportunities will appear here when organizations sponsor
            their listings.
          </p>

          <Link
            href="/register/organization"
            className="relative z-30 mt-5 inline-flex h-10 items-center justify-center rounded-2xl bg-blue-600 px-5 text-xs font-black text-white transition hover:bg-blue-700"
          >
            Promote Your Opportunity
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-[28px] border border-purple-200 bg-white shadow-xl shadow-purple-100/60">
      <div className={`relative ${sliderHeight} overflow-hidden bg-slate-100`}>
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {items.map((item) => (
            <div key={item.id} className="relative h-full w-full shrink-0">
              {/* MOBILE PREMIUM OVERLAY VERSION */}
              <Link
                href={`/marketplace/${item.id}`}
                onClick={() =>
                  trackOpportunityEvent({
                    opportunityId: item.id,
                    eventType: "VIEW_DETAILS_CLICK",
                  })
                }
                className="relative block h-full w-full overflow-hidden md:hidden"
              >
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={item.id === active.id}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-700 via-blue-800 to-slate-950 text-7xl">
                    {getOpportunityIcon(item.type)}
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 to-black/25" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,.35),transparent_45%)]" />

                <div className="absolute inset-x-0 bottom-0 z-20 p-5 text-white">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-purple-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-white">
                      Sponsored
                    </span>

                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-blue-700">
                      {getOpportunityIcon(item.type)} {formatType(item.type)}
                    </span>
                  </div>

                  <p className="mt-4 line-clamp-1 text-sm font-black text-white">
                    {item.organization.name}
                  </p>

                  <h2 className="mt-2 line-clamp-2 text-2xl font-black leading-tight text-white">
                    {item.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-200">
                    {item.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.workMode && (
                      <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-black backdrop-blur">
                        {item.workMode}
                      </span>
                    )}

                    {item.location && (
                      <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-black backdrop-blur">
                        📍 {item.location}
                      </span>
                    )}

                    {item.compensation && (
                      <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-black backdrop-blur">
                        💰 {item.compensation}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 inline-flex h-10 items-center justify-center rounded-2xl bg-white px-5 text-xs font-black text-blue-700 shadow-lg">
                    View Details →
                  </div>
                </div>
              </Link>

              {/* DESKTOP/TABLET SPLIT VERSION */}
              <Link
                href={`/marketplace/${item.id}`}
                onClick={() =>
                  trackOpportunityEvent({
                    opportunityId: item.id,
                    eventType: "VIEW_DETAILS_CLICK",
                  })
                }
                className="hidden h-full w-full shrink-0 md:grid md:grid-cols-[35%_65%]"
              >
                <div className="relative flex min-h-0 flex-col justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4 py-4 text-white sm:px-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,.25),transparent_45%)]" />

                  <div className="relative z-30">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-purple-600 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-white">
                        Sponsored
                      </span>

                      <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-black text-blue-700">
                        {getOpportunityIcon(item.type)} {formatType(item.type)}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <p className="line-clamp-1 text-xs font-black text-white sm:text-sm">
                        {item.organization.name}
                      </p>

                      {item.organization.organizationVerified && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-700">
                          ✅ Verified
                        </span>
                      )}
                    </div>

                    <h2 className="mt-2 line-clamp-3 text-xl font-black leading-tight text-white sm:text-2xl">
                      {item.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-300">
                      {item.description}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.workMode && (
                        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-black backdrop-blur">
                          {item.workMode}
                        </span>
                      )}

                      {item.location && (
                        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-black backdrop-blur">
                          📍 {item.location}
                        </span>
                      )}

                      {item.compensation && (
                        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-black backdrop-blur">
                          💰 {item.compensation}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 inline-flex h-9 items-center justify-center rounded-xl bg-white px-4 text-xs font-black text-blue-700 shadow-lg transition group-hover:bg-blue-50">
                      Click to view details →
                    </div>
                  </div>
                </div>

                <div className="relative min-h-0 overflow-hidden bg-slate-950">
                  {item.imageUrl ? (
                    <>
                      <Image
                        src={item.imageUrl}
                        alt=""
                        fill
                        className="scale-110 object-cover opacity-30 blur-2xl"
                        sizes="(min-width:1024px) 65vw, 100vw"
                      />

                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-contain"
                        sizes="(min-width:1024px) 65vw, 100vw"
                        priority={item.id === active.id}
                      />
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-white">
                      <div className="text-center">
                        <div className="text-7xl">
                          {getOpportunityIcon(item.type)}
                        </div>

                        <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-slate-400">
                          Sponsored Opportunity
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg font-black text-slate-900 shadow-lg transition hover:bg-white"
              aria-label="Previous sponsored opportunity"
            >
              ←
            </button>

            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lg font-black text-slate-900 shadow-lg transition hover:bg-white"
              aria-label="Next sponsored opportunity"
            >
              →
            </button>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="flex items-center justify-between gap-4 border-t border-slate-200 bg-white px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 sm:text-xs">
            {activeIndex + 1} of {items.length} sponsored listings
          </p>

          <div className="flex gap-2">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  activeIndex === index
                    ? "w-7 bg-purple-600"
                    : "w-2.5 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to sponsored opportunity ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
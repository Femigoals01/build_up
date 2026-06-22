


// "use client";

// import { useEffect, useState } from "react";

// type Review = {
//   id: string;
//   review: string | null;
//   overallRating: number;
//   user: {
//     name: string;
//     role: string;
//   };
// };

// export default function PlatformReviewSlider({
//   reviews,
// }: {
//   reviews: Review[];
// }) {
//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     if (reviews.length <= 1) return;

//     const timer = setInterval(() => {
//       setActiveIndex((prev) => (prev + 1) % reviews.length);
//     }, 5000);

//     return () => clearInterval(timer);
//   }, [reviews.length]);

//   if (reviews.length === 0) {
//     return (
//       <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-6 text-center text-sm font-bold text-blue-100">
//         Approved user reviews will appear here soon.
//       </div>
//     );
//   }

//   const active = reviews[activeIndex];

//   return (
//     <div className="mt-6">
//       <article className="mx-auto max-w-3xl rounded-[30px] border border-white/10 bg-white/10 p-6 text-center backdrop-blur transition-all duration-500 sm:p-8">
//         <div className="text-2xl text-amber-300">
//           {"★".repeat(active.overallRating)}
//           {"☆".repeat(5 - active.overallRating)}
//         </div>

//         <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold leading-8 text-blue-50 sm:text-xl">
//           “
//           {active.review ||
//             "BuildUp has been a helpful platform for real experience and growth."}
//           ”
//         </p>

//         <div className="mt-6">
//           <p className="text-base font-black text-white">{active.user.name}</p>

//           <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
//             {active.user.role}
//           </p>
//         </div>
//       </article>

//       {reviews.length > 1 && (
//         <div className="mt-5 flex items-center justify-center gap-2">
//           {reviews.map((review, index) => (
//             <button
//               key={review.id}
//               type="button"
//               onClick={() => setActiveIndex(index)}
//               className={`h-2.5 rounded-full transition-all ${
//                 activeIndex === index
//                   ? "w-8 bg-amber-300"
//                   : "w-2.5 bg-white/30 hover:bg-white/50"
//               }`}
//               aria-label={`Show review ${index + 1}`}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }





"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Review = {
    id: string;
    review: string | null;
    overallRating: number;
    user: {
        name: string;
        role: string;
        profileImageUrl?: string | null;
    };
};

function getInitial(name?: string | null) {
    return name?.trim()?.charAt(0)?.toUpperCase() || "U";
}

export default function PlatformReviewSlider({
    reviews,
}: {
    reviews: Review[];
}) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (reviews.length <= 1) return;

        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % reviews.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [reviews.length]);

    if (reviews.length === 0) {
        return (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-6 text-center text-sm font-bold text-blue-100">
                Approved user reviews will appear here soon.
            </div>
        );
    }

    const active = reviews[activeIndex];

    return (
        <div className="mt-6">
            <article className="mx-auto max-w-3xl rounded-[30px] border border-white/10 bg-white/10 p-6 text-center backdrop-blur transition-all duration-500 sm:p-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-white/20 bg-blue-600 text-lg font-black text-white shadow-lg">
                    {active.user.profileImageUrl ? (
                        <Image
                            src={active.user.profileImageUrl}
                            alt={active.user.name}
                            width={64}
                            height={64}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        getInitial(active.user.name)
                    )}
                </div>

                <div className="text-2xl text-amber-300">
                    {"★".repeat(active.overallRating)}
                    {"☆".repeat(5 - active.overallRating)}
                </div>

                

                <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold leading-8 text-blue-50 sm:text-xl">
                    “
                    {active.review ||
                        "BuildUp has been a helpful platform for real experience and growth."}
                    ”
                </p>

                <div className="mt-6">
                    <p className="text-base font-black text-white">{active.user.name}</p>

                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-blue-200">
                        {active.user.role}
                    </p>

                    <div className="mt-2 flex items-center justify-center gap-2">
                        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300">
                            ✓ Verified BuildUp User
                        </span>
                    </div>


                </div>
            </article>

            {reviews.length > 1 && (
                <div className="mt-5 flex items-center justify-center gap-2">
                    {reviews.map((review, index) => (
                        <button
                            key={review.id}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            className={`h-2.5 rounded-full transition-all ${activeIndex === index
                                    ? "w-8 bg-amber-300"
                                    : "w-2.5 bg-white/30 hover:bg-white/50"
                                }`}
                            aria-label={`Show review ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}



// "use client";

// import { useEffect, useState } from "react";

// const LINES = [
//   "Build real experience.",
//   "Not just certificates.",
// ];

// export default function TypewriterHero() {
//   const [text, setText] = useState("");
//   const [lineIndex, setLineIndex] = useState(0);
//   const [charIndex, setCharIndex] = useState(0);
//   const [deleting, setDeleting] = useState(false);

//   useEffect(() => {
//     const current = LINES[lineIndex];

//     const speed = deleting ? 40 : 80;

//     const timeout = setTimeout(() => {
//       if (!deleting) {
//         setText(current.substring(0, charIndex + 1));
//         setCharIndex((prev) => prev + 1);

//         if (charIndex + 1 === current.length) {
//           setTimeout(() => setDeleting(true), 2000);
//         }
//       } else {
//         setText(current.substring(0, charIndex - 1));
//         setCharIndex((prev) => prev - 1);

//         if (charIndex === 0) {
//           setDeleting(false);
//           setLineIndex((prev) => (prev + 1) % LINES.length);
//         }
//       }
//     }, speed);

//     return () => clearTimeout(timeout);
//   }, [charIndex, deleting, lineIndex]);

//   return (
//     <h1 className="mt-5 text-[2.6rem] font-extrabold leading-[0.95] tracking-tight text-slate-950 sm:text-[3.4rem] md:text-[4.25rem] lg:mt-6 lg:text-[5.25rem]">
//       {text}
//       <span className="animate-pulse text-blue-600">|</span>
//     </h1>
//   );
// }



"use client";

import { useEffect, useState } from "react";

const LINES = [
  "Build real experience.",
  "Not just certificates.",
];

export default function TypewriterHero() {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = LINES[lineIndex];

    const speed = deleting ? 40 : 70;

    const timeout = setTimeout(() => {
      if (!deleting) {
        setCharIndex((prev) => prev + 1);

        // when FULL line typed → wait → then delete
        if (charIndex + 1 === current.length) {
          setTimeout(() => setDeleting(true), 2000);
        }
      } else {
        setCharIndex((prev) => prev - 1);

        // when fully deleted → move to next line
        if (charIndex === 0) {
          setDeleting(false);
          setLineIndex((prev) => (prev + 1) % LINES.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, lineIndex]);

  const currentLine = LINES[lineIndex];
  const displayed = currentLine.substring(0, charIndex);

  return (
    <h1 className="mt-5 text-[2.6rem] font-extrabold leading-[0.95] tracking-tight text-slate-950 sm:text-[3.4rem] md:text-[4.25rem] lg:mt-6 lg:text-[5.25rem]">
      <span
        className={
          currentLine === "Not just certificates."
            ? "text-blue-600"
            : ""
        }
      >
        {displayed}
      </span>

      <span className="ml-1 animate-pulse text-blue-600">|</span>
    </h1>
  );
}
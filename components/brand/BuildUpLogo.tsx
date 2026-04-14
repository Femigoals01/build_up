


import Image from "next/image";
import Link from "next/link";

type Props = {
  href?: string;
  showTagline?: boolean;
  dark?: boolean;
  className?: string;
  imageClassName?: string;
  textSize?: "sm" | "md" | "lg";
};

export default function BuildUpLogo({
  href = "/",
  showTagline = true,
  dark = false,
  className = "",
  imageClassName = "",
  textSize = "md",
}: Props) {
  const titleSize =
    textSize === "sm"
      ? "text-base"
      : textSize === "lg"
      ? "text-2xl"
      : "text-lg";

  const textColor = dark ? "text-white" : "text-slate-900";
  const subColor = dark ? "text-slate-400" : "text-slate-400";

  return (
    <Link href={href} className={`group flex items-center gap-3 ${className}`}>
      <div
        className={`relative h-11 w-11 overflow-hidden rounded-2xl bg-white ${imageClassName}`}
      >
        <Image
          src="/brand/buildup-logo.png"
          alt="BuildUp logo"
          fill
          className="object-contain"
          sizes="44px"
          priority
        />
      </div>

      <div className="leading-tight">
        <span
          className={`block font-extrabold tracking-tight ${titleSize} ${textColor}`}
        >
          BuildUp
        </span>

        {showTagline && (
          <span
            className={`hidden text-[11px] font-medium uppercase tracking-[0.18em] sm:block ${subColor}`}
          >
            Real projects. Real growth.
          </span>
        )}
      </div>
    </Link>
  );
}



// import Image from "next/image";
// import Link from "next/link";

// type Props = {
//   href?: string;
//   className?: string;
//   imageClassName?: string;
// };

// export default function BuildUpLogo({
//   href = "/",
//   className = "",
//   imageClassName = "",
// }: Props) {
//   return (
//     <Link href={href} className={`inline-flex items-center ${className}`}>
//       <Image
//         src="/brand/buildup-logo.png"
//         alt="BuildUp logo"
//         width={44}
//         height={44}
//         priority
//         className={imageClassName}
//       />
//     </Link>
//   );
// }


import Image from "next/image";

type Props = {
  name?: string | null;
  imageUrl?: string | null;
  size?: number;
  className?: string;
  textClassName?: string;
};

function getInitials(name?: string | null) {
  if (!name?.trim()) return "U";

  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
}

export default function UserAvatar({
  name,
  imageUrl,
  size = 40,
  className = "",
  textClassName = "",
}: Props) {
  const initials = getInitials(name);

  return (
    <div
      className={`relative overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm ${className}`}
      style={{ width: size, height: size }}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name || "User avatar"}
          fill
          className="object-cover"
          sizes={`${size}px`}
        />
      ) : (
        <div className={`flex h-full w-full items-center justify-center font-bold ${textClassName}`}>
          {initials}
        </div>
      )}
    </div>
  );
}
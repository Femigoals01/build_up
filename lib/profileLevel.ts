export type ProfileLevelName =
  | "Beginner"
  | "Explorer"
  | "Builder"
  | "Pro"
  | "Elite";

export type ProfileLevel = {
  name: ProfileLevelName;
  min: number;
  max: number;
  icon: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
};

const LEVELS: ProfileLevel[] = [
  {
    name: "Beginner",
    min: 0,
    max: 25,
    icon: "🌱",
    colorClass: "text-slate-700",
    bgClass: "bg-slate-50",
    borderClass: "border-slate-200",
  },
  {
    name: "Explorer",
    min: 26,
    max: 50,
    icon: "🧭",
    colorClass: "text-amber-700",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200",
  },
  {
    name: "Builder",
    min: 51,
    max: 75,
    icon: "🛠️",
    colorClass: "text-blue-700",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-200",
  },
  {
    name: "Pro",
    min: 76,
    max: 99,
    icon: "🚀",
    colorClass: "text-indigo-700",
    bgClass: "bg-indigo-50",
    borderClass: "border-indigo-200",
  },
  {
    name: "Elite",
    min: 100,
    max: 100,
    icon: "👑",
    colorClass: "text-emerald-700",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
  },
];

export function getProfileLevel(score: number): ProfileLevel {
  const safeScore = Math.max(0, Math.min(100, score));

  return (
    LEVELS.find((level) => safeScore >= level.min && safeScore <= level.max) ??
    LEVELS[0]
  );
}

export function getNextProfileLevel(score: number): ProfileLevel | null {
  const safeScore = Math.max(0, Math.min(100, score));

  for (let i = 0; i < LEVELS.length; i++) {
    const current = LEVELS[i];
    if (safeScore >= current.min && safeScore <= current.max) {
      return LEVELS[i + 1] ?? null;
    }
  }

  return null;
}

export function getLevelProgress(score: number): number {
  const safeScore = Math.max(0, Math.min(100, score));
  const current = getProfileLevel(safeScore);

  if (current.min === current.max) return 100;

  const raw = ((safeScore - current.min) / (current.max - current.min)) * 100;
  return Math.max(0, Math.min(100, Math.round(raw)));
}
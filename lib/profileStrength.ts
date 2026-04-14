
export type ProfileStrengthInput = {
  username?: string | null;
  bio?: string | null;
  skills?: string | null;
  experience?: string | null;
  country?: string | null;
  countryCode?: string | null;
  mobileNumber?: string | null;
  profileImageUrl?: string | null;
  portfolioCount: number;
};

export function calculateProfileStrength(data: ProfileStrengthInput) {
  const checks = [
    Boolean(data.username?.trim()),
    Boolean(data.bio?.trim()),
    Boolean(data.skills?.trim()),
    Boolean(data.experience?.trim()),
    Boolean(data.country?.trim()),
    Boolean(data.countryCode?.trim() && data.mobileNumber?.trim()),
    Boolean(data.profileImageUrl?.trim()),
    data.portfolioCount > 0,
  ];

  const total = checks.length;
  const completed = checks.filter(Boolean).length;
  const score = Math.round((completed / total) * 100);

  return {
    score,
    completed,
    total,
  };
}
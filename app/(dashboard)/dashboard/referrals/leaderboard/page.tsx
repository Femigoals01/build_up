"use client";

import { useEffect, useState } from "react";
import {
  Trophy,
  Medal,
  Crown,
  Coins,
  Users,
  Sparkles,
} from "lucide-react";

type LeaderboardUser = {
  id: string;
  name: string;
  username: string;
  role: string;
  referralCode: string;
  referralCount: number;
  referralBalance: number;
  profileImageUrl?: string | null;
};

export default function ReferralLeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/referrals/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.leaderboard || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getRankIcon = (index: number) => {
    if (index === 0)
      return <Crown className="h-6 w-6 text-yellow-500" />;

    if (index === 1)
      return <Medal className="h-6 w-6 text-slate-400" />;

    if (index === 2)
      return <Medal className="h-6 w-6 text-amber-700" />;

    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
        #{index + 1}
      </div>
    );
  };

  return (
    <main className="space-y-8 p-6">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
            <Sparkles className="h-4 w-4" />
            BuildUp Ambassador Leaderboard
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
            Top Community
            <br />
            Builders on BuildUp
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/80">
            Compete with other ambassadors, grow the BuildUp community,
            and earn rewards through referrals and engagement.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <Users className="h-8 w-8 text-indigo-600" />

          <p className="mt-5 text-3xl font-bold text-slate-900">
            {users.length}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Ranked ambassadors
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <Coins className="h-8 w-8 text-emerald-600" />

          <p className="mt-5 text-3xl font-bold text-slate-900">
            ₦
            {users
              .reduce(
                (acc, user) =>
                  acc + Number(user.referralBalance || 0),
                0
              )
              .toFixed(2)}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Total referral payouts
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <Trophy className="h-8 w-8 text-amber-500" />

          <p className="mt-5 text-3xl font-bold text-slate-900">
            #{users.length > 0 ? users[0]?.username : "-"}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Current top ambassador
          </p>
        </div>
      </section>

      {/* LEADERBOARD */}
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Referral Rankings
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Top users growing the BuildUp ecosystem.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-3xl bg-slate-100"
              />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center">
            <p className="text-sm text-slate-500">
              No leaderboard data yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user, index) => (
              <div
                key={user.id}
                className={`flex flex-col gap-5 rounded-[28px] border p-5 transition hover:shadow-md md:flex-row md:items-center md:justify-between ${
                  index === 0
                    ? "border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  {getRankIcon(index)}

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-lg font-bold text-white">
                    {user.name?.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-slate-900">
                        {user.name}
                      </p>

                      {index === 0 && (
                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">
                          Champion
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-500">
                      @{user.username}
                    </p>

                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-indigo-600">
                      {user.role}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="rounded-2xl bg-slate-100 px-4 py-3">
                    <p className="text-xs text-slate-500">
                      Referrals
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-900">
                      {user.referralCount}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                    <p className="text-xs text-emerald-600">
                      Earnings
                    </p>

                    <p className="mt-1 text-lg font-bold text-emerald-700">
                      ₦
                      {Number(
                        user.referralBalance || 0
                      ).toFixed(2)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-indigo-50 px-4 py-3">
                    <p className="text-xs text-indigo-600">
                      Referral Code
                    </p>

                    <p className="mt-1 text-sm font-bold text-indigo-700">
                      {user.referralCode}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
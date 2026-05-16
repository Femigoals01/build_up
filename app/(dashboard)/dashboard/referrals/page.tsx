





// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { Copy, Gift, Users, Trophy, Coins } from "lucide-react";

// type ReferralUser = {
//   id: string;
//   createdAt: string;
//   rewardPaid?: boolean;
//   referredUser?: {
//     id: string;
//     name: string;
//     email?: string;
//     role?: string;
//     profileImageUrl?: string | null;
//     joinedAt?: string;
//     createdAt?: string;
//     emailVerified?: boolean;
//   };
//   referred?: {
//     id: string;
//     name: string;
//     email?: string;
//     role?: string;
//     createdAt?: string;
//     emailVerified?: boolean;
//   };
//   user?: {
//     id: string;
//     name: string;
//     role?: string;
//     createdAt?: string;
//     emailVerified?: boolean;
//   };
//   name?: string;
// };

// type ReferralData = {
//   referralCode: string;
//   referralCount: number;
//   referralBalance: number;
//   referrals: ReferralUser[];
// };

// export default function ReferralsPage() {
//   const [data, setData] = useState<ReferralData | null>(null);
//   const [copied, setCopied] = useState(false);

//   const [inviteEmail, setInviteEmail] = useState("");
//   const [inviteLoading, setInviteLoading] = useState(false);
//   const [inviteMessage, setInviteMessage] = useState("");
//   const [inviteError, setInviteError] = useState("");

//   useEffect(() => {
//     fetch("/api/referrals/me")
//       .then((res) => res.json())
//       .then((res) => setData(res));
//   }, []);

//   if (!data) {
//     return (
//       <div className="p-6">
//         <div className="animate-pulse space-y-4">
//           <div className="h-8 w-48 rounded bg-slate-200" />
//           <div className="h-32 rounded-3xl bg-slate-200" />
//           <div className="h-24 rounded-3xl bg-slate-200" />
//         </div>
//       </div>
//     );
//   }

//   const appUrl =
//     typeof window !== "undefined"
//       ? window.location.origin
//       : "https://build-up-nine.vercel.app";

//   const referralLink = `${appUrl}/register/volunteer?ref=${data.referralCode}`;

//   const inviteText = `I’m using BuildUp to connect with real projects, mentors, and practical experience. Join with my referral link: ${referralLink}`;

//   const handleCopy = async () => {
//     await navigator.clipboard.writeText(referralLink);
//     setCopied(true);

//     setTimeout(() => {
//       setCopied(false);
//     }, 2000);
//   };

//   const handleInviteEmail = async (e: React.FormEvent) => {
//     e.preventDefault();

//     setInviteLoading(true);
//     setInviteMessage("");
//     setInviteError("");

//     try {
//       const res = await fetch("/api/referrals/invite-email", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email: inviteEmail }),
//       });

//       const result = await res.json().catch(() => null);

//       if (!res.ok) {
//         setInviteError(result?.error || "Failed to send invitation.");
//         return;
//       }

//       setInviteMessage("Invitation sent successfully.");
//       setInviteEmail("");
//     } catch {
//       setInviteError("Something went wrong. Please try again.");
//     } finally {
//       setInviteLoading(false);
//     }
//   };

//   return (
//     <main className="space-y-8 p-6">
//       <div>
//         <h1 className="text-3xl font-bold text-slate-900">Referral Program</h1>

//         <p className="mt-2 text-slate-500">
//           Invite others to BuildUp and earn rewards as the community grows.
//         </p>
//       </div>

//       <section className="relative overflow-hidden rounded-[32px] border border-indigo-100 bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 p-8 text-white shadow-xl">
//         <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

//         <div className="relative z-10">
//           <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
//             <Gift className="h-4 w-4" />
//             BuildUp Referral Rewards
//           </div>

//           <h2 className="mt-6 max-w-2xl text-4xl font-bold leading-tight">
//             Invite friends.
//             <br />
//             Grow together.
//             <br />
//             Earn rewards.
//           </h2>

//           <div className="mt-8 flex flex-wrap gap-4">
//             <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
//               <p className="text-sm text-white/70">Referral Code</p>
//               <p className="mt-1 text-xl font-bold">{data.referralCode}</p>
//             </div>

//             <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
//               <p className="text-sm text-white/70">Total Referrals</p>
//               <p className="mt-1 text-xl font-bold">
//                 {data.referralCount || 0}
//               </p>
//             </div>

//             <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
//               <p className="text-sm text-white/70">Referral Earnings</p>
//               <p className="mt-1 text-xl font-bold">
//                 ₦{Number(data.referralBalance || 0).toFixed(2)}
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//         <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
//           <div className="flex-1">
//             <p className="text-sm font-semibold text-slate-700">
//               Your Referral Link
//             </p>

//             <div className="mt-2 break-all rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
//               {referralLink}
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-3">
//             <button
//               type="button"
//               onClick={handleCopy}
//               className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-700"
//             >
//               <Copy className="h-4 w-4" />
//               {copied ? "Copied!" : "Copy Link"}
//             </button>

//             <Link
//               href="/dashboard/referrals/leaderboard"
//               className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
//             >
//               View Leaderboard
//             </Link>
//           </div>
//         </div>
//       </section>

//       <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//         <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
//           <div>
//             <h3 className="text-xl font-bold text-slate-900">
//               Invite your network
//             </h3>

//             <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
//               Share BuildUp with friends, learners, mentors, and organizations.
//               Once they register and verify their email with your link, they
//               count toward your referral rewards.
//             </p>
//           </div>

//           <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700">
//             Earn rewards after verified referrals
//           </div>
//         </div>

//         <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
//           {inviteText}
//         </div>

//         <div className="mt-5 flex flex-wrap gap-3">
//           <a
//             href={`https://wa.me/?text=${encodeURIComponent(inviteText)}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
//           >
//             Share on WhatsApp
//           </a>

//           <a
//             href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
//               inviteText
//             )}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
//           >
//             Share on X
//           </a>

//           <a
//             href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
//               referralLink
//             )}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="rounded-2xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
//           >
//             Share on LinkedIn
//           </a>

//           <a
//             href={`https://t.me/share/url?url=${encodeURIComponent(
//               referralLink
//             )}&text=${encodeURIComponent("Join me on BuildUp")}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
//           >
//             Share on Telegram
//           </a>
//         </div>
//       </section>

//       <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//         <div>
//           <h3 className="text-xl font-bold text-slate-900">Invite by Email</h3>

//           <p className="mt-2 text-sm leading-6 text-slate-500">
//             Send a direct BuildUp invite to someone’s email with your referral
//             link attached.
//           </p>
//         </div>

//         <form
//           onSubmit={handleInviteEmail}
//           className="mt-5 flex flex-col gap-3 sm:flex-row"
//         >
//           <input
//             type="email"
//             value={inviteEmail}
//             onChange={(e) => setInviteEmail(e.target.value)}
//             placeholder="Enter email address"
//             className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
//             required
//           />

//           <button
//             type="submit"
//             disabled={inviteLoading}
//             className="inline-flex h-12 items-center justify-center rounded-2xl bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
//           >
//             {inviteLoading ? "Sending..." : "Send Invite"}
//           </button>
//         </form>

//         {inviteMessage ? (
//           <p className="mt-3 text-sm font-medium text-emerald-600">
//             {inviteMessage}
//           </p>
//         ) : null}

//         {inviteError ? (
//           <p className="mt-3 text-sm font-medium text-red-600">
//             {inviteError}
//           </p>
//         ) : null}
//       </section>

//       <section className="grid gap-5 md:grid-cols-3">
//         <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//           <Users className="h-8 w-8 text-indigo-600" />

//           <p className="mt-5 text-3xl font-bold text-slate-900">
//             {data.referralCount || 0}
//           </p>

//           <p className="mt-1 text-sm text-slate-500">Successful referrals</p>
//         </div>

//         <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//           <Coins className="h-8 w-8 text-emerald-600" />

//           <p className="mt-5 text-3xl font-bold text-slate-900">
//             ₦{Number(data.referralBalance || 0).toFixed(2)}
//           </p>

//           <p className="mt-1 text-sm text-slate-500">Total earnings</p>
//         </div>

//         <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//           <Trophy className="h-8 w-8 text-amber-500" />

//           <p className="mt-5 text-3xl font-bold text-slate-900">
//             Top Referrer
//           </p>

//           <p className="mt-1 text-sm text-slate-500">
//             Compete on the leaderboard
//           </p>
//         </div>
//       </section>

//       <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h3 className="text-xl font-bold text-slate-900">
//               Referral Milestones
//             </h3>

//             <p className="mt-1 text-sm text-slate-500">
//               Unlock rewards and badges as you grow BuildUp.
//             </p>
//           </div>

//           <div className="w-fit rounded-2xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
//             {data.referralCount || 0}/50 Referrals
//           </div>
//         </div>

//         <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-100">
//           <div
//             className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-500"
//             style={{
//               width: `${Math.min(((data.referralCount || 0) / 50) * 100, 100)}%`,
//             }}
//           />
//         </div>

//         <div className="mt-6 grid gap-4 md:grid-cols-4">
//           {[
//             ["Bronze Referrer", "5 referrals"],
//             ["Silver Referrer", "15 referrals"],
//             ["Gold Referrer", "30 referrals"],
//             ["Ambassador", "50 referrals"],
//           ].map(([title, subtitle]) => (
//             <div
//               key={title}
//               className="rounded-2xl border border-slate-200 p-4"
//             >
//               <p className="text-sm font-semibold text-slate-900">{title}</p>
//               <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//         <div className="mb-6">
//           <h3 className="text-xl font-bold text-slate-900">
//             Recent Referrals
//           </h3>

//           <p className="mt-1 text-sm text-slate-500">
//             People who joined using your referral code
//           </p>
//         </div>

//         <div className="space-y-4">
//           {(data.referrals || []).length === 0 ? (
//             <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
//               <p className="text-sm text-slate-500">No referrals yet.</p>
//             </div>
//           ) : (
//             (data.referrals || []).map((referral) => {
//               const referredUser =
//                 referral.referredUser ||
//                 referral.referred ||
//                 referral.user ||
//                 referral;

//               const joinedDate =
//                 referredUser?.joinedAt ||
//                 referredUser?.createdAt ||
//                 referral.createdAt;

//               return (
//                 <div
//                   key={referral.id}
//                   className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-sm font-bold text-white">
//                       {referredUser?.name?.charAt(0)?.toUpperCase() || "U"}
//                     </div>

//                     <div>
//                       <p className="font-semibold text-slate-900">
//                         {referredUser?.name || "Unknown User"}
//                       </p>

//                       <div className="mt-1 flex flex-wrap items-center gap-2">
//                         <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
//                           {referredUser?.role || "User"}
//                         </span>

//                         <span
//                           className={`rounded-full px-2 py-1 text-xs font-medium ${
//                             referral.rewardPaid
//                               ? "bg-emerald-100 text-emerald-700"
//                               : "bg-amber-100 text-amber-700"
//                           }`}
//                         >
//                           {referral.rewardPaid
//                             ? "Reward Counted"
//                             : "Pending Reward"}
//                         </span>

//                         {referredUser?.emailVerified ? (
//                           <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
//                             Verified
//                           </span>
//                         ) : null}
//                       </div>
//                     </div>
//                   </div>

//                   <p className="text-sm text-slate-400">
//                     {joinedDate
//                       ? new Date(joinedDate).toLocaleDateString()
//                       : "No date"}
//                   </p>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </section>
//     </main>
//   );
// }



"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Copy, Gift, Users, Trophy, Coins } from "lucide-react";

type ReferralPerson = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  profileImageUrl?: string | null;
  joinedAt?: string;
  createdAt?: string;
  emailVerified?: boolean;
};

type ReferralUser = {
  id: string;
  createdAt: string;
  rewardPaid?: boolean;
  referredUser?: ReferralPerson;
  referred?: ReferralPerson;
  user?: ReferralPerson;
  name?: string;
  role?: string;
  joinedAt?: string;
  emailVerified?: boolean;
};

type ReferralData = {
  referralCode: string;
  referralCount: number;
  referralBalance: number;
  referrals: ReferralUser[];
};

export default function ReferralsPage() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [copied, setCopied] = useState(false);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteError, setInviteError] = useState("");

  useEffect(() => {
    fetch("/api/referrals/me")
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []);

  if (!data) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-slate-200" />
          <div className="h-32 rounded-3xl bg-slate-200" />
          <div className="h-24 rounded-3xl bg-slate-200" />
        </div>
      </div>
    );
  }

  const appUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://build-up-nine.vercel.app";

  const referralLink = `${appUrl}/register/volunteer?ref=${data.referralCode}`;

  const inviteText = `I’m using BuildUp to connect with real projects, mentors, and practical experience. Join with my referral link: ${referralLink}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleInviteEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    setInviteLoading(true);
    setInviteMessage("");
    setInviteError("");

    try {
      const res = await fetch("/api/referrals/invite-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inviteEmail,
        }),
      });

      const result = await res.json().catch(() => null);

      if (!res.ok) {
        setInviteError(result?.error || "Failed to send invitation.");
        return;
      }

      setInviteMessage("Invitation sent successfully.");
      setInviteEmail("");
    } catch {
      setInviteError("Something went wrong. Please try again.");
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <main className="space-y-8 p-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Referral Program
        </h1>

        <p className="mt-2 text-slate-500">
          Invite others to BuildUp and earn rewards as the community grows.
        </p>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden rounded-[32px] border border-indigo-100 bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
            <Gift className="h-4 w-4" />
            BuildUp Referral Rewards
          </div>

          <h2 className="mt-6 max-w-2xl text-4xl font-bold leading-tight">
            Invite friends.
            <br />
            Grow together.
            <br />
            Earn rewards.
          </h2>

          <div className="mt-8 flex flex-wrap gap-4">
            <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-sm text-white/70">Referral Code</p>

              <p className="mt-1 text-xl font-bold">
                {data.referralCode}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-sm text-white/70">Total Referrals</p>

              <p className="mt-1 text-xl font-bold">
                {data.referralCount || 0}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-sm text-white/70">
                Referral Earnings
              </p>

              <p className="mt-1 text-xl font-bold">
                ₦{Number(data.referralBalance || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LINK */}
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-700">
              Your Referral Link
            </p>

            <div className="mt-2 break-all rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
              {referralLink}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Copy className="h-4 w-4" />

              {copied ? "Copied!" : "Copy Link"}
            </button>

            <Link
              href="/dashboard/referrals/leaderboard"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Leaderboard
            </Link>
          </div>
        </div>
      </section>

      {/* SOCIAL SHARE */}
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Invite your network
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Share BuildUp with friends, learners, mentors, and organizations.
            </p>
          </div>

          <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700">
            Earn rewards after verified referrals
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          {inviteText}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(inviteText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            Share on WhatsApp
          </a>

          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              inviteText
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Share on X
          </a>

          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              referralLink
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Share on LinkedIn
          </a>

          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(
              referralLink
            )}&text=${encodeURIComponent("Join me on BuildUp")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
          >
            Share on Telegram
          </a>
        </div>
      </section>

      {/* EMAIL INVITE */}
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Invite by Email
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Send a BuildUp invitation directly to someone’s email.
          </p>
        </div>

        <form
          onSubmit={handleInviteEmail}
          className="mt-5 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Enter email address"
            className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            required
          />

          <button
            type="submit"
            disabled={inviteLoading}
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {inviteLoading ? "Sending..." : "Send Invite"}
          </button>
        </form>

        {inviteMessage ? (
          <p className="mt-3 text-sm font-medium text-emerald-600">
            {inviteMessage}
          </p>
        ) : null}

        {inviteError ? (
          <p className="mt-3 text-sm font-medium text-red-600">
            {inviteError}
          </p>
        ) : null}
      </section>

      {/* STATS */}
      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <Users className="h-8 w-8 text-indigo-600" />

          <p className="mt-5 text-3xl font-bold text-slate-900">
            {data.referralCount || 0}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Successful referrals
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <Coins className="h-8 w-8 text-emerald-600" />

          <p className="mt-5 text-3xl font-bold text-slate-900">
            ₦{Number(data.referralBalance || 0).toFixed(2)}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Total earnings
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <Trophy className="h-8 w-8 text-amber-500" />

          <p className="mt-5 text-3xl font-bold text-slate-900">
            Top Referrer
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Compete on the leaderboard
          </p>
        </div>
      </section>

      {/* RECENT REFERRALS */}
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900">
            Recent Referrals
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            People who joined using your referral code
          </p>
        </div>

        <div className="space-y-4">
          {(data.referrals || []).length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
              <p className="text-sm text-slate-500">
                No referrals yet.
              </p>
            </div>
          ) : (
            (data.referrals || []).map((referral) => {
              const referredUser =
                referral.referredUser ||
                referral.referred ||
                referral.user ||
                referral;

              const joinedDate =
                referredUser?.joinedAt ||
                referredUser?.createdAt ||
                referral.createdAt;

              return (
                <div
                  key={referral.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-sm font-bold text-white">
                      {referredUser?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900">
                        {referredUser?.name || "Unknown User"}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                          {referredUser?.role || "User"}
                        </span>

                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            referral.rewardPaid
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {referral.rewardPaid
                            ? "Reward Counted"
                            : "Pending Reward"}
                        </span>

                        {referredUser?.emailVerified ? (
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                            Verified
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400">
                    {joinedDate
                      ? new Date(joinedDate).toLocaleDateString()
                      : "No date"}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
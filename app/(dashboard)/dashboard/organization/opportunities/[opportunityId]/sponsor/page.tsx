




"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const PLANS = [
  {
    name: "STARTER",
    price: "₦5,000",
    days: 7,
    description: "Perfect for short campaigns and urgent visibility.",
    highlight: false,
  },
  {
    name: "PROFESSIONAL",
    price: "₦15,000",
    days: 30,
    description: "Best value for jobs, hiring campaigns, and promotions.",
    highlight: true,
  },
  {
    name: "ENTERPRISE",
    price: "₦35,000",
    days: 90,
    description: "Maximum visibility for long-term growth and brand awareness.",
    highlight: false,
  },
];

export default function SponsorOpportunityPage() {
  const params = useParams();
  const opportunityId = String(params.opportunityId);

  const [loadingTier, setLoadingTier] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function sponsorOpportunity(tier: string) {
    try {
      setLoadingTier(tier);
      setError("");
      setMessage("Redirecting to secure payment...");

      const res = await fetch("/api/payments/opportunity-sponsor/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          opportunityId,
          tier,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize payment.");
      }

      if (!data.authorizationUrl) {
        throw new Error("Payment link was not generated.");
      }

      window.location.href = data.authorizationUrl;
    } catch (err) {
      setMessage("");
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoadingTier("");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard/organization/opportunities"
          className="text-sm font-black text-blue-600 hover:text-blue-700"
        >
          ← Back to opportunities
        </Link>

        <div className="mb-10 mt-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
            Sponsored Listing
          </p>

          <h1 className="mt-3 text-4xl font-black text-slate-900">
            Boost Your Opportunity
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Pay securely with Paystack and get premium visibility across BuildUp
            marketplace and homepage featured placements.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold text-blue-700">
            {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const loading = loadingTier === plan.name;

            return (
              <div
                key={plan.name}
                className={`relative rounded-3xl border bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                  plan.highlight
                    ? "border-blue-300 ring-4 ring-blue-100"
                    : "border-slate-200"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-black uppercase tracking-[0.12em] text-white shadow-lg">
                    Recommended
                  </div>
                )}

                <h2 className="text-2xl font-black text-slate-900">
                  {plan.name}
                </h2>

                <p className="mt-4 text-4xl font-black text-blue-600">
                  {plan.price}
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {plan.days} Days Featured Placement
                </p>

                <p className="mt-6 min-h-[48px] text-sm leading-6 text-slate-600">
                  {plan.description}
                </p>

                <ul className="mt-6 space-y-3 text-sm font-semibold text-slate-700">
                  <li>✅ Homepage visibility</li>
                  <li>✅ Marketplace priority placement</li>
                  <li>✅ Sponsored ribbon</li>
                  <li>✅ Increased lead generation</li>
                  <li>✅ Featured badge</li>
                </ul>

                <button
                  type="button"
                  onClick={() => sponsorOpportunity(plan.name)}
                  disabled={Boolean(loadingTier)}
                  className={`mt-8 w-full rounded-2xl px-5 py-3 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    plan.highlight
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-slate-900 hover:bg-slate-800"
                  }`}
                >
                  {loading ? "Opening Paystack..." : "Pay & Promote"}
                </button>
              </div>
            );
          })}
        </div>

        <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-900">
            What happens after payment?
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <InfoCard
              icon="💳"
              title="1. Secure Payment"
              text="You complete payment through Paystack."
            />
            <InfoCard
              icon="🚀"
              title="2. Automatic Promotion"
              text="BuildUp automatically marks your opportunity as sponsored."
            />
            <InfoCard
              icon="📈"
              title="3. More Visibility"
              text="Your opportunity receives priority placement and a sponsored ribbon."
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="text-2xl">{icon}</div>

      <h3 className="mt-3 text-sm font-black text-slate-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}
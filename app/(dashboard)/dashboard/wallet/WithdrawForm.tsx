


"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const MIN_WITHDRAWAL_KOBO = 2_000_000;

function formatNaira(amount: number) {
  return `₦${(amount / 100).toLocaleString("en-NG")}`;
}

export default function WithdrawForm({ balance }: { balance: number }) {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const canWithdraw = balance >= MIN_WITHDRAWAL_KOBO;

  async function submitWithdrawal(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error || "Withdrawal request failed.");
        return;
      }

      setMessage("Withdrawal request submitted successfully.");
      setAmount("");
      router.refresh();
    } catch (error) {
      console.error("Withdrawal request error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Request Withdrawal</h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Minimum withdrawal is ₦20,000. Your request will be recorded first, then
        payout can be processed through Paystack Transfer later.
      </p>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          Available
        </p>
        <p className="mt-2 text-2xl font-bold text-slate-900">
          {formatNaira(balance)}
        </p>
      </div>

      {!canWithdraw ? (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
          You need at least ₦20,000 before you can request withdrawal.
        </div>
      ) : null}

      <form onSubmit={submitWithdrawal} className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="amount"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            Amount
          </label>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
              ₦
            </span>

            <input
              id="amount"
              type="number"
              min="20000"
              step="500"
              placeholder="20000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!canWithdraw}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pl-9 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              required
            />
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canWithdraw || loading}
          className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Request Withdrawal"}
        </button>
      </form>
    </aside>
  );
}
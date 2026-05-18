




"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProcessWithdrawalButton({
  withdrawalId,
}: {
  withdrawalId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function processWithdrawal() {
    const confirmed = window.confirm(
      "Process this payout through Paystack Transfer?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await fetch("/api/admin/withdrawals/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ withdrawalId }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(data?.error || "Failed to process withdrawal.");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Process withdrawal error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={processWithdrawal}
      disabled={loading}
      className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Processing..." : "Process Payout"}
    </button>
  );
}





"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProcessWithdrawalButton({
  withdrawalId,
  transferId,
  transferCode,
  mode,
}: {
  withdrawalId: string;
  transferId?: string;
  transferCode?: string;
  mode: "start" | "otp";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(mode === "otp");
  const [currentTransferId, setCurrentTransferId] = useState<string | undefined>(
    transferId
  );

  async function startTransfer() {
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



      if (data?.requiresOtp) {
        setShowOtpBox(true);

        if (data.transferId) {
          setCurrentTransferId(data.transferId);
        }

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


  async function finalizeTransfer() {
    if (!currentTransferId) {
      alert("Transfer ID missing.");
      return;
    }

    if (!otp.trim()) {
      alert("Enter the Paystack OTP.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/payments/withdraw/finalise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transferId: currentTransferId,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "OTP verification failed.");
        return;
      }

      alert("Transfer finalized successfully.");

      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Unable to finalize transfer.");
    } finally {
      setLoading(false);
    }
  }

  // return (
    

  //   <button
  //   type="button"
  //   onClick={
  //       showOtpBox
  //           ? finalizeTransfer
  //           : startTransfer
  //   }
  //     disabled={loading}
  //     className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
  //   >
  //     {loading ? "Processing..." : "Process Payout"}
  //   </button>
  // );

  return (
  <div className="space-y-3">

    {showOtpBox && (
      <div className="space-y-2">

        <input
          type="text"
          placeholder="Enter Paystack OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-48 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />

      </div>
    )}

    <button
      type="button"
      onClick={
        showOtpBox
          ? finalizeTransfer
          : startTransfer
      }
      disabled={loading}
      className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading
        ? "Processing..."
        : showOtpBox
        ? "Confirm OTP"
        : "Start Transfer"}
    </button>

  </div>
);
}

"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

type ActionType = "deactivate" | "delete";

export default function AccountDangerZone() {
  const [action, setAction] = useState<ActionType | null>(null);
  const [step, setStep] = useState<"warning" | "reason">("warning");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const isDelete = action === "delete";

  async function submitAction() {
    if (!action) return;

    if (!reason.trim()) {
      alert("Please tell us the reason.");
      return;
    }

    setLoading(true);

    const res = await fetch(`/api/account/${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason: reason.trim() }),
    });

    if (!res.ok) {
      setLoading(false);
      alert("Something went wrong. Please try again.");
      return;
    }

    await signOut({
      callbackUrl: `/login?account=${action === "delete" ? "deleted" : "deactivated"}`,
    });
  }

  function closeModal() {
    setAction(null);
    setStep("warning");
    setReason("");
    setLoading(false);
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            setAction("deactivate");
            setStep("warning");
          }}
          className="inline-flex h-12 items-center justify-center rounded-2xl border border-amber-300 bg-amber-50 px-5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
        >
          Deactivate Account
        </button>

        <button
          type="button"
          onClick={() => {
            setAction("delete");
            setStep("warning");
          }}
          className="inline-flex h-12 items-center justify-center rounded-2xl border border-red-300 bg-red-50 px-5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
        >
          Delete Account
        </button>
      </div>

      {action && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl">
            {step === "warning" ? (
              <>
                <h3 className="text-2xl font-bold text-slate-900">
                  {isDelete ? "Delete your account?" : "Deactivate your account?"}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {isDelete
                    ? "Deleting your account will hide your public profile, disable notifications, and stop you from logging in again. Your project records may still be kept for platform integrity."
                    : "Deactivating your account will temporarily disable access to your account. You will not be able to log in until the account is reactivated by support."}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setStep("reason")}
                    className={`h-11 rounded-2xl px-5 text-sm font-semibold text-white ${
                      isDelete
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-amber-600 hover:bg-amber-700"
                    }`}
                  >
                    Yes, proceed
                  </button>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="h-11 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-900">
                  Tell us why
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Please share the reason before we continue.
                </p>

                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={5}
                  placeholder="Write your reason here..."
                  className="mt-5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={submitAction}
                    className={`h-11 rounded-2xl px-5 text-sm font-semibold text-white disabled:opacity-60 ${
                      isDelete
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-amber-600 hover:bg-amber-700"
                    }`}
                  >
                    {loading
                      ? "Processing..."
                      : isDelete
                      ? "Delete Account"
                      : "Deactivate Account"}
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={closeModal}
                    className="h-11 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
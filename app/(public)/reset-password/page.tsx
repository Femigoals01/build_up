

import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordClient />
    </Suspense>
  );
}

function ResetPasswordFallback() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-8">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center">
        <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
            🔐
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
            Reset Password
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Loading your secure reset page...
          </p>
        </div>
      </div>
    </main>
  );
}
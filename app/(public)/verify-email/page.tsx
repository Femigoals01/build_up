


import { Suspense } from "react";
import VerifyEmailClient from "./VerifyEmailClient";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailClient />
    </Suspense>
  );
}

function VerifyEmailFallback() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-8">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 lg:grid-cols-2">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Secure your BuildUp account
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-900">
              Verify your email.
              <br />
              Unlock your account.
              <br />
              Start building.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
              Loading your verification page...
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Secure</p>
                <p className="mt-1 text-sm text-slate-500">
                  Protect your account
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Verified</p>
                <p className="mt-1 text-sm text-slate-500">
                  Confirm your identity
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Ready</p>
                <p className="mt-1 text-sm text-slate-500">
                  Access your dashboard
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full">
          <div className="mx-auto max-w-md overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <div className="px-6 py-8 text-center md:px-8 md:py-10">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
                ✉️
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Loading verification page
              </h1>
              <p className="mt-3 text-sm text-slate-500">
                Please wait a moment...
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}






import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the BuildUp Terms & Conditions for rules, responsibilities, and platform usage terms.",
};

export default function TermsPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-slate-50/70">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
            Legal
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            These Terms &amp; Conditions govern access to and use of the BuildUp
            platform.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Last updated: April 22, 2026
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <div className="space-y-10 text-slate-700">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              1. Acceptance of Terms
            </h2>
            <div className="mt-4 space-y-4 leading-7">
              <p>
                By accessing or using BuildUp, you agree to be bound by these
                Terms &amp; Conditions and any policies referenced on the
                platform. If you do not agree, you should not use BuildUp.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              2. Platform Purpose
            </h2>
            <div className="mt-4 space-y-4 leading-7">
              <p>
                BuildUp is designed to connect volunteers, mentors, and
                organizations through live projects, practical collaboration,
                and portfolio-ready proof of work.
              </p>
              <p>
                We may update, improve, limit, suspend, or remove features at
                any time to maintain platform quality, safety, and performance.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              3. User Accounts
            </h2>
            <div className="mt-4 space-y-4 leading-7">
              <p>
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account.
              </p>
              <p>
                You agree to provide accurate information and to keep your
                profile and account details reasonably up to date.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              4. Acceptable Use
            </h2>
            <div className="mt-4 space-y-4 leading-7">
              <p>You agree not to use BuildUp to:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Violate any law or regulation</li>
                <li>Harass, abuse, threaten, or exploit others</li>
                <li>Post false, misleading, or fraudulent content</li>
                <li>Upload harmful code or interfere with platform operations</li>
                <li>Impersonate another person or organization</li>
                <li>Misuse project, mentor, or portfolio systems</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              5. User Content
            </h2>
            <div className="mt-4 space-y-4 leading-7">
              <p>
                You retain ownership of content you submit to BuildUp, subject
                to any rights necessary for us to host, display, process, and
                operate that content on the platform.
              </p>
              <p>
                You are responsible for ensuring that any content you submit
                does not infringe the rights of others and complies with
                applicable laws.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              6. Projects, Mentorship, and Platform Interactions
            </h2>
            <div className="mt-4 space-y-4 leading-7">
              <p>
                BuildUp provides a platform for collaboration, but we do not
                guarantee project outcomes, mentor availability, volunteer
                placement, or organizational results.
              </p>
              <p>
                Users are responsible for the quality, accuracy, and conduct of
                their own participation, communications, and deliverables.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              7. Suspension and Termination
            </h2>
            <div className="mt-4 space-y-4 leading-7">
              <p>
                We may suspend, restrict, or terminate access to BuildUp if we
                believe a user has violated these Terms, created risk to the
                platform, or engaged in misuse, fraud, abuse, or unlawful
                conduct.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              8. Disclaimers
            </h2>
            <div className="mt-4 space-y-4 leading-7">
              <p>
                BuildUp is provided on an “as is” and “as available” basis,
                without warranties of any kind except where required by law.
              </p>
              <p>
                We do not guarantee uninterrupted service, error-free operation,
                or that use of the platform will always meet every user’s
                expectations or business needs.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              9. Limitation of Liability
            </h2>
            <div className="mt-4 space-y-4 leading-7">
              <p>
                To the maximum extent permitted by law, BuildUp shall not be
                liable for indirect, incidental, consequential, or special
                damages arising from use of or inability to use the platform.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              10. Changes to These Terms
            </h2>
            <div className="mt-4 space-y-4 leading-7">
              <p>
                We may update these Terms from time to time. Continued use of
                BuildUp after updates means you accept the revised Terms.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              11. Contact
            </h2>
            <div className="mt-4 space-y-4 leading-7">
              <p>
                For questions about these Terms &amp; Conditions, please contact
                us through the Support page.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-16 rounded-2xl border border-slate-200 bg-gradient-to-r from-white via-blue-50 to-indigo-50 p-6 sm:p-8">
  <h3 className="text-lg font-semibold text-slate-900">
    Questions about these terms?
  </h3>

  <p className="mt-2 text-sm text-slate-600 sm:text-base">
    If you need clarification or assistance, our support team is available to guide you.
  </p>

  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
    <Link
      href="/support"
      className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
    >
      Contact Support
    </Link>

    <Link
      href="/privacy"
      className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
    >
      View Privacy Policy
    </Link>
  </div>
</div>
      </section>
    </main>
  );
}
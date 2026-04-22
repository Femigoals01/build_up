import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the BuildUp Privacy Policy to understand how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <main className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-slate-50/70">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-20">
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
            Legal
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            This Privacy Policy explains how BuildUp collects, uses, stores, and
            protects personal information when you use our platform.
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
              1. Information We Collect
            </h2>
            <div className="mt-4 space-y-4 leading-7">
              <p>
                We may collect information you provide directly to us, such as
                your name, email address, profile details, account information,
                portfolio content, project activity, and communications sent
                through the platform.
              </p>
              <p>
                We may also collect technical information such as device type,
                browser type, IP address, usage activity, and analytics data to
                help us improve the performance, security, and usability of
                BuildUp.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              2. How We Use Information
            </h2>
            <div className="mt-4 space-y-4 leading-7">
              <p>We use information collected through BuildUp to:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Create and manage user accounts</li>
                <li>Enable project participation and mentor collaboration</li>
                <li>Display portfolio-ready proof of work and achievements</li>
                <li>Communicate important product, support, or security updates</li>
                <li>Improve platform performance, reliability, and user experience</li>
                <li>Detect fraud, misuse, or unauthorized activity</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              3. Sharing of Information
            </h2>
            <div className="mt-4 space-y-4 leading-7">
              <p>
                We do not sell your personal information. We may share
                information only where necessary to operate the platform, comply
                with legal obligations, protect users, or work with trusted
                service providers who help us run BuildUp.
              </p>
              <p>
                Information you choose to make public, such as profile details,
                project contributions, badges, reviews, or portfolio content,
                may be visible to other users and visitors depending on your
                settings.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              4. Data Storage and Security
            </h2>
            <div className="mt-4 space-y-4 leading-7">
              <p>
                We take reasonable administrative, technical, and organizational
                measures to protect personal data from unauthorized access,
                alteration, disclosure, or destruction.
              </p>
              <p>
                However, no online platform can guarantee absolute security. You
                are responsible for keeping your login credentials secure and for
                notifying us if you believe your account has been compromised.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              5. Cookies and Analytics
            </h2>
            <div className="mt-4 space-y-4 leading-7">
              <p>
                BuildUp may use cookies, analytics tools, and similar
                technologies to understand traffic patterns, remember user
                preferences, and improve the platform experience.
              </p>
              <p>
                You may be able to manage certain cookie preferences through
                your browser settings.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              6. Your Choices
            </h2>
            <div className="mt-4 space-y-4 leading-7">
              <p>
                You may update certain account information through your profile
                or settings. You may also contact us if you want to request
                access to, correction of, or deletion of your personal
                information, subject to applicable laws and platform
                requirements.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              7. Children’s Privacy
            </h2>
            <div className="mt-4 space-y-4 leading-7">
              <p>
                BuildUp is not intended for children under the age required by
                applicable law to use the service independently. If we learn
                that personal information has been collected improperly, we will
                take reasonable steps to delete it.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              8. Changes to This Policy
            </h2>
            <div className="mt-4 space-y-4 leading-7">
              <p>
                We may update this Privacy Policy from time to time. When we do,
                we will revise the “Last updated” date on this page.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              9. Contact Us
            </h2>
            <div className="mt-4 space-y-4 leading-7">
              <p>
                If you have questions about this Privacy Policy, please contact
                us through the Support page.
              </p>
            </div>
          </section>
        </div>

<div className="mt-16 rounded-2xl border border-slate-200 bg-gradient-to-r from-white via-blue-50 to-indigo-50 p-6 sm:p-8">
  <h3 className="text-lg font-semibold text-slate-900">
    Need help or have questions?
  </h3>

  <p className="mt-2 text-sm text-slate-600 sm:text-base">
    If anything in this Privacy Policy is unclear, our support team is here to help you.
  </p>

  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
    <Link
      href="/support"
      className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
    >
      Contact Support
    </Link>

    <Link
      href="/terms"
      className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
    >
      View Terms
    </Link>
  </div>
</div>
        
      </section>
    </main>
  );
}
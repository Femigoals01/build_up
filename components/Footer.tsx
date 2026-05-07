




import Link from "next/link";
import BuildUpLogo from "@/components/brand/BuildUpLogo";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-8 lg:px-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center">
              <BuildUpLogo
                href="/"
                showTagline
                dark
                className="items-center"
                imageClassName="rounded-xl bg-white p-1"
              />
            </div>

            <p className="max-w-sm text-sm leading-7 text-slate-400">
              A platform connecting volunteers, organizations, and mentors
              through real-world projects that build practical skills, trusted
              portfolios, and meaningful growth.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/projects" className="transition hover:text-white">
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="transition hover:text-white"
                >
                  How it Works
                </Link>
              </li>
              <li>
                <Link
                  href="/register/mentor"
                  className="transition hover:text-white"
                >
                  Become a Mentor
                </Link>
              </li>
              <li>
                <Link href="/support" className="transition hover:text-white">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Get Started
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/register/volunteer"
                  className="transition hover:text-white"
                >
                  Join as Volunteer
                </Link>
              </li>
              <li>
                <Link
                  href="/register/organization"
                  className="transition hover:text-white"
                >
                  Join as Organization
                </Link>
              </li>
              <li>
                <Link
                  href="/register/mentor"
                  className="transition hover:text-white"
                >
                  Join as Mentor
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-white">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Community
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <a href="#" className="transition hover:text-white">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-white">
                  LinkedIn
                </a>
              </li>
            </ul>

         
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} InsighTecHub. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/privacy"
              className="rounded-full px-2 py-1 transition hover:bg-slate-900 hover:text-white"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="rounded-full px-2 py-1 transition hover:bg-slate-900 hover:text-white"
            >
              Terms
            </Link>
            <Link
              href="/support"
              className="rounded-full px-2 py-1 transition hover:bg-slate-900 hover:text-white"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

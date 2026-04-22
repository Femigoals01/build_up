



"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BuildUpLogo from "@/components/brand/BuildUpLogo";

const COUNTRY_OPTIONS = [
  { name: "Nigeria", code: "+234" },
  { name: "Ghana", code: "+233" },
  { name: "Kenya", code: "+254" },
  { name: "South Africa", code: "+27" },
  { name: "United Kingdom", code: "+44" },
  { name: "United States", code: "+1" },
  { name: "Canada", code: "+1" },
  { name: "India", code: "+91" },
  { name: "Germany", code: "+49" },
  { name: "France", code: "+33" },
];

export default function MentorRegister() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const selectedCountry = useMemo(
    () => COUNTRY_OPTIONS.find((item) => item.name === country) ?? null,
    [country]
  );

  const handleCountryChange = (value: string) => {
    setCountry(value);
    const selected = COUNTRY_OPTIONS.find((item) => item.name === value);
    setCountryCode(selected?.code || "");
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const password = String(formData.get("password") || "");
    const email = String(formData.get("email") || "").trim().toLowerCase();

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email,
      password,
      confirmPassword,
      expertise: String(formData.get("expertise") || "").trim(),
      experience: String(formData.get("experience") || "").trim(),
      portfolio: String(formData.get("portfolio") || "").trim(),
      bio: String(formData.get("bio") || "").trim(),
      country,
      countryCode,
      mobileNumber: mobileNumber.trim(),
    };

    try {
      const res = await fetch("/api/register/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type");
      const data = contentType?.includes("application/json")
        ? await res.json()
        : null;

      if (!res.ok) {
        throw new Error(data?.error || "Registration failed");
      }

      router.push(
        data?.redirectTo ||
          `/verify-email?email=${encodeURIComponent(payload.email)}`
      );
    } catch (error: any) {
      setError(error?.message || "Mentor registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 px-4 py-8">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 lg:grid-cols-2">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <span className="h-2 w-2 rounded-full bg-indigo-600" />
              Join BuildUp as a Mentor
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-900">
              Guide talent.
              <br />
              Share experience.
              <br />
              Create impact.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
              Become a mentor on BuildUp and help volunteers grow through real
              projects, practical feedback, and meaningful direction.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Mentorship</p>
                <p className="mt-1 text-sm text-slate-500">
                  Guide real contributors
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Projects</p>
                <p className="mt-1 text-sm text-slate-500">
                  Support real-world work
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Impact</p>
                <p className="mt-1 text-sm text-slate-500">
                  Help shape growth journeys
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <div className="relative px-6 py-8 md:px-8 md:py-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_22%)]" />

              <div className="relative z-10">
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center">
                    <BuildUpLogo
                      href="/"
                      showTagline={false}
                      className="justify-center"
                    />
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                    Become a Mentor on BuildUp
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Share your experience, guide learners, and verify your email
                    before entering the BuildUp mentor flow.
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      type="text"
                      placeholder="Enter your full name"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        required
                        type="email"
                        placeholder="Enter your email"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="country"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Country
                      </label>
                      <select
                        id="country"
                        required
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                        value={country}
                        onChange={(e) => handleCountryChange(e.target.value)}
                      >
                        <option value="">Select country</option>
                        {COUNTRY_OPTIONS.map((item) => (
                          <option key={`${item.name}-${item.code}`} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-[140px_1fr]">
                    <div>
                      <label
                        htmlFor="countryCode"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Code
                      </label>
                      <select
                        id="countryCode"
                        required
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                      >
                        <option value="">Code</option>
                        {COUNTRY_OPTIONS.map((item) => (
                          <option key={`${item.name}-${item.code}-code`} value={item.code}>
                            {item.code}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="mobileNumber"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Mobile Number
                      </label>
                      <input
                        id="mobileNumber"
                        required
                        type="tel"
                        inputMode="tel"
                        placeholder="8123456789"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-500">
                    {selectedCountry
                      ? `Selected country: ${selectedCountry.name}`
                      : "Choose your country and country code before entering your number."}
                  </p>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Password
                      </label>

                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          required
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a secure password"
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-20 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Confirm Password
                      </label>

                      <input
                        id="confirmPassword"
                        required
                        type={showPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="expertise"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Primary Expertise
                      </label>
                      <select
                        id="expertise"
                        name="expertise"
                        required
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      >
                        <option value="">Select your area</option>
                        <option>UI/UX Design</option>
                        <option>Frontend Development</option>
                        <option>Backend Development</option>
                        <option>Mobile App Development</option>
                        <option>Graphic Design</option>
                        <option>Project Management</option>
                        <option>Data Analysis</option>
                        <option>Digital Marketing</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="experience"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Years of Experience
                      </label>
                      <input
                        id="experience"
                        name="experience"
                        required
                        type="number"
                        min="0"
                        placeholder="e.g. 5"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="portfolio"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Portfolio / LinkedIn
                    </label>
                    <input
                      id="portfolio"
                      name="portfolio"
                      type="url"
                      placeholder="https://linkedin.com/in/you"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="bio"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Short Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      required
                      placeholder="Tell us how you want to support volunteers, what experience you bring, and the kind of mentorship you can provide."
                      className="min-h-[140px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Registering..." : "Register as Mentor"}
                  </button>

                  <p className="text-center text-sm text-slate-500">
                    Not a mentor?{" "}
                    <Link
                      href="/choose-role"
                      className="font-semibold text-indigo-600 hover:underline"
                    >
                      Choose another role
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-2xl rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm lg:hidden">
            <h3 className="text-base font-semibold text-slate-900">
              Why mentor on BuildUp?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              BuildUp gives mentors a chance to guide real projects, support
              rising talent, and contribute meaningfully to practical learning.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
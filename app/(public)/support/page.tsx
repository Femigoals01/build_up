




"use client";

import Link from "next/link";
import { useState } from "react";

const supportItems = [
  {
    title: "General Support",
    description:
      "Get help with using the platform, navigation, account access, or project participation.",
  },
  {
    title: "Technical Issues",
    description:
      "Report bugs, broken pages, login issues, or other platform-related problems.",
  },
  {
    title: "Account & Profile Help",
    description:
      "Ask about your profile, portfolio, visibility settings, or account information.",
  },
  {
    title: "Organization & Project Support",
    description:
      "Get help posting projects, reviewing applications, or managing collaboration.",
  },
];

const supportCategories = [
  "General Support",
  "Technical Issues",
  "Account & Profile Help",
  "Organization & Project Support",
];

export default function SupportPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to submit support request.");
        return;
      }

      // setSuccessMessage("Your support request has been submitted successfully.");
      setSuccessMessage(
  `✅ Support request submitted successfully.

Ticket Number: ${data.ticketNo}

Please save this reference number. Our team may ask for it when following up on your request.`
);
      setForm({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
      });
    } catch (error) {
      console.error("Support form error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-slate-50/70">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
            Support
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            We’re here to help
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Need help with BuildUp? Reach out for support, report an issue, or
            contact us about your account, projects, or platform experience.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {supportItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h2 className="text-xl font-semibold text-slate-900">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <Link
                href="/privacy"
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:bg-slate-50"
              >
                <h3 className="text-sm font-semibold text-slate-900">
                  Privacy Policy
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Learn how your data is handled and protected.
                </p>
              </Link>

              <Link
                href="/terms"
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:bg-slate-50"
              >
                <h3 className="text-sm font-semibold text-slate-900">
                  Terms &amp; Conditions
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Understand the rules and responsibilities of using BuildUp.
                </p>
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-r from-white via-blue-50 to-indigo-50 p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-semibold text-slate-900">
              Contact BuildUp Support
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Fill in the form below and our team will review your message as
              soon as possible.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What do you need help with?"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select a category</option>
                  {supportCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us more about the issue or support you need..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* {successMessage ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {successMessage}
                </div>
              ) : null} */}


              {/* {successMessage ? (
  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
    <div className="text-sm font-bold text-emerald-700">
      Support Request Submitted
    </div>

    <div className="mt-2 whitespace-pre-line text-sm text-emerald-800">
      {successMessage}
    </div>
  </div>
) : null} */}

{successMessage ? (
  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
    <p className="text-sm font-bold text-emerald-700">
      Support Request Submitted
    </p>

    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-emerald-800">
      {successMessage}
    </p>

    <Link
      href="/dashboard/support"
      className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700"
    >
      View My Support Tickets →
    </Link>
  </div>
) : null}

              {errorMessage ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Submitting..." : "Submit Support Request"}
                </button>

                <Link
                  href="/"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Back to Home
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
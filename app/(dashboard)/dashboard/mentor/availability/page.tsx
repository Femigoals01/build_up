

"use client";

import { useEffect, useState } from "react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type Availability = {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

export default function MentorAvailabilityPage() {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadAvailability() {
    try {
      setLoading(true);

      const res = await fetch("/api/mentor-availability");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load availability.");
      }

      setAvailability(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAvailability();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!startTime || !endTime) {
      setError("Please select both start time and end time.");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch("/api/mentor-availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dayOfWeek,
          startTime,
          endTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save availability.");
      }

      setMessage("Availability added successfully.");
      setStartTime("");
      setEndTime("");
      await loadAvailability();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setMessage("");
    setError("");

    const confirmed = window.confirm(
      "Are you sure you want to remove this availability?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch("/api/mentor-availability", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to remove availability.");
      }

      setMessage("Availability removed successfully.");
      await loadAvailability();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Mentor Office Hours
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Manage Your Availability
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Set the days and times you are available so volunteers can book
            mentorship sessions with you.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Add Availability
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose a day and time range for your office hours.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Day
                </label>

                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  {DAYS.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Start Time
                </label>

                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  End Time
                </label>

                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              {message && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Add Availability"}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Your Office Hours
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Volunteers will see these available time slots.
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">
                {availability.length} slot{availability.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="mt-6">
              {loading ? (
                <div className="rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500">
                  Loading availability...
                </div>
              ) : availability.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                    🗓️
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-900">
                    No availability added yet
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Add your first office hour slot using the form.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availability.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {slot.dayOfWeek}
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-600">
                          {slot.startTime} - {slot.endTime}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(slot.id)}
                        className="rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
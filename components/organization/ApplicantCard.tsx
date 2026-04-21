



"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  applicationId: string;
  name: string;
  email: string;
  status: string;
  username?: string | null;
  bio?: string | null;
  skills?: string | null;
  country?: string | null;
  profileImageUrl?: string | null;
  experience?: string | null;
};

function getInitial(name?: string | null) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "U";
}

function splitSkills(skills?: string | null) {
  if (!skills?.trim()) return [];
  return skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

export default function ApplicantCard({
  applicationId,
  name,
  email,
  status,
  username,
  bio,
  skills,
  country,
  profileImageUrl,
  experience,
}: Props) {
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: "ACCEPTED" | "REJECTED") => {
    setLoading(true);

    const res = await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      window.location.reload();
    } else {
      alert("Failed to update status");
    }

    setLoading(false);
  };

  const volunteerSkills = splitSkills(skills);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt={name || "Volunteer"}
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
                {getInitial(name)}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base font-bold text-slate-900">{name}</p>

              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {status}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {username ? `@${username}` : "Username not added yet"}
              {country ? ` • ${country}` : ""}
            </p>

            <p className="mt-1 text-sm text-slate-500">{email}</p>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              {bio?.trim()
                ? bio
                : "This volunteer has not added a bio yet."}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {volunteerSkills.length > 0 ? (
                volunteerSkills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  No skills added yet
                </span>
              )}
            </div>

            <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
              Experience:{" "}
              <span className="text-slate-600 normal-case tracking-normal">
                {experience?.trim() ? experience : "Not added yet"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {username ? (
            <Link
              href={`/portfolio/${username}`}
              className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              View Portfolio
            </Link>
          ) : (
            <span className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-500">
              No Portfolio Yet
            </span>
          )}

          {status === "PENDING" && (
            <>
              <button
                onClick={() => updateStatus("ACCEPTED")}
                disabled={loading}
                className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Accept
              </button>

              <button
                onClick={() => updateStatus("REJECTED")}
                disabled={loading}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}






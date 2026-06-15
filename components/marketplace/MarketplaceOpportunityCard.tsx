



"use client";

import Image from "next/image";
import Link from "next/link";

type MarketplaceOpportunity = {
  id: string;
  title: string;
  description: string;
  type: string;
  workMode?: string | null;
  location?: string | null;
  compensation?: string | null;
  applicationUrl?: string | null;
  imageUrl?: string | null;
  sponsoredActive: boolean;
  organization: {
    id: string;
    name: string;
    username: string;
    headline?: string | null;
    country?: string | null;
    profileImageUrl?: string | null;
    organizationVerified?: boolean;
  };
  // _count: {
  //   leads: number;
  // };
};

function formatType(type: string) {
  return type
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function typeStyle(type: string) {
  if (type === "JOB") return "border-blue-200 bg-blue-50 text-blue-700";
  if (type === "PROMOTION")
    return "border-purple-200 bg-purple-50 text-purple-700";
  if (type === "EVENT") return "border-amber-200 bg-amber-50 text-amber-700";
  if (type === "COURSE")
    return "border-emerald-200 bg-emerald-50 text-emerald-700";

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function getTypeIcon(type: string) {
  if (type === "JOB") return "💼";
  if (type === "PROMOTION") return "📢";
  if (type === "EVENT") return "🎟️";
  if (type === "COURSE") return "🎓";
  return "🛠️";
}

function getInitial(name?: string | null) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "O";
}

async function trackOpportunityEvent({
  opportunityId,
  eventType,
}: {
  opportunityId: string;
  eventType: "VIEW_DETAILS_CLICK" | "MARKETPLACE_CLICK";
}) {
  try {
    await fetch("/api/opportunity-analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true,
      body: JSON.stringify({
        opportunityId,
        eventType,
        source: "MARKETPLACE_CARD",
      }),
    });
  } catch {
    // Analytics must never block navigation.
  }
}

export default function MarketplaceOpportunityCard({
  opportunity,
}: {
  opportunity: MarketplaceOpportunity;
}) {
  return (
    <article
      className={`group overflow-hidden rounded-[30px] border bg-white shadow-lg shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-xl ${
        opportunity.sponsoredActive
          ? "border-purple-200 ring-4 ring-purple-50"
          : "border-slate-200"
      }`}
    >
      <div
        className={`h-2 ${
          opportunity.sponsoredActive
            ? "bg-gradient-to-r from-purple-500 via-blue-600 to-emerald-500"
            : "bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500"
        }`}
      />

      {/* <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        {opportunity.imageUrl ? (
          <Image
            src={opportunity.imageUrl}
            alt={opportunity.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        ) : ( */}



<div className="relative h-44 w-full overflow-hidden bg-slate-950">
  {opportunity.imageUrl ? (
    <>
      <Image
        src={opportunity.imageUrl}
        alt=""
        fill
        className="scale-110 object-cover opacity-30 blur-2xl transition duration-500 group-hover:scale-125"
        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
      />

      <Image
        src={opportunity.imageUrl}
        alt={opportunity.title}
        fill
        className="object-contain transition duration-500 group-hover:scale-[1.02]"
        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
      />
    </>
  ) : (


          <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="text-center">
              <div className="text-4xl">{getTypeIcon(opportunity.type)}</div>
              <p className="mt-2 text-sm font-black text-slate-500">
                No Image Provided
              </p>
            </div>
          </div>
        )}

        {opportunity.sponsoredActive && (
          <div className="absolute left-4 top-4 rounded-full bg-purple-600 px-3 py-1 text-xs font-black text-white shadow-lg">
            Sponsored
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-black ${typeStyle(
              opportunity.type
            )}`}
          >
            {getTypeIcon(opportunity.type)} {formatType(opportunity.type)}
          </span>

          {opportunity.sponsoredActive && (
            <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-black text-purple-700">
              Featured
            </span>
          )}

          {opportunity.organization.organizationVerified && (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
              ✅ Verified
            </span>
          )}
        </div>

        <h3 className="mt-4 text-xl font-black text-slate-950">
          {opportunity.title}
        </h3>

        <p className="mt-3 line-clamp-3 min-h-[72px] text-sm leading-6 text-slate-600">
          {opportunity.description}
        </p>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-2xl bg-blue-600 text-white">
            {opportunity.organization.profileImageUrl ? (
              <Image
                src={opportunity.organization.profileImageUrl}
                alt={opportunity.organization.name}
                fill
                className="object-cover"
                sizes="44px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-black">
                {getInitial(opportunity.organization.name)}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-black text-slate-900">
                {opportunity.organization.name}
              </p>

              {opportunity.organization.organizationVerified && (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700">
                  ✅ Verified
                </span>
              )}
            </div>

            <p className="truncate text-xs font-semibold text-slate-500">
              {opportunity.organization.country ||
                opportunity.organization.headline ||
                "BuildUp Organization"}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
          {opportunity.workMode && (
            <span className="rounded-full bg-slate-100 px-3 py-1">
              {opportunity.workMode}
            </span>
          )}

          {opportunity.location && (
            <span className="rounded-full bg-slate-100 px-3 py-1">
              📍 {opportunity.location}
            </span>
          )}

          {opportunity.compensation && (
            <span className="rounded-full bg-slate-100 px-3 py-1">
              💰 {opportunity.compensation}
            </span>
          )}
{/* 
          <span className="rounded-full bg-slate-100 px-3 py-1">
            📩 {opportunity._count.leads} leads
          </span> */}
        </div>

        <div className="mt-6 grid gap-3">
          <Link
            href={`/marketplace/${opportunity.id}`}
            onClick={() =>
              trackOpportunityEvent({
                opportunityId: opportunity.id,
                eventType: "VIEW_DETAILS_CLICK",
              })
            }
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700"
          >
            View Details
          </Link>

          {opportunity.applicationUrl ? (
            <a
              href={opportunity.applicationUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                trackOpportunityEvent({
                  opportunityId: opportunity.id,
                  eventType: "MARKETPLACE_CLICK",
                })
              }
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              Visit Link
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
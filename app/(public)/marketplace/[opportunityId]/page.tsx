



import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OpportunityLeadForm from "@/components/opportunities/OpportunityLeadForm";

export const dynamic = "force-dynamic";

function formatType(type: string) {
  return type.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function getInitial(name?: string | null) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "O";
}

export default async function OpportunityDetailsPage({
  params,
}: {
  params: Promise<{ opportunityId: string }>;
}) {
  const { opportunityId } = await params;

  const opportunity = await prisma.opportunity.findFirst({
    where: {
      id: opportunityId,
      status: "PUBLISHED",
    },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          username: true,
          headline: true,
          country: true,
          profileImageUrl: true,
          organizationVerified: true,
        },
      },
    },
  });

  if (!opportunity) {
    notFound();
  }

  await prisma.opportunity.update({
    where: { id: opportunity.id },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link
          href="/marketplace"
          className="text-sm font-black text-blue-600 hover:text-blue-700"
        >
          ← Back to marketplace
        </Link>

        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          
          
          {/* {opportunity.imageUrl && (
            <div className="relative h-64 w-full bg-slate-100">
              <Image
                src={opportunity.imageUrl}
                alt={opportunity.title}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          )} */}


          {opportunity.imageUrl && (
  <div className="relative flex h-[420px] w-full items-center justify-center overflow-hidden bg-slate-950">
    <Image
      src={opportunity.imageUrl}
      alt=""
      fill
      className="scale-110 object-cover opacity-30 blur-2xl"
      sizes="100vw"
    />

    <Image
      src={opportunity.imageUrl}
      alt={opportunity.title}
      fill
      className="object-contain"
      sizes="100vw"
      priority
    />
  </div>
)}

          <div className="grid gap-8 p-6 lg:grid-cols-[1fr_360px] lg:p-8">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                  {formatType(opportunity.type)}
                </span>

                {opportunity.featured && (
                  <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-black text-purple-700">
                    Featured
                  </span>
                )}

                {opportunity.organization.organizationVerified && (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                    ✅ Verified Organization
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {opportunity.title}
              </h1>


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

  {opportunity.type === "JOB" && (
    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
      ✅ Applications Open
    </span>
  )}
</div>



              <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-xl font-black text-slate-900">
                  Opportunity Description
                </h2>

                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">
                  {opportunity.description}
                </p>
              </div>

              {(opportunity.startDate || opportunity.endDate) && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {opportunity.startDate && (
                    <InfoCard
                      label="Start Date"
                      value={new Date(
                        opportunity.startDate
                      ).toLocaleDateString()}
                    />
                  )}

                  {opportunity.endDate && (
                    <InfoCard
                      label="End Date"
                      value={new Date(
                        opportunity.endDate
                      ).toLocaleDateString()}
                    />
                  )}
                </div>
              )}
            </div>

            <aside className="space-y-6">
              <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Posted By
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-blue-600 text-white">
                    {opportunity.organization.profileImageUrl ? (
                      <Image
                        src={opportunity.organization.profileImageUrl}
                        alt={opportunity.organization.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg font-black">
                        {getInitial(opportunity.organization.name)}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-black text-slate-900">
                        {opportunity.organization.name}
                      </p>

                      {opportunity.organization.organizationVerified && (
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                          ✅ Verified
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-semibold text-slate-500">
                      {opportunity.organization.country ||
                        "BuildUp Organization"}
                    </p>
                  </div>
                </div>
              </section>

              {/* <OpportunityLeadForm
                opportunityId={opportunity.id}
                applicationUrl={opportunity.applicationUrl}
              /> */}

              <OpportunityLeadForm
  opportunityId={opportunity.id}
  opportunityType={opportunity.type}
  applicationUrl={opportunity.applicationUrl}
/>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}
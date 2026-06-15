



"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const OPPORTUNITY_TYPES = [
  { label: "Project", value: "PROJECT" },
  { label: "Job", value: "JOB" },
  { label: "Promotion", value: "PROMOTION" },
  { label: "Event", value: "EVENT" },
  { label: "Course", value: "COURSE" },
];

const WORK_MODES = [
  { label: "Remote", value: "REMOTE" },
  { label: "Hybrid", value: "HYBRID" },
  { label: "Onsite", value: "ONSITE" },
];

const STATUSES = [
  { label: "Publish Now", value: "PUBLISHED" },
  { label: "Save as Draft", value: "DRAFT" },
];

const TYPE_COPY = {
  JOB: {
    eyebrow: "Hiring Opportunity",
    titleLabel: "Job Title",
    titlePlaceholder: "e.g. Junior React Developer",
    workModeLabel: "Work Mode",
    locationLabel: "Job Location",
    locationPlaceholder: "e.g. Lagos, Abuja, Remote",
    compensationLabel: "Salary / Compensation",
    compensationPlaceholder: "e.g. ₦250,000/month",
    urlLabel: "Application URL",
    urlPlaceholder: "https://company.com/careers/apply",
    emailLabel: "Hiring Contact Email",
    emailPlaceholder: "hr@company.com",
    imageLabel: "Job Banner / Hiring Image",
    startDateLabel: "Application Opens",
    endDateLabel: "Application Deadline",
    descriptionLabel: "Job Description",
    descriptionPlaceholder:
      "Describe the role, responsibilities, required skills, experience level, salary range, and how applicants should apply...",
    note:
      "This will appear as a job opportunity in the BuildUp marketplace. A strong job banner and clear compensation details can increase applications.",
  },
  PROJECT: {
    eyebrow: "Project Opportunity",
    titleLabel: "Project Title",
    titlePlaceholder: "e.g. Build a Landing Page for Our Campaign",
    workModeLabel: "Project Mode",
    locationLabel: "Project Location",
    locationPlaceholder: "e.g. Remote, Lagos, Hybrid",
    compensationLabel: "Project Budget / Stipend",
    compensationPlaceholder: "e.g. ₦50,000 stipend",
    urlLabel: "Project Brief / Reference URL",
    urlPlaceholder: "https://example.com/project-brief",
    emailLabel: "Project Contact Email",
    emailPlaceholder: "projects@company.com",
    imageLabel: "Project Brief Image",
    startDateLabel: "Project Start Date",
    endDateLabel: "Project Deadline",
    descriptionLabel: "Project Description",
    descriptionPlaceholder:
      "Describe the project goal, deliverables, required skills, timeline, expected outcome, and how volunteers should respond...",
    note:
      "This will appear as a project opportunity. Clear deliverables, timeline, and stipend details help volunteers understand the work quickly.",
  },
  PROMOTION: {
    eyebrow: "Business Promotion",
    titleLabel: "Product / Service Name",
    titlePlaceholder: "e.g. 30% Off Business Branding Package",
    workModeLabel: "Availability Mode",
    locationLabel: "Business Location",
    locationPlaceholder: "e.g. Ibadan, Lagos, Nationwide, Online",
    compensationLabel: "Offer / Price",
    compensationPlaceholder: "e.g. ₦10,000 discount or From ₦25,000",
    urlLabel: "Website / Offer URL",
    urlPlaceholder: "https://yourbusiness.com/offer",
    emailLabel: "Business Contact Email",
    emailPlaceholder: "sales@yourbusiness.com",
    imageLabel: "Promo Flyer / Product Image",
    startDateLabel: "Offer Start Date",
    endDateLabel: "Offer End Date",
    descriptionLabel: "Promotion Description",
    descriptionPlaceholder:
      "Describe the product/service, offer benefits, price, discount, target customers, and how interested people should contact you...",
    note:
      "This will appear as a business promotion. A clear flyer or product image makes your promotion more attractive.",
  },
  EVENT: {
    eyebrow: "Event Listing",
    titleLabel: "Event Title",
    titlePlaceholder: "e.g. Tech Career Bootcamp 2026",
    workModeLabel: "Event Mode",
    locationLabel: "Venue / Location",
    locationPlaceholder: "e.g. Lagos, Online, Hybrid",
    compensationLabel: "Ticket Fee / Entry",
    compensationPlaceholder: "e.g. Free, ₦5,000 ticket, Invite-only",
    urlLabel: "Registration / Ticket URL",
    urlPlaceholder: "https://event.com/register",
    emailLabel: "Event Contact Email",
    emailPlaceholder: "events@company.com",
    imageLabel: "Event Flyer / Banner",
    startDateLabel: "Event Start Date",
    endDateLabel: "Event End Date",
    descriptionLabel: "Event Description",
    descriptionPlaceholder:
      "Describe the event, speakers, agenda, audience, ticket details, venue, and how people should register...",
    note:
      "This will appear as an event listing. Add a flyer or banner so users can quickly understand the event.",
  },
  COURSE: {
    eyebrow: "Course Listing",
    titleLabel: "Course Title",
    titlePlaceholder: "e.g. Beginner UI/UX Design Course",
    workModeLabel: "Course Format",
    locationLabel: "Learning Location",
    locationPlaceholder: "e.g. Online, Lagos, Hybrid",
    compensationLabel: "Course Fee",
    compensationPlaceholder: "e.g. Free, ₦30,000, Scholarship available",
    urlLabel: "Course Registration URL",
    urlPlaceholder: "https://academy.com/register",
    emailLabel: "Course Contact Email",
    emailPlaceholder: "academy@company.com",
    imageLabel: "Course Cover Image",
    startDateLabel: "Course Start Date",
    endDateLabel: "Course End Date",
    descriptionLabel: "Course Description",
    descriptionPlaceholder:
      "Describe the course, learning outcomes, duration, requirements, certificate, fee, and how students should register...",
    note:
      "This will appear as a course listing. A clean course cover image and clear learning outcomes can increase registrations.",
  },
} as const;

type OpportunityTypeKey = keyof typeof TYPE_COPY;

function getTypeCopy(type: string) {
  return TYPE_COPY[(type as OpportunityTypeKey) || "JOB"] || TYPE_COPY.JOB;
}

export default function NewOpportunityPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<OpportunityTypeKey>("JOB");
  const [status, setStatus] = useState("PUBLISHED");
  const [workMode, setWorkMode] = useState("");
  const [location, setLocation] = useState("");
  const [compensation, setCompensation] = useState("");
  const [applicationUrl, setApplicationUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const [error, setError] = useState("");

  const copy = useMemo(() => getTypeCopy(type), [type]);

  function handleTypeChange(nextType: OpportunityTypeKey) {
    setType(nextType);
    setWorkMode("");
    setError("");
  }

  async function uploadOpportunityImage(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    try {
      const file = e.target.files?.[0];

      if (!file) return;

      setError("");
      setUploadingImage(true);
      setUploadProgressText("Uploading image...");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/opportunity-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image.");
      }

      setImageUrl(data.url);
      setUploadProgressText("Image uploaded successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image.");
      setUploadProgressText("");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          type,
          status,
          workMode,
          location,
          compensation,
          applicationUrl,
          contactEmail,
          imageUrl,
          startDate,
          endDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create opportunity.");
      }

      router.push("/dashboard/organization/opportunities");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link
          href="/dashboard/organization/opportunities"
          className="text-sm font-bold text-blue-600 hover:text-blue-700"
        >
          ← Back to opportunities
        </Link>

        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 px-6 py-10 text-white sm:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
              {copy.eyebrow}
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Post a {OPPORTUNITY_TYPES.find((item) => item.value === type)?.label}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
              Choose the category and BuildUp will adjust the form fields for
              jobs, projects, promotions, events, and courses.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 p-6 sm:p-8">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {error}
              </div>
            )}

            <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Select Opportunity Category
              </p>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {OPPORTUNITY_TYPES.map((item) => {
                  const active = type === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        handleTypeChange(item.value as OpportunityTypeKey)
                      }
                      className={`rounded-2xl border px-4 py-3 text-sm font-black transition ${
                        active
                          ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-100"
                          : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="grid gap-5 md:grid-cols-2">
              <Field label={copy.titleLabel}>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={copy.titlePlaceholder}
                  className="input"
                />
              </Field>

              <Field label="Opportunity Type">
                <select
                  value={type}
                  onChange={(e) =>
                    handleTypeChange(e.target.value as OpportunityTypeKey)
                  }
                  className="input"
                >
                  {OPPORTUNITY_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Status">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="input"
                >
                  {STATUSES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={copy.workModeLabel}>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="input"
                >
                  <option value="">Not applicable</option>
                  {WORK_MODES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={copy.locationLabel}>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={copy.locationPlaceholder}
                  className="input"
                />
              </Field>

              <Field label={copy.compensationLabel}>
                <input
                  value={compensation}
                  onChange={(e) => setCompensation(e.target.value)}
                  placeholder={copy.compensationPlaceholder}
                  className="input"
                />
              </Field>

              <Field label={copy.urlLabel}>
                <input
                  value={applicationUrl}
                  onChange={(e) => setApplicationUrl(e.target.value)}
                  placeholder={copy.urlPlaceholder}
                  className="input"
                />
              </Field>

              <Field label={copy.emailLabel}>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder={copy.emailPlaceholder}
                  className="input"
                />
              </Field>

              <Field label={copy.imageLabel}>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadOpportunityImage}
                    disabled={uploadingImage}
                    className="input cursor-pointer"
                  />

                  {uploadProgressText && (
                    <p
                      className={`text-xs font-bold ${
                        imageUrl ? "text-emerald-600" : "text-blue-600"
                      }`}
                    >
                      {uploadProgressText}
                    </p>
                  )}

                  {uploadingImage && (
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full w-full animate-pulse bg-blue-600" />
                    </div>
                  )}

                  <p className="text-xs leading-5 text-slate-500">
                    Upload a relevant image for this {type.toLowerCase()}. JPG,
                    PNG, or WEBP only.  Recommended size: 1200 × 675 px.
                  </p>
                </div>
              </Field>

              <Field label={copy.startDateLabel}>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input"
                />
              </Field>

              <Field label={copy.endDateLabel}>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input"
                />
              </Field>
            </section>


            
{/* 
            {imageUrl && (
              <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Image Preview
                </p>

                <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white">
                  
                  <img
                    src={imageUrl}
                    alt="Opportunity preview"
                    className="h-72 w-full object-cover"
                  />

                  <div className="border-t border-slate-200 p-4">
                    <p className="text-xs font-bold text-emerald-600">
                      ✓ Image ready for Marketplace and Homepage
                    </p>
                  </div>
                </div>
              </section>
            )} */}



{imageUrl && (
  <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
      Image Preview
    </p>

    <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <div className="relative flex h-[420px] items-center justify-center overflow-hidden bg-slate-950">
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-2xl"
        />

        <img
          src={imageUrl}
          alt="Opportunity preview"
          className="relative z-10 max-h-full max-w-full object-contain"
        />
      </div>

      <div className="border-t border-slate-200 p-4">
        <p className="text-xs font-bold text-emerald-600">
          ✓ Entire image visible. Ready for Marketplace and Homepage.
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Recommended upload size: 1200 × 675 px.
        </p>
      </div>
    </div>
  </section>
)}





            <Field label={copy.descriptionLabel}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                placeholder={copy.descriptionPlaceholder}
                className="input resize-none leading-7"
              />
            </Field>

            <section className="rounded-[28px] border border-blue-100 bg-blue-50 p-5">
              <h2 className="text-lg font-black text-blue-950">
                How this will appear
              </h2>

              <p className="mt-2 text-sm leading-6 text-blue-700">
                {copy.note}
              </p>
            </section>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/dashboard/organization/opportunities"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-600 px-6 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating..." : `Create ${formatTypeName(type)}`}
              </button>
            </div>
          </form>
        </section>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgb(226 232 240);
          background: white;
          padding: 0.85rem 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: rgb(30 41 59);
          outline: none;
          transition: all 0.2s ease;
        }

        .input::placeholder {
          color: rgb(148 163 184);
          font-weight: 500;
        }

        .input:focus {
          border-color: rgb(59 130 246);
          box-shadow: 0 0 0 4px rgb(219 234 254);
        }
      `}</style>
    </main>
  );
}

function formatTypeName(type: string) {
  return type.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </span>

      {children}
    </label>
  );
}
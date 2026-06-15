

"use client";

import Link from "next/link";
import { useState } from "react";
import ProjectMentorRequestModal from "@/components/mentorship/ProjectMentorRequestModal";

type Project = {
  id: string;
  title: string;
};

export default function MentorProfileActions({
  mentorId,
  projects,
}: {
  mentorId: string;
  projects: Project[];
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            if (projects.length === 0) {
              alert("You need an active project to request mentorship");
              return;
            }

            setShowModal(true);
          }}
          className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
        >
          Request Mentorship
        </button>

        <Link
          href={`/dashboard/volunteer/mentors/${mentorId}/book`}
          className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          Book Session
        </Link>

        <button
          type="button"
          disabled
          className="inline-flex cursor-not-allowed items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-bold text-slate-400"
        >
          Message Mentor Soon
        </button>
      </div>

      {showModal && (
        <ProjectMentorRequestModal
          mentorId={mentorId}
          projects={projects}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
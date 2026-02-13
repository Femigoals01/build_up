
export default function ActionPanel({
  pending,
  active,
  completed,
}: {
  pending: number;
  active: number;
  completed: number;
}) {
  let title = "";
  let description = "";
  let cta = "";
  let href = "";

  if (pending > 0) {
    title = "⏳ Applications Pending";
    description = `You have ${pending} application${pending > 1 ? "s" : ""} awaiting response.`;
    cta = "View applications";
    href = "/dashboard/projects?tab=PENDING";
  } else if (active > 0) {
    title = "🚀 Active Project";
    description = `You have ${active} active project${active > 1 ? "s" : ""}. Stay on track.`;
    cta = "View active projects";
    href = "/dashboard/projects?tab=ACTIVE";
  } else if (completed < 5) {
    title = "🏆 Build Your Reputation";
    description = `Complete ${5 - completed} more project${5 - completed > 1 ? "s" : ""} to unlock your next badge.`;
    cta = "Browse projects";
    href = "/projects";
  } else {
    title = "🎉 Great Work!";
    description = "You’re doing great. Keep applying for better opportunities.";
    cta = "Explore projects";
    href = "/projects";
  }

  return (
    <section className="bg-white border rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>

      <a
        href={href}
        className="inline-flex items-center justify-center px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
      >
        {cta} →
      </a>
    </section>
  );
}

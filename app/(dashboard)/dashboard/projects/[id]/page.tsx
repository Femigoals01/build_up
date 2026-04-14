



import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export default async function ProjectDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      organization: {
        select: { name: true },
      },
    },
  });

  if (!project) return notFound();

  return (
    <main className="min-h-screen bg-gray-50 px-10 py-10">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {project.title}
          </h1>
          <p className="text-gray-500 mt-2">
            Posted by {project.organization.name}
          </p>
        </div>

        {/* Description */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-2">Project Description</h2>
          <p className="text-gray-700 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Requirements */}
        {project.requirements && (
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold mb-2">Requirements</h2>
            <p className="text-gray-700">
              {project.requirements}
            </p>
          </div>
        )}

        {/* Skills */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-3">Skills Needed</h2>
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill: string, i: number) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
            Apply to Project
          </button>
        </div>
      </div>
    </main>
  );
}
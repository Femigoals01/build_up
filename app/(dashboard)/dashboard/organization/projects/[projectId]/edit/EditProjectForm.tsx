"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Difficulty =
  | "BEGINNER"
  | "INTERMEDIATE"
  | "ADVANCED";

type Props = {
  project: {
    id: string;
    title: string;
    description: string;
    requirements: string;
    difficulty: Difficulty;
    skills: string[];
    stipendAmount: number;
    deliveryDays: number;
  };
};

export default function EditProjectForm({
  project,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(
    project.description
  );
  const [requirements, setRequirements] = useState(
    project.requirements
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(
    project.difficulty
  );
  const [skills, setSkills] = useState(
    project.skills.join(", ")
  );
  const [stipendAmount, setStipendAmount] = useState(
    project.stipendAmount
  );
  const [deliveryDays, setDeliveryDays] = useState(
    project.deliveryDays
  );

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        `/api/projects/${project.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            requirements,
            difficulty,
            skills: skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            stipendAmount,
            deliveryDays,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to update project");
        return;
      }

      alert("Project updated successfully");

      router.push("/dashboard/organization");

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Project Title
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-300 p-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full rounded-xl border border-slate-300 p-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Requirements
          </label>

          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-slate-300 p-3"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Stipend Amount (₦)
            </label>

            <input
              type="number"
              min="5000"
              value={stipendAmount}
              onChange={(e) =>
                setStipendAmount(Number(e.target.value))
              }
              className="w-full rounded-xl border border-slate-300 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Delivery Days
            </label>

            <input
              type="number"
              min="1"
              max="60"
              value={deliveryDays}
              onChange={(e) =>
                setDeliveryDays(Number(e.target.value))
              }
              className="w-full rounded-xl border border-slate-300 p-3"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Difficulty
          </label>

          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value as Difficulty)
            }
            className="w-full rounded-xl border border-slate-300 p-3"
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">
              Intermediate
            </option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Skills (comma separated)
          </label>

          <input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full rounded-xl border border-slate-300 p-3"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
          >
            {loading
              ? "Updating..."
              : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/organization")
            }
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
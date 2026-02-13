

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function MentorPendingPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "MENTOR") {
    redirect("/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg text-center bg-white p-10 rounded-2xl shadow">
        <h1 className="text-3xl font-bold mb-4">
          ⏳ Mentor Approval Pending
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for registering as a mentor on BuildUp.
          <br />
          Your profile is currently under review by an administrator.
        </p>

        <p className="text-sm text-gray-500">
          You’ll receive a notification once your account is approved.
        </p>
      </div>
    </main>
  );
}

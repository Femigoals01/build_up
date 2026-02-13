
"use client"
export default function ChooseRole() {
  return (
    <main className="min-h-screen px-6 py-20 flex flex-col items-center">

      {/* TITLE */}
      <h2 className="text-4xl font-bold mb-6 text-center">
        Choose How You Want to Get Started
      </h2>
      <p className="text-gray-600 text-lg mb-12 text-center max-w-xl">
        Select the role that best describes you. You can only register with one role per account.
      </p>

      {/* ROLE CARDS */}
      <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl">

        {/* VOLUNTEER CARD */}
        <a 
          href="/register/volunteer"
          className="bg-white border rounded-xl p-8 shadow hover:shadow-lg transition cursor-pointer text-center"
        >
          <img 
            src="/volunteer-icon.png" 
            alt="Volunteer Icon"
            className="w-20 mx-auto mb-6"
          />
          <h3 className="text-2xl font-bold mb-3">Volunteer</h3>
          <p className="text-gray-600">
            Learn by working on real projects and build your portfolio with reviews & badges.
          </p>
        </a>

        {/* ORGANIZATION CARD */}
        <a 
          href="/register/organization"
          className="bg-white border rounded-xl p-8 shadow hover:shadow-lg transition cursor-pointer text-center"
        >
          <img 
            src="/organization-icon.png" 
            alt="Organization Icon"
            className="w-20 mx-auto mb-6"
          />
          <h3 className="text-2xl font-bold mb-3">Organization</h3>
          <p className="text-gray-600">
            Post projects and get help from volunteers to complete tasks and grow your mission.
          </p>
        </a>

        {/* MENTOR CARD */}
        <a 
          href="/register/mentor"
          className="bg-white border rounded-xl p-8 shadow hover:shadow-lg transition cursor-pointer text-center"
        >
          <img 
            src="/mentor-icon.png" 
            alt="Mentor Icon"
            className="w-20 mx-auto mb-6"
          />
          <h3 className="text-2xl font-bold mb-3">Mentor</h3>
          <p className="text-gray-600">
            Guide learners, approve work, and help shape the next generation of skilled professionals.
          </p>
        </a>

      </div>

    </main>
  );
}

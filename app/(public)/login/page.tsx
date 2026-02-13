


// "use client";

// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const res = await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     });

//     if (res?.error) {
//       setError("Invalid email or password");
//     } else {
//       router.push("/dashboard");
//     }
//   };

//   return (
//     <main className="min-h-screen flex items-center justify-center">
//       <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-96">
//         <h1 className="text-2xl font-bold mb-4">Login</h1>

//         {error && <p className="text-red-600 mb-3">{error}</p>}

//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full border p-2 mb-3"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full border p-2 mb-4"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button className="w-full bg-blue-600 text-white p-2 rounded">
//           Login
//         </button>
//       </form>
//     </main>
//   );
// }



"use client";

import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    // ✅ Fetch session to read role
    const session = await getSession();

    setLoading(false);

    if (!session?.user?.role) {
      setError("Unable to determine user role");
      return;
    }

    // ✅ Role-based redirect
    switch (session.user.role) {
      case "ADMIN":
        router.push("/dashboard/admin");
        break;

      case "MENTOR":
        router.push("/dashboard/mentor");
        break;

      case "ORGANIZATION":
        router.push("/dashboard/organization");
        break;

      case "VOLUNTEER":
      default:
        router.push("/dashboard/volunteer");
        break;
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-96"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          Login to BuildUp
        </h1>

        {error && (
          <p className="text-red-600 mb-4 text-sm text-center">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}



"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrganizationRegister() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/register/organization", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, bio }),
    });

    if (res.ok) {
      alert("Organization registered. Please login.");
      router.push("/login");
    } else {
      alert("Registration failed");
    }
  };

  return (
    <main className="min-h-screen flex justify-center items-center">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-4">Register Organization</h1>

        <input className="w-full border p-2 mb-3" placeholder="Organization Name"
          onChange={(e) => setName(e.target.value)} required />

        <input className="w-full border p-2 mb-3" placeholder="Email"
          onChange={(e) => setEmail(e.target.value)} required />

        <input type="password" className="w-full border p-2 mb-3" placeholder="Password"
          onChange={(e) => setPassword(e.target.value)} required />

        <textarea className="w-full border p-2 mb-4" placeholder="About your organization"
          onChange={(e) => setBio(e.target.value)} />

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Create Account
        </button>
      </form>
    </main>
  );
}

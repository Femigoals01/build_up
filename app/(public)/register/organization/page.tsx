


// "use client";

// import { useMemo, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import BuildUpLogo from "@/components/brand/BuildUpLogo";

// const COUNTRY_OPTIONS = [
//   { name: "Nigeria", code: "+234" },
//   { name: "Ghana", code: "+233" },
//   { name: "Kenya", code: "+254" },
//   { name: "South Africa", code: "+27" },
//   { name: "United Kingdom", code: "+44" },
//   { name: "United States", code: "+1" },
//   { name: "Canada", code: "+1" },
//   { name: "India", code: "+91" },
//   { name: "Germany", code: "+49" },
//   { name: "France", code: "+33" },
// ];

// export default function OrganizationRegister() {
//   const router = useRouter();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [country, setCountry] = useState("");
//   const [countryCode, setCountryCode] = useState("");
//   const [mobileNumber, setMobileNumber] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [bio, setBio] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [referralCode, setReferralCode] = useState("");
// const [referralLoading, setReferralLoading] = useState(false);
// const [referralValid, setReferralValid] = useState<boolean | null>(null);



//   const selectedCountry = useMemo(
//     () => COUNTRY_OPTIONS.find((item) => item.name === country) ?? null,
//     [country]
//   );

//   const handleCountryChange = (value: string) => {
//     setCountry(value);
//     const selected = COUNTRY_OPTIONS.find((item) => item.name === value);
//     setCountryCode(selected?.code || "");
//   };

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const normalizedEmail = email.trim().toLowerCase();

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters.");
//       setLoading(false);
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch("/api/register/organization", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name,
//           email: normalizedEmail,
//           password,
//           confirmPassword,
//           bio,
//           country,
//           countryCode,
//           mobileNumber,
//           referralCode: referralCode.trim(),
//         }),
//       });

//       const contentType = res.headers.get("content-type");
//       const data = contentType?.includes("application/json")
//         ? await res.json()
//         : null;

//       if (res.ok) {
//         router.push(
//           data?.redirectTo ||
//             `/verify-email?email=${encodeURIComponent(normalizedEmail)}`
//         );
//         return;
//       }

//       setError(data?.error || "Registration failed");
//     } catch {
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-8">
//       <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 lg:grid-cols-2">
//         <section className="hidden lg:block">
//           <div className="max-w-xl">
//             <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
//               <span className="h-2 w-2 rounded-full bg-blue-600" />
//               Join BuildUp as an Organization
//             </div>

//             <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-900">
//               Post meaningful
//               <br />
//               projects and discover
//               <br />
//               growing talent.
//             </h1>

//             <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
//               Create your organization account to publish real projects, connect
//               with volunteers, collaborate with mentors, and build a stronger
//               talent pipeline through BuildUp.
//             </p>

//             <div className="mt-10 grid gap-4 sm:grid-cols-3">
//               <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//                 <p className="text-2xl font-bold text-slate-900">Projects</p>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Publish real opportunities
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//                 <p className="text-2xl font-bold text-slate-900">Talent</p>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Discover emerging contributors
//                 </p>
//               </div>

//               <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
//                 <p className="text-2xl font-bold text-slate-900">Impact</p>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Support real learning through work
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="w-full">
//           <div className="mx-auto max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
//             <div className="relative px-6 py-8 md:px-8 md:py-10">
//               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_22%)]" />

//               <div className="relative z-10">
//                 <div className="mb-8 text-center">
//                   <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center">
//                     <BuildUpLogo
//                       href="/"
//                       showTagline={false}
//                       className="justify-center"
//                     />
//                   </div>

//                   <h2 className="text-3xl font-bold tracking-tight text-slate-900">
//                     Register Organization
//                   </h2>

//                   <p className="mt-2 text-sm leading-6 text-slate-500">
//                     Create your organization profile and verify your email before
//                     posting opportunities on BuildUp.
//                   </p>
//                 </div>

//                 <form onSubmit={submit} className="space-y-5">
//                   {error && (
//                     <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//                       {error}
//                     </div>
//                   )}

//                   <div>
//                     <label
//                       htmlFor="name"
//                       className="mb-2 block text-sm font-semibold text-slate-800"
//                     >
//                       Organization Name
//                     </label>
//                     <input
//                       id="name"
//                       type="text"
//                       placeholder="Enter your organization name"
//                       className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                       required
//                     />
//                   </div>

//                   <div className="grid gap-5 md:grid-cols-2">
//                     <div>
//                       <label
//                         htmlFor="email"
//                         className="mb-2 block text-sm font-semibold text-slate-800"
//                       >
//                         Email Address
//                       </label>
//                       <input
//                         id="email"
//                         type="email"
//                         placeholder="Enter your organization email"
//                         className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label
//                         htmlFor="country"
//                         className="mb-2 block text-sm font-semibold text-slate-800"
//                       >
//                         Country
//                       </label>
//                       <select
//                         id="country"
//                         className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                         value={country}
//                         onChange={(e) => handleCountryChange(e.target.value)}
//                         required
//                       >
//                         <option value="">Select country</option>
//                         {COUNTRY_OPTIONS.map((item) => (
//                           <option key={`${item.name}-${item.code}`} value={item.name}>
//                             {item.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <div className="grid gap-5 md:grid-cols-[140px_1fr]">
//                     <div>
//                       <label
//                         htmlFor="countryCode"
//                         className="mb-2 block text-sm font-semibold text-slate-800"
//                       >
//                         Code
//                       </label>
//                       <select
//                         id="countryCode"
//                         className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                         value={countryCode}
//                         onChange={(e) => setCountryCode(e.target.value)}
//                         required
//                       >
//                         <option value="">Code</option>
//                         {COUNTRY_OPTIONS.map((item) => (
//                           <option key={`${item.name}-${item.code}-code`} value={item.code}>
//                             {item.code}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label
//                         htmlFor="mobileNumber"
//                         className="mb-2 block text-sm font-semibold text-slate-800"
//                       >
//                         Mobile Number
//                       </label>
//                       <input
//                         id="mobileNumber"
//                         type="tel"
//                         inputMode="tel"
//                         placeholder="8123456789"
//                         className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                         value={mobileNumber}
//                         onChange={(e) => setMobileNumber(e.target.value)}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <p className="text-xs text-slate-500">
//                     {selectedCountry
//                       ? `Selected country: ${selectedCountry.name}`
//                       : "Choose your country and country code before entering your number."}
//                   </p>


// <div>
//   <label
//     htmlFor="referralCode"
//     className="mb-2 block text-sm font-semibold text-slate-800"
//   >
//     Referral Code <span className="text-slate-400">(Optional)</span>
//   </label>

//   <div className="flex gap-3">
//     <input
//       id="referralCode"
//       type="text"
//       placeholder="Enter referral code"
//       value={referralCode}
//       onChange={(e) => {
//         setReferralCode(e.target.value.toUpperCase());
//         setReferralValid(null);
//       }}
//       className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//     />

//     <button
//       type="button"
//       disabled={!referralCode.trim() || referralLoading}
//       onClick={async () => {
//         try {
//           setReferralLoading(true);

//           const res = await fetch(
//             `/api/referral/validate?code=${referralCode}`
//           );

//           const data = await res.json();

//           setReferralValid(res.ok && data.valid);
//         } catch {
//           setReferralValid(false);
//         } finally {
//           setReferralLoading(false);
//         }
//       }}
//       className="h-12 rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//     >
//       {referralLoading ? "Checking..." : "Verify"}
//     </button>
//   </div>

//   {referralValid === true && (
//     <p className="mt-2 text-sm font-medium text-green-600">
//       ✓ Referral code is valid
//     </p>
//   )}

//   {referralValid === false && (
//     <p className="mt-2 text-sm font-medium text-red-600">
//       Invalid referral code
//     </p>
//   )}

//   <p className="mt-2 text-xs text-slate-500">
//     Were you invited by a mentor, volunteer, or organization? Enter their
//     referral code here.
//   </p>
// </div>





//                   <div className="grid gap-5 md:grid-cols-2">
//                     <div>
//                       <label
//                         htmlFor="password"
//                         className="mb-2 block text-sm font-semibold text-slate-800"
//                       >
//                         Password
//                       </label>

//                       <div className="relative">
//                         <input
//                           id="password"
//                           type={showPassword ? "text" : "password"}
//                           placeholder="Create a secure password"
//                           className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-20 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                           value={password}
//                           onChange={(e) => setPassword(e.target.value)}
//                           required
//                         />

//                         <button
//                           type="button"
//                           onClick={() => setShowPassword((prev) => !prev)}
//                           className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-600 hover:text-blue-700"
//                         >
//                           {showPassword ? "Hide" : "Show"}
//                         </button>
//                       </div>
//                     </div>

//                     <div>
//                       <label
//                         htmlFor="confirmPassword"
//                         className="mb-2 block text-sm font-semibold text-slate-800"
//                       >
//                         Confirm Password
//                       </label>

//                       <input
//                         id="confirmPassword"
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Re-enter your password"
//                         className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="bio"
//                       className="mb-2 block text-sm font-semibold text-slate-800"
//                     >
//                       About Your Organization
//                     </label>
//                     <textarea
//                       id="bio"
//                       placeholder="Tell volunteers about your organization, the kind of work you do, and the kinds of projects you may post."
//                       className="min-h-[150px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                       value={bio}
//                       onChange={(e) => setBio(e.target.value)}
//                       required
//                     />
//                     <p className="mt-2 text-xs text-slate-500">
//                       A clear description builds trust and helps attract better applicants.
//                     </p>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
//                   >
//                     {loading ? "Creating Account..." : "Create Account"}
//                   </button>

//                   <p className="text-center text-sm text-slate-500">
//                     Already have an account?{" "}
//                     <Link
//                       href="/login"
//                       className="font-semibold text-blue-600 hover:underline"
//                     >
//                       Login here
//                     </Link>
//                   </p>
//                 </form>
//               </div>
//             </div>
//           </div>

//           <div className="mx-auto mt-6 max-w-2xl rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm lg:hidden">
//             <h3 className="text-base font-semibold text-slate-900">
//               Why register as an organization?
//             </h3>
//             <p className="mt-2 text-sm leading-6 text-slate-500">
//               BuildUp helps organizations post real projects, find emerging
//               talent, and contribute to meaningful skills development through
//               real-world collaboration.
//             </p>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }




"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BuildUpLogo from "@/components/brand/BuildUpLogo";

const COUNTRY_OPTIONS = [
  { name: "Nigeria", code: "+234" },
  { name: "Ghana", code: "+233" },
  { name: "Kenya", code: "+254" },
  { name: "South Africa", code: "+27" },
  { name: "United Kingdom", code: "+44" },
  { name: "United States", code: "+1" },
  { name: "Canada", code: "+1" },
  { name: "India", code: "+91" },
  { name: "Germany", code: "+49" },
  { name: "France", code: "+33" },
];

function isStrongPassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(
    password
  );
}

export default function OrganizationRegister() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [referralCode, setReferralCode] = useState("");
  const [referralLoading, setReferralLoading] = useState(false);
  const [referralValid, setReferralValid] = useState<boolean | null>(null);

  const selectedCountry = useMemo(
    () => COUNTRY_OPTIONS.find((item) => item.name === country) ?? null,
    [country]
  );

  const selectedCountryByCode = useMemo(
    () => COUNTRY_OPTIONS.find((item) => item.code === countryCode) ?? null,
    [countryCode]
  );

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z\d]/.test(password),
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);

    const selected = COUNTRY_OPTIONS.find((item) => item.name === value);
    setCountryCode(selected?.code || "");
    setMobileNumber("");
  };

  const handleCountryCodeChange = (value: string) => {
    setCountryCode(value);
    setMobileNumber("");
  };

  const handleMobileNumberChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");

    if (countryCode === "+234") {
      setMobileNumber(digitsOnly.slice(0, 10));
      return;
    }

    setMobileNumber(digitsOnly.slice(0, 15));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (selectedCountry && countryCode && selectedCountry.code !== countryCode) {
      setError(
        `Country code mismatch. ${selectedCountry.name} should use ${selectedCountry.code}.`
      );
      setLoading(false);
      return;
    }

    if (!/^\d+$/.test(mobileNumber)) {
      setError("Mobile number must contain numbers only.");
      setLoading(false);
      return;
    }

    if (countryCode === "+234" && mobileNumber.length !== 10) {
      setError("Nigerian mobile number must be exactly 10 digits after +234.");
      setLoading(false);
      return;
    }

    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register/organization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: normalizedEmail,
          password,
          confirmPassword,
          bio,
          country,
          countryCode,
          mobileNumber,
          referralCode: referralCode.trim(),
        }),
      });

      const contentType = res.headers.get("content-type");
      const data = contentType?.includes("application/json")
        ? await res.json()
        : null;

      if (res.ok) {
        router.push(
          data?.redirectTo ||
            `/verify-email?email=${encodeURIComponent(normalizedEmail)}`
        );
        return;
      }

      setError(data?.error || "Registration failed");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-8">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 lg:grid-cols-2">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Join BuildUp as an Organization
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-900">
              Post meaningful
              <br />
              projects and discover
              <br />
              growing talent.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
              Create your organization account to publish real projects, connect
              with volunteers, collaborate with mentors, and build a stronger
              talent pipeline through BuildUp.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Projects</p>
                <p className="mt-1 text-sm text-slate-500">
                  Publish real opportunities
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Talent</p>
                <p className="mt-1 text-sm text-slate-500">
                  Discover emerging contributors
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-900">Impact</p>
                <p className="mt-1 text-sm text-slate-500">
                  Support real learning through work
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full">
          <div className="mx-auto max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <div className="relative px-6 py-8 md:px-8 md:py-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.08),transparent_22%)]" />

              <div className="relative z-10">
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center">
                    <BuildUpLogo
                      href="/"
                      showTagline={false}
                      className="justify-center"
                    />
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                    Register Organization
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Create your organization profile and verify your email before
                    posting opportunities on BuildUp.
                  </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                  {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Organization Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your organization name"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="Enter your organization email"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="country"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Country
                      </label>
                      <select
                        id="country"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        value={country}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        required
                      >
                        <option value="">Select country</option>
                        {COUNTRY_OPTIONS.map((item) => (
                          <option
                            key={`${item.name}-${item.code}`}
                            value={item.name}
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-[140px_1fr]">
                    <div>
                      <label
                        htmlFor="countryCode"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Code
                      </label>
                      <select
                        id="countryCode"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        value={countryCode}
                        onChange={(e) =>
                          handleCountryCodeChange(e.target.value)
                        }
                        required
                      >
                        <option value="">Code</option>
                        {COUNTRY_OPTIONS.map((item) => (
                          <option
                            key={`${item.name}-${item.code}-code`}
                            value={item.code}
                          >
                            {item.code}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="mobileNumber"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Mobile Number
                      </label>
                      <input
                        id="mobileNumber"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder={
                          countryCode === "+234" ? "8123456789" : "Phone number"
                        }
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        value={mobileNumber}
                        onChange={(e) =>
                          handleMobileNumberChange(e.target.value)
                        }
                        required
                      />
                      <p className="mt-2 text-xs text-slate-500">
                        {countryCode === "+234"
                          ? `${mobileNumber.length}/10 digits after +234`
                          : "Numbers only. Maximum 15 digits."}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500">
                    {selectedCountry
                      ? `Selected country: ${selectedCountry.name}`
                      : "Choose your country and country code before entering your number."}
                    {selectedCountryByCode && selectedCountry
                      ? ` Code selected: ${countryCode}.`
                      : ""}
                  </p>

                  <div>
                    <label
                      htmlFor="referralCode"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Referral Code{" "}
                      <span className="text-slate-400">(Optional)</span>
                    </label>

                    <div className="flex gap-3">
                      <input
                        id="referralCode"
                        type="text"
                        placeholder="Enter referral code"
                        value={referralCode}
                        onChange={(e) => {
                          setReferralCode(e.target.value.toUpperCase());
                          setReferralValid(null);
                        }}
                        className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      />

                      <button
                        type="button"
                        disabled={!referralCode.trim() || referralLoading}
                        onClick={async () => {
                          try {
                            setReferralLoading(true);

                            const res = await fetch(
                              `/api/referral/validate?code=${referralCode}`
                            );

                            const data = await res.json();

                            setReferralValid(res.ok && data.valid);
                          } catch {
                            setReferralValid(false);
                          } finally {
                            setReferralLoading(false);
                          }
                        }}
                        className="h-12 rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {referralLoading ? "Checking..." : "Verify"}
                      </button>
                    </div>

                    {referralValid === true && (
                      <p className="mt-2 text-sm font-medium text-green-600">
                        ✓ Referral code is valid
                      </p>
                    )}

                    {referralValid === false && (
                      <p className="mt-2 text-sm font-medium text-red-600">
                        Invalid referral code
                      </p>
                    )}

                    <p className="mt-2 text-xs text-slate-500">
                      Were you invited by a mentor, volunteer, or organization?
                      Enter their referral code here.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Password
                      </label>

                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a secure password"
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-20 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>

                      <div className="mt-3 grid gap-1.5 text-xs">
                        <PasswordRule active={passwordChecks.length}>
                          At least 8 characters
                        </PasswordRule>
                        <PasswordRule active={passwordChecks.uppercase}>
                          Uppercase letter
                        </PasswordRule>
                        <PasswordRule active={passwordChecks.lowercase}>
                          Lowercase letter
                        </PasswordRule>
                        <PasswordRule active={passwordChecks.number}>
                          Number
                        </PasswordRule>
                        <PasswordRule active={passwordChecks.special}>
                          Special character
                        </PasswordRule>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-sm font-semibold text-slate-800"
                      >
                        Confirm Password
                      </label>

                      <input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />

                      {confirmPassword ? (
                        <p
                          className={`mt-2 text-xs font-medium ${
                            password === confirmPassword
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {password === confirmPassword
                            ? "✓ Passwords match"
                            : "Passwords do not match"}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="bio"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      About Your Organization
                    </label>
                    <textarea
                      id="bio"
                      placeholder="Tell volunteers about your organization, the kind of work you do, and the kinds of projects you may post."
                      className="min-h-[150px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      required
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      A clear description builds trust and helps attract better
                      applicants.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>

                  <p className="text-center text-sm text-slate-500">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      Login here
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-2xl rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm lg:hidden">
            <h3 className="text-base font-semibold text-slate-900">
              Why register as an organization?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              BuildUp helps organizations post real projects, find emerging
              talent, and contribute to meaningful skills development through
              real-world collaboration.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function PasswordRule({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <p
      className={`flex items-center gap-2 ${
        active ? "text-green-600" : "text-slate-400"
      }`}
    >
      <span>{active ? "✓" : "•"}</span>
      <span>{children}</span>
    </p>
  );
}
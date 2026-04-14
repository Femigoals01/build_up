




// import Image from "next/image";
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { revalidatePath } from "next/cache";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import { getCloudinary } from "@/lib/cloudinary";
// import { calculateProfileStrength } from "@/lib/profileStrength";
// import BuildUpLogo from "@/components/brand/BuildUpLogo";
// import SettingsSaveButton from "@/components/settings/SettingsSaveButton";

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

// function toBool(value: FormDataEntryValue | null) {
//   return value === "on";
// }

// function getInitial(name?: string | null) {
//   return name?.trim()?.charAt(0)?.toUpperCase() || "U";
// }

// function calcCompletion(user: {
//   name: string | null;
//   bio: string | null;
//   skills: string | null;
//   experience: string | null;
//   country: string | null;
//   countryCode: string | null;
//   mobileNumber: string | null;
//   headline: string | null;
//   careerGoal: string | null;
//   profileImageUrl: string | null;
// }) {
//   const checks = [
//     Boolean(user.name?.trim()),
//     Boolean(user.profileImageUrl?.trim()),
//     Boolean(user.headline?.trim()),
//     Boolean(user.bio?.trim()),
//     Boolean(user.skills?.trim()),
//     Boolean(user.experience?.trim()),
//     Boolean(user.country?.trim()),
//     Boolean(user.countryCode?.trim() && user.mobileNumber?.trim()),
//     Boolean(user.careerGoal?.trim()),
//   ];

//   const done = checks.filter(Boolean).length;
//   return Math.round((done / checks.length) * 100);
// }

// async function uploadProfileImage(file: File) {
//   const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
//   if (!allowedTypes.includes(file.type)) {
//     throw new Error("Only JPG, PNG, and WEBP images are allowed.");
//   }

//   const maxSize = 5 * 1024 * 1024;
//   if (file.size > maxSize) {
//     throw new Error("Image must be 5MB or less.");
//   }

//   const buffer = Buffer.from(await file.arrayBuffer());
//   const cloudinary = getCloudinary();

//   const upload = await new Promise<any>((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream(
//         {
//           resource_type: "image",
//           folder: "buildup/profile-images",
//           transformation: [
//             { width: 600, height: 600, crop: "fill", gravity: "face" },
//             { quality: "auto" },
//             { fetch_format: "auto" },
//           ],
//         },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       )
//       .end(buffer);
//   });

//   return upload.secure_url as string;
// }

// async function saveSettings(formData: FormData) {
//   "use server";

//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) {
//     redirect("/login");
//   }

//   const name = String(formData.get("name") || "").trim();
//   const bio = String(formData.get("bio") || "").trim();
//   const skills = String(formData.get("skills") || "").trim();
//   const experience = String(formData.get("experience") || "").trim();
//   const country = String(formData.get("country") || "").trim();
//   const countryCode = String(formData.get("countryCode") || "").trim();
//   const mobileNumber = String(formData.get("mobileNumber") || "").trim();
//   const headline = String(formData.get("headline") || "").trim();
//   const availabilityStatus = String(formData.get("availabilityStatus") || "").trim();
//   const preferredDifficulty = String(formData.get("preferredDifficulty") || "").trim();
//   const linkedinUrl = String(formData.get("linkedinUrl") || "").trim();
//   const githubUrl = String(formData.get("githubUrl") || "").trim();
//   const portfolioWebsite = String(formData.get("portfolioWebsite") || "").trim();
//   const careerGoal = String(formData.get("careerGoal") || "").trim();

//   if (!name) return;

//   let profileImageUrl = String(formData.get("currentProfileImageUrl") || "").trim();
//   const removeProfileImage = toBool(formData.get("removeProfileImage"));
//   const uploadedFile = formData.get("profileImageFile");

//   if (removeProfileImage) {
//     profileImageUrl = "";
//   }

//   if (uploadedFile instanceof File && uploadedFile.size > 0) {
//     profileImageUrl = await uploadProfileImage(uploadedFile);
//   }

//   await prisma.user.update({
//     where: { id: session.user.id },
//     data: {
//       name,
//       bio: bio || null,
//       skills: skills || null,
//       experience: experience || null,
//       country: country || null,
//       countryCode: countryCode || null,
//       mobileNumber: mobileNumber || null,
//       profileImageUrl: profileImageUrl || null,
//       headline: headline || null,
//       availabilityStatus: availabilityStatus || null,
//       preferredDifficulty: preferredDifficulty || null,
//       openToMentorGuidance: toBool(formData.get("openToMentorGuidance")),
//       linkedinUrl: linkedinUrl || null,
//       githubUrl: githubUrl || null,
//       portfolioWebsite: portfolioWebsite || null,
//       careerGoal: careerGoal || null,

//       isPortfolioPublic: toBool(formData.get("isPortfolioPublic")),
//       showCountryPublicly: toBool(formData.get("showCountryPublicly")),
//       showBioPublicly: toBool(formData.get("showBioPublicly")),
//       showSkillsPublicly: toBool(formData.get("showSkillsPublicly")),
//       showReviewsPublicly: toBool(formData.get("showReviewsPublicly")),
//       showBadgesPublicly: toBool(formData.get("showBadgesPublicly")),
//       showPhonePublicly: toBool(formData.get("showPhonePublicly")),
//       showEmailPublicly: toBool(formData.get("showEmailPublicly")),

//       emailNotifications: toBool(formData.get("emailNotifications")),
//       inAppNotifications: toBool(formData.get("inAppNotifications")),
//       notifyProjectUpdates: toBool(formData.get("notifyProjectUpdates")),
//       notifyMentorMessages: toBool(formData.get("notifyMentorMessages")),
//       notifyOrganizationMessages: toBool(formData.get("notifyOrganizationMessages")),
//       notifyReviews: toBool(formData.get("notifyReviews")),
//       notifyBadges: toBool(formData.get("notifyBadges")),
//       notifyWeeklySummary: toBool(formData.get("notifyWeeklySummary")),
//     },
//   });

//   revalidatePath("/");
//   revalidatePath("/dashboard");
//   revalidatePath("/dashboard/settings");
//   revalidatePath("/dashboard/volunteer");
//   revalidatePath("/portfolio");
//   revalidatePath(`/portfolio/${session.user.username}`);
// }

// function ToggleRow({
//   name,
//   title,
//   description,
//   defaultChecked,
// }: {
//   name: string;
//   title: string;
//   description: string;
//   defaultChecked?: boolean;
// }) {
//   return (
//     <label className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4">
//       <div>
//         <p className="text-sm font-semibold text-slate-900">{title}</p>
//         <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
//       </div>

//       <input
//         type="checkbox"
//         name={name}
//         defaultChecked={defaultChecked}
//         className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
//       />
//     </label>
//   );
// }

// export default async function SettingsPage() {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) {
//     redirect("/login");
//   }

//   const user = await prisma.user.findUnique({
//     where: { id: session.user.id },
//     select: {
//       id: true,
//       name: true,
//       email: true,
//       username: true,
//       role: true,
//       bio: true,
//       skills: true,
//       experience: true,
//       country: true,
//       countryCode: true,
//       mobileNumber: true,
//       profileImageUrl: true,
//       headline: true,
//       availabilityStatus: true,
//       preferredDifficulty: true,
//       openToMentorGuidance: true,
//       linkedinUrl: true,
//       githubUrl: true,
//       portfolioWebsite: true,
//       careerGoal: true,

//       isPortfolioPublic: true,
//       showCountryPublicly: true,
//       showBioPublicly: true,
//       showSkillsPublicly: true,
//       showReviewsPublicly: true,
//       showBadgesPublicly: true,
//       showPhonePublicly: true,
//       showEmailPublicly: true,

//       emailNotifications: true,
//       inAppNotifications: true,
//       notifyProjectUpdates: true,
//       notifyMentorMessages: true,
//       notifyOrganizationMessages: true,
//       notifyReviews: true,
//       notifyBadges: true,
//       notifyWeeklySummary: true,
//     },
//   });

//   if (!user) {
//     redirect("/login");
//   }

//   const portfolioCount = await prisma.portfolioItem.count({
//     where: { volunteerId: session.user.id },
//   });

//   const profileCompletion = calcCompletion(user);

//   const profileStrength = calculateProfileStrength({
//     username: user.username,
//     bio: user.bio,
//     skills: user.skills,
//     experience: user.experience,
//     country: user.country,
//     countryCode: user.countryCode,
//     mobileNumber: user.mobileNumber,
//     profileImageUrl: user.profileImageUrl,
//     portfolioCount,
//   });

//   const publicSummary = [
//     user.isPortfolioPublic ? "Portfolio is public" : "Portfolio is private",
//     user.showCountryPublicly ? "Country is visible" : "Country is hidden",
//     user.showBioPublicly ? "Bio is visible" : "Bio is hidden",
//     user.showSkillsPublicly ? "Skills are visible" : "Skills are hidden",
//     user.showReviewsPublicly ? "Reviews are visible" : "Reviews are hidden",
//     user.showBadgesPublicly ? "Badges are visible" : "Badges are hidden",
//     user.showPhonePublicly ? "Phone is visible" : "Phone is private",
//     user.showEmailPublicly ? "Email is visible" : "Email is private",
//   ];

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 sm:px-6 lg:px-8">
//       <div className="mx-auto max-w-7xl space-y-8">
//         <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
//           <div className="bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 px-6 py-8 text-white sm:px-8 md:px-10">
//             <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
//               <div>
//                 <div className="mb-4">
//                   <BuildUpLogo
//                     href="/"
//                     showTagline={false}
//                     className="pointer-events-none"
//                     textSize="md"
//                     imageClassName="rounded-2xl bg-white/90 p-1"
//                   />
//                 </div>

//                 <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">
//                   BuildUp Settings
//                 </p>
//                 <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
//                   Manage your account and public profile
//                 </h1>
//                 <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 md:text-base">
//                   Update your profile details, decide what appears publicly, control
//                   notifications, and keep your volunteer identity polished and trusted.
//                 </p>
//               </div>

//               <div className="flex flex-wrap gap-2">
//                 <span className="rounded-full bg-white/15 px-3 py-2 text-xs font-semibold text-white">
//                   Profile Active
//                 </span>
//                 <span className="rounded-full bg-white/15 px-3 py-2 text-xs font-semibold text-white">
//                   {user.isPortfolioPublic ? "Portfolio Public" : "Portfolio Private"}
//                 </span>
//                 <span className="rounded-full bg-white/15 px-3 py-2 text-xs font-semibold text-white">
//                   {user.showPhonePublicly ? "Phone Visible" : "Phone Private"}
//                 </span>
//                 <span className="rounded-full bg-white/15 px-3 py-2 text-xs font-semibold text-white">
//                   {user.showEmailPublicly ? "Email Visible" : "Email Private"}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="px-6 py-6 sm:px-8 md:px-10">
//             <div className="grid gap-6 lg:grid-cols-2">
//               <div className="flex flex-col gap-3">
//                 <div className="flex items-center justify-between gap-4">
//                   <p className="text-sm font-semibold text-slate-700">Profile completion</p>
//                   <p className="text-sm font-bold text-blue-600">{profileCompletion}%</p>
//                 </div>

//                 <div className="h-3 overflow-hidden rounded-full bg-slate-200">
//                   <div
//                     className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
//                     style={{ width: `${profileCompletion}%` }}
//                   />
//                 </div>

//                 <p className="text-sm text-slate-500">
//                   Completing your profile makes you more credible to mentors and organizations.
//                 </p>
//               </div>

//               <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
//                 <div className="flex items-center justify-between gap-4">
//                   <div>
//                     <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
//                       Profile Strength
//                     </p>
//                     <p className="mt-2 text-3xl font-bold text-slate-900">
//                       {profileStrength.score}%
//                     </p>
//                     <p className="mt-2 text-sm text-slate-600">
//                       {profileStrength.completed} of {profileStrength.total} core profile signals completed.
//                     </p>
//                   </div>

//                   <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-lg font-bold text-blue-700 shadow-sm">
//                     {profileStrength.score}
//                   </div>
//                 </div>

//                 <div className="mt-4 h-3 overflow-hidden rounded-full bg-blue-100">
//                   <div
//                     className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
//                     style={{ width: `${profileStrength.score}%` }}
//                   />
//                 </div>

//                 <p className="mt-3 text-sm leading-6 text-blue-800">
//                   Stronger profiles usually feel more trustworthy and attract better opportunities.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>

//         <form action={saveSettings} className="space-y-8">
//           <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
//             <div className="space-y-8">
//               <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
//                 <div className="mb-6">
//                   <h2 className="text-xl font-bold tracking-tight text-slate-900">
//                     Profile Photo
//                   </h2>
//                   <p className="mt-1 text-sm leading-6 text-slate-500">
//                     Upload a clear professional image. It will appear in your dashboard and portfolio.
//                   </p>
//                 </div>

//                 <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
//                   <div className="flex flex-col gap-5 md:flex-row md:items-center">
//                     <div className="relative h-24 w-24 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
//                       {user.profileImageUrl ? (
//                         <Image
//                           src={user.profileImageUrl}
//                           alt={user.name || "Profile image"}
//                           fill
//                           className="object-cover"
//                           sizes="96px"
//                         />
//                       ) : (
//                         <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl font-bold text-white">
//                           {getInitial(user.name)}
//                         </div>
//                       )}
//                     </div>

//                     <div className="flex-1 space-y-3">
//                       <input
//                         type="hidden"
//                         name="currentProfileImageUrl"
//                         value={user.profileImageUrl ?? ""}
//                       />

//                       <div>
//                         <label className="mb-2 block text-sm font-semibold text-slate-800">
//                           Upload New Photo
//                         </label>
//                         <input
//                           type="file"
//                           name="profileImageFile"
//                           accept="image/png,image/jpeg,image/jpg,image/webp"
//                           className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
//                         />
//                       </div>

//                       {user.profileImageUrl && (
//                         <label className="inline-flex items-center gap-3 text-sm text-slate-600">
//                           <input
//                             type="checkbox"
//                             name="removeProfileImage"
//                             className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
//                           />
//                           Remove current profile photo
//                         </label>
//                       )}

//                       <p className="text-sm leading-6 text-slate-500">
//                         Recommended: square image, face clearly visible, up to 5MB.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
//                 <div className="mb-6">
//                   <h2 className="text-xl font-bold tracking-tight text-slate-900">
//                     Profile Information
//                   </h2>
//                   <p className="mt-1 text-sm leading-6 text-slate-500">
//                     This information helps BuildUp present you more professionally.
//                   </p>
//                 </div>

//                 <div className="grid gap-5 md:grid-cols-2">
//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-slate-800">
//                       Full Name
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       defaultValue={user.name ?? ""}
//                       required
//                       className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                     />
//                   </div>

//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-slate-800">
//                       Professional Title
//                     </label>
//                     <input
//                       type="text"
//                       name="headline"
//                       defaultValue={user.headline ?? ""}
//                       placeholder="e.g. Frontend Developer"
//                       className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-5 grid gap-5 md:grid-cols-2">
//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-slate-800">
//                       Email Address
//                     </label>
//                     <input
//                       type="email"
//                       value={user.email}
//                       disabled
//                       className="h-12 w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500 outline-none"
//                     />
//                   </div>

//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-slate-800">
//                       Username
//                     </label>
//                     <input
//                       type="text"
//                       value={user.username}
//                       disabled
//                       className="h-12 w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500 outline-none"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-5">
//                   <label className="mb-2 block text-sm font-semibold text-slate-800">
//                     Short Bio
//                   </label>
//                   <textarea
//                     name="bio"
//                     defaultValue={user.bio ?? ""}
//                     rows={5}
//                     placeholder="Tell people about yourself, your interests, and the kind of projects you want to work on."
//                     className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                   />
//                 </div>

//                 <div className="mt-5 grid gap-5 md:grid-cols-2">
//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-slate-800">
//                       Skills
//                     </label>
//                     <input
//                       type="text"
//                       name="skills"
//                       defaultValue={user.skills ?? ""}
//                       placeholder="e.g. UI/UX Design, Frontend Development"
//                       className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                     />
//                   </div>

//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-slate-800">
//                       Experience Level
//                     </label>
//                     <select
//                       name="experience"
//                       defaultValue={user.experience ?? ""}
//                       className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                     >
//                       <option value="">Select experience</option>
//                       <option value="Beginner">Beginner</option>
//                       <option value="Intermediate">Intermediate</option>
//                       <option value="Advanced">Advanced</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="mt-5 grid gap-5 md:grid-cols-2">
//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-slate-800">
//                       Country
//                     </label>
//                     <select
//                       name="country"
//                       defaultValue={user.country ?? ""}
//                       className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                     >
//                       <option value="">Select country</option>
//                       {COUNTRY_OPTIONS.map((item) => (
//                         <option key={`${item.name}-${item.code}`} value={item.name}>
//                           {item.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-slate-800">
//                       Role
//                     </label>
//                     <input
//                       type="text"
//                       value={user.role}
//                       disabled
//                       className="h-12 w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500 outline-none"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-5 grid gap-5 md:grid-cols-[180px_1fr]">
//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-slate-800">
//                       Country Code
//                     </label>
//                     <select
//                       name="countryCode"
//                       defaultValue={user.countryCode ?? ""}
//                       className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                     >
//                       <option value="">Code</option>
//                       {COUNTRY_OPTIONS.map((item) => (
//                         <option
//                           key={`${item.name}-${item.code}-cc`}
//                           value={item.code}
//                         >
//                           {item.name} ({item.code})
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-slate-800">
//                       Mobile Number
//                     </label>
//                     <input
//                       type="tel"
//                       name="mobileNumber"
//                       defaultValue={user.mobileNumber ?? ""}
//                       placeholder="8123456789"
//                       className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                     />
//                   </div>
//                 </div>
//               </section>

//               <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
//                 <div className="mb-6">
//                   <h2 className="text-xl font-bold tracking-tight text-slate-900">
//                     Public Profile & Privacy
//                   </h2>
//                   <p className="mt-1 text-sm leading-6 text-slate-500">
//                     Control what appears on your public BuildUp portfolio.
//                   </p>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
//                       Public Identity
//                     </p>
//                     <div className="space-y-3">
//                       <ToggleRow
//                         name="isPortfolioPublic"
//                         title="Public portfolio visibility"
//                         description="Your public portfolio should be visible by default."
//                         defaultChecked={user.isPortfolioPublic ?? true}
//                       />
//                       <ToggleRow
//                         name="showCountryPublicly"
//                         title="Show country publicly"
//                         description="Country should be visible by default."
//                         defaultChecked={user.showCountryPublicly ?? true}
//                       />
//                       <ToggleRow
//                         name="showBioPublicly"
//                         title="Show bio publicly"
//                         description="Bio should be visible by default."
//                         defaultChecked={user.showBioPublicly ?? true}
//                       />
//                       <ToggleRow
//                         name="showSkillsPublicly"
//                         title="Show skills publicly"
//                         description="Skills should be visible by default."
//                         defaultChecked={user.showSkillsPublicly ?? true}
//                       />
//                       <ToggleRow
//                         name="showReviewsPublicly"
//                         title="Show reviews publicly"
//                         description="Reviews should be visible by default."
//                         defaultChecked={user.showReviewsPublicly ?? true}
//                       />
//                       <ToggleRow
//                         name="showBadgesPublicly"
//                         title="Show badges publicly"
//                         description="Badges should be visible by default."
//                         defaultChecked={user.showBadgesPublicly ?? true}
//                       />
//                     </div>
//                   </div>

//                   <div className="pt-3">
//                     <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
//                       Private Contact Info
//                     </p>
//                     <div className="space-y-3">
//                       <ToggleRow
//                         name="showPhonePublicly"
//                         title="Show phone publicly"
//                         description="Phone should remain private by default."
//                         defaultChecked={user.showPhonePublicly ?? false}
//                       />
//                       <ToggleRow
//                         name="showEmailPublicly"
//                         title="Show email publicly"
//                         description="Email should remain private by default."
//                         defaultChecked={user.showEmailPublicly ?? false}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </section>

//               <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
//                 <div className="mb-6">
//                   <h2 className="text-xl font-bold tracking-tight text-slate-900">
//                     Professional Preferences
//                   </h2>
//                   <p className="mt-1 text-sm leading-6 text-slate-500">
//                     Help BuildUp recommend the right projects and mentorship support.
//                   </p>
//                 </div>

//                 <div className="grid gap-5 md:grid-cols-2">
//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-slate-800">
//                       Availability
//                     </label>
//                     <select
//                       name="availabilityStatus"
//                       defaultValue={user.availabilityStatus ?? ""}
//                       className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                     >
//                       <option value="">Select availability</option>
//                       <option value="Available">Available</option>
//                       <option value="Limited">Limited</option>
//                       <option value="Unavailable">Unavailable</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-slate-800">
//                       Preferred Difficulty
//                     </label>
//                     <select
//                       name="preferredDifficulty"
//                       defaultValue={user.preferredDifficulty ?? ""}
//                       className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                     >
//                       <option value="">Select difficulty</option>
//                       <option value="Beginner">Beginner</option>
//                       <option value="Intermediate">Intermediate</option>
//                       <option value="Advanced">Advanced</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="mt-5">
//                   <ToggleRow
//                     name="openToMentorGuidance"
//                     title="Open to mentor guidance"
//                     description="Allow BuildUp to consider you for mentor-supported project matches."
//                     defaultChecked={user.openToMentorGuidance ?? true}
//                   />
//                 </div>
//               </section>

//               <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
//                 <div className="mb-6">
//                   <h2 className="text-xl font-bold tracking-tight text-slate-900">
//                     Career & Links
//                   </h2>
//                   <p className="mt-1 text-sm leading-6 text-slate-500">
//                     Add professional links that strengthen your BuildUp profile.
//                   </p>
//                 </div>

//                 <div className="grid gap-5 md:grid-cols-2">
//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-slate-800">
//                       LinkedIn URL
//                     </label>
//                     <input
//                       type="url"
//                       name="linkedinUrl"
//                       defaultValue={user.linkedinUrl ?? ""}
//                       placeholder="https://linkedin.com/in/..."
//                       className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                     />
//                   </div>

//                   <div>
//                     <label className="mb-2 block text-sm font-semibold text-slate-800">
//                       GitHub URL
//                     </label>
//                     <input
//                       type="url"
//                       name="githubUrl"
//                       defaultValue={user.githubUrl ?? ""}
//                       placeholder="https://github.com/..."
//                       className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-5">
//                   <label className="mb-2 block text-sm font-semibold text-slate-800">
//                     Personal Website / Portfolio
//                   </label>
//                   <input
//                     type="text"
//                     name="portfolioWebsite"
//                     defaultValue={user.portfolioWebsite ?? ""}
//                     placeholder="https://yourwebsite.com"
//                     className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                   />
//                 </div>

//                 <div className="mt-5">
//                   <label className="mb-2 block text-sm font-semibold text-slate-800">
//                     Career Goal
//                   </label>
//                   <textarea
//                     name="careerGoal"
//                     defaultValue={user.careerGoal ?? ""}
//                     rows={4}
//                     placeholder="e.g. Building frontend experience and stronger proof-of-work for future opportunities."
//                     className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                   />
//                 </div>
//               </section>
//             </div>

//             <aside className="space-y-6">
//               <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//                 <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
//                   Completion
//                 </p>
//                 <p className="mt-2 text-3xl font-bold text-slate-900">
//                   {profileCompletion}%
//                 </p>
//                 <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
//                   <div
//                     className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
//                     style={{ width: `${profileCompletion}%` }}
//                   />
//                 </div>
//                 <p className="mt-3 text-sm leading-6 text-slate-500">
//                   Strong profiles are more likely to build trust with organizations.
//                 </p>
//               </section>

//               <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//                 <h3 className="text-base font-semibold text-slate-900">
//                   Profile Strength
//                 </h3>

//                 <div className="mt-4">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-slate-600">Core profile signals</span>
//                     <span className="font-semibold text-blue-600">
//                       {profileStrength.score}%
//                     </span>
//                   </div>

//                   <div className="mt-2 h-3 rounded-full overflow-hidden bg-slate-200">
//                     <div
//                       className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
//                       style={{ width: `${profileStrength.score}%` }}
//                     />
//                   </div>

//                   <p className="mt-3 text-sm text-slate-500">
//                     {profileStrength.completed} of {profileStrength.total} core profile signals completed.
//                   </p>

//                   <p className="mt-3 text-sm leading-6 text-slate-500">
//                     Complete your profile to improve visibility and get better project matches.
//                   </p>
//                 </div>
//               </section>

//               <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//                 <h3 className="text-base font-semibold text-slate-900">
//                   Privacy Summary
//                 </h3>
//                 <div className="mt-4 space-y-2">
//                   {publicSummary.map((item) => (
//                     <div
//                       key={item}
//                       className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
//                     >
//                       {item}
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//                 <h3 className="text-base font-semibold text-slate-900">
//                   BuildUp Tip
//                 </h3>
//                 <p className="mt-2 text-sm leading-6 text-slate-500">
//                   Profiles with public skills, reviews, badges, complete portfolio
//                   items, and a strong profile photo usually feel more trustworthy and project-ready.
//                 </p>
//               </section>

//               <SettingsSaveButton />
//             </aside>
//           </div>

//           <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
//             <div className="mb-6">
//               <h2 className="text-xl font-bold tracking-tight text-slate-900">
//                 Notifications
//               </h2>
//               <p className="mt-1 text-sm leading-6 text-slate-500">
//                 Decide which updates BuildUp should send to you.
//               </p>
//             </div>

//             <div className="grid gap-4 md:grid-cols-2">
//               <ToggleRow
//                 name="emailNotifications"
//                 title="Email notifications"
//                 description="Receive updates through email."
//                 defaultChecked={user.emailNotifications ?? true}
//               />
//               <ToggleRow
//                 name="inAppNotifications"
//                 title="In-app notifications"
//                 description="Receive updates inside your BuildUp dashboard."
//                 defaultChecked={user.inAppNotifications ?? true}
//               />
//               <ToggleRow
//                 name="notifyProjectUpdates"
//                 title="Project updates"
//                 description="Get notified when project applications or statuses change."
//                 defaultChecked={user.notifyProjectUpdates ?? true}
//               />
//               <ToggleRow
//                 name="notifyMentorMessages"
//                 title="Mentor messages"
//                 description="Get notified when mentors reach out or respond."
//                 defaultChecked={user.notifyMentorMessages ?? true}
//               />
//               <ToggleRow
//                 name="notifyOrganizationMessages"
//                 title="Organization messages"
//                 description="Get notified when organizations contact you."
//                 defaultChecked={user.notifyOrganizationMessages ?? true}
//               />
//               <ToggleRow
//                 name="notifyReviews"
//                 title="Review notifications"
//                 description="Get notified when a review is added to your profile."
//                 defaultChecked={user.notifyReviews ?? true}
//               />
//               <ToggleRow
//                 name="notifyBadges"
//                 title="Badge notifications"
//                 description="Get notified when you earn new badges."
//                 defaultChecked={user.notifyBadges ?? true}
//               />
//               <ToggleRow
//                 name="notifyWeeklySummary"
//                 title="Weekly summary"
//                 description="Receive a summary of activity and recommendations."
//                 defaultChecked={user.notifyWeeklySummary ?? false}
//               />
//             </div>
//           </section>

//           <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
//             <div className="mb-6">
//               <h2 className="text-xl font-bold tracking-tight text-slate-900">
//                 Security
//               </h2>
//               <p className="mt-1 text-sm leading-6 text-slate-500">
//                 Basic account security tools for your BuildUp account.
//               </p>
//             </div>

//             <div className="grid gap-5 md:grid-cols-3">
//               <div>
//                 <label className="mb-2 block text-sm font-semibold text-slate-800">
//                   Current Password
//                 </label>
//                 <input
//                   type="password"
//                   placeholder="••••••••"
//                   className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-semibold text-slate-800">
//                   New Password
//                 </label>
//                 <input
//                   type="password"
//                   placeholder="••••••••"
//                   className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-sm font-semibold text-slate-800">
//                   Confirm Password
//                 </label>
//                 <input
//                   type="password"
//                   placeholder="••••••••"
//                   className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//                 />
//               </div>
//             </div>

//             <p className="mt-4 text-sm text-slate-500">
//               Password update logic can be wired next through a dedicated secure action.
//             </p>
//           </section>

//           <section className="rounded-[28px] border border-red-200 bg-white p-6 shadow-sm md:p-8">
//             <div className="mb-6">
//               <h2 className="text-xl font-bold tracking-tight text-red-700">
//                 Account Management
//               </h2>
//               <p className="mt-1 text-sm leading-6 text-slate-500">
//                 Use these actions carefully. They should later be protected with confirmations.
//               </p>
//             </div>

//             <div className="flex flex-col gap-4 sm:flex-row">
//               <button
//                 type="button"
//                 className="inline-flex h-12 items-center justify-center rounded-2xl border border-amber-300 bg-amber-50 px-5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
//               >
//                 Deactivate Account
//               </button>

//               <button
//                 type="button"
//                 className="inline-flex h-12 items-center justify-center rounded-2xl border border-red-300 bg-red-50 px-5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
//               >
//                 Delete Account
//               </button>
//             </div>
//           </section>
//         </form>
//       </div>
//     </main>
//   );
// }






import Image from "next/image";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getCloudinary } from "@/lib/cloudinary";
import { calculateProfileStrength } from "@/lib/profileStrength";
import { getProfileLevel, getNextProfileLevel } from "@/lib/profileLevel";
import BuildUpLogo from "@/components/brand/BuildUpLogo";
import SettingsSaveButton from "@/components/settings/SettingsSaveButton";

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

function toBool(value: FormDataEntryValue | null) {
  return value === "on";
}

function getInitial(name?: string | null) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "U";
}

function calcCompletion(user: {
  name: string | null;
  bio: string | null;
  skills: string | null;
  experience: string | null;
  country: string | null;
  countryCode: string | null;
  mobileNumber: string | null;
  headline: string | null;
  careerGoal: string | null;
  profileImageUrl: string | null;
}) {
  const checks = [
    Boolean(user.name?.trim()),
    Boolean(user.profileImageUrl?.trim()),
    Boolean(user.headline?.trim()),
    Boolean(user.bio?.trim()),
    Boolean(user.skills?.trim()),
    Boolean(user.experience?.trim()),
    Boolean(user.country?.trim()),
    Boolean(user.countryCode?.trim() && user.mobileNumber?.trim()),
    Boolean(user.careerGoal?.trim()),
  ];

  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

async function uploadProfileImage(file: File) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only JPG, PNG, and WEBP images are allowed.");
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("Image must be 5MB or less.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const cloudinary = getCloudinary();

  const upload = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          folder: "buildup/profile-images",
          transformation: [
            { width: 600, height: 600, crop: "fill", gravity: "face" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });

  return upload.secure_url as string;
}

async function saveSettings(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const name = String(formData.get("name") || "").trim();
  const bio = String(formData.get("bio") || "").trim();
  const skills = String(formData.get("skills") || "").trim();
  const experience = String(formData.get("experience") || "").trim();
  const country = String(formData.get("country") || "").trim();
  const countryCode = String(formData.get("countryCode") || "").trim();
  const mobileNumber = String(formData.get("mobileNumber") || "").trim();
  const headline = String(formData.get("headline") || "").trim();
  const availabilityStatus = String(formData.get("availabilityStatus") || "").trim();
  const preferredDifficulty = String(formData.get("preferredDifficulty") || "").trim();
  const linkedinUrl = String(formData.get("linkedinUrl") || "").trim();
  const githubUrl = String(formData.get("githubUrl") || "").trim();
  const portfolioWebsite = String(formData.get("portfolioWebsite") || "").trim();
  const careerGoal = String(formData.get("careerGoal") || "").trim();

  if (!name) return;

  let profileImageUrl = String(formData.get("currentProfileImageUrl") || "").trim();
  const removeProfileImage = toBool(formData.get("removeProfileImage"));
  const uploadedFile = formData.get("profileImageFile");

  if (removeProfileImage) {
    profileImageUrl = "";
  }

  if (uploadedFile instanceof File && uploadedFile.size > 0) {
    profileImageUrl = await uploadProfileImage(uploadedFile);
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      bio: bio || null,
      skills: skills || null,
      experience: experience || null,
      country: country || null,
      countryCode: countryCode || null,
      mobileNumber: mobileNumber || null,
      profileImageUrl: profileImageUrl || null,
      headline: headline || null,
      availabilityStatus: availabilityStatus || null,
      preferredDifficulty: preferredDifficulty || null,
      openToMentorGuidance: toBool(formData.get("openToMentorGuidance")),
      linkedinUrl: linkedinUrl || null,
      githubUrl: githubUrl || null,
      portfolioWebsite: portfolioWebsite || null,
      careerGoal: careerGoal || null,

      isPortfolioPublic: toBool(formData.get("isPortfolioPublic")),
      showCountryPublicly: toBool(formData.get("showCountryPublicly")),
      showBioPublicly: toBool(formData.get("showBioPublicly")),
      showSkillsPublicly: toBool(formData.get("showSkillsPublicly")),
      showReviewsPublicly: toBool(formData.get("showReviewsPublicly")),
      showBadgesPublicly: toBool(formData.get("showBadgesPublicly")),
      showPhonePublicly: toBool(formData.get("showPhonePublicly")),
      showEmailPublicly: toBool(formData.get("showEmailPublicly")),

      emailNotifications: toBool(formData.get("emailNotifications")),
      inAppNotifications: toBool(formData.get("inAppNotifications")),
      notifyProjectUpdates: toBool(formData.get("notifyProjectUpdates")),
      notifyMentorMessages: toBool(formData.get("notifyMentorMessages")),
      notifyOrganizationMessages: toBool(formData.get("notifyOrganizationMessages")),
      notifyReviews: toBool(formData.get("notifyReviews")),
      notifyBadges: toBool(formData.get("notifyBadges")),
      notifyWeeklySummary: toBool(formData.get("notifyWeeklySummary")),
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/volunteer");
  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${session.user.username}`);
}

function ToggleRow({
  name,
  title,
  description,
  defaultChecked,
}: {
  name: string;
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4">
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>

      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
    </label>
  );
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      role: true,
      bio: true,
      skills: true,
      experience: true,
      country: true,
      countryCode: true,
      mobileNumber: true,
      profileImageUrl: true,
      headline: true,
      availabilityStatus: true,
      preferredDifficulty: true,
      openToMentorGuidance: true,
      linkedinUrl: true,
      githubUrl: true,
      portfolioWebsite: true,
      careerGoal: true,

      isPortfolioPublic: true,
      showCountryPublicly: true,
      showBioPublicly: true,
      showSkillsPublicly: true,
      showReviewsPublicly: true,
      showBadgesPublicly: true,
      showPhonePublicly: true,
      showEmailPublicly: true,

      emailNotifications: true,
      inAppNotifications: true,
      notifyProjectUpdates: true,
      notifyMentorMessages: true,
      notifyOrganizationMessages: true,
      notifyReviews: true,
      notifyBadges: true,
      notifyWeeklySummary: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const portfolioCount = await prisma.portfolioItem.count({
    where: { volunteerId: session.user.id },
  });

  const profileCompletion = calcCompletion(user);

  const profileStrength = calculateProfileStrength({
    username: user.username,
    bio: user.bio,
    skills: user.skills,
    experience: user.experience,
    country: user.country,
    countryCode: user.countryCode,
    mobileNumber: user.mobileNumber,
    profileImageUrl: user.profileImageUrl,
    portfolioCount,
  });

  const profileLevel = getProfileLevel(profileStrength.score);
  const nextProfileLevel = getNextProfileLevel(profileStrength.score);

  const publicSummary = [
    user.isPortfolioPublic ? "Portfolio is public" : "Portfolio is private",
    user.showCountryPublicly ? "Country is visible" : "Country is hidden",
    user.showBioPublicly ? "Bio is visible" : "Bio is hidden",
    user.showSkillsPublicly ? "Skills are visible" : "Skills are hidden",
    user.showReviewsPublicly ? "Reviews are visible" : "Reviews are hidden",
    user.showBadgesPublicly ? "Badges are visible" : "Badges are hidden",
    user.showPhonePublicly ? "Phone is visible" : "Phone is private",
    user.showEmailPublicly ? "Email is visible" : "Email is private",
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 px-6 py-8 text-white sm:px-8 md:px-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-4">
                  <BuildUpLogo
                    href="/"
                    showTagline={false}
                    className="pointer-events-none"
                    textSize="md"
                    imageClassName="rounded-2xl bg-white/90 p-1"
                  />
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">
                  BuildUp Settings
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                  Manage your account and public profile
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 md:text-base">
                  Update your profile details, decide what appears publicly, control
                  notifications, and keep your volunteer identity polished and trusted.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/15 px-3 py-2 text-xs font-semibold text-white">
                  Profile Active
                </span>
                <span className="rounded-full bg-white/15 px-3 py-2 text-xs font-semibold text-white">
                  {user.isPortfolioPublic ? "Portfolio Public" : "Portfolio Private"}
                </span>
                <span className="rounded-full bg-white/15 px-3 py-2 text-xs font-semibold text-white">
                  {user.showPhonePublicly ? "Phone Visible" : "Phone Private"}
                </span>
                <span className="rounded-full bg-white/15 px-3 py-2 text-xs font-semibold text-white">
                  {user.showEmailPublicly ? "Email Visible" : "Email Private"}
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8 md:px-10">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-slate-700">Profile completion</p>
                  <p className="text-sm font-bold text-blue-600">{profileCompletion}%</p>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>

                <p className="text-sm text-slate-500">
                  Completing your profile makes you more credible to mentors and organizations.
                </p>
              </div>

              <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                      Profile Strength
                    </p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {profileStrength.score}%
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {profileStrength.completed} of {profileStrength.total} core profile signals completed.
                    </p>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-lg font-bold text-blue-700 shadow-sm">
                    {profileStrength.score}
                  </div>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-blue-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    style={{ width: `${profileStrength.score}%` }}
                  />
                </div>

                <p className="mt-3 text-sm leading-6 text-blue-800">
                  Stronger profiles usually feel more trustworthy and attract better opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>

        <form action={saveSettings} className="space-y-8">
          <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-8">
              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    Profile Photo
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Upload a clear professional image. It will appear in your dashboard and portfolio.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-5 md:flex-row md:items-center">
                    <div className="relative h-24 w-24 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
                      {user.profileImageUrl ? (
                        <Image
                          src={user.profileImageUrl}
                          alt={user.name || "Profile image"}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl font-bold text-white">
                          {getInitial(user.name)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <input
                        type="hidden"
                        name="currentProfileImageUrl"
                        value={user.profileImageUrl ?? ""}
                      />

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-800">
                          Upload New Photo
                        </label>
                        <input
                          type="file"
                          name="profileImageFile"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
                        />
                      </div>

                      {user.profileImageUrl && (
                        <label className="inline-flex items-center gap-3 text-sm text-slate-600">
                          <input
                            type="checkbox"
                            name="removeProfileImage"
                            className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                          />
                          Remove current profile photo
                        </label>
                      )}

                      <p className="text-sm leading-6 text-slate-500">
                        Recommended: square image, face clearly visible, up to 5MB.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    Profile Information
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    This information helps BuildUp present you more professionally.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={user.name ?? ""}
                      required
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      name="headline"
                      defaultValue={user.headline ?? ""}
                      placeholder="e.g. Frontend Developer"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="h-12 w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Username
                    </label>
                    <input
                      type="text"
                      value={user.username}
                      disabled
                      className="h-12 w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500 outline-none"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Short Bio
                  </label>
                  <textarea
                    name="bio"
                    defaultValue={user.bio ?? ""}
                    rows={5}
                    placeholder="Tell people about yourself, your interests, and the kind of projects you want to work on."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Skills
                    </label>
                    <input
                      type="text"
                      name="skills"
                      defaultValue={user.skills ?? ""}
                      placeholder="e.g. UI/UX Design, Frontend Development"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Experience Level
                    </label>
                    <select
                      name="experience"
                      defaultValue={user.experience ?? ""}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="">Select experience</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Country
                    </label>
                    <select
                      name="country"
                      defaultValue={user.country ?? ""}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="">Select country</option>
                      {COUNTRY_OPTIONS.map((item) => (
                        <option key={`${item.name}-${item.code}`} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Role
                    </label>
                    <input
                      type="text"
                      value={user.role}
                      disabled
                      className="h-12 w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500 outline-none"
                    />
                  </div>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-[180px_1fr]">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Country Code
                    </label>
                    <select
                      name="countryCode"
                      defaultValue={user.countryCode ?? ""}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="">Code</option>
                      {COUNTRY_OPTIONS.map((item) => (
                        <option
                          key={`${item.name}-${item.code}-cc`}
                          value={item.code}
                        >
                          {item.name} ({item.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      defaultValue={user.mobileNumber ?? ""}
                      placeholder="8123456789"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    Public Profile & Privacy
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Control what appears on your public BuildUp portfolio.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Public Identity
                    </p>
                    <div className="space-y-3">
                      <ToggleRow
                        name="isPortfolioPublic"
                        title="Public portfolio visibility"
                        description="Your public portfolio should be visible by default."
                        defaultChecked={user.isPortfolioPublic ?? true}
                      />
                      <ToggleRow
                        name="showCountryPublicly"
                        title="Show country publicly"
                        description="Country should be visible by default."
                        defaultChecked={user.showCountryPublicly ?? true}
                      />
                      <ToggleRow
                        name="showBioPublicly"
                        title="Show bio publicly"
                        description="Bio should be visible by default."
                        defaultChecked={user.showBioPublicly ?? true}
                      />
                      <ToggleRow
                        name="showSkillsPublicly"
                        title="Show skills publicly"
                        description="Skills should be visible by default."
                        defaultChecked={user.showSkillsPublicly ?? true}
                      />
                      <ToggleRow
                        name="showReviewsPublicly"
                        title="Show reviews publicly"
                        description="Reviews should be visible by default."
                        defaultChecked={user.showReviewsPublicly ?? true}
                      />
                      <ToggleRow
                        name="showBadgesPublicly"
                        title="Show badges publicly"
                        description="Badges should be visible by default."
                        defaultChecked={user.showBadgesPublicly ?? true}
                      />
                    </div>
                  </div>

                  <div className="pt-3">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Private Contact Info
                    </p>
                    <div className="space-y-3">
                      <ToggleRow
                        name="showPhonePublicly"
                        title="Show phone publicly"
                        description="Phone should remain private by default."
                        defaultChecked={user.showPhonePublicly ?? false}
                      />
                      <ToggleRow
                        name="showEmailPublicly"
                        title="Show email publicly"
                        description="Email should remain private by default."
                        defaultChecked={user.showEmailPublicly ?? false}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    Professional Preferences
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Help BuildUp recommend the right projects and mentorship support.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Availability
                    </label>
                    <select
                      name="availabilityStatus"
                      defaultValue={user.availabilityStatus ?? ""}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="">Select availability</option>
                      <option value="Available">Available</option>
                      <option value="Limited">Limited</option>
                      <option value="Unavailable">Unavailable</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      Preferred Difficulty
                    </label>
                    <select
                      name="preferredDifficulty"
                      defaultValue={user.preferredDifficulty ?? ""}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="">Select difficulty</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="mt-5">
                  <ToggleRow
                    name="openToMentorGuidance"
                    title="Open to mentor guidance"
                    description="Allow BuildUp to consider you for mentor-supported project matches."
                    defaultChecked={user.openToMentorGuidance ?? true}
                  />
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    Career & Links
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Add professional links that strengthen your BuildUp profile.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      name="linkedinUrl"
                      defaultValue={user.linkedinUrl ?? ""}
                      placeholder="https://linkedin.com/in/..."
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-800">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      name="githubUrl"
                      defaultValue={user.githubUrl ?? ""}
                      placeholder="https://github.com/..."
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Personal Website / Portfolio
                  </label>
                  <input
                    type="text"
                    name="portfolioWebsite"
                    defaultValue={user.portfolioWebsite ?? ""}
                    placeholder="https://yourwebsite.com"
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Career Goal
                  </label>
                  <textarea
                    name="careerGoal"
                    defaultValue={user.careerGoal ?? ""}
                    rows={4}
                    placeholder="e.g. Building frontend experience and stronger proof-of-work for future opportunities."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Completion
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {profileCompletion}%
                </p>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Strong profiles are more likely to build trust with organizations.
                </p>
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">
                  Profile Strength
                </h3>

                <div className="mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Core profile signals</span>
                    <span className="font-semibold text-blue-600">
                      {profileStrength.score}%
                    </span>
                  </div>

                  <div className="mt-2 h-3 rounded-full overflow-hidden bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      style={{ width: `${profileStrength.score}%` }}
                    />
                  </div>

                  <p className="mt-3 text-sm text-slate-500">
                    {profileStrength.completed} of {profileStrength.total} core profile signals completed.
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Complete your profile to improve visibility and get better project matches.
                  </p>
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">
                  Profile Level
                </h3>

                <div
                  className={`mt-4 rounded-2xl border px-4 py-4 ${profileLevel.borderClass} ${profileLevel.bgClass}`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Current level
                  </p>
                  <p className={`mt-2 text-2xl font-bold ${profileLevel.colorClass}`}>
                    {profileLevel.icon} {profileLevel.name}
                  </p>

                  {nextProfileLevel ? (
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Reach <span className="font-semibold">{nextProfileLevel.min}%</span>{" "}
                      profile strength to unlock{" "}
                      <span className="font-semibold">{nextProfileLevel.name}</span>.
                    </p>
                  ) : (
                    <p className="mt-3 text-sm leading-6 text-emerald-700">
                      You have reached the highest level. Your profile is fully optimized.
                    </p>
                  )}
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">
                  Privacy Summary
                </h3>
                <div className="mt-4 space-y-2">
                  {publicSummary.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">
                  BuildUp Tip
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Profiles with public skills, reviews, badges, complete portfolio
                  items, and a strong profile photo usually feel more trustworthy and project-ready.
                </p>
              </section>

              <SettingsSaveButton />
            </aside>
          </div>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Notifications
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Decide which updates BuildUp should send to you.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ToggleRow
                name="emailNotifications"
                title="Email notifications"
                description="Receive updates through email."
                defaultChecked={user.emailNotifications ?? true}
              />
              <ToggleRow
                name="inAppNotifications"
                title="In-app notifications"
                description="Receive updates inside your BuildUp dashboard."
                defaultChecked={user.inAppNotifications ?? true}
              />
              <ToggleRow
                name="notifyProjectUpdates"
                title="Project updates"
                description="Get notified when project applications or statuses change."
                defaultChecked={user.notifyProjectUpdates ?? true}
              />
              <ToggleRow
                name="notifyMentorMessages"
                title="Mentor messages"
                description="Get notified when mentors reach out or respond."
                defaultChecked={user.notifyMentorMessages ?? true}
              />
              <ToggleRow
                name="notifyOrganizationMessages"
                title="Organization messages"
                description="Get notified when organizations contact you."
                defaultChecked={user.notifyOrganizationMessages ?? true}
              />
              <ToggleRow
                name="notifyReviews"
                title="Review notifications"
                description="Get notified when a review is added to your profile."
                defaultChecked={user.notifyReviews ?? true}
              />
              <ToggleRow
                name="notifyBadges"
                title="Badge notifications"
                description="Get notified when you earn new badges."
                defaultChecked={user.notifyBadges ?? true}
              />
              <ToggleRow
                name="notifyWeeklySummary"
                title="Weekly summary"
                description="Receive a summary of activity and recommendations."
                defaultChecked={user.notifyWeeklySummary ?? false}
              />
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Security
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Basic account security tools for your BuildUp account.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Password update logic can be wired next through a dedicated secure action.
            </p>
          </section>

          <section className="rounded-[28px] border border-red-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold tracking-tight text-red-700">
                Account Management
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Use these actions carefully. They should later be protected with confirmations.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-amber-300 bg-amber-50 px-5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
              >
                Deactivate Account
              </button>

              <button
                type="button"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-red-300 bg-red-50 px-5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
              >
                Delete Account
              </button>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
}
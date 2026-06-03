



// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Image,
//   renderToBuffer,
// } from "@react-pdf/renderer";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import QRCode from "qrcode";

// export const runtime = "nodejs";

// const styles = StyleSheet.create({
//   page: {
//     padding: 42,
//     backgroundColor: "#f3f8ff",
//     fontFamily: "Helvetica",
//   },
//   border: {
//     border: "8px solid #0f172a",
//     padding: 28,
//     height: "100%",
//     backgroundColor: "#fbfdff",
//   },
//   innerBorder: {
//     border: "2px solid #facc15",
//     padding: 26,
//     height: "100%",
//     alignItems: "center",
//     justifyContent: "space-between",
//     position: "relative",
//   },
//   name: {
//     marginTop: 6,
//     fontSize: 34,
//     fontWeight: "bold",
//     color: "#0f172a",
//     textAlign: "center",
//   },
//   body: {
//     marginTop: 14,
//     maxWidth: 650,
//     fontSize: 15,
//     lineHeight: 1.6,
//     color: "#475569",
//     textAlign: "center",
//   },
//   statsRow: {
//     marginTop: 18,
//     flexDirection: "row",
//     gap: 16,
//   },
//   statBox: {
//     width: 230,
//     border: "1px solid #e2e8f0",
//     padding: 14,
//     backgroundColor: "#f8fafc",
//     borderRadius: 12,
//     textAlign: "center",
//   },
//   statLabel: {
//     fontSize: 9,
//     letterSpacing: 2,
//     color: "#64748b",
//     textTransform: "uppercase",
//   },
//   statValue: {
//     marginTop: 7,
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#0f172a",
//   },
//   skillsBox: {
//     marginTop: 18,
//     width: "88%",
//     border: "1px solid #bfdbfe",
//     backgroundColor: "#eff6ff",
//     padding: 13,
//     borderRadius: 12,
//   },
//   skillsLabel: {
//     fontSize: 9,
//     letterSpacing: 2,
//     color: "#2563eb",
//     textTransform: "uppercase",
//     textAlign: "center",
//   },
//   skillsText: {
//     marginTop: 8,
//     fontSize: 11,
//     lineHeight: 1.5,
//     color: "#1e3a8a",
//     textAlign: "center",
//   },
//   footer: {
//     width: "100%",
//     marginTop: 22,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-end",
//   },
//   footerBlock: {
//     width: "30%",
//   },
//   footerLabel: {
//     fontSize: 9,
//     letterSpacing: 2,
//     color: "#64748b",
//     textTransform: "uppercase",
//   },
//   footerValue: {
//     marginTop: 8,
//     fontSize: 10,
//     color: "#0f172a",
//     fontWeight: "bold",
//   },
// });

// function formatCertificateSkills(skillsSummary?: string | null) {
//   if (!skillsSummary) return "";

//   const skills = skillsSummary
//     .split(",")
//     .map((skill) => skill.trim())
//     .filter(Boolean);

//   const topSkills = skills.slice(0, 6);
//   const remaining = skills.length - topSkills.length;

//   return remaining > 0
//     ? `${topSkills.join(" • ")} • +${remaining} more`
//     : topSkills.join(" • ");
// }

// function CertificateDocument({
//   name,
//   certificateNo,
//   completedProjectsCount,
//   skillsSummary,
//   issuedAt,
//   verifyUrl,
//   qrCodeDataUrl,
//   logoUrl,
//   profileImageUrl,
// }: {
//   name: string;
//   certificateNo: string;
//   completedProjectsCount: number;
//   skillsSummary?: string | null;
//   issuedAt: Date;
//   verifyUrl: string;
//   qrCodeDataUrl: string;
//   logoUrl: string;
//   profileImageUrl?: string | null;
// }) {
//   return (
//     <Document>
//       <Page size="A4" orientation="landscape" style={styles.page}>
//         <View style={styles.border}>
//           <View style={styles.innerBorder}>
//             <Image
//               src={logoUrl}
//               style={{
//                 position: "absolute",
//                 width: 260,
//                 height: 260,
//                 opacity: 0.05,
//                 top: "34%",
//                 left: "35%",
//                 objectFit: "contain",
//               }}
//             />

//             <View style={{ alignItems: "center" }}>
//               <View
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   marginBottom: 10,
//                 }}
//               >
//                 <Image
//                   src={logoUrl}
//                   style={{
//                     width: 90,
//                     height: 50,
//                     objectFit: "contain",
//                   }}
//                 />

//                 <Text
//                   style={{
//                     fontSize: 20,
//                     fontWeight: "bold",
//                     color: "#0f172a",
//                     marginLeft: 8,
//                   }}
//                 >
//                   BuildUp
//                 </Text>

//                 <Text
//                   style={{
//                     marginHorizontal: 14,
//                     color: "#94a3b8",
//                     fontSize: 22,
//                   }}
//                 >
//                   |
//                 </Text>

//                 <Text
//                   style={{
//                     fontSize: 12,
//                     color: "#2563eb",
//                     letterSpacing: 3,
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   Certificate of Verified Experience
//                 </Text>
//               </View>

//               {profileImageUrl ? (
//                 <Image
//                   src={profileImageUrl}
//                   style={{
//                     width: 72,
//                     height: 72,
//                     borderRadius: 36,
//                     marginTop: 8,
//                     marginBottom: 6,
//                     border: "2px solid #dbeafe",
//                   }}
//                 />
//               ) : null}

//               <Text style={styles.name}>{name}</Text>

//               <Text style={styles.body}>
//                 Issued by BuildUp in recognition of verified real-world project
//                 experience successfully completed through the platform.
//               </Text>

//               <View style={styles.statsRow}>
//                 <View style={styles.statBox}>
//                   <Text style={styles.statLabel}>Projects Completed</Text>

//                   <Text style={styles.statValue}>
//                     {completedProjectsCount}
//                   </Text>
//                 </View>

//                 <View style={styles.statBox}>
//                   <Text style={styles.statLabel}>Certificate No.</Text>

//                   <Text style={styles.statValue}>{certificateNo}</Text>
//                 </View>
//               </View>

//               {skillsSummary ? (
//                 <View style={styles.skillsBox}>
//                   <Text style={styles.skillsLabel}>Primary Skills</Text>

//                   <Text style={styles.skillsText}>
//                     {formatCertificateSkills(skillsSummary)}
//                   </Text>
//                 </View>
//               ) : null}
//             </View>

//             <View style={styles.footer}>
//               <View style={styles.footerBlock}>
//                 <Text style={styles.footerLabel}>Issued Date</Text>

//                 <Text style={styles.footerValue}>
//                   {issuedAt.toLocaleDateString("en-GB", {
//                     day: "numeric",
//                     month: "long",
//                     year: "numeric",
//                   })}
//                 </Text>
//               </View>

//               <View style={{ alignItems: "center", width: "30%" }}>
//                 <Image
//                   src={qrCodeDataUrl}
//                   style={{
//                     width: 72,
//                     height: 72,
//                     marginBottom: 5,
//                   }}
//                 />

//                 <Text
//                   style={{
//                     fontSize: 10,
//                     color: "#0f172a",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   Scan to Verify
//                 </Text>
//               </View>

//               <View style={styles.footerBlock}>
//                 <Text style={styles.footerLabel}>Verify</Text>

//                 <Text style={styles.footerValue}>
//                   Scan QR or visit verification page
//                 </Text>
//               </View>
//             </View>

//             <Text
//               style={{
//                 marginTop: 14,
//                 fontSize: 9,
//                 color: "#64748b",
//                 textAlign: "center",
//               }}
//             >
//               BuildUp | Build real experience. Not just certificates.
//             </Text>
//           </View>
//         </View>
//       </Page>
//     </Document>
//   );
// }

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const certificate = await prisma.certificate.findFirst({
//       where: { volunteerId: session.user.id },
//       include: {
//         volunteer: {
//           select: {
//             name: true,
//             username: true,
//             profileImageUrl: true,
//           },
//         },
//       },
//       orderBy: { issuedAt: "desc" },
//     });

//     if (!certificate) {
//       return NextResponse.json(
//         { error: "No certificate found." },
//         { status: 404 }
//       );
//     }

//     const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
//     const verifyUrl = `${appUrl}/verify/${certificate.certificateNo}`;

//     const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
//       width: 300,
//       margin: 1,
//     });

//     const pdfBuffer = await renderToBuffer(
//       <CertificateDocument
//         name={certificate.volunteer.name || "BuildUp Volunteer"}
//         certificateNo={certificate.certificateNo}
//         completedProjectsCount={certificate.completedProjectsCount}
//         skillsSummary={certificate.skillsSummary}
//         issuedAt={certificate.issuedAt}
//         verifyUrl={verifyUrl}
//         qrCodeDataUrl={qrCodeDataUrl}
//         logoUrl={`${appUrl}/brand/buildup-logo.png`}
//         profileImageUrl={certificate.volunteer.profileImageUrl}
//       />
//     );

//     return new Response(pdfBuffer as BodyInit, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename="${certificate.certificateNo}.pdf"`,
//       },
//     });
//   } catch (error) {
//     console.error("CERTIFICATE DOWNLOAD ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to generate certificate PDF." },
//       { status: 500 }
//     );
//   }
// }




// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Image,
//   renderToBuffer,
// } from "@react-pdf/renderer";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import QRCode from "qrcode";

// export const runtime = "nodejs";

// const styles = StyleSheet.create({
//   page: {
//     padding: 42,
//     backgroundColor: "#f3f8ff",
//     fontFamily: "Helvetica",
//   },
//   border: {
//     border: "8px solid #0f172a",
//     padding: 28,
//     height: "100%",
//     backgroundColor: "#ffffff",
//   },
//   innerBorder: {
//     border: "2px solid #facc15",
//     padding: 26,
//     height: "100%",
//     alignItems: "center",
//     justifyContent: "space-between",
//     position: "relative",
//   },
//   name: {
//     marginTop: 4,
//     fontSize: 30,
//     fontWeight: "bold",
//     color: "#0f172a",
//     textAlign: "center",
//   },
//   body: {
//     marginTop: 14,
//     maxWidth: 650,
//     fontSize: 15,
//     lineHeight: 1.6,
//     color: "#475569",
//     textAlign: "center",
//   },
//   statsRow: {
//     marginTop: 18,
//     flexDirection: "row",
//     gap: 16,
//   },
//   statBox: {
//     width: 230,
//     border: "1px solid #e2e8f0",
//     padding: 14,
//     backgroundColor: "#f8fafc",
//     borderRadius: 12,
//     textAlign: "center",
//   },
//   statLabel: {
//     fontSize: 9,
//     letterSpacing: 2,
//     color: "#64748b",
//     textTransform: "uppercase",
//   },
//   statValue: {
//     marginTop: 7,
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#0f172a",
//   },
//   skillsBox: {
//     marginTop: 18,
//     width: "88%",
//     border: "1px solid #bfdbfe",
//     backgroundColor: "#eff6ff",
//     padding: 13,
//     borderRadius: 12,
//   },
//   skillsLabel: {
//     fontSize: 9,
//     letterSpacing: 2,
//     color: "#2563eb",
//     textTransform: "uppercase",
//     textAlign: "center",
//   },
//   skillsText: {
//     marginTop: 8,
//     fontSize: 11,
//     lineHeight: 1.5,
//     color: "#1e3a8a",
//     textAlign: "center",
//   },
//   footer: {
//     width: "100%",
//     marginTop: 22,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-end",
//   },
//   footerBlock: {
//     width: "30%",
//   },
//   footerLabel: {
//     fontSize: 9,
//     letterSpacing: 2,
//     color: "#64748b",
//     textTransform: "uppercase",
//   },
//   footerValue: {
//     marginTop: 8,
//     fontSize: 10,
//     color: "#0f172a",
//     fontWeight: "bold",
//   },
// });

// function formatCertificateSkills(skillsSummary?: string | null) {
//   if (!skillsSummary) return "";

//   const skills = skillsSummary
//     .split(",")
//     .map((skill) => skill.trim())
//     .filter(Boolean);

//   const topSkills = skills.slice(0, 6);
//   const remaining = skills.length - topSkills.length;

//   return remaining > 0
//     ? `${topSkills.join(" • ")} • +${remaining} more`
//     : topSkills.join(" • ");
// }

// function CertificateDocument({
//   name,
//   certificateNo,
//   completedProjectsCount,
//   skillsSummary,
//   issuedAt,
//   verifyUrl,
//   qrCodeDataUrl,
//   logoUrl,
//   profileImageUrl,
// }: {
//   name: string;
//   certificateNo: string;
//   completedProjectsCount: number;
//   skillsSummary?: string | null;
//   issuedAt: Date;
//   verifyUrl: string;
//   qrCodeDataUrl: string;
//   logoUrl: string;
//   profileImageUrl?: string | null;
// }) {
//   return (
//     <Document>
//       <Page size="A4" orientation="landscape" style={styles.page}>
//         <View style={styles.border}>
//           <View style={styles.innerBorder}>
//             <Image
//               src={logoUrl}
//               style={{
//                 position: "absolute",
//                 width: 320,
//                 height: 320,
//                 opacity: 0.03,
//                 top: "28%",
//                 left: "32%",
//                 objectFit: "contain",
//               }}
//             />

//             <View style={{ alignItems: "center" }}>
//               <View
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   marginBottom: 10,
//                 }}
//               >
//                 <Image
//                   src={logoUrl}
//                   style={{
//                     width: 100,
//                     height: 56,
//                     objectFit: "contain",
//                   }}
//                 />

//                 <Text
//                   style={{
//                     fontSize: 22,
//                     fontWeight: "bold",
//                     color: "#0f172a",
//                     marginLeft: 8,
//                   }}
//                 >
//                   BuildUp
//                 </Text>

//                 <Text
//                   style={{
//                     marginHorizontal: 14,
//                     color: "#94a3b8",
//                     fontSize: 22,
//                   }}
//                 >
//                   |
//                 </Text>

//                 <Text
//                   style={{
//                     fontSize: 12,
//                     color: "#2563eb",
//                     letterSpacing: 3,
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   Certificate of Verified Experience
//                 </Text>
//               </View>

//               {profileImageUrl ? (
//                 <View
//                   style={{
//                     marginTop: 8,
//                     marginBottom: 8,
//                     padding: 3,
//                     border: "1px solid #dbeafe",
//                     backgroundColor: "#ffffff",
//                     borderRadius: 8,
//                   }}
//                 >
//                   <Image
//                     src={profileImageUrl}
//                     style={{
//                       width: 80,
//                       height: 80,
//                       objectFit: "cover",
//                     }}
//                   />
//                 </View>
//               ) : null}

//               <Text style={styles.name}>{name}</Text>

//               <Text style={styles.body}>
//                 Issued by BuildUp in recognition of verified real-world project
//                 experience successfully completed through the platform.
//               </Text>

//               <View style={styles.statsRow}>
//                 <View style={styles.statBox}>
//                   <Text style={styles.statLabel}>Projects Completed</Text>

//                   <Text style={styles.statValue}>
//                     {completedProjectsCount}
//                   </Text>
//                 </View>

//                 <View style={styles.statBox}>
//                   <Text style={styles.statLabel}>Certificate No.</Text>

//                   <Text style={styles.statValue}>{certificateNo}</Text>
//                 </View>
//               </View>

//               {skillsSummary ? (
//                 <View style={styles.skillsBox}>
//                   <Text style={styles.skillsLabel}>Primary Skills</Text>

//                   <Text style={styles.skillsText}>
//                     {formatCertificateSkills(skillsSummary)}
//                   </Text>
//                 </View>
//               ) : null}
//             </View>

//             <View style={styles.footer}>
//               <View style={styles.footerBlock}>
//                 <Text style={styles.footerLabel}>Issued Date</Text>

//                 <Text style={styles.footerValue}>
//                   {issuedAt.toLocaleDateString("en-GB", {
//                     day: "numeric",
//                     month: "long",
//                     year: "numeric",
//                   })}
//                 </Text>
//               </View>

//               <View style={{ alignItems: "center", width: "30%" }}>
//                 <Image
//                   src={qrCodeDataUrl}
//                   style={{
//                     width: 72,
//                     height: 72,
//                     marginBottom: 5,
//                   }}
//                 />

//                 <Text
//                   style={{
//                     fontSize: 10,
//                     color: "#0f172a",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   Scan to Verify
//                 </Text>
//               </View>

//               <View style={styles.footerBlock}>
//                 <Text style={styles.footerLabel}>Verify</Text>

//                 <Text style={styles.footerValue}>
//                   Scan QR or visit verification page
//                 </Text>
//               </View>
//             </View>

//             <Text
//               style={{
//                 marginTop: 14,
//                 fontSize: 9,
//                 color: "#64748b",
//                 textAlign: "center",
//               }}
//             >
//               BuildUp | Build real experience. Not just certificates.
//             </Text>
//           </View>
//         </View>
//       </Page>
//     </Document>
//   );
// }

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const certificate = await prisma.certificate.findFirst({
//       where: { volunteerId: session.user.id },
//       include: {
//         volunteer: {
//           select: {
//             name: true,
//             username: true,
//             profileImageUrl: true,
//           },
//         },
//       },
//       orderBy: { issuedAt: "desc" },
//     });

//     if (!certificate) {
//       return NextResponse.json(
//         { error: "No certificate found." },
//         { status: 404 }
//       );
//     }

//     const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
//     const verifyUrl = `${appUrl}/verify/${certificate.certificateNo}`;

//     const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
//       width: 300,
//       margin: 1,
//     });

//     const pdfBuffer = await renderToBuffer(
//       <CertificateDocument
//         name={certificate.volunteer.name || "BuildUp Volunteer"}
//         certificateNo={certificate.certificateNo}
//         completedProjectsCount={certificate.completedProjectsCount}
//         skillsSummary={certificate.skillsSummary}
//         issuedAt={certificate.issuedAt}
//         verifyUrl={verifyUrl}
//         qrCodeDataUrl={qrCodeDataUrl}
//         logoUrl={`${appUrl}/brand/buildup-logo.png`}
//         profileImageUrl={certificate.volunteer.profileImageUrl}
//       />
//     );

//     return new Response(pdfBuffer as BodyInit, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename="${certificate.certificateNo}.pdf"`,
//       },
//     });
//   } catch (error) {
//     console.error("CERTIFICATE DOWNLOAD ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to generate certificate PDF." },
//       { status: 500 }
//     );
//   }
// }





// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Image,
//   renderToBuffer,
// } from "@react-pdf/renderer";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import QRCode from "qrcode";

// export const runtime = "nodejs";

// const styles = StyleSheet.create({
//   page: {
//     padding: 42,
//     backgroundColor: "#f3f8ff",
//     fontFamily: "Helvetica",
//   },
//   border: {
//     border: "8px solid #0f172a",
//     padding: 28,
//     height: "100%",
//     backgroundColor: "#ffffff",
//   },
//   innerBorder: {
//     border: "2px solid #facc15",
//     padding: 24,
//     height: "100%",
//     alignItems: "center",
//     justifyContent: "space-between",
//     position: "relative",
//   },
//   name: {
//     marginTop: 3,
//     fontSize: 29,
//     fontWeight: "bold",
//     color: "#0f172a",
//     textAlign: "center",
//   },
//   body: {
//     marginTop: 10,
//     maxWidth: 680,
//     fontSize: 13,
//     lineHeight: 1.45,
//     color: "#475569",
//     textAlign: "center",
//   },
//   statsRow: {
//     marginTop: 12,
//     flexDirection: "row",
//     gap: 16,
//   },
//   statBox: {
//     width: 230,
//     border: "1px solid #e2e8f0",
//     padding: 10,
//     backgroundColor: "#f8fafc",
//     borderRadius: 12,
//     textAlign: "center",
//   },
//   statLabel: {
//     fontSize: 8,
//     letterSpacing: 2,
//     color: "#64748b",
//     textTransform: "uppercase",
//   },
//   statValue: {
//     marginTop: 5,
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#0f172a",
//   },
//   skillsBox: {
//     marginTop: 10,
//     width: "78%",
//     border: "1px solid #bfdbfe",
//     backgroundColor: "#eff6ff",
//     padding: 8,
//     borderRadius: 12,
//   },
//   skillsLabel: {
//     fontSize: 8,
//     letterSpacing: 2,
//     color: "#2563eb",
//     textTransform: "uppercase",
//     textAlign: "center",
//   },
//   skillsText: {
//     marginTop: 5,
//     fontSize: 9,
//     lineHeight: 1.25,
//     color: "#1e3a8a",
//     textAlign: "center",
//   },
//   footer: {
//     width: "100%",
//     marginTop: 14,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-end",
//   },
//   footerBlock: {
//     width: "30%",
//   },
//   footerLabel: {
//     fontSize: 8,
//     letterSpacing: 2,
//     color: "#64748b",
//     textTransform: "uppercase",
//   },
//   footerValue: {
//     marginTop: 6,
//     fontSize: 9,
//     color: "#0f172a",
//     fontWeight: "bold",
//   },
// });

// function formatCertificateSkills(skillsSummary?: string | null) {
//   if (!skillsSummary) return "";

//   const skills = skillsSummary
//     .split(",")
//     .map((skill) => skill.trim())
//     .filter(Boolean);

//   const topSkills = skills.slice(0, 4);
//   const remaining = skills.length - topSkills.length;

//   return remaining > 0
//     ? `${topSkills.join(" • ")} • +${remaining} more`
//     : topSkills.join(" • ");
// }

// function CertificateDocument({
//   name,
//   certificateNo,
//   completedProjectsCount,
//   skillsSummary,
//   issuedAt,
//   verifyUrl,
//   qrCodeDataUrl,
//   logoUrl,
//   profileImageUrl,
// }: {
//   name: string;
//   certificateNo: string;
//   completedProjectsCount: number;
//   skillsSummary?: string | null;
//   issuedAt: Date;
//   verifyUrl: string;
//   qrCodeDataUrl: string;
//   logoUrl: string;
//   profileImageUrl?: string | null;
// }) {
//   return (
//     <Document>
//       <Page size="A4" orientation="landscape" style={styles.page}>
//         <View style={styles.border}>
//           <View style={styles.innerBorder}>
//             <Image
//               src={logoUrl}
//               style={{
//                 position: "absolute",
//                 width: 300,
//                 height: 300,
//                 opacity: 0.025,
//                 top: "30%",
//                 left: "33%",
//                 objectFit: "contain",
//               }}
//             />

//             <View style={{ alignItems: "center" }}>
//               <View
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   marginBottom: 6,
//                 }}
//               >
//                 <Image
//                   src={logoUrl}
//                   style={{
//                     width: 92,
//                     height: 50,
//                     objectFit: "contain",
//                   }}
//                 />

//                 <Text
//                   style={{
//                     fontSize: 21,
//                     fontWeight: "bold",
//                     color: "#0f172a",
//                     marginLeft: 8,
//                   }}
//                 >
//                   BuildUp
//                 </Text>

//                 <Text
//                   style={{
//                     marginHorizontal: 14,
//                     color: "#94a3b8",
//                     fontSize: 21,
//                   }}
//                 >
//                   |
//                 </Text>

//                 <Text
//                   style={{
//                     fontSize: 11,
//                     color: "#2563eb",
//                     letterSpacing: 3,
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   Certificate of Verified Experience
//                 </Text>
//               </View>

//               {profileImageUrl ? (
//                 <View
//                   style={{
//                     marginTop: 4,
//                     marginBottom: 5,
//                     padding: 3,
//                     border: "1px solid #dbeafe",
//                     backgroundColor: "#ffffff",
//                     borderRadius: 8,
//                   }}
//                 >
//                   <Image
//                     src={profileImageUrl}
//                     style={{
//                       width: 78,
//                       height: 54,
//                       objectFit: "contain",
//                     }}
//                   />
//                 </View>
//               ) : null}

//               <Text style={styles.name}>{name}</Text>

//               <Text style={styles.body}>
//                 Issued by BuildUp in recognition of verified real-world project
//                 experience successfully completed through the platform.
//               </Text>

//               <View style={styles.statsRow}>
//                 <View style={styles.statBox}>
//                   <Text style={styles.statLabel}>Projects Completed</Text>

//                   <Text style={styles.statValue}>
//                     {completedProjectsCount}
//                   </Text>
//                 </View>

//                 <View style={styles.statBox}>
//                   <Text style={styles.statLabel}>Certificate No.</Text>

//                   <Text style={styles.statValue}>{certificateNo}</Text>
//                 </View>
//               </View>

//               {skillsSummary ? (
//                 <View style={styles.skillsBox}>
//                   <Text style={styles.skillsLabel}>Primary Skills</Text>

//                   <Text style={styles.skillsText}>
//                     {formatCertificateSkills(skillsSummary)}
//                   </Text>
//                 </View>
//               ) : null}
//             </View>

//             <View style={styles.footer}>
//               <View style={styles.footerBlock}>
//                 <Text style={styles.footerLabel}>Issued Date</Text>

//                 <Text style={styles.footerValue}>
//                   {issuedAt.toLocaleDateString("en-GB", {
//                     day: "numeric",
//                     month: "long",
//                     year: "numeric",
//                   })}
//                 </Text>
//               </View>

//               <View style={{ alignItems: "center", width: "30%" }}>
//                 <Image
//                   src={qrCodeDataUrl}
//                   style={{
//                     width: 58,
//                     height: 58,
//                     marginBottom: 4,
//                   }}
//                 />

//                 <Text
//                   style={{
//                     fontSize: 9,
//                     color: "#0f172a",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   Scan to Verify
//                 </Text>
//               </View>

//               <View style={styles.footerBlock}>
//                 <Text style={styles.footerLabel}>Verify</Text>

//                 <Text style={styles.footerValue}>
//                   Scan QR or visit verification page
//                 </Text>
//               </View>
//             </View>

//             <Text
//               style={{
//                 marginTop: 10,
//                 fontSize: 8,
//                 color: "#64748b",
//                 textAlign: "center",
//               }}
//             >
//               BuildUp | Build real experience. Not just certificates.
//             </Text>
//           </View>
//         </View>
//       </Page>
//     </Document>
//   );
// }

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const certificate = await prisma.certificate.findFirst({
//       where: { volunteerId: session.user.id },
//       include: {
//         volunteer: {
//           select: {
//             name: true,
//             username: true,
//             profileImageUrl: true,
//           },
//         },
//       },
//       orderBy: { issuedAt: "desc" },
//     });

//     if (!certificate) {
//       return NextResponse.json(
//         { error: "No certificate found." },
//         { status: 404 }
//       );
//     }

//     const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
//     const verifyUrl = `${appUrl}/verify/${certificate.certificateNo}`;

//     const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
//       width: 300,
//       margin: 1,
//     });

//     const pdfBuffer = await renderToBuffer(
//       <CertificateDocument
//         name={certificate.volunteer.name || "BuildUp Volunteer"}
//         certificateNo={certificate.certificateNo}
//         completedProjectsCount={certificate.completedProjectsCount}
//         skillsSummary={certificate.skillsSummary}
//         issuedAt={certificate.issuedAt}
//         verifyUrl={verifyUrl}
//         qrCodeDataUrl={qrCodeDataUrl}
//         logoUrl={`${appUrl}/brand/buildup-logo.png`}
//         profileImageUrl={certificate.volunteer.profileImageUrl}
//       />
//     );

//     return new Response(pdfBuffer as BodyInit, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename="${certificate.certificateNo}.pdf"`,
//       },
//     });
//   } catch (error) {
//     console.error("CERTIFICATE DOWNLOAD ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to generate certificate PDF." },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  renderToBuffer,
} from "@react-pdf/renderer";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export const runtime = "nodejs";

const styles = StyleSheet.create({
  page: {
    padding: 42,
    backgroundColor: "#f3f8ff",
    fontFamily: "Helvetica",
  },
  border: {
    border: "8px solid #0f172a",
    padding: 28,
    height: "100%",
    backgroundColor: "#ffffff",
  },
  innerBorder: {
    border: "2px solid #facc15",
    padding: 24,
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  name: {
    marginTop: 3,
    fontSize: 29,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
  },
  body: {
    marginTop: 10,
    maxWidth: 680,
    fontSize: 13,
    lineHeight: 1.45,
    color: "#475569",
    textAlign: "center",
  },
  statsRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 16,
  },
  statBox: {
    width: 230,
    border: "1px solid #e2e8f0",
    padding: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    textAlign: "center",
  },
  statLabel: {
    fontSize: 8,
    letterSpacing: 2,
    color: "#64748b",
    textTransform: "uppercase",
  },
  statValue: {
    marginTop: 5,
    fontSize: 22,
    fontWeight: "bold",
    color: "#0f172a",
  },
  skillsBox: {
    marginTop: 10,
    width: "70%",
    border: "1px solid #bfdbfe",
    backgroundColor: "#eff6ff",
    padding: 7,
    borderRadius: 12,
  },
  skillsLabel: {
    fontSize: 8,
    letterSpacing: 2,
    color: "#2563eb",
    textTransform: "uppercase",
    textAlign: "center",
  },
  skillsText: {
    marginTop: 4,
    fontSize: 8.5,
    lineHeight: 1.2,
    color: "#1e3a8a",
    textAlign: "center",
  },
  footer: {
    width: "100%",
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerBlock: {
    width: "30%",
  },
  footerLabel: {
    fontSize: 8,
    letterSpacing: 2,
    color: "#64748b",
    textTransform: "uppercase",
  },
  footerValue: {
    marginTop: 6,
    fontSize: 9,
    color: "#0f172a",
    fontWeight: "bold",
  },
});

function formatCertificateSkills(skillsSummary?: string | null) {
  if (!skillsSummary) return "";

  const skills = skillsSummary
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  const topSkills = skills.slice(0, 3);
  const remaining = skills.length - topSkills.length;

  return remaining > 0
    ? `${topSkills.join(" • ")} • +${remaining} more`
    : topSkills.join(" • ");
}

function CertificateDocument({
  name,
  certificateNo,
  completedProjectsCount,
  skillsSummary,
  issuedAt,
  verifyUrl,
  qrCodeDataUrl,
  logoUrl,
  profileImageUrl,
}: {
  name: string;
  certificateNo: string;
  completedProjectsCount: number;
  skillsSummary?: string | null;
  issuedAt: Date;
  verifyUrl: string;
  qrCodeDataUrl: string;
  logoUrl: string;
  profileImageUrl?: string | null;
}) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <View style={styles.innerBorder}>
            <Image
              src={logoUrl}
              style={{
                position: "absolute",
                width: 300,
                height: 300,
                opacity: 0.025,
                top: "30%",
                left: "33%",
                objectFit: "contain",
              }}
            />

            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <Image
                  src={logoUrl}
                  style={{
                    width: 92,
                    height: 50,
                    objectFit: "contain",
                  }}
                />

                <Text
                  style={{
                    fontSize: 21,
                    fontWeight: "bold",
                    color: "#0f172a",
                    marginLeft: 8,
                  }}
                >
                  BuildUp
                </Text>

                <Text
                  style={{
                    marginHorizontal: 14,
                    color: "#94a3b8",
                    fontSize: 21,
                  }}
                >
                  |
                </Text>

                <Text
                  style={{
                    fontSize: 11,
                    color: "#2563eb",
                    letterSpacing: 3,
                    textTransform: "uppercase",
                  }}
                >
                  Certificate of Verified Experience
                </Text>
              </View>

              {profileImageUrl ? (
                <View
                  style={{
                    marginTop: 4,
                    marginBottom: 5,
                    padding: 3,
                    border: "1px solid #dbeafe",
                    backgroundColor: "#ffffff",
                    borderRadius: 8,
                  }}
                >
                  <Image
                    src={profileImageUrl}
                    style={{
                      width: 78,
                      height: 54,
                      objectFit: "contain",
                    }}
                  />
                </View>
              ) : null}

              <Text style={styles.name}>{name}</Text>

              <Text style={styles.body}>
                Issued by BuildUp in recognition of verified real-world project
                experience successfully completed through the platform.
              </Text>

              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Projects Completed</Text>

                  <Text style={styles.statValue}>
                    {completedProjectsCount}
                  </Text>
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Certificate No.</Text>

                  <Text style={styles.statValue}>{certificateNo}</Text>
                </View>
              </View>

              {skillsSummary ? (
                <View style={styles.skillsBox}>
                  <Text style={styles.skillsLabel}>Primary Skills</Text>

                  <Text style={styles.skillsText}>
                    {formatCertificateSkills(skillsSummary)}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={styles.footer}>
              <View style={styles.footerBlock}>
                <Text style={styles.footerLabel}>Issued Date</Text>

                <Text style={styles.footerValue}>
                  {issuedAt.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </View>

              <View style={{ alignItems: "center", width: "30%" }}>
                <Image
                  src={qrCodeDataUrl}
                  style={{
                    width: 56,
                    height: 56,
                    marginBottom: 4,
                  }}
                />

                <Text
                  style={{
                    fontSize: 9,
                    color: "#0f172a",
                    fontWeight: "bold",
                  }}
                >
                  Scan to Verify
                </Text>
              </View>

              <View style={styles.footerBlock}>
                <Text style={styles.footerLabel}>Verify</Text>

                <Text style={styles.footerValue}>
                  Scan QR or visit verification page
                </Text>
              </View>
            </View>

            <Text
              style={{
                marginTop: 8,
                fontSize: 8,
                color: "#64748b",
                textAlign: "center",
              }}
            >
              BuildUp | Build real experience. Not just certificates.
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const certificate = await prisma.certificate.findFirst({
      where: { volunteerId: session.user.id },
      include: {
        volunteer: {
          select: {
            name: true,
            username: true,
            profileImageUrl: true,
          },
        },
      },
      orderBy: { issuedAt: "desc" },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: "No certificate found." },
        { status: 404 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verifyUrl = `${appUrl}/verify/${certificate.certificateNo}`;

    const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 300,
      margin: 1,
    });

    const pdfBuffer = await renderToBuffer(
      <CertificateDocument
        name={certificate.volunteer.name || "BuildUp Volunteer"}
        certificateNo={certificate.certificateNo}
        completedProjectsCount={certificate.completedProjectsCount}
        skillsSummary={certificate.skillsSummary}
        issuedAt={certificate.issuedAt}
        verifyUrl={verifyUrl}
        qrCodeDataUrl={qrCodeDataUrl}
        logoUrl={`${appUrl}/brand/buildup-logo.png`}
        profileImageUrl={certificate.volunteer.profileImageUrl}
      />
    );

    return new Response(pdfBuffer as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${certificate.certificateNo}.pdf"`,
      },
    });
  } catch (error) {
    console.error("CERTIFICATE DOWNLOAD ERROR:", error);

    return NextResponse.json(
      { error: "Failed to generate certificate PDF." },
      { status: 500 }
    );
  }
}
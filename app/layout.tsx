import "./globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


// import "./globals.css";

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//         {/* 🔌 BOOTSTRAP SOCKET.IO SERVER */}
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `
//               fetch('/api/socket');
//             `,
//           }}
//         />

//         {children}
//       </body>
//     </html>
//   );
// }

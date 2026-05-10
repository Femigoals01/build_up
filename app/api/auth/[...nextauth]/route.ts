




// import NextAuth from "next-auth";
// import type { AuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";
// import { clearRateLimit, consumeRateLimit } from "@/lib/rateLimit";

// const LOGIN_LIMIT = 5;
// const LOGIN_WINDOW_MS = 10 * 60 * 1000;

// function isValidEmail(email: string) {
//   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// }

// export const authOptions: AuthOptions = {
//   session: { strategy: "jwt" },

//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: {},
//         password: {},
//       },

//       async authorize(credentials) {
//         const rawEmail = String(credentials?.email || "");
//         const rawPassword = String(credentials?.password || "");

//         const normalizedEmail = rawEmail.trim().toLowerCase();
//         const password = rawPassword;

//         if (!normalizedEmail || !password || !isValidEmail(normalizedEmail)) {
//           throw new Error("Invalid email or password");
//         }

//         const emailLimit = consumeRateLimit(
//           `login:email:${normalizedEmail}`,
//           LOGIN_LIMIT,
//           LOGIN_WINDOW_MS
//         );

//         if (!emailLimit.allowed) {
//           throw new Error(
//             `Too many login attempts. Try again in ${emailLimit.retryAfterSeconds} seconds.`
//           );
//         }

//         const user = await prisma.user.findFirst({
//           where: {
//             email: {
//               equals: normalizedEmail,
//               mode: "insensitive",
//             },
//           },
//         });

//         if (!user) {
//           throw new Error("Invalid email or password");
//         }

//         const isValid = await bcrypt.compare(password, user.password);

//         if (!isValid) {
//           throw new Error("Invalid email or password");
//         }

//         if (!user.emailVerified) {
//           throw new Error("EMAIL_NOT_VERIFIED");
//         }

//         clearRateLimit(`login:email:${normalizedEmail}`);

//         return {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           username: user.username,
//           profileImageUrl: user.profileImageUrl,
//         };
//       },
//     }),
//   ],

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.role = user.role;
//         token.username = user.username;
//         token.profileImageUrl = user.profileImageUrl;
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string;
//         session.user.role = token.role as any;
//         session.user.username = token.username as string;
//         session.user.profileImageUrl =
//           (token.profileImageUrl as string | null) ?? null;
//       }
//       return session;
//     },
//   },

//   pages: {
//     signIn: "/login",
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };




import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { clearRateLimit, consumeRateLimit } from "@/lib/rateLimit";

const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 10 * 60 * 1000;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const rawEmail = String(credentials?.email || "");
        const rawPassword = String(credentials?.password || "");

        const normalizedEmail = rawEmail.trim().toLowerCase();
        const password = rawPassword;

        if (!normalizedEmail || !password || !isValidEmail(normalizedEmail)) {
          throw new Error("Invalid email or password");
        }

        const emailLimit = consumeRateLimit(
          `login:email:${normalizedEmail}`,
          LOGIN_LIMIT,
          LOGIN_WINDOW_MS
        );

        if (!emailLimit.allowed) {
          throw new Error(
            `Too many login attempts. Try again in ${emailLimit.retryAfterSeconds} seconds.`
          );
        }

        const user = await prisma.user.findFirst({
          where: {
            email: {
              equals: normalizedEmail,
              mode: "insensitive",
            },
          },
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        if (user.accountStatus !== "ACTIVE") {
          throw new Error(
            user.accountStatus === "DEACTIVATED"
              ? "Your account has been deactivated."
              : "Your account has been deleted."
          );
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        if (!user.emailVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        clearRateLimit(`login:email:${normalizedEmail}`);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          username: user.username,
          profileImageUrl: user.profileImageUrl,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.profileImageUrl = user.profileImageUrl;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        session.user.username = token.username as string;
        session.user.profileImageUrl =
          (token.profileImageUrl as string | null) ?? null;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
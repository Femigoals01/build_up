




// import NextAuth from "next-auth";
// import type { AuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";

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
//         if (!credentials?.email || !credentials.password) return null;

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user) return null;

//         const isValid = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );

//         if (!isValid) return null;

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
//         session.user.profileImageUrl = token.profileImageUrl as string | null;
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

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

      // async authorize(credentials) {
      //   if (!credentials?.email || !credentials.password) {
      //     throw new Error("Email and password are required");
      //   }

      //   const normalizedEmail = credentials.email.trim().toLowerCase();

      //   const user = await prisma.user.findUnique({
      //     where: { email: normalizedEmail },
      //   });

      //   if (!user) {
      //     throw new Error("Invalid email or password");
      //   }

      //   const isValid = await bcrypt.compare(
      //     credentials.password,
      //     user.password
      //   );

      //   if (!isValid) {
      //     throw new Error("Invalid email or password");
      //   }

      //   if (!user.emailVerified) {
      //     throw new Error("Please verify your email before logging in");
      //   }

      //   return {
      //     id: user.id,
      //     name: user.name,
      //     email: user.email,
      //     role: user.role,
      //     username: user.username,
      //     profileImageUrl: user.profileImageUrl,
      //   };
      // },



      async authorize(credentials) {
  if (!credentials?.email || !credentials.password) return null;

  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValid = await bcrypt.compare(
    credentials.password,
    user.password
  );

  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  // 🔥 ADD THIS BLOCK
  if (!user.emailVerified) {
    throw new Error("EMAIL_NOT_VERIFIED");
  }

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
        session.user.profileImageUrl = token.profileImageUrl as string | null;
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
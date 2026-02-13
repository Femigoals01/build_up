


// import { DefaultSession, DefaultUser } from "next-auth";

// /* ================= NEXT-AUTH ================= */

// declare module "next-auth" {
//   interface User extends DefaultUser {
//     id: string;
//     role: "VOLUNTEER" | "ORGANIZATION" | "MENTOR" | "ADMIN";
//     username: string;
//   }

//   interface Session extends DefaultSession {
//     user: {
//       id: string;
//       role: "VOLUNTEER" | "ORGANIZATION" | "MENTOR" | "ADMIN";
//       username: string;
//     } & DefaultSession["user"];
//   }
// }

// /* ================= JWT ================= */

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//     role: "VOLUNTEER" | "ORGANIZATION" | "MENTOR" | "ADMIN";
//     username: string;
//   }
// }


// import { DefaultSession, DefaultUser } from "next-auth";

// export type UserRole = "VOLUNTEER" | "ORGANIZATION" | "MENTOR" | "ADMIN";

// declare module "next-auth" {
//   interface User extends DefaultUser {
//     id: string;
//     role: UserRole;
//     username: string;
//   }

//   interface Session extends DefaultSession {
//     user: {
//       id: string;
//       role: UserRole;
//       username: string;
//     } & DefaultSession["user"];
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//     role: UserRole;
//     username: string;
//   }
// }



import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role: "VOLUNTEER" | "ORGANIZATION" | "MENTOR" | "ADMIN";
    username: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role: "VOLUNTEER" | "ORGANIZATION" | "MENTOR" | "ADMIN";
      username: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "VOLUNTEER" | "ORGANIZATION" | "MENTOR" | "ADMIN";
    username: string;
  }
}

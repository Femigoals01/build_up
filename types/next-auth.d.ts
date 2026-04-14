



import { DefaultSession, DefaultUser } from "next-auth";

type AppRole = "VOLUNTEER" | "ORGANIZATION" | "MENTOR" | "ADMIN";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role: AppRole;
    username: string;
    profileImageUrl?: string | null;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role: AppRole;
      username: string;
      profileImageUrl?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: AppRole;
    username: string;
    profileImageUrl?: string | null;
  }
}
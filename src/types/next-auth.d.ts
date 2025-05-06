import type { Session } from "next-auth";

declare module "next-auth" {

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    name: string;
    email: string;
    nickname: string;
    birthdate: string;
    description: string;
  }
}

// nextauth.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "../../../../libs/mysql";
import { compare } from "bcryptjs";
import { RowDataPacket } from "mysql2";
import { User } from "@/types/User";

const authOptions: NextAuthOptions = {

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const db = await connectDB();

        try {
          const [rows] = await db.query<RowDataPacket[]>(
            "SELECT * FROM user WHERE email = ?",
            [credentials.email]
          );

          if (!rows.length) {
            throw new Error("Incorrect credentials");
          }

          const user = rows[0];

          // Chequeo si el usuario está bloqueado
          if (user.blocked) {
            throw new Error("Your account has been blocked. Contact support.");
          }

          const isValidPassword = await compare(credentials.password, user.password);

          if (!isValidPassword) {
            throw new Error("Incorrect credentials");
          }

          return {
            id: user.id,
            nickname: user.nickName,
            name: user.name,
            email: user.email,
            role: user.role,
            birthdate: user.birthdate,
            description: user.description ?? "",
          };

        } finally {

        }
      },
    }),
  ],

  pages: {
    signIn: '/',
  },

  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.nickname = token.nickname as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.description = token.description as string;
        session.user.birthdate = token.birthdate as string;
      }

      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        const customUser = user as User;
        token.id = customUser.id;
        token.nickname = customUser.nickname;
        token.name = customUser.name;
        token.email = customUser.email;
        token.birthdate = customUser.birthdate;
        token.role = customUser.role;
        token.description = customUser.description ?? "";
      }
      return token;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };

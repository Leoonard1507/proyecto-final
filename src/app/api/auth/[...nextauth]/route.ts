// nextauth.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/libs/mysql";
import { compare } from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", required: true },
        password: { label: "Password", type: "password", required: true },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son obligatorios");
        }

        const db = await connectDB();

        try {
          const [users]: any = await db.query(
            "SELECT * FROM usuarios WHERE correo = ?",
            [credentials.email]
          );

          if (!users.length) {
            throw new Error("Credenciales incorrectas");
          }

          const user = users[0];

          const isValidPassword = await compare(credentials.password, user.contrasena);
          if (!isValidPassword) {
            throw new Error("Credenciales incorrectas");
          }

          // Retornar el usuario con su rol
          return {
            id: user.id,
            name: user.nombre,
            email: user.correo,
            role: user.rol,
          };

        } finally {
          await db.end();
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
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name; 
        token.email = user.email; 
        token.role = user.role;
      }
      return token;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
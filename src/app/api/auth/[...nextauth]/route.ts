// nextauth.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "../../../../libs/mysql";
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
            "SELECT * FROM user WHERE email = ?", 
            [credentials.email]
          );
          
          if (!users.length) {
            throw new Error("Credenciales incorrectas (usuario no encontrado)");
          }
          
          const user = users[0];
          
          const isValidPassword = await compare(credentials.password, user.password);
          
          if (!isValidPassword) {
            throw new Error("Credenciales incorrectas (contraseña)");
          }
          
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            description: user.description,
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
        token.name = user.name as string; 
        token.email = user.email as string; 
        token.role = user.role;
      }
      return token;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
// nextauth.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "../../../../libs/mysql";
import { compare } from "bcryptjs";
import { RowDataPacket } from "mysql2";
import { User } from "@/types/User";

// Configuración principal para NextAuth
const authOptions: NextAuthOptions = {

  // Proveedores de autenticación (en este caso solo Credenciales)
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", required: true },     // Campo para email
        password: { label: "Password", type: "password", required: true }, // Campo para contraseña
      },
      // Función que se ejecuta para validar las credenciales
      async authorize(credentials) {
        // Verifica que los campos email y password existan
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Conecta a la base de datos MySQL
        const db = await connectDB();

        try {
          // Consulta para obtener el usuario según el email
          const [rows] = await db.query<RowDataPacket[]>(
            "SELECT * FROM user WHERE email = ?",
            [credentials.email]
          );

          // Si no se encuentra ningún usuario con ese email, error
          if (!rows.length) {
            throw new Error("Incorrect credentials");
          }

          const user = rows[0];

          // Chequea si el usuario está bloqueado
          if (user.blocked) {
            throw new Error("Your account has been blocked. Contact support.");
          }

          // Compara la contraseña ingresada con la contraseña hasheada almacenada
          const isValidPassword = await compare(credentials.password, user.password);

          // Si la contraseña no es válida, lanza error
          if (!isValidPassword) {
            throw new Error("Incorrect credentials");
          }

          // Si todo está bien, retorna un objeto con la información que se guardará en la sesión
          return {
            id: user.id,
            nickname: user.nickName,
            name: user.name,
            email: user.email,
            role: user.role,
            birthdate: user.birthdate,
            description: user.description ?? "",
            avatar: user.avatar ?? "",
          };

        } finally {
          // No se necesita liberar recursos aquí ya que mysql2 maneja la conexión internamente
        }
      },
    }),
  ],

  // Página personalizada para el inicio de sesión (redirecciona al home '/')
  pages: {
    signIn: '/',
  },

  // Callbacks para manipular el token JWT y la sesión
  callbacks: {
    // Cuando se crea o actualiza la sesión, se añade información extra al objeto session.user
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.nickname = token.nickname as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.description = token.description as string;
        session.user.birthdate = token.birthdate as string;
        session.user.avatar = token.avatar as string;
      }

      return session;
    },

    // Cuando se genera el JWT, se añade información personalizada en el token
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
        token.avatar = customUser.avatar ?? "";
      }
      return token;
    },
  },

  // Secreto para encriptar el JWT y cookies, debe estar definido en variables de entorno
  secret: process.env.NEXTAUTH_SECRET,
};

// Exporta el handler para los métodos GET y POST de NextAuth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };

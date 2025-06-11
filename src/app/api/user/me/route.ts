// /api/user/me.ts
import { getServerSession } from "next-auth";
import { connectDB } from "@/libs/mysql";
import { authOptions } from "../../auth/[...nextauth]/route";
import { RowDataPacket } from "mysql2";

// Endpoint GET para obtener datos actualizados del usuario autenticado
export async function GET(req: Request) {
  // Obtener la sesión actual del usuario con NextAuth en el servidor
  const session = await getServerSession(authOptions);

  // Si no hay sesión o el usuario no está autenticado, devolver error 401
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Conectarse a la base de datos
  const db = await connectDB();

  // ✅ Especificamos que el resultado será un array de RowDataPacket
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT avatar, nickName FROM user WHERE email = ?",
    [session.user.email]
  );

  // ✅ TypeScript ahora reconoce .length porque rows es un array
  if (!rows.length) {
    return new Response("User not found", { status: 404 });
  }

  // Devolver los datos del usuario en formato JSON
  return Response.json(rows[0]); // Solo devuelve el primer resultado (debería ser único por email)
}

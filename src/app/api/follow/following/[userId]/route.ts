import { connectDB } from "@/libs/mysql";
import { NextResponse } from "next/server";

// Función que responde a la petición GET
export async function GET(_req: Request, context: { params: Promise<{ userId: string }> } | { params: { userId: string } }) {
  // `params` puede ser una promesa, por eso hacemos await para obtener el objeto
  const params = await context.params;
  // Extraemos userId de params
  const userId = params.userId;

  try {
    // Conectamos a la base de datos
    const db = await connectDB();

    // Ejecutamos la consulta para obtener los usuarios que sigue este usuario
    const [rows] = await db.execute(
      `SELECT u.id, u.name, u.nickName, u.avatar
       FROM follows f
       JOIN user u ON f.followed_id = u.id
       WHERE f.follower_id = ?`,
      [userId]
    );

    // Devolvemos los datos en formato JSON
    return NextResponse.json(rows);
  } catch (error) {
    // En caso de error, lo mostramos por consola y devolvemos un mensaje genérico al cliente
    console.error("Error getting following:", error);
    return NextResponse.json({ error: "Error getting following" }, { status: 500 });
  }
}

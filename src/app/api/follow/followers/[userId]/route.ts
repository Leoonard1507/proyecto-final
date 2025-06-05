import { connectDB } from "@/libs/mysql"; // Importa la función para conectar a la base de datos
import { NextResponse } from "next/server"; // Importa la respuesta de Next.js para APIs

// Función que maneja la petición GET para obtener los seguidores de un usuario
export async function GET(
  _req: Request, // Objeto Request (no se usa, por eso el guion bajo)
  context: { params: Promise<{ userId: string }> } | { params: { userId: string } } // Contexto que incluye los parámetros de la ruta (pueden ser una promesa o un objeto directo)
) {
  // Espera a que 'params' sea resuelto para obtener el objeto con userId
  const params = await context.params; 
  // Extrae userId de los parámetros de la ruta
  const userId = params.userId;

  try {
    // Conecta con la base de datos
    const db = await connectDB();

    // Ejecuta la consulta SQL para obtener los usuarios que siguen al usuario con 'userId'
    // Se usa JOIN para obtener datos del usuario que sigue (f.follower_id = u.id)
    // El WHERE filtra para obtener solo seguidores del usuario (f.followed_id = ?)
    const [rows] = await db.execute(
      `SELECT u.id, u.name, u.nickName, u.avatar
       FROM follows f
       JOIN user u ON f.follower_id = u.id
       WHERE f.followed_id = ?`,
      [userId]
    );

    // Devuelve la lista de seguidores en formato JSON
    return NextResponse.json(rows);
  } catch (error) {
    // En caso de error, lo registra en consola para debugging
    console.error("Error getting followers:", error);
    // Devuelve un error 500 con mensaje genérico al cliente
    return NextResponse.json({ error: "Error getting followers" }, { status: 500 });
  }
}

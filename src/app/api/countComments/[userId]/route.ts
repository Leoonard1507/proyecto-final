import { connectDB } from "@/libs/mysql";
import { NextResponse } from "next/server";

// Función que maneja la solicitud GET para obtener el número de comentarios de un usuario específico
export async function GET(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  // Extrae el userId de los parámetros de la ruta (await porque params es una Promise)
  const { userId } = await params;

  try {
    // Conecta a la base de datos MySQL
    const db = await connectDB();

    // Ejecuta la consulta para contar los comentarios del usuario
    // Se usa "COUNT(*) AS comments_count" para obtener la cantidad total de comentarios
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS comments_count FROM comments WHERE user_id = ?",
      [userId]
    );

    // Devuelve la respuesta JSON con los datos obtenidos de la consulta
    return NextResponse.json(rows);
  } catch (err) {
    // Si ocurre un error, lo imprime en consola y responde con un error 500 y mensaje
    console.error("Error al obtener los comentario:", err);
    return NextResponse.json({ error: "Error al obtener el comentario" }, { status: 500 });
  }
}

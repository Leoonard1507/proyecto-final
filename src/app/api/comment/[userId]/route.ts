import { connectDB } from "@/libs/mysql";
import { NextResponse } from "next/server";

// Método GET para obtener los comentarios de un usuario específico
export async function GET(req: Request, { params }: { params: { userId: string }}) {
  // Extraemos el userId de los parámetros de la ruta
  const { userId } = await params;

  try {
    // Conectamos a la base de datos
    const db = await connectDB();

    // Ejecutamos la consulta para obtener todos los comentarios del usuario dado
    const [rows] = await db.execute("SELECT * FROM comments WHERE user_id = ?", [userId]);

    // Devolvemos la respuesta en formato JSON con los comentarios encontrados
    return NextResponse.json(rows);
  } catch (err) {
    // Si ocurre un error, lo mostramos en consola
    console.error("Error getting comment:", err);

    // Respondemos con un error 500 y un mensaje genérico
    return NextResponse.json({ error: "Error getting comment" }, { status: 500 });
  }
}

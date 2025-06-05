import { connectDB } from "@/libs/mysql";
import { NextResponse } from "next/server";

// Función que maneja la solicitud GET para obtener la cantidad de entradas en el diario (movies_viewed) de un usuario
export async function GET(req: Request, { params }: { params: { userId: string } }) {
  // Extrae el userId de los parámetros de la ruta
  const { userId } = await params;

  try {
    // Establece conexión con la base de datos MySQL
    const db = await connectDB();

    // Ejecuta la consulta SQL para contar las entradas en la tabla movies_viewed para el usuario dado
    // Se usa "COUNT(*) AS diarys_count" para obtener el total de entradas
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS diarys_count FROM movies_viewed WHERE user_id = ?",
      [userId]
    );

    // Devuelve la respuesta JSON con el resultado de la consulta
    return NextResponse.json(rows);
  } catch (err) {
    // En caso de error, imprime el error en consola y responde con un JSON de error y estado 500
    console.error("Error getting diary:", err);
    return NextResponse.json({ error: "Error getting diary" }, { status: 500 });
  }
}

// app/api/watchlist/[userId]/route.ts
// Importamos la función para conectar a la base de datos MySQL y la respuesta de Next.js
import { connectDB } from "@/libs/mysql";
import { NextResponse } from "next/server";

// Función para manejar peticiones GET que recibe un userId como parámetro
export async function GET(req: Request, { params }: { params: { userId: string } }) {
  // Extraemos userId de los parámetros de la ruta
  const { userId } = await params;

  try {
    // Conectamos a la base de datos
    const db = await connectDB();

    // Ejecutamos consulta para contar cuántos usuarios sigue el usuario con userId
    const [rows] = await db.execute("SELECT COUNT(*) AS following_count FROM follows WHERE follower_id = ?", [userId]);

    // Devolvemos el resultado en formato JSON
    return NextResponse.json(rows);
  } catch (err) {
    // En caso de error, lo registramos y devolvemos un mensaje con status 500
    console.error("Error getting comment:", err);
    return NextResponse.json({ error: "Error getting comment" }, { status: 500 });
  }
}

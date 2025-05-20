import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/libs/mysql";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  // Verifica si el usuario está autenticado
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { movie_id, movie_title, poster_path, comentario } = await request.json();
  const user_id = session.user.id;

  // Validación de datos requeridos
  if (!movie_id || !movie_title || !comentario) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  try {
    const db = await connectDB();

    await db.execute(
      `INSERT INTO comments (user_id, movie_id, movie_title, poster_path, comentario)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, movie_id, movie_title, poster_path || null, comentario]
    );

    await db.end();

    return NextResponse.json({ message: "Comentario añadido correctamente" }, { status: 201 });
  } catch (error) {
    console.error("Error al insertar comentario:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/libs/mysql";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const {
    movie_id,
    movie_title,
    poster_path,
    comment_id = null,
    puntuacion_id = null
  } = await request.json();

  const user_id = session.user.id;

  if (!movie_id || !movie_title) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  try {
    const db = await connectDB();

    await db.execute(
      `INSERT INTO peliculas_vistas (user_id, movie_id, movie_title, poster_path, comment_id, puntuacion_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, movie_id, movie_title, poster_path || null, comment_id, puntuacion_id]
    );

    await db.end();

    return NextResponse.json({ message: "Vista registrada correctamente" }, { status: 201 });
  } catch (error) {
    console.error("Error al registrar vista:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

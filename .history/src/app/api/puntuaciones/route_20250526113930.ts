import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/libs/mysql";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { movie_id, movie_title, poster_path, puntuacion } = await request.json();
  const user_id = session.user.id;

  if (!movie_id || !movie_title || puntuacion == null) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  try {
    const db = await connectDB();

    // Insertar en la tabla puntuaciones
    const [result]: any = await db.execute(
      `INSERT INTO puntuaciones (user_id, movie_id, movie_title, poster_path, puntuacion)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, movie_id, movie_title, poster_path || null, puntuacion]
    );

    await db.end();

    return NextResponse.json({ insertId: result.insertId }, { status: 201 });
  } catch (error) {
    console.error("Error al insertar puntuación:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

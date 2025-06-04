import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/libs/mysql";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { movie_id, movie_title, poster_path, comentario } = await request.json();
  const user_id = session.user.id;

  if (!movie_id || !movie_title || !comentario) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  try {
    const db = await connectDB();

    // Ejecutamos el insert y capturamos el resultado
    const [result]: any = await db.execute(
      `INSERT INTO comments (user_id, movie_id, movie_title, poster_path, comentario)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, movie_id, movie_title, poster_path || null, comentario]
    );

    // Devolvemos el insertId para usarlo luego en otras tablas
    return NextResponse.json({ insertId: result.insertId }, { status: 201 });
  } catch (error) {
    console.error("Error al insertar comentario:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

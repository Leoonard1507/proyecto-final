import { NextResponse } from "next/server";
import { connectDB } from "../../../libs/mysql";

export async function POST(req: Request) {
  try {
    const db = await connectDB();

    // Obtener datos del cuerpo de la petición
    const { user_id, movie_id, movie_title, poster_path, comentario } = await req.json();

    // Validar campos obligatorios
    if (!user_id || !movie_id || !movie_title || !comentario) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Insertar el comentario en la base de datos
    await db.execute(
      `INSERT INTO comments (user_id, movie_id, movie_title, poster_path, comentario)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, movie_id, movie_title, poster_path || null, comentario]
    );

    return NextResponse.json({ message: "Comment added successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

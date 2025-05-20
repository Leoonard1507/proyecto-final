import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mysql";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const userId = params.id;
  try {
    const db = await connectDB();
    const [rows] = await db.query(
      "SELECT movie_id AS id, title, poster_path FROM favorite_movies WHERE user_id = ?",
      [userId]
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener favoritas:", error);
    return NextResponse.json({ message: "Error al obtener favoritas" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const userId = params.id;
  try {
    const { movie_id, title, poster_path } = await req.json();

    if (!movie_id || !title) {
      return NextResponse.json({ message: "Datos incompletos" }, { status: 400 });
    }

    const db = await connectDB();
    await db.query(
      "INSERT INTO favorite_movies (user_id, movie_id, title, poster_path) VALUES (?, ?, ?, ?)",
      [userId, movie_id, title, poster_path]
    );

    return NextResponse.json({ message: "Película añadida a favoritas" });
  } catch (error: any) {
    console.error("Error al añadir favorita:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ message: "Ya has añadido esta película" }, { status: 409 });
    }
    return NextResponse.json({ message: "Error al añadir favorita" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const userId = params.id;

  // Extraemos el parametro movie_id de la query string
  const { searchParams } = new URL(req.url);
  const movie_id = searchParams.get("movie_id");

  if (!movie_id) {
    return NextResponse.json({ message: "movie_id faltante" }, { status: 400 });
  }

  try {
    const db = await connectDB();
    await db.query(
      "DELETE FROM favorite_movies WHERE user_id = ? AND movie_id = ?",
      [userId, movie_id]
    );
    return NextResponse.json({ message: "Película eliminada de favoritas" });
  } catch (error) {
    console.error("Error al eliminar favorita:", error);
    return NextResponse.json({ message: "Error al eliminar favorita" }, { status: 500 });
  }
}

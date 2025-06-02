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
    console.error("Error getting favorites:", error);
    return NextResponse.json({ message: "Error getting favorites" }, { status: 500 });
  }
}


export async function POST(req: Request, { params }: { params: { id: string } }) {
  const userId = params.id;
  try {
    const { movie_id, title, poster_path } = await req.json();

    if (!movie_id || !title) {
      return NextResponse.json({ message: "Incomplete data" }, { status: 400 });
    }


    const db = await connectDB();
    await db.query(
      "INSERT INTO favorite_movies (user_id, movie_id, title, poster_path) VALUES (?, ?, ?, ?)",
      [userId, movie_id, title, poster_path]
    );

    return NextResponse.json({ message: "Movie added to favorites" });
  } catch (error: any) {
    console.error("Error adding favorite:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ message: "You have already added this movie" }, { status: 409 });
    }
    return NextResponse.json({ message: "Error adding favorite" }, { status: 500 });
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
    return NextResponse.json({ message: "Movie removed from favorites" });
  } catch (error) {
    console.error("Error deleting favorite:", error);
    return NextResponse.json({ message: "Error deleting favorite" }, { status: 500 });
  }
}

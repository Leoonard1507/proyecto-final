// Logica que inserta la pelicula en la watchlist del usuario

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/libs/mysql";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {movie_id, movie_title, poster_path } = await request.json();

  if (!movie_id || !movie_title || !poster_path) {
    return NextResponse.json({ error: "Incomplete data" }, { status: 400 });
  }

  const user_id = session.user.id;

  try {
    const db = await connectDB();

    await db.query(
      `INSERT INTO watchlist (user_id, movie_id, movie_title, poster_path)
       VALUES (?, ?, ?, ?)`,
      [user_id, movie_id, movie_title, poster_path]
    );

    await db.end();

    return NextResponse.json({ message: "Movie added to watchlist" });
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    return NextResponse.json({ error: "Error saving to database" }, { status: 500 });
  }
}

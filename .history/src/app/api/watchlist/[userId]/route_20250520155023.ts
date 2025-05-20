// app/api/watchlist/[userId]/route.ts
import { connectDB } from "@/libs/mysql";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: Promise<{ userId: string }> }) {
  const params = await context.params;  // await aquí
  const userId = params.userId;

  try {
    const db = await connectDB();
    const [rows] = await db.execute("SELECT movie_id, movie_title, poster_path FROM watchlist WHERE user_id = ?", [userId]);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Error al obtener la watchlist:", err);
    return NextResponse.json({ error: "Error al obtener la watchlist" }, { status: 500 });
  }
}


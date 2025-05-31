import { connectDB } from "@/libs/mysql";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, context: { params: { userId: string } }) {
  const { userId } = context.params;

  try {
    const db = await connectDB();
    const [rows]: any = await db.execute(
      "SELECT movie_id, movie_title, poster_path FROM watchlist WHERE user_id = ?",
      [userId]
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error("Error getting watchlist:", err);
    return NextResponse.json({ error: "Error getting watchlist" }, { status: 500 });
  }
}

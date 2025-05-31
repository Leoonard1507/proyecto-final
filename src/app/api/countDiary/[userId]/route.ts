// app/api/watchlist/[userId]/route.ts
import { connectDB } from "@/libs/mysql";
import { NextResponse } from "next/server";


export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const userId = params.userId;

  try {
    const db = await connectDB();
    const [rows] = await db.execute("SELECT COUNT(*) AS diarys_count FROM movies_viewed WHERE user_id = ?", [userId]);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Error getting diary:", err);
    return NextResponse.json({ error: "Error getting diary" }, { status: 500 });
  }
}

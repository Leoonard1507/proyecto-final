// app/api/watchlist/[userId]/route.ts
import { connectDB } from "@/libs/mysql";
import { NextResponse } from "next/server";


export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const { userId } = await params;

  try {
    const db = await connectDB();
    const [rows] = await db.execute("SELECT COUNT(*) AS followers_count FROM follows WHERE followed_id = ?", [userId]);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Error getting comment:", err);
    return NextResponse.json({ error: "Error getting comment" }, { status: 500 });
  }
}

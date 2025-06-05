import { connectDB } from "@/libs/mysql";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { userId: string } }) {
  const userId = params.userId;

  try {
    const db = await connectDB();
    const [rows] = await db.execute(
      `SELECT u.id, u.name, u.nickName, u.avatar
       FROM follows f
       JOIN user u ON f.followed_id = u.id
       WHERE f.follower_id = ?`,
      [userId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error getting following:", error);
    return NextResponse.json({ error: "Error getting following" }, { status: 500 });
  }
}

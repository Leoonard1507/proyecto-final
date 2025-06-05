import { connectDB } from "@/libs/mysql";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { userId: string } }) {
  const userId = params.userId;

  try {
    const db = await connectDB();
    const [rows] = await db.execute(
      `SELECT u.id, u.name, u.nickName, u.avatar
       FROM follows f
       JOIN user u ON f.follower_id = u.id
       WHERE f.followed_id = ?`,
      [userId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error getting followers:", error);
    return NextResponse.json({ error: "Error getting followers" }, { status: 500 });
  }
}

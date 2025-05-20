// app/api/watchlist/[userId]/route.ts
import { connectDB } from "@/libs/mysql";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const userId = params.userId;

  try {
    const db = await connectDB();
    const [rows] = await db.execute("SELECT * FROM comments WHERE user_id = ?", [userId]);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Error al obtener el comentario:", err);
    return NextResponse.json({ error: "Error al obtener el comentario" }, { status: 500 });
  }
}

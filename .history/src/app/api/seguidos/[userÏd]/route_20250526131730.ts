// app/api/watchlist/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server'; 
import { connectDB } from "@/libs/mysql";  
import { RowDataPacket } from 'mysql2';


export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const userId = params.userId;

  try {
    const db = await connectDB();
    const [rows] = await db.execute("SELECT COUNT(*) AS following_count FROM follows WHERE follower_id = ?", [userId]);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Error al obtener el comentario:", err);
    return NextResponse.json({ error: "Error al obtener el comentario" }, { status: 500 });
  }
}

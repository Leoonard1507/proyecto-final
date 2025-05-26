// app/api/puntuaciones/[userId]/route.ts
import { connectDB } from "@/libs/mysql";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const userId = params.userId;

  try {
    const db = await connectDB();
    const [rows] = await db.execute("SELECT * FROM puntuaciones WHERE user_id = ?", [userId]);
    await db.end();
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Error al obtener las puntuaciones:", err);
    return NextResponse.json({ error: "Error al obtener las puntuaciones" }, { status: 500 });
  }
}

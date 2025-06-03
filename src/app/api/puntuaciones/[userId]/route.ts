// /app/api/activity/user/[userId]/route.ts

import { connectDB } from '@/libs/mysql';
import { NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const userIdNum = Number(userId);

  if (isNaN(userIdNum)) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }

  try {
    const db = await connectDB();

    const [rows] = await db.execute(
      `SELECT 
        pv.user_id,
        u.nickName,
        pv.movie_id,
        pv.movie_title,
        pv.poster_path,
        p.puntuacion,
        c.comentario,
        pv.viewed_at
      FROM movies_viewed pv
      JOIN user u ON u.id = pv.user_id
      LEFT JOIN scores p ON pv.puntuacion_id = p.id
      LEFT JOIN comments c ON pv.comment_id = c.id
      WHERE pv.user_id = ?
      ORDER BY pv.viewed_at DESC
      LIMIT 20`,
      [userIdNum]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error getting user activity:", error);
    return NextResponse.json({ error: "Error getting activity" }, { status: 500 });
  }
}

// /app/api/activity/user/[userId]/route.ts

import { connectDB } from '@/libs/mysql';
import { NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: { userId: string } }) {
  const userIdNum = Number(params.userId);

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
      FROM peliculas_vistas pv
      JOIN user u ON u.id = pv.user_id
      LEFT JOIN puntuaciones p ON pv.puntuacion_id = p.id
      LEFT JOIN comments c ON pv.comment_id = c.id
      WHERE pv.user_id = ?
      ORDER BY pv.viewed_at DESC
      LIMIT 20`,
      [userIdNum]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener actividad del usuario:", error);
    return NextResponse.json({ error: "Error al obtener actividad" }, { status: 500 });
  }
}

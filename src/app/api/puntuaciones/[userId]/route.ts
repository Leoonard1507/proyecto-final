// /app/api/activity/user/[userId]/route.ts
// Este endpoint devuelve únicamente la actividad del usuario específico identificado por userId.

import { connectDB } from '@/libs/mysql';
import { NextResponse } from 'next/server';

export async function GET(_req: Request, { params }: { params: Promise<{ userId: string }> }) {
  // Extraemos el userId de los parámetros y lo convertimos a número
  const { userId } = await params;
  const userIdNum = Number(userId);

  // Validamos que userId sea un número válido, si no respondemos con error 400
  if (isNaN(userIdNum)) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }

  try {
    // Conectamos a la base de datos
    const db = await connectDB();

    // Ejecutamos la consulta para obtener la actividad del usuario específico,
    // incluyendo detalles de la película, puntuación y comentario
    const [rows] = await db.execute(
      `SELECT 
        pv.id,
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

    // Retornamos la actividad en formato JSON
    return NextResponse.json(rows);
  } catch (error) {
    // Si ocurre un error, lo registramos y respondemos con error 500
    console.error("Error getting user activity:", error);
    return NextResponse.json({ error: "Error getting activity" }, { status: 500 });
  }
}

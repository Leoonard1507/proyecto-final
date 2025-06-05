// Este endpoint devuelve la actividad de los amigos (a los que sigue el usuario con userId), opcionalmente filtrada por una película concreta.

import { connectDB } from '@/libs/mysql';
import { NextResponse } from 'next/server';

export async function GET(req: Request, context: { params: Promise<{ userId: string }> }) {
  // Extraemos el userId de los parámetros y lo convertimos a número
  const { userId } = await context.params;
  const userIdNum = Number(userId);

  // Obtenemos los parámetros de consulta (query params) de la URL
  const { searchParams } = new URL(req.url);
  // Buscamos si existe el parámetro "movieId" para filtrar por película
  const movieIdParam = searchParams.get("movieId");

  // Validamos que userId sea un número válido, si no respondemos con error 400
  if (isNaN(userIdNum)) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }

  try {
    // Conectamos a la base de datos
    const db = await connectDB();

    // Consulta base para obtener la actividad de los usuarios que sigue el usuario dado
    const baseQuery = `
  SELECT 
    pv.id,
    pv.user_id,
    u.nickName,
    u.avatar as avatar,
    pv.movie_id,
    pv.movie_title,
    pv.poster_path,
    p.puntuacion,
    c.comentario,
    pv.comment_id,      
    pv.viewed_at
  FROM movies_viewed pv
  JOIN follows f ON f.followed_id = pv.user_id
  JOIN user u ON u.id = pv.user_id
  LEFT JOIN scores p ON pv.puntuacion_id = p.id
  LEFT JOIN comments c ON pv.comment_id = c.id
  WHERE f.follower_id = ?
`;

    // Ejecutamos la consulta con o sin filtro de movieId, ordenando por fecha y limitando resultados a 20
    const [rows] = await db.execute(
      movieIdParam
        ? `${baseQuery} AND pv.movie_id = ? ORDER BY pv.viewed_at DESC LIMIT 20`
        : `${baseQuery} ORDER BY pv.viewed_at DESC LIMIT 20`,
      movieIdParam ? [userIdNum, Number(movieIdParam)] : [userIdNum]
    );

    // Respondemos con los resultados obtenidos en formato JSON
    return NextResponse.json(rows);
  } catch (error) {
    // Si ocurre un error, lo registramos y respondemos con error 500
    console.error("Error getting activity from following:", error);
    return NextResponse.json({ error: "Error getting activity" }, { status: 500 });
  }
}

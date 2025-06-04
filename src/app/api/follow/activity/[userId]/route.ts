import { connectDB } from '@/libs/mysql';
import { NextResponse } from 'next/server';

export async function GET(req: Request, context: { params: Promise<{ userId: string }> }) {
  const { userId } = await context.params;
  const userIdNum = Number(userId);

  const { searchParams } = new URL(req.url);
  const movieIdParam = searchParams.get("movieId");

  if (isNaN(userIdNum)) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }

  try {
    const db = await connectDB();

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


    const [rows] = await db.execute(
      movieIdParam
        ? `${baseQuery} AND pv.movie_id = ? ORDER BY pv.viewed_at DESC LIMIT 20`
        : `${baseQuery} ORDER BY pv.viewed_at DESC LIMIT 20`,
      movieIdParam ? [userIdNum, Number(movieIdParam)] : [userIdNum]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error getting activity from following:", error);
    return NextResponse.json({ error: "Error getting activity" }, { status: 500 });
  }
}

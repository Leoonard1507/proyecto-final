// app/api/movie-watchlist-friends/[userId]/[movieId]/route.ts

import { connectDB } from '@/libs/mysql';
import { NextResponse } from 'next/server';

export async function GET(_req: Request, context: { params: Promise<{ userId: string; movieId: string }> }) {
  const { userId, movieId } = await context.params;
  const userIdNum = Number(userId);
  const movieIdNum = Number(movieId);

  if (isNaN(userIdNum) || isNaN(movieIdNum)) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  }

  try {
    const db = await connectDB();

    const [rows] = await db.execute(
      `
      SELECT 
        u.id AS user_id,
        u.nickName,
        u.avatar
      FROM watchlist w
      JOIN follows f ON f.followed_id = w.user_id
      JOIN user u ON u.id = w.user_id
      WHERE f.follower_id = ? AND w.movie_id = ?
      `,
      [userIdNum, movieIdNum]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error getting friends with movie in watchlist:", error);
    return NextResponse.json(
      { error: "Error getting data" },
      { status: 500 }
    );
  }
}

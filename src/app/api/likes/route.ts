// /app/api/likes/[commentId]/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mysql";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request, { params }: { params: { commentId: string } }) {
  const commentIdNum = Number(params.commentId);
  if (isNaN(commentIdNum)) {
    return NextResponse.json({ error: "Invalid commentId" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = Number(session.user.id);

  try {
    const db = await connectDB();

    // Contar likes totales para ese comment_id
    const [likesCountRows] = await db.execute(
      `SELECT COUNT(*) AS totalLikes FROM likes WHERE comment_id = ?`,
      [commentIdNum]
    );

    // Verificar si el usuario ya dio like a ese comment_id
    const [userLikeRows] = await db.execute(
      `SELECT 1 FROM likes WHERE comment_id = ? AND user_id = ? LIMIT 1`,
      [commentIdNum, userId]
    );

    const totalLikes = (likesCountRows as any)[0].totalLikes || 0;
    const likedByUser = (userLikeRows as any).length > 0;

    return NextResponse.json({ totalLikes, likedByUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching likes" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { commentId: string } }) {
  const commentIdNum = Number(params.commentId);
  if (isNaN(commentIdNum)) {
    return NextResponse.json({ error: "Invalid commentId" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = Number(session.user.id);

  try {
    const db = await connectDB();

    // Insertar like, IGNORE para no duplicar por UNIQUE
    await db.execute(
      `INSERT IGNORE INTO likes (user_id, comment_id) VALUES (?, ?)`,
      [userId, commentIdNum]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error liking comment" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { commentId: string } }) {
  const commentIdNum = Number(params.commentId);
  if (isNaN(commentIdNum)) {
    return NextResponse.json({ error: "Invalid commentId" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = Number(session.user.id);

  try {
    const db = await connectDB();

    await db.execute(
      `DELETE FROM likes WHERE user_id = ? AND comment_id = ?`,
      [userId, commentIdNum]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error unliking comment" }, { status: 500 });
  }
}

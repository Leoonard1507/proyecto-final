import { connectDB } from "@/libs/mysql";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: Request, { params }: { params: { commentId: string } }) {
    const commentId = Number(params.commentId);
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
  
    const db = await connectDB();
  
    const [rows] = await db.query("SELECT COUNT(*) AS count FROM likes WHERE comment_id = ?", [commentId]);
    const [likedRows] = userId
      ? await db.query("SELECT 1 FROM likes WHERE comment_id = ? AND user_id = ?", [commentId, userId])
      : [[]];
  
    const count = (rows as any)[0].count;
    const hasLiked = (likedRows as any).length > 0;
  
    return NextResponse.json({ count, hasLiked });
  }
  
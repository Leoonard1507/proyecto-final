// Endpoints para seguir y dejar de seguir a un usuario

// app/api/follow/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "@/libs/mysql";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { followedId } = await request.json();
  const followerId = session.user.id;

  try {
    const db = await connectDB();
    await db.execute("INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)", [followerId, followedId]);
    return NextResponse.json({ message: "Followed user" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error following user" }, { status: 500 });
  }
}
export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
    const { followedId } = await request.json();
    const followerId = session.user.id;
  
    try {
      const db = await connectDB();
      await db.execute("DELETE FROM follows WHERE follower_id = ? AND followed_id = ?", [followerId, followedId]);
      return NextResponse.json({ message: "User unfollowed" });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Error when unfollowing user" }, { status: 500 });
    }
  }
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
    const { searchParams } = new URL(req.url);
    const followedId = searchParams.get("followedId");
    const followerId = session.user.id;
  
    if (!followedId) return NextResponse.json({ error: "Missing followed parameter" }, { status: 400 });
  
    try {
      const db = await connectDB();
      const [rows] = await db.execute(
        "SELECT * FROM follows WHERE follower_id = ? AND followed_id = ?",
        [followerId, followedId]
      );
  
      const isFollowing = Array.isArray(rows) && rows.length > 0;
      return NextResponse.json({ isFollowing });
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Error checking tracking" }, { status: 500 });
    }
  }
  
  
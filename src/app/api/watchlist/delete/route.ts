import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/libs/mysql";

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { movieId } = await request.json();
  const userId = session.user.id;

  try {
    const db = await connectDB();

    await db.query(
      "DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?",
      [userId, movieId]
    );

    await db.end();

    return NextResponse.json({ message: "Movie removed from watchlist" });
  } catch (error) {
    console.error("Error deleting from watchlist:", error);
    return NextResponse.json({ error: "Error deleting" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/libs/mysql";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { movie_id, movie_title, poster_path, puntuacion } = await request.json();
  const user_id = session.user.id;

  if (
    !movie_id ||
    !movie_title ||
    typeof puntuacion !== "number" ||
    puntuacion < 1 ||
    puntuacion > 10
  ) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  try {
    const db = await connectDB();

    // Insert y resultado para obtener insertId
    const [result]: any = await db.execute(
      `INSERT INTO scores (user_id, movie_id, movie_title, poster_path, puntuacion)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, movie_id, movie_title, poster_path || null, puntuacion]
    );

    return NextResponse.json({ insertId: result.insertId }, { status: 201 });
  } catch (error) {
    console.error("Error inserting punctuation:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

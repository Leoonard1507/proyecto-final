import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/libs/mysql";

export async function POST(request: Request) {
  // Obtener la sesión del usuario para validar autenticación
  const session = await getServerSession(authOptions);

  // Si no hay sesión o no tiene id, responder con error 401 (no autorizado)
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extraer datos enviados en el body de la petición
  const { movie_id, movie_title, poster_path, puntuacion } = await request.json();
  const user_id = session.user.id;

  // Validar campos requeridos y rango de puntuación válido (1-10)
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
    // Conectar a la base de datos
    const db = await connectDB();

    // Insertar la puntuación en la tabla scores
    // poster_path puede ser null si no está definido
    const [result]: any = await db.execute(
      `INSERT INTO scores (user_id, movie_id, movie_title, poster_path, puntuacion)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, movie_id, movie_title, poster_path || null, puntuacion]
    );

    // Retornar el id generado por la inserción con status 201 (creado)
    return NextResponse.json({ insertId: result.insertId }, { status: 201 });
  } catch (error) {
    // Registrar error en consola y responder con error 500 (servidor)
    console.error("Error inserting punctuation:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

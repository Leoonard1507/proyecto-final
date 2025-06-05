import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/libs/mysql";

// Manejador de solicitudes POST para insertar un nuevo comentario en la base de datos
export async function POST(request: Request) {
  // Obtenemos la sesión del usuario autenticado
  const session = await getServerSession(authOptions);

  // Verificamos que el usuario esté autenticado
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Extraemos los datos enviados en el cuerpo de la solicitud
  const { movie_id, movie_title, poster_path, comentario } = await request.json();
  const user_id = session.user.id;

  // Validamos que los campos obligatorios estén presentes
  if (!movie_id || !movie_title || !comentario) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  try {
    // Conectamos a la base de datos
    const db = await connectDB();

    // Ejecutamos el INSERT en la tabla `comments` y capturamos el resultado
    const [result]: any = await db.execute(
      `INSERT INTO comments (user_id, movie_id, movie_title, poster_path, comentario)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, movie_id, movie_title, poster_path || null, comentario]
    );

    // Devolvemos el ID del nuevo comentario insertado
    return NextResponse.json({ insertId: result.insertId }, { status: 201 });
  } catch (error) {
    // Manejamos cualquier error del servidor
    console.error("Error al insertar comentario:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

// Importamos NextResponse para responder a las peticiones, getServerSession para obtener sesión actual, authOptions para la configuración de autenticación y connectDB para conectar a la base de datos
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/libs/mysql";

// Función para manejar la petición POST que registra una película vista por el usuario
export async function POST(request: Request) {
  // Obtenemos la sesión del usuario actual
  const session = await getServerSession(authOptions);

  // Si no hay sesión o no hay usuario autenticado, retornamos error 401 Unauthorized
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extraemos los datos enviados en el body de la petición
  const {
    movie_id,
    movie_title,
    poster_path,
    comment_id = null,
    puntuacion_id = null
  } = await request.json();

  // Obtenemos el id del usuario autenticado
  const user_id = session.user.id;

  // Validamos que movie_id y movie_title estén presentes, si no, devolvemos error 400
  if (!movie_id || !movie_title) {
    return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
  }

  try {
    // Conectamos a la base de datos
    const db = await connectDB();

    // Insertamos el registro de la película vista junto con sus detalles en la tabla movies_viewed
    await db.execute(
      `INSERT INTO movies_viewed (user_id, movie_id, movie_title, poster_path, comment_id, puntuacion_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, movie_id, movie_title, poster_path || null, comment_id, puntuacion_id]
    );

    // Retornamos respuesta exitosa con status 201
    return NextResponse.json({ message: "View registered successfully" }, { status: 201 });
  } catch (error) {
    // Si ocurre un error, lo registramos y retornamos error 500
    console.error("Error registering view:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

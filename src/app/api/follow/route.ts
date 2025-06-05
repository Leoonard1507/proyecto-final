// Endpoints para seguir y dejar de seguir a un usuario

// app/api/follow/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "@/libs/mysql";

// Endpoint POST para seguir a un usuario
export async function POST(request: Request) {
  // Obtiene la sesión del usuario autenticado
  const session = await getServerSession(authOptions);
  // Si no hay sesión o usuario, responde con error 401 (no autorizado)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Extrae el id del usuario a seguir desde el cuerpo de la solicitud
  const { followedId } = await request.json();
  // El id del seguidor es el usuario autenticado
  const followerId = session.user.id;

  try {
    // Conecta a la base de datos
    const db = await connectDB();
    // Inserta un nuevo registro en la tabla follows para registrar el seguimiento
    await db.execute("INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)", [followerId, followedId]);
    // Retorna mensaje de éxito
    return NextResponse.json({ message: "Followed user" });
  } catch (err) {
    // En caso de error, lo imprime en consola y responde con error 500
    console.error(err);
    return NextResponse.json({ error: "Error following user" }, { status: 500 });
  }
}

// Endpoint DELETE para dejar de seguir a un usuario
export async function DELETE(request: Request) {
  // Obtiene la sesión del usuario autenticado
  const session = await getServerSession(authOptions);
  // Si no hay sesión o usuario, responde con error 401 (no autorizado)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Extrae el id del usuario a dejar de seguir desde el cuerpo de la solicitud
  const { followedId } = await request.json();
  // El id del seguidor es el usuario autenticado
  const followerId = session.user.id;

  try {
    // Conecta a la base de datos
    const db = await connectDB();
    // Elimina el registro de seguimiento entre follower y followed
    await db.execute("DELETE FROM follows WHERE follower_id = ? AND followed_id = ?", [followerId, followedId]);
    // Retorna mensaje de éxito
    return NextResponse.json({ message: "User unfollowed" });
  } catch (err) {
    // En caso de error, lo imprime en consola y responde con error 500
    console.error(err);
    return NextResponse.json({ error: "Error when unfollowing user" }, { status: 500 });
  }
}

// Endpoint GET para verificar si el usuario autenticado sigue a otro usuario
export async function GET(req: Request) {
  // Obtiene la sesión del usuario autenticado
  const session = await getServerSession(authOptions);
  // Si no hay sesión o usuario, responde con error 401 (no autorizado)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Obtiene los parámetros de consulta de la URL
  const { searchParams } = new URL(req.url);
  // Extrae el id del usuario seguido del parámetro "followedId"
  const followedId = searchParams.get("followedId");
  // Id del usuario que realiza la consulta (seguidor)
  const followerId = session.user.id;

  // Si no se envía el parámetro seguido, responde con error 400
  if (!followedId) return NextResponse.json({ error: "Missing followed parameter" }, { status: 400 });

  try {
    // Conecta a la base de datos
    const db = await connectDB();
    // Consulta si existe el registro de seguimiento entre follower y followed
    const [rows] = await db.execute(
      "SELECT * FROM follows WHERE follower_id = ? AND followed_id = ?",
      [followerId, followedId]
    );

    // Determina si el usuario está siguiendo (true si hay al menos un registro)
    const isFollowing = Array.isArray(rows) && rows.length > 0;
    // Retorna el estado de seguimiento
    return NextResponse.json({ isFollowing });
  } catch (err) {
    // En caso de error, lo imprime en consola y responde con error 500
    console.error(err);
    return NextResponse.json({ error: "Error checking tracking" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mysql";
import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2/promise";

export async function POST(req: Request) {
  let message = "";
  const db = await connectDB();
  const {
    nickname,
    email,
    name,
    description,
    avatar,
    currentPassword,
    newPassword,
  } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is mandatory" }, { status: 400 });
  }

  // Actualizar perfil
  await db.query(
    "UPDATE user SET nickName = ?, name = ?, description = ?, avatar = ? WHERE email = ?",
    [nickname, name, description, avatar, email]
  );

  message = "Profile updated successfully";

  // Si se proporciona cambio de contraseña
  if (currentPassword && newPassword) {
    type UserRow = { password: string } & RowDataPacket;
    const result = await db.query("SELECT password FROM user WHERE email = ?", [email]);
    const rows = result[0] as UserRow[];

    if (!rows.length) {
      await db.end();
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, rows[0].password);
    if (!passwordMatch) {
      await db.end();
      return NextResponse.json({ message: "The current password is incorrect" }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE user SET password = ? WHERE email = ?", [hashedPassword, email]);
    message = "Password updated successfully";
  }

  /*
  // FAVORITE MOVIES

  if (!Array.isArray(favoriteMovies)) {
    console.log("favoriteMovies no es un array:", favoriteMovies);
  }
  
  if (Array.isArray(favoriteMovies)) {
    const limitedFavorites = favoriteMovies.slice(0, 5); // máximo 5
    // Obtener user_id
    const [userRows] = await db.query("SELECT id FROM user WHERE email = ?", [email]);
    const user = (userRows as RowDataPacket[])[0];
    const userId = user?.id;

    if (userId) {
      // Eliminar anteriores
      await db.query("DELETE FROM favorite_movies WHERE user_id = ?", [userId]);

      if (limitedFavorites.length > 0) {

        console.log("Películas recibidas:", favoriteMovies);

        // Insertar nuevas
        const values = limitedFavorites.map(
          ({ id, title, poster_path }) => [userId, id, title, poster_path ?? null]
        );

        console.log("Valores a insertar:", values);

        await db.query(
          "INSERT INTO favorite_movies (user_id, movie_id, title, poster_path) VALUES ?",
          [values]
        );
      }
    }
  }*/

  await db.end();
  return NextResponse.json({ message });
}

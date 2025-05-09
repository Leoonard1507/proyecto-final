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
    return NextResponse.json({ error: "El correo es obligatorio" }, { status: 400 });
  }

  // Actualizar perfil (siempre se actualiza el resto)
  await db.query(
    "UPDATE user SET nickName = ?, name = ?, description = ?, avatar = ? WHERE email = ?",
    [nickname, name, description, avatar, email]
  );

  message = "Perfil actualizado correctamente";

  // Si se proporciona cambio de contraseña, se procede a validarlo y actualizarlo
  if (currentPassword && newPassword) {
    type UserRow = { password: string } & RowDataPacket;

    const result = await db.query("SELECT password FROM user WHERE email = ?", [email]);
    const rows = result[0] as UserRow[];

    if (!rows.length) {
      await db.end();
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, rows[0].password);

    if (!passwordMatch) {
      await db.end();
      return NextResponse.json({ message: "La contraseña actual es incorrecta" }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE user SET password = ? WHERE email = ?", [hashedPassword, email]);

    message = "Contraseña actualizada correctamente";
  }

  await db.end();
  return NextResponse.json({ message });
}

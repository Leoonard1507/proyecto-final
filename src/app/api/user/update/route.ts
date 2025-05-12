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

  // Actualizar perfil (siempre se actualiza el resto)
  await db.query(
    "UPDATE user SET nickName = ?, name = ?, description = ?, avatar = ? WHERE email = ?",
    [nickname, name, description, avatar, email]
  );

  message = "Profile updated successfully";

  // Si se proporciona cambio de contraseña, se procede a validarlo y actualizarlo
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

  await db.end();
  return NextResponse.json({ message });
}

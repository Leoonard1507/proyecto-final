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
    const [existingUser] = await db.query(
      "SELECT email FROM user WHERE nickName = ? AND email != ?",
      [nickname, email]
    ) as any[];

    if (existingUser.length) {
      return NextResponse.json(
        { error: "El nombre de usuario ya está en uso." },
        { status: 400 }
      );
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
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, rows[0].password);
    if (!passwordMatch) {
      return NextResponse.json({ message: "The current password is incorrect" }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE user SET password = ? WHERE email = ?", [hashedPassword, email]);
    message = "Password updated successfully";
  }

  return NextResponse.json({ message });
}

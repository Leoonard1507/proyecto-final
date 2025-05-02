import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mysql"; 

//ACTUALIZAR DATOS DEL PERFIL
export async function POST(req: Request) {

  const db = await connectDB();

    const { nickname, email, name, description } = await req.json();
    if (!email) return NextResponse.json({ error: "El correo es obligatorio" }, { status: 400 });

    await db.query("UPDATE user SET nickName = ?, name = ?, description = ? WHERE email = ?", 
    [nickname, name, description, email]);

    await db.end();
    return NextResponse.json({ message: "Perfil actualizado correctamente" });
}
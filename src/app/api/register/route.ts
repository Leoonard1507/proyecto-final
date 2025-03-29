import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/libs/mysql"; 

//CONEXION A BASE DE DATOS
const db = await connectDB();

//REGISTRAR UN NUEVO USUARIO
export async function POST(req: Request) {
  try {
    const { name, usermail, password, role } = await req.json();

    if (!name || !usermail || !password || !role) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario en la BD
    const [result] = await db.execute(
      "INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)",
      [name, usermail, hashedPassword, role]
    );

    return NextResponse.json({ message: "Usuario registrado con éxito" }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}

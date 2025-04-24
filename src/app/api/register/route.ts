import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../libs/mysql";

// REGISTRAR UN NUEVO USUARIO
export async function POST(req: Request) {
  try {
    // Primero, conecta a la base de datos dentro de la función asincrónica
    const db = await connectDB();

    // Obtiene los datos del cuerpo de la solicitud
    const { username, usermail, password} = await req.json();

    // Verifica que los campos obligatorios estén presentes
    if (!username || !usermail || !password) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    // Si no se proporciona el campo 'role', se establece por defecto a 'client'
    const userRole = 'client';

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos, usando el 'role' con valor por defecto
    await db.execute(
      "INSERT INTO user (name, email, role, password) VALUES (?, ?, ?, ?)",
      [username, usermail, userRole, hashedPassword] // Aquí pasamos `userRole` que tiene el valor por defecto
    );

    // Responder con éxito
    return NextResponse.json({ message: "Usuario registrado con éxito" }, { status: 201 });
  } catch (error) {
    console.error("Error en el registro de usuario:", error);
    // Manejo de errores
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}

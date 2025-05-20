import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../libs/mysql";

interface DatabaseError extends Error {
  code?: string;
}

// Registrar un nuevo usuario
export async function POST(req: Request) {
  try {
    // Primero, conecta a la base de datos dentro de la función asincrónica
    const db = await connectDB();

    // Obtiene los datos del cuerpo de la solicitud
    const { username, nickname, birthdate, usermail, password} = await req.json();

    // Verifica que los campos obligatorios estén presentes
    if (!username || !nickname || !birthdate || !usermail || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Si no se proporciona el campo 'role', se establece por defecto a 'client'
    const userRole = 'client';

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos, usando el 'role' con valor por defecto
    await db.execute(
      "INSERT INTO user (nickname, name, birthdate, email, role, password) VALUES (?, ?, ?, ?, ?, ?)",
      [nickname, username, birthdate, usermail, userRole, hashedPassword]
    );

    // Responder con éxito
    return NextResponse.json({ message: "Successfully registered user" }, { status: 201 });
  } catch (error) {

    // Validar que error es un objeto con propiedad 'code'
    if (error && (error as DatabaseError).code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: "The email or nickname is already in use" }, { status: 409 });
    }
    
    console.error("User registration error:", error);
    // Manejo de errores
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { connectDB } from "@/libs/mysql";
import { NextRequest, NextResponse } from "next/server";

// Define una función asíncrona que maneja solicitudes DELETE a /api/user/[id]
export async function DELETE(
  request: NextRequest, // Objeto que representa la solicitud HTTP
  context: { params: { id: string } } // Extrae el parámetro dinámico 'id' de la URL
) {
  // Guarda el ID del usuario obtenido desde la ruta dinámica en una variable
  const params = await context.params;
  const userId = params.id;

  try {
    // Intenta conectar a la base de datos
    const db = await connectDB();

    // Ejecuta una consulta SQL para eliminar al usuario con el ID proporcionado
    await db.execute('DELETE FROM user WHERE id = ?', [userId]);

    // Si la operación fue exitosa, devuelve una respuesta JSON de éxito
    return NextResponse.json({ message: 'Successfully deleted user' });
  } catch (error) {
    // Si ocurre un error, lo muestra en la consola
    console.error('Error deleting user:', error);

    // Devuelve una respuesta JSON con mensaje de error y código 500 (error del servidor)
    return NextResponse.json(
      { error: 'Error deleting user' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server'; 
import { connectDB } from "@/libs/mysql";  
import { RowDataPacket } from 'mysql2';

// Exporta un manejador específico para GET
export async function GET(req: NextRequest) {
  // Accede a los parámetros de la ruta
  const pathname = req.nextUrl.pathname;
  const id = pathname.split('/').pop();  // Obtén el id de la ruta dinámica

  // Verifica si el id es válido
  if (!id || Array.isArray(id)) {
    return NextResponse.json({ message: "ID inválido" }, { status: 400 });
  }

  try {
    // Establece la conexión con la base de datos
    const db = await connectDB();

    // Realiza la consulta a la base de datos utilizando el id
    const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM user WHERE id = ?", [id]);

    // Si no se encuentra el usuario
    if (rows.length === 0) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    // Devuelve el usuario encontrado
    const user = rows[0];

    // Formatea la fecha en formato dd/mm/yyyy si existe
    if (user.birthdate) {
      const date = new Date(user.birthdate);
      user.birthdate = date.toLocaleDateString('es-ES'); // Formato europeo: dd/mm/yyyy
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error al conectar con la BBDD o al consultar:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}

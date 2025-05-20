//logica que inserta el comentario

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/libs/mysql";

// POST /api/comment/[id]
export async function POST(request: Request, { params }: { params: { id: string } }) {
    return NextResponse.json({ message: `Ruta recibida para id: ${params.id}` });
}

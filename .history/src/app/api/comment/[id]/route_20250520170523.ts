//logica que inserta el comentario

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/libs/mysql";

// POST /api/comment/[id]
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const movie_id = parseInt(params.id, 10);
  console.log(movie_id);
}

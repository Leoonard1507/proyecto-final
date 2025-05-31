import { NextRequest, NextResponse } from 'next/server'; 
import { connectDB } from "@/libs/mysql";  
import { RowDataPacket } from 'mysql2';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const nickname = searchParams.get('nickname') || '';

  if (!nickname) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const db = await connectDB();
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id, nickName, avatar FROM user WHERE nickName LIKE ? LIMIT 50",
      [`%${nickname}%`]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error connecting to or querying the database:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

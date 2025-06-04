// app/api/user/block/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/libs/mysql';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ message: 'Missing userId' }, { status: 400 });
    }

    const pool = await connectDB();
    const [rows] = await pool.query('SELECT blocked FROM user WHERE id = ?', [userId]);

    if ((rows as any).length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const currentBlocked = (rows as any)[0].blocked;
    const newBlocked = currentBlocked ? 0 : 1;

    await pool.query('UPDATE user SET blocked = ? WHERE id = ?', [newBlocked, userId]);

    return NextResponse.json({ blocked: Boolean(newBlocked) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}

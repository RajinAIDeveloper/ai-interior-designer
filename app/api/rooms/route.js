import { db } from '../../../config/db';
import { AiGeneratedImage } from '../../../config/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const roomList = await db
      .select()
      .from(AiGeneratedImage)
      .where(eq(AiGeneratedImage.userEmail, email));
    
    return NextResponse.json(roomList);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}
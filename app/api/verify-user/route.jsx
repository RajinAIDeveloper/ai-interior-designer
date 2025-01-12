// app/api/verify-user/route.js
import { NextResponse } from "next/server";
import { db } from '../../../config/db';
import { eq } from "drizzle-orm";
import { Users_schema } from '../../../config/schema';

export async function POST(req) {
  try {
    const { user } = await req.json();
    
    // Extract email from Clerk user object
    const userEmail = user?.primaryEmailAddress?.emailAddress || user?.email;

    // Validate user data
    if (!userEmail) {
      console.error('Invalid user email:', userEmail);
      return NextResponse.json(
        { error: 'Invalid user email' },
        { status: 400 }
      );
    }

    // Query for existing user
    const userInfo = await db
      .select()
      .from(Users_schema)
      .where(eq(Users_schema.email, userEmail))
      .execute();

    console.log('Query result:', userInfo);

    // Check if user exists
    if (!userInfo || userInfo.length === 0) {
      console.log('User not found:', userEmail);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // User found
    console.log('User found:', userInfo[0]);
    return NextResponse.json(
      { 
        result: userInfo[0],
        status: 'success' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in verify-user:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
// app/api/add-user-to-db/route.js
import { NextResponse } from "next/server";
import { db } from '../../../config/db';
import { Users_schema } from '../../../config/schema';

export async function POST(req) {
  try {
    const { user } = await req.json();

    // Validate required fields
    if (!user?.email || !user?.name) {
      return NextResponse.json(
        { error: 'Missing required user information' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = {
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl || null,
      credits: 0 // Initialize with 0 credits
    };

    const SaveResult = await db
      .insert(Users_schema)
      .values(newUser)
      .returning();

    if (!SaveResult || SaveResult.length === 0) {
      throw new Error('Failed to create user');
    }

    return NextResponse.json(
      { result: SaveResult[0] },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error in add-user-to-db:', error);
    
    // Check for unique constraint violation
    if (error.code === '23505') { // PostgreSQL unique violation code
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
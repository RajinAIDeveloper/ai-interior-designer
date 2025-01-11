// app/api/deduct-credits/route.js
import { NextResponse } from "next/server";
import { db } from "../../../config/db";
import { eq } from 'drizzle-orm';
import { Users_schema } from "../../../config/schema";

export async function POST(req) {
  try {
    const { userId, currentCredits } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (currentCredits <= 0) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 400 }
      );
    }

    // Update user's credits in the database
    const result = await db
      .update(Users_schema)
      .set({
        credits: currentCredits - 1
      })
      .where(eq(Users_schema.id, userId))
      .returning();

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "User not found or update failed" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      updatedCredits: result[0].credits
    });

  } catch (error) {
    console.error("Error updating credits:", error);
    return NextResponse.json(
      { error: "Failed to update credits" },
      { status: 500 }
    );
  }
}
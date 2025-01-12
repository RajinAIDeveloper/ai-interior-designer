// app/api/deduct-credits/route.js
import { NextResponse } from "next/server";
import { db } from "../../../config/db";
import { eq } from 'drizzle-orm';
import { Users_schema } from "../../../config/schema";

export async function POST(req) {
  try {
    const { userId, currentCredits } = await req.json();

    // Add validation for userId
    if (!userId || typeof userId !== 'number') {
      return NextResponse.json(
        { error: "Valid user ID is required" },
        { status: 400 }
      );
    }

    // Add validation for currentCredits
    const credits = Number(currentCredits);
    if (isNaN(credits) || credits <= 0) {
      return NextResponse.json(
        { error: "Invalid or insufficient credits" },
        { status: 400 }
      );
    }

    // Update user's credits in the database
    const result = await db
      .update(Users_schema)
      .set({
        credits: credits - 1 // Use the validated credits value
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
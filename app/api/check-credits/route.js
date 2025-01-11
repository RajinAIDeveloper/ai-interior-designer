// app/api/check-credits/route.js
import { NextResponse } from "next/server";
import { db } from "../../../config/db";
import { eq } from 'drizzle-orm';
import { Users_schema } from "../../../config/schema";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user's current credits
    const result = await db
      .select({ credits: Users_schema.credits })
      .from(Users_schema)
      .where(eq(Users_schema.id, userId))
      .limit(1);

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const hasEnoughCredits = result[0].credits > 0;

    return NextResponse.json({
      success: true,
      hasEnoughCredits,
      currentCredits: result[0].credits
    });

  } catch (error) {
    console.error("Error checking credits:", error);
    return NextResponse.json(
      { error: "Failed to check credits" },
      { status: 500 }
    );
  }
}
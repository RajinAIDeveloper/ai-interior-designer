// app/api/redesign-room/route.js
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { db } from "../../../config/db";
import { AiGeneratedImage } from "../../../config/schema";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req) {
  const { imageUrl, roomType, designType, additional, userEmail } = await req.json();

  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Just start the prediction
    const prediction = await replicate.predictions.create({
      version: process.env.REPLICATE_API_URL,
      input: {
        image: imageUrl,
        prompt: `A ${roomType} with a ${designType} style interior ${
          additional ? 'extra info: ' + additional : ''
        }`.trim(),
      }
    });

    // Save initial state to database
    const dbEntry = await db.insert(AiGeneratedImage).values({
      roomType,
      designType,
      orgImage: imageUrl,
      aiImage: null,
      userEmail,
      predictionId: prediction.id,
      status: 'pending'
    }).returning({ id: AiGeneratedImage.id });

    return NextResponse.json({ 
      success: true,
      predictionId: prediction.id,
      dbId: dbEntry[0].id
    });

  } catch (error) {
    console.error('Error starting generation:', error);
    return NextResponse.json({
      error: true,
      message: error.message || 'Failed to start image generation'
    }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { urlToUploadableFile } from "../../dashboard/create-new/_components/ConvertOut";
import { uploadImage } from "../../../app/supabase/client";
import { db } from "../../../config/db";
import { AiGeneratedImage } from "../../../config/schema";

// Configure for Vercel hobby plan limitations
export const maxDuration = 60;
export const runtime = 'edge'; // Using edge runtime for better performance
export const dynamic = 'force-dynamic';

export async function POST(req) {
  const { imageUrl, roomType, designType, additional, userEmail } = await req.json();
  const originalImageUrl = imageUrl;

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    // Add timeout promise with 55 seconds (leaving 5 seconds buffer)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 55000);
    });

    const input = {
      image: imageUrl,
      prompt: `A ${roomType} with a ${designType} style interior ${
        additional ? 'extra info: ' + additional : ''
      }`.trim(),
    };

    // Race between the Replicate API call and timeout
    const output = await Promise.race([
      replicate.run(process.env.REPLICATE_API_URL, { input }),
      timeoutPromise,
    ]);

    if (!output || output?.error) {
      throw new Error(output?.error || 'Failed to generate image');
    }

    const file = await urlToUploadableFile(output);
    
    const { imageUrl: uploadedUrl, error: uploadError } = await uploadImage({
      file: file,
      bucket: "room_images"
    });

    if (uploadError) {
      throw new Error(uploadError);
    }

    if (!uploadedUrl) {
      throw new Error('No URL returned from upload');
    }

    // Save to database with error handling
    const dbResult = await db.insert(AiGeneratedImage).values({
      roomType: roomType,
      designType: designType,
      orgImage: originalImageUrl,
      aiImage: uploadedUrl,
      userEmail: userEmail,
    }).returning({ id: AiGeneratedImage.id });

    return NextResponse.json({ 
      result: uploadedUrl, 
      success: true,
      dbId: dbResult[0]?.id 
    });

  } catch (error) {
    console.error('Error processing request:', error);
    
    if (error.message === 'Request timeout') {
      // Return a specific response for timeouts that the frontend can handle
      return NextResponse.json({
        error: true,
        message: 'Image generation is still in progress. Please check back in a few moments.',
        status: 'PENDING',
      }, { status: 202 }); // Using 202 Accepted to indicate the request is still processing
    }
    
    return NextResponse.json({
      error: true,
      message: error.message || 'Failed to process image',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { 
      status: 500 
    });
  }
}
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { urlToUploadableFile } from "../../dashboard/create-new/_components/ConvertOut";
import { uploadImage } from "../../../app/supabase/client";
import { db } from "../../../config/db";
import { AiGeneratedImage } from "../../../config/schema";

// Set maximum duration to 300 seconds (5 minutes)
export const maxDuration = 300;

// Use nodejs runtime instead of edge for better stability with long-running processes
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  const { imageUrl, roomType, designType, additional, userEmail } = await req.json();

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    // 1. Send image and prompt to Replicate
    const output = await replicate.run(
      process.env.REPLICATE_API_URL,
      {
        input: {
          image: imageUrl,
          prompt: `A ${roomType} with a ${designType} style interior ${
            additional ? 'extra info: ' + additional : ''
          }`.trim(),
        }
      }
    );

    if (!output || output?.error) {
      throw new Error(output?.error || 'Failed to generate image');
    }

    // 2. Convert Replicate output URL to uploadable file
    const file = await urlToUploadableFile(output);

    // 3. Upload generated image to Supabase
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

    // 4. Save to database
    const dbResult = await db.insert(AiGeneratedImage).values({
      roomType: roomType,
      designType: designType,
      orgImage: imageUrl,         // Original image URL
      aiImage: uploadedUrl,       // Generated image URL from Supabase
      userEmail: userEmail,
    }).returning({ id: AiGeneratedImage.id });

    // 5. Return success response
    return NextResponse.json({ 
      result: uploadedUrl,        // Return the Supabase URL of the generated image
      success: true,
      dbId: dbResult[0]?.id 
    });

  } catch (error) {
    console.error('Error processing request:', error);
    
    // Add specific error handling for timeout
    if (error.message?.includes('timeout') || error.code === 'ETIMEDOUT') {
      return NextResponse.json({
        error: true,
        message: 'The request took too long to process. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, { 
        status: 504 
      });
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
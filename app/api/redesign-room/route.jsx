import { NextResponse } from "next/server";
import Replicate from "replicate";
import { urlToUploadableFile } from "../../dashboard/create-new/_components/ConvertOut";
import { uploadImage } from "../../../app/supabase/client";
import { db } from "../../../config/db";
import { AiGeneratedImage } from "../../../config/schema";

// Configure timeout for the entire request
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '50mb',
  },
  maxDuration: 300, // Set max duration to 5 minutes
};

export async function POST(req) {
  const { imageUrl, roomType, designType, additional, userEmail } = await req.json();
  const originalImageUrl = imageUrl;

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    // Add timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 240000); // 4 minute timeout
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
    
    // Return more detailed error information
    return NextResponse.json({
      error: true,
      message: error.message || 'Failed to process image',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { 
      status: error.message === 'Request timeout' ? 504 : 500 
    });
  }
}
// app/api/check-generation-status/route.js
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { urlToUploadableFile } from "../../dashboard/create-new/_components/ConvertOut";
import { uploadImage } from "../../../app/supabase/client";
import { db } from "../../../config/db";
import { AiGeneratedImage } from "../../../config/schema";

export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const predictionId = searchParams.get('predictionId');
  const dbId = searchParams.get('dbId');

  if (!predictionId || !dbId) {
    return NextResponse.json({
      error: true,
      message: 'Missing required parameters'
    }, { status: 400 });
  }

  try {
    // First check DB status to avoid duplicate processing
    const dbEntry = await db
      .select()
      .from(AiGeneratedImage)
      .where({ id: dbId })
      .first();

    if (dbEntry.status === 'completed') {
      return NextResponse.json({
        status: 'COMPLETED',
        result: dbEntry.aiImage
      });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const prediction = await replicate.predictions.get(predictionId);

    if (prediction.status === 'succeeded') {
      // Only process if not already completed
      if (dbEntry.status !== 'completed') {
        const file = await urlToUploadableFile(prediction.output);
        const { imageUrl: uploadedUrl, error } = await uploadImage({
          file: file,
          bucket: "room_images"
        });

        if (error) throw new Error(error);

        await db
          .update(AiGeneratedImage)
          .set({ 
            aiImage: uploadedUrl,
            status: 'completed'
          })
          .where({ id: dbId });

        return NextResponse.json({
          status: 'COMPLETED',
          result: uploadedUrl
        });
      }
    } else if (prediction.status === 'failed') {
      await db
        .update(AiGeneratedImage)
        .set({ status: 'failed' })
        .where({ id: dbId });

      return NextResponse.json({
        status: 'FAILED',
        error: prediction.error
      });
    }

    return NextResponse.json({ status: 'PENDING' });

  } catch (error) {
    console.error('Error checking prediction status:', error);
    return NextResponse.json({
      status: 'ERROR',
      message: error.message
    }, { status: 500 });
  }
}
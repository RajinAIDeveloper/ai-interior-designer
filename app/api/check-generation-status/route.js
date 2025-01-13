// app/api/check-generation-status/route.js
import { NextResponse } from "next/server";
import Replicate from "replicate";

export const runtime = 'edge';
export const maxDuration = 60;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    const prediction = await replicate.predictions.get(id);
    
    if (prediction.status === 'succeeded') {
      return NextResponse.json({
        status: 'COMPLETED',
        result: prediction.output
      });
    } else if (prediction.status === 'failed') {
      return NextResponse.json({
        status: 'FAILED',
        error: prediction.error
      });
    } else {
      return NextResponse.json({
        status: 'PENDING'
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'ERROR',
      message: error.message
    }, { status: 500 });
  }
}
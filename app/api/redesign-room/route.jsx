import { NextResponse } from "next/server";
import Replicate from "replicate";
import { urlToUploadableFile } from "../../dashboard/create-new/_components/ConvertOut";
import { uploadImage } from "../../../app/supabase/client";
import { db } from "../../../config/db";
import { AiGeneratedImage } from "../../../config/schema";


export async function POST(req) {
  const { imageUrl, roomType, designType, additional,userEmail } = await req.json();
  const originalImageUrl = imageUrl;
  
  const replicate = new Replicate({
    auth: process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN,
  });


  try {

    
    const input = {
      image: imageUrl,
      prompt: `A ${roomType} with a ${designType} style interior ${'extra info: ', additional || ''}`.trim(),
    }
    // Instead of processing the image, we'll pass it directly to Replicate
    // and let their API handle the image format conversion
    const output = await replicate.run(
      process.env.NEXT_PUBLIC_REPLICATE_API_URL,
      {
       input 
      }
    );

    // console.log('oututis is: ', output)

    
    // if (output?.error) {
    //   throw new Error(output.error);
    // }

    // return NextResponse.json({ result: output });

    // const output = 'https://idovwputkmimglkmxedh.supabase.co/storage/v1/object/public/room_images/2a1ea040-fcf3-4fca-8c00-64ca9f923842.png';
    
    const file = await urlToUploadableFile(output);
  
    // Change this line - use imageUrl instead of OutputimageUrl
    const { imageUrl: uploadedUrl, error } = await uploadImage({
      file: file,
      bucket: "room_images"
    });

    if (error) {
      throw new Error(error);
    }

    if (!uploadedUrl) {
      throw new Error('No URL returned from upload');
    }

    console.log('stored outputimage is', uploadedUrl);

    // Save all to database
    const dbResult = await db.insert(AiGeneratedImage).values({
      roomType: roomType,
      designType: designType,
      orgImage: originalImageUrl,
      aiImage: uploadedUrl,
      userEmail: userEmail,
  }).returning({ id: AiGeneratedImage.id });

    return NextResponse.json({ result: uploadedUrl, success: true });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ 
      error: true, 
      message: error.message || 'Failed to process image'
    }, { status: 500 });
  }
}

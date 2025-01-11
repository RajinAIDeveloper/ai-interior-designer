import { NextResponse } from "next/server";
import { db } from '../../../config/db'
import { eq } from "drizzle-orm";
import { Users_schema } from '../../../config/schema'
export async function POST(req){
    const {user}=await req.json();
    // console.log('DATABASE_URL:', process.env.DATABASE_URL);


    try {
        const userInfo = await db.select().from(Users_schema).where(eq(Users_schema.email, user.primaryEmailAddress.emailAddress)).execute();
        console.log(userInfo);

        if(userInfo.length===0){
            const SaveResult = await db.insert(Users_schema).values({
                name:user?.fullName,
                email:user?.primaryEmailAddress.emailAddress,
                imageUrl:user?.imageUrl,
            });
            // return NextResponse.json({result:SaveResult[0]})
            
            console.log('User Created');
            return NextResponse.json({result:SaveResult[0]})   
        }
        console.log('User Already Exist:  ', userInfo[0]);
        return NextResponse.json({result:userInfo[0]})
      } catch (error) {
        return NextResponse.json({error:e})
      }

    // try {
    //     // if User Already Exist?
        

    // }
    // catch(e) {

    // }
    // const userInfo = await db.select().from(Users_schema).where(eq(Users_schema.email,user.email)).execute();
    // console.log('user', userInfo);

    return NextResponse.json({result:user})
}
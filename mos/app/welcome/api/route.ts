import { User } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const {data: { user },} = await supabase.auth.getUser();
    console.log(user);
    
    try {
        if (!user) {
            throw new Error("user not auhed")
        }else{
            const {email,role,companyName,contactInfo}:User = await request.json()
            const systemUser = await prisma.user.create({
                data:{
                    email:user.email!,
                    role:role,
                    companyName:companyName,
                    contactInfo:{contactInfo},
                }
            })
            console.log(email,role,companyName,contactInfo);
            console.log(systemUser);
            
            
            return NextResponse.json(systemUser, {status:200})
        }
    } catch (error:any) {
        console.error("Search user error:", error);
        return NextResponse.json(
          { message: `Internal server error, ${error.message}` },
          { status: 500 }
        );
      }
}
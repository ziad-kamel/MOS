import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { user } = body;
        console.log(user);
        

        const newUser = await prisma.user.create({
            data: {
                id: user.id,
                email: user.email,
                name: user.full_name,
            }
        });
    return NextResponse.json({ user: newUser });

    } catch (error) {
        console.log(error);
        
        return NextResponse.json({ error: error }, { status: 500 });
        
    }
  
}
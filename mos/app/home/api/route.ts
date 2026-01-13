import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    const { user } = await req.json();

    const dbuser = await prisma.user.findUnique({
        where: { id: user.id, email: user.email },
    }).then(async (existingUser) => {
        if (existingUser) {
            return existingUser;
        }
    });

    return NextResponse.json({ message: 'Hello from POST /home', user: dbuser });
}
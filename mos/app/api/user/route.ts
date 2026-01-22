import { User } from "@/app/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authUser = await getCurrentUser();

  try {
    if (!authUser) {
      throw new Error("user not auhed");
    } else {
      const { role, companyName, contactInfo }: User =
        await request.json();
        console.log(role, companyName, contactInfo);
      const systemUser = await prisma.user.create({
        data: {
          email: authUser.supaUser.email!,
          role: role,
          companyName: companyName,
          contactInfo: JSON.stringify(contactInfo),
        },
      });
      console.log(systemUser);
      

      return NextResponse.json(systemUser, { status: 200 });
    }
  } catch (error: any) {
    console.error("Search user error:", error);
    return NextResponse.json(
      { message: `Internal server error, ${error.message}` },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  try {
    const authUser = await getCurrentUser();
    if (!authUser?.supaUser || !authUser.dbUser) {
      throw new Error("user not auth")
    }
    const { email }: User = await request.json();
    const deletedUser = await prisma.user.delete({
      where:{email: email}
    })
    const {data,error} = await supabase.auth.admin.deleteUser(authUser.supaUser.id)
    if (error) {
      console.log(error);
    }
    console.log(data);
    
    return NextResponse.json({user:deletedUser.email}, { status: 200 });

  } catch (error:any) {
    console.error("Search user error:", error);
    return NextResponse.json(
      { message: `Internal server error, ${error.message}` },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const authUser = await getCurrentUser();

  try {
    if (!authUser) {
      throw new Error("user not auhed");
    } else {
      const { email, companyName, contactInfo }: User =
        await request.json();
      const systemUser = await prisma.user.update({
        where:{email: email},
        data:{
          companyName:companyName,
          contactInfo:JSON.stringify(contactInfo)
        }
      });
      console.log(systemUser);
      

      return NextResponse.json(systemUser, { status: 200 });
    }
  } catch (error: any) {
    console.error("Search user error:", error);
    return NextResponse.json(
      { message: `Internal server error, ${error.message}` },
      { status: 500 },
    );
  }
}

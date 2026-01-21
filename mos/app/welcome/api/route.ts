import { User } from "@/app/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authUser = await getCurrentUser();

  try {
    if (!authUser) {
      throw new Error("user not auhed");
    } else {
      const { email, role, companyName, contactInfo }: User =
        await request.json();
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

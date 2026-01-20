import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    if (!email) {
      return NextResponse.json(
        { message: "Email query parameter is required" },
        { status: 400 }
      );
    }
    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where:{
        email: normalizedEmail
      }
    })
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Search user error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { id, name, email } = await request.json()
  const newUser = await prisma.user.create({
    data: {
      id,
      name,
      email,
    },
  })
  return Response.json(newUser)
}

export async function PUT(request: Request) {
  const { id, name, email } = await request.json()
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
    },
  })
  return Response.json(updatedUser)
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  const deletedUser = await prisma.user.delete({
    where: { id },
  })
  return Response.json(deletedUser)
}   
import prisma from "@/lib/prisma"


export async function GET() {
  const users = await prisma.user.findMany()
  return Response.json(users)
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
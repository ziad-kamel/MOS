"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { rankSchema } from "@/lib/schemas";

export async function getRanks() {
  return await prisma.rank.findMany({
    orderBy: {
      amount: "asc",
    },
  });
}

export async function createRank(data: z.infer<typeof rankSchema>) {
  const rank = await prisma.rank.create({
    data: {
      name: data.name,
      amount: data.amount,
    },
  });
  revalidatePath("/home/ranks");
  return rank;
}

export async function deleteRank(id: string) {
  try {
    await prisma.rank.delete({
      where: { id },
    });
    revalidatePath("/home/ranks");
  } catch (error) {
    throw new Error("Cannot delete rank as it is assigned to some users.");
  }
}

export async function updateRank(id: string, data: z.infer<typeof rankSchema>) {
  const rank = await prisma.rank.update({
    where: { id },
    data: {
      name: data.name,
      amount: data.amount,
    },
  });
  revalidatePath("/home/ranks");
  return rank;
}

export async function getBasicRank() {
  return await prisma.rank.findFirst({
    where: { name: "New " },
    select: { id: true },
  });
}

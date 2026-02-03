"use server";

import prisma from "@/lib/prisma";

export async function getManufacturers() {
  return await prisma.manufacturer.findMany({
    include: {
      rank: true,
    },
  });
}

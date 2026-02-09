"use server";

import prisma from "@/lib/prisma";

export async function getManufacturers() {
  return await prisma.manufacturer.findMany({
    include: {
      rank: true,
      user: true,
    },
    orderBy: {
      rank: {
        amount: "desc",
      },
    },
  });
}
export async function deleteManufacturer(id: string) {
  return await prisma.user.delete({
    where: { id: id },
  });
}

export async function updateManufacturerRank(
  manufacturerId: string,
  rankId: string,
) {
  return await prisma.manufacturer.update({
    where: { id: manufacturerId },
    data: {
      rankId: rankId,
    },
  });
}

"use server";

import prisma from "@/lib/prisma";

export async function getBrands() {
  return await prisma.brand.findMany({
    include: {
      user: true,
      rank: true,
    },
  });
}

export async function deleteBrand(id: string) {
  return await prisma.user.delete({
    where: { id: id },
  });
}

export async function updateBrandRank(brandId: string, rankId: string) {
  return await prisma.brand.update({
    where: { id: brandId },
    data: {
      rankId: rankId,
    },
  });
}

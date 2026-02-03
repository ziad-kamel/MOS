"use server";
import prisma from "@/lib/prisma";

export async function createOrder(data: {
  brandId: string;
  subOrders: {
    manufacturerId: string;
    note?: string;
    details: { color: string; size: string; quantity: number };
  }[];
}) {
  await prisma.order.create({
    data: {
      brandId: data.brandId,
      subOrders: {
        createMany: {
          data: data.subOrders.map((subOrder) => {
            return {
              manufacturerId: subOrder.manufacturerId,
              note: subOrder.note,
              details: subOrder.details,
            };
          }),
        },
      },
    },
  });
}

export async function getOrders(brandId: string) {
  return await prisma.order.findMany({
    where: {
      brandId: brandId,
    },
    include: {
      subOrders: true,
    },
  });
}

export async function getLastOrder(brandId: string) {
  return await prisma.order.findFirst({
    where: {
      brandId: brandId,
    },
    include: {
      subOrders: true,
      brand: { select: { id: true, rank: true } },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

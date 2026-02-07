"use server";
import prisma from "@/lib/prisma";

export async function getSubOrdersForManufacturer(manufacturerId: string) {
  return await prisma.subOrder.findMany({
    where: {
      manufacturerId: manufacturerId,
    },
    include: {
      order: {
        include: {
          brand: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function updateSubOrderStatus(
  subOrderId: string,
  status: string,
  rejectionReason?: string,
  note?: string,
) {
  const updatedSubOrder = await prisma.subOrder.update({
    where: {
      id: subOrderId,
    },
    data: {
      status,
      rejectionReason: rejectionReason || "",
      note: note || "",
    },
    include: {
      order: {
        include: {
          subOrders: true,
        },
      },
    },
  });

  return updatedSubOrder;
}

export async function addSubOrderNote(subOrderId: string, note: string) {
  return await prisma.subOrder.update({
    where: {
      id: subOrderId,
    },
    data: {
      note: note,
    },
  });
}
export async function deleteSubOrder(subOrderId: string) {
  return await prisma.subOrder.delete({
    where: { id: subOrderId },
  });
}

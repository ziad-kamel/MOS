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

  // If the status is ACCEPTED, check if all other sub-orders of this order are also ACCEPTED
  if (status === "ACCEPTED" && updatedSubOrder.order) {
    const allAccepted = updatedSubOrder.order.subOrders.every(
      (so) => so.status === "ACCEPTED",
    );

    if (allAccepted) {
      await prisma.order.update({
        where: { id: updatedSubOrder.orderId },
        data: { status: "ACCEPTED" },
      });
    }
  }

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

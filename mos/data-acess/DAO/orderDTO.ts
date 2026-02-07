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
  return await prisma.order.create({
    data: {
      brandId: data.brandId,
      subOrders: {
        create: data.subOrders.map((subOrder) => ({
          manufacturerId: subOrder.manufacturerId,
          note: subOrder.note,
          details: subOrder.details,
          status: "PENDING", // Explicitly set as string
        })),
      },
    },
    include: {
      subOrders: true,
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

export async function getAllOrders() {
  return await prisma.order.findMany({
    include: {
      subOrders: true,
      brand: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function updateOrderStatus(
  orderId: string,
  status: "ACCEPTED" | "CANCELLED",
  adminId: string,
  rejectionReason?: string,
) {
  return await prisma.order.update({
    where: { id: orderId },
    data: {
      status: status,
      adminId: adminId,
      subOrders:
        status === "CANCELLED"
          ? {
              updateMany: {
                where: {},
                data: {
                  rejectionReason: rejectionReason || "Rejected by Admin",
                  status: "REJECTED",
                },
              },
            }
          : status === "ACCEPTED"
            ? {
                updateMany: {
                  where: { status: "PENDING_ADMIN_ACCEPT" },
                  data: {
                    status: "ACCEPTED",
                  },
                },
              }
            : undefined,
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
export async function getOrdersByManufacturer(manufacturerId: string) {
  return await prisma.order.findMany({
    where: {
      subOrders: {
        some: {
          manufacturerId: manufacturerId,
        },
      },
    },
    include: {
      subOrders: {
        where: {
          manufacturerId: manufacturerId,
        },
      },
      brand: {
        include: {
          user: true,
        },
      },
    },
  });
}

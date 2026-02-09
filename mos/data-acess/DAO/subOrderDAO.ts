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
export async function getManufacturerDashboardData(manufacturerId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const subOrders = await prisma.subOrder.findMany({
    where: {
      manufacturerId,
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    select: {
      createdAt: true,
      status: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Group by date and status
  const groupedData: Record<
    string,
    { accepted: number; rejected: number; total: number }
  > = {};

  // Initialize last 30 days with 0s
  for (let i = 0; i <= 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    groupedData[dateStr] = { accepted: 0, rejected: 0, total: 0 };
  }

  subOrders.forEach((so) => {
    const dateStr = so.createdAt.toISOString().split("T")[0];
    if (groupedData[dateStr]) {
      groupedData[dateStr].total++;
      if (so.status === "ACCEPTED") {
        groupedData[dateStr].accepted++;
      } else if (so.status === "REJECTED") {
        groupedData[dateStr].rejected++;
      }
    }
  });

  return Object.entries(groupedData)
    .map(([date, counts]) => ({ date, ...counts }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

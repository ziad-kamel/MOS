"use client";

import React, { useEffect, useState } from "react";
import { PlaceOrderBtn } from "./placeOrderBtn";
import { getLastOrder } from "@/data-acess/DAO/orderDTO";
import { useUser } from "@/providers/user-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function BrandHomePage() {
  const { user } = useUser();
  const [lastOrder, setLastOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLastOrder() {
      if (user?.id) {
        try {
          const order = await getLastOrder(user.id);
          setLastOrder(order);
        } catch (error) {
          console.error("Failed to fetch last order:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchLastOrder();
  }, [user?.id]);

  return (
    <div className='p-6 space-y-8 max-w-7xl mx-auto'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold tracking-tight'>Brand Home Page</h1>
        <PlaceOrderBtn />
      </div>

      <Separator />

      <div className='space-y-4'>
        <h2 className='text-xl font-semibold'>Last Order</h2>

        {loading ? (
          <div className='h-40 w-full animate-pulse bg-muted rounded-xl' />
        ) : lastOrder ? (
          <Card className='border-2 border-primary/10'>
            <CardHeader className='pb-3'>
              <div className='flex items-start justify-between'>
                <div>
                  <CardTitle className='text-lg'>
                    Order #{lastOrder.id.slice(0, 8)}
                  </CardTitle>
                  <CardDescription>
                    Placed on{" "}
                    {new Date(lastOrder.createdAt).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </CardDescription>
                </div>
                <div
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    lastOrder.status === "PENDING"
                      ? "bg-amber-100 text-amber-700"
                      : lastOrder.status === "ACCEPTED"
                        ? "bg-blue-100 text-blue-700"
                        : lastOrder.status === "DELIVERED"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {lastOrder.status}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {lastOrder.notes && (
                <div className='mb-6 p-4 rounded-lg bg-muted/40'>
                  <p className='text-xs font-semibold uppercase text-muted-foreground mb-1'>
                    Notes
                  </p>
                  <p className='text-sm'>{lastOrder.notes}</p>
                </div>
              )}

              <div className='space-y-3'>
                <p className='text-xs font-semibold uppercase text-muted-foreground'>
                  Sub Orders ({lastOrder.subOrders.length})
                </p>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                  {lastOrder.subOrders.map((sub: any) => (
                    <div
                      key={sub.id}
                      className='p-3 border rounded-lg bg-card shadow-sm'
                    >
                      <div className='flex items-center gap-2 mb-2'>
                        <div className='w-1.5 h-1.5 rounded-full bg-primary' />
                        <p className='text-xs font-bold truncate'>
                          Manufacturer: {sub.manufacturerId.slice(0, 8)}...
                        </p>
                      </div>
                      <div className='space-y-0.5 text-xs text-muted-foreground pl-3 border-l'>
                        <p>
                          <span className='font-medium text-foreground'>
                            Color:
                          </span>{" "}
                          {sub.details.color}
                        </p>
                        <p>
                          <span className='font-medium text-foreground'>
                            Size:
                          </span>{" "}
                          {sub.details.size}
                        </p>
                        <p>
                          <span className='font-medium text-foreground'>
                            Qty:
                          </span>{" "}
                          {sub.details.quantity}
                        </p>
                        {sub.note && (
                          <p className='mt-1 italic'>Note: {sub.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className='flex flex-col items-center justify-center p-12 border border-dashed rounded-xl bg-muted/5 text-center'>
            <p className='text-muted-foreground italic'>No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

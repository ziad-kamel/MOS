"use client";

import React, { useEffect, useState } from "react";
import { getAllOrders } from "@/data-acess/DAO/orderDTO";
import { useUser } from "@/providers/user-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Boxes,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function AdminHomePage() {
  const { user } = useUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const fetchedOrders = await getAllOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const pendingOrders = orders.filter((o) => o.status === "PENDING");

  return (
    <div className='p-8 space-y-10 max-w-7xl mx-auto min-h-screen'>
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2 text-primary font-medium text-sm'>
            <TrendingUp className='w-4 h-4' />
            <span>Dashboard</span>
          </div>
          <h1 className='text-4xl font-extrabold tracking-tight'>
            Admin Overview
          </h1>
          <p className='text-muted-foreground text-lg'>
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>

        <div className='flex gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-sm'>
          <div className='text-center px-4'>
            <p className='text-[10px] uppercase font-bold text-muted-foreground tracking-widest'>
              Pending Orders
            </p>
            <p className='text-xl font-bold text-amber-600'>
              {pendingOrders.length}
            </p>
          </div>
          <Separator orientation='vertical' className='h-10' />
          <div className='text-center px-4'>
            <p className='text-[10px] uppercase font-bold text-muted-foreground tracking-widest'>
              Total Orders
            </p>
            <p className='text-xl font-bold'>{orders.length}</p>
          </div>
        </div>
      </div>

      <Separator className='opacity-50' />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <Card className='bg-primary/5 border-primary/10'>
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Package className='w-5 h-5 text-primary' />
              Recent Production
            </CardTitle>
            <CardDescription>New orders awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='space-y-2'>
                <div className='h-4 w-full animate-pulse bg-muted rounded' />
                <div className='h-4 w-2/3 animate-pulse bg-muted rounded' />
              </div>
            ) : pendingOrders.length > 0 ? (
              <div className='space-y-4'>
                {pendingOrders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className='flex items-center justify-between text-sm'
                  >
                    <div className='flex flex-col'>
                      <span className='font-medium'>
                        Order #{order.id.slice(0, 8)}
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className='text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded'>
                      PENDING
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-muted-foreground italic'>
                No pending orders.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Add more metric cards if needed */}
      </div>
    </div>
  );
}

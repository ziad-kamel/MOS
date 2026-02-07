"use client";

import React, { useEffect, useState } from "react";
import { getAllOrders } from "@/data-acess/DAO/orderDTO";
import { getManufacturers } from "@/data-acess/DAO/manDAO";
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
  Users,
  Factory,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SuperAdminHomePage() {
  const { user } = useUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedOrders, fetchedMans] = await Promise.all([
          getAllOrders(),
          getManufacturers(),
        ]);
        setOrders(fetchedOrders);
        setManufacturers(fetchedMans);
      } catch (error) {
        console.error("Failed to fetch super admin data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const pendingOrders = orders.filter((o) => o.status === "PENDING");

  return (
    <div className='p-8 space-y-10 max-w-7xl mx-auto min-h-screen'>
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2 text-primary font-medium text-sm'>
            <ShieldAlert className='w-4 h-4' />
            <span>Super Admin Terminal</span>
          </div>
          <h1 className='text-4xl font-extrabold tracking-tight'>
            System Control
          </h1>
          <p className='text-muted-foreground text-lg'>
            Full administrative access to all brands, manufacturers, and orders.
          </p>
        </div>

        <div className='flex gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-sm'>
          <div className='text-center px-4'>
            <p className='text-[10px] uppercase font-bold text-muted-foreground tracking-widest'>
              Active Orders
            </p>
            <p className='text-xl font-bold text-primary'>{orders.length}</p>
          </div>
          <Separator orientation='vertical' className='h-10' />
          <div className='text-center px-4'>
            <p className='text-[10px] uppercase font-bold text-muted-foreground tracking-widest'>
              Manufacturers
            </p>
            <p className='text-xl font-bold'>{manufacturers.length}</p>
          </div>
        </div>
      </div>

      <Separator className='opacity-50' />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <Card className='bg-amber-500/5 border-amber-500/10 shadow-sm'>
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Clock className='w-5 h-5 text-amber-600' />
              Pending Approvals
            </CardTitle>
            <CardDescription>
              {pendingOrders.length} orders need attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href='/home/orders'>
              <Button variant='outline' className='w-full'>
                Manage All Orders
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className='bg-blue-500/5 border-blue-500/10 shadow-sm'>
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Factory className='w-5 h-5 text-blue-600' />
              Manufacturing
            </CardTitle>
            <CardDescription>
              Review and manage factory partners
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href='/home/manufacturers'>
              <Button variant='outline' className='w-full'>
                Manage Manufacturers
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className='bg-emerald-500/5 border-emerald-500/10 shadow-sm'>
          <CardHeader>
            <CardTitle className='text-lg flex items-center gap-2'>
              <Users className='w-5 h-5 text-emerald-600' />
              Brand Management
            </CardTitle>
            <CardDescription>Overview of all active brands</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href='/home/brands'>
              <Button variant='outline' className='w-full'>
                Brands Management
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className='space-y-4'>
        <h2 className='text-2xl font-bold'>Critical Tasks</h2>
        {pendingOrders.length > 0 ? (
          <div className='grid gap-4'>
            {pendingOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className='flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-card transition-colors'
              >
                <div className='flex items-center gap-4'>
                  <div className='w-10 h-10 rounded-full bg-muted flex items-center justify-center'>
                    <Package className='w-5 h-5' />
                  </div>
                  <div>
                    <p className='font-bold text-sm'>
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      From Brand: {order.brand?.user?.id.slice(0, 8)}
                    </p>
                  </div>
                </div>
                <Link href='/home/orders'>
                  <Button size='sm' variant='ghost'>
                    View Details
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center p-12 rounded-2xl border-2 border-dashed border-border/50 bg-muted/10'>
            <CheckCircle2 className='w-10 h-10 text-emerald-500 mb-2' />
            <p className='font-medium'>No Critical Tasks</p>
            <p className='text-sm text-muted-foreground'>
              System is currently stable.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

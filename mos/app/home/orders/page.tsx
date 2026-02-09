"use client";

import React, { useEffect, useState } from "react";
import {
  getOrders,
  getAllOrders,
  updateOrderStatus,
  getOrdersByManufacturer,
  deleteOrder,
} from "@/data-acess/DAO/orderDTO";
import {
  getSubOrdersForManufacturer,
  deleteSubOrder,
} from "@/data-acess/DAO/subOrderDAO";
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
  Calendar,
  MessageSquare,
  Tag,
  Clock,
  ChevronRight,
  Package,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Custom Badge component to avoid missing shadcn component issues
const CustomBadge = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all",
      className,
    )}
  >
    {children}
  </div>
);

export default function OrdersPage() {
  const { user } = useUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectDialogOrder, setRejectDialogOrder] = useState<string | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      if (user?.id) {
        try {
          let fetchedOrders;
          if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
            fetchedOrders = await getAllOrders();
          } else if (user.role === "MANUFACTURER") {
            fetchedOrders = await getOrdersByManufacturer(user.id);
          } else {
            fetchedOrders = await getOrders(user.id);
          }
          setOrders(
            fetchedOrders.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            ),
          );
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchOrders();
  }, [user?.id, user?.role]);

  const handleStatusUpdate = async (
    orderId: string,
    status: "ACCEPTED" | "CANCELLED",
    reason?: string,
  ) => {
    if (!user?.id) return;
    setActionLoading(orderId);
    try {
      await updateOrderStatus(orderId, status, user.id, reason);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status, adminId: user.id } : o,
        ),
      );
      if (status === "CANCELLED") {
        setRejectDialogOrder(null);
        setRejectionReason("");
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this order? This will also remove ALL associated sub-orders. This action cannot be undone.",
      )
    )
      return;

    setActionLoading(orderId);
    try {
      await deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (error) {
      console.error("Failed to delete order:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteSubOrder = async (orderId: string, subOrderId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this specific sub-order? This action cannot be undone.",
      )
    )
      return;

    setActionLoading(subOrderId);
    try {
      await deleteSubOrder(subOrderId);
      setOrders((prev) =>
        prev
          .map((o) => {
            if (o.id !== orderId) return o;
            return {
              ...o,
              subOrders: o.subOrders.filter((s: any) => s.id !== subOrderId),
            };
          })
          .filter((o) => o.subOrders.length > 0),
      );
    } catch (error) {
      console.error("Failed to delete sub-order:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-600 border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-400";
      case "PENDING_ADMIN_ACCEPT":
        return "bg-orange-50 text-orange-600 border-orange-200/50 dark:bg-orange-950/20 dark:text-orange-400";
      case "ACCEPTED":
        return "bg-blue-50 text-blue-600 border-blue-200/50 dark:bg-blue-950/20 dark:text-blue-400";
      case "IN_PROGRESS":
        return "bg-indigo-50 text-indigo-600 border-indigo-200/50 dark:bg-indigo-950/20 dark:text-indigo-400";
      case "SHIPPED":
        return "bg-purple-50 text-purple-600 border-purple-200/50 dark:bg-purple-950/20 dark:text-purple-400";
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-600 border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400";
      case "CANCELLED":
        return "bg-rose-50 text-rose-600 border-rose-200/50 dark:bg-rose-950/20 dark:text-rose-400";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200/50 dark:bg-slate-950/20 dark:text-slate-400";
    }
  };

  return (
    <div className='p-8 space-y-10 max-w-7xl mx-auto min-h-screen'>
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2 text-primary font-medium text-sm'>
            <TrendingUp className='w-4 h-4' />
            <span>Overview</span>
          </div>
          <h1 className='text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70'>
            {user?.role === "ADMIN"
              ? "All Orders"
              : user?.role === "MANUFACTURER"
                ? "Production History"
                : "Order History"}
          </h1>
          <p className='text-muted-foreground text-lg'>
            {user?.role === "ADMIN"
              ? "Review and manage all production requests."
              : user?.role === "MANUFACTURER"
                ? "Full log of your completed and active production runs."
                : "Monitor and manage your production lifecycle."}
          </p>
        </div>

        <div className='flex gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-sm'>
          <div className='text-center px-4'>
            <p className='text-[10px] uppercase font-bold text-muted-foreground tracking-widest'>
              Total Orders
            </p>
            <p className='text-xl font-bold'>{orders.length}</p>
          </div>
          <Separator orientation='vertical' className='h-10' />
          <div className='text-center px-4'>
            <p className='text-[10px] uppercase font-bold text-muted-foreground tracking-widest'>
              {user?.role === "ADMIN" ? "Pending Approval" : "Active Items"}
            </p>
            <p className='text-xl font-bold'>
              {user?.role === "ADMIN"
                ? orders.filter((o) => o.status === "PENDING").length
                : user?.role === "MANUFACTURER"
                  ? orders.filter(
                      (o) => !["DONE", "REJECTED"].includes(o.status),
                    ).length
                  : orders.filter(
                      (o) => !["DELIVERED", "CANCELLED"].includes(o.status),
                    ).length}
            </p>
          </div>
        </div>
      </div>

      <Separator className='opacity-50' />

      {loading ? (
        <div className='space-y-6'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='h-56 w-full animate-pulse bg-muted rounded-2xl border border-border/50'
            />
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className='grid gap-8'>
          {orders.map((order: any) => (
            <div key={order.id} className='group relative'>
              {/* Decorative side bar */}
              <div
                className={cn(
                  "absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-all group-hover:w-1.5",
                  order.status === "PENDING"
                    ? "bg-amber-400"
                    : order.status === "DELIVERED"
                      ? "bg-emerald-400"
                      : order.status === "CANCELLED"
                        ? "bg-rose-400"
                        : "bg-primary",
                )}
              />

              <Card className='overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20 bg-card ml-1 rounded-l-none rounded-r-2xl'>
                <CardHeader className='bg-muted/10 pb-6 border-b border-border/40'>
                  <div className='flex flex-wrap items-center justify-between gap-4'>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-3'>
                        <span className='text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded'>
                          ID: {order.id.slice(0, 8)}
                        </span>
                        <CustomBadge className={getStatusStyles(order.status)}>
                          {order.status}
                        </CustomBadge>
                        {(user?.role === "ADMIN" ||
                          user?.role === "MANUFACTURER") &&
                          order.brand?.user?.id && (
                            <span className='text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase'>
                              Brand: {order.brand.user.id.slice(0, 8)}
                            </span>
                          )}
                      </div>
                      <CardTitle className='text-2xl font-bold'>
                        Production Order
                      </CardTitle>
                    </div>

                    <div className='flex flex-wrap gap-6 items-center'>
                      {(user?.role === "ADMIN" ||
                        user?.role === "SUPER_ADMIN") &&
                        order.status === "PENDING" && (
                          <div className='flex items-center gap-3'>
                            {!order.subOrders.every(
                              (s: any) => s.status !== "PENDING",
                            ) && (
                              <span className='text-[10px] text-amber-600 font-medium animate-pulse'>
                                Awaiting Manufacturer Review...
                              </span>
                            )}
                            <div className='flex gap-2'>
                              <Button
                                size='sm'
                                variant='outline'
                                className='h-8 border-emerald-200/50 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-900/50 dark:text-emerald-400 dark:hover:bg-emerald-950/20'
                                disabled={
                                  actionLoading === order.id ||
                                  !order.subOrders.every(
                                    (s: any) => s.status !== "PENDING",
                                  )
                                }
                                onClick={() =>
                                  handleStatusUpdate(order.id, "ACCEPTED")
                                }
                              >
                                {actionLoading === order.id ? (
                                  <Loader2 className='w-3.5 h-3.5 animate-spin mr-1.5' />
                                ) : (
                                  <CheckCircle2 className='w-3.5 h-3.5 mr-1.5' />
                                )}
                                Accept
                              </Button>
                              <Button
                                size='sm'
                                variant='outline'
                                className='h-8 border-rose-200/50 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/20'
                                disabled={
                                  actionLoading === order.id ||
                                  !order.subOrders.every(
                                    (s: any) => s.status !== "PENDING",
                                  )
                                }
                                onClick={() => setRejectDialogOrder(order.id)}
                              >
                                {actionLoading === order.id ? (
                                  <Loader2 className='w-3.5 h-3.5 animate-spin mr-1.5' />
                                ) : (
                                  <XCircle className='w-3.5 h-3.5 mr-1.5' />
                                )}
                                Reject
                              </Button>
                            </div>
                          </div>
                        )}
                      {user?.role === "BRAND" && order.status === "PENDING" && (
                        <Button
                          size='sm'
                          variant='outline'
                          className='h-8 border-rose-200/50 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/20'
                          disabled={actionLoading === order.id}
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to cancel this order? This action cannot be undone.",
                              )
                            ) {
                              handleStatusUpdate(order.id, "CANCELLED");
                            }
                          }}
                        >
                          {actionLoading === order.id ? (
                            <Loader2 className='w-3.5 h-3.5 animate-spin mr-1.5' />
                          ) : (
                            <XCircle className='w-3.5 h-3.5 mr-1.5' />
                          )}
                          Cancel Order
                        </Button>
                      )}

                      {user?.role === "SUPER_ADMIN" && (
                        <Button
                          size='sm'
                          variant='ghost'
                          className='h-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100'
                          onClick={() => handleDeleteOrder(order.id)}
                          disabled={actionLoading === order.id}
                        >
                          {actionLoading === order.id ? (
                            <Loader2 className='w-3.5 h-3.5 animate-spin mr-1.5' />
                          ) : (
                            <Trash2 className='w-3.5 h-3.5 mr-1.5' />
                          )}
                          Delete
                        </Button>
                      )}
                      <div className='flex flex-col items-end'>
                        <span className='text-[10px] uppercase font-bold text-muted-foreground'>
                          Order Placed
                        </span>
                        <span className='font-medium flex items-center gap-1.5'>
                          <Clock className='w-3.5 h-3.5 text-primary' />
                          {new Date(order.createdAt).toLocaleDateString(
                            undefined,
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className='pt-8 space-y-8'>
                  {order.notes && (
                    <div className='relative overflow-hidden p-5 rounded-2xl bg-primary/5 border border-primary/10'>
                      <div className='absolute top-0 right-0 p-2 opacity-10'>
                        <MessageSquare className='w-12 h-12' />
                      </div>
                      <p className='text-xs font-bold uppercase text-primary/70 mb-2 flex items-center gap-2'>
                        <MessageSquare className='w-3 h-3' />
                        Management Notes
                      </p>
                      <p className='text-sm text-foreground/80 leading-relaxed italic'>
                        "{order.notes}"
                      </p>
                    </div>
                  )}

                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <h3 className='text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2'>
                        <Package className='w-4 h-4' />
                        Order Breakdown ({order.subOrders.length})
                      </h3>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
                      {order.subOrders.map((sub: any) => (
                        <div
                          key={sub.id}
                          className='group/sub p-5 border border-border/50 rounded-2xl bg-muted/20 hover:bg-card hover:border-primary/30 transition-all shadow-sm hover:shadow-md'
                        >
                          <div className='flex items-center justify-between mb-4'>
                            <div className='flex items-center gap-3'>
                              <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary'>
                                <Tag className='w-4 h-4' />
                              </div>
                              <div className='flex flex-col'>
                                <span className='text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1'>
                                  Manufacturer
                                </span>
                                <span className='text-xs font-bold font-mono'>
                                  {sub.manufacturerId.slice(0, 12)}...
                                </span>
                              </div>
                            </div>
                            <CustomBadge
                              className={cn(
                                "text-[9px]",
                                getStatusStyles(sub.status),
                              )}
                            >
                              {sub.status}
                            </CustomBadge>
                          </div>

                          <div className='grid grid-cols-3 gap-1 p-3 rounded-xl bg-background/50 border border-border/40'>
                            <div className='flex flex-col items-center justify-center border-r border-border/50'>
                              <span className='text-[9px] font-bold text-muted-foreground uppercase'>
                                Color
                              </span>
                              <span className='text-sm font-semibold truncate max-w-full px-1'>
                                {sub.details.color}
                              </span>
                            </div>
                            <div className='flex flex-col items-center justify-center border-r border-border/50'>
                              <span className='text-[9px] font-bold text-muted-foreground uppercase'>
                                Size
                              </span>
                              <span className='text-sm font-semibold'>
                                {sub.details.size}
                              </span>
                            </div>
                            <div className='flex flex-col items-center justify-center'>
                              <span className='text-[9px] font-bold text-muted-foreground uppercase'>
                                Qty
                              </span>
                              <span className='text-sm font-bold text-primary'>
                                {sub.details.quantity}
                              </span>
                            </div>
                          </div>

                          {sub.rejectionReason && (
                            <div className='mt-4 pt-3 border-t border-border/40'>
                              <p className='text-[10px] text-rose-600 leading-snug'>
                                <span className='font-bold'>Rejection:</span>{" "}
                                {sub.rejectionReason}
                              </p>
                            </div>
                          )}

                          {sub.note && (
                            <div className='mt-4 pt-3 border-t border-border/40'>
                              <p className='text-[10px] text-muted-foreground leading-snug'>
                                <span className='font-bold'>Instructions:</span>{" "}
                                {sub.note}
                              </p>
                            </div>
                          )}

                          {user?.role === "SUPER_ADMIN" && (
                            <div className='mt-4 pt-3 border-t border-border/40'>
                              <Button
                                size='sm'
                                variant='ghost'
                                className='w-full text-[10px] h-7 text-rose-500 hover:text-rose-700 hover:bg-rose-50'
                                onClick={() =>
                                  handleDeleteSubOrder(order.id, sub.id)
                                }
                                disabled={actionLoading === sub.id}
                              >
                                {actionLoading === sub.id ? (
                                  <Loader2 className='w-3 h-3 animate-spin mr-1.5' />
                                ) : (
                                  <Trash2 className='w-3 h-3 mr-1.5' />
                                )}
                                Delete Sub-task
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center p-24 border-2 border-dashed rounded-3xl bg-muted/20 text-center space-y-6'>
          <div className='p-6 rounded-full bg-background shadow-xl border border-border/50'>
            <Boxes className='w-12 h-12 text-muted-foreground animate-pulse' />
          </div>
          <div className='space-y-2'>
            <h3 className='text-2xl font-bold tracking-tight'>
              No orders found
            </h3>
            <p className='text-muted-foreground max-w-sm mx-auto'>
              Your order history is currently empty. Start a new production run
              to see your orders here.
            </p>
          </div>
        </div>
      )}

      {/* Admin Rejection Dialog */}
      <Dialog
        open={!!rejectDialogOrder}
        onOpenChange={(open) => !open && setRejectDialogOrder(null)}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Reject Order</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this production order. This
              reason will be visible to the brand and manufacturers.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='rejection-reason'>Reason for Rejection</Label>
              <Input
                id='rejection-reason'
                placeholder='e.g., Incomplete specifications, Capacity full...'
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setRejectDialogOrder(null)}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              disabled={
                !rejectionReason.trim() || actionLoading === rejectDialogOrder
              }
              onClick={() =>
                rejectDialogOrder &&
                handleStatusUpdate(
                  rejectDialogOrder,
                  "CANCELLED",
                  rejectionReason,
                )
              }
            >
              {actionLoading === rejectDialogOrder ? (
                <Loader2 className='w-4 h-4 animate-spin mr-2' />
              ) : null}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

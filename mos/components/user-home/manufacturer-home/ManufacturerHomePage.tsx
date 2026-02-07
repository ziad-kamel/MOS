"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/providers/user-provider";
import {
  getSubOrdersForManufacturer,
  updateSubOrderStatus,
  addSubOrderNote,
} from "@/data-acess/DAO/subOrderDAO";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Package,
  CheckCircle2,
  XCircle,
  Info,
  MessageSquare,
  UserCircle,
  Calendar,
  Clock,
  Boxes,
} from "lucide-react";
import Link from "next/link";

type SubOrderWithDetails = Awaited<
  ReturnType<typeof getSubOrdersForManufacturer>
>[number];

export default function ManufacturerHomePage() {
  const { user } = useUser();
  const [subOrders, setSubOrders] = useState<SubOrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] =
    useState<SubOrderWithDetails | null>(null);
  const [newNote, setNewNote] = useState("");

  const fetchSubOrders = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await getSubOrdersForManufacturer(user.id);
      // Only show PENDING sub-orders on Home page
      setSubOrders(data.filter((so) => so.status === "PENDING"));
    } catch (error) {
      console.error("Failed to fetch sub-orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubOrders();
  }, [user?.id]);

  const handleAccept = async (id: string) => {
    try {
      await updateSubOrderStatus(id, "PENDING_ADMIN_ACCEPT");
      fetchSubOrders();
    } catch (error) {
      console.error("Failed to accept sub-order:", error);
    }
  };

  const handleReject = async () => {
    if (!rejectId) return;
    try {
      await updateSubOrderStatus(rejectId, "REJECTED", rejectionReason);
      setRejectId(null);
      setRejectionReason("");
      setIsRejectDialogOpen(false);
      fetchSubOrders();
    } catch (error) {
      console.error("Failed to reject sub-order:", error);
    }
  };

  const handleAddNote = async (id: string) => {
    if (!newNote.trim()) return;
    try {
      await addSubOrderNote(id, newNote);
      setNewNote("");
      fetchSubOrders();
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, note: newNote });
      }
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant='secondary'
            className='bg-yellow-100 text-yellow-800 border-yellow-200'
          >
            Pending
          </Badge>
        );
      case "PENDING_ADMIN_ACCEPT":
        return (
          <Badge
            variant='secondary'
            className='bg-orange-100 text-orange-800 border-orange-200'
          >
            Pending Admin Accept
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge
            variant='secondary'
            className='bg-blue-100 text-blue-800 border-blue-200'
          >
            Accepted
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge
            variant='secondary'
            className='bg-purple-100 text-purple-800 border-purple-200'
          >
            In Progress
          </Badge>
        );
      case "DONE":
        return (
          <Badge
            variant='secondary'
            className='bg-green-100 text-green-800 border-green-200'
          >
            Completed
          </Badge>
        );
      case "REJECTED":
        return <Badge variant='destructive'>Rejected</Badge>;
      default:
        return <Badge variant='outline'>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className='flex h-[80vh] w-full items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='container mx-auto p-6 space-y-8'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div className='flex flex-col space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>
            Production Queue
          </h1>
          <p className='text-muted-foreground'>
            New production requests awaiting your review and acceptance.
          </p>
        </div>
        <Link href='/home/orders'>
          <Button variant='outline' className='flex gap-2 items-center'>
            <Boxes className='w-4 h-4' />
            View Order History
          </Button>
        </Link>
      </div>

      {subOrders.length === 0 ? (
        <Card className='flex flex-col items-center justify-center p-12 text-center'>
          <Package className='h-12 w-12 text-muted-foreground mb-4' />
          <CardTitle>Queue Clear</CardTitle>
          <CardDescription>
            You have no pending production requests at the moment.
          </CardDescription>
          <div className='mt-6'>
            <Link href='/home/orders'>
              <Button variant='secondary'>Check Order History</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {subOrders.map((subOrder) => (
            <Card
              key={subOrder.id}
              className='flex flex-col hover:shadow-lg transition-shadow duration-300'
            >
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-lg font-bold'>
                  Order #{subOrder.id.slice(0, 8)}
                </CardTitle>
                {getStatusBadge(subOrder.status)}
              </CardHeader>
              <CardContent className='grow space-y-6'>
                <div className='flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10'>
                  <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary'>
                    <UserCircle className='w-4 h-4' />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1'>
                      Ordering Brand
                    </span>
                    <span className='text-sm font-bold'>
                      {subOrder.order.brand.user.id.slice(0, 12)}...
                    </span>
                  </div>
                </div>

                <div className='space-y-3'>
                  <div className='flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                    <Info className='w-3.5 h-3.5' />
                    Specifications
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    {typeof subOrder.details === "object" &&
                    subOrder.details !== null ? (
                      Object.entries(
                        subOrder.details as Record<string, any>,
                      ).map(([key, value]) => (
                        <div
                          key={key}
                          className='flex flex-col p-2.5 bg-muted/30 rounded-xl border border-border/50 transition-colors hover:bg-muted/50'
                        >
                          <span className='text-[9px] font-bold uppercase text-muted-foreground mb-0.5'>
                            {key}
                          </span>
                          <span className='text-sm font-semibold capitalize'>
                            {String(value)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className='col-span-2 p-3 bg-muted/30 rounded-xl border border-border/50 text-sm'>
                        {String(subOrder.details)}
                      </div>
                    )}
                  </div>
                </div>

                {subOrder.note && (
                  <div className='relative p-4 rounded-xl bg-amber-500/5 border border-amber-500/10'>
                    <div className='flex items-center gap-2 mb-1.5'>
                      <MessageSquare className='w-3.5 h-3.5 text-amber-600' />
                      <span className='text-[10px] font-bold uppercase text-amber-700'>
                        Special Instructions
                      </span>
                    </div>
                    <p className='text-xs text-foreground/80 leading-relaxed italic'>
                      "{subOrder.note}"
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className='flex flex-col gap-2 pt-2'>
                <div className='flex w-full gap-2'>
                  <Button
                    variant='outline'
                    className='flex-1'
                    onClick={() => {
                      setSelectedOrder(subOrder);
                      setIsDetailsDialogOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                </div>
                {subOrder.status === "PENDING" && (
                  <div className='flex w-full gap-2'>
                    <Button
                      className='flex-1 bg-green-600 hover:bg-green-700'
                      onClick={() => handleAccept(subOrder.id)}
                    >
                      <CheckCircle2 className='mr-2 h-4 w-4' /> Accept
                    </Button>
                    <Button
                      variant='destructive'
                      className='flex-1'
                      onClick={() => {
                        setRejectId(subOrder.id);
                        setIsRejectDialogOpen(true);
                      }}
                    >
                      <XCircle className='mr-2 h-4 w-4' /> Reject
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Reject Order</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this order.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='reason'>Rejection Reason</Label>
              <Input
                id='reason'
                placeholder='e.g., Capacity exceeded, Material unavailable...'
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className='sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Package className='h-5 w-5' />
              Order Details - #{selectedOrder?.id.slice(0, 8)}
            </DialogTitle>
            <DialogDescription>
              Full information about the sub-order and associated brand.
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <ScrollArea className='grow pr-4'>
              <div className='space-y-6 py-4'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  <div className='space-y-4'>
                    <div className='bg-primary/5 p-4 rounded-2xl border border-primary/10 flex items-center gap-4'>
                      <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary'>
                        <UserCircle className='w-5 h-5' />
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider'>
                          Brand Partner
                        </span>
                        <span className='text-sm font-bold'>
                          {selectedOrder.order.brand.user.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-1.5'>
                      <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>
                        Current Status
                      </p>
                      <div className='flex'>
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                    </div>
                    <div className='space-y-1.5'>
                      <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>
                        Submission Date
                      </p>
                      <div className='flex items-center gap-2 text-sm font-medium'>
                        <Calendar className='w-3.5 h-3.5 text-primary' />
                        {new Date(selectedOrder.createdAt).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className='space-y-3'>
                  <h3 className='font-semibold text-lg flex items-center gap-2'>
                    <Info className='h-4 w-4 text-primary' /> Manufacturing
                    Specification
                  </h3>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2'>
                    {/* @ts-ignore */}
                    {typeof selectedOrder.details === "object" &&
                    selectedOrder.details !== null ? (
                      Object.entries(
                        selectedOrder.details as Record<string, any>,
                      ).map(([key, value]) => (
                        <div
                          key={key}
                          className='flex flex-col p-3 bg-muted/40 rounded-xl border border-border/50 transition-all hover:bg-muted/60'
                        >
                          <span className='text-[10px] font-bold uppercase text-muted-foreground mb-1'>
                            {key}
                          </span>
                          <span className='text-sm font-semibold capitalize'>
                            {String(value)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className='col-span-2 p-4 bg-muted/40 rounded-xl border border-border/50'>
                        <p className='text-sm'>
                          {String(selectedOrder.details)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className='space-y-3'>
                  <h3 className='font-semibold text-lg flex items-center gap-2'>
                    <MessageSquare className='h-4 w-4' /> Notes & Communication
                  </h3>
                  <div className='space-y-4'>
                    {selectedOrder.note ? (
                      <div className='bg-primary/5 p-4 rounded-lg border border-primary/10'>
                        <p className='text-sm'>{selectedOrder.note}</p>
                      </div>
                    ) : (
                      <p className='text-sm text-muted-foreground italic'>
                        No notes added yet.
                      </p>
                    )}

                    {selectedOrder.status === "REJECTED" &&
                      selectedOrder.rejectionReason && (
                        <div className='bg-destructive/5 p-4 rounded-lg border border-destructive/10'>
                          <p className='text-sm font-medium text-destructive'>
                            Rejection Reason:
                          </p>
                          <p className='text-sm'>
                            {selectedOrder.rejectionReason}
                          </p>
                        </div>
                      )}

                    <div className='space-y-2 pt-2'>
                      <Label htmlFor='new-note'>Add or Update Note</Label>
                      <div className='flex gap-2'>
                        <Input
                          id='new-note'
                          placeholder='Type your note here...'
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                        />
                        <Button
                          variant='secondary'
                          onClick={() => handleAddNote(selectedOrder.id)}
                        >
                          Save Note
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}

          <DialogFooter className='pt-4 border-t'>
            <Button onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

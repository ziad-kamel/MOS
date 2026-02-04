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
  DialogTrigger,
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
} from "lucide-react";

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
      setSubOrders(data);
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
      await updateSubOrderStatus(id, "ACCEPTED");
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
      // If we are in details dialog, update the selected order too
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
      <div className='flex flex-col space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>
          Manufacturer Dashboard
        </h1>
        <p className='text-muted-foreground'>
          Manage your assigned orders and production status.
        </p>
      </div>

      {subOrders.length === 0 ? (
        <Card className='flex flex-col items-center justify-center p-12 text-center'>
          <Package className='h-12 w-12 text-muted-foreground mb-4' />
          <CardTitle>No Orders Assigned</CardTitle>
          <CardDescription>
            You don't have any orders assigned to you at the moment.
          </CardDescription>
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
              <CardContent className='grow space-y-4'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Brand
                  </p>
                  <p className='text-base'>{subOrder.order.brand.user.id}</p>
                </div>
                <div className='space-y-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Details
                  </p>
                  <pre className='text-xs bg-muted p-2 rounded-md overflow-auto max-h-24'>
                    {JSON.stringify(subOrder.details, null, 2)}
                  </pre>
                </div>
                {subOrder.note && (
                  <div className='space-y-1'>
                    <p className='text-sm font-medium text-muted-foreground'>
                      Note
                    </p>
                    <p className='text-sm italic'>"{subOrder.note}"</p>
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
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium text-muted-foreground uppercase tracking-wider'>
                      Status
                    </p>
                    <div>{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                  <div className='space-y-1'>
                    <p className='text-sm font-medium text-muted-foreground uppercase tracking-wider'>
                      Date Created
                    </p>
                    <p>
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className='space-y-3'>
                  <h3 className='font-semibold text-lg flex items-center gap-2'>
                    <Info className='h-4 w-4' /> Manufacturing Specification
                  </h3>
                  <div className='bg-muted p-4 rounded-lg'>
                    {typeof selectedOrder.details === "object" &&
                    selectedOrder.details !== null ? (
                      <div className='grid grid-cols-2 gap-y-2'>
                        {Object.entries(selectedOrder.details).map(
                          ([key, value]) => (
                            <React.Fragment key={key}>
                              <span className='font-medium capitalize'>
                                {key}:
                              </span>
                              <span>{String(value)}</span>
                            </React.Fragment>
                          ),
                        )}
                      </div>
                    ) : (
                      <p>{String(selectedOrder.details)}</p>
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

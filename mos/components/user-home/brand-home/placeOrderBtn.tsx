"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import SubOrderMenu, { SubOrderData } from "./subOrder-menu";
import { createOrderSchema } from "@/lib/schemas";
import { createOrder } from "@/data-acess/DAO/orderDTO";
import { useUser } from "@/providers/user-provider";

import { toast } from "sonner";

export function PlaceOrderBtn() {
  const { user } = useUser();
  const [subOrders, setSubOrders] = useState<SubOrderData[]>([]);
  const [orderNotes, setOrderNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);

  const addSubOrder = (data: SubOrderData) => {
    setSubOrders((prev) => [...prev, data]);
    setErrors((prev) => ({ ...prev, subOrders: "" }));
  };

  const removeSubOrder = (index: number) => {
    setSubOrders((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = createOrderSchema.safeParse({
      notes: orderNotes || undefined,
      subOrders: subOrders,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        fieldErrors[err.path.join(".")] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    console.log("Submitting Valid Order:", result.data);

    const submitOrder = async () => {
      try {
        await createOrder({
          brandId: user?.id || "",
          subOrders: result.data.subOrders,
        });
        toast.success("Order created successfully");
        setSubOrders([]);
        setOrderNotes("");
        setOpen(false);
      } catch (error: any) {
        console.error("Order creation failed:", error);
        toast.error("Failed to create order: " + (error.message || error));
      }
    };

    submitOrder();
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          PlaceOrder <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className='2xl:max-w-2xl'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
            <DialogDescription>
              Enter the details of the new order and add sub-orders.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className='mt-4'>
            <Field data-invalid={!!errors["notes"]}>
              <Label htmlFor='order-notes'>Order Notes</Label>
              <Input
                id='order-notes'
                placeholder='General order notes'
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
              />
              {errors["notes"] && <FieldError>{errors["notes"]}</FieldError>}
            </Field>

            <div className='mt-6'>
              <div className='flex items-center justify-between mb-2'>
                <Label className='text-lg font-semibold'>
                  Sub Orders ({subOrders.length})
                </Label>
                <SubOrderMenu onAdd={addSubOrder} />
              </div>

              {errors["subOrders"] && (
                <FieldError className='mb-2'>{errors["subOrders"]}</FieldError>
              )}

              {subOrders.length === 0 ? (
                <div className='text-sm text-muted-foreground border border-dashed rounded-md p-8 text-center'>
                  No sub-orders added yet. Click "Add Sub Order" to start.
                </div>
              ) : (
                <div className='space-y-3 max-h-64 overflow-y-auto pr-2'>
                  {subOrders.map((sub, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-3 border rounded-lg bg-muted/50'
                    >
                      <div className='space-y-1'>
                        <p className='text-sm font-medium'>
                          Manufacturer ID: {sub.manufacturerId}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {sub.details.color}, {sub.details.size}, Qty:{" "}
                          {sub.details.quantity}
                        </p>
                        {sub.note && (
                          <p className='text-xs italic truncate'>
                            Note: {sub.note}
                          </p>
                        )}
                      </div>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() => removeSubOrder(index)}
                        className='text-destructive hover:text-destructive hover:bg-destructive/10'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FieldGroup>

          <DialogFooter className='mt-6'>
            <DialogClose asChild>
              <Button variant='outline' type='button'>
                Cancel
              </Button>
            </DialogClose>
            <Button type='submit'>Create Order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

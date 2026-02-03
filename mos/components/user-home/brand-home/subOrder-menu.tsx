"use client";
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
import React, { useState } from "react";
import ManufacturerSelector from "./manufacturer-selector";
import { createSubOrderSchema } from "@/lib/schemas";
import { z } from "zod";

export type SubOrderData = z.infer<typeof createSubOrderSchema>;

export default function SubOrderMenu({
  onAdd,
}: {
  onAdd: (data: SubOrderData) => void;
}) {
  const [open, setOpen] = useState(false);
  const [manufacturerId, setManufacturerId] = useState("");
  const [note, setNote] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    const result = createSubOrderSchema.safeParse({
      manufacturerId,
      note: note || undefined,
      details: {
        color,
        size,
        quantity,
      },
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const path = err.path.join(".");
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onAdd(result.data);

    // Reset state
    setManufacturerId("");
    setNote("");
    setColor("");
    setSize("");
    setQuantity(1);
    setErrors({});
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Add Sub Order</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Add Sub Order</DialogTitle>
          <DialogDescription>
            Enter the details of the new sub order.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field data-invalid={!!errors["manufacturerId"]}>
            <Label>Select Manufacturer</Label>
            <ManufacturerSelector
              value={manufacturerId}
              onValueChange={(val) => {
                setManufacturerId(val);
                setErrors((prev) => ({ ...prev, manufacturerId: "" }));
              }}
            />
            {errors["manufacturerId"] && (
              <FieldError>{errors["manufacturerId"]}</FieldError>
            )}
          </Field>
          <Field data-invalid={!!errors["details.color"]}>
            <Label>Details - Color</Label>
            <Input
              placeholder='Color'
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                setErrors((prev) => ({ ...prev, "details.color": "" }));
              }}
            />
            {errors["details.color"] && (
              <FieldError>{errors["details.color"]}</FieldError>
            )}
          </Field>
          <Field data-invalid={!!errors["details.size"]}>
            <Label>Details - Size</Label>
            <Input
              placeholder='Size'
              value={size}
              onChange={(e) => {
                setSize(e.target.value);
                setErrors((prev) => ({ ...prev, "details.size": "" }));
              }}
            />
            {errors["details.size"] && (
              <FieldError>{errors["details.size"]}</FieldError>
            )}
          </Field>
          <Field data-invalid={!!errors["details.quantity"]}>
            <Label>Details - Quantity</Label>
            <Input
              type='number'
              placeholder='Quantity'
              value={quantity}
              onChange={(e) => {
                setQuantity(parseInt(e.target.value) || 0);
                setErrors((prev) => ({ ...prev, "details.quantity": "" }));
              }}
            />
            {errors["details.quantity"] && (
              <FieldError>{errors["details.quantity"]}</FieldError>
            )}
          </Field>
          <Field>
            <Label>Notes (Optional)</Label>
            <Input
              placeholder='Optional notes'
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Add to Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { z } from "zod";

export const UserRoleEnum = z.enum([
  "ADMIN",
  "SUPER_ADMIN",
  "BRAND",
  "MANUFACTURER",
]);
export const OrderStatusEnum = z.enum([
  "PENDING",
  "ACCEPTED",
  "IN_PROGRESS",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

// --- Base Models ---

export const rankSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Rank name is required"),
  amount: z.number().int().nonnegative().default(0),
});

export const userSchema = z.object({
  id: z.string().uuid().optional(),
  role: UserRoleEnum,
});

export const adminSchema = z.object({
  id: z.string().uuid(),
});

export const superAdminSchema = z.object({
  id: z.string().uuid(),
});

export const brandSchema = z.object({
  id: z.string().uuid(),
  rankId: z.string().uuid(),
  warehouseAddress: z.string().min(1, "Warehouse address is required"),
  contactNo1: z.string().min(1, "Contact number is required"),
  contactNo2: z.string().optional().nullable(),
});

export const manufacturerSchema = z.object({
  id: z.string().uuid(),
  rankId: z.string().uuid(),
  factoryAddress: z.string().min(1, "Factory address is required"),
  limitPerOrder: z.number().int().positive("Limit per order must be positive"),
  contactNo1: z.string().min(1, "Contact number is required"),
  contactNo2: z.string().optional().nullable(),
});

// --- Orders ---

export const subOrderSchema = z.object({
  id: z.string().uuid().optional(),
  orderId: z.string().uuid(),
  note: z.string().optional().nullable(),
  rejectionReason: z.string().optional().nullable(),
  status: z.string().default("PENDING"),
  attachments: z.array(z.string()).default([]),
  details: z.object({
    color: z.string(),
    size: z.string(),
    quantity: z.number().int().positive(),
  }),
});

export const orderSchema = z.object({
  id: z.string().uuid().optional(),
  brandId: z.string().uuid(),
  adminId: z.string().uuid().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: OrderStatusEnum.default("PENDING"),
});

// --- Form & Action Schemas ---

export const registerBrandSchema = z.object({
  warehouseAddress: z.string().min(1, "Warehouse address is required"),
  contactNo1: z.string().min(1, "Contact number is required"),
  contactNo2: z.string().optional(),
});

export const registerManufacturerSchema = z.object({
  factoryAddress: z.string().min(1, "Factory address is required"),
  limitPerOrder: z.string().min(1, "Limit per order is required"),
  contactNo1: z.string().min(1, "Contact number is required"),
  contactNo2: z.string().optional(),
});

// Combined registration schema
export const registerSchema = z.discriminatedUnion("role", [
  z.object({
    warehouseAddress: z.string().min(1, "Warehouse address is required"),
    contactNo1: z.string().min(1, "Contact number is required"),
    contactNo2: z.string().optional(),
  }),
  z.object({
    factoryAddress: z.string().min(1, "Factory address is required"),
    limitPerOrder: z
      .number()
      .int()
      .positive("Limit per order must be positive"),
    contactNo1: z.string().min(1, "Contact number is required"),
    contactNo2: z.string().optional(),
  }),
]);

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Signup schema
export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Generic update schema could be more complex now,
// using partials of the profile schemas
export const updateBrandSchema = brandSchema
  .partial()
  .omit({ id: true, rankId: true });
export const createSubOrderSchema = z.object({
  manufacturerId: z.string().uuid("Please select a manufacturer"),
  note: z.string().optional(),
  details: z.object({
    color: z.string().min(1, "Color is required"),
    size: z.string().min(1, "Size is required"),
    quantity: z.number().int().positive("Quantity must be at least 1"),
  }),
});

export const createOrderSchema = z.object({
  notes: z.string().optional(),
  subOrders: z
    .array(createSubOrderSchema)
    .min(1, "At least one sub-order is required"),
});

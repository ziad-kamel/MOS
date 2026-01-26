import { z } from "zod";

// User schema for API validation
export const registerUserSchema = z.object({
  role: z.enum(["BRAND", "MANUFACTURER"]),
  companyName: z.string().min(1, "Company name is required"),
  contactInfo: z.object({
    phone: z.string().min(1, "Phone number is required"),
    address: z.string().min(1, "Address is required"),
    contactPerson: z.string().min(1, "Contact person is required"),
  }),
});

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

// Update user schema
export const updateUserSchema = z.object({
  companyName: z.string().min(1, "Company name is required").optional(),
  contactInfo: z.object({
    phone: z.string().optional(),
    address: z.string().optional(),
    contactPerson: z.string().optional(),
  }),
});

// Delete user schema
export const deleteUserSchema = z.object({
  email: z.string().email("Invalid email address"),
});

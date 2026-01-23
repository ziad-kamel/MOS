import { z } from 'zod';

// User schema for API validation
export const userSchema = z.object({
  role: z.enum(['brand', 'manufacturer', 'admin']),
  companyName: z.string().min(1, 'Company name is required'),
  contactInfo: z.object({
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Signup schema
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Update user schema
export const updateUserSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  contactInfo: z.object({
    phone: z.string().optional(),
    address: z.string().optional(),
    contactPerson:z.string().optional()
  }),
});

// Delete user schema
export const deleteUserSchema = z.object({
  email: z.string().email('Invalid email address'),
});

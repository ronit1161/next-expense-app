import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

export const expenseSchema = z.object({
  categoryId: z.coerce.number().int().positive('Category is required'),
  amount: z.coerce.number().positive('Amount must be a positive number'),
  description: z.string().max(255).optional().nullable(),
  paymentMethod: z.enum(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'NET_BANKING'], {
    errorMap: () => ({ message: 'Invalid payment method' }),
  }),
  expenseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted YYYY-MM-DD'),
});

export const budgetSchema = z.object({
  categoryId: z.coerce.number().int().positive('Category is required'),
  amount: z.coerce.number().positive('Budget amount must be positive'),
  month: z.coerce.number().int().min(1).max(12, 'Month must be between 1 and 12'),
  year: z.coerce.number().int().min(2000).max(2100, 'Year must be between 2000 and 2100'),
});

export const loanSchema = z.object({
  contactName: z.string().min(2, 'Contact name must be at least 2 characters').max(100),
  contactEmail: z.string().email('Invalid email format').optional().nullable().or(z.literal('')),
  contactPhone: z.string().max(20).optional().nullable().or(z.literal('')),
  type: z.enum(['LENT', 'BORROWED'], {
    errorMap: () => ({ message: 'Type must be LENT or BORROWED' }),
  }),
  amount: z.coerce.number().positive('Amount must be a positive number'),
  description: z.string().max(255).optional().nullable(),
  loanDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted YYYY-MM-DD'),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted YYYY-MM-DD').optional().nullable().or(z.literal('')),
});

export const settlementSchema = z.object({
  amount: z.coerce.number().positive('Settlement amount must be positive'),
  paymentMethod: z.enum(['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'NET_BANKING'], {
    errorMap: () => ({ message: 'Invalid payment method' }),
  }),
  settlementDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted YYYY-MM-DD'),
  notes: z.string().max(255).optional().nullable(),
});

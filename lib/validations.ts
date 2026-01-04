import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export const tradeSchema = z.object({
  coin: z.string().min(1, 'Coin is required').max(10, 'Coin symbol too long'),
  type: z.enum(['Long', 'Short']),
  entryPrice: z.number().positive('Entry price must be positive'),
  exitPrice: z.number().positive('Exit price must be positive').optional().nullable(),
  quantity: z.number().positive('Quantity must be positive'),
  status: z.enum(['Open', 'Closed', 'Cancelled']),
  notes: z.string().optional(),
  entryDate: z.string().or(z.date()),
  exitDate: z.string().or(z.date()).optional().nullable(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type TradeInput = z.infer<typeof tradeSchema>


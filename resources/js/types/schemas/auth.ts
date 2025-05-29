import { z } from 'zod';

export const nameSchema = z
  .string()
  .trim()
  .min(1, 'Username is required')
  .min(3, 'Username must be at least 3 characters long')
  .max(30, "Username can't be longer than 30 characters");

export const emailSchema = z.string().trim().min(1, 'Email is required').max(255, "Email can't be longer than 255 characters").email();

export const passwordSchema = z
  .string()
  .trim()
  .min(8, 'Password must be at least 8 characters')
  .max(255, "Password can't be longer than 255 characters")
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one digit')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterArgs = z.infer<typeof registerSchema>;

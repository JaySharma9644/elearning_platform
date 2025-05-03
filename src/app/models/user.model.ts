import { z } from 'zod';

// Base user schema
export const userSchema = z.object({
  id: z.number().optional(),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  resetCode: z.string().optional()
});

// Schema for user registration
export const userRegistrationSchema = userSchema.omit({ 
  id: true, 
  createdAt: true,
});

// Schema for user login
export const userLoginSchema = userSchema.pick({ 
  email: true, 
  password: true 
});

// Types derived from schemas
export type User = z.infer<typeof userSchema>;
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;

// Response schemas
export const userResponseSchema = userSchema.omit({ 
  password: true 
});

export type UserResponse = z.infer<typeof userResponseSchema>;

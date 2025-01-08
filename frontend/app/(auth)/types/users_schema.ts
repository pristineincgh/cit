// import { patterns } from '@/lib/utils';
import { z } from 'zod';

// Schema for validating login request data
export const loginRequestSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

// Type for login request input
export type LoginRequestInput = z.infer<typeof loginRequestSchema>;

// Default values for login request
export const defaultLoginValues: LoginRequestInput = {
  username: '',
  password: '',
};

// Schema for validating login response data
export const loginResponseSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
  email: z.string(),
  role: z.enum(['agent', 'admin', 'superadmin']),
  is_active: z.boolean(),
  is_verified: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Type for login response
export type LoginResponse = z.infer<typeof loginResponseSchema>;

// Schema for session data
export const sessionSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: loginResponseSchema,
});

// Type for session data
export type SessionData = z.infer<typeof sessionSchema>;

export interface UserTicketPublic {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

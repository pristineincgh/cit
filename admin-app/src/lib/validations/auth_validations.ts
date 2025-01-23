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

// import { patterns } from '@/lib/utils';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  // .regex(patterns.password, {
  //   message:
  //     'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  // }),
  // remember: z.boolean(),
});

export type LoginInputSchema = z.infer<typeof loginSchema>;

export const defaultValues: LoginInputSchema = {
  email: '',
  password: '',
  // remember: false,
};

// user schema
export const userSchema = z.object({
  user_id: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  username: z.string(),
  email: z.string(),
  role: z.enum(['user', 'admin']),
});

// user schema type
export type UserSchema = z.infer<typeof userSchema>;

// session schema
export const sessionSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: userSchema,
});

// session schema type
export type SessionSchema = z.infer<typeof sessionSchema>;

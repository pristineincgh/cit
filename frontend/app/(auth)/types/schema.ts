// import { patterns } from '@/lib/utils';
import { z } from 'zod';

export const schema = z.object({
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

export type LoginInputSchema = z.infer<typeof schema>;

export const defaultValues: LoginInputSchema = {
  email: '',
  password: '',
  // remember: false,
};

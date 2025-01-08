// import { z } from 'zod';

// export const schema = z.object({
//   id: z.string(),
//   name: z.string().min(1, { message: 'Name is required' }),
//   email: z
//     .string()
//     .min(1, { message: 'Email is required' })
//     .email({ message: 'Invalid email' }),
//   password: z
//     .string()
//     .min(8, { message: 'Password must be at least 8 characters' })
//     .regex(patterns.password, {
//       message:
//         'Password must contain at least one uppercase letter, one lowercase letter, and one number',
//     }),
//   socials: z.object({
//     twitter: z.string().optional(),
//     github: z.string().optional(),
//     linkedin: z.string().optional(),
//   }),
//   phoneNumbers: z.array(z.string()).optional(),
// });

export interface Customer {
  id: string;
  name: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerTicketPublic {
  id: string;
  name: string;
  phone_number: string;
}

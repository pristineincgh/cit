import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().nonempty({ message: 'Name is required' }),
  phone_number: z
    .string()
    .nonempty({ message: 'Phone number is required' })
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

export interface CustomerCreate {
  name: string;
  phone_number: string;
}

export interface CustomerPublic {
  id: string;
  name: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerShortDetails {
  id: string;
  name: string;
  phone_number: string;
}

export interface CustomerList {
  total: number;
  customers: CustomerShortDetails[];
}

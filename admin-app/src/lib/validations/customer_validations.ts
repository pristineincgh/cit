import { z } from 'zod';

export const customerFormSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .nonempty('Name is required'),
  phone_number: z
    .string()
    .nonempty('Phone number is required')
    .refine(
      (value) => {
        // Remove any spaces or special characters
        const cleanPhone = value.replace(/\s+/g, '');

        // Pattern for numbers starting with 233
        const pattern233 = /^233(20|23|24|25|26|27|50|54|55|56|57|58|59)\d{7}$/;

        // Pattern for numbers starting with 0
        const pattern0 = /^0(20|23|24|25|26|27|50|54|55|56|57|58|59)\d{7}$/;

        return pattern233.test(cleanPhone) || pattern0.test(cleanPhone);
      },
      {
        message: 'Phone number must be a valid number',
      }
    ),
});

import { z } from "zod";

// Schema for validating login request data
export const loginRequestSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

// Type for login request input
export type LoginRequestInput = z.infer<typeof loginRequestSchema>;

// Default values for login request
export const defaultLoginValues: LoginRequestInput = {
  username: "",
  password: "",
};

// Schema for validating password reset request data
export const resetPasswordSchema = z
  .object({
    token: z.string(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // This will attach the error to the confirmPassword field
  });

// Type for password reset request input
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

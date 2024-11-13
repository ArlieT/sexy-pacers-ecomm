import { z } from "zod";

// Define the Zod schema
export const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  mobile: z.string().min(1, "Mobile number is required"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type TLogin = z.infer<typeof loginSchema>;
export type TUser = z.infer<typeof userSchema>;

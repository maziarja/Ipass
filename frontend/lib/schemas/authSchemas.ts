import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.email("Invalid email address").max(200),
    password: z.string().min(6, "Minimum 6 characters").max(200),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const setupMasterSchema = z
  .object({
    masterPassword: z.string().min(8, "Minimum 8 characters"),
    confirmMasterPassword: z
      .string()
      .min(1, "Please confirm your master password"),
  })
  .refine((d) => d.masterPassword === d.confirmMasterPassword, {
    message: "Passwords do not match",
    path: ["confirmMasterPassword"],
  });

export type SetupMasterFormData = z.infer<typeof setupMasterSchema>;

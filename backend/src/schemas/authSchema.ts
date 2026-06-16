import z from "zod";

export const authSchema = z.object({
  email: z.email().trim().min(1).max(200).toLowerCase(),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 character")
    .max(200),
});

export const masterPasswordSchema = z.object({
  masterSalt: z.string().trim().min(1).max(200),
  masterVerify: z.string().trim().min(1).max(200),
});

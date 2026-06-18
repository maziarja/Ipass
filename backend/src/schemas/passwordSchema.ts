import z from "zod";

export const passwordSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  url: z
    .url()
    .max(200)
    .optional()
    .transform((v) => v ?? null),
  category: z.string().min(1, "Title is required").max(10000),
  encrypted: z.string().min(1, "Title is required").max(10000),
});

export const updatePasswordSchema = z.object({
  title: z.string().min(1, "Title is required").max(200).optional(),
  url: z
    .url()
    .max(200)
    .optional()
    .transform((v) => v ?? null),
  category: z.string().min(1, "Title is required").max(200).optional(),
  encrypted: z.string().min(1, "Title is required").max(10000).optional(),
});

export type PasswordSchema = z.infer<typeof passwordSchema>;

export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;

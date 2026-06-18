import { z } from "zod";

export const addPasswordSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.url("Must be a valid URL").or(z.literal("")).optional(),
  category: z.string().min(1, "Category is required"),
  password: z.string().min(1, "Password is required"),
});
export type AddPasswordFormData = z.infer<typeof addPasswordSchema>;

export const editPasswordSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.url("Must be a valid URL").or(z.literal("")).optional(),
  category: z.string().min(1, "Category is required"),
  password: z.string().optional(),
});
export type EditPasswordFormData = z.infer<typeof editPasswordSchema>;

export const CATEGORIES = [
  "Social",
  "Banking",
  "Email",
  "Work",
  "Shopping",
  "Other",
] as const;

import z from "zod";

export const createResponseSchema = <T extends z.ZodType>(dataSchema: T) => {
  return z.object({
    status: z.enum(["success", "fail"]),
    message: z.string().optional(),
    data: dataSchema.nullable(),
  });
};

export const userDataSchema = z.object({
  id: z.string(),
  email: z.email(),
  masterSalt: z.string().nullable(),
  masterVerify: z.string().nullable(),
  createdAt: z.string(),
});

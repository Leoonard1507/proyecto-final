import { z } from "zod";

export const changePasswordSchema = z.object({
  newPassword: z.string().min(7, "The new password must contain at least 7 characters"),
  repeatPassword: z.string(), })
  .refine((data) => data.newPassword === data.repeatPassword, {
    message: "Passwords don't match",
    path: ["repeatPassword"],
  });
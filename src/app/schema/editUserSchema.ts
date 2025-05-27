import { z } from "zod";

export const editUserSchema = z.object({
  nickname: z.string().min(2, "Nickname must have at least 2 letters"),
  username: z.string().min(2, "Name must have at least 2 letters"),
  description: z.string().min(2, "Description must have at least 2 letters"),
});
import { z } from "zod";

// Validar que la fecha es un string que puede ser convertido en una fecha válida
const dateSchema = z.string().refine((dateStr) => !isNaN(new Date(dateStr).getTime()), {
  message: "Invalid date",
});

// Validar los valores del registro
export const reisterSchema = z.object({
  nickname: z.string().min(2, "Nickname must have at least 2 letters"),
  username: z.string().min(2, "Name must have at least 2 letters").regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),
  birthdate: dateSchema, 
  usermail: z.string().email("Invalid email"),
  password: z.string().min(7, "The password must contain at least 7 characters"),
});

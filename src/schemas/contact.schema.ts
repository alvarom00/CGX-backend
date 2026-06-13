import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  company: z.string().trim().min(2).max(150),
  email: z.email().max(254),
  phone: z.string().trim().min(3).max(50),
  message: z.string().trim().min(10).max(5000),
  turnstileToken: z.string().min(1),
});

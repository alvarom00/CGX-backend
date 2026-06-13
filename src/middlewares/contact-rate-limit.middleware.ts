import { rateLimit } from "express-rate-limit";

export const contactRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Demasiadas consultas enviadas. Intenta nuevamente en 15 minutos.",
  },
});

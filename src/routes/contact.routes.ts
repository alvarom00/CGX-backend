import { Router } from "express";
import { submitContact } from "../controllers/contact.controller";
import { contactRateLimit } from "../middlewares/contact-rate-limit.middleware";

const router = Router();

router.post("/", contactRateLimit, submitContact);

export default router;

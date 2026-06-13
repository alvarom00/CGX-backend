import express from "express";
import cors from "cors";

import contactRoutes from "./routes/contact.routes";

const app = express();

const allowedOrigins = (
  process.env.CLIENT_URL ||
  "http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, !origin || allowedOrigins.includes(origin));
    },
  }),
);
app.use(express.json({ limit: "20kb" }));

app.use("/api/contact", contactRoutes);

app.get("/", (_, res) => {
  res.json({
    message: "CGX API funcionando",
  });
});

export default app;

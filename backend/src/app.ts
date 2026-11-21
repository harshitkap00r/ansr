import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";
import { FRONTEND_URL } from "./config/env";
import enquiryRoutes from "./routes/enquiryRoutes";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/enquiries", enquiryRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

export default app;
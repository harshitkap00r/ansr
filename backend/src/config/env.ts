import dotenv from "dotenv";

dotenv.config();

export const PORT = Number(process.env.PORT) || 8000;

export const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

export const FAKE_STORE_API_URL =
  process.env.FAKE_STORE_API_URL || "https://fakestoreapi.com";
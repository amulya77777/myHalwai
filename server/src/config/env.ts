// server/src/config/env.ts
import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";

dotenv.config();

function parseExpires(raw?: string): SignOptions["expiresIn"] {
  if (!raw) return undefined;
  const v = raw.trim();
  // digits-only -> number (seconds); otherwise keep as duration string like "7d", "1h"
  return /^\d+$/.test(v)
    ? Number(v)
    : (v as unknown as SignOptions["expiresIn"]);
}

export const env = {
  PORT: Number(process.env.PORT ?? 4000),
  MONGO_URI: process.env.MONGO_URI ?? "",
  JWT_SECRET: process.env.JWT_SECRET ?? "dev_secret",
  JWT_EXPIRES: parseExpires(process.env.JWT_EXPIRES),
  NODE_ENV: process.env.NODE_ENV ?? "development",
} as const;

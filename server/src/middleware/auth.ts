import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/User.js";

export interface AuthRequest extends Request {
  user?: { id: string; role: "user" | "admin" };
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      role: "user" | "admin";
    };
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) return res.status(401).json({ message: "Unauthenticated" });
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });
  next();
}

export async function attachUser(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  if (!req.user) return next();
  const u = await User.findById(req.user.id).lean();
  if (u) req.user.role = u.role;
  next();
}

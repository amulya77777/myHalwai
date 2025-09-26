import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler";

function signToken(id: string, role: "user" | "admin") {
  const payload = { id, role };
  const secret: Secret = env.JWT_SECRET;
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES };
  return jwt.sign(payload, secret, options);
}

// POST /api/auth/signup
export const signup = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const { email, password, name, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already in use" });

  const user = await User.create({
    email,
    password,
    name,
    role: role === "admin" ? "admin" : "user",
  });
  const token = signToken(user.id, user.role);
  res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

// POST /api/auth/login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user.id, user.role);
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

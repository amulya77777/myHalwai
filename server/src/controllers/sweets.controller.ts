import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Sweet from "../models/Sweet.js";
import { asyncHandler } from "../utils/asyncHandler";

export const createSweet = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const sweet = await Sweet.create(req.body);
  res.status(201).json(sweet);
});

export const listSweets = asyncHandler(async (_req: Request, res: Response) => {
  const sweets = await Sweet.find().sort({ createdAt: -1 });
  res.json(sweets);
});

export const searchSweets = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, category, minPrice, maxPrice } = req.query as any;
    const q: any = {};
    if (name) q.name = { $regex: name, $options: "i" };
    if (category) q.category = { $regex: category, $options: "i" };
    if (minPrice || maxPrice) {
      q.price = {};
      if (minPrice) q.price.$gte = Number(minPrice);
      if (maxPrice) q.price.$lte = Number(maxPrice);
    }
    const sweets = await Sweet.find(q).sort({ createdAt: -1 });
    res.json(sweets);
  }
);

export const updateSweet = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const { id } = req.params;
  const updated = await Sweet.findByIdAndUpdate(id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: "Sweet not found" });
  res.json(updated);
});

export const deleteSweet = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await Sweet.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ message: "Sweet not found" });
  res.json({ message: "Deleted" });
});

// Inventory actions
export const purchaseSweet = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const amount = Number(req.body.amount || 1);
    const sweet = await Sweet.findById(id);
    if (!sweet) return res.status(404).json({ message: "Sweet not found" });
    if (sweet.quantity < amount)
      return res.status(400).json({ message: "Insufficient stock" });
    sweet.quantity -= amount;
    await sweet.save();
    res.json({ message: "Purchased", remaining: sweet.quantity });
  }
);

export const restockSweet = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const amount = Number(req.body.amount);
    const sweet = await Sweet.findById(id);
    if (!sweet) return res.status(404).json({ message: "Sweet not found" });
    sweet.quantity += amount;
    await sweet.save();
    res.json({ message: "Restocked", quantity: sweet.quantity });
  }
);

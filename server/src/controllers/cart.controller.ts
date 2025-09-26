import { Response } from "express";
import { validationResult } from "express-validator";
import Sweet from "../models/Sweet.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthRequest } from "../middleware/auth.js";
import mongoose from "mongoose";

export const getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!.id).lean();
  res.json(user?.cart || []);
});

export const addToCart = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { sweetId, quantity = 1 } = req.body as {
      sweetId: string;
      quantity?: number;
    };
    const sweet = await Sweet.findById(sweetId);
    if (!sweet) return res.status(404).json({ message: "Sweet not found" });

    const user = await User.findById(req.user!.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const exists = user.cart.find((ci) => ci.sweet.toString() === sweetId);
    if (exists) {
      exists.quantity += quantity;
    } else {
      user.cart.push({
        sweet: new mongoose.Types.ObjectId(sweetId),
        name: sweet.name,
        price: sweet.price,
        imageUrl: sweet.imageUrl,
        quantity,
      });
    }

    await user.save();
    res.status(201).json(user.cart);
  }
);

export const removeCartItem = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { itemId } = req.params;
    const user = await User.findById(req.user!.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const before = user.cart.length;
    user.cart = user.cart.filter((ci) => ci._id!.toString() !== itemId);
    if (user.cart.length === before)
      return res.status(404).json({ message: "Cart item not found" });

    await user.save();
    res.json(user.cart);
  }
);

export const clearCart = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user!.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.cart = [];
    await user.save();
    res.json({ message: "Cart cleared" });
  }
);

export const checkout = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.findById(req.user!.id).session(session);
      if (!user) return res.status(404).json({ message: "User not found" });
      if (user.cart.length === 0)
        return res.status(400).json({ message: "Cart is empty" });

      for (const item of user.cart) {
        const sweet = await Sweet.findById(item.sweet).session(session);
        if (!sweet) {
          await session.abortTransaction();
          return res
            .status(404)
            .json({ message: `Sweet missing: ${item.name}` });
        }
        if (sweet.quantity < item.quantity) {
          await session.abortTransaction();
          return res
            .status(400)
            .json({ message: `Insufficient stock for ${sweet.name}` });
        }
      }

      for (const item of user.cart) {
        const sweet = await Sweet.findById(item.sweet).session(session);
        sweet!.quantity -= item.quantity;
        await sweet!.save({ session });
      }

      user.cart = [];
      await user.save({ session });

      await session.commitTransaction();
      session.endSession();
      res.json({ message: "Checkout success" });
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      throw e;
    }
  }
);

import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  addToCart,
  getCart,
  removeCartItem,
  clearCart,
  checkout,
} from "../controllers/cart.controller.js";
import {
  addToCartValidator,
  removeCartItemValidator,
} from "../validators/cart.validators.js";

const router = Router();

router.use(requireAuth);

router.get("/", getCart);
router.post("/add", addToCartValidator, addToCart);
router.delete("/item/:itemId", removeCartItemValidator, removeCartItem);
router.delete("/clear", clearCart);
router.post("/checkout", checkout);

export default router;

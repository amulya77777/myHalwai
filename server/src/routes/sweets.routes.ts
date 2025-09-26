import { Router } from "express";
import {
  createSweet,
  listSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} from "../controllers/sweets.controller.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import {
  createSweetValidator,
  searchSweetValidator,
  updateSweetValidator,
  inventoryActionValidator,
} from "../validators/sweets.validators.js";

const router = Router();

router.post("/", requireAuth, requireAdmin, createSweetValidator, createSweet);
router.get("/", requireAuth, listSweets);
router.get("/search", requireAuth, searchSweetValidator, searchSweets);
router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  updateSweetValidator,
  updateSweet
);
router.delete("/:id", requireAuth, requireAdmin, deleteSweet);

router.post(
  "/:id/purchase",
  requireAuth,
  inventoryActionValidator,
  purchaseSweet
);
router.post(
  "/:id/restock",
  requireAuth,
  requireAdmin,
  inventoryActionValidator,
  restockSweet
);

export default router;

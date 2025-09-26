import { body, param } from "express-validator";

export const addToCartValidator = [
  body("sweetId").isMongoId(),
  body("quantity").optional().isInt({ min: 1 }),
];

export const removeCartItemValidator = [param("itemId").isMongoId()];

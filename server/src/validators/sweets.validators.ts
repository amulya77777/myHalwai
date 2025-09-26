import { body, query, param } from "express-validator";

export const createSweetValidator = [
  body("name").isString().notEmpty(),
  body("category").isString().notEmpty(),
  body("price").isFloat({ min: 0 }),
  body("quantity").isInt({ min: 0 }),
  body("imageUrl").optional().isURL(),
];

export const updateSweetValidator = [
  param("id").isMongoId(),
  body("name").optional().isString().notEmpty(),
  body("category").optional().isString().notEmpty(),
  body("price").optional().isFloat({ min: 0 }),
  body("quantity").optional().isInt({ min: 0 }),
  body("imageUrl").optional().isURL(),
];

export const searchSweetValidator = [
  query("name").optional().isString(),
  query("category").optional().isString(),
  query("minPrice").optional().isFloat({ min: 0 }),
  query("maxPrice").optional().isFloat({ min: 0 }),
];

export const inventoryActionValidator = [
  param("id").isMongoId(),
  body("amount").isInt({ min: 1 }),
];

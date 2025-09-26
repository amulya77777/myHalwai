import { body } from "express-validator";

export const signupValidator = [
  body("email").isEmail(),
  body("password").isString().isLength({ min: 6 }),
  body("name").isString().isLength({ min: 2 }),
  body("role").optional().isIn(["user", "admin"]),
];

export const loginValidator = [
  body("email").isEmail(),
  body("password").isString().notEmpty(),
];

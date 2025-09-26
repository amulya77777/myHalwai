import { Router } from "express";
import { signup, login } from "../controllers/auth.controller.js";
import {
  loginValidator,
  signupValidator,
} from "../validators/auth.validators.js";

const router = Router();
// Frontend will use dialogs; backend still exposes these:
router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);

export default router;

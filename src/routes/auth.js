import { Router } from "express";
import {
  registerUserController,
  loginUserController,
  refreshUserController,
  logoutUserController,
} from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerUserSchema } from "../validation/auth.js";

const router = Router();

router.post("/register", validateBody(registerUserSchema), registerUserController);
router.post("/login", loginUserController);
router.post("/refresh", refreshUserController);
router.delete("/logout", logoutUserController);

export default router;

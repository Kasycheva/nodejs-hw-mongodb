import { Router } from "express";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserController,
  sendResetEmailController,
  resetPasswordController,
  getAllUsersController,
  deleteUserController,
} from "../controllers/auth.js";
import { validateBody } from "../middlewares/validateBody.js";
import { registerUserSchema, resetPasswordSchema } from "../validation/auth.js";

const authRouter = Router();

authRouter.post("/register", validateBody(registerUserSchema), registerUserController);
authRouter.post("/login", loginUserController);
authRouter.post("/logout", logoutUserController);
authRouter.post("/refresh", refreshUserController);
authRouter.post("/send-reset-email", sendResetEmailController);
authRouter.post("/reset-pwd", validateBody(resetPasswordSchema), resetPasswordController);
authRouter.get("/users", getAllUsersController);
authRouter.delete("/delete-user", deleteUserController);

export default authRouter;

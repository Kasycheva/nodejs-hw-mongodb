import { Router } from "express";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserController,
  sendResetEmailController,
  resetPasswordController,
  getAllUsersController,
  deleteUserController, requestResetTokenController
} from "../controllers/auth.js";

const authRouter = Router();

authRouter.post("/register", registerUserController);
authRouter.post("/login", loginUserController);
authRouter.post("/logout", logoutUserController);
authRouter.post("/refresh", refreshUserController);
authRouter.post("/send-reset-email", sendResetEmailController);
authRouter.post("/request-reset", requestResetTokenController);
authRouter.post("/reset-pwd", resetPasswordController);
authRouter.get("/users", getAllUsersController);
authRouter.delete("/delete-user", deleteUserController);


export default authRouter;


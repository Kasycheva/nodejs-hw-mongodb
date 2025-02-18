import { Router } from "express";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshUserController,
  requestResetTokenController,
  resetPasswordController,
  getAllUsersController,
  deleteUserController
} from "../controllers/auth.js";

const authRouter = Router();

authRouter.post("/register", registerUserController);
authRouter.post("/login", loginUserController);
authRouter.post("/logout", logoutUserController);
authRouter.post("/refresh", refreshUserController);
authRouter.post("/request-reset", requestResetTokenController);
authRouter.post("/reset-password", resetPasswordController);
authRouter.get("/users", getAllUsersController);
authRouter.delete("/delete-user", deleteUserController);



export default authRouter;

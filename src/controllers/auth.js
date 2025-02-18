import {
  registerUser,
  loginUser,
  refreshUser,
  logoutUser,
  requestResetToken,
  resetPassword,
  getAllUsers,
  deleteUser
} from "../services/auth.js";

export const registerUserController = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ status: 201, message: "User registered successfully!", data: user });
  } catch (error) {
    next(error);
  }
};

export const loginUserController = async (req, res, next) => {
  try {
    const user = await loginUser(req.body);
    res.status(200).json({ status: 200, message: "Login successful!", data: user });
  } catch (error) {
    next(error);
  }
};

export const refreshUserController = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "Refresh token is required" });

    const user = await refreshUser(refreshToken);
    res.status(200).json({ status: 200, message: "Token refreshed successfully!", data: user });
  } catch (error) {
    next(error);
  }
};

export const logoutUserController = async (req, res, next) => {
  try {
    await logoutUser(req.body.refreshToken);
    res.status(200).json({ status: 200, message: "Successfully logged out!" });
  } catch (error) {
    next(error);
  }
};

export const deleteUserController = async (req, res, next) => {
  try {
    await deleteUser(req.body.email);
    res.status(200).json({ status: 200, message: "User deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

export const requestResetTokenController = async (req, res, next) => {
  try {
    await requestResetToken(req.body.email);
    res.status(200).json({ status: 200, message: "Password reset token sent successfully!" });
  } catch (error) {
    next(error);
  }
};

export const getAllUsersController = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ status: 200, message: "Successfully retrieved all users!", data: users });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const {token, newPassword} = req.body
    if(!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }
    await resetPassword(token, newPassword);
    res.status(200).json({ status: 200, message: "Password reset successfully!" });
  } catch (error) {
    next(error);
  }
};


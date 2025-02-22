import {
  registerUser,
  loginUser,
  refreshUser,
  logoutUser,
  requestResetToken,
  resetPassword,
  getAllUsers,
  deleteUser,
} from "../services/auth.js";
import { getEnvVar } from "../utils/getEnvVar.js";
import { sendEmail } from "../utils/sendMail.js";
import { User } from "../db/models/user.js";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

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
    const { accessToken, refreshToken, sessionId } = await loginUser(req.body);

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "Strict" });
    res.cookie("sessionId", sessionId, { httpOnly: true, secure: true, sameSite: "Strict" });

    res.status(200).json({
      status: 200,
      message: "Login successful!",
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshUserController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw createHttpError(401, "Unauthorized");

    const { accessToken, newRefreshToken } = await refreshUser(refreshToken);

    res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true, sameSite: "Strict" });

    res.status(200).json({
      status: 200,
      message: "Token refreshed successfully!",
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUserController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw createHttpError(400, "Refresh token is required");

    await logoutUser(refreshToken);
    res.clearCookie("refreshToken");
    res.clearCookie("sessionId");

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const sendResetEmailController = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw createHttpError(404, "User not found");

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `${getEnvVar("APP_DOMAIN")}/reset-password?token=${resetToken}`;

    await sendEmail({
      from: getEnvVar("SMTP_FROM"),
      to: email,
      subject: "Reset Your Password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password!</p>`,
    });

    res.status(200).json({ status: 200, message: "Reset password email has been successfully sent.", data: {} });
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

export const resetPasswordController = async (req, res, next) => {
  try {
    const { token, password } = req.body; 
    if (!token || !password) return res.status(400).json({ message: "Token and password are required" });

    await resetPassword(token, password);

    res.status(200).json({ status: 200, message: "Password has been successfully reset.", data: {} });
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

export const deleteUserController = async (req, res, next) => {
  try {
    await deleteUser(req.body.email);
    res.status(200).json({ status: 200, message: "User deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

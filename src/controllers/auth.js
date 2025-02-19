import {
  requestResetToken,
  getAllUsers,
  deleteUser
} from "../services/auth.js";
import {getEnvVar} from "../utils/getEnvVar.js";
import {sendEmail} from "../utils/sendMail.js";
import {User} from "../db/models/user.js";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Session } from "../db/models/session.js";


export const registerUserController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) throw createHttpError(409, "Email already in use");

    const newUser = await User.create({ name, email, password });
    res.status(201).json({ status: 201, message: "User registered successfully!", data: newUser });
  } catch (error) {
    next(error);
  }
};

export const loginUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw createHttpError(401, "Invalid email");

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) throw createHttpError(401, "Invalid password");

    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET, { expiresIn: "30d" });

    await user.setRefreshToken(refreshToken);

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "Strict" });
    res.status(200).json({ status: 200, message: "Login successful!", accessToken });
  } catch (error) {
    next(error);
  }
};

export const refreshUserController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw createHttpError(401, "Unauthorized");

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) throw createHttpError(401, "Invalid refresh token");

    const newAccessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_SECRET, { expiresIn: "15m" });

    res.status(200).json({ status: 200, message: "Token refreshed successfully!", accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

export const logoutUserController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw createHttpError(400, "Refresh token is required");

    const user = await User.findOne({ refreshToken });
    if (!user) throw createHttpError(401, "Session not found");

    await user.clearRefreshToken();
    res.clearCookie("refreshToken");

    res.status(200).json({ status: 200, message: "Successfully logged out" });
  } catch (error) {
    next(error);
  }
};
export const sendResetEmailController = async (req, res, next) => {
  try {
    console.log("sendResetEmailController triggered");
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw createHttpError(404, "User not found");

    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `${getEnvVar("APP_DOMAIN")}/reset-password?token=${resetToken}`;

    await sendEmail({
      from: getEnvVar("SMTP_FROM"),
      to: email,
      subject: "Reset Your Password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password!</p>`
    });

    res.status(200).json({ message: "Reset Your Password email sent" });
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
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: "Token and new password are required" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) throw createHttpError(404, "User not found");

    console.log("Старий пароль:", user.password);

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();
    console.log("Пароль зміено і збережено");

    await Session.deleteMany({ userId: user._id });

    res.status(200).json({ status: 200, message: "Password reset successfully!" });
  } catch (error) {
    next(error);
  }
};


// export const resetPasswordControllerGET = async (req, res) => {
//   const {token} = req.params
//   if(!token) {
//     return res.status(400).json({ message: "Token is required" });
//   }
//   res.send(`<form action="">
    
//     </form>`)
// }
import createHttpError from "http-errors";
import { User } from "../db/models/user.js";
import { Session } from "../db/models/session.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendMail.js";
import { getEnvVar } from "../utils/getEnvVar.js";
import bcrypt from "bcryptjs";

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw createHttpError(409, "Email already in use");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });

  return newUser;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, "Invalid email");

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) throw createHttpError(401, "Invalid password");

  const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET, { expiresIn: "30d" });

  user.refreshToken = refreshToken;
  await user.save();

  await Session.deleteMany({ userId: user._id });

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
  });

  return { accessToken, refreshToken, sessionId: session._id };
};

export const refreshUser = async (refreshToken) => {
  if (!refreshToken) throw createHttpError(401, "Unauthorized");

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) throw createHttpError(401, "Session not found");

    const newAccessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
    const newRefreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET, { expiresIn: "30d" });

    user.refreshToken = newRefreshToken;
    await user.save();

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.error(error);
    throw createHttpError(401, "Invalid refresh token");
  }
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) throw createHttpError(400, "Refresh token is required");

  const user = await User.findOne({ refreshToken });
  if (!user) throw createHttpError(401, "Session not found");

  user.refreshToken = null;
  await user.save();
  await Session.deleteMany({ userId: user._id });

  return { message: "Successfully logged out" };
};

export const requestResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(404, "User not found");

  const resetToken = jwt.sign({ userId: user._id }, getEnvVar("JWT_SECRET"), { expiresIn: "15m" });

  const resetLink = `${getEnvVar("APP_DOMAIN")}/reset-password?token=${resetToken}`;

  await sendEmail({
    from: getEnvVar("SMTP_FROM"),
    to: email,
    subject: "Reset Your Password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password!</p>`,
  });

  return { message: "Reset password email sent" };
};

export const resetPassword = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, getEnvVar("JWT_SECRET"));
    const user = await User.findById(decoded.userId);
    if (!user) throw createHttpError(404, "User not found");

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await Session.deleteMany({ userId: user._id });

    return { message: "Password reset successfully" };
  } catch (error) {
    console.error(error);
    throw createHttpError(400, "Invalid or expired reset token");
  }
};

export const getAllUsers = async () => {
  return await User.find().select("-password");
};

export const deleteUser = async (email) => {
  const user = await User.findOneAndDelete({ email });
  if (!user) throw createHttpError(404, "User not found");

  await Session.deleteMany({ userId: user._id });
  return { message: "User deleted successfully" };
};

import createHttpError from "http-errors";
import { User } from "../db/models/user.js";
import jwt from "jsonwebtoken";
import { Session } from "../db/models/session.js";

export const registerUser = async (payload) => {
  const { email } = payload;  
  const existingUser = await User.findOne({ email });

  if (existingUser) throw createHttpError(409, "Email in use");

  const newUser = await User.create(payload);
  return newUser;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw createHttpError(401, "Invalid email or password");
  }

  const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET, { expiresIn: "30d" });

  await Session.deleteMany({ userId: user._id });

  const session = await Session.create({ userId: user._id, accessToken, refreshToken });

  return { accessToken, refreshToken, sessionId: session._id };
};

export const refreshUser = async (refreshToken) => {
  if (!refreshToken) throw createHttpError(401, "Unauthorized");

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  } catch (err) {
    throw createHttpError(401, "Invalid refresh token");
  }

  const session = await Session.findOne({ refreshToken });
  if (!session) throw createHttpError(401, "Session not found");

  const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_SECRET, { expiresIn: "15m" });

  session.accessToken = newAccessToken;
  await session.save();

  return { accessToken: newAccessToken };
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) throw createHttpError(401, "Unauthorized");

  const session = await Session.findOne({ refreshToken });
  if (!session) throw createHttpError(401, "Session not found");

  await Session.deleteOne({ _id: session._id });
};

import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { User } from "../db/models/user.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(createHttpError(401, "Unauthorized"));
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    } catch (error) {
      return next(createHttpError(401, "Invalid or expired token"));
    }

    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== req.cookies.refreshToken) {
      return next(createHttpError(401, "Session expired. Please login again."));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(createHttpError(401, "Invalid or expired token"));
  }
};

import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { User } from "../db/models/user.js";
import { Session } from "../db/models/session.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(createHttpError(401, "Unauthorized"));
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    if (!decoded) {
      return next(createHttpError(401, "Invalid or expired token"));
    }

    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      return next(createHttpError(401, "Session expired. Please login again."));
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(createHttpError(401, "User not found"));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(createHttpError(401, "Invalid or expired token"));
  }
};

import { registerUser, loginUser, refreshUser, logoutUser } from "../services/auth.js";

export const registerUserController = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      status: 201,
      message: "Successfully registered a user!",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUserController = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, sessionId } = await loginUser(req.body);

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });
    res.cookie("sessionId", sessionId, { httpOnly: true, secure: false });

    res.status(200).json({
      status: 200,
      message: "Successfully logged in a user!",
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshUserController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized, refreshToken missing!" });
    }

    const { accessToken } = await refreshUser(refreshToken);

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
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized, refreshToken missing!" });
    }

    await logoutUser(refreshToken);

    res.clearCookie("refreshToken");
    res.clearCookie("sessionId");

    res.status(204).send(); 
  } catch (error) {
    next(error);
  }
};

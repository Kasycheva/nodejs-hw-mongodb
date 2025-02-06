import { registerUser, loginUser, refreshUser, logoutUser } from "../services/auth.js";

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({
    status: 201,
    message: "Successfully registered a user!",
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const { accessToken, refreshToken } = await loginUser(req.body);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
  });

  res.status(200).json({
    status: 200,
    message: "Successfully logged in a user!",
    data: { accessToken },
  });
};

export const refreshUserController = async (req, res) => {
  const { refreshToken } = req.cookies;
  const newTokens = await refreshUser(refreshToken);

  res.cookie("refreshToken", newTokens.refreshToken, {
    httpOnly: true,
    secure: false,
  });

  res.status(200).json({
    status: 200,
    message: "Token refreshed successfully!",
    data: newTokens,
  });
};

export const logoutUserController = async (req, res) => {
  const { refreshToken } = req.cookies;
  await logoutUser(refreshToken);

  res.clearCookie("refreshToken");
  res.status(204).send();
};

import jwt from "jsonwebtoken";

export const generateTokens = (userId) => {
  console.log("Generating tokens", userId);

  const accessToken = jwt.sign({ userId }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_SECRET, { expiresIn: "30d" });

  return { accessToken, refreshToken };
};

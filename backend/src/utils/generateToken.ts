import type { Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";

export const generateToken = (userId: string, res: Response) => {
  const payload = { id: userId };

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT SECRET is undefined");
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  } as SignOptions);

  res?.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });

  return token;
};

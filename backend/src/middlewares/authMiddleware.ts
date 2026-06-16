import type { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../lib/prisma";

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) throw new Error("Unauthorized");

  if (process.env.JWT_SECRET === undefined)
    throw new Error("JWT secret not found");

  const decode = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

  const user = await prisma.user.findUnique({
    where: { id: decode.id },
    omit: { password: true },
  });

  if (!user) throw new Error("User not found");

  req.user = user;

  next();
};

import type { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";

async function register(req: Request, res: Response) {
  const existingUser = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (existingUser) throw new Error("You already have an account");

  const hashPassword = await bcrypt.hash(req.body.password, 12);

  const newUser = await prisma.user.create({
    data: {
      email: req.body.email,
      password: hashPassword,
    },
    omit: { password: true },
  });

  const token = generateToken(newUser.id, res);

  res.status(201).json({
    status: "success",
    user: newUser,
    jwt: token,
  });
}

async function login(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (!user) throw new Error("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) throw new Error("Invalid email or password");

  const token = generateToken(user.id, res);

  const { password, ...userData } = user;

  res.status(200).json({
    status: "success",
    data: userData,
    token,
  });
}

export const logout = (_req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

export const setupMaster = async (req: Request, res: Response) => {
  if (req.user.masterSalt) throw new Error("You already set a master password");

  await prisma.user.update({
    where: { id: req.user.id },
    data: {
      masterSalt: req.body.masterSalt,
      masterVerify: req.body.masterVerify,
    },
  });

  res.status(200).json({
    status: "success",
    message: "Master password setup successfully!",
  });
};

export const getMe = async (req: Request, res: Response) => {
  const user = req.user;
  const hasMasterPassword = !!user?.masterSalt;

  res.status(200).json({
    status: "success",
    data: {
      id: user?.id,
      email: user?.email,
      hasMasterPassword,
    },
  });
};

export default { login, register, logout, setupMaster, getMe };

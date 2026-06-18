import type { Request, Response } from "express";
import prisma from "../lib/prisma";

const getPasswords = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) throw new Error("Unauthorized");

  const passwords = await prisma.password.findMany({
    where: { userId: req.user.id },
  });

  res.status(200).json({
    status: "success",
    data: passwords,
  });
};

const createPassword = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) throw new Error("Unauthorized");

  const newPassword = await prisma.password.create({
    data: { userId: req.user.id, ...req.body },
  });

  res.status(201).json({
    status: "success",
    data: newPassword,
  });
};

const updatePassword = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) throw new Error("Unauthorized");

  const id = req.params.id as string;

  if (!id) throw new Error("Password Not found");

  const existing = await prisma.password.findUnique({
    where: { id, userId: req.user.id },
  });

  if (!existing) throw new Error("Password Not found");

  const updatedPassword = await prisma.password.update({
    where: { id, userId: req.user.id },
    data: req.body,
  });

  res.status(200).json({
    status: "success",
    data: updatedPassword,
  });
};

const deletePassword = async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) throw new Error("Unauthorized");

  const id = req.params.id as string;

  if (!id) throw new Error("Password Not found");

  await prisma.password.delete({ where: { id, userId: req.user.id } });

  res.status(204).send();
};

export default { getPasswords, createPassword, updatePassword, deletePassword };

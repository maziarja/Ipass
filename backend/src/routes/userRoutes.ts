import express from "express";
import authControllers from "../controllers/authControllers";
import { validatorMiddleware } from "../middlewares/validatorMiddleware";
import { authSchema, masterPasswordSchema } from "../schemas/authSchema";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/register",
  validatorMiddleware(authSchema),
  authControllers.register,
);

router.post("/login", validatorMiddleware(authSchema), authControllers.login);

router.post("/logout", authControllers.logout);

router.patch(
  "/setup-master",
  authMiddleware,
  validatorMiddleware(masterPasswordSchema),
  authControllers.setupMaster,
);

router.get("/me", authMiddleware, authControllers.getMe);

export default router;

import express from "express";
import passwordControllers from "../controllers/passwordControllers";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validatorMiddleware } from "../middlewares/validatorMiddleware";
import {
  passwordSchema,
  updatePasswordSchema,
} from "../schemas/passwordSchema";

const router = express.Router();

router.use(authMiddleware);

router
  .route("/")
  .get(passwordControllers.getPasswords)
  .post(
    validatorMiddleware(passwordSchema),
    passwordControllers.createPassword,
  );

router
  .route("/:id")
  .patch(
    validatorMiddleware(updatePasswordSchema),
    passwordControllers.updatePassword,
  )
  .delete(passwordControllers.deletePassword);

export default router;

import express from "express";
import type { Request, Response } from "express";

const app = express();

const router = express.Router();

app.get("/api/healthy", (_req: Request, res: Response) => {
  res.json({ message: "App is healthy" });
});

export default app;

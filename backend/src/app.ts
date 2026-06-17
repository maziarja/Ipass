import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import type { NextFunction, Request, Response } from "express";
import userRoute from "./routes/userRoutes";
import helmet from "helmet";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(helmet());

// cookie parser
app.use(cookieParser());

// body parser
app.use(express.json());

app.use("/api/auth", userRoute);

app.get("/api/healthy", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (process.env.NODE_ENV === "development") {
    console.log(err);
    res.status(500).json({
      status: "fail",
      message: err.message || err,
    });
  } else if (process.env.NODE_ENV === "production") {
    res.status(500).json({
      status: "fail",
      message: err.message || "Something went wrong",
    });
  }
});

export default app;

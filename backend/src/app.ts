import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import type { NextFunction, Request, Response } from "express";
import userRoute from "./routes/userRoutes";
import passwordRoute from "./routes/passwordRoutes";

const app = express();

// cors middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

// helmet middleware
app.use(helmet());

// cookie parser
app.use(cookieParser());

// body parser
app.use(express.json());

// check healthy
app.get("/api/healthy", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

// user route
app.use("/api/auth", userRoute);

// password route
app.use("/api/passwords", passwordRoute);

// error handling middleware
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

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
// import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import userRoutes from "./src/routes/UserRegister.js";
import UsersAction from "./src/routes/UserActionRoutes.js";
import groupRoutes from "./src/routes/Group.js";

import { Console, log } from "console";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan("common"));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5173",
      "https://expense-tracker-for-friends.vercel.app",
    ],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/api/get", UsersAction);
app.use("/api/auth", userRoutes);
app.use("/api/users", userRoutes);
app.use("/api/verify", userRoutes);

// Use the group routes for any requests starting with /api/groups
app.use("/api/groups", groupRoutes);

const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));

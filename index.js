import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
// import morgan from "morgan";
import path from "path";
import userRoutes from "./src/routes/UserRegister.js";
import { Console, log } from "console";
dotenv.config();
const app = express();
// app.use(helmet());
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:3001"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/api", (req, res) => {
  res.send("hello");
});
app.use("/api/users", userRoutes);
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));

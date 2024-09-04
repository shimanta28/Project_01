import express from "express";
import { createUser } from "../controllers/User.js";

const router = express.Router();

// Route to handle user registration
router.post("/register", createUser);

export default router;

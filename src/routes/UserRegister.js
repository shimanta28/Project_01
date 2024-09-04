import express from "express";
import { createUser } from "../controllers/User.js";
import { signIn } from "../controllers/UserSignIn.js";
import { me } from "../middleware/Me.js";

const router = express.Router();

// Route to handle user registration
router.post("/register", createUser);

router.post("/signin", signIn);

router.get("/account/me", me);

export default router;

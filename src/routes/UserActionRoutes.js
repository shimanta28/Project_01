import express from "express";
import {
  getAllUsers,
  getUserById,
} from "../controllers/UserActionController.js"; // Import multiple functions

const router = express.Router();

// Route to get all users
router.get("/users", getAllUsers);

// Route to get a user by ID
router.get("/users/:userId", getUserById);

export default router;

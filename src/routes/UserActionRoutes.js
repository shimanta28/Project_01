import express from "express";
import {
  getAllUsers,
  getUserById,
  addOrRemoveFriend,
} from "../controllers/UserActionController.js"; // Import multiple functions

const router = express.Router();

// Route to get all users
router.post("/users", getAllUsers);

// Route to get a user by ID
router.get("/users/:userId", getUserById);
router.post("/add-friend", addOrRemoveFriend);

export default router;

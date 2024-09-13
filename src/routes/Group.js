import express from "express";
import {
  createGroupAndUpdateUser,
  getAllGroups,
  getGroupById,
  createTransaction,
} from "../controllers/Groups.js"; // Import the controllers

const router = express.Router();

// Route to create a group
router.post("/create", createGroupAndUpdateUser);

// Route to get all groups
router.get("/all", getAllGroups);

router.get("/group/:_id", getGroupById);

// You can add more group-related routes here
router.post("/create-transaction", createTransaction);

export default router;

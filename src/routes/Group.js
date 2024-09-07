import express from "express";
import {
  createGroupAndUpdateUser,
  getAllGroups,
} from "../controllers/Groups.js"; // Import the controllers

const router = express.Router();

// Route to create a group
router.post("/create", createGroupAndUpdateUser);

// Route to get all groups
router.get("/all", getAllGroups);

// You can add more group-related routes here

export default router;

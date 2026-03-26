import express from "express";
import {
  registerUser,
  loginUser,
} from "../controllers/authController.js";

/*
  Auth Routes
  -----------
  Handles:
  - User registration
  - User login (JWT generation)
*/

const router = express.Router();

// ================= AUTH =================

// Register new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

export default router;
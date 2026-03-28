import express from "express";
import {
  registerUser,
  loginUser,
} from "../controllers/authController.js";
import rateLimit from "express-rate-limit";

/*
  Auth Routes
  -----------
  Handles:
  - User registration
  - User login (JWT generation)
*/

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});
// ================= AUTH =================

// Register new user
router.post("/register", registerUser);

// Login user
router.post("/login", authLimiter, loginUser);

export default router;
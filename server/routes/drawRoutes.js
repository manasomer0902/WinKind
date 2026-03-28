import express from "express";
import {
  runDraw,
  simulateDraw,
  getLatestDraw,
} from "../controllers/drawController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { requireSubscription } from "../middleware/subscriptionMiddleware.js";

/*
  Draw Routes
  -----------
  Base: /api/draw

  Rules:
  - Admin → run & simulate
  - Users → view results (subscription required)
*/

const router = express.Router();

// ================= ADMIN =================

// Run actual draw
router.post("/", protect, adminOnly, runDraw);

// Simulate draw (no DB save)
router.get("/simulate", protect, adminOnly, simulateDraw);

// ================= USER =================

// Get latest draw
router.get("/latest", getLatestDraw);

export default router;
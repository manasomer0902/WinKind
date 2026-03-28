import express from "express";
import {
  addCharity,
  getCharities,
  selectCharity,
  getUserCharity,
  deleteCharity,
} from "../controllers/charityController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

/*
  Charity Routes
  --------------
  Base: /api/charity

  Handles:
  - Admin: add & delete charities
  - Public: view charities
  - User: select charity & view selection
*/

const router = express.Router();

// ================= PUBLIC =================

// Get all charities
router.get("/", getCharities);   

// ================= USER =================

// Select charity
router.post("/select", protect, selectCharity);

// Get user's selected charity
router.get("/my", protect, getUserCharity);   

// ================= ADMIN =================

// Add charity
router.post("/add", protect, adminOnly, addCharity);

// Delete charity
router.delete("/:id", protect, adminOnly, deleteCharity);
export default router;
import express from "express";
import {
  createSubscription,
  getSubscription,
  cancelSubscription,
  getAllSubscriptions,
  updateSubscriptionStatus,
  createOrder,
  verifyPayment,
} from "../controllers/subscriptionController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

/*
  Subscription Routes
  -------------------
  Handles:
  - Creating subscription
  - Fetching current subscription
  - Cancelling subscription

  All routes require authentication
*/

const router = express.Router();

// ================= SUBSCRIPTION =================

// Create / activate subscription
router.post("/create", protect, createSubscription);
router.post("/create-order", protect, createOrder);
router.post("/verify-payment", protect, verifyPayment);


// Get current user's subscription
router.get("/my", protect, getSubscription);


// Cancel subscription
router.put("/cancel", protect, cancelSubscription);

router.get("/all", protect, adminOnly, getAllSubscriptions);

router.put("/status", protect, adminOnly, updateSubscriptionStatus);


export default router;
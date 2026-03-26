import pool from "../config/db.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";

/*
  Subscription Controller
  -----------------------
  Handles:
  - Create / renew subscription
  - Fetch current subscription
  - Cancel subscription
*/

// ================= CREATE / RENEW =================
export const createSubscription = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const userId = req.user.id;
    const { plan_type } = req.body;

    // 🔴 Validation
    if (!["monthly", "yearly"].includes(plan_type)) {
      return res.status(400).json({
        message: "Invalid plan type",
      });
    }

    // 🟡 Calculate expiry
    let expiryDate = new Date();

    if (plan_type === "monthly") {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    // 🟡 Check existing subscription
    const existing = await pool.query(
      "SELECT * FROM subscriptions WHERE user_id = $1",
      [userId]
    );

    let newSub;

    if (existing.rows.length > 0) {
      // 🟢 Update existing (RECOMMENDED)
      newSub = await pool.query(
        `UPDATE subscriptions 
         SET plan_type = $1,
             status = 'active',
             start_date = NOW(),
             expiry_date = $2
         WHERE user_id = $3
         RETURNING id, plan_type, status, start_date, expiry_date`,
        [plan_type, expiryDate, userId]
      );
    } else {
      // 🟢 Create new
      newSub = await pool.query(
        `INSERT INTO subscriptions 
         (user_id, plan_type, status, start_date, expiry_date) 
         VALUES ($1, $2, 'active', NOW(), $3)
         RETURNING id, plan_type, status, start_date, expiry_date`,
        [userId, plan_type, expiryDate]
      );
    }

    res.json({
      message: "Subscription activated",
      subscription: newSub.rows[0],
    });

  } catch (error) {
    console.error("createSubscription error:", error.message);

    res.status(500).json({
      message: "Server error while creating subscription",
    });
  }
};

// ================= GET =================
export const getSubscription = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, plan_type, status, start_date, expiry_date
       FROM subscriptions 
       WHERE user_id = $1
       ORDER BY created_at DESC 
       LIMIT 1`, 
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json(null);
    }

    const sub = result.rows[0];

    // 🔴 Auto-update if expired
    if (sub.status === "active" && new Date(sub.expiry_date) < new Date()) {
      await pool.query(
        "UPDATE subscriptions SET status = 'expired' WHERE user_id = $1",
        [userId]
      );

      sub.status = "expired";
    }

    res.json(sub);

  } catch (error) {
    console.error("getSubscription error:", error.message);

    res.status(500).json({
      message: "Server error while fetching subscription",
    });
  }
};


// ================= CANCEL =================
export const cancelSubscription = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const userId = req.user.id;

    const result = await pool.query(
      `UPDATE subscriptions 
      SET status = 'cancelled'
      WHERE user_id = $1 AND status = 'active'
      RETURNING id`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No subscription found",
      });
    }

    res.json({
      message: "Subscription cancelled successfully",
    });

  } catch (error) {
    console.error("cancelSubscription error:", error.message);

    res.status(500).json({
      message: "Server error while cancelling subscription",
    });
  }
};

export const getAllSubscriptions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        subscriptions.id,
        users.name,
        users.email,
        subscriptions.plan_type,
        subscriptions.status,
        subscriptions.expiry_date
      FROM subscriptions
      JOIN users ON users.id = subscriptions.user_id
      ORDER BY subscriptions.created_at DESC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching subscriptions" });
  }
};

// ================= ADMIN: UPDATE STATUS =================
export const updateSubscriptionStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    await pool.query(
      "UPDATE subscriptions SET status = $1 WHERE id = $2",
      [status, id]
    );

    res.json({ message: "Subscription updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
};



export const createOrder = async (req, res) => {
  try {
    const { plan_type } = req.body;

    let amount;

    if (plan_type === "monthly") amount = 100;
    else if (plan_type === "yearly") amount = 1000;
    else {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      order,
      amount,
      plan_type,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order creation failed" });
  }
};


export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan_type,
    } = req.body;

    const userId = req.user.id;

    // 🔐 CREATE SIGNATURE
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    // ❌ INVALID PAYMENT
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    // ✅ VALID PAYMENT → ACTIVATE SUBSCRIPTION
    let duration = plan_type === "yearly" ? "1 year" : "1 month";

    await pool.query(
      `INSERT INTO subscriptions 
       (user_id, plan_type, status, start_date, expiry_date)
       VALUES ($1, $2, 'active', NOW(), NOW() + INTERVAL '${duration}')`,
      [userId, plan_type]
    );

    res.json({ message: "Subscription activated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Verification failed" });
  }
};
import pool from "../config/db.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";

const PLANS = {
  monthly: 100,
  yearly: 1000,
};

// ================= CREATE ORDER =================
export const createOrder = async (req, res) => {
  try {
    const { plan_type } = req.body;

    const amount = PLANS[plan_type];

    if (!amount) {
      return res.status(400).json({
        message: "Invalid plan",
      });
    }

    const options = {
      amount: amount * 100,
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
    console.error("createOrder error:", err.message);

    res.status(500).json({
      message: "Order creation failed",
    });
  }
};

// ================= VERIFY PAYMENT =================
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan_type,
    } = req.body;

    const userId = req.user.id;

    const amount = PLANS[plan_type];
    if (!amount) {
      return res.status(400).json({
        message: "Invalid plan",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    const expiryQuery =
      plan_type === "yearly"
        ? "NOW() + INTERVAL '1 year'"
        : "NOW() + INTERVAL '1 month'";

    const result = await pool.query(
      `
      INSERT INTO subscriptions 
      (user_id, plan_type, status, start_date, expiry_date, payment_id, order_id)
      VALUES ($1, $2, 'active', NOW(), ${expiryQuery}, $3, $4)
      ON CONFLICT (user_id)
      DO UPDATE SET
        plan_type = EXCLUDED.plan_type,
        status = 'active',
        start_date = NOW(),
        expiry_date = ${expiryQuery},
        payment_id = EXCLUDED.payment_id,
        order_id = EXCLUDED.order_id
      RETURNING id, plan_type, status, expiry_date
      `,
      [userId, plan_type, razorpay_payment_id, razorpay_order_id]
    );

    res.json({
      message: "Subscription activated successfully",
      subscription: result.rows[0],
    });

  } catch (err) {
    console.error("verifyPayment error:", err.message);

    res.status(500).json({
      message: "Verification failed",
    });
  }
};

// ================= GET =================
export const getSubscription = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT id, plan_type, status, start_date, expiry_date
       FROM subscriptions 
       WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json(null);
    }

    const sub = result.rows[0];

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
        message: "No active subscription found",
      });
    }

    res.json({
      message: "Subscription cancelled successfully",
    });

  } catch (error) { console.error("cancelSubscription error:", error.message);

    res.status(500).json({
      message: "Server error while cancelling subscription",
    });
  }
};

// ================= ADMIN: GET ALL =================
export const getAllSubscriptions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id,
        u.name,
        u.email,
        s.plan_type,
        s.status,
        s.expiry_date
      FROM subscriptions s
      JOIN users u ON u.id = s.user_id
      ORDER BY s.start_date DESC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error fetching subscriptions",
    });
  }
};

// ================= ADMIN: UPDATE STATUS =================
export const updateSubscriptionStatus = async (req, res) => {
  try {
    const id = req.params.id; 
    const { status } = req.body;

    if (!id || !status) {
      return res.status(400).json({
        message: "ID and status required",
      });
    }

    const allowedStatus = ["active", "expired", "cancelled"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const existing = await pool.query(
      "SELECT id FROM subscriptions WHERE id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    const updated = await pool.query(
      `UPDATE subscriptions 
       SET status = $1 
       WHERE id = $2 
       RETURNING id, status`,
      [status, id]
    );

    res.json({
      message: "Subscription updated successfully",
      subscription: updated.rows[0],
    });

  } catch (error) {
    console.error("updateSubscriptionStatus error:", error.message);

    res.status(500).json({
      message: "Update failed",
    });
  }
};
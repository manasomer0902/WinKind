import pool from "../config/db.js";

/*
  Admin Controller
  ----------------
  Handles:
  - Fetching users
  - Updating user roles
*/

// ================= GET ALL USERS =================
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users"
    );

    res.json(result.rows);

  } catch (error) {
    console.error("getAllUsers error:", error.message);

    res.status(500).json({
      message: "Server error while fetching users",
    });
  }
};

// ================= UPDATE USER ROLE =================
export const updateUserRole = async (req, res) => {
  try {
    const { user_id, role } = req.body;

    // 🔴 Validate role
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    // 🔴 Check if user exists
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [user_id]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 🟡 Optional: prevent admin removing own access
    if (req.user.id === user_id && role !== "admin") {
      return res.status(400).json({
        message: "You cannot remove your own admin access",
      });
    }

    // 🟢 Update role
    await pool.query(
      "UPDATE users SET role = $1 WHERE id = $2",
      [role, user_id]
    );

    res.json({ message: "Role updated successfully" });

  } catch (error) {
    console.error("updateUserRole error:", error.message);

    res.status(500).json({
      message: "Server error while updating role",
    });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role = 'user'"
    );
    const winners = await pool.query("SELECT COUNT(*) FROM winners");
    const subs = await pool.query("SELECT COUNT(*) FROM subscriptions");

    res.json({
      totalUsers: users.rows[0].count,
      totalWinners: winners.rows[0].count,
      totalSubscriptions: subs.rows[0].count,
    });
  } catch (error) {
    res.status(500).json({ message: "Stats error" });
  }
};
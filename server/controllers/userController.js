import pool from "../config/db.js";

/*
  User Controller
  ---------------
  Handles:
  - Fetching logged-in user profile
  - Updating profile details
*/

// ================= GET PROFILE =================
export const getProfile = async (req, res) => {
  try {
    // 🔴 Safety check
    if (!req.user) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const userId = req.user.id;

    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [userId]
    );

    // 🔴 User not found
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("getProfile error:", err.message);

    res.status(500).json({
      message: "Server error while fetching profile",
    });
  }
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
  try {
    // 🔴 Safety check
    if (!req.user) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const userId = req.user.id;
    const { name } = req.body;

    // 🔴 Validation
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        message: "Valid name is required",
      });
    }

    const result = await pool.query(
      `UPDATE users 
       SET name = $1 
       WHERE id = $2 
       RETURNING id, name, email, role`,
      [name.trim(), userId]
    );

    // 🔴 User not found
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "Profile updated successfully",
      user: result.rows[0],
    });

  } catch (err) {
    console.error("updateProfile error:", err.message);

    res.status(500).json({
      message: "Server error while updating profile",
    });
  }
};
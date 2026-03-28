import pool from "../config/db.js";

/*
  Charity Controller
  ------------------
  Handles:
  - Adding charities (admin)
  - Fetching charities (public)
  - Selecting charity (user)
  - Fetching user's selected charity
*/

// ================= ADD CHARITY =================
export const addCharity = async (req, res) => {
  try {
    const { name, description, image_url } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        message: "Name and description are required",
      });
    }

    // 🔴 Prevent duplicate
    const existing = await pool.query(
      "SELECT id FROM charities WHERE LOWER(name) = LOWER($1)",
      [name]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "Charity already exists",
      });
    }

    const newCharity = await pool.query(
      `INSERT INTO charities (name, description, image_url) 
       VALUES ($1, $2, $3)
       RETURNING id, name, description, image_url`,
      [name, description, image_url]
    );

    res.status(201).json({
      message: "Charity added successfully",
      charity: newCharity.rows[0],
    });

  } catch (error) {
    console.error("addCharity error:", error.message);

    res.status(500).json({
      message: "Server error while adding charity",
    });
  }
};

// ================= GET ALL =================
export const getCharities = async (req, res) => {
  try {
    const charities = await pool.query(
      `SELECT id, name, description, image_url 
       FROM charities 
       ORDER BY created_at DESC`
    );

    res.json(charities.rows);

  } catch (error) {
    console.error("getCharities error:", error.message);

    res.status(500).json({
      message: "Server error while fetching charities",
    });
  }
};

// ================= SELECT CHARITY =================
export const selectCharity = async (req, res) => {
  try {
    const userId = req.user.id;
    let { charity_id, contribution_percentage } = req.body;

    if (!charity_id || !contribution_percentage) {
      return res.status(400).json({
        message: "Charity and contribution % required",
      });
    }

    // 🔴 Range validation
    if (contribution_percentage < 10 || contribution_percentage > 100) {
      return res.status(400).json({
        message: "Contribution must be between 10% and 100%",
      });
    }

    const charityCheck = await pool.query(
      "SELECT id FROM charities WHERE id = $1",
      [charity_id]
    );

    if (charityCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Charity not found",
      });
    }

    const result = await pool.query(
      `UPDATE users 
       SET charity_id = $1, contribution_percentage = $2 
       WHERE id = $3
       RETURNING charity_id, contribution_percentage`,
      [charity_id, contribution_percentage, userId]
    );

    res.json({
      message: "Charity selected successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("selectCharity error:", error.message);

    res.status(500).json({
      message: "Server error while selecting charity",
    });
  }
};

// ================= GET USER CHARITY =================
export const getUserCharity = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const userId = req.user.id;

    const result = await pool.query(
      `SELECT 
        users.charity_id, 
        users.contribution_percentage, 
        charities.name,
        charities.image_url
       FROM users 
       LEFT JOIN charities 
       ON users.charity_id = charities.id
       WHERE users.id = $1`,
      [userId]
    );

    res.json(result.rows[0] || null);

  } catch (error) {
    console.error("getUserCharity error:", error.message);

    res.status(500).json({
      message: "Server error while fetching user charity",
    });
  }
};

// ================= DELETE CHARITY =================
export const deleteCharity = async (req, res) => {
  try {
    const { id } = req.params;

    const check = await pool.query(
      "SELECT id FROM charities WHERE id = $1",
      [id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({
        message: "Charity not found",
      });
    }

    await pool.query(
      "UPDATE users SET charity_id = NULL WHERE charity_id = $1",
      [id]
    );

    await pool.query(
      "DELETE FROM charities WHERE id = $1",
      [id]
    );

    res.json({ message: "Charity deleted successfully" });

  } catch (error) {
    console.error("deleteCharity error:", error.message);
    res.status(500).json({ message: "Delete failed" });
  }
};
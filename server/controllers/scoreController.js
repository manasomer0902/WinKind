import pool from "../config/db.js";

/*
  Score Controller
  ----------------
  Handles:
  - Adding scores (max 5, FIFO logic)
  - Fetching scores (latest first)
*/

// ================= ADD SCORE =================
export const addScore = async (req, res) => {
  try {
    // 🔴 Safety check
    if (!req.user) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const userId = req.user.id;
    const { score, date } = req.body;

    // 🔴 Validation
    if (!score || isNaN(score)) {
      return res.status(400).json({
        message: "Valid score is required",
      });
    }

    // 🟡 Get existing scores (oldest first)
    const existingScores = await pool.query(
      "SELECT id FROM scores WHERE user_id = $1 ORDER BY created_at ASC",
      [userId]
    );

    // 🔴 If already 5 → remove oldest (FIFO)
    if (existingScores.rows.length >= 5) {
      const oldestScore = existingScores.rows[0];

      await pool.query(
        "DELETE FROM scores WHERE id = $1",
        [oldestScore.id]
      );
    }

    // 🟢 Insert new score
    const newScore = await pool.query(
      "INSERT INTO scores (user_id, score, date) VALUES ($1, $2, $3) RETURNING id, score, date, created_at",
      [userId, score, date || new Date()]
    );

    res.status(201).json({
      message: "Score added successfully",
      score: newScore.rows[0],
    });

  } catch (error) {
    console.error("addScore error:", error.message);

    res.status(500).json({
      message: "Server error while adding score",
    });
  }
};

// ================= GET SCORES =================
export const getScores = async (req, res) => {
  try {
    // 🔴 Safety check
    if (!req.user) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const userId = req.user.id;

    // 🟢 Fetch scores (latest first)
    const scores = await pool.query(
      "SELECT id, score, date, created_at FROM scores WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(scores.rows);

  } catch (error) {
    console.error("getScores error:", error.message);

    res.status(500).json({
      message: "Server error while fetching scores",
    });
  }
};

// ================= UPDATES SCORES =================
export const updateScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const { score, date } = req.body;
    const scoreId = req.params.id;

    // 🔒 Check if draw already completed
    const draw = await pool.query(
      "SELECT * FROM draws WHERE status = 'completed' ORDER BY draw_date DESC LIMIT 1"
    );

    if (draw.rows.length > 0) {
      return res.status(400).json({
        message: "Scores locked after draw",
      });
    }

    const result = await pool.query(
      `UPDATE scores 
       SET score = $1, date = $2 
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [score, date, scoreId, userId]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error("updateScore error:", err.message);
    res.status(500).json({ message: "Error updating score" });
  }
};

// ================= DELETE SCORES =================
export const deleteScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const scoreId = req.params.id;

    // 🔒 Check draw lock
    const draw = await pool.query(
      "SELECT * FROM draws WHERE status = 'completed' ORDER BY draw_date DESC LIMIT 1"
    );

    if (draw.rows.length > 0) {
      return res.status(400).json({
        message: "Scores locked after draw",
      });
    }

    await pool.query(
      "DELETE FROM scores WHERE id = $1 AND user_id = $2",
      [scoreId, userId]
    );

    res.json({ message: "Score deleted" });

  } catch (err) {
    console.error("deleteScore error:", err.message);
    res.status(500).json({ message: "Error deleting score" });
  }
};
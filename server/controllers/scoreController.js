import pool from "../config/db.js";

/*
  Score Controller
*/

// ================= ADD SCORE =================
export const addScore = async (req, res) => {
  try {
    const userId = req.user.id;
    let { score, date } = req.body;

    // 🔴 Validate score
    if (!Number.isInteger(score) || score < 1 || score > 45) {   
      return res.status(400).json({
        message: "Score must be between 1 and 45",
      });
    }

    // 🟡 Validate date
    date = date ? new Date(date) : new Date();
    if (isNaN(date.getTime())) {
      return res.status(400).json({
        message: "Invalid date",
      });
    }

    // 🟡 Get existing scores (FIFO)
    const existingScores = await pool.query(
      "SELECT id FROM scores WHERE user_id = $1 ORDER BY created_at ASC",
      [userId]
    );

    // 🔴 Remove oldest if >=5
    if (existingScores.rows.length >= 5) {
      await pool.query(
        "DELETE FROM scores WHERE id = $1",
        [existingScores.rows[0].id]
      );
    }

    // 🟢 Insert new
    const newScore = await pool.query(
      `INSERT INTO scores (user_id, score, date) 
       VALUES ($1, $2, $3) 
       RETURNING id, score, date, created_at`,
      [userId, score, date]
    );

    res.status(201).json({
      message: "Score added successfully",
      score: newScore.rows[0],
    });

  } catch (error) {
    console.error("addScore error:", error.message);
    res.status(500).json({ message: "Server error while adding score" });
  }
};

// ================= GET SCORES =================
export const getScores = async (req, res) => {
  try {
    const userId = req.user.id;

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

// ================= UPDATE SCORE =================
export const updateScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const scoreId = req.params.id;   
    let { score, date } = req.body;

    if (!Number.isInteger(score) || score < 1 || score > 45) {  
      return res.status(400).json({
        message: "Score must be between 1 and 45",
      });
    }

    date = date ? new Date(date) : new Date();   
    if (isNaN(date.getTime())) {
      return res.status(400).json({
        message: "Invalid date",
      });
    }

    // 🔒 Draw lock
    const draw = await pool.query(
      "SELECT 1 FROM draws WHERE status = 'completed' LIMIT 1"
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

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Score not found",
      });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("updateScore error:", err.message);
    res.status(500).json({ message: "Error updating score" });
  }
};

// ================= DELETE SCORE =================
export const deleteScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const scoreId = req.params.id;  

    // 🔒 Draw lock
    const draw = await pool.query(
      "SELECT 1 FROM draws WHERE status = 'completed' LIMIT 1"
    );

    if (draw.rows.length > 0) {
      return res.status(400).json({
        message: "Scores locked after draw",
      });
    }

    const result = await pool.query(
      "DELETE FROM scores WHERE id = $1 AND user_id = $2 RETURNING id",
      [scoreId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Score not found",
      });
    }

    res.json({ message: "Score deleted successfully" });

  } catch (err) {
    console.error("deleteScore error:", err.message);
    res.status(500).json({ message: "Error deleting score" });
  }
};
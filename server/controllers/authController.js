import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { sendEmail } from "../utils/emailService.js";
import { welcomeEmail } from "../utils/emailTemplates.js";

/*
  Auth Controller (Production Ready)
*/

// ❌ Safety check
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing ❌");
}

// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // 🔴 Validation
    if (!name | !email || !password) {   
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // ✅ Normalize email
    email = email.toLowerCase();

    // ✅ Basic email validation
    if (!email.includes("@")) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // ✅ Password length check
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // 🔴 Check existing user
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 🟡 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🟢 Insert user
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, email, role`,
      [name, email, hashedPassword]
    );

    // 📩 Send welcome email (NON-BLOCKING ✅)
    const emailData = welcomeEmail(name);

    sendEmail({
      to: email,
      subject: emailData.subject,
      html: emailData.html,
    }).catch((err) => {
      console.error("Email failed:", err.message);
    });

    res.status(201).json({
      message: "User registered successfully",
      user: newUser.rows[0],
    });

  } catch (error) {
    console.error("registerUser error:", error.message);

    res.status(500).json({
      message: "Server error during registration",
    });
  }
};

// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    email = email.toLowerCase();

    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const user = userResult.rows[0];

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("loginUser error:", error.message);

    res.status(500).json({
      message: "Server error during login",
    });
  }
};
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";

// Routes
import authRoutes from "./routes/authRoutes.js";
import scoreRoutes from "./routes/scoreRoutes.js";
import charityRoutes from "./routes/charityRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import drawRoutes from "./routes/drawRoutes.js";
import winnerRoutes from "./routes/winnerRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Middleware
import { protect } from "./middleware/authMiddleware.js";

const app = express();

/*
  ================= MIDDLEWARE =================
*/
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://win-kind.vercel.app/"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

/*
  ================= ROUTES =================
*/
app.use("/api/auth", authRoutes);
app.use("/api/score", scoreRoutes);
app.use("/api/charity", charityRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/draw", drawRoutes);
app.use("/api/winner", winnerRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

/*
  ================= TEST ROUTES =================
*/
app.get("/", (req, res) => {
  res.send("WinKind API Running 🚀");
});

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user,
  });
});

/*
  ================= ERROR HANDLING =================
*/

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);

  res.status(500).json({
    message: "Server error",
  });
});

/*
  ================= SERVER =================
*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
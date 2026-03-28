import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

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

const allowedOrigins = [
  "http://localhost:5173",
  "https://win-kind.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));


app.use(express.json());

app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

app.use(morgan("dev"));

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

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

  res.status(err.status || 500).json({
    message: err.message || "Server error",
  });
});

/*
  ================= SERVER =================
*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
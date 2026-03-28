import jwt from "jsonwebtoken";

/*
  Auth Middleware (Production Ready)
  ---------------------------------
  - Verifies JWT
  - Handles expiry
  - Safe error messages
*/

// ❌ Safety check
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing ❌");
}

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 🔴 No header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token, authorization denied",
      });
    }

    // 🟡 Extract token
    const token = authHeader.split(" ")[1];

    if (!token || token === "null") {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    // 🟢 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user
    req.user = decoded;

    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    // 🔥 Handle expired token separately
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Session expired, please login again",
      });
    }

    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};
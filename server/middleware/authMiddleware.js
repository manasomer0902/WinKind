import jwt from "jsonwebtoken";

/*
  Auth Middleware (Protect)
  ------------------------
  - Verifies JWT token
  - Attaches user to request
  - Blocks unauthorized access
*/

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 🔴 No header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // 🟡 Extract token
    const token = authHeader.split(" ")[1];

    // 🔴 Invalid token (null / undefined)
    if (!token || token === "null") {
      return res.status(401).json({ message: "Invalid token" });
    }

    // 🟢 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user
    req.user = decoded;

    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};
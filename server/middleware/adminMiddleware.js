/*
  Admin Middleware
  ----------------
  - Allows only admin users
  - Must be used AFTER auth middleware (protect)
*/

export const adminOnly = (req, res, next) => {
  try {
    // 🔴 No user found
    if (!req.user) {
      return res.status(401).json({
        message: "Not authorized, no user data",
      });
    }

    // 🔴 Not admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access only",
      });
    }

    // 🟢 Admin access granted
    next();

  } catch (error) {
    console.error("Admin Middleware Error:", error.message);

    return res.status(500).json({
      message: "Server error in admin middleware",
    });
  }
};
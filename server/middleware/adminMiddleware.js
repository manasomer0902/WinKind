/*
  Admin Middleware (Production Ready)
  ----------------------------------
  - Supports role-based access
  - Scalable for future roles
*/

export const adminOnly = (req, res, next) => {
  // 🔴 No user found (auth middleware missing or failed)
  if (!req.user) {
    return res.status(401).json({
      message: "Not authorized, no user data",
    });
  }

  // 🟡 Allowed roles (scalable)
  const allowedRoles = ["admin"];

  // 🔴 Not allowed
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      message: "Access denied: Admins only",
    });
  }

  // 🟢 Access granted
  next();
};
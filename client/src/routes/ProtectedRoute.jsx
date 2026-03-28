import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 🔴 Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🔴 Role mismatch
  if (roleRequired && role !== roleRequired) {
    return role === "admin"
      ? <Navigate to="/admin" replace />
      : <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
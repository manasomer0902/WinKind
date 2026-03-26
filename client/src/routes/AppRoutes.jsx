import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Admin from "../pages/Admin";

import ProtectedRoute from "./ProtectedRoute";

/*
  App Routes
  ----------
  Handles:
  - Public routes (home, login, signup)
  - Protected routes (dashboard, admin)
  - Role-based access control
*/

const AppRoutes = () => {
  return (
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ================= USER DASHBOARD ================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roleRequired="user">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ROUTE ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roleRequired="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

      </Routes>
  );
};

export default AppRoutes;
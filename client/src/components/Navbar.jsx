import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

/*
  Navbar Component
  ----------------
  Handles:
  - Navigation across app
  - Auth-based UI (logged in / not logged in)
  - Role-based navigation (user vs admin)
  - Logout functionality

  Acts as the main control for user flow
*/

const Navbar = () => {
  const navigate = useNavigate();

  // Auth data
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/");
  };

  return (
    <nav className="navbar">

      {/* Brand Logo */}
      <h2
        className="logo"
        onClick={() => {
          // 🔥 Smart navigation based on login + role
          if (token) {
            if (role === "admin") {
              navigate("/admin");
            } else {
              navigate("/dashboard");
            }
          } else {
            navigate("/");
          }
        }}
      >
        WinKind
      </h2>

      <div className="nav-links">

        {token ? (
          <>
            {/* 🟢 HOME BUTTON */}
            <span
              className="nav-item"
              onClick={() => navigate("/")}
            >
              Home
            </span>
            {/* Role-based navigation */}
            {role === "admin" ? (
              <span
                className="nav-item"
                onClick={() => navigate("/admin")}
              >
                Admin Panel
              </span>
            ) : (
              <span
                className="nav-item"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </span>
            )}

            {/* Logout */}
            <span
              className="nav-item logout"
              onClick={handleLogout}
            >
              Logout
            </span>
          </>
        ) : (
          <>
            {/* Login */}
            <span
              className="nav-item"
              onClick={() => navigate("/login")}
            >
              Login
            </span>

            {/* Signup / Subscribe */}
            <span
              className="btn"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </span>
          </>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
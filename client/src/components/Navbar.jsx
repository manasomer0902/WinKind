import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  // 🔄 Sync with localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", handleStorageChange);

    // Also run once (for same tab updates)
    handleStorageChange();

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* LOGO */}
      <h2
        className="logo"
        onClick={() => {
          if (token) {
            navigate(role === "admin" ? "/admin" : "/dashboard");
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
            <button
              className="nav-item"
              onClick={() => navigate("/")}
            >
              Home
            </button>

            {role === "admin" ? (
              <button
                className="nav-item"
                onClick={() => navigate("/admin")}
              >
                Admin Panel
              </button>
            ) : (
              <button
                className="nav-item"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </button>
            )}

            <button
              className="nav-item logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="nav-item"
              onClick={() => navigate("/login")}
            >
              Login
            </button>

            <button
              className="btn"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
          </>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
import { useState } from "react";
import "../styles/Auth.css";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

/*
  Login Page
  ----------
  Handles:
  - User authentication
  - Redirect based on role (admin/user)
*/

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await loginUser(form);

    // If login failed → stop
    if (!res) return;

    /*
      IMPORTANT:
      Token + role already stored in authService
      So we only handle navigation here
    */

    if (res.user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>

        <p onClick={() => navigate("/signup")}>
          Don't have an account? Signup
        </p>
      </form>
    </div>
  );
};

export default Login;
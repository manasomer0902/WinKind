import { useState } from "react";
import "../styles/Auth.css";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

/*
  Signup Page
  -----------
  Handles:
  - User registration
  - Redirect to login after success

  NOTE:
  - Role is NOT selected here (default = user)
*/

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle signup submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await registerUser(form);

    // If failed → stop
    if (!res) return;

    alert("Signup successful");
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Signup</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />

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

        <button type="submit">Signup</button>

        <p onClick={() => navigate("/login")}>
          Already have an account? Login
        </p>
      </form>
    </div>
  );
};

export default Signup;
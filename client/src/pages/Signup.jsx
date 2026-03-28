import { useState } from "react";
import "../styles/Auth.css";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] =useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const res = await registerUser(form);

    setLoading(false);

    if (!res) {
      setError("Signup failed. Try again.");
      return;
    }
    setError("");
    setMessage("Account Created Successfully");
    setTimeout(() => {
      navigate("/login");
    }, 1000);      
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Signup</h2>

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

         <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>  

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Signup"}
        </button>

        <p onClick={() => navigate("/login")}>
          Already have an account? Login
        </p>
      </form>
    </div>
  );
};

export default Signup;
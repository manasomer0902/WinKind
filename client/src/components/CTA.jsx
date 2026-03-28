import { useNavigate } from "react-router-dom";
import "../styles/CTA.css";

const CTA = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleStart = () => {
    if (token) {
      navigate(role === "admin" ? "/admin" : "/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="cta-section">
      <h2>Start Your Journey Today</h2>

      <p>
        Join now, enter your scores, win rewards, and make a real impact.
      </p>

      <button className="cta-btn" onClick={handleStart}>
        {token ? "Go to Dashboard" : "🚀 Get Started"}
      </button>
    </section>
  );
};

export default CTA;
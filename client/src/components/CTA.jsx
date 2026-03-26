import { useNavigate } from "react-router-dom";
import "../styles/CTA.css";

/*
  CTA Section
  -----------
  Final call-to-action section.

  Goal:
  - Smart navigation based on login state
  - Better UX (no unnecessary login redirects)
*/

const CTA = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      // 🔥 Already logged in
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } else {
      // 🟢 New user
      navigate("/login");
    }
  };

  return (
    <section className="cta-section">
      <h2>Start Your Journey Today</h2>

      <p>
        Join now, enter your scores, win rewards, and support a meaningful cause.
      </p>

      <button className="cta-btn" onClick={handleStart}>
        Get Started
      </button>
    </section>
  );
};

export default CTA;
import { useNavigate } from "react-router-dom";
import "../styles/Hero.css";

const Hero = () => {
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
    <section className="hero container">

      <div className="hero-content">
        <h1>Play. Win. Make an Impact.</h1>

        <p>
          Track your scores, win rewards, and support a cause you care about.
        </p>

        <button className="cta-btn" onClick={handleStart}>
          {token ? "Go to Dashboard" : "🚀 Get Started"}
        </button>
      </div>

    </section>
  );
};

export default Hero;
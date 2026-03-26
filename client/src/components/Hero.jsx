import { useNavigate } from "react-router-dom";
import "../styles/Hero.css";

const Hero = () => {
const navigate = useNavigate();

const handleStart = () => {
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");


if (token) {
  if (role === "admin") {
    navigate("/admin");
  } else {
    navigate("/dashboard");
  }
} else {
  navigate("/login");
}


};

return ( <section className="hero container">


  <div className="hero-content">
    <h1>Play. Win. Make an Impact.</h1>

    <p>
      Track your scores, win monthly rewards, and support a cause you care about.
    </p>

    <button className="cta-btn" onClick={handleStart}>
      🚀 Get Started
    </button>
  </div>

</section>


);
};

export default Hero;

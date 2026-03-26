import "../styles/Subscription.css";
import { useNavigate } from "react-router-dom";

const SubscriptionInfo = () => {
const navigate = useNavigate();

const handleSubscribe = (plan) => {
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");


if (token) {
  if (role === "admin") {
    navigate("/admin");
  } else {
    navigate("/dashboard", {state: {plan} });
  }
} else {
  navigate("/login");
}
};

return (
   <section className="sub-section container"> 
   <h2>💰 Subscription Plans</h2>

  <div className="pricing-container">

    {/* MONTHLY PLAN */}
    <div className="pricing-card featured">
      <span className="badge">Basic Plan</span>

      <h3>Monthly</h3>

      <div className="price">₹100<span>/month</span></div>

      <ul>
        <li>✔ Participate in monthly draw</li>
        <li>✔ Track your scores</li>
        <li>✔ Support your chosen charity</li>
      </ul>

      <button className="subscribe-btn" onClick={() => handleSubscribe("monthly")}>
        Choose Plan
      </button>
    </div>

    {/* YEARLY PLAN (FEATURED) */}
    <div className="pricing-card featured">
      <span className="badge">Best Value</span>

      <h3>Yearly</h3>

      <div className="price">₹1000<span>/year</span></div>

      <ul>
        <li>✔ Participate in all monthly draws</li>
        <li>✔ Save ₹200 yearly</li>
        <li>✔ Priority access</li>
      </ul>

      <button className="subscribe-btn" onClick={() => handleSubscribe("yearly")}>
        Choose Plan
      </button>
    </div>

  </div>
</section>

);
};

export default SubscriptionInfo;

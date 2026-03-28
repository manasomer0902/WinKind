import "../styles/Subscription.css";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    id: "monthly",
    name: "Monthly",
    price: "₹100",
    duration: "/month",
    badge: "Basic Plan",
    features: [
      "Participate in monthly draw",
      "Track your scores",
      "Support your chosen charity",
    ],
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "₹1000",
    duration: "/year",
    badge: "Best Value",
    featured: true,
    features: [
      "Participate in all monthly draws",
      "Save ₹200 yearly",
      "Priority access",
    ],
  },
];

const SubscriptionInfo = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleSubscribe = (plan) => {
    if (token) {
      navigate(role === "admin" ? "/admin" : "/dashboard", {
        state: { plan },
      });
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="sub-section container">
      <h2>💰 Subscription Plans</h2>

      <div className="pricing-container">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`pricing-card ${plan.featured ? "featured" : ""}`}
          >
            <span className="badge">{plan.badge}</span>

            <h3>{plan.name}</h3>

            <div className="price">
              {plan.price}
              <span>{plan.duration}</span>
            </div>

            <ul>
              {plan.features.map((f, i) => (
                <li key={i}>✔ {f}</li>
              ))}
            </ul>

            <button
              className="subscribe-btn"
              onClick={() => handleSubscribe(plan.id)}
            >
              {token ? "Select Plan" : "🚀 Get Started"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SubscriptionInfo;
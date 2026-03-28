import { useEffect, useState } from "react";
import "../styles/Dashboard.css";

import { getProfile, updateProfile } from "../services/userService";
import { addScore, getScores, updateScore, deleteScore } from "../services/scoreService";
import { getCharities, selectCharity, getUserCharity } from "../services/charityService";
import { getSubscription, createOrder, verifyPayment } from "../services/subscriptionService";
import { getLatestDraw, getWinners } from "../services/drawService";

import DrawResult from "../components/DrawResult";
import Winnings from "../components/Winnings";

const Dashboard = () => {

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "" });

  const [editingScore, setEditingScore] = useState(null);
  const [scores, setScores] = useState([]);
  const [form, setForm] = useState({ score: "", date: "" });

  const [charities, setCharities] = useState([]);
  const [selected, setSelected] = useState("");
  const [percentage, setPercentage] = useState(10);

  const [subscription, setSubscription] = useState(null);

  const [draw, setDraw] = useState(null);
  const [winners, setWinners] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(null);

  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchData();
  }, [editMode]);

  const fetchData = async () => {
    try {
      const userData = await getProfile();
      const scoreData = await getScores();
      const charityData = await getCharities();
      const userCharity = await getUserCharity();
      const sub = await getSubscription();

      setSubscription(sub);

      let latest = null;
      let winnerData = [];

      if (sub && sub.status === "active") {
        latest = await getLatestDraw();

        if (role === "admin") {
          winnerData = await getWinners();
        }
      }

      setUser(userData);

      if (!editMode) {
        setEditData({
          name: userData?.name || "",
          email: userData?.email || "",
        });
      }

      setScores(Array.isArray(scoreData) ? scoreData : []);
      setCharities(Array.isArray(charityData) ? charityData : []);
      setSelected(userCharity?.charity_id || "");
      setPercentage(userCharity?.contribution_percentage || 10);

      setDraw(latest);
      setWinners(Array.isArray(winnerData) ? winnerData : []);

    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= HANDLERS =================

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    const name = editData.name.trim();

    if (name.length < 2) {
      alert("Name must be at least 2 characters");
      return;
    }

    const res = await updateProfile({ name });

    if (res) {
      setUser(res.user);
      setEditMode(false);
      alert("Profile updated");
    }
  };

  const handleEditScore = (score) => {
    if (draw?.status === "completed") {
      alert("Scores locked after draw");
      return;
    }

    setForm({
      score: score.score,
      date: score.date,
    });

    setEditingScore(score.id);
  };

  const handleDeleteScore = async (id) => {
    if (draw?.status === "completed") {
      alert("Scores locked after draw");
      return;
    }

    await deleteScore(id);
    fetchData();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const score = Number(form.score);

    if (!score) return alert("Enter score");

    if (score < 1 || score > 45) {
      return alert("Score must be between 1-45");
    }

    const payload = { score, date: form.date };

    if (editingScore) {
      await updateScore(editingScore, payload);
      setEditingScore(null);
    } else {
      await addScore(payload);
    }

    setForm({ score: "", date: "" });
    fetchData();
  };

  const handleCharitySubmit = async () => {
    if (!selected) return alert("Select charity");

    await selectCharity({
      charity_id: selected,
      contribution_percentage: Number(percentage),
    });

    alert("Charity saved");
  };

  const handleSubscribe = async (type) => {
    try {
      if (!type || loadingPlan) return;

      setLoadingPlan(type);

      const { order, plan_type } = await createOrder({
        plan_type: type,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "WinKind",
        order_id: order.id,

        handler: async function (response) {
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            plan_type,
          });

          alert("Payment successful 🎉");
          fetchData();
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch {
      alert("Payment failed");
    } finally {
      setLoadingPlan(null);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {!subscription || subscription.status !== "active" ? (
        <div className="card">
          <h2>Subscribe to continue</h2>

          <div style={{ display: "flex", gap: "15px", marginTop: "15px" }}>
            <button
              className="btn primary"
              onClick={() => handleSubscribe("monthly")}
              disabled={loadingPlan === "monthly"}
            >
              {loadingPlan === "monthly" ? "Processing..." : "Monthly ₹100"}
            </button>

            <button
              className="btn primary"
              onClick={() => handleSubscribe("yearly")}
              disabled={loadingPlan === "yearly"}
            >
              {loadingPlan === "yearly" ? "Processing..." : "Yearly ₹1000"}
            </button>
          </div>
        </div>
      ) : (
        <div className="dashboard">
          <h2>Dashboard</h2>

          {/* PROFILE */}
          {user && (
            <div className="card">
              <h3>Profile</h3>

              {editMode ? (
                <>
                  <div className="form-group">
                    <input
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                    />
                  </div>

                  <button className="btn primary" onClick={handleSaveProfile}>
                    Save
                  </button>

                  <button className="btn delete-btn" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p>Name: {user.name}</p>
                  <p>Email: {user.email}</p>

                  <button className="btn edit-btn" onClick={() => setEditMode(true)}>
                    Edit
                  </button>
                </>
              )}
            </div>
          )}

          {/* SCORES */}
          <div className="card">
            <h3>Scores</h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="number"
                  name="score"
                  min="1"
                  max="45"
                  value={form.score}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </div>

              <button className="btn primary">
                {editingScore ? "Update" : "Add"}
              </button>
            </form>

            {scores.map((s) => (
              <div key={s.id} className="score-row">
                <div className="score-info">
                  <span>{s.score}</span>
                  <small>{new Date(s.date).toLocaleDateString()}</small>
                </div>

                <div className="score-actions">
                  <button className="btn edit-btn" onClick={() => handleEditScore(s)}>
                    Edit
                  </button>

                  <button className="btn delete-btn" onClick={() => handleDeleteScore(s.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CHARITY */}
          <div className="card">
            <h3>Charity</h3>

            <div className="form-group">
              <select value={selected} onChange={(e) => setSelected(e.target.value)}>
                <option value="">Select</option>
                {charities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <input
                type="number"
                value={percentage}
                min="10"
                onChange={(e) => setPercentage(Number(e.target.value))}
              />
            </div>

            <button className="btn primary" onClick={handleCharitySubmit}>
              Save
            </button>
          </div>

          <DrawResult draw={draw} />
          <Winnings />
        </div>
      )}
    </>
  );
};

export default Dashboard;
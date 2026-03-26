import { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import { getProfile, updateProfile } from "../services/userService";
import { addScore, getScores, updateScore, deleteScore } from "../services/scoreService";
import { getCharities, selectCharity } from "../services/charityService";
import { createSubscription, getSubscription, createOrder, verifyPayment } from "../services/subscriptionService";
import { getLatestDraw, getWinners } from "../services/drawService";
import DrawResult from "../components/DrawResult";
import Winnings from "../components/Winnings";

/*
  Dashboard Component
  ------------------
  This is the main user panel.

  Responsibilities:
  - Show user info
  - Handle subscription
  - Manage scores (max 5 logic handled backend)
  - Charity selection
  - Show draw + winnings

  NOTE:
  - UI is role-based (admin vs user)
*/

const Dashboard = () => {

  // ================= STATE =================
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: ""
  });

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
  const [loadingPlan, setLoadingPlan] = useState(true);


  const role = localStorage.getItem("role");

  // ================= FETCH DATA =================
  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, [editMode]);

  const fetchData = async () => {
  try {
    const userData = await getProfile();
    const scoreData = await getScores();
    const charityData = await getCharities();

    const userCharityRes = await fetch(
      `${import.meta.env.VITE_API_URL}/charity/my`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const userCharity = await userCharityRes.json();

    const sub = await getSubscription();
    setSubscription(sub);
    if (!sub || sub.status !== "active") {
      setDraw(null);
      setWinners();
      return;
    }
    
    const latest = await getLatestDraw();

    let winnerData = [];

    // 🔥 ONLY ADMIN CAN FETCH WINNERS
    if (role === "admin") {
      winnerData = await getWinners();
    }

    setUser(userData);
    if (!editMode) {
      setEditData({
        name: userData?.name || "",
        email: userData?.email || ""
      });
    }
    setScores(Array.isArray(scoreData) ? scoreData : []);
    setCharities(Array.isArray(charityData) ? charityData : []);
    setSelected(userCharity?.charity_id || "");
    setPercentage(userCharity?.contribution_percentage || 10);
    
    

  } catch (error) {
    console.error("Dashboard error:", error);
  } finally {
    setLoading(false);
  }
};

  // ================= HANDLERS =================

  // Handle score input
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
      alert("Profile updated successfully");
    } else {
      alert("Update failed");
    }
  };


  //Edit score
  const handleEditScore = (score) => {
    if (draw?.status === "completed") {
      alert("Scores are locked after draw");
      return;
    }
    setForm({
      score: score.score,
      date: score.date,
    });

    setEditingScore(score.id);
  };


    // Activate subscription
    const handleSubscribe = async (type) => {
      try {
        if (!type || loadingPlan) return;

        const validType = String(type).toLowerCase().trim();

        if (!["monthly", "yearly"].includes(validType)) {
          alert("Invalid plan selected");
          return;
        }

        setLoadingPlan(validType);

        // 🔥 STEP 1: CREATE ORDER
        const { order, amount, plan_type } = await createOrder({
          plan_type: validType,
        });

        // 🔥 STEP 2: OPEN RAZORPAY
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: "INR",
          name: "WinKind",
          description: "Subscription Payment",
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

          theme: {
            color: "#0a7f3f",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

      } catch (error) {
        console.error("Payment error:", error);

        alert(
          error?.response?.data?.message ||
          error?.message ||
          "Payment failed"
        );

      } finally {
        setLoadingPlan(null);
      }
    };


  const handleDeleteScore = async (id) => {
  try {
    if (!id) {
      alert("Invalid score id");
      return;
    }

    if (draw?.status === "completed") {
      alert("Scores are locked after draw");
      return;
    }

    await deleteScore(id);
    fetchData();

  } catch (err) {
    console.error("Delete error:", err);
    alert("Failed to delete score");
  }
};


  // Submit score
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingScore) {
      await updateScore(editingScore, form);
      setEditingScore(null);
    } else{
      await addScore(form);
    }
      setForm({ score: "", date: "" });
    fetchData(); // refresh data
  };

  // Save charity selection
  const handleCharitySubmit = async () => {
    if (!selected) return alert("Select a charity");

    await selectCharity({
      charity_id: selected,
      contribution_percentage: percentage,
    });

    alert("Charity saved successfully");
  };



  // ================= LOADING =================
  if (loading) {
    return <div className="dashboard"><p>Loading dashboard...</p></div>;
  }

  if (!subscription || subscription.status !== "active") {
    return (
      <div className="card">
        <h2>🚫 Access Restricted</h2>
        <p>Please subscribe to use this platform</p>

        <button 
          disabled={loadingPlan === "monthly"}
          onClick={() => handleSubscribe("monthly")}
        >
          Monthly Plan
        </button>

        <button
          disabled={loadingPlan === "yearly"}
          onClick={() => handleSubscribe("yearly")}>
          Yearly Plan
        </button>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      {/* USER INFO */}
      {user && (
        <div className="card">
          <h3>Profile</h3>

          {editMode ? (
            <>
              <input
                name="name"
                value={editData.name}
                onChange={handleEditChange}
              />

              <button onClick={handleSaveProfile}>Save</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </>
          ) : (
            <>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {role}</p>

              <button onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            </>
          )}
        </div>
      )}

      {/* USER FEATURES ONLY */}
      {role !== "admin" && (
        <>
          {/* SUBSCRIPTION */}
          <div className="card">
            <h3>Subscription</h3>

            {subscription ? (
              <>
                <p>Status: {subscription.status}</p>
                {subscription.status === "expired" && (
                  <button onClick={() => handleSubscribe("monthly")}>
                    Renew Subscription
                  </button>
                )}
                <p>Plan: {subscription.plan_type}</p>
                <p>Expiry: {subscription.expiry_date}</p>
              </>
            ) : (
              <>
                <p>No active subscription</p>

                <button onClick={() => handleSubscribe("monthly")}>
                  Monthly Plan
                </button>

                <button onClick={() => handleSubscribe("yearly")}>
                  Yearly Plan
                </button>
              </>
            )}
          </div>

          {/* ADD SCORE */}
          <div className="card">
            <h3>Add Score</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="number"
                name="score"
                placeholder="Score (1-45)"
                value={form.score}
                onChange={handleChange}
              />

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />

              <button type="submit">
                {editingScore ? "Update Score" : "Add Score"}
              </button>
            </form>
          </div>

          {/* SCORE LIST */}
          <div className="card">
            <h3>Your Scores</h3>

            {draw?.status === "completed" && (
              <p style={{color: "red"}}>
                Scores are locked after draw
              </p>
            )}

            {scores.length === 0 ? (
              <p>No scores yet</p>
            ) : (
              scores.map((s, i) => (
                <div key={i} className="score-item">
                  Score: {s.score} | Date: {s.date}

                  {/* 🔥 EDIT BUTTON */}
                  <button
                    onClick={() => handleEditScore(s)}
                  >
                    Edit
                  </button>

                  {/* 🔥 DELETE BUTTON */}
                  <button
                    onClick={() => handleDeleteScore(s.id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>

          {/* CHARITY */}
          <div className="card">
            <h3>Select Charity</h3>

            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="">Choose Charity</option>
              {charities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={percentage}
              min="10"
              onChange={(e) => setPercentage(e.target.value)}
            />

            <button onClick={handleCharitySubmit}>
              Save Charity
            </button>
          </div>
        </>
      )}

      {/* DRAW RESULTS */}
      <DrawResult draw={draw} winners={winners} role={role} />

      {/* WINNINGS */}
      <Winnings winners={winners} />

      {/* WINNERS (ADMIN ONLY) */}
      {role === "admin" && (
        <div className="card">
          <h3>Winners</h3>

          {winners.length === 0 ? (
            <p>No winners yet</p>
          ) : (
            winners.map((w, i) => (
              <div key={i}>
                Match: {w.match_count} |
                Prize: ₹{w.prize_amount} |
                Status: {w.status}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 
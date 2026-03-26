import { useEffect, useState } from "react";
import "../styles/Admin.css";
import { getAllUsers, updateUserRole, getAdminStats } from "../services/adminService";
import { runDraw } from "../services/drawService";
import { getCharities, addCharity, deleteCharity } from "../services/charityService";
import { getAllWinners, verifyWinner } from "../services/winnerService";
import { useNavigate } from "react-router-dom";
import { getAllSubscriptions, updateSubscriptionStatus } from "../services/subscriptionService";

const Admin = () => {

  const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

  const [users, setUsers] = useState([]);
  const [charities, setCharities] = useState([]);

  const [charityForm, setCharityForm] = useState({
    name: "",
    description: "",
    image_url: "",
  });

  const [subscriptions, setSubscriptions] = useState([]);
  const [stats, setStats] = useState({});

  const [winners, setWinners] = useState([]); 
  const [drawResult, setDrawResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // 🔐 SECURITY CHECK
  if (role !== "admin") {
    return <h2>Access Denied</h2>;
  }

  // ================= INITIAL LOAD =================
  useEffect(() => {
    fetchAllData();
    fetchCharities();
    fetchSubscriptions();
    fetchStats();
  }, []);

  // ================= FETCH CHARITIES =================
  const fetchCharities = async () => {
    try {
      const data = await getCharities();
      setCharities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Charity fetch error:", err);
    }
  };

  const fetchSubscriptions = async () => {
    const data = await getAllSubscriptions();
    setSubscriptions(Array.isArray(data) ? data : []);
  };

  const fetchStats = async () => {
    const data = await getAdminStats();
    setStats(data || {});
  };

  // ================= DELETE CHARITY =================
  const handleDeleteCharity = async (id) => {
    const confirmDelete = window.confirm("Delete this charity?");
    if (!confirmDelete) return;

    await deleteCharity(id);
    fetchCharities();
  };

  // ================= HANDLE INPUT =================
  const handleCharityChange = (e) => {
    setCharityForm({
      ...charityForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleStatus = async (id, status) => {
    await updateSubscriptionStatus({ id, status });
    fetchSubscriptions();
  };

  // ================= ADD CHARITY =================
  const handleAddCharity = async () => {
    if (!charityForm.name || !charityForm.description) {
      alert("Name and description required");
      return;
    }

    await addCharity(charityForm);

    alert("Charity added successfully");

    setCharityForm({
      name: "",
      description: "",
      image_url: "",
    });

    fetchCharities();
  };



  const fetchAllData = async () => {
    try {
      const usersData = await getAllUsers();

      const winnersData = await getAllWinners();
      setUsers(Array.isArray(usersData) ? usersData : []);
      setWinners(Array.isArray(winnersData) ? winnersData : []);
    } catch (error) {
      console.error("Admin error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= ROLE CHANGE =================
  const handleRoleChange = async (id, role) => {
    await updateUserRole({ user_id: id, role });
    fetchAllData();
  };


  // ================= RUN DRAW =================
  const handleRunDraw = async () => { 
    const result = await runDraw();

    setDrawResult(result);
    alert("Draw completed successfully");

    fetchAllData();
  };

  // ================= VERIFY WINNER =================
  const handleVerify = async (winner_id, status) => { 
    await verifyWinner({ winner_id, status });
    fetchAllData();
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // ================= LOADING =================
  if (loading) {
    return <div className="admin"><p>Loading admin panel...</p></div>;
  }

  // ================= UI =================
  return (
    <div className="admin">

      <h2>👑 Admin Dashboard</h2>

      {/* ===== TOP ACTION ===== */}
      <div className="admin-top">
        <button className="run-btn" onClick={handleRunDraw}>
          🎯 Run Monthly Draw
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="card">
        <h3>📊 Analytics</h3>

        <p>Total Users: {stats.totalUsers}</p>
        <p>Total Winners: {stats.totalWinners}</p>
        <p>Total Subscriptions: {stats.totalSubscriptions}</p>
      </div>

      {/* ===== USER MANAGEMENT ===== */}
      <div className="card">
        <h3>👥 User Management</h3>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Change</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4">No users found</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>

                  <td>
                    <select
                      onChange={(e) =>
                        handleRoleChange(u.id, e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ==== SUBSCRIPTION MANAGEMENT ==== */}
      <div className="card">
        <h3>📊 Subscriptions</h3>

        {subscriptions.length === 0 ? (
          <p>No subscriptions found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Expiry</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {subscriptions.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.plan_type}</td>
                  <td>{s.status}</td>
                  <td>{s.expiry_date}</td>

                  <td>
                    {s.status === "active" ? (
                      <button onClick={() => handleStatus(s.id, "expired")}>
                         Deactivate 
                      </button>
                    ) : (
                     <button onClick={() => handleStatus(s.id, "active")}>
                         Activate 
                     </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      
      {/* ===== CHARITY MANAGEMENT ===== */}
      <div className="card">
        <h3>❤️ Manage Charities</h3>

        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            name="name"
            placeholder="Charity Name"
            value={charityForm.name}
            onChange={handleCharityChange}
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={charityForm.description}
            onChange={handleCharityChange}
          />

          <input
            type="text"
            name="image_url"
            placeholder="Image URL (optional)"
            value={charityForm.image_url}
            onChange={handleCharityChange}
          />

          <button onClick={handleAddCharity}>
            ➕ Add Charity
          </button>
        </div>

        {charities.length === 0 ? (
          <p>No charities found</p>
        ) : (
          charities.map((c) => (
            <div
              key={c.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <span>{c.name}</span>

              <button
                style={{
                  background: "red",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "5px",
                }}
                onClick={() => handleDeleteCharity(c.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>


      {/* ===== DRAW RESULT ===== */}
      {drawResult && (
        <div className="card">
          <h3>🎯 Latest Draw Result</h3>

          <p><strong>Numbers:</strong> {drawResult.drawNumbers?.join(", ")}</p>
          <p><strong>Total Pool:</strong> ₹{drawResult.totalPool}</p>
          <p><strong>Carry Forward:</strong> ₹{drawResult.carryForward}</p>
        </div>
      )}

      {/* ===== WINNER VERIFICATION ===== */}
      <div className="card">
        <h3>🏆 Winner Verification</h3>

        {winners.length === 0 ? (
          <p>No winners yet</p>
        ) : (
          winners.map((w) => (
            <div key={w.id} className="winner-card">
              <p>
                User: {w.user_id} | Match: {w.match_count} | Prize: ₹{w.prize_amount}
              </p>

              <p>Status: {w.status}</p>

              {w.proof && (
                <a
                  href={`${BASE_URL}/uploads/${w.proof}`}
                  target="_blank"
                >
                  📄 View Proof
                </a>
              )}

              <div className="btn-group">
                <button onClick={() => handleVerify(w.id, "approved")}>
                  ✅ Approve
                </button>

                <button onClick={() => handleVerify(w.id, "rejected")}>
                  ❌ Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default Admin;
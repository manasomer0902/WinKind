import { useEffect, useState } from "react";
import "../styles/Admin.css";

import {
  getAllUsers,
  updateUserRole,
  getAdminStats,
} from "../services/adminService";

import { runDraw } from "../services/drawService";

import {
  getCharities,
  addCharity,
  deleteCharity,
} from "../services/charityService";

import {
  getAllWinners,
  verifyWinner,
} from "../services/winnerService";

import {
  getAllSubscriptions,
  updateSubscriptionStatus,
} from "../services/subscriptionService";

import { useNavigate } from "react-router-dom";

const Admin = () => {
  const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

  const [users, setUsers] = useState([]);
  const [charities, setCharities] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [drawResult, setDrawResult] = useState([null]);
  const [stats, setStats] = useState({});
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [charityForm, setCharityForm] = useState({
    name: "",
    description: "",
    image_url: "",
  });

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // 🔐 SECURITY CHECK
  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
    }
  }, [role, navigate]);

  // ================= LOAD =================
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);

      const [
        usersData,
        winnersData,
        charitiesData,
        subsData,
        statsData,
      ] = await Promise.all([
        getAllUsers(),
        getAllWinners(),
        getCharities(),
        getAllSubscriptions(),
        getAdminStats(),
      ]);

      setUsers(Array.isArray(usersData) ? usersData : usersData?.data || []);
      setWinners(Array.isArray(winnersData) ? winnersData : winnersData?.data || []);
      setCharities(Array.isArray(charitiesData) ? charitiesData : charitiesData?.data || []);
      setSubscriptions(Array.isArray(subsData) ? subsData : subsData?.data || []);
      setStats(statsData || {});
    } catch (error) {
      console.error("Admin error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= HANDLERS =================

  const handleRoleChange = async (id,role) => {
    if (!role) return;
    const res = await updateUserRole(id, role);

    if (res) {
      alert("User role updated. User needs to re-login to see changes.");
    }
    loadAll();
  };

  const handleStatus = async (id, status) => {
    await updateSubscriptionStatus(id, status);
    loadAll();
  };

  const handleVerify = async (id, status) => {
    await verifyWinner(id, status);
    loadAll();
  };

  const handleRunDraw = async () => {
    if (!window.confirm("Run draw now?")) return;

    const res = await runDraw();

    if (res?.message) {
      alert(res.message);
    }

    setDrawResult(res);

    loadAll();
  };

  const handleDeleteCharity = async (id) => {
    if (!window.confirm("Delete this charity?")) return;

    await deleteCharity(id);
    loadAll();
  };

  const handleAddCharity = async () => {
    if (!charityForm.name || !charityForm.description) {
      return alert("Name & description required");
    }

    await addCharity(charityForm);

    setCharityForm({
      name: "",
      description: "",
      image_url: "",
    });

    loadAll();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ================= UI =================

  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin">
      <h2>👑 Admin Dashboard</h2>

      <div className="admin-top">
        <button className="run-btn" onClick={handleRunDraw}>🎯 Run Draw</button>
      </div>

      {/* DRAW RESULT */}
      {drawResult && 
        <div className="card">
          <h3>Last Draw Result</h3>
          <p><strong>Numbers:</strong> {drawResult.drawNumbers?.join(", ")}</p>
          <p><strong>Total Users:</strong> {drawResult.totalUsers}</p>
          <p><strong>Pool:</strong> ₹{drawResult.totalPool}</p>
        </div>
        }

      {/* ================= STATS ================= */}
      <div className="card">
        <h3>Stats</h3>
        <p>Users: {stats.totalUsers || 0}</p>
        <p>Winners: {stats.totalWinners || 0}</p>
        <p>Subscriptions: {stats.totalSubscriptions || 0}</p>
      </div>

      {/* ================= USERS ================= */}
      <div className="card">
        <h3>Users</h3>

        {users.map((u) => (
          <div key={u.id}>
            {u.name} - {u.email} ({u.role})

            <select
              value={u.role}
              onChange={(e) => {
                if (e.target.value !== u.role) {
                  handleRoleChange(u.id, e.target.value)
                }
              }}    
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        ))}
      </div>

      {/* ================= SUBSCRIPTIONS ================= */}
      <div className="card">
        <h3>Subscriptions</h3>

        {subscriptions.map((s) => (
          <div key={s.id}>
            {s.name} - {s.plan_type} - {s.status} -{" "}
            {new Date(s.expiry_date).toLocaleDateString()}

              <button onClick={() => {
                const newStatus = 
                  s.status === "active" ? "expired" : "active";

                  handleStatus(s.id, newStatus);
                }}
              >
              {s.status === "active" ? "Deactivate" : "Activate"}
            </button>
          </div>
        ))}
      </div>

      {/* ================= CHARITIES ================= */}
      <div className="card">
        <h3>Charities</h3>

        <input
          placeholder="Name"
          value={charityForm.name}
          onChange={(e) =>
            setCharityForm({ ...charityForm, name: e.target.value })
          }
        />

        <input
          placeholder="Description"
          value={charityForm.description}
          onChange={(e) =>
            setCharityForm({
              ...charityForm,
              description: e.target.value,
            })
          }
        />

        <button onClick={handleAddCharity}>Add</button>

        {charities.map((c) => (
          <div key={c.id}>
            {c.name}
            <button onClick={() => handleDeleteCharity(c.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* ================= WINNERS ================= */}
      <div className="card">
        <h3>Winners</h3>

        {winners.map((w) => (
          <div key={w.id} className="winner-card">
            <p>
              {w.name || "user"} - ₹{w.prize_amount}
            </p>
            <p>Status : {w.status}</p>

            {w.proof ? (
              <a
                href={`${BASE_URL}/uploads/${w.proof}`}
                target="_blank"
                rel="noreferrer"
              >
                View Proof
              </a>
            ) : (
              <p>No Proof uploaded</p>  
            )}
            
            <div className="btn-group">
            <button 
              disabled={w.status !== "pending"}
              onClick={() => handleVerify(w.id, "approved")}
            >
              Approve
            </button>

            <button 
              disabled={w.status !== "pending"}
              onClick={() => handleVerify(w.id, "rejected")}
            >
              Reject
            </button>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
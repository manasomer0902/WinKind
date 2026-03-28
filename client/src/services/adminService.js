const BASE = import.meta.env.VITE_API_URL + "/api";
const API = BASE + "/admin";

/*
  Get all users
*/
export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/users`, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    });

    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];

  } catch (error) {
    console.error("getAllUsers error:", error);
    return [];
  }
};

/*
  Update user role
*/
export const updateUserRole = async (id, role) => {
  try {
    const token = localStorage.getItem("token");

      const res = await fetch(`${API}/users/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error (data.message || "Failed to update role");
    }
    return data;
  } catch (error) {
    console.error("updateUserRole error:", error);
    return null;
  }
};

/*
  Get admin stats
*/
export const getAdminStats = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/stats`, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    });

    return await res.json();

  } catch (error) {
    console.error("getAdminStats error:", error);
    return null;
  }
};
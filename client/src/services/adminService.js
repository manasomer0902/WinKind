/*
  Admin Service
  -------------
  Handles:
  - Fetching all users
  - Updating user roles

  Used in Admin Panel
*/

const API = import.meta.env.VITE_API_URL + "/admin";

/*
  Get all users
  - Admin only
  - Returns list of users for management
*/
export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await res.json();

    // Ensure array safety
    return Array.isArray(data) ? data : [];

  } catch (error) {
    console.error("getAllUsers error:", error);
    return []; // prevent UI crash
  }
};

/*
  Update user role
  - Admin action
  - Promotes/demotes user
*/
export const updateUserRole = async (data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to update role");
    }

    return await res.json();

  } catch (error) {
    console.error("updateUserRole error:", error);
    alert(error.message);
    return null;
  }
};


export const getAdminStats = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/admin/stats`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.json();
};
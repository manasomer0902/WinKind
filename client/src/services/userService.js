const BASE = import.meta.env.VITE_API_URL + "/api";
const API = BASE + "/user";

/*
  Get user profile
*/
export const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/me`, {   
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    });

    if (!res.ok) {
      throw new Error("Failed to fetch profile");
    }

    return await res.json();

  } catch (error) {
    console.error("getProfile error:", error);
    return null;
  }
};

/*
  Update user profile
*/
export const updateProfile = async (data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/me`, {   
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,  
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to update profile");
    }

    return await res.json();

  } catch (error) {
    console.error("updateProfile error:", error);
    return null;
  }
};
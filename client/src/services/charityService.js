const BASE = import.meta.env.VITE_API_URL + "/api";
const API = BASE + "/charity";

/*
  Get all charities
*/
export const getCharities = async () => {
  try {
    const res = await fetch(`${API}`);  

    if (!res.ok) {
      throw new Error("Failed to fetch charities");
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];

  } catch (error) {
    console.error("getCharities error:", error);
    return [];
  }
};

/*
  Select charity
*/
export const selectCharity = async (data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/select`, {   
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,        
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to select charity");
    }

    return await res.json();

  } catch (error) {
    console.error("selectCharity error:", error);
    alert(error.message);
    return null;
  }
};

/*
  Get user's selected charity
*/
export const getUserCharity = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/my`, {   
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    });

    return await res.json();

  } catch (error) {
    console.error("getUserCharity error:", error);
    return null;
  }
};

/*
  Admin: Add charity
*/
export const addCharity = async (data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return await res.json();

  } catch (error) {
    console.error("addCharity error:", error);
    throw error;
  }
};

/*
  Admin: Delete charity
*/
export const deleteCharity = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.json();

  } catch (error) {
    console.error("deleteCharity error:", error);
    throw error;
  }
};
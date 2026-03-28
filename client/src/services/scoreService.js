const BASE = import.meta.env.VITE_API_URL + "/api";
const API = BASE + "/score";

/*
  Add score
*/
export const addScore = async (data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}`, {   
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to add score");
    }

    return result;

  } catch (error) {
    console.error("addScore error:", error);
    alert(error.message);
    return null;
  }
};

/*
  Get scores
*/
export const getScores = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}`, {  
      headers: token
        ? { Authorization: `Bearer ${token}` }  
        : {},
    });

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? data : [];

  } catch (error) {
    console.error("getScores error:", error);
    return [];
  }
};

/*
  Update score
*/
export const updateScore = async (id, data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return await res.json();

  } catch (error) {
    console.error("updateScore error:", error);
    throw error;
  }
};

/*
  Delete score
*/
export const deleteScore = async (id) => {
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
    console.error("deleteScore error:", error);
    throw error;
  }
};
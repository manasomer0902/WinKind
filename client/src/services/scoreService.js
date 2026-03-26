/*
  Score Service
  -------------
  Handles:
  - Adding a new score
  - Fetching user scores

  NOTE:
  - Backend enforces 5-score limit (FIFO logic)
  - Frontend just displays data
*/

const API = import.meta.env.VITE_API_URL + "/score";

/*
  Add score
  - Requires active subscription
  - Sends score + date to backend
*/
export const addScore = async (data) => {
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

    const result = await res.json();

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to add score");
    }


  } catch (error) {
    console.error("addScore error:", error);
    alert(error.message); // user feedback
    return null;
  }
};

/*
  Get scores
  - Fetches latest scores (max 5)
  - Should NOT break UI even if subscription expired
*/
export const getScores = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/get-scores`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // If subscription issue → return empty instead of crash
    if (!res.ok) {
      console.warn("getScores failed:", res.status);
      return [];
    }

    const data = await res.json();

    // Ensure array (prevent .map crash)
    return Array.isArray(data) ? data : [];
    
  } catch (error) {
    console.error("getScores error:", error);
    return [];
  }
};

export const updateScore = async (id, data) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/score/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  return await res.json();
};

export const deleteScore = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/score/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await res.json();
};
const BASE = import.meta.env.VITE_API_URL + "/api";
const API = BASE + "/draw";
const WINNER_API = BASE + "/winner";

/*
  Get latest draw result
*/
export const getLatestDraw = async () => {
  try {
    const res = await fetch(`${API}/latest`, {  
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch latest draw");
    }

    return await res.json();
  } catch (error) {
    console.error("getLatestDraw error:", error);
    return null;
  }
};

/*
  Get winners list
*/
export const getWinners = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${WINNER_API}`, {   
      headers: token
        ? { Authorization: `Bearer ${token}` }   
        : {},
    });

    if (!res.ok) {
      throw new Error("Failed to fetch winners");
    }

    return await res.json();

  } catch (error) {
    console.error("getWinners error:", error);
    return [];
  }
};

/*
  Run draw (Admin only)
*/
export const runDraw = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}`, {   
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to run draw");
    }

    return data;
  } catch (error) {
    console.error("runDraw error:", error);
    return null;
  }
};

/*
  Simulate draw (Admin only)
*/
export const simulateDraw = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/simulate`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to simulate draw");
    }

    return await res.json();

  } catch (error) {
    console.error("simulateDraw error:", error);
    return null;
  }
};
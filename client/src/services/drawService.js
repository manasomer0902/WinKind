/*
  Draw Service
  ------------
  Handles all API calls related to:
  - Latest draw
  - Winners
  - Admin draw execution

  Uses environment variable for API base URL
*/

const API = import.meta.env.VITE_API_URL + "/draw";

/*
  Get latest draw result
  - Public endpoint (no token required)
*/
export const getLatestDraw = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/latest`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
  - Requires authentication
*/
export const getWinners = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/winner`, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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
  - Protected route
  - Generates numbers + calculates winners
*/
export const runDraw = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/run`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to run draw");
    }

    return await res.json();
  } catch (error) {
    console.error("runDraw error:", error);
    return null;
  }
};
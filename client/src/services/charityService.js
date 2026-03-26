/*
  Charity Service
  ---------------
  Handles:
  - Fetching all charities
  - Selecting a charity for user

  This feature connects gameplay with social impact (PRD core idea)
*/

const API = import.meta.env.VITE_API_URL + "/charity";

/*
  Get all charities
  - Public endpoint
  - Used in dashboard dropdown
*/
export const getCharities = async () => {
  try {
    const res = await fetch(`${API}`);

    if (!res.ok) {
      throw new Error("Failed to fetch charities");
    }

    const data = await res.json();

    // Ensure safe array
    return Array.isArray(data) ? data : [];

  } catch (error) {
    console.error("getCharities error:", error);
    return []; // prevent UI crash
  }
};

/*
  Select charity
  - Saves user's preferred charity + contribution %
  - Requires authentication
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

export const addCharity = async (data) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/charity/add`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  return res.json();
};

export const deleteCharity = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/charity/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.json();
};
/*
  User Service
  ------------
  Handles:
  - Fetching logged-in user profile

  Used in Dashboard
*/

const API = import.meta.env.VITE_API_URL + "/user";

/*
  Get user profile
  - Requires authentication
  - Returns user details (name, email, role, etc.)
*/
export const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch profile");
    }

    return await res.json();

  } catch (error) {
    console.error("getProfile error:", error);
    return null; // prevent UI crash
  }
};

export const updateProfile = async (data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/user/profile`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to update profile");
    }

    return await res.json();
  } catch (error) {
    console.error("updateProfile error:", error);
    return null;
  }
};
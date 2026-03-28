const API = import.meta.env.VITE_API_URL + "/api/auth";

/*
  Register User
*/
export const registerUser = async (data) => {
  try {
    const res = await fetch(`${API}/register`, {   
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Registration failed"); 
    }

    return result;

  } catch (error) {
    console.error("registerUser error:", error);
    return null;
  }
};

/*
  Login User
*/
export const loginUser = async (data) => {
  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Login failed"); 
    }

    // Save auth data
    localStorage.setItem("token", result.token);
    localStorage.setItem("role", result.user.role);
    window.dispatchEvent(new Event("storage"));

    return result;

  } catch (error) {
    console.error("loginUser error:", error);
    return null;
  }
};
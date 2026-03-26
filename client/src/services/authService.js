/*
  Auth Service
  ------------
  Handles:
  - User registration
  - User login

  Returns:
  - token + user (including role)
*/

const API = import.meta.env.VITE_API_URL + "/auth";

/*
  Register User
  - Creates new account
  - Default role: user (handled in backend)
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

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Registration failed");
    }

    return await res.json();

  } catch (error) {
    console.error("registerUser error:", error);
    alert(error.message);
    return null;
  }
};

/*
  Login User
  - Authenticates user
  - Returns token + user role
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

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Login failed");
    }

    const result = await res.json();

    /*
      IMPORTANT:
      Store auth data here OR in component (both valid)
      We keep it here for cleaner architecture
    */
    localStorage.setItem("token", result.token);
    localStorage.setItem("role", result.user.role);

    return result;

  } catch (error) {
    console.error("loginUser error:", error);
    alert(error.message);
    return null;
  }
};
const BASE = import.meta.env.VITE_API_URL + "/api";
const API = BASE + "/winner";

/*
  Get my winnings
*/
export const getMyWinnings = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/me`, {   
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    });

    return await res.json();

  } catch (error) {
    console.error("getMyWinnings error:", error);
    return [];
  }
};

/*
  Get all winners (admin)
*/
export const getAllWinners = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}`, {   
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    });

    if (!res.ok) {
      throw new Error("Failed to fetch winners");
    }

    return await res.json();

  } catch (error) {
    console.error("getAllWinners error:", error);
    return [];
  }
};

/*
  Verify winner (admin)
*/
export const verifyWinner = async (id, status) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/${id}`, {   
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,       
      },
      body: JSON.stringify({ status }),         
    });

    return await res.json();

  } catch (error) {
    console.error("verifyWinner error:", error);
  }
};

/*
  Upload proof
*/
export const uploadProof = async (id, file) => {
  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("proof", file);

    const res = await fetch(`${API}/${id}/proof`, {  
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,            
      },
      body: formData,
    });

    return await res.json();

  } catch (error) {
    console.error("uploadProof error:", error);
    return null;
  }
};
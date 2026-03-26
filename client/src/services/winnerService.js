/*
  Winner Service
  --------------
  Handles:
  - Fetching all winners (admin)
  - Verifying winners (approve/reject)

  Used in Admin Panel
*/

const API = import.meta.env.VITE_API_URL + "/winner";

export const getMyWinnings = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
};

/*
  Get all winners
  - Admin only
  - Returns list of winners for verification
*/
export const getAllWinners = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch winners");
    }

    return await res.json();
  } catch (error) {
    console.error("getAllWinners error:", error);
    return []; // prevent UI crash
  }
};

/*
  Verify winner (approve/reject)
  - Admin action
  - Updates winner status
*/
export const verifyWinner = async (data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/verify`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to verify winner");
    }

    return await res.json();
  } catch (error) {
    console.error("verifyWinner error:", error);
    return null;
  }
};

export const uploadProof = async (id, file) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("proof", file);

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/winner/upload/${id}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  return await res.json();
};
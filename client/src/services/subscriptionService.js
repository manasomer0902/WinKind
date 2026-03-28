const BASE = import.meta.env.VITE_API_URL + "/api";
const API = BASE + "/subscription";

/*
  Create Order (Razorpay)
*/
export const createOrder = async (data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return await res.json();

  } catch (error) {
    console.error("createOrder error:", error);
    throw error;
  }
};

/*
  Verify Payment
*/
export const verifyPayment = async (data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/verify-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return await res.json();

  } catch (error) {
    console.error("verifyPayment error:", error);
    throw error;
  }
};

/*
  Get Current Subscription
*/
export const getSubscription = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/my`, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    });

    if (!res.ok) return null;

    return await res.json();

  } catch (error) {
    console.error("getSubscription error:", error);
    return null;
  }
};

/*
  Cancel Subscription
*/
export const cancelSubscription = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}`, {   
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.json();

  } catch (error) {
    console.error("cancelSubscription error:", error);
    throw error;
  }
};

/*
  Admin: Get All Subscriptions
*/
export const getAllSubscriptions = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.json();

  } catch (error) {
    console.error("getAllSubscriptions error:", error);
    throw error;
  }
};

/*
  Admin: Update Subscription Status
*/
export const updateSubscriptionStatus = async (id, status) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const res = await fetch(`${API}/${id}`, {   
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),         
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Failed to update");
    }

    return await res.json();

  } catch (error) {
    console.error("updateSubscriptionStatus error:", error);
    throw error;
  }
};
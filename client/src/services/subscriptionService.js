/*
  Subscription Service
  --------------------
  Handles:
  - Creating a subscription (monthly/yearly)
  - Fetching current user subscription

  NOTE:
  - Controls access to core features (scores, draw participation)
*/

const API = import.meta.env.VITE_API_URL + "/subscription";

export const createSubscription = async (payload) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload), // ✅ FIX HERE
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Subscription failed");
    }

    return result;

  } catch (error) {
    console.error("createSubscription error:", error);
    throw error;
  }
};

/*
  Get subscription details
  - Returns current subscription info
  - Used in dashboard
*/
export const getSubscription = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.warn("No subscription found");
      return null; // user has no subscription
    }

    return await res.json();
  } catch (error) {
    console.error("getSubscription error:", error);
    return null;
  }
};

export const getAllSubscriptions = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/subscription/all`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.json();
};

export const updateSubscriptionStatus = async (data) => {
  const token = localStorage.getItem("token");

  await fetch(
    `${import.meta.env.VITE_API_URL}/subscription/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
};

export const createOrder = async (data) => {
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
};

export const verifyPayment = async (data) => {
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
};
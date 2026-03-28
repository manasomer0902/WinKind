import Razorpay from "razorpay";

/*
  Razorpay Config (Production Ready)
  ---------------------------------
  - Uses env variables
  - Includes safety checks
*/

// ❌ Safety check
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay keys are missing ❌");
}

// ✅ Create instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Debug log (only in dev)
if (process.env.NODE_ENV !== "production") {
  console.log("Razorpay initialized ✅");
}

export default razorpay;
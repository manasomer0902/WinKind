import { Resend } from "resend";

/*
  Email Service (Production Ready)
  -------------------------------
  - Env validation
  - Returns status
  - Safer sending
*/

// ❌ Safety check
if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is missing ❌");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || "WinKind <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    console.log("✅ Email sent to", to);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error("❌ Email error:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};
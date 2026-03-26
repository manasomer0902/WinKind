/*
  Email Templates
  ---------------
  Used for:
  - Welcome email
  - Winner notification
  - Draw result notification

  Each template returns:
  - subject
  - text (for basic email clients)
  - html (for rich email)
*/

// ================= WELCOME =================
export const welcomeEmail = (name) => {
  return {
    subject: "Welcome to WinKind 🎉",
    text: `Hello ${name}, welcome to WinKind!`,
    html: `
      <h2>Welcome to WinKind 🎉</h2>
      <p>Hello <b>${name}</b>,</p>
      <p>We're excited to have you on board.</p>
      <p>Start adding your scores and win rewards while supporting a cause!</p>
    `,
  };
};

// ================= WINNER =================
export const winnerEmail = (amount) => {
  return {
    subject: "You are a Winner! 🏆",
    text: `Congratulations! You won ₹${amount}`,
    html: `
      <h2>Congratulations! 🏆</h2>
      <p>You have won <b>₹${amount}</b> in the latest draw.</p>
      <p>Please upload your proof to claim your reward.</p>
    `,
  };
};

// ================= DRAW RESULT =================
export const drawResultEmail = () => {
  return {
    subject: "New Draw Results Are Out 🎯",
    text: "Check the latest draw results now!",
    html: `
      <h2>New Draw Results 🎯</h2>
      <p>The latest draw results are now available.</p>
      <p>Login to your dashboard to check if you are a winner!</p>
    `,
  };
};
/*
  Email Templates (Premium Version)
  --------------------------------
  - Styled HTML
  - Better UX
  - Safe fallbacks
*/

const baseStyle = `
  style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;"
`;

const buttonStyle = `
  display:inline-block;
  padding:10px 20px;
  background:#000;
  color:#fff;
  text-decoration:none;
  border-radius:6px;
  margin-top:15px;
`;

// ================= WELCOME =================
export const welcomeEmail = (name = "User") => ({
  subject: "Welcome to WinKind 🎉",
  text: `Hello ${name}, welcome to WinKind!`,
  html: `
    <div ${baseStyle}>
      <h2>Welcome to WinKind 🎉</h2>
      <p>Hello <b>${name}</b>,</p>
      <p>We're excited to have you on board.</p>
      <p>Start adding your scores and win rewards while supporting a cause.</p>

      <a href="#" style="${buttonStyle}">Go to Dashboard</a>
    </div>
  `,
});

// ================= WINNER =================
export const winnerEmail = (amount = 0) => ({
  subject: "You are a Winner! 🏆",
  text: `Congratulations! You won ₹${amount}`,
  html: `
    <div ${baseStyle}>
      <h2>Congratulations! 🏆</h2>
      <p>You have won <b>₹${amount}</b> in the latest draw.</p>
      <p>Please upload your proof to claim your reward.</p>

      <a href="#" style="${buttonStyle}">Claim Reward</a>
    </div>
  `,
});

// ================= DRAW RESULT =================
export const drawResultEmail = () => ({
  subject: "New Draw Results Are Out 🎯",
  text: "Check the latest draw results now!",
  html: `
    <div ${baseStyle}>
      <h2>New Draw Results 🎯</h2>
      <p>The latest draw results are now available.</p>
      <p>Login to your dashboard to check if you are a winner.</p>

      <a href="#" style="${buttonStyle}">View Results</a>
    </div>
  `,
});
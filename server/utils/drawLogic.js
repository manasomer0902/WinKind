/*
  Draw Logic Utility (Production Ready)
  ------------------------------------
  - Unique draw numbers
  - Safe match counting
  - Input validation
*/

// ================= GENERATE DRAW =================
export const generateDrawNumbers = () => {
  const numbers = new Set();

  while (numbers.size < 5) {
    const num = Math.floor(Math.random() * 45) + 1;
    numbers.add(num);
  }

  return Array.from(numbers).sort((a, b) => a - b);
};

// ================= COUNT MATCHES =================
export const countMatches = (userScores, drawNumbers) => {
  // ❌ Safety checks
  if (!Array.isArray(userScores) || !Array.isArray(drawNumbers)) {
    throw new Error("Invalid input: scores must be arrays");
  }

  // ✅ Enforce max 5 scores
  const validUserScores = userScores
    .filter(score => Number.isInteger(score) && score >= 1 && score <= 45)
    .slice(0, 5);

  // ✅ Remove duplicates from user scores
  const userSet = new Set(validUserScores);

  const drawSet = new Set(drawNumbers);

  let count = 0;

  userSet.forEach(score => {
    if (drawSet.has(score)) {
      count++;
    }
  });

  return count;
};
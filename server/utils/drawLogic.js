/*
  Draw Logic Utility
  ------------------
  Handles:
  - Generating unique draw numbers
  - Counting matches between user scores and draw numbers
*/

// ================= GENERATE DRAW =================
export const generateDrawNumbers = () => {
  const numbers = new Set();

  while (numbers.size < 5) {
    const num = Math.floor(Math.random() * 45) + 1;
    numbers.add(num);
  }

  // 🟢 Sort numbers for consistency (UI friendly)
  return Array.from(numbers).sort((a, b) => a - b);
};

// ================= COUNT MATCHES =================
export const countMatches = (userScores, drawNumbers) => {
  let count = 0;

  // 🟢 Convert draw numbers to Set (faster lookup)
  const drawSet = new Set(drawNumbers);

  userScores.forEach(score => {
    if (drawSet.has(score)) {
      count++;
    }
  });

  return count;
};
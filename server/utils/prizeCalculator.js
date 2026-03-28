/*
  Prize Calculator (Production Ready)
  ----------------------------------
  - Correct distribution
  - Safe validation
  - Currency rounding
  - Jackpot carry-forward support
*/

export const calculatePrize = (
  totalPool,
  winners = { five: 0, four: 0, three: 0 },
  previousCarry = 0
) => {
  // ❌ Validation
  if (!totalPool || totalPool <= 0) {
    return {
      five: 0,
      four: 0,
      three: 0,
      carryForward: previousCarry || 0,
    };
  }

  // ✅ Include previous jackpot
  const totalWithCarry = totalPool + previousCarry;

  // 🟡 Pool split
  const fivePool = totalWithCarry * 0.4;
  const fourPool = totalWithCarry * 0.35;
  const threePool = totalWithCarry * 0.25;

  let carryForward = 0;

  // 🔥 Jackpot logic
  if (winners?.five === 0) {
    carryForward = Math.round(fivePool);
  }

  // ✅ Helper for safe division + rounding
  const safeDivide = (pool, count) => {
    if (!count || count <= 0) return 0;
    return Math.round(pool / count);
  };

  return {
    five: winners?.five > 0 ? safeDivide(fivePool, winners.five) : 0,
    four: winners?.four > 0 ? safeDivide(fourPool, winners.four) : 0,
    three: winners?.three > 0 ? safeDivide(threePool, winners.three) : 0,
    carryForward,
  };
};
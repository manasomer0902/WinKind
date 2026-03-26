/*
  Prize Calculator
  ----------------
  Handles:
  - Prize distribution
  - Jackpot carry-forward
*/

export const calculatePrize = (totalPool, winners) => {
  // 🔴 Validation
  if (!totalPool || totalPool <= 0) {
    return {
      five: 0,
      four: 0,
      three: 0,
      carryForward: 0,
    };
  }

  // 🟡 Pool split
  const fivePool = totalPool * 0.4;
  const fourPool = totalPool * 0.35;
  const threePool = totalPool * 0.25;

  let carryForward = 0;

  // 🔥 Jackpot logic
  if (winners.five === 0) {
    carryForward = fivePool;
  }

  return {
    five: winners.five > 0 ? fivePool / winners.five : 0,
    four: winners.four > 0 ? fourPool / winners.four : 0,
    three: winners.three > 0 ? threePool / winners.three : 0,
    carryForward,
  };
};
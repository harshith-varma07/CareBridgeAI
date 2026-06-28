export const calculateRisk = ({ painLevel, fever, redness, discharge, infectionProbability }) => {
  if (fever || discharge || painLevel >= 8 || infectionProbability >= 0.8) {
    return 'RED';
  }
  if ((painLevel >= 5 && painLevel <= 7) || redness || infectionProbability >= 0.5) {
    return 'YELLOW';
  }
  return 'GREEN';
};

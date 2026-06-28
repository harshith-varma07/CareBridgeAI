import axios from 'axios';
import { calculateRisk } from '../utils/riskEngine.js';

const fallbackAnalyze = (payload) => {
  const infectionProbability = Number((payload.painLevel / 10).toFixed(2));
  const rednessScore = payload.redness ? 0.7 : 0.2;
  const trend = payload.painLevel >= 6 || payload.fever ? 'Increasing' : 'Stable';
  const risk = calculateRisk({ ...payload, infectionProbability });
  const confidence = 0.7;
  const explanation = `Risk ${risk}: pain=${payload.painLevel}, fever=${payload.fever}, redness=${payload.redness}, discharge=${payload.discharge}, imageScore=${infectionProbability}.`;

  return { infectionProbability, rednessScore, trend, risk, confidence, explanation };
};

export const analyzeWithAiService = async (payload) => {
  const aiUrl = process.env.AI_SERVICE_URL;
  if (!aiUrl) {
    return fallbackAnalyze(payload);
  }

  try {
    const response = await axios.post(`${aiUrl}/ai/analyze`, payload, { timeout: 12000 });
    return response.data;
  } catch {
    return fallbackAnalyze(payload);
  }
};

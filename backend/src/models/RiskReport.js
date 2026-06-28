import mongoose from 'mongoose';

const riskReportSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    dailyResponseId: { type: mongoose.Schema.Types.ObjectId, ref: 'DailyResponse', required: true },
    infectionProbability: { type: Number, required: true },
    rednessScore: { type: Number, required: true },
    trend: { type: String, enum: ['Improving', 'Stable', 'Increasing'], required: true },
    risk: { type: String, enum: ['GREEN', 'YELLOW', 'RED'], required: true },
    confidence: { type: Number, required: true },
    explanation: { type: String, required: true }
  },
  { timestamps: true }
);

export const RiskReport = mongoose.model('RiskReport', riskReportSchema);

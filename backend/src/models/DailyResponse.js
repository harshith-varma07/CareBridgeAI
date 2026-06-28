import mongoose from 'mongoose';

const dailyResponseSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    painLevel: { type: Number, required: true, min: 0, max: 10 },
    fever: { type: Boolean, required: true },
    redness: { type: Boolean, required: true },
    discharge: { type: Boolean, required: true },
    imageUrl: { type: String },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const DailyResponse = mongoose.model('DailyResponse', dailyResponseSchema);

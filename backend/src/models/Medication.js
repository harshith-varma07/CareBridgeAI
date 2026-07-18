import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    name: { type: String, required: true, trim: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    times: [{ type: String }],
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    instructions: { type: String, default: '' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Medication = mongoose.model('Medication', medicationSchema);

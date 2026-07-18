import mongoose from 'mongoose';

const medicationLogSchema = new mongoose.Schema(
  {
    medicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true, index: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    scheduledTime: { type: String, required: true },
    takenAt: { type: Date },
    skipped: { type: Boolean, default: false },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const MedicationLog = mongoose.model('MedicationLog', medicationLogSchema);

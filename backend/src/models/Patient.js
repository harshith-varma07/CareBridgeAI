import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    age: { type: Number, required: true, min: 0 },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    surgeryType: { type: String, required: true, trim: true },
    surgeryDate: { type: Date, required: true },
    expectedRecoveryDuration: { type: Number, required: true, min: 1 },
    medicalNotes: { type: String, default: '' }
  },
  { timestamps: true }
);

export const Patient = mongoose.model('Patient', patientSchema);

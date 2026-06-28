import mongoose from 'mongoose';

const clinicalNoteSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    note: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export const ClinicalNote = mongoose.model('ClinicalNote', clinicalNoteSchema);

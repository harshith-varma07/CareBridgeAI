import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['PATIENT', 'DOCTOR', 'ADMIN'], required: true },
    hospitalId: { type: String, trim: true }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);

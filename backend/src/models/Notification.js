import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['DAILY_REMINDER', 'HIGH_RISK_ALERT', 'DOCTOR_NOTIFICATION', 'CRITICAL_PATIENT_NOTIFICATION'], required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);
